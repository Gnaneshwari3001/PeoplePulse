import { useState } from "react";
import { 
  UserPlus, 
  FileText, 
  Calendar, 
  MessageSquare,
  Edit,
  Save,
  X,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole, Department } from "@/types/roles";
import { cn } from "@/lib/utils";

interface TopFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  editMode?: boolean;
}

export function TopFeatures() {
  const { userProfile, hasPermission } = useAuth();
  const { toast } = useToast();

  const [features, setFeatures] = useState<TopFeature[]>([
    {
      id: "add-employee",
      title: "Add Employee",
      description: "Quickly add new employees with auto-generated credentials",
      icon: UserPlus,
      color: "text-blue-600",
      bgGradient: "from-blue-500 to-blue-600",
      editMode: false
    },
    {
      id: "new-policy",
      title: "New Policy",
      description: "Create and manage company policies efficiently",
      icon: FileText,
      color: "text-indigo-600",
      bgGradient: "from-indigo-500 to-indigo-600",
      editMode: false
    },
    {
      id: "schedule-meeting",
      title: "Schedule Meeting",
      description: "Organize team meetings and appointments seamlessly",
      icon: Calendar,
      color: "text-purple-600",
      bgGradient: "from-purple-500 to-purple-600",
      editMode: false
    },
    {
      id: "send-announcement",
      title: "Send Announcement",
      description: "Broadcast important updates to your team instantly",
      icon: MessageSquare,
      color: "text-orange-600",
      bgGradient: "from-orange-500 to-orange-600",
      editMode: false
    }
  ]);

  // Forms for each feature
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee" as UserRole,
    department: "engineering" as Department
  });

  const [policyForm, setPolicyForm] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium"
  });

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    participants: "",
    date: "",
    time: "",
    duration: "30"
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    priority: "normal",
    recipients: "all"
  });

  const canEditFeature = (featureId: string) => {
    switch (featureId) {
      case "add-employee":
        return hasPermission("employees", "create");
      case "new-policy":
        return hasPermission("policies", "create");
      case "schedule-meeting":
        return true; // All users can schedule meetings
      case "send-announcement":
        return hasPermission("announcements", "create") || 
               ["team_lead", "department_manager", "hr_manager", "admin"].includes(userProfile?.role as string);
      default:
        return false;
    }
  };

  const toggleEditMode = (featureId: string) => {
    if (!canEditFeature(featureId)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to use this feature",
        variant: "destructive",
      });
      return;
    }

    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, editMode: !feature.editMode }
        : { ...feature, editMode: false } // Close other edit modes
    ));
  };

  const handleSaveEmployee = async () => {
    if (!employeeForm.firstName || !employeeForm.lastName || !employeeForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const username = `${employeeForm.firstName.toLowerCase()}.${employeeForm.lastName.toLowerCase()}`;
    const password = generatePassword();

    toast({
      title: "Employee Added Successfully",
      description: `${employeeForm.firstName} ${employeeForm.lastName} has been added. Login: ${username}`,
    });

    // Reset form and close edit mode
    setEmployeeForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "employee",
      department: "engineering"
    });
    toggleEditMode("add-employee");
  };

  const handleSavePolicy = async () => {
    if (!policyForm.title) {
      toast({
        title: "Missing Information",
        description: "Please enter a policy title",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Policy Created",
      description: `Policy "${policyForm.title}" has been created as draft`,
    });

    // Reset form and close edit mode
    setPolicyForm({
      title: "",
      description: "",
      category: "general",
      priority: "medium"
    });
    toggleEditMode("new-policy");
  };

  const handleSaveMeeting = async () => {
    if (!meetingForm.title || !meetingForm.date) {
      toast({
        title: "Missing Information",
        description: "Please enter meeting title and date",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meeting Scheduled",
      description: `Meeting "${meetingForm.title}" has been scheduled`,
    });

    // Reset form and close edit mode
    setMeetingForm({
      title: "",
      participants: "",
      date: "",
      time: "",
      duration: "30"
    });
    toggleEditMode("schedule-meeting");
  };

  const handleSaveAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.message) {
      toast({
        title: "Missing Information",
        description: "Please enter announcement title and message",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Announcement Sent",
      description: `Announcement "${announcementForm.title}" has been sent`,
    });

    // Reset form and close edit mode
    setAnnouncementForm({
      title: "",
      message: "",
      priority: "normal",
      recipients: "all"
    });
    toggleEditMode("send-announcement");
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  };

  const renderFeatureForm = (featureId: string) => {
    switch (featureId) {
      case "add-employee":
        return (
          <div className="space-y-4 mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">First Name *</label>
                <Input
                  placeholder="Enter first name"
                  value={employeeForm.firstName}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Last Name *</label>
                <Input
                  placeholder="Enter last name"
                  value={employeeForm.lastName}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email *</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select value={employeeForm.role} onValueChange={(value: UserRole) => 
                  setEmployeeForm(prev => ({ ...prev, role: value }))}>
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
                <Select value={employeeForm.department} onValueChange={(value: Department) => 
                  setEmployeeForm(prev => ({ ...prev, department: value }))}>
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
            <div className="flex gap-2">
              <Button onClick={handleSaveEmployee} size="sm" className="bg-blue-500 hover:bg-blue-600">
                <Save className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
              <Button onClick={() => toggleEditMode("add-employee")} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );

      case "new-policy":
        return (
          <div className="space-y-4 mt-4 p-4 bg-indigo-50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Policy Title *</label>
              <Input
                placeholder="Enter policy title"
                value={policyForm.title}
                onChange={(e) => setPolicyForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Brief description of the policy"
                value={policyForm.description}
                onChange={(e) => setPolicyForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={policyForm.category} onValueChange={(value) => 
                  setPolicyForm(prev => ({ ...prev, category: value }))}>
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
                <Select value={policyForm.priority} onValueChange={(value) => 
                  setPolicyForm(prev => ({ ...prev, priority: value }))}>
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
            <div className="flex gap-2">
              <Button onClick={handleSavePolicy} size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                <Save className="w-4 h-4 mr-2" />
                Create Policy
              </Button>
              <Button onClick={() => toggleEditMode("new-policy")} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );

      case "schedule-meeting":
        return (
          <div className="space-y-4 mt-4 p-4 bg-purple-50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Meeting Title *</label>
              <Input
                placeholder="Enter meeting title"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Participants</label>
              <Input
                placeholder="Enter participant names or emails"
                value={meetingForm.participants}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, participants: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date *</label>
                <Input
                  type="date"
                  value={meetingForm.date}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Input
                  type="time"
                  value={meetingForm.time}
                  onChange={(e) => setMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Select value={meetingForm.duration} onValueChange={(value) => 
                  setMeetingForm(prev => ({ ...prev, duration: value }))}>
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
            <div className="flex gap-2">
              <Button onClick={handleSaveMeeting} size="sm" className="bg-purple-500 hover:bg-purple-600">
                <Save className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button onClick={() => toggleEditMode("schedule-meeting")} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );

      case "send-announcement":
        return (
          <div className="space-y-4 mt-4 p-4 bg-orange-50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Announcement Title *</label>
              <Input
                placeholder="Enter announcement title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message *</label>
              <Textarea
                placeholder="Enter your announcement message"
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={announcementForm.priority} onValueChange={(value) => 
                  setAnnouncementForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Recipients</label>
                <Select value={announcementForm.recipients} onValueChange={(value) => 
                  setAnnouncementForm(prev => ({ ...prev, recipients: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="department">My Department</SelectItem>
                    <SelectItem value="team">My Team</SelectItem>
                    <SelectItem value="managers">Managers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveAnnouncement} size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Send Announcement
              </Button>
              <Button onClick={() => toggleEditMode("send-announcement")} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
        <p className="text-gray-600">Streamline your workflow with these essential features</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const canEdit = canEditFeature(feature.id);
          
          return (
            <Card 
              key={feature.id} 
              className={cn(
                "transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1",
                feature.editMode 
                  ? "bg-white border-2 border-blue-500 shadow-lg" 
                  : "bg-white/80 backdrop-blur-sm border-white/20"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                    `bg-gradient-to-br ${feature.bgGradient}`
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <Button
                    size="sm"
                    variant={feature.editMode ? "default" : "ghost"}
                    onClick={() => toggleEditMode(feature.id)}
                    disabled={!canEdit}
                    className={cn(
                      "h-8 w-8 p-0",
                      !canEdit && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {feature.editMode ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Edit className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <CardTitle className={cn("text-lg font-bold transition-colors", feature.color)}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {!canEdit && (
                  <div className="text-xs text-gray-400 italic">
                    Requires additional permissions
                  </div>
                )}

                {/* Render edit form if in edit mode */}
                {feature.editMode && renderFeatureForm(feature.id)}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
