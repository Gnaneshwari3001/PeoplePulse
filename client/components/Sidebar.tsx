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
  Home
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/", color: "from-slate-500 to-slate-600" },
  { icon: CheckSquare, label: "Task Center", path: "/tasks", color: "from-green-500 to-green-600", badge: "8", urgent: true },
  { icon: Users, label: "Team Directory", path: "/team", color: "from-blue-500 to-blue-600", badge: "156" },
  { icon: MessageSquare, label: "Connect", path: "/connect", color: "from-purple-500 to-purple-600", badge: "5", urgent: true },
  { icon: Receipt, label: "Claim Manager", path: "/claims", color: "from-orange-500 to-orange-600", badge: "2" },
  { icon: DollarSign, label: "Salary Center", path: "/salary", color: "from-emerald-500 to-emerald-600", badge: "New" },
  { icon: Clock, label: "Time & Attendance", path: "/attendance", color: "from-red-500 to-red-600", badge: "In" },
  { icon: FileText, label: "Policy Vault", path: "/policies", color: "from-indigo-500 to-indigo-600", badge: "12" },
  { icon: FolderOpen, label: "Document Box", path: "/documents", color: "from-teal-500 to-teal-600", badge: "3" },
  { icon: UserPlus, label: "Hiring Hub", path: "/hiring", color: "from-pink-500 to-pink-600", badge: "5" },
  { icon: Calendar, label: "Smart Calendar", path: "/calendar", color: "from-cyan-500 to-cyan-600", badge: "3" },
  { icon: TrendingUp, label: "Growth & Feedback", path: "/growth", color: "from-violet-500 to-violet-600", badge: "Due" },
  { icon: Headphones, label: "Support & Helpdesk", path: "/support", color: "from-slate-500 to-slate-600", badge: "1" },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ease-in-out",
      isExpanded ? "w-72" : "w-16"
    )}>
      {/* Glass background */}
      <div className="h-full bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-xl">
        {/* Toggle button */}
        <div className="absolute -right-3 top-6 z-50">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            size="sm"
            className="h-6 w-6 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 p-0"
            variant="ghost"
          >
            {isExpanded ? (
              <ChevronLeft className="h-3 w-3 text-gray-600" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="h-full overflow-y-auto py-6 px-3 scrollbar-hide">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group relative flex items-center rounded-xl transition-all duration-300 ease-in-out",
                    isExpanded ? "p-3" : "p-2 justify-center",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg backdrop-blur-sm border border-blue-200/50" 
                      : "hover:bg-white/50 hover:shadow-md hover:backdrop-blur-sm"
                  )}
                >
                  {/* Urgent indicator */}
                  {item.urgent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse z-10" />
                  )}

                  {/* Icon container */}
                  <div className={cn(
                    "relative flex items-center justify-center rounded-lg shadow-lg transition-all duration-300",
                    isExpanded ? "w-10 h-10" : "w-8 h-8",
                    isActive 
                      ? `bg-gradient-to-br ${item.color} scale-110 shadow-xl`
                      : `bg-gradient-to-br ${item.color} group-hover:scale-105`
                  )}>
                    <item.icon className={cn(
                      "text-white transition-all duration-300",
                      isExpanded ? "w-5 h-5" : "w-4 h-4"
                    )} />
                  </div>

                  {/* Label and badge */}
                  {isExpanded && (
                    <div className="ml-3 flex-1 flex items-center justify-between min-w-0">
                      <span className={cn(
                        "font-medium text-sm transition-colors duration-300 truncate",
                        isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {item.label}
                      </span>
                      
                      {item.badge && (
                        <Badge className={cn(
                          "ml-2 text-xs px-2 py-0.5 font-medium transition-all duration-300",
                          item.urgent 
                            ? "bg-red-500 text-white shadow-lg" 
                            : isActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        )}>
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-12 bg-gray-900 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
