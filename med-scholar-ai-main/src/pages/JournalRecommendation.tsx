import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Search, Loader2, Sparkles, AlertCircle, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JournalRecommendation {
  name: string;
  publisher: string;
  impactFactor: string;
  indexing: string;
  reviewTime: string;
  openAccess: string;
  submissionLink: string;
}

interface RecommendationResponse {
  recommendations: JournalRecommendation[];
  aiExplanation: string;
  disclaimer: string;
}

const JournalRecommendation = () => {
  const [topic, setTopic] = useState("");
  const [abstract, setAbstract] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  useEffect(() => {
    const savedTopic = localStorage.getItem('research_topic');
    if (savedTopic) {
      setTopic(savedTopic);
    }
    // Abstract could potentially come from methodology or drafting, assume manual input for now
  }, []);

  const handleRecommend = async () => {
    if (!topic.trim() || !abstract.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/journal-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          abstract,
          fieldOfStudy,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean)
        })
      });

      if (!response.ok) throw new Error('Recommendation failed');
      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error('Error fetching journal recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BookMarked className="w-8 h-8 text-primary" />
          Journal Recommendation & Publication Guidance
        </h1>
        <p className="text-muted-foreground mb-8">
          Identify suitable journals to publish your research papers based on your topic and abstract.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Research Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Research Topic <span className="text-red-500">*</span></label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Application of AI in Anemia Diagnosis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Abstract <span className="text-red-500">*</span></label>
              <Textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste your generated abstract here..."
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Field of Study</label>
                <Input
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g., Cardiology, Public Health"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Keywords</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Comma separated"
                />
              </div>
            </div>
            <Button
              onClick={handleRecommend}
              disabled={loading || !topic.trim() || !abstract.trim()}
              className="w-full mt-4"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Get Recommendations</>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-12 glass-card h-full">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground text-center">
                  Analyzing research scope...<br />
                  Finding the best matching journals...
                </p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Information Card */}
                <div className="glass-card p-5 mb-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Recommendation Insights
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    {result.aiExplanation}
                  </p>
                  <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-500/10 p-3 rounded-md border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{result.disclaimer}</p>
                  </div>
                </div>

                {/* Journals List */}
                <div className="space-y-4">
                  {result.recommendations.map((journal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-lg text-foreground leading-tight max-w-[80%]">
                            {journal.name}
                          </h4>
                          <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                            IF: {journal.impactFactor}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Publisher:</span> {journal.publisher}
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Access:</span> {journal.openAccess}
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Indexing:</span> {journal.indexing}
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Review Time:</span> {journal.reviewTime}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50 flex justify-end">
                          <Button variant="outline" size="sm" asChild className="group">
                            <a href={journal.submissionLink} target="_blank" rel="noopener noreferrer">
                              View Journal Details
                              <ExternalLink className="w-3 h-3 ml-2 group-hover:text-primary transition-colors" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JournalRecommendation;
