import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Login } from "@/components/auth/Login";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { VerificationSuccess } from "@/components/auth/VerificationSuccess";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import PlaceholderPage from "@/pages/PlaceholderPage";
import TaskCenter from "@/pages/TaskCenter";
import TeamDirectory from "@/pages/TeamDirectory";
import ClaimsManager from "@/pages/ClaimsManager";
import SupportHelpdesk from "@/pages/SupportHelpdesk";
import Connect from "@/pages/Connect";
import SalaryCenter from "@/pages/SalaryCenter";
import HiringHub from "@/pages/HiringHub";
import GrowthFeedback from "@/pages/GrowthFeedback";
import ApprovalWorkflow from "@/pages/ApprovalWorkflow";
import PolicyVault from "@/pages/PolicyVault";
import EmployeeManagement from "@/pages/EmployeeManagement";
import Analytics from "@/pages/Analytics";
import SendAnnouncement from "@/pages/SendAnnouncement";
import BulkImport from "@/pages/BulkImport";

function AuthenticatedApp() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  // Check if email is verified
  if (!currentUser.emailVerified) {
    return <EmailVerification />;
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
          <Route path="/connect" element={<Connect />} />
          <Route path="/claims" element={<ClaimsManager />} />
          <Route path="/salary" element={<SalaryCenter />} />
          <Route
            path="/attendance"
            element={
              <PlaceholderPage
                module="Time & Attendance"
                description="Clock in/out, track time, and manage leave requests"
              />
            }
          />
          <Route path="/policies" element={<PolicyVault />} />
          <Route
            path="/documents"
            element={
              <PlaceholderPage
                module="Document Box"
                description="Personal documents, contracts, and e-signatures"
              />
            }
          />
          <Route path="/hiring" element={<HiringHub />} />
          <Route
            path="/calendar"
            element={
              <PlaceholderPage
                module="Smart Calendar"
                description="Events, meetings, holidays, and scheduling"
              />
            }
          />
          <Route path="/growth" element={<GrowthFeedback />} />
          <Route path="/support" element={<SupportHelpdesk />} />
          <Route path="/workflow" element={<ApprovalWorkflow />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/announcements" element={<SendAnnouncement />} />
          <Route path="/bulk-import" element={<BulkImport />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/settings" element={<PlaceholderPage module="Settings" description="System configuration and preferences" />} />
          <Route
            path="/verification-success"
            element={<VerificationSuccess />}
          />

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
