import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Building,
  UserPlus,
  Award,
  Calendar,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Shield,
  Database,
  Clock,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole, DEPARTMENT_CONFIG, getRoleDisplayName, getDepartmentDisplayName, getRoleColor } from "@/types/roles";

interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  permission: string;
  stats?: {
    label: string;
    value: string | number;
    trend?: string;
  };
}

export function RoleBasedDashboard() {
  const { userProfile, canAccessModule, hasPermission } = useAuth();

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  // Define role-specific dashboard modules
  const getDashboardModules = (role: UserRole): DashboardModule[] => {
    const baseModules: DashboardModule[] = [
      {
        id: 'tasks',
        title: 'My Tasks',
        description: 'View and manage your assigned tasks',
        icon: CheckSquare,
        path: '/tasks',
        color: 'from-green-500 to-green-600',
        permission: 'tasks',
        stats: { label: 'Pending', value: 8, trend: '+2' }
      },
      {
        id: 'team',
        title: 'Team Directory',
        description: 'View team members and contacts',
        icon: Users,
        path: '/team',
        color: 'from-blue-500 to-blue-600',
        permission: 'team'
      },
      {
        id: 'requests',
        title: 'My Requests',
        description: 'Track your approval requests',
        icon: FileText,
        path: '/workflow',
        color: 'from-purple-500 to-purple-600',
        permission: 'approval_workflow',
        stats: { label: 'Pending', value: 3 }
      },
      {
        id: 'growth',
        title: 'Growth & Feedback',
        description: 'Performance reviews and feedback',
        icon: TrendingUp,
        path: '/growth',
        color: 'from-violet-500 to-violet-600',
        permission: 'growth_feedback'
      }
    ];

    const managerModules: DashboardModule[] = [
      {
        id: 'approval_management',
        title: 'Approval Management',
        description: 'Review and approve team requests',
        icon: Shield,
        path: '/workflow',
        color: 'from-orange-500 to-orange-600',
        permission: 'approval_workflow',
        stats: { label: 'Pending Approvals', value: 12, trend: '+4' }
      },
      {
        id: 'team_management',
        title: 'Team Management',
        description: 'Manage team members and performance',
        icon: Users,
        path: '/team',
        color: 'from-blue-500 to-blue-600',
        permission: 'team',
        stats: { label: 'Team Size', value: 8 }
      },
      {
        id: 'performance',
        title: 'Team Performance',
        description: 'Monitor team goals and achievements',
        icon: Target,
        path: '/growth',
        color: 'from-green-500 to-green-600',
        permission: 'growth_feedback',
        stats: { label: 'Goals Met', value: '85%' }
      }
    ];

    const hrModules: DashboardModule[] = [
      {
        id: 'employee_management',
        title: 'Employee Management',
        description: 'Manage all employees and their profiles',
        icon: Database,
        path: '/team',
        color: 'from-purple-500 to-purple-600',
        permission: 'employees',
        stats: { label: 'Total Employees', value: 156 }
      },
      {
        id: 'hiring',
        title: 'Hiring Hub',
        description: 'Manage job postings and recruitment',
        icon: UserPlus,
        path: '/hiring',
        color: 'from-pink-500 to-pink-600',
        permission: 'hiring',
        stats: { label: 'Open Positions', value: 5 }
      },
      {
        id: 'policy_management',
        title: 'Policy Management',
        description: 'Create and manage company policies',
        icon: FileText,
        path: '/policies',
        color: 'from-indigo-500 to-indigo-600',
        permission: 'policies',
        stats: { label: 'Active Policies', value: 24 }
      },
      {
        id: 'compensation',
        title: 'Compensation Management',
        description: 'Manage salaries and benefits',
        icon: DollarSign,
        path: '/salary',
        color: 'from-emerald-500 to-emerald-600',
        permission: 'salary'
      }
    ];

    const adminModules: DashboardModule[] = [
      {
        id: 'system_settings',
        title: 'System Settings',
        description: 'Manage system configuration',
        icon: Settings,
        path: '/admin/settings',
        color: 'from-gray-500 to-gray-600',
        permission: 'system',
        stats: { label: 'System Health', value: '99%' }
      },
      {
        id: 'user_management',
        title: 'User Management',
        description: 'Manage user roles and permissions',
        icon: Users,
        path: '/admin/users',
        color: 'from-red-500 to-red-600',
        permission: 'users',
        stats: { label: 'Active Users', value: 142 }
      },
      {
        id: 'analytics',
        title: 'Analytics & Reports',
        description: 'View system analytics and reports',
        icon: BarChart3,
        path: '/admin/analytics',
        color: 'from-cyan-500 to-cyan-600',
        permission: 'reports'
      }
    ];

    // Role-based module selection
    switch (role) {
      case 'super_admin':
      case 'admin':
        return [...baseModules, ...managerModules, ...hrModules, ...adminModules];
      
      case 'hr_manager':
        return [...baseModules, ...managerModules, ...hrModules];
      
      case 'department_manager':
      case 'team_lead':
        return [...baseModules, ...managerModules];
      
      case 'senior_employee':
        return [...baseModules, {
          id: 'mentoring',
          title: 'Mentoring',
          description: 'Mentor junior team members',
          icon: Award,
          path: '/mentoring',
          color: 'from-yellow-500 to-yellow-600',
          permission: 'mentoring'
        }];
      
      default:
        return baseModules;
    }
  };

  const modules = getDashboardModules(userProfile.role).filter(module => 
    canAccessModule(module.permission)
  );

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${userProfile.displayName}!`;
  };

  const getQuickStats = () => {
    const baseStats = [
      { label: 'Tasks Completed', value: 24, color: 'text-green-600' },
      { label: 'Hours Logged', value: '42.5', color: 'text-blue-600' },
      { label: 'Messages', value: 18, color: 'text-purple-600' }
    ];

    // Add role-specific stats
    if (['admin', 'hr_manager', 'department_manager'].includes(userProfile.role)) {
      baseStats.push(
        { label: 'Pending Approvals', value: 12, color: 'text-orange-600' },
        { label: 'Team Performance', value: '85%', color: 'text-green-600' }
      );
    }

    return baseStats;
  };

  return (
    <div className="space-y-8">
      {/* Role-based Header */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getWelcomeMessage()}
            </h1>
            <div className="flex items-center gap-4">
              <Badge className={getRoleColor(userProfile.role)}>
                {getRoleDisplayName(userProfile.role)}
              </Badge>
              <Badge variant="outline">
                {getDepartmentDisplayName(userProfile.department)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {userProfile.employeeId}
              </Badge>
            </div>
            <p className="text-gray-600 mt-2">
              {userProfile.role === 'employee' ? 'Your personalized workspace' :
               userProfile.role.includes('manager') ? 'Manage your team and department' :
               userProfile.role === 'admin' ? 'System administration dashboard' :
               'Welcome to your dashboard'}
            </p>
          </div>
          
          {/* Quick Actions based on role */}
          <div className="flex gap-3">
            {hasPermission('approval_workflow', 'create') && (
              <Link to="/workflow">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <FileText className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </Link>
            )}
            {hasPermission('tasks', 'create') && (
              <Link to="/tasks">
                <Button variant="outline">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {getQuickStats().map((stat, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role-based Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Link key={module.id} to={module.path} className="group">
              <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3",
                    `bg-gradient-to-br ${module.color}`
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {module.description}
                  </p>
                  
                  {module.stats && (
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{module.stats.label}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{module.stats.value}</span>
                          {module.stats.trend && (
                            <span className="text-green-600 text-xs">{module.stats.trend}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Role-specific Quick Access */}
      {['admin', 'hr_manager'].includes(userProfile.role) && (
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userProfile.role === 'hr_manager' && (
                <>
                  <Button variant="outline" className="h-16 flex flex-col gap-1">
                    <UserPlus className="w-5 h-5" />
                    <span className="text-xs">Add Employee</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1">
                    <FileText className="w-5 h-5" />
                    <span className="text-xs">New Policy</span>
                  </Button>
                </>
              )}
              {userProfile.role === 'admin' && (
                <>
                  <Button variant="outline" className="h-16 flex flex-col gap-1">
                    <Settings className="w-5 h-5" />
                    <span className="text-xs">System Config</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-xs">View Reports</span>
                  </Button>
                </>
              )}
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Shield className="w-5 h-5" />
                <span className="text-xs">Approve Requests</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Team Chat</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
