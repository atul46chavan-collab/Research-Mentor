import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Loader2, FileText, SpellCheck, ShieldAlert, Bot, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type ActiveTab = "citations" | "grammar" | "plagiarism" | "ai-check";

interface CitationResult {
  citation: string;
  status: "matched" | "missing" | "unused";
}

const CitationChecker = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>("citations");

  // Citations state
  const [researchText, setResearchText] = useState(
    `According to Sharma (2022), the prevalence of anemia in tribal children remains high. Kumar et al. (2021) identified nutritional deficiency as a primary cause. Recent data from WHO (2023) suggests that global anemia rates are declining. However, Gupta and Singh (2020) argue that rural healthcare access remains limited. A study by Patel (2019) found that iron supplementation programs are effective.`
  );
  const [references, setReferences] = useState(
    `1. Sharma R. Prevalence of anemia among tribal children. Indian J Pediatr. 2022;89(3):45-52.
2. Kumar A, Singh D. Nutritional deficiency and childhood anemia: A systematic review. BMC Public Health. 2021;21:234.
3. WHO. Global anemia prevalence report. WHO Technical Report. 2023.
4. Reddy T, Joshi P. Impact of mid-day meals on hemoglobin levels. J Community Med. 2022;15:78-85.
5. Banerjee S. Genetic factors in tribal anemia. Am J Hematol. 2022;97(4):112-118.`
  );
  const [citationResults, setCitationResults] = useState<CitationResult[]>([]);

  // Writing tools state
  const [writingText, setWritingText] = useState("");
  const [writingResult, setWritingResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Citation checking
  const checkCitations = async () => {
    if (!researchText || !references) {
      toast({ title: "Input missing", description: "Provide both research text and reference list.", variant: "destructive" });
      return;
    }
    setLoading(true); setCitationResults([]);
    try {
      const resp = await fetch('http://localhost:5000/api/citation-check', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ research_text: researchText, reference_list: references.split('\n').filter(r => r.trim().length > 0) })
      });
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      const results: CitationResult[] = [
        ...data.matched_citations.map((c: any) => ({ citation: c.full, status: 'matched' as const })),
        ...data.missing_references.map((c: any) => ({ citation: c.full, status: 'missing' as const })),
        ...data.uncited_references.map((c: any) => ({ citation: c.substring(0, 50) + '...', status: 'unused' as const }))
      ];
      setCitationResults(results);
    } catch (error) {
      toast({ title: "Error", description: "Could not verify citations.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  // Writing analysis (grammar/plagiarism/ai-detection)
  const analyzeWriting = async (endpoint: string) => {
    if (!writingText.trim()) {
      toast({ title: "Input missing", description: "Please enter text to analyze.", variant: "destructive" });
      return;
    }
    setLoading(true); setWritingResult("");
    try {
      const resp = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: writingText })
      });
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      setWritingResult(data.result);
    } catch (error) {
      toast({ title: "Error", description: `Could not perform ${endpoint.replace('-', ' ')}.`, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const matched = citationResults.filter((r) => r.status === "matched");
  const missing = citationResults.filter((r) => r.status === "missing");
  const unused = citationResults.filter((r) => r.status === "unused");

  const statusConfig = {
    matched: { icon: CheckCircle, label: "Matched", className: "citation-valid" },
    missing: { icon: XCircle, label: "Missing Reference", className: "citation-missing" },
    unused: { icon: AlertTriangle, label: "Uncited Reference", className: "citation-unused" },
  };

  const tabs = [
    { id: "citations" as ActiveTab, label: "Citations", icon: CheckCircle },
    { id: "grammar" as ActiveTab, label: "Grammar", icon: SpellCheck },
    { id: "plagiarism" as ActiveTab, label: "Plagiarism", icon: ShieldAlert },
    { id: "ai-check" as ActiveTab, label: "AI Check", icon: Bot },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Writing Quality Analyzer
        </h1>
        <p className="text-muted-foreground mb-6">
          Citation verification, grammar checking, plagiarism detection, and AI content analysis.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setWritingResult(""); }}
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

      {/* CITATIONS TAB */}
      {activeTab === "citations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="text-foreground mb-2 block">Research Text</Label>
              <Textarea value={researchText} onChange={(e) => setResearchText(e.target.value)} placeholder="Paste your research text here..." rows={10} className="text-sm" />
            </div>
            <div>
              <Label className="text-foreground mb-2 block">Reference List</Label>
              <Textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder="Paste your reference list here..." rows={10} className="text-sm" />
            </div>
          </div>
          <Button onClick={checkCitations} disabled={loading} className="mb-8">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            Check Citations
          </Button>
          {citationResults.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="feature-card text-center">
                  <CheckCircle className="w-6 h-6 text-accent mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">{matched.length}</div>
                  <div className="text-xs text-muted-foreground">Matched</div>
                </div>
                <div className="feature-card text-center">
                  <XCircle className="w-6 h-6 text-destructive mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">{missing.length}</div>
                  <div className="text-xs text-muted-foreground">Missing</div>
                </div>
                <div className="feature-card text-center">
                  <AlertTriangle className="w-6 h-6 text-amber mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">{unused.length}</div>
                  <div className="text-xs text-muted-foreground">Unused</div>
                </div>
              </div>
              <div className="glass-card p-5">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Detailed Results</h2>
                <div className="space-y-2">
                  {citationResults.map((r, i) => {
                    const config = statusConfig[r.status];
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`flex items-center gap-3 p-3 rounded-lg border ${config.className}`}>
                        <config.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium flex-1">{r.citation}</span>
                        <span className="text-xs font-medium">{config.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* GRAMMAR / PLAGIARISM / AI CHECK TABS */}
      {activeTab !== "citations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6">
            <Label className="text-foreground mb-2 block">
              {activeTab === "grammar" ? "Text to Check Grammar" : activeTab === "plagiarism" ? "Text for Plagiarism Scan" : "Text for AI Detection"}
            </Label>
            <Textarea
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              placeholder="Paste your academic text here for analysis..."
              rows={8}
              className="text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {activeTab === "grammar" && (
              <Button onClick={() => analyzeWriting("grammar-check")} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <SpellCheck className="w-4 h-4 mr-2" />}
                Check Grammar
              </Button>
            )}
            {activeTab === "plagiarism" && (
              <Button onClick={() => analyzeWriting("plagiarism-check")} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldAlert className="w-4 h-4 mr-2" />}
                Scan for Plagiarism
              </Button>
            )}
            {activeTab === "ai-check" && (
              <>
                <Button onClick={() => analyzeWriting("ai-detection")} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Bot className="w-4 h-4 mr-2" />}
                  Detect AI Content
                </Button>
                <Button onClick={() => analyzeWriting("humanize-text")} disabled={loading} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Humanize Text
                </Button>
              </>
            )}
          </div>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Analyzing your text...</p>
            </motion.div>
          )}

          {writingResult && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                {activeTab === "grammar" ? "Grammar Analysis" : activeTab === "plagiarism" ? "Plagiarism Report" : "AI Detection Report"}
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <ReactMarkdown>{writingResult}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CitationChecker;
