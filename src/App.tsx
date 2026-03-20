import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthGuard from "@/components/AuthGuard";
import TutorDashboard from "./pages/TutorDashboard";
import TutorLogin from "./pages/TutorLogin";
import ResetPassword from "./pages/ResetPassword";
import StudentView from "./pages/StudentView";
import StudentQRPage from "./pages/StudentQRPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<TutorLogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<AuthGuard><TutorDashboard /></AuthGuard>} />
          <Route path="/student" element={<StudentView />} />
          <Route path="/join" element={<StudentQRPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
