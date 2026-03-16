import { PromptTemplate } from "@langchain/core/prompts";
import { getAIModel } from "../services/aiService.js";

export const recommendJournals = async (req, res) => {
  try {
    const { topic, abstract, fieldOfStudy, keywords } = req.body;

    if (!topic || !abstract) {
      return res.status(400).json({ error: "Topic and abstract are required" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
       return res.status(500).json({ error: "OpenRouter API Key not found." });
    }

    const model = getAIModel(0.7);

    const template = `
      You are an expert academic advisor for medical students. Based on the following research details, recommend 3 to 5 suitable medical or scientific journals for publication.

      Research Topic: {topic}
      Abstract: {abstract}
      Field of Study: {fieldOfStudy}
      Keywords: {keywords}

      For each journal, provide the following details:
      - "name": Journal Name
      - "publisher": Publisher
      - "impactFactor": Impact Factor (if available, otherwise "N/A")
      - "indexing": Indexing (e.g., PubMed, Scopus)
      - "reviewTime": Estimated Review Time
      - "openAccess": Open Access / Paid / Hybrid
      - "submissionLink": Direct Submission Link (A plausible or actual URL to the journal's submission page)

      Also, provide a short "aiExplanation" explaining why these journals are recommended based on the research topic and scope of the study. Include a "disclaimer" that Journal recommendations are AI-generated suggestions and authors should verify journal guidelines before submission.

      Output strictly in JSON-like structure:
      {{
        "recommendations": [
          {{
            "name": "...",
            "publisher": "...",
            "impactFactor": "...",
            "indexing": "...",
            "reviewTime": "...",
            "openAccess": "...",
            "submissionLink": "..."
          }}
        ],
        "aiExplanation": "These journals are recommended based on...",
        "disclaimer": "Journal recommendations are AI-generated suggestions. Authors should verify journal guidelines before submission."
      }}
    `;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["topic", "abstract", "fieldOfStudy", "keywords"],
    });

    const chain = prompt.pipe(model);
    
    const response = await chain.invoke({
      topic,
      abstract,
      fieldOfStudy: fieldOfStudy || "General Medicine",
      keywords: keywords ? keywords.join(", ") : "None provided"
    });

    let cleaned = response.content.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse LLM response:", cleaned);
      return res.status(500).json({ error: "Failed to parse journal recommendations from AI." });
    }

    res.json(parsed);

  } catch (error) {
    console.error("Journal Recommendation Error:", error.message);
    res.status(500).json({ error: "Failed to recommend journals." });
  }
};
