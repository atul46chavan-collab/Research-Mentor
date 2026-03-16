import { PromptTemplate } from "@langchain/core/prompts";
import { getAIModel } from "../services/aiService.js";

export const chatWithMentor = async (req, res) => {
  try {
    const { message, history, context } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    if (!process.env.OPENROUTER_API_KEY) return res.status(401).json({ error: "OpenRouter API Key missing" });

    const model = getAIModel(0.7);
    
    const template = `You are the "Academic Research Mentor" AI assistant. Your goal is to help medical students navigate the research workflow: Topic Search, Literature Review, Gap detection, Methodology, and Citation checking.

Context about the current application state:
{context}

Chat History:
{history}

User: {message}
Assistant:`;

    const prompt = new PromptTemplate({ 
      template, 
      inputVariables: ["message", "history", "context"] 
    });
    
    const chain = prompt.pipe(model);
    
    // Format history for the prompt
    const formattedHistory = (history || [])
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join("\n");

    const response = await chain.invoke({ 
      message, 
      history: formattedHistory,
      context: context || "The user is browsing the Research Mentor app."
    });

    res.json({ reply: response.content });
  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};
