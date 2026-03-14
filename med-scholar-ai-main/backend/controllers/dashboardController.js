// Feature 7 - Research Dashboard API
export const getProgress = async (req, res) => {
  // In a real app, this would fetch from a database per user
  // For this demo, we'll return a state based on available session data (mocked)
  res.json({
    topic_selected: true,
    literature_review: true,
    gap_analysis: false,
    methodology: false,
    citation_check: false
  });
};
