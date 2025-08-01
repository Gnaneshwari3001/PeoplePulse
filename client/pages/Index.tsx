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
  ArrowRight,
  Plus,
  Bell,
  Calendar as CalendarIcon,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const modules = [
  {
    id: "tasks",
    title: "Task Center",
    description: "View assigned tasks, create new tasks, track status",
    icon: CheckSquare,
    color: "from-blue-500 to-blue-600",
    href: "/tasks",
    stats: "8 pending",
    urgent: true
  },
  {
    id: "team",
    title: "Team Directory", 
    description: "Searchable employee list with profiles and contact info",
    icon: Users,
    color: "from-green-500 to-green-600", 
    href: "/team",
    stats: "156 employees"
  },
  {
    id: "connect",
    title: "Connect",
    description: "Internal chat, team channels, and announcements",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
    href: "/connect", 
    stats: "5 unread",
    urgent: true
  },
  {
    id: "claims",
    title: "Claim Manager",
    description: "Submit reimbursements with receipt uploads",
    icon: Receipt,
    color: "from-orange-500 to-orange-600",
    href: "/claims",
    stats: "2 pending"
  },
  {
    id: "salary",
    title: "Salary Center",
    description: "Monthly payslips, compensation overview, tax info",
    icon: DollarSign,
    color: "from-emerald-500 to-emerald-600",
    href: "/salary",
    stats: "Nov payslip ready"
  },
  {
    id: "attendance",
    title: "Time & Attendance", 
    description: "Clock in/out, leave requests, and attendance tracking",
    icon: Clock,
    color: "from-red-500 to-red-600",
    href: "/attendance",
    stats: "Clocked in"
  },
  {
    id: "policies",
    title: "Policy Vault",
    description: "Company policies, rules, and onboarding guides", 
    icon: FileText,
    color: "from-indigo-500 to-indigo-600",
    href: "/policies",
    stats: "12 documents"
  },
  {
    id: "documents",
    title: "Document Box",
    description: "Personal HR documents and e-signature support",
    icon: FolderOpen, 
    color: "from-teal-500 to-teal-600",
    href: "/documents",
    stats: "3 to sign"
  },
  {
    id: "hiring",
    title: "Hiring Hub",
    description: "Job postings, referrals, and interview management",
    icon: UserPlus,
    color: "from-pink-500 to-pink-600", 
    href: "/hiring",
    stats: "5 openings"
  },
  {
    id: "calendar",
    title: "Smart Calendar",
    description: "Events, holidays, birthdays, and leave calendar",
    icon: Calendar,
    color: "from-cyan-500 to-cyan-600",
    href: "/calendar", 
    stats: "3 events today"
  },
  {
    id: "growth",
    title: "Growth & Feedback",
    description: "Performance reviews, OKRs, and 360° feedback",
    icon: TrendingUp,
    color: "from-violet-500 to-violet-600",
    href: "/growth",
    stats: "Review due"
  },
  {
    id: "support",
    title: "Support & Helpdesk",
    description: "Raise tickets for HR, IT, and admin support",
    icon: Headphones,
    color: "from-slate-500 to-slate-600",
    href: "/support",
    stats: "1 open ticket"
  }
];

const kpis = [
  { label: "Pending Tasks", value: "8", icon: CheckSquare, color: "text-blue-600" },
  { label: "Today's Events", value: "3", icon: CalendarIcon, color: "text-purple-600" },
  { label: "Leave Balance", value: "12", icon: Clock, color: "text-green-600" },
  { label: "Next Pay Date", value: "Dec 1", icon: DollarSign, color: "text-emerald-600" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Good morning, John! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening at your workplace today
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Quick Actions
              </Button>
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{kpi.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    </div>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Notifications */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">New Updates Available</p>
                  <p className="text-sm text-blue-700">Your November payslip is ready, and you have 2 pending approvals</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Workspace</h2>
            <p className="text-gray-600">Choose a module to get started</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.id} to={module.href} className="group">
                  <Card className="relative h-full bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    
                    {module.urgent && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1">
                        Urgent
                      </Badge>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-lg font-semibold group-hover:text-gray-800 transition-colors">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {module.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {module.stats}
                        </Badge>
                        <Activity className="w-3 h-3 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>Common tasks you can do right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-blue-50">
                <Clock className="w-5 h-5" />
                <span className="text-xs">Clock In</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-green-50">
                <Plus className="w-5 h-5" />
                <span className="text-xs">New Task</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-purple-50">
                <Receipt className="w-5 h-5" />
                <span className="text-xs">Submit Claim</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-orange-50">
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Request Leave</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
