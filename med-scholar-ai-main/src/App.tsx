import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppNavbar from "@/components/AppNavbar";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import TopicSearch from "@/pages/TopicSearch";
import LiteratureReview from "@/pages/LiteratureReview";
import GapFinder from "@/pages/GapFinder";
import MethodologyBuilder from "@/pages/MethodologyBuilder";
import CitationChecker from "@/pages/CitationChecker";
import SearchHistory from "@/pages/SearchHistory";
import JournalRecommendation from "@/pages/JournalRecommendation";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ResearchBot from "@/components/ResearchBot";
import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="research_mentor_theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
        <ResearchBot />
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <>
      {!isAuthPage && <AppNavbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<TopicSearch />} />
          <Route path="/literature" element={<LiteratureReview />} />
          <Route path="/gaps" element={<GapFinder />} />
          <Route path="/methodology" element={<MethodologyBuilder />} />
          <Route path="/citations" element={<CitationChecker />} />
          <Route path="/history" element={<SearchHistory />} />
        <Route path="/journals" element={<JournalRecommendation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
