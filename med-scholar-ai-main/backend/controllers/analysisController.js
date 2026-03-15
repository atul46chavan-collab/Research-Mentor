import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const getModel = (temp = 0.5) => new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-flash-latest",
  temperature: temp,
  maxRetries: 1,
});

export const correlationAnalysis = async (req, res) => {
  try {
    const { abstracts } = req.body;
    if (!abstracts || !Array.isArray(abstracts)) return res.status(400).json({ error: "Abstracts required" });
    if (!process.env.GOOGLE_API_KEY) return res.status(401).json({ error: "Google API Key missing" });

    const model = getModel(0.5);
    const template = `You are a biostatistician. Analyze the following research abstracts and identify statistically significant correlations between variables mentioned.

For each correlation found, provide:
1. Variable A and Variable B
2. Direction (positive/negative)
3. Strength (strong/moderate/weak)
4. Supporting evidence from the abstracts

Also provide an overall correlation summary paragraph.

Abstracts:
{abstracts}

Format your response as:
## Correlations Found
(list each correlation)

## Summary
(overall paragraph)`;

    const prompt = new PromptTemplate({ template, inputVariables: ["abstracts"] });
    const chain = prompt.pipe(model);
    const response = await chain.invoke({ abstracts: abstracts.slice(0, 5).join("\n\n---\n\n") });
    res.json({ analysis: response.content });
  } catch (error) {
    console.error("Correlation Error:", error.message);
    res.status(500).json({ error: "Failed to generate correlation analysis" });
  }
};

export const systematicReview = async (req, res) => {
  try {
    const { abstracts, topic } = req.body;
    if (!abstracts || !Array.isArray(abstracts)) return res.status(400).json({ error: "Abstracts required" });
    if (!process.env.GOOGLE_API_KEY) return res.status(401).json({ error: "Google API Key missing" });

    const model = getModel(0.5);
    const template = `You are a medical research methodologist. Based on the following abstracts on the topic "{topic}", generate a structured systematic review following PRISMA guidelines.

Include:
## 1. Search Strategy
(databases searched, keywords, time period)

## 2. Inclusion/Exclusion Criteria
(what papers were included and why)

## 3. Quality Assessment
(methodological quality of included studies)

## 4. Data Extraction Summary
(key data points from each study)

## 5. Synthesis of Findings
(narrative synthesis of results)

## 6. Limitations of the Review

## 7. Conclusions and Recommendations

Abstracts:
{abstracts}`;

    const prompt = new PromptTemplate({ template, inputVariables: ["abstracts", "topic"] });
    const chain = prompt.pipe(model);
    const response = await chain.invoke({ abstracts: abstracts.slice(0, 5).join("\n\n---\n\n"), topic: topic || "medical research" });
    res.json({ review: response.content });
  } catch (error) {
    console.error("Systematic Review Error:", error.message);
    res.status(500).json({ error: "Failed to generate systematic review" });
  }
};

export const metaAnalysis = async (req, res) => {
  try {
    const { abstracts, topic } = req.body;
    if (!abstracts || !Array.isArray(abstracts)) return res.status(400).json({ error: "Abstracts required" });
    if (!process.env.GOOGLE_API_KEY) return res.status(401).json({ error: "Google API Key missing" });

    const model = getModel(0.5);
    const template = `You are a meta-analysis expert. Based on the following research abstracts on "{topic}", generate a meta-analysis summary.

Include:
## 1. Pooled Effect Size
(estimated overall effect with direction)

## 2. Heterogeneity Assessment
(variability between studies — I², Q-statistic interpretation)

## 3. Forest Plot Interpretation
(describe what a forest plot of these studies would show)

## 4. Publication Bias
(assessment of potential bias)

## 5. Subgroup Analysis
(differences by population, setting, intervention type)

## 6. Sensitivity Analysis
(how robust are the findings)

## 7. Clinical Implications
(what do the combined results mean for practice)

Abstracts:
{abstracts}`;

    const prompt = new PromptTemplate({ template, inputVariables: ["abstracts", "topic"] });
    const chain = prompt.pipe(model);
    const response = await chain.invoke({ abstracts: abstracts.slice(0, 5).join("\n\n---\n\n"), topic: topic || "medical research" });
    res.json({ analysis: response.content });
  } catch (error) {
    console.error("Meta-Analysis Error:", error.message);
    res.status(500).json({ error: "Failed to generate meta-analysis" });
  }
};
