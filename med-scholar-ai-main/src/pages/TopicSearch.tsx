import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, BookOpen, TrendingUp, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Paper } from "@/lib/mockData";
import ReactMarkdown from "react-markdown";
import PaperSummaryModal from "@/components/PaperSummaryModal";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const PAPERS_PER_PAGE = 5;
const CHART_COLORS = ["hsl(250, 60%, 52%)", "hsl(173, 58%, 39%)", "hsl(38, 92%, 50%)", "hsl(350, 75%, 55%)", "hsl(250, 70%, 65%)"];

const TopicSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [showTrend, setShowTrend] = useState(false);
  const [trendSummary, setTrendSummary] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const savedPapers = localStorage.getItem('research_papers');
    const savedTopic = localStorage.getItem('research_topic');
    if (savedPapers) {
      const parsed = JSON.parse(savedPapers);
      setPapers(parsed);
      setShowTrend(true);
      const savedTrend = localStorage.getItem('research_trend_summary');
      if (savedTrend) setTrendSummary(savedTrend);
    }
    if (savedTopic) setQuery(savedTopic);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setPapers([]);
    setShowTrend(false);
    setCurrentPage(0);
    setTrendSummary("");
    
    try {
      const response = await fetch(`http://localhost:5000/api/papers?topic=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      const formattedPapers: Paper[] = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        authors: Array.isArray(p.authors) ? p.authors.join(', ') : p.authors,
        year: parseInt(p.year) || 0,
        journal: p.journal,
        abstract: p.abstract,
        keyFindings: "Extracting...",
        limitations: "Extracting..."
      }));

      setPapers(formattedPapers);
      setShowTrend(true);
      setLoading(false);

      // Extract AI insights for each paper
      setInsightsLoading(true);
      const updatedPapers = await Promise.all(
        formattedPapers.map(async (paper) => {
          try {
            const insightResp = await fetch('http://localhost:5000/api/extract-paper-insights', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ abstract: paper.abstract })
            });
            if (insightResp.ok) {
              const insights = await insightResp.json();
              return { ...paper, keyFindings: insights.keyFindings, limitations: insights.limitations };
            }
          } catch (e) {
            console.error("Insight extraction error:", e);
          }
          return paper;
        })
      );
      setPapers(updatedPapers);
      setInsightsLoading(false);

      // Save to localStorage for other pages
      localStorage.setItem('research_papers', JSON.stringify(updatedPapers));
      localStorage.setItem('research_topic', query);
      
      // Save search history to backend
      try {
        await fetch('http://localhost:5000/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: query, papers: updatedPapers })
        });
      } catch (e) {
        console.error("History save error:", e);
      }

      // Fetch Trend Summary
      try {
        const trendResp = await fetch('http://localhost:5000/api/trend-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ abstracts: updatedPapers.map((p: Paper) => p.abstract), topic: query })
        });
        if (trendResp.ok) {
          const trendData = await trendResp.json();
          setTrendSummary(trendData.summary);
          localStorage.setItem('research_trend_summary', trendData.summary);
        }
      } catch (e) {
        console.error("Trend Error", e);
      }

    } catch (error) {
      console.error('Search Error:', error);
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(papers.length / PAPERS_PER_PAGE);
  const paginatedPapers = papers.slice(currentPage * PAPERS_PER_PAGE, (currentPage + 1) * PAPERS_PER_PAGE);

  // Year chart data
  const yearCounts: Record<string, number> = {};
  papers.forEach((p) => {
    const year = p.year?.toString() || "Unknown";
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  const yearData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Research Topic Search
        </h1>
        <p className="text-muted-foreground mb-8">
          Enter a research topic to find 5 most relevant papers from PubMed with AI-extracted insights.
        </p>
      </motion.div>

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g., Anemia in tribal children"
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
          Search
        </Button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Searching PubMed for relevant papers...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {papers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Insights loading banner */}
          {insightsLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-primary/5 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">AI is extracting Key Findings & Limitations for each paper...</span>
            </motion.div>
          )}

          {/* Results table */}
          <div className="glass-card overflow-hidden mb-4">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Found {papers.length} Relevant Papers
              </h2>
              <span className="text-xs text-muted-foreground">
                Showing {currentPage * PAPERS_PER_PAGE + 1}–{Math.min((currentPage + 1) * PAPERS_PER_PAGE, papers.length)} of {papers.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground">Authors</th>
                    <th className="text-left p-3 font-medium text-foreground">Year</th>
                    <th className="text-left p-3 font-medium text-foreground">Title</th>
                    <th className="text-left p-3 font-medium text-foreground">Key Findings</th>
                    <th className="text-left p-3 font-medium text-foreground">Limitations</th>
                    <th className="text-left p-3 font-medium text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPapers.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 text-foreground font-medium whitespace-nowrap max-w-[150px] truncate">{p.authors}</td>
                      <td className="p-3 text-muted-foreground">{p.year}</td>
                      <td className="p-3 text-foreground max-w-xs">{p.title}</td>
                      <td className="p-3 text-muted-foreground max-w-xs text-xs">
                        {p.keyFindings === "Extracting..." ? (
                          <span className="flex items-center gap-1 text-primary"><Loader2 className="w-3 h-3 animate-spin" /> Extracting...</span>
                        ) : p.keyFindings}
                      </td>
                      <td className="p-3 text-muted-foreground max-w-xs text-xs">
                        {p.limitations === "Extracting..." ? (
                          <span className="flex items-center gap-1 text-primary"><Loader2 className="w-3 h-3 animate-spin" /> Extracting...</span>
                        ) : p.limitations}
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="outline" onClick={() => setSelectedPaper(p)}>
                          <ExternalLink className="w-3 h-3 mr-1" /> Summary
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mb-8">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      i === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Publication Year Chart */}
          {yearData.length > 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Publication Year Distribution
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={yearData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 88%)",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="count" name="Papers" radius={[6, 6, 0, 0]}>
                    {yearData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Trend summary */}
          {showTrend && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                AI Research Trend Summary
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {trendSummary ? (
                  <ReactMarkdown>{trendSummary}</ReactMarkdown>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Generating AI trend summary...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      <PaperSummaryModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
    </div>
  );
};

export default TopicSearch;
