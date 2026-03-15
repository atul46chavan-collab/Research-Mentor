import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Search, Trash2, Loader2, Clock, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  id: string;
  topic: string;
  paperCount: number;
  papers: any[];
  timestamp: string;
}

const SearchHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const resp = await fetch('http://localhost:5000/api/history');
      if (resp.ok) {
        const data = await resp.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await fetch('http://localhost:5000/api/history', { method: 'DELETE' });
      setHistory([]);
      toast({ title: "Cleared", description: "Search history has been cleared." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to clear history.", variant: "destructive" });
    }
  };

  const loadSearch = (item: HistoryItem) => {
    localStorage.setItem('research_papers', JSON.stringify(item.papers));
    localStorage.setItem('research_topic', item.topic);
    toast({ title: "Papers loaded", description: `Loaded ${item.paperCount} papers for "${item.topic}".` });
    navigate('/search');
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              Search History
            </h1>
            <p className="text-muted-foreground">
              View and reload your past research paper searches.
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Clear All
            </Button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading history...</p>
        </motion.div>
      ) : history.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">No search history yet</h2>
          <p className="text-muted-foreground mb-6">Start by searching for a research topic.</p>
          <Button onClick={() => navigate('/search')}>
            <Search className="w-4 h-4 mr-2" /> Go to Topic Search
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-5 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => loadSearch(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.topic}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {item.paperCount} papers
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  {/* Show paper titles preview */}
                  {item.papers && item.papers.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {item.papers.slice(0, 3).map((paper: any, pIdx: number) => (
                        <p key={pIdx} className="text-xs text-muted-foreground truncate max-w-xl">
                          • {paper.title}
                        </p>
                      ))}
                      {item.papers.length > 3 && (
                        <p className="text-xs text-muted-foreground/60 italic">
                          +{item.papers.length - 3} more papers
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-primary font-medium">Load</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
