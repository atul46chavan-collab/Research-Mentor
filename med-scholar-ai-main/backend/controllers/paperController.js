import * as pubmedService from '../services/pubmedService.js';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const getPapers = async (req, res) => {
  try {
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const papers = await pubmedService.fetchPapersByTopic(topic);
    res.json(papers);
  } catch (error) {
    console.error('Controller Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch research papers' });
  }
};

export const summarizePaper = async (req, res) => {
  try {
    const { abstract } = req.body;

    if (!abstract) {
      return res.status(400).json({ error: "Abstract is required" });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return res.status(401).json({ error: "Google API Key is missing" });
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-flash-latest",
      temperature: 0.3,
    });

    const template = `
      Summarize the following medical research abstract.
      Generate:
      1. Simple Explanation: (for a student)
      2. Key Findings: (bullet points)
      3. Limitations: (bullet points)
      4. Possible Improvements: (suggested next steps)

      Abstract: {abstract}
    `;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["abstract"],
    });

    const chain = prompt.pipe(model);
    const response = await chain.invoke({ abstract });

    res.json({ summary: response.content });
  } catch (error) {
    console.error("Summarization Error:", error.message);
    res.status(500).json({ error: "Failed to summarize paper" });
  }
};

export const getTrendSummary = async (req, res) => {
  try {
    const { abstracts, topic } = req.body;

    if (!abstracts || !Array.isArray(abstracts)) {
      return res.status(400).json({ error: "Abstracts are required" });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return res.json({ summary: `Currently trending research in ${topic} focuses on improving outcomes and clinical efficiency.` });
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-flash-latest",
      temperature: 0.5,
    });

    const template = `
      Based on the following abstracts of recent research papers on "{topic}", 
      generate a 2-sentence summary of the current research trends in this field.
      
      Abstracts:
      {abstracts}
    `;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["abstracts", "topic"],
    });

    const chain = prompt.pipe(model);
    const response = await chain.invoke({ 
      abstracts: abstracts.slice(0, 5).join("\n"),
      topic
    });

    res.json({ summary: response.content });
  } catch (error) {
    console.error("Trend Summary Error:", error.message);
    res.status(500).json({ error: "Failed to generate trend summary" });
  }
};
