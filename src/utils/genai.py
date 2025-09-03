# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Generic client for interacting with Google's Gemini models via Vertex AI.
"""
import os
from typing import Optional
import logging

import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig
from tenacity import retry, wait_exponential, stop_after_attempt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
DEFAULT_MAX_TOKENS = int(os.environ.get("DEFAULT_MAX_TOKENS", 2048))


class GeminiClient:
    """A client for interacting with the Vertex AI Gemini API."""

    def __init__(self, project_id: Optional[str] = None,
                 location: Optional[str] = None,
                 model_name: str = "gemini-2.5-flash"):
        """
        Initializes the Gemini client and the Vertex AI environment.

        Args:
            project_id: The Google Cloud project ID. If None, it will try to use the
                        VERTEX_AI_PROJECT environment variable.
            location: The Google Cloud region. If None, it will try to use the
                      VERTEX_AI_LOCATION environment variable.
            model_name: The name of the Gemini model to use.
        """
        self.project_id = project_id or os.environ.get("VERTEX_AI_PROJECT")
        self.location = location or os.environ.get("VERTEX_AI_LOCATION")
        self.model_name = model_name

        if not self.project_id or not self.location:
            raise ValueError("Project ID and location must be provided or set as environment variables.")

        vertexai.init(project=self.project_id, location=self.location)
        
        self.model = GenerativeModel(self.model_name)

    def count_tokens(self, text: str) -> int:
        """
        Count the number of tokens in the provided text.

        Args:
            text: The text to count tokens for.

        Returns:
            The number of tokens in the text.

        Raises:
            ValueError: If text is None or empty.
            Exception: If token counting fails.
        """
        if not text:
            logger.warning("Empty or None text provided for token counting")
            return 0
            
        try:
            # Use Vertex AI's built-in token counting
            response = self.model.count_tokens(text)
            token_count = response.total_tokens
            logger.debug(f"Token count for text (length {len(text)}): {token_count}")
            return token_count
        except Exception as e:
            logger.error(f"Failed to count tokens: {e}")
            # Fallback to rough estimation: ~4 characters per token
            estimated_tokens = len(text) // 4
            logger.warning(f"Using estimated token count: {estimated_tokens}")
            return estimated_tokens

    def truncate_to_max_tokens(self, text: str, max_tokens: int = DEFAULT_MAX_TOKENS) -> str:
        """
        Truncate text to fit within the specified token limit.

        Args:
            text: The text to truncate.
            max_tokens: The maximum number of tokens allowed.

        Returns:
            The truncated text that fits within the token limit.
        """
        if not text:
            return text
            
        current_tokens = self.count_tokens(text)
        
        if current_tokens <= max_tokens:
            logger.debug(f"Text is within token limit ({current_tokens}/{max_tokens})")
            return text
            
        logger.info(f"Text exceeds token limit ({current_tokens}/{max_tokens}), truncating...")
        
        # Binary search to find the optimal truncation point
        left, right = 0, len(text)
        best_text = ""
        
        while left <= right:
            mid = (left + right) // 2
            truncated_text = text[:mid]
            
            if not truncated_text:
                left = mid + 1
                continue
                
            tokens = self.count_tokens(truncated_text)
            
            if tokens <= max_tokens:
                best_text = truncated_text
                left = mid + 1
            else:
                right = mid - 1
        
        final_tokens = self.count_tokens(best_text)
        logger.info(f"Text truncated from {current_tokens} to {final_tokens} tokens")
        return best_text

    @retry(wait=wait_exponential(multiplier=3, min=4, max=30), stop=stop_after_attempt(3))
    def summarize_text(self, text_to_summarize: str,
                       prompt: str,
                       temperature: float = 0.2,
                       max_output_tokens: int = 2048) -> str:
        """
        Generates a summary of the provided text using a given prompt.

        Args:
            text_to_summarize: The text content to be summarized.
            prompt: The instructional prompt to guide the summarization.
            temperature: The temperature for the generation.
            max_output_tokens: The maximum number of tokens for the output.

        Returns:
            The summarized text as a string.

        Raises:
            Exception: If the generation fails or response is blocked.
        """
        if not text_to_summarize:
            logger.warning("Empty text provided for summarization")
            return ""
            
        # Count input tokens for logging
        input_tokens = self.count_tokens(text_to_summarize)
        prompt_tokens = self.count_tokens(prompt)
        total_input_tokens = input_tokens + prompt_tokens
        
        logger.info(f"Starting summarization - Input tokens: {input_tokens}, Prompt tokens: {prompt_tokens}, Total: {total_input_tokens}")
        
        full_prompt = f"{prompt}\n\n--- TEXT TO SUMMARIZE ---\n{text_to_summarize}"

        generation_config = GenerationConfig(
            temperature=temperature,
            max_output_tokens=max_output_tokens,
        )

        try:
            response = self.model.generate_content(full_prompt, generation_config=generation_config)
            
            # Check if we have candidates and a valid response
            if not response.candidates:
                logger.error("No candidates returned in response")
                raise Exception("No candidates returned from the model")
            
            candidate = response.candidates[0]
            finish_reason = candidate.finish_reason
            
            # Log finish reason for debugging
            logger.info(f"Generation finished with reason: {finish_reason.name}")
            
            # Check finish reason to understand completion status
            if finish_reason.name == "STOP":
                # Normal completion
                response_text = response.text.strip()
                output_tokens = self.count_tokens(response_text)
                logger.info(f"Successfully generated summary - Output tokens: {output_tokens}")
                logger.debug(f"Generated summary: {response_text[:100]}...")
                return response_text
                
            elif finish_reason.name == "MAX_TOKENS":
                # Response was truncated due to token limit
                response_text = response.text.strip() if response.text else ""
                output_tokens = self.count_tokens(response_text)
                logger.warning(f"Summary was truncated due to max token limit - Output tokens: {output_tokens}")
                logger.warning("Consider increasing max_output_tokens or reducing input text length")
                return response_text
                
            elif finish_reason.name == "SAFETY":
                # Response was blocked due to safety filters
                logger.error("Response blocked due to safety filters")
                raise Exception("Response blocked due to safety filters. Consider modifying the input text.")
                
            elif finish_reason.name == "RECITATION":
                # Response was blocked due to recitation concerns
                logger.error("Response blocked due to recitation concerns")
                raise Exception("Response blocked due to recitation concerns. The model detected potential copyright issues.")
                
            else:
                # Other finish reasons (e.g., OTHER, SPII)
                logger.error(f"Generation stopped with unexpected reason: {finish_reason.name}")
                raise Exception(f"Generation failed with finish reason: {finish_reason.name}")
                
        except AttributeError as e:
            # Handle cases where response structure is unexpected
            logger.error(f"Unexpected response structure: {e}")
            logger.error("This might indicate an API change or response format issue")
            raise Exception(f"Failed to parse response: {e}")
            
        except Exception as e:
            # Handle all other exceptions
            logger.error(f"Summarization failed: {e}")
            logger.error(f"Input text length: {len(text_to_summarize)} characters, {input_tokens} tokens")
            raise e


if __name__ == '__main__':
    # This is an example of how to use the GeminiClient.
    # To run this, you need to have the VERTEX_AI_PROJECT and VERTEX_AI_LOCATION
    # environment variables set, and you need to be authenticated with gcloud.
    
    try:
        client = GeminiClient()

        sample_text = (
            "Introduction to Programming: This course covers the fundamentals of programming using Python. "
            "Topics include variables, data types, control structures, functions, and basic data structures. "
            "Data Structures and Algorithms: This course is a deep dive into common data structures like arrays, "
            "linked lists, stacks, queues, trees, and graphs. It also covers fundamental algorithms for sorting, "
            "searching, and graph traversal. "
            "Object-Oriented Design: This course introduces the principles of object-oriented programming (OOP), "
            "including encapsulation, inheritance, and polymorphism. Students will learn how to design and "
            "implement complex software systems using OOP patterns."
        )

        summarization_prompt = (
            "You are a university course catalog editor. Your task is to write a concise and compelling "
            "program description based on the list of course descriptions provided below. The summary should "
            "capture the essence of the program, its key learning areas, and the skills students will acquire. "
            "Do not simply list the course titles. The tone should be professional and informative, suitable for prospective students."
            "Also make sure that the summary is under 1024 tokens."
        )

        summary = client.summarize_text(sample_text, summarization_prompt)

        print("--- Original Text ---")
        print(sample_text)
        print("\n--- Generated Summary ---")
        print(summary)

    except (ValueError, ImportError) as e:
        print(f"Error: {e}")
        print("Please ensure you have set the VERTEX_AI_PROJECT and VERTEX_AI_LOCATION environment variables.")
        print("You may also need to install the required libraries: pip install google-cloud-aiplatform")
