import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ResearchBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Research Mentor. How can I help you with your medical research today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg: Message = { role: "user", content: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.slice(-6), // Send last 6 messages for context
          context: `The user is currently using the Academic Research Mentor app. 
          Available features include: Topic Search (PubMed/Scholar), Literature Review Generator, 
          AI Gap Finder (clustering), Methodology Builder, Citation Checker, 
          Correlation Analysis, Systematic Review, Meta-analysis, 
          Grammar Check, Plagiarism scan, and AI Detection.`
        })
      });

      if (!response.ok) throw new Error("Failed to chat");
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting to the server. Please ensure the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center overflow-hidden transition-all ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary to-accent opacity-50 animate-pulse" />
        <MessageSquare className="w-6 h-6 relative z-10" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className={`fixed bottom-6 right-6 z-[60] w-[380px] sm:w-[420px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col ${isMinimized ? 'h-16' : 'h-[600px]'}`}
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none">Research Mentor AI</h3>
                  <p className="text-[10px] opacity-70 mt-1">Always here to guide you</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-secondary/10">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white text-primary border border-border'}`}>
                          {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white text-foreground border border-border rounded-tl-none shadow-sm'}`}>
                          <div className="markdown-chat">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-white text-primary border border-border flex items-center justify-center shadow-sm animate-pulse">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="p-3 bg-white text-foreground border border-border rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs italic opacity-70">Mentor is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask your research mentor..."
                      className="pr-12 focus-visible:ring-primary h-11 rounded-xl shadow-inner bg-secondary/20 border-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !message.trim()}
                      className="absolute right-1 top-1 w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-3">Powered by Gemini AI • Always verify research citations</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResearchBot;
