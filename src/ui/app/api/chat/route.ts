// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.GCP_LOCATION;
const GEMINI_MODEL_NAME = "gemini-2.5-flash";

if (!PROJECT_ID || !LOCATION) {
  throw new Error("Google Cloud Project ID and Location must be set in environment variables.");
}

// Initialize Vertex AI
const vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, groundingData } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
    }
    
    if (!groundingData || !Array.isArray(groundingData) || groundingData.length === 0) {
      return NextResponse.json({ response: "I need the case data to answer questions. Please make sure you are on the SWCM Dashboard and have loaded the cases." });
    }

    const chatHistory = messages.map((msg: { text: string, isUser: boolean }) => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // The last message is the user's current question
    const lastMessage = chatHistory.pop(); 
    if (!lastMessage || lastMessage.role !== 'user') {
        return NextResponse.json({ error: 'Invalid message sequence' }, { status: 400 });
    }

    const model = vertex_ai.getGenerativeModel({
        model: GEMINI_MODEL_NAME,
        generationConfig: {
            maxOutputTokens: 8192,
            temperature: 0.6,
            topP: 0.95,
        },
        systemInstruction: {
            role: 'system',
            parts: [{ text: `
                You are a helpful assistant for Child Welfare Case Workers.
                Your name is "VISION Assistant".
                Answer the user's question based on the information provided in the following JSON data representing the case data.
                Every answer must be grounded on the provided data. If a question is completely unrelated to
                the case data or child welfare questions, say "I do not have enough information to answer that question from the
                available data." Feel free to provide information, suggestions, and offer advice or procedures for case management.
                Be concise, avoid unnecessary jargon and be helpful. Also, ask follow-up questions to help
                the user navigate the information available in the data.
                  
                Format your response using markdown for headings, lists, and emphasis.

                Context Data (Case Data):
                ${JSON.stringify(groundingData, null, 2)}
            `}],
        },
    });

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(lastMessage.parts);
    const response = result.response;

    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
      throw new Error("Invalid response structure from Vertex AI");
    }
    
    const botResponse = response.candidates[0].content.parts[0].text;

    return NextResponse.json({ response: botResponse });

  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
