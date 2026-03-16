import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, LogIn, UserPlus, ArrowRight, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl grid md:grid-cols-2 bg-card/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative z-10"
      >
        {/* Left Side - Branding / Visuals */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary/90 to-violet-600/90 text-white p-12 relative overflow-hidden">
          {/* Subtle noise pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">ResearchMentor</span>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                Unlock your <br/>
                <span className="text-white/80">academic potential.</span>
              </h1>
              <p className="text-lg text-white/70 leading-relaxed max-w-md">
                Discover literature, find critical research gaps, and build robust methodologies powered by advanced AI.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm font-medium text-white/60">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <span className="text-xs">RM</span>
                </div>
              ))}
            </div>
            <p>Join 10,000+ researchers worldwide</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-card">
          <div className="max-w-sm w-full mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center gap-2 mb-8 md:hidden text-primary">
              <BookOpen className="w-6 h-6" />
              <span className="font-display text-xl font-bold">ResearchMentor</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2">
                  {isLogin ? "Welcome back" : "Create an account"}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {isLogin 
                    ? "Enter your credentials to access your dashboard." 
                    : "Sign up to start your AI-powered research journey."}
                </p>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button variant="outline" className="h-12 bg-background hover:bg-muted/50 border-input transition-all">
                    <Chrome className="w-5 h-5 mr-2 text-red-500" /> Google
                  </Button>
                  <Button variant="outline" className="h-12 bg-background hover:bg-muted/50 border-input transition-all">
                    <Github className="w-5 h-5 mr-2" /> GitHub
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="researcher@university.edu" 
                        className="pl-10 h-12 bg-background/50 border-input focus:ring-primary/20"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-sm font-medium">Password</label>
                      {isLogin && (
                        <a href="#" className="text-sm font-medium text-primary hover:underline">
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 h-12 bg-background/50 border-input focus:ring-primary/20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 mt-6 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                         Authenticating...
                      </span>
                    ) : isLogin ? (
                      <span className="flex items-center">
                        <LogIn className="w-5 h-5 mr-2" /> Sign In
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserPlus className="w-5 h-5 mr-2" /> Create Account
                      </span>
                    )}
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    onClick={toggleMode}
                    className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center"
                    type="button"
                  >
                    {isLogin ? "Sign up now" : "Log in instead"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
