import { checkCitations } from '../utils/citationHelper.js';

export const verifyCitations = (req, res) => {
  try {
    const { research_text, reference_list } = req.body;

    if (!research_text) {
      return res.status(400).json({ error: "Research text is required" });
    }

    if (!reference_list || !Array.isArray(reference_list)) {
      return res.status(400).json({ error: "Reference list is required as an array" });
    }

    const results = checkCitations(research_text, reference_list);
    res.json(results);
  } catch (error) {
    console.error("Citation Verification Error:", error.message);
    res.status(500).json({ error: "Failed to verify citations" });
  }
};
