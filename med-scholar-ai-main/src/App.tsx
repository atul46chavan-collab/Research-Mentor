import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import NotFound from "@/pages/NotFound";
import ResearchBot from "@/components/ResearchBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<TopicSearch />} />
          <Route path="/literature" element={<LiteratureReview />} />
          <Route path="/gaps" element={<GapFinder />} />
          <Route path="/methodology" element={<MethodologyBuilder />} />
          <Route path="/citations" element={<CitationChecker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ResearchBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
