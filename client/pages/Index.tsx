import { 
  CheckSquare, 
  Users, 
  MessageSquare, 
  Receipt, 
  DollarSign, 
  Clock,
  FileText,
  FolderOpen,
  UserPlus,
  Calendar,
  TrendingUp,
  Headphones,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { currentUser } = useAuth();
  
  const getUserName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0]; // Get first name
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0]; // Get email username
    }
    return 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {getUserName()}! 👋
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your complete employee portal for tasks, communication, and workplace management
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Task Center */}
          <Link to="/tasks" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 z-10">
                Urgent
              </Badge>
              
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <CheckSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Task Center
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  View assigned tasks, create new tasks, track status
                </p>
                <div className="mt-auto">
                  <Badge className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-full">
                    8 pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Team Directory */}
          <Link to="/team" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Team Directory
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Searchable employee list with profiles and contact info
                </p>
                <div className="mt-auto">
                  <Badge className="bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full">
                    156 employees
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Connect */}
          <Link to="/connect" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 z-10">
                Urgent
              </Badge>
              
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Connect
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Internal chat, team channels, and announcements
                </p>
                <div className="mt-auto">
                  <Badge className="bg-purple-100 text-purple-700 text-xs px-3 py-2 rounded-full">
                    5 unread
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Claim Manager */}
          <Link to="/claims" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <Receipt className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  Claim Manager
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Submit reimbursements with receipt uploads
                </p>
                <div className="mt-auto">
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs px-3 py-2 rounded-full">
                    2 pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Salary Center */}
          <Link to="/salary" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Salary Center
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Monthly payslips, compensation overview, tax info
                </p>
                <div className="mt-auto">
                  <Badge className="bg-green-100 text-green-700 text-xs px-3 py-2 rounded-full">
                    Nov payslip ready
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Time & Attendance */}
          <Link to="/attendance" className="group">
            <Card className="relative h-full bg-gradient-to-br from-red-50 to-red-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  Time & Attendance
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Clock in/out, leave requests, and attendance tracking
                </p>
                <div className="mt-auto">
                  <Badge className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-full">
                    Clocked in
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Policy Vault */}
          <Link to="/policies" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Policy Vault
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Company policies, rules, and onboarding guides
                </p>
                <div className="mt-auto">
                  <Badge className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-full">
                    12 documents
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Document Box */}
          <Link to="/documents" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                  Document Box
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Personal HR documents and e-signature support
                </p>
                <div className="mt-auto">
                  <Badge className="bg-green-100 text-green-700 text-xs px-3 py-2 rounded-full">
                    3 to sign
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Hiring Hub */}
          <Link to="/hiring" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                  Hiring Hub
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Job postings, referrals, and interview management
                </p>
                <div className="mt-auto">
                  <Badge className="bg-pink-100 text-pink-700 text-xs px-3 py-2 rounded-full">
                    5 openings
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Smart Calendar */}
          <Link to="/calendar" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                  Smart Calendar
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Events, holidays, birthdays, and leave calendar
                </p>
                <div className="mt-auto">
                  <Badge className="bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full">
                    3 events today
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Growth & Feedback */}
          <Link to="/growth" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                  Growth & Feedback
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Performance reviews, OKRs, and 360° feedback
                </p>
                <div className="mt-auto">
                  <Badge className="bg-purple-100 text-purple-700 text-xs px-3 py-2 rounded-full">
                    Review due
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Support & Helpdesk */}
          <Link to="/support" className="group">
            <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-slate-600 transition-colors">
                  Support & Helpdesk
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Raise tickets for HR, IT, and admin support
                </p>
                <div className="mt-auto">
                  <Badge className="bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-full">
                    1 open ticket
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
}
