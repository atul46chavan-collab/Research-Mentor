import { ChatOpenAI } from "@langchain/openai";

export const getAIModel = (temperature = 0.7) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing from environment variables");
  }

  return new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    modelName: "google/gemini-2.0-flash-001", // Default model
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "Research Mentor",
      }
    },
    temperature: temperature,
    maxRetries: 3,
  });
};
