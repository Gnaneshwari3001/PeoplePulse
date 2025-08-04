import { useState } from "react";
import { 
  Plus, 
  UserPlus, 
  FileText, 
  Calendar, 
  MessageSquare,
  CheckSquare,
  DollarSign,
  Shield,
  Settings,
  Building,
  Briefcase,
  Mail,
  Phone,
  Clock,
  Target,
  Award,
  BookOpen,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleAccess, HROnly, ManagerOnly, AdminOnly } from "@/components/RoleAccess";
import { UserRole, Department } from "@/types/roles";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
  requiredRoles?: UserRole[];
  requiredPermissions?: Array<{ module: string; action: string }>;
  badge?: string;
  urgent?: boolean;
}

interface QuickActionsProps {
  layout?: "grid" | "list" | "compact";
  showTitle?: boolean;
  maxActions?: number;
}

export function QuickActions({ layout = "grid", showTitle = true, maxActions }: QuickActionsProps) {
  const { userProfile, hasPermission } = useAuth();
  const { toast } = useToast();

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isNewPolicyOpen, setIsNewPolicyOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);

  // Quick employee form
  const [quickEmployee, setQuickEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee" as UserRole,
    department: "engineering" as Department
  });

  // Quick task form
  const [quickTask, setQuickTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignee: ""
  });

  // Quick policy form
  const [quickPolicy, setQuickPolicy] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium"
  });

  // Quick meeting form
  const [quickMeeting, setQuickMeeting] = useState({
    title: "",
    participants: "",
    date: "",
    time: "",
    duration: "30"
  });

  const handleQuickAddEmployee = async () => {
    if (!quickEmployee.firstName || !quickEmployee.lastName || !quickEmployee.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate credentials
    const username = `${quickEmployee.firstName.toLowerCase()}.${quickEmployee.lastName.toLowerCase()}`;
    const password = generatePassword();

    toast({
      title: "Employee Added",
      description: `${quickEmployee.firstName} ${quickEmployee.lastName} added successfully. Credentials: ${username} / ${password}`,
    });

    // Reset form
    setQuickEmployee({
      firstName: "",
      lastName: "",
      email: "",
      role: "employee",
      department: "engineering"
    });
    setIsAddEmployeeOpen(false);
  };

  const handleQuickCreateTask = async () => {
    if (!quickTask.title) {
      toast({
        title: "Missing Information",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Task Created",
      description: `Task "${quickTask.title}" created successfully`,
    });

    // Reset form
    setQuickTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignee: ""
    });
    setIsCreateTaskOpen(false);
  };

  const handleQuickCreatePolicy = async () => {
    if (!quickPolicy.title) {
      toast({
        title: "Missing Information",
        description: "Please enter a policy title",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Policy Created",
      description: `Policy "${quickPolicy.title}" created as draft`,
    });

    // Reset form
    setQuickPolicy({
      title: "",
      description: "",
      category: "general",
      priority: "medium"
    });
    setIsNewPolicyOpen(false);
  };

  const handleScheduleMeeting = async () => {
    if (!quickMeeting.title || !quickMeeting.date) {
      toast({
        title: "Missing Information",
        description: "Please enter meeting title and date",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meeting Scheduled",
      description: `Meeting "${quickMeeting.title}" scheduled successfully`,
    });

    // Reset form
    setQuickMeeting({
      title: "",
      participants: "",
      date: "",
      time: "",
      duration: "30"
    });
    setIsScheduleMeetingOpen(false);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  };

  const getQuickActions = (): QuickAction[] => {
    const actions: QuickAction[] = [
      {
        id: "add-employee",
        title: "Add Employee",
        description: "Quickly add a new employee with auto-generated credentials",
        icon: UserPlus,
        color: "from-blue-500 to-blue-600",
        action: () => setIsAddEmployeeOpen(true),
        requiredRoles: ["hr_manager", "admin"],
        badge: "Quick"
      },
      {
        id: "create-task",
        title: "Create Task",
        description: "Create and assign a new task",
        icon: CheckSquare,
        color: "from-green-500 to-green-600",
        action: () => setIsCreateTaskOpen(true),
        requiredPermissions: [{ module: "tasks", action: "create" }]
      },
      {
        id: "new-policy",
        title: "New Policy",
        description: "Create a new company policy",
        icon: FileText,
        color: "from-indigo-500 to-indigo-600",
        action: () => setIsNewPolicyOpen(true),
        requiredPermissions: [{ module: "policies", action: "create" }]
      },
      {
        id: "schedule-meeting",
        title: "Schedule Meeting",
        description: "Schedule a team meeting or appointment",
        icon: Calendar,
        color: "from-purple-500 to-purple-600",
        action: () => setIsScheduleMeetingOpen(true)
      },
      {
        id: "send-announcement",
        title: "Send Announcement",
        description: "Send announcement to team or department",
        icon: MessageSquare,
        color: "from-orange-500 to-orange-600",
        action: () => toast({ title: "Feature Coming Soon", description: "Announcement feature will be available soon" }),
        requiredRoles: ["team_lead", "department_manager", "hr_manager", "admin"]
      },
      {
        id: "generate-report",
        title: "Generate Report",
        description: "Create automated reports and analytics",
        icon: Target,
        color: "from-teal-500 to-teal-600",
        action: () => toast({ title: "Feature Coming Soon", description: "Report generation will be available soon" }),
        requiredRoles: ["department_manager", "hr_manager", "admin"]
      },
      {
        id: "bulk-import",
        title: "Bulk Import",
        description: "Import employees or data from spreadsheet",
        icon: Building,
        color: "from-red-500 to-red-600",
        action: () => toast({ title: "Feature Coming Soon", description: "Bulk import will be available soon" }),
        requiredRoles: ["hr_manager", "admin"]
      },
      {
        id: "system-settings",
        title: "System Settings",
        description: "Configure system settings and preferences",
        icon: Settings,
        color: "from-gray-500 to-gray-600",
        action: () => toast({ title: "Feature Coming Soon", description: "System settings will be available soon" }),
        requiredRoles: ["admin"]
      }
    ];

    // Filter based on permissions
    return actions.filter(action => {
      if (action.requiredRoles && !action.requiredRoles.includes(userProfile?.role as UserRole)) {
        return false;
      }
      if (action.requiredPermissions) {
        return action.requiredPermissions.some(perm => hasPermission(perm.module, perm.action));
      }
      return true;
    });
  };

  const actions = getQuickActions();
  const displayActions = maxActions ? actions.slice(0, maxActions) : actions;

  if (layout === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        {displayActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              size="sm"
              variant="outline"
              onClick={action.action}
              className="h-8 px-3"
            >
              <IconComponent className="w-3 h-3 mr-1" />
              {action.title}
            </Button>
          );
        })}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className="space-y-2">
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick Actions
          </h3>
        )}
        {displayActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              onClick={action.action}
              className="w-full justify-start h-12"
            >
              <div className={cn(
                "p-2 rounded-lg mr-3",
                `bg-gradient-to-br ${action.color}`
              )}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
              {action.badge && (
                <Badge className="ml-auto bg-yellow-100 text-yellow-800">
                  {action.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </h3>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card
              key={action.id}
              className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={action.action}
            >
              <CardContent className="p-4 text-center">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform",
                  `bg-gradient-to-br ${action.color}`
                )}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{action.description}</p>
                {action.badge && (
                  <Badge className="mt-2 bg-yellow-100 text-yellow-800 text-xs">
                    {action.badge}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add Employee</DialogTitle>
            <DialogDescription>
              Add a new employee quickly. Full profile can be completed later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">First Name</label>
                <Input
                  placeholder="Enter first name"
                  value={quickEmployee.firstName}
                  onChange={(e) => setQuickEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Last Name</label>
                <Input
                  placeholder="Enter last name"
                  value={quickEmployee.lastName}
                  onChange={(e) => setQuickEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={quickEmployee.email}
                onChange={(e) => setQuickEmployee(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select value={quickEmployee.role} onValueChange={(value: UserRole) => 
                  setQuickEmployee(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="senior_employee">Senior Employee</SelectItem>
                    <SelectItem value="team_lead">Team Lead</SelectItem>
                    <SelectItem value="department_manager">Department Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={quickEmployee.department} onValueChange={(value: Department) => 
                  setQuickEmployee(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Auto-generated credentials:</p>
              <p>Username: {quickEmployee.firstName && quickEmployee.lastName ? `${quickEmployee.firstName.toLowerCase()}.${quickEmployee.lastName.toLowerCase()}` : "Will be generated"}</p>
              <p>Password: Will be auto-generated and sent via email</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleQuickAddEmployee} className="bg-blue-500 hover:bg-blue-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
              <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Create Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Create Task</DialogTitle>
            <DialogDescription>
              Create a new task quickly
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Task Title</label>
              <Input
                placeholder="Enter task title"
                value={quickTask.title}
                onChange={(e) => setQuickTask(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Enter task description"
                value={quickTask.description}
                onChange={(e) => setQuickTask(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={quickTask.priority} onValueChange={(value) => 
                  setQuickTask(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Due Date</label>
                <Input
                  type="date"
                  value={quickTask.dueDate}
                  onChange={(e) => setQuickTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleQuickCreateTask} className="bg-green-500 hover:bg-green-600">
                <CheckSquare className="w-4 h-4 mr-2" />
                Create Task
              </Button>
              <Button variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Create Policy Dialog */}
      <Dialog open={isNewPolicyOpen} onOpenChange={setIsNewPolicyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Create Policy</DialogTitle>
            <DialogDescription>
              Create a new policy draft quickly
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Policy Title</label>
              <Input
                placeholder="Enter policy title"
                value={quickPolicy.title}
                onChange={(e) => setQuickPolicy(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Brief description of the policy"
                value={quickPolicy.description}
                onChange={(e) => setQuickPolicy(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={quickPolicy.category} onValueChange={(value) => 
                  setQuickPolicy(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={quickPolicy.priority} onValueChange={(value) => 
                  setQuickPolicy(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleQuickCreatePolicy} className="bg-indigo-500 hover:bg-indigo-600">
                <FileText className="w-4 h-4 mr-2" />
                Create Policy Draft
              </Button>
              <Button variant="outline" onClick={() => setIsNewPolicyOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={isScheduleMeetingOpen} onOpenChange={setIsScheduleMeetingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Schedule a quick meeting or appointment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Meeting Title</label>
              <Input
                placeholder="Enter meeting title"
                value={quickMeeting.title}
                onChange={(e) => setQuickMeeting(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Participants</label>
              <Input
                placeholder="Enter participant names or emails"
                value={quickMeeting.participants}
                onChange={(e) => setQuickMeeting(prev => ({ ...prev, participants: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  type="date"
                  value={quickMeeting.date}
                  onChange={(e) => setQuickMeeting(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Input
                  type="time"
                  value={quickMeeting.time}
                  onChange={(e) => setQuickMeeting(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration (min)</label>
                <Select value={quickMeeting.duration} onValueChange={(value) => 
                  setQuickMeeting(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleScheduleMeeting} className="bg-purple-500 hover:bg-purple-600">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" onClick={() => setIsScheduleMeetingOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
