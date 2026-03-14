import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Paper } from "@/lib/mockData";
import { BookOpen, AlertTriangle, Lightbulb, FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  paper: Paper | null;
  onClose: () => void;
}

const PaperSummaryModal = ({ paper, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  if (!paper) return null;

  const generateAiSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/paper-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abstract: paper.abstract })
      });
      if (!response.ok) throw new Error('Summary failed');
      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!paper} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{paper.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {paper.authors} • {paper.year} • {paper.journal}
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {!aiSummary && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center">
              <Sparkles className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-medium mb-3">AI can generate a deeper analysis of this paper.</p>
              <Button onClick={generateAiSummary} disabled={loading} size="sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Generate AI Deep Summary
              </Button>
            </div>
          )}

          {aiSummary ? (
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line bg-muted/30 p-4 rounded-lg">
              {aiSummary}
            </div>
          ) : (
            <>
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm mb-2">
                  <FileText className="w-4 h-4 text-primary" /> Abstract
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{paper.abstract}</p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm mb-2">
                  <BookOpen className="w-4 h-4 text-teal" /> Key Findings
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{paper.keyFindings || "Analyze to extract"}</p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber" /> Limitations
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{paper.limitations || "Analyze to extract"}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaperSummaryModal;
