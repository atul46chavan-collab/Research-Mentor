import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader2, AlertTriangle, BarChart3, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const GapFinder = () => {
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  // Defensive loading of papers and previous analysis
  useEffect(() => {
    try {
      const savedPapers = localStorage.getItem('research_papers');
      if (savedPapers) {
        try {
          const parsed = JSON.parse(savedPapers);
          setPapers(Array.isArray(parsed) ? parsed : []);
        } catch (parseError) {
          console.error("Error parsing saved papers:", parseError);
          setPapers([]);
          localStorage.removeItem('research_papers');
        }
      } else {
        setPapers([]);
      }

      const savedAnalysis = localStorage.getItem('gap_analysis_result');
      if (savedAnalysis) {
        try {
          const parsed = JSON.parse(savedAnalysis);
          if (parsed && typeof parsed === 'object') {
            setAnalysis({
              limitations: Array.isArray(parsed.limitations) ? parsed.limitations : [],
              clusters: Array.isArray(parsed.clusters) ? parsed.clusters : [],
              gap_analysis: typeof parsed.gap_analysis === 'string' ? parsed.gap_analysis : JSON.stringify(parsed.gap_analysis) || ""
            });
          }
        } catch (parseError) {
          console.error("Error parsing saved analysis:", parseError);
          localStorage.removeItem('gap_analysis_result');
        }
      }
    } catch (e) {
      console.error("Critical error loading GapFinder data:", e);
      setPapers([]);
      setAnalysis(null);
      toast({
        title: "Session Error",
        description: "There was an error loading your previous progress. Cache has been cleared.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const clearCache = () => {
    localStorage.removeItem('gap_analysis_result');
    setAnalysis(null);
    toast({ title: "Cache cleared", description: "Previous analysis has been reset." });
  };

  const analyzeGaps = async () => {
    if (!papers || papers.length === 0) {
      toast({ 
        title: "No papers found", 
        description: "Please search for a research topic first.", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    setAnalysis(null); // Clear previous to show loading state
    
    try {
      const response = await fetch('http://localhost:5000/api/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstracts: papers.map(p => p.abstract || "").filter(Boolean) }),
      });
      
      if (!response.ok) throw new Error('API server unreachable');
      
      const data = await response.json();
      
      const normalizedData = {
        limitations: Array.isArray(data.limitations) ? data.limitations : [],
        clusters: Array.isArray(data.clusters) ? data.clusters : [],
        gap_analysis: typeof data.gap_analysis === 'string' ? data.gap_analysis : JSON.stringify(data.gap_analysis) || "No assessment generated."
      };
      
      setAnalysis(normalizedData);
      localStorage.setItem('gap_analysis_result', JSON.stringify(normalizedData));
      
      toast({ title: "Analysis Complete", description: "Identified research gaps and clusters." });
    } catch (error: any) {
      console.error('Gap Analysis Error:', error);
      toast({ 
        title: "Analysis Failed", 
        description: error.message || "Failed to perform gap analysis. Check server connection.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[50vh]">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h1 className="font-display text-3xl font-bold text-foreground">
            AI Research Gap Finder
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearCache} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mb-8">
          Analyze paper limitations and cluster topics to discover research opportunities.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button onClick={analyzeGaps} disabled={loading} className="glow-shadow">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
          {analysis ? "Re-analyze Research Gaps" : "Analyze Research Gaps"}
        </Button>
      </div>

      {papers.length === 0 && !analysis && (
        <div className="text-center py-16 glass-card">
          <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Research Papers Found</h3>
          <p className="text-muted-foreground mb-4">
            To use the Gap Finder, first search for a research topic to load papers into your session.
          </p>
          <Button asChild>
            <Link to="/search">Go to Topic Search</Link>
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading && (
          <div className="text-center py-16 glass-card">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Synthesizing gaps and clustering research domains...</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6">
            {/* AI Explanation */}
            {analysis.gap_analysis && (
              <div className="glass-card p-6 bg-primary/5 border-primary/20">
                <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  AI Strategic Assessment
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                  {typeof analysis.gap_analysis === 'string' ? analysis.gap_analysis : JSON.stringify(analysis.gap_analysis, null, 2)}
                </div>
              </div>
            )}

            {/* Limitations */}
            {analysis.limitations && analysis.limitations.length > 0 && (
              <div className="glass-card p-5">
                <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber" />
                  Common Study Limitations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.limitations.slice(0, 12).map((l: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="bg-amber/5 text-amber border-amber/20 px-3 py-1">
                      {typeof l === 'string' ? (l.length > 60 ? l.substring(0, 57) + '...' : l) : "Detected limitation"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Clusters with Chart */}
            {analysis.clusters && analysis.clusters.length > 0 && (
              <div className="space-y-6">
                <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Research Domain Clusters
                </h2>

                <div className="glass-card p-6 min-h-[300px]">
                  <ResponsiveContainer width="100%" height={Math.max(300, analysis.clusters.length * 40)}>
                    <BarChart
                      data={analysis.clusters.map((c: any) => ({
                        name: c.topic ? (c.topic.length > 35 ? c.topic.substring(0, 32) + "..." : c.topic) : `Topic ${c.id || ''}`,
                        papers: c.count || 0,
                        isGap: !!c.is_potential_gap,
                      }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                      />
                      <Bar dataKey="papers" name="Documents" radius={[0, 4, 4, 0]}>
                        {analysis.clusters.map((c: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={c.is_potential_gap ? "hsl(var(--amber))" : "hsl(var(--primary))"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.clusters.map((c: any, idx: number) => (
                    <div 
                      key={c.id || idx}
                      className={`p-4 rounded-xl border ${c.is_potential_gap ? 'bg-amber/5 border-amber/20' : 'bg-card border-border'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Cluster {idx + 1}</span>
                        {c.is_potential_gap && <Badge variant="default" className="bg-amber text-white border-none text-[10px]">GAP</Badge>}
                      </div>
                      <p className="text-sm font-semibold text-foreground mb-1">{c.topic || "Research Domain"}</p>
                      <p className="text-xs text-muted-foreground">{c.count || 0} studies analyzed</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GapFinder;
