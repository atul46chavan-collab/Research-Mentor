import dotenv from 'dotenv';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

dotenv.config();

async function test() {
  try {
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-flash-latest",
      temperature: 0.3,
    });

    const template = "Summarize this: {text}";
    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["text"],
    });

    const chain = prompt.pipe(model);
    console.log("Invoking chain...");
    const response = await chain.invoke({ text: "Medical research is important." });
    console.log("Response:", response.content);
  } catch (error) {
    console.error("DEBUG ERROR:", error);
  }
}

test();
