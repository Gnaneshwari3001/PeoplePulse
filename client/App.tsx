import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Login } from "@/components/auth/Login";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import PlaceholderPage from "@/pages/PlaceholderPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Module Routes - Placeholder pages for now */}
          <Route path="/tasks" element={<PlaceholderPage module="Task Center" description="Manage your tasks, deadlines, and project status" />} />
          <Route path="/team" element={<PlaceholderPage module="Team Directory" description="Browse team members, contact information, and organizational structure" />} />
          <Route path="/connect" element={<PlaceholderPage module="Connect" description="Internal messaging, team channels, and announcements" />} />
          <Route path="/claims" element={<PlaceholderPage module="Claim Manager" description="Submit and track expense reimbursements" />} />
          <Route path="/salary" element={<PlaceholderPage module="Salary Center" description="Access payslips, tax information, and compensation details" />} />
          <Route path="/attendance" element={<PlaceholderPage module="Time & Attendance" description="Clock in/out, track time, and manage leave requests" />} />
          <Route path="/policies" element={<PlaceholderPage module="Policy Vault" description="Company policies, procedures, and documentation" />} />
          <Route path="/documents" element={<PlaceholderPage module="Document Box" description="Personal documents, contracts, and e-signatures" />} />
          <Route path="/hiring" element={<PlaceholderPage module="Hiring Hub" description="Job postings, referrals, and recruitment management" />} />
          <Route path="/calendar" element={<PlaceholderPage module="Smart Calendar" description="Events, meetings, holidays, and scheduling" />} />
          <Route path="/growth" element={<PlaceholderPage module="Growth & Feedback" description="Performance reviews, goals, and professional development" />} />
          <Route path="/support" element={<PlaceholderPage module="Support & Helpdesk" description="IT support, HR assistance, and help tickets" />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
