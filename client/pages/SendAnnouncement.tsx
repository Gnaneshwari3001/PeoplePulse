import { useState } from "react";
import {
  MessageSquare,
  Send,
  Users,
  Clock,
  AlertTriangle,
  Bell,
  Megaphone,
  FileText,
  Calendar,
  Target,
  Eye,
  Save,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RoleAccess } from "@/components/RoleAccess";
import { cn } from "@/lib/utils";

interface AnnouncementTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface AnnouncementHistory {
  id: string;
  title: string;
  content: string;
  recipients: string;
  priority: string;
  sentAt: string;
  sentBy: string;
  status: "sent" | "scheduled" | "draft";
}

export default function SendAnnouncement() {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    priority: "normal",
    recipients: "all",
    departments: [] as string[],
    roles: [] as string[],
    scheduleDate: "",
    scheduleTime: "",
    sendEmail: true,
    sendInApp: true,
    requireAcknowledgment: false,
  });

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const templates: AnnouncementTemplate[] = [
    {
      id: "meeting",
      title: "Team Meeting Announcement",
      content:
        "We have an important team meeting scheduled. Please mark your calendars and ensure your attendance.",
      category: "Meeting",
    },
    {
      id: "policy",
      title: "Policy Update Notification",
      content:
        "We have updated our company policies. Please review the changes and acknowledge your understanding.",
      category: "Policy",
    },
    {
      id: "system",
      title: "System Maintenance Notice",
      content:
        "Scheduled system maintenance will occur. Please save your work and log out before the maintenance window.",
      category: "System",
    },
    {
      id: "welcome",
      title: "Welcome New Employee",
      content:
        "Please join us in welcoming our new team member. We're excited to have them on board.",
      category: "HR",
    },
  ];

  const recentAnnouncements: AnnouncementHistory[] = [
    {
      id: "1",
      title: "Q4 Company All-Hands Meeting",
      content: "Join us for our quarterly company meeting...",
      recipients: "All Employees",
      priority: "high",
      sentAt: "2024-01-15 14:30",
      sentBy: "HR Manager",
      status: "sent",
    },
    {
      id: "2",
      title: "New Remote Work Policy",
      content: "Updated guidelines for remote work arrangements...",
      recipients: "All Employees",
      priority: "normal",
      sentAt: "2024-01-10 09:00",
      sentBy: "Admin",
      status: "sent",
    },
    {
      id: "3",
      title: "Holiday Schedule 2024",
      content: "Please find attached the holiday schedule...",
      recipients: "All Employees",
      priority: "normal",
      sentAt: "2024-01-05 16:00",
      sentBy: "HR Manager",
      status: "sent",
    },
  ];

  const departments = [
    "engineering",
    "hr",
    "marketing",
    "sales",
    "finance",
    "operations",
    "design",
    "support",
    "management",
  ];

  const roles = [
    "employee",
    "senior_employee",
    "team_lead",
    "department_manager",
    "hr_manager",
    "admin",
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setAnnouncement((prev) => ({
        ...prev,
        title: template.title,
        content: template.content,
      }));
      setSelectedTemplate(templateId);
    }
  };

  const handleDepartmentChange = (dept: string, checked: boolean) => {
    setAnnouncement((prev) => ({
      ...prev,
      departments: checked
        ? [...prev.departments, dept]
        : prev.departments.filter((d) => d !== dept),
    }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setAnnouncement((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, role]
        : prev.roles.filter((r) => r !== role),
    }));
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.title || !announcement.content) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and content for the announcement",
        variant: "destructive",
      });
      return;
    }

    const isScheduled = announcement.scheduleDate && announcement.scheduleTime;

    toast({
      title: isScheduled ? "Announcement Scheduled" : "Announcement Sent",
      description: isScheduled
        ? `Announcement will be sent on ${announcement.scheduleDate} at ${announcement.scheduleTime}`
        : "Your announcement has been sent successfully to all selected recipients",
    });

    // Reset form
    setAnnouncement({
      title: "",
      content: "",
      priority: "normal",
      recipients: "all",
      departments: [],
      roles: [],
      scheduleDate: "",
      scheduleTime: "",
      sendEmail: true,
      sendInApp: true,
      requireAcknowledgment: false,
    });
    setSelectedTemplate("");
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your announcement has been saved as a draft",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "normal":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <RoleAccess
      allowedRoles={["team_lead", "department_manager", "hr_manager", "admin"]}
      fallback={
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need management privileges to send announcements.
          </p>
        </div>
      }
    >
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-orange-500" />
              Send Announcement
            </h1>
            <p className="text-gray-600">
              Broadcast important messages to your team and organization
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Announcement Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Templates */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={
                        selectedTemplate === template.id ? "default" : "outline"
                      }
                      className="h-auto p-3 text-left justify-start"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {template.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.category}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Announcement Form */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Announcement Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={announcement.title}
                    onChange={(e) =>
                      setAnnouncement((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium mb-2 block">
                    Content *
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your announcement message"
                    value={announcement.content}
                    onChange={(e) =>
                      setAnnouncement((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Priority</Label>
                    <Select
                      value={announcement.priority}
                      onValueChange={(value) =>
                        setAnnouncement((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="normal">Normal Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Recipients</Label>
                    <Select
                      value={announcement.recipients}
                      onValueChange={(value) =>
                        setAnnouncement((prev) => ({ ...prev, recipients: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="departments">
                          Specific Departments
                        </SelectItem>
                        <SelectItem value="roles">Specific Roles</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Department Selection */}
                {(announcement.recipients === "departments" ||
                  announcement.recipients === "custom") && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Select Departments
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {departments.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={dept}
                            checked={announcement.departments.includes(dept)}
                            onCheckedChange={(checked) =>
                              handleDepartmentChange(dept, checked as boolean)
                            }
                          />
                          <Label htmlFor={dept} className="text-sm capitalize">
                            {dept}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role Selection */}
                {(announcement.recipients === "roles" ||
                  announcement.recipients === "custom") && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Select Roles
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={role}
                            checked={announcement.roles.includes(role)}
                            onCheckedChange={(checked) =>
                              handleRoleChange(role, checked as boolean)
                            }
                          />
                          <Label htmlFor={role} className="text-sm capitalize">
                            {role.replace("_", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Scheduling */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Schedule (Optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduleDate" className="text-xs text-gray-500">
                        Date
                      </Label>
                      <Input
                        id="scheduleDate"
                        type="date"
                        value={announcement.scheduleDate}
                        onChange={(e) =>
                          setAnnouncement((prev) => ({
                            ...prev,
                            scheduleDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduleTime" className="text-xs text-gray-500">
                        Time
                      </Label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={announcement.scheduleTime}
                        onChange={(e) =>
                          setAnnouncement((prev) => ({
                            ...prev,
                            scheduleTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Delivery Options
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendEmail"
                        checked={announcement.sendEmail}
                        onCheckedChange={(checked) =>
                          setAnnouncement((prev) => ({
                            ...prev,
                            sendEmail: checked as boolean,
                          }))
                        }
                      />
                      <Label htmlFor="sendEmail" className="text-sm">
                        Send via Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendInApp"
                        checked={announcement.sendInApp}
                        onCheckedChange={(checked) =>
                          setAnnouncement((prev) => ({
                            ...prev,
                            sendInApp: checked as boolean,
                          }))
                        }
                      />
                      <Label htmlFor="sendInApp" className="text-sm">
                        Send In-App Notification
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requireAcknowledgment"
                        checked={announcement.requireAcknowledgment}
                        onCheckedChange={(checked) =>
                          setAnnouncement((prev) => ({
                            ...prev,
                            requireAcknowledgment: checked as boolean,
                          }))
                        }
                      />
                      <Label htmlFor="requireAcknowledgment" className="text-sm">
                        Require Acknowledgment
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSendAnnouncement}
                    className="bg-orange-500 hover:bg-orange-600 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {announcement.scheduleDate ? "Schedule" : "Send"} Announcement
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            {showPreview && (
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-600" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {announcement.title || "Announcement Title"}
                      </h3>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {announcement.content || "Announcement content will appear here..."}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      {announcement.recipients === "all"
                        ? "All Employees"
                        : `${announcement.departments.length} departments, ${announcement.roles.length} roles`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Announcements */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">
                          {announcement.title}
                        </h4>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {announcement.content.substring(0, 80)}...
                      </p>
                      <div className="text-xs text-gray-500">
                        {announcement.sentAt} • {announcement.sentBy}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleAccess>
  );
}
