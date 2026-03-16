import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Lightbulb,
  FlaskConical,
  CheckCircle,
  TrendingUp,
  Clock,
  BookOpen,
  BookMarked,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  PieChart, Pie, ResponsiveContainer, Cell,
} from "recharts";

const Dashboard = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPapers = localStorage.getItem('research_papers');
    const savedTopic = localStorage.getItem('research_topic');
    if (savedPapers) setPapers(JSON.parse(savedPapers));
    if (savedTopic) setTopic(savedTopic);
    setLoading(false);
  }, []);

  const steps = [
    { label: "Topic Selected", icon: Search, done: !!topic, link: "/search" },
    { label: "Literature Review", icon: FileText, done: papers.length > 0, link: "/literature" },
    { label: "Gap Analysis", icon: Lightbulb, done: papers.length > 0, link: "/gaps" },
    { label: "Methodology Design", icon: FlaskConical, done: false, link: "/methodology" },
    { label: "Citation Verification", icon: CheckCircle, done: false, link: "/citations" },
    { label: "Journal Guidance", icon: BookMarked, done: false, link: "/journals" },
  ];

  const completedSteps = steps.filter((s) => s.done).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  const stats = [
    { label: "Papers Found", value: papers.length.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Current Topic", value: topic || "None", icon: Search, color: "text-amber" },
    { label: "Completion", value: `${Math.round(progressPercent)}%`, icon: TrendingUp, color: "text-violet" },
    { label: "Status", value: topic ? "Active" : "Idle", icon: Clock, color: "text-teal" },
  ];

  // Progress Donut Chart
  const donutData = [
    { name: "Completed", value: completedSteps },
    { name: "Remaining", value: steps.length - completedSteps },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Research Dashboard {topic ? `for "${topic}"` : ""}
        </h1>
        <p className="text-muted-foreground mb-8">
          Track your research progress across all stages.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="feature-card text-center"
          >
            <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
            <div className="text-xl font-bold text-foreground truncate px-2">{s.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      {papers.length > 0 && (
        <div className="flex justify-center mb-8">
          {/* Research Progress Donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 flex flex-col items-center justify-center w-full max-w-sm"
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">
              Workflow Progress
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="hsl(173, 58%, 39%)" />
                  <Cell fill="hsl(220, 14%, 92%)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-2">
              <span className="text-2xl font-bold text-foreground">{completedSteps}/{steps.length}</span>
              <p className="text-xs text-muted-foreground mt-1">Steps Completed</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Research Progress
        </h2>
        <Progress value={progressPercent} className="h-3 mb-6" />
        <div className="space-y-2">
          {steps.map((step) => (
            <Link
              key={step.label}
              to={step.link}
              className={`progress-step ${
                step.done ? "progress-step-done" : "hover:bg-muted/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.done ? "bg-accent/20" : "bg-muted"
                }`}
              >
                <step.icon
                  className={`w-4 h-4 ${
                    step.done ? "text-accent" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  step.done ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {step.done && (
                <CheckCircle className="w-4 h-4 text-accent ml-auto" />
              )}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/search" className="feature-card group">
          <Search className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-semibold text-foreground">Search New Topic</h3>
          <p className="text-sm text-muted-foreground">Find papers on a new research topic</p>
        </Link>
        <Link to="/methodology" className="feature-card group">
          <FlaskConical className="w-6 h-6 text-violet mb-2" />
          <h3 className="font-semibold text-foreground">Build Methodology</h3>
          <p className="text-sm text-muted-foreground">Design your research methodology</p>
        </Link>
        <Link to="/citations" className="feature-card group">
          <CheckCircle className="w-6 h-6 text-teal mb-2" />
          <h3 className="font-semibold text-foreground">Check Citations</h3>
          <p className="text-sm text-muted-foreground">Verify your reference list</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
