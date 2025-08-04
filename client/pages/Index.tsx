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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  Bell,
  Star,
  Filter,
  GitBranch,
  FileCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar, MobileSidebarTrigger } from "@/components/Sidebar";
import { RoleBasedDashboard } from "@/components/RoleBasedDashboard";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Index() {
  const { currentUser, userProfile } = useAuth();
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
  
  const getUserName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  const panels = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Tasks Completed</p>
                    <p className="text-2xl font-bold text-green-900">24</p>
                    <p className="text-xs text-green-600">+12% from last week</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Hours Logged</p>
                    <p className="text-2xl font-bold text-blue-900">42.5</p>
                    <p className="text-xs text-blue-600">This week</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-200/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Messages</p>
                    <p className="text-2xl font-bold text-purple-900">18</p>
                    <p className="text-xs text-purple-600">5 unread</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Task completed: UI Design Review</p>
                    <p className="text-xs text-gray-600">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New message from Sarah Chen</p>
                    <p className="text-xs text-gray-600">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50/50">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Calendar reminder: Team standup at 10 AM</p>
                    <p className="text-xs text-gray-600">30 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'tasks',
      title: 'Task Center',
      icon: CheckSquare,
      color: 'from-green-500 to-emerald-600',
      urgent: true,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Tasks</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-white/50 backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                      <h4 className="font-medium">Q4 Performance Review</h4>
                      <p className="text-sm text-gray-600">Complete annual performance review documentation</p>
                      <p className="text-xs text-red-600 mt-1">Due: Today</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-700">Urgent</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Update Project Documentation</h4>
                      <p className="text-sm text-gray-600">Review and update API documentation</p>
                      <p className="text-xs text-gray-500 mt-1">Due: Tomorrow</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Team Meeting Preparation</h4>
                      <p className="text-sm text-gray-600">Prepare agenda for weekly team sync</p>
                      <p className="text-xs text-gray-500 mt-1">Due: Friday</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Low</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Link to="/tasks">
            <Button variant="outline" className="w-full bg-white/50 backdrop-blur-sm hover:bg-white/70">
              View All Tasks
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )
    },
    {
      id: 'team',
      title: 'Team Directory',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <Button size="sm" variant="outline" className="bg-white/50 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              View All (156)
            </Button>
          </div>

          <div className="grid gap-4">
            {[
              { name: "Sarah Chen", role: "Product Manager", avatar: "SC", status: "online" },
              { name: "Alex Kumar", role: "Senior Developer", avatar: "AK", status: "away" },
              { name: "Maria Rodriguez", role: "UX Designer", avatar: "MR", status: "online" },
              { name: "James Wilson", role: "DevOps Engineer", avatar: "JW", status: "busy" }
            ].map((member, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                        member.status === "online" ? "bg-green-500" :
                        member.status === "away" ? "bg-yellow-500" : "bg-red-500"
                      )}></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="hover:bg-white/50">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link to="/team">
            <Button variant="outline" className="w-full bg-white/50 backdrop-blur-sm hover:bg-white/70">
              View Full Directory
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )
    },
    {
      id: 'messages',
      title: 'Connect',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      urgent: true,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Messages</h3>
            <Badge className="bg-red-100 text-red-700">5 unread</Badge>
          </div>

          <div className="space-y-4">
            {[
              { name: "Sarah Chen", message: "Can we discuss the project timeline?", time: "2 min ago", unread: true },
              { name: "Team Announcements", message: "New office policies have been updated", time: "1 hour ago", unread: true },
              { name: "Alex Kumar", message: "Code review completed ✅", time: "3 hours ago", unread: false }
            ].map((msg, index) => (
              <Card key={index} className={cn(
                "bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer",
                msg.unread && "border-purple-200/70 bg-purple-50/30"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {msg.unread && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{msg.name}</h4>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link to="/connect">
            <Button variant="outline" className="w-full bg-white/50 backdrop-blur-sm hover:bg-white/70">
              Open Chat
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )
    },
    {
      id: 'workflow',
      title: 'Approval Workflow',
      icon: GitBranch,
      color: 'from-blue-500 to-indigo-600',
      urgent: true,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Requests</h3>
            <Badge className="bg-red-100 text-red-700">3 pending</Badge>
          </div>

          <div className="space-y-4">
            {[
              { id: "REQ-001", title: "Vacation Leave Request", status: "pending", priority: "medium", submitter: "John Doe", type: "leave" },
              { id: "REQ-002", title: "New Laptop Request", status: "in-progress", priority: "high", submitter: "Alex Kumar", type: "it-support" },
              { id: "REQ-003", title: "Benefits Enrollment", status: "escalated", priority: "medium", submitter: "Maria Rodriguez", type: "hr-query" }
            ].map((request, index) => (
              <Card key={index} className={cn(
                "bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer",
                request.status === "pending" && "border-yellow-200/70 bg-yellow-50/30",
                request.status === "escalated" && "border-red-200/70 bg-red-50/30"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {request.status === "escalated" && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                    {request.status === "pending" && <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>}
                    {request.status === "in-progress" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{request.title}</h4>
                        <Badge className={
                          request.priority === "high" ? "bg-red-100 text-red-700" :
                          request.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }>
                          {request.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600">By: {request.submitter}</p>
                        <span className="text-xs text-gray-500">{request.id}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Link to="/workflow">
            <Button variant="outline" className="w-full bg-white/50 backdrop-blur-sm hover:bg-white/70">
              View All Requests
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )
    }
  ];

  const scrollToPanel = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const panelWidth = container.clientWidth;
    const currentScroll = container.scrollLeft;
    
    if (direction === 'left') {
      container.scrollTo({ left: currentScroll - panelWidth, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: currentScroll + panelWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <MobileSidebarTrigger onClick={() => setIsMobileOpen(true)} />

      {/* Main Content */}
      <div className="lg:ml-72 transition-all duration-300">
        {/* Welcome Section */}
        <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="px-8 py-8">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Welcome back, {getUserName()}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Your personalized dashboard with quick access to all your workplace tools
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Panels */}
        <div className="relative">
          {/* Navigation arrows */}
          <Button
            onClick={() => scrollToPanel('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 p-0"
            variant="ghost"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Button>
          
          <Button
            onClick={() => scrollToPanel('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 p-0"
            variant="ghost"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </Button>

          {/* Panels container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {panels.map((panel, index) => (
              <div key={panel.id} className="min-w-full snap-start">
                <div className="p-8">
                  <div className="max-w-4xl mx-auto">
                    {/* Panel header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn(
                          "p-3 rounded-xl shadow-lg bg-gradient-to-br",
                          panel.color
                        )}>
                          <panel.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {panel.title}
                            {panel.urgent && (
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            )}
                          </h2>
                        </div>
                      </div>
                      
                      {/* Panel navigation dots */}
                      <div className="flex items-center gap-2">
                        {panels.map((_, dotIndex) => (
                          <div
                            key={dotIndex}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all duration-300",
                              index === dotIndex ? "bg-purple-500 w-8" : "bg-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Panel content */}
                    <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                      {panel.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-xl border border-white/20">
            {[
              { icon: CheckSquare, label: "Tasks", path: "/tasks", urgent: true },
              { icon: MessageSquare, label: "Messages", path: "/connect", urgent: true },
              { icon: GitBranch, label: "Workflow", path: "/workflow", urgent: true },
              { icon: Calendar, label: "Calendar", path: "/calendar" },
              { icon: Users, label: "Team", path: "/team" }
            ].map((action, index) => (
              <Link key={index} to={action.path}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-white/70 p-0"
                >
                  <action.icon className="w-5 h-5" />
                  {action.urgent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
