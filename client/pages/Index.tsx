import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, MobileSidebarTrigger } from "@/components/Sidebar";
import { RoleBasedDashboard } from "@/components/RoleBasedDashboard";

export default function Index() {
  const { userProfile } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <MobileSidebarTrigger onClick={() => setIsMobileOpen(true)} />
      
      {/* Main Content */}
      <div className="lg:ml-72 transition-all duration-300 p-8">
        <RoleBasedDashboard />
      </div>
    </div>
  );
}
