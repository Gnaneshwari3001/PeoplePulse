import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Login } from "@/components/auth/Login";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import PlaceholderPage from "@/pages/PlaceholderPage";
import TaskCenter from "@/pages/TaskCenter";
import TeamDirectory from "@/pages/TeamDirectory";
import ClaimsManager from "@/pages/ClaimsManager";
import SupportHelpdesk from "@/pages/SupportHelpdesk";

function AuthenticatedApp() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Module Routes - Functional pages */}
          <Route path="/tasks" element={<TaskCenter />} />
          <Route path="/team" element={<TeamDirectory />} />
          <Route path="/connect" element={<PlaceholderPage module="Connect" description="Internal messaging, team channels, and announcements" />} />
          <Route path="/claims" element={<ClaimsManager />} />
          <Route path="/salary" element={<PlaceholderPage module="Salary Center" description="Access payslips, tax information, and compensation details" />} />
          <Route path="/attendance" element={<PlaceholderPage module="Time & Attendance" description="Clock in/out, track time, and manage leave requests" />} />
          <Route path="/policies" element={<PlaceholderPage module="Policy Vault" description="Company policies, procedures, and documentation" />} />
          <Route path="/documents" element={<PlaceholderPage module="Document Box" description="Personal documents, contracts, and e-signatures" />} />
          <Route path="/hiring" element={<PlaceholderPage module="Hiring Hub" description="Job postings, referrals, and recruitment management" />} />
          <Route path="/calendar" element={<PlaceholderPage module="Smart Calendar" description="Events, meetings, holidays, and scheduling" />} />
          <Route path="/growth" element={<PlaceholderPage module="Growth & Feedback" description="Performance reviews, goals, and professional development" />} />
          <Route path="/support" element={<SupportHelpdesk />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
