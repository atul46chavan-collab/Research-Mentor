import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const generateMethodology = async (req, res) => {
  try {
    const data = req.body;
    
    if (!process.env.GOOGLE_API_KEY) {
       return res.status(401).json({ error: "Google API Key is missing." });
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-flash-latest",
      temperature: 0.7,
      maxRetries: 1,
    });

    const template = `
      You are an expert medical researcher. Based on the following study parameters, 
      write a professional "Materials and Methods" section suitable for a medical journal.
      The output should be approximately 150-200 words and follow academic standards.

      Parameters:
      - Study Design: {study_design}
      - Objective: {study_objective}
      - Population: {study_population}
      - Sample Size: {sample_size}
      - Sampling Method: {sampling_method}
      - Data Collection: {data_collection_method}
      - Variables: {variables}
      - Ethical Considerations: {ethical_considerations}
      - Statistical Analysis: {statistical_analysis}

      Methodology Section:
    `;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: [
        "study_design", "study_objective", "study_population", 
        "sample_size", "sampling_method", "data_collection_method", 
        "variables", "ethical_considerations", "statistical_analysis"
      ],
    });

    const chain = prompt.pipe(model);
    const response = await chain.invoke(data);

    res.json({ methodology: response.content });
  } catch (error) {
    console.error("Methodology Generation Error:", error.message);
    res.status(500).json({ error: "Failed to generate methodology section" });
  }
};
