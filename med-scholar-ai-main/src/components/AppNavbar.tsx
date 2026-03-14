import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  FileText,
  Lightbulb,
  FlaskConical,
  CheckCircle,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Home", icon: BookOpen },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/search", label: "Topic Search", icon: Search },
  { path: "/literature", label: "Literature", icon: FileText },
  { path: "/gaps", label: "Gap Finder", icon: Lightbulb },
  { path: "/methodology", label: "Methodology", icon: FlaskConical },
  { path: "/citations", label: "Citations", icon: CheckCircle },
];

const AppNavbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ResearchMentor" className="w-8 h-8" />
            <span className="font-display text-lg font-bold text-foreground">
              ResearchMentor
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pb-4 space-y-1"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
