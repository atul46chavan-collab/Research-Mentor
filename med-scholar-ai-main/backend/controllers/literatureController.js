import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const generateLiteratureReview = async (req, res) => {
  try {
    const { abstracts } = req.body;

    if (!abstracts || !Array.isArray(abstracts)) {
      return res.status(400).json({ error: "A list of abstracts is required" });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return res.status(401).json({ error: "Google API Key is missing" });
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-flash-latest",
      temperature: 0.5,
      maxRetries: 1,
    });

    const template = `
      You are an academic research mentor. Review the following research abstracts and 
      generate a cohesive literature review paragraph (150-250 words) that summarizes 
      the current state of research, common themes, and key findings.

      Abstracts:
      {abstracts}

      Literature Review:
    `;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["abstracts"],
    });

    const chain = prompt.pipe(model);
    const response = await chain.invoke({ 
      abstracts: abstracts.join("\n\n---\n\n") 
    });

    res.json({ review: response.content });
  } catch (error) {
    console.error("Literature Review Error:", error.message);
    res.status(500).json({ error: "Failed to generate literature review" });
  }
};
