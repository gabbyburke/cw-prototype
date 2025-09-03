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
Embedding Service module for generating text embeddings using Vertex AI.
"""

import os
import logging
from typing import List
from google.cloud.aiplatform_v1beta1.services import prediction_service
from google.protobuf import struct_pb2
from tenacity import retry, wait_exponential, stop_after_attempt

# Import the GeminiClient for token counting
from src.backend.utils.genai import GeminiClient, DEFAULT_MAX_TOKENS
from src.backend.utils.logger_config import logger

# Initialize Vertex AI prediction client
prediction_client = prediction_service.PredictionServiceClient()

# Vertex AI embedding model details (replace with actual values or environment variables)
VERTEX_AI_PROJECT = os.environ.get("VERTEX_AI_PROJECT", os.environ.get("GCP_PROJECT"))
VERTEX_AI_LOCATION = os.environ.get("VERTEX_AI_LOCATION", "us-central1")
VERTEX_AI_MODEL_ID = os.environ.get("VERTEX_AI_MODEL_ID", "gemini-embedding-001") # Aligned with user's observed model
CUSTOM_BIGQUERY_TIMEOUT = int(os.environ.get("CUSTOM_BIGQUERY_TIMEOUT", 90))


@retry(wait=wait_exponential(multiplier=2, min=4, max=30), stop=stop_after_attempt(3)) # Increased multiplier
def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """Generates embeddings for a batch of texts in a single API call."""
    if not all([VERTEX_AI_PROJECT, VERTEX_AI_LOCATION, VERTEX_AI_MODEL_ID]):
        logger.warning("Vertex AI environment variables not set. Skipping embedding generation.")
        return [[] for _ in texts] # Return empty lists for each text if config is missing

    # Filter out empty texts and keep track of original indices
    valid_texts_with_indices = [(i, text) for i, text in enumerate(texts) if text.strip()]
    if not valid_texts_with_indices:
        logger.warning("No valid texts provided for embedding generation after filtering empty strings.")
        return [[] for _ in texts] # Return empty lists if all texts are empty

    original_indices = [item[0] for item in valid_texts_with_indices]
    texts_to_embed = [item[1] for item in valid_texts_with_indices]

    logger.info(f"Total valid texts to embed: {len(texts_to_embed)}")
    endpoint = f"projects/{VERTEX_AI_PROJECT}/locations/{VERTEX_AI_LOCATION}/publishers/google/models/{VERTEX_AI_MODEL_ID}"
    logger.info(f"Vertex AI Endpoint: {endpoint}")

    # Initialize a list of empty embeddings for all original texts
    all_embeddings = [[] for _ in texts]
    
    # Define a batch size for Vertex AI API calls
    batch_size = 50 # Further reduced batch size to mitigate DeadlineExceeded errors

    # Initialize GeminiClient for token counting
    try:
        gemini_client = GeminiClient(
            project_id=VERTEX_AI_PROJECT,
            location=VERTEX_AI_LOCATION
        )
        logger.info("GeminiClient initialized for token counting")
    except Exception as e:
        logger.error(f"Failed to initialize GeminiClient for token counting: {e}")
        logger.warning("Falling back to character-based truncation")
        gemini_client = None

    max_char_length = 6000  # Rough estimate: 2048 tokens * 3 chars/token
    # Check and truncate texts based on token count
    for i, text in enumerate(texts_to_embed):
        if gemini_client:
            try:
                token_count = gemini_client.count_tokens(text)
                logger.debug(f"Text at original index {original_indices[i]}: {token_count} tokens, {len(text)} characters")

                if token_count > DEFAULT_MAX_TOKENS:
                    logger.warning(f"Text at original index {original_indices[i]} exceeds {DEFAULT_MAX_TOKENS} tokens ({token_count} tokens). Truncating...")
                    truncated_text = gemini_client.truncate_to_max_tokens(text, DEFAULT_MAX_TOKENS)
                    final_token_count = gemini_client.count_tokens(truncated_text)
                    logger.info(f"Text truncated from {token_count} to {final_token_count} tokens")
                    texts_to_embed[i] = truncated_text
                else:
                    logger.debug(f"Text at original index {original_indices[i]} is within token limit ({token_count}/{DEFAULT_MAX_TOKENS})")
            except Exception as e:
                logger.error(f"Failed to count/truncate tokens for text at index {original_indices[i]}: {e}", exc_info=True)
                # Fallback to character-based truncation
                if len(text) > max_char_length:
                    logger.warning(f"Using character-based fallback truncation for text at index {original_indices[i]}")
                    texts_to_embed[i] = text[:max_char_length]
        else:
            # Fallback to character-based truncation when GeminiClient is not available
            if len(text) > max_char_length:
                logger.warning(f"Text at original index {original_indices[i]} exceeds {max_char_length} characters ({len(text)} chars). Using character-based truncation.")
                texts_to_embed[i] = text[:max_char_length]

    for i in range(0, len(texts_to_embed), batch_size):
        batch_texts = texts_to_embed[i:i + batch_size]
        batch_original_indices = original_indices[i:i + batch_size]

        logger.info(f"Processing batch {i // batch_size + 1} with {len(batch_texts)} texts. Original indices: {batch_original_indices[0]} to {batch_original_indices[-1]}")

        # Create a list of instances for the batch prediction request
        instances = []
        for text in batch_texts:
            instance_dict = {"content": text}
            instance_value = struct_pb2.Value(struct_value=struct_pb2.Struct())
            instance_value.struct_value.update(instance_dict)
            instances.append(instance_value)

        logger.info(f"Sending {len(instances)} instances to Vertex AI for embedding with a timeout of {CUSTOM_BIGQUERY_TIMEOUT} seconds.")
        try:
            response = prediction_client.predict(endpoint=endpoint, instances=instances, timeout=CUSTOM_BIGQUERY_TIMEOUT)
            logger.info(f"Successfully received {len(response.predictions)} predictions for batch.")
        except Exception as e:
            logger.error(f"Error during Vertex AI prediction for batch: {e}. Retrying...")
            # Re-raise the exception to be caught by tenacity, or handle specifically
            raise

        # Extract the embedding for each text from the batch response
        for j, prediction in enumerate(response.predictions):
            # Based on the AttributeError, 'prediction' is a MapComposite (Struct-like)
            # and 'prediction["embeddings"]' is also a MapComposite (Struct-like).
            embedding_values = prediction["embeddings"]["values"]
            # Place the generated embedding back into its original position
            all_embeddings[batch_original_indices[j]] = list(embedding_values)

    logger.info(f"Generated embeddings for {len(all_embeddings)} texts")
    return all_embeddings
