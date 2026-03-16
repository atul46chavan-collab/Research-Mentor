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
  History,
  Menu,
  X,
  BookMarked,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";

const navItems = [
  { path: "/", label: "Home", icon: BookOpen },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/search", label: "Topic Search", icon: Search },
  { path: "/literature", label: "Literature", icon: FileText },
  { path: "/gaps", label: "Gap Finder", icon: Lightbulb },
  { path: "/methodology", label: "Methodology", icon: FlaskConical },
  { path: "/citations", label: "Citations", icon: CheckCircle },
  { path: "/history", label: "History", icon: History },
  { path: "/journals", label: "Journals", icon: BookMarked },
];

const AppNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    // Implement actual logout logic here if needed
    navigate("/login");
  };

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

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="w-9 h-9 border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@researcher" />
                  <AvatarFallback className="bg-primary/10 text-primary">RM</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Researcher</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      researcher@university.edu
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
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
