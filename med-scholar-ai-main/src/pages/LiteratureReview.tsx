import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Copy, Check, BookOpen, GitBranch, ClipboardList, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type AnalysisTab = "review" | "correlation" | "systematic" | "meta";

const LiteratureReview = () => {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");
  const [correlationResult, setCorrelationResult] = useState("");
  const [systematicResult, setSystematicResult] = useState("");
  const [metaResult, setMetaResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [papers, setPapers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<AnalysisTab>("review");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('research_papers');
    if (saved) setPapers(JSON.parse(saved));
  }, []);

  const topic = localStorage.getItem('research_topic') || "medical research";

  const generateReview = async () => {
    if (papers.length === 0) {
      toast({ title: "No papers found", description: "Please search for a research topic first.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setReview("");
    try {
      const response = await fetch('http://localhost:5000/api/literature-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstracts: papers.map(p => p.abstract) })
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setReview(data.review);
    } catch (error) {
      toast({ title: "Error", description: "Could not generate review.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const generateCorrelation = async () => {
    if (papers.length === 0) { toast({ title: "No papers", description: "Search first.", variant: "destructive" }); return; }
    setLoading(true); setCorrelationResult("");
    try {
      const resp = await fetch('http://localhost:5000/api/correlation-analysis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstracts: papers.map(p => p.abstract) })
      });
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      setCorrelationResult(data.analysis);
    } catch (error) { toast({ title: "Error", description: "Could not run correlation analysis.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const generateSystematic = async () => {
    if (papers.length === 0) { toast({ title: "No papers", description: "Search first.", variant: "destructive" }); return; }
    setLoading(true); setSystematicResult("");
    try {
      const resp = await fetch('http://localhost:5000/api/systematic-review', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstracts: papers.map(p => p.abstract), topic })
      });
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      setSystematicResult(data.review);
    } catch (error) { toast({ title: "Error", description: "Could not generate systematic review.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const generateMeta = async () => {
    if (papers.length === 0) { toast({ title: "No papers", description: "Search first.", variant: "destructive" }); return; }
    setLoading(true); setMetaResult("");
    try {
      const resp = await fetch('http://localhost:5000/api/meta-analysis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstracts: papers.map(p => p.abstract), topic })
      });
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      setMetaResult(data.analysis);
    } catch (error) { toast({ title: "Error", description: "Could not generate meta-analysis.", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const currentResult = activeTab === "review" ? review : activeTab === "correlation" ? correlationResult : activeTab === "systematic" ? systematicResult : metaResult;
  const currentAction = activeTab === "review" ? generateReview : activeTab === "correlation" ? generateCorrelation : activeTab === "systematic" ? generateSystematic : generateMeta;
  const actionLabels: Record<AnalysisTab, string> = {
    review: "Generate Literature Review",
    correlation: "Run Correlation Analysis",
    systematic: "Generate Systematic Review",
    meta: "Generate Meta-Analysis",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentResult);
    setCopied(true);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "review" as AnalysisTab, label: "Literature Review", icon: FileText },
    { id: "correlation" as AnalysisTab, label: "Correlation", icon: GitBranch },
    { id: "systematic" as AnalysisTab, label: "Systematic Review", icon: ClipboardList },
    { id: "meta" as AnalysisTab, label: "Meta-Analysis", icon: BarChart3 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Literature Review & Analysis
        </h1>
        <p className="text-muted-foreground mb-6">
          Generate reviews, correlations, systematic reviews, and meta-analysis.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Papers being analyzed */}
      <div className="glass-card p-5 mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Papers in Analysis ({papers.length})
        </h2>
        {papers.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {papers.map((p, idx) => (
              <div key={p.id || idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.authors} ({p.year})</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No papers found. Please go to Topic Search first.</p>
        )}
      </div>

      <Button onClick={currentAction} disabled={loading} className="mb-6">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
        {actionLabels[activeTab]}
      </Button>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Generating {activeTab.replace("-", " ")}...</p>
        </motion.div>
      )}

      {currentResult && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {actionLabels[activeTab].replace("Generate ", "").replace("Run ", "")} Results
            </h2>
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
            <ReactMarkdown>{currentResult}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LiteratureReview;
