import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Lightbulb,
  FlaskConical,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Search,
    title: "Topic Search",
    desc: "Find relevant papers from PubMed & Semantic Scholar instantly",
    link: "/search",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: FileText,
    title: "Literature Review",
    desc: "Auto-generate literature review paragraphs from fetched papers",
    link: "/literature",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: Lightbulb,
    title: "Gap Finder",
    desc: "AI-powered detection of research gaps and limitations",
    link: "/gaps",
    color: "text-amber",
    bg: "bg-amber/10",
  },
  {
    icon: FlaskConical,
    title: "Methodology Builder",
    desc: "Step-by-step wizard to design medical research methodology",
    link: "/methodology",
    color: "text-violet",
    bg: "bg-violet/10",
  },
  {
    icon: CheckCircle,
    title: "Citation Checker",
    desc: "Verify citations against your reference list automatically",
    link: "/citations",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BookOpen,
    title: "Paper Summarizer",
    desc: "Get simple explanations of complex research papers",
    link: "/search",
    color: "text-rose",
    bg: "bg-rose/10",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/research-hero-bg.png"
            alt="Research workspace"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          {/* Subtle color accents */}
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Research Assistant
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Your Digital
              <br />
              <span className="text-teal-300">Research Mentor</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              From topic selection to citation verification — navigate the complete research workflow with AI guidance designed for medical students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-lg">
                <Link to="/search">
                  <Search className="w-4 h-4 mr-2" />
                  Start Research
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white/25 backdrop-blur-sm font-semibold shadow-lg transition-all">
                <Link to="/dashboard">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Research Toolkit
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything medical students need to produce well-structured research papers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={f.link} className="feature-card block h-full group">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {f.desc}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12 text-foreground">
            Research Workflow
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {["Topic Selection", "Literature Review", "Gap Detection", "Methodology", "Citations"].map(
              (step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border shadow-sm">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">{step}</span>
                  </div>
                  {i < 4 && (
                    <ArrowRight className="hidden md:block w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Academic Research Mentor — Built for Medical Students</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
