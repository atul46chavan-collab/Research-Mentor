import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Loader2, AlertTriangle, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const severityConfig = {
  high: { label: "High Priority", className: "bg-destructive/10 text-destructive border-destructive/30" },
  medium: { label: "Medium Priority", className: "bg-amber/10 text-amber border-amber/30" },
  low: { label: "Low Priority", className: "bg-primary/10 text-primary border-primary/30" },
};

const GapFinder = () => {
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('research_papers');
    if (saved) setPapers(JSON.parse(saved));
    
    // Load previously generated analysis
    try {
      const savedAnalysis = localStorage.getItem('gap_analysis_result');
      if (savedAnalysis) {
        const parsed = JSON.parse(savedAnalysis);
        // Normalize
        setAnalysis({
          ...parsed,
          clusters: Array.isArray(parsed.clusters) ? parsed.clusters : [],
          limitations: Array.isArray(parsed.limitations) ? parsed.limitations : []
        });
      }
    } catch (e) {
      console.error("Failed to parse saved analysis", e);
      localStorage.removeItem('gap_analysis_result');
    }
  }, []);

  const analyzeGaps = async () => {
    if (papers.length === 0) {
      toast({ 
        title: "No papers found", 
        description: "Please search for a research topic first.", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('http://localhost:5000/api/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstracts: papers.map(p => p.abstract) }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Failed to analyze gaps');
      const data = await response.json();
      
      // Ensure data has the correct format for the UI
      const normalizedData = {
        ...data,
        clusters: Array.isArray(data.clusters) ? data.clusters : [],
        limitations: Array.isArray(data.limitations) ? data.limitations : []
      };
      
      setAnalysis(normalizedData);
      localStorage.setItem('gap_analysis_result', JSON.stringify(normalizedData));
    } catch (error) {
      console.error('Gap Error:', error);
      toast({ 
        title: "Error", 
        description: "Could not perform gap analysis. Ensure both Node and Python servers are running.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          AI Research Gap Finder
        </h1>
        <p className="text-muted-foreground mb-8">
          Analyze paper limitations and cluster topics to discover research opportunities.
        </p>
      </motion.div>

      <Button onClick={analyzeGaps} disabled={loading} className="mb-8">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
        Analyze Research Gaps
      </Button>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing limitations with spaCy & clustering with scikit-learn...</p>
        </motion.div>
      )}

      {analysis && (
        <div className="space-y-4">
          {/* Common limitations detected */}
          {analysis.limitations && analysis.limitations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 mb-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber" />
                Key Limitations Found
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.limitations?.slice(0, 8).map((l: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full bg-amber/10 text-amber text-xs font-medium border border-amber/20">
                    {l.length > 50 ? l.substring(0, 47) + '...' : l}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Explanation */}
          {analysis.gap_analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 bg-primary/5 border-primary/20">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                AI Strategic Assessment
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {analysis.gap_analysis}
              </div>
            </motion.div>
          )}

          {/* Clusters with Chart */}
          {analysis.clusters && analysis.clusters.length > 0 && (
            <div className="mt-8 space-y-6">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Topic Clusters & Density
              </h2>

              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <ResponsiveContainer width="100%" height={Math.max(200, (analysis.clusters?.length || 0) * 50)}>
                  <BarChart
                    data={(analysis.clusters || []).map((c: any) => ({
                      name: c.topic?.length > 30 ? c.topic.substring(0, 27) + "..." : c.topic || `Topic ${c.id + 1}`,
                      papers: c.count || 0,
                      isGap: c.is_potential_gap,
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} 
                      width={115}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 13%, 88%)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                      formatter={(value: number, _name: string, props: any) => [
                        `${value} paper${value !== 1 ? 's' : ''}`,
                        props.payload.isGap ? '⚠️ Potential Gap' : 'Cluster'
                      ]}
                    />
                    <Bar dataKey="papers" name="Papers" radius={[0, 6, 6, 0]}>
                      {(analysis.clusters || []).map((c: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={c.is_potential_gap ? "hsl(38, 92%, 50%)" : "hsl(250, 60%, 52%)"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(250, 60%, 52%)" }} />
                    Well-Researched
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(38, 92%, 50%)" }} />
                    Potential Gap
                  </div>
                </div>
              </motion.div>

              {/* Cluster Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(analysis.clusters || []).map((c: any) => (
                  <div key={c.id} className={`p-4 rounded-xl border ${c.is_potential_gap ? 'bg-amber/5 border-amber/30' : 'bg-card border-border'}`}>
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-sm font-bold uppercase tracking-wider text-primary">Topic {(c.id || 0) + 1}</span>
                       {c.is_potential_gap && <Badge variant="outline" className="bg-amber/10 text-amber border-amber/30">Potential Gap</Badge>}
                    </div>
                    <p className="text-base font-semibold text-foreground mb-1">{c.topic || "Unknown Topic"}</p>
                    <p className="text-xs text-muted-foreground">{c.count || 0} papers in this cluster</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GapFinder;
