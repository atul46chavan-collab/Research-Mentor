import axios from 'axios';
import { PromptTemplate } from "@langchain/core/prompts";
import { getAIModel } from "../services/aiService.js";

export const findResearchGaps = async (req, res) => {
  try {
    const { abstracts } = req.body;

    if (!abstracts || !Array.isArray(abstracts)) {
      return res.status(400).json({ error: "Abstracts are required" });
    }

    // 1. Call Python NLP Service for Limitations and Clustering
    let limitations = [];
    let clusters = [];

    try {
      const nlpResponse = await axios.post('http://127.0.0.1:5001/extract-limitations', { abstracts }, { timeout: 10000 });
      const clusterResponse = await axios.post('http://127.0.0.1:5001/cluster-topics', { abstracts }, { timeout: 10000 });
      limitations = nlpResponse.data.limitations;
      clusters = clusterResponse.data.clusters;
    } catch (nlpError) {
      console.warn("Python NLP service unreachable, using LLM-only fallback.");
    }

    // 2. Use LangChain for AI Explanation
    if (!process.env.OPENROUTER_API_KEY) {
       return res.json({ 
         limitations: limitations.length ? limitations : ["No limitations extracted"], 
         clusters, 
         gap_analysis: "AI Explanation unavailable: OpenRouter API Key not found." 
       });
    }

    const model = getAIModel(0.7);

    const template = `
      You are an expert research analyst. Review the following research abstracts and identify:
      1. Extracted Limitations: What are common weaknesses in these studies?
      2. Research Clusters: What are the main sub-topics?
      3. Critical Research Gaps: What is missing?
      4. Structured Explanation: Why are these gaps important?

      Abstracts:
      {abstracts}

      Input (from NLP tool if available):
      Existing Limitations: {limitations}
      Existing Clusters: {clusters}

      Output in JSON-like structure:
      {{"limitations": [...],
        "clusters": [{{"id": 0, "topic": "...", "count": 2, "is_potential_gap": true}}, ...],
        "gap_analysis": "..."
      }}
    `;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ["limitations", "clusters", "abstracts"],
    });

    const chain = prompt.pipe(model);
    try {
      const response = await chain.invoke({
        limitations: limitations.length ? limitations.join("\n") : "None detected",
        clusters: clusters.length ? JSON.stringify(clusters) : "None detected",
        abstracts: abstracts.slice(0, 5).join("\n\n")
      });

      try {
        const cleaned = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        res.json({
          limitations: parsed.limitations || limitations,
          clusters: parsed.clusters || clusters,
          gap_analysis: typeof parsed.gap_analysis === 'string' ? parsed.gap_analysis : JSON.stringify(parsed.gap_analysis) || response.content
        });
      } catch (e) {
        res.json({
          limitations: limitations.length ? limitations : ["Check AI explanation"],
          clusters: clusters.length ? clusters : [],
          gap_analysis: response.content
        });
      }
    } catch (aiError) {
      console.error("Gemini Gap Analysis Error:", aiError.message);
      res.json({
        limitations: limitations.length ? limitations : ["No limitations extracted"],
        clusters: clusters.length ? clusters : [],
        gap_analysis: "The AI is currently busy or reaching quota limits. However, based on statistical analysis: " + 
                     (limitations.length ? "We found " + limitations.length + " specific study limitations." : "No explicit limitations found in abstracts.")
      });
    }

  } catch (error) {
    console.error("General Gap Analysis Error:", error.message);
    res.status(500).json({ error: "Failed to perform gap analysis." });
  }
};
