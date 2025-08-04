import { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  MessageSquare,
  Upload,
  User,
  Users,
  Calendar,
  Bell,
  Download,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  Send,
  ArrowRight,
  History,
  Timer,
  UserCheck,
  Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RoleAccess, ManagerOnly } from "@/components/RoleAccess";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Types and Interfaces
interface Request {
  id: string;
  requestType: "leave" | "it-support" | "hr-query" | "admin-request" | "general-query";
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "approved" | "rejected" | "escalated";
  submittedBy: string;
  submittedAt: string;
  assignedTo?: string;
  approvedBy?: string;
  approvedAt?: string;
  attachments?: string[];
  comments: Comment[];
  escalationLevel: number;
  escalationDate?: string;
  dueDate: string;
  department: string;
  teamLead?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "manager" | "hr" | "it" | "admin";
  department: string;
  avatar?: string;
}

// Sample Data
const sampleUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@company.com", role: "employee", department: "Engineering" },
  { id: "2", name: "Sarah Chen", email: "sarah@company.com", role: "manager", department: "Engineering" },
  { id: "3", name: "Mike Johnson", email: "mike@company.com", role: "hr", department: "HR" },
  { id: "4", name: "Lisa Wang", email: "lisa@company.com", role: "it", department: "IT" },
  { id: "5", name: "David Brown", email: "david@company.com", role: "admin", department: "Admin" },
];

const sampleRequests: Request[] = [
  {
    id: "REQ-001",
    requestType: "leave",
    subject: "Vacation Leave Request - December 20-25",
    description: "I would like to request vacation leave for a family trip during the holidays.",
    priority: "medium",
    status: "pending",
    submittedBy: "John Doe",
    submittedAt: "2024-01-15T09:00:00Z",
    assignedTo: "Sarah Chen",
    department: "Engineering",
    teamLead: "Sarah Chen",
    escalationLevel: 0,
    dueDate: "2024-01-17T17:00:00Z",
    comments: [
      {
        id: "c1",
        userId: "1",
        userName: "John Doe",
        content: "This is for my family vacation that was planned months ago.",
        timestamp: "2024-01-15T09:05:00Z",
        isInternal: false
      }
    ]
  },
  {
    id: "REQ-002",
    requestType: "it-support",
    subject: "New Laptop Request",
    description: "My current laptop is very slow and affecting productivity. Need a replacement.",
    priority: "high",
    status: "in-progress",
    submittedBy: "Alex Kumar",
    submittedAt: "2024-01-14T14:30:00Z",
    assignedTo: "Lisa Wang",
    department: "Marketing",
    escalationLevel: 0,
    dueDate: "2024-01-16T17:00:00Z",
    comments: [
      {
        id: "c2",
        userId: "4",
        userName: "Lisa Wang",
        content: "Checking available inventory. Will update soon.",
        timestamp: "2024-01-14T15:00:00Z",
        isInternal: true
      }
    ]
  },
  {
    id: "REQ-003",
    requestType: "hr-query",
    subject: "Benefits Enrollment Question",
    description: "Need clarification on health insurance options for new dependents.",
    priority: "medium",
    status: "escalated",
    submittedBy: "Maria Rodriguez",
    submittedAt: "2024-01-10T11:20:00Z",
    assignedTo: "Mike Johnson",
    escalationLevel: 1,
    escalationDate: "2024-01-12T17:00:00Z",
    department: "Sales",
    dueDate: "2024-01-12T17:00:00Z",
    comments: []
  },
  {
    id: "REQ-004",
    requestType: "admin-request",
    subject: "Office Access Card Replacement",
    description: "Lost my office access card and need a replacement urgently.",
    priority: "urgent",
    status: "approved",
    submittedBy: "James Wilson",
    submittedAt: "2024-01-13T08:15:00Z",
    assignedTo: "David Brown",
    approvedBy: "David Brown",
    approvedAt: "2024-01-13T10:30:00Z",
    department: "Engineering",
    escalationLevel: 0,
    dueDate: "2024-01-13T17:00:00Z",
    comments: [
      {
        id: "c3",
        userId: "5",
        userName: "David Brown",
        content: "Approved. New card will be ready by EOD.",
        timestamp: "2024-01-13T10:30:00Z",
        isInternal: false
      }
    ]
  }
];

export default function ApprovalWorkflow() {
  const { currentUser, userProfile, canAccessModule } = useAuth();
  const { toast } = useToast();

  // Check if user has access to approval workflow
  if (!userProfile || !canAccessModule('approval_workflow')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="p-4 rounded-full bg-red-100 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Approval Workflow system.
          </p>
          <p className="text-sm text-gray-500">
            This feature is available to managers, HR, and administrators only.
          </p>
        </div>
      </div>
    );
  }
  
  const [activeTab, setActiveTab] = useState("submit");
  const [requests, setRequests] = useState<Request[]>(sampleRequests);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>(sampleRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // New request form state
  const [newRequest, setNewRequest] = useState({
    requestType: "general-query" as Request["requestType"],
    subject: "",
    description: "",
    priority: "medium" as Request["priority"],
    attachments: [] as string[]
  });

  // Get current user role
  const getCurrentUserRole = (): User["role"] => {
    const userEmail = currentUser?.email || "";
    const user = sampleUsers.find(u => u.email === userEmail);
    return user?.role || "employee";
  };

  const currentUserRole = getCurrentUserRole();

  // Auto-assignment logic
  const getAutoAssignee = (requestType: Request["requestType"], department: string): string => {
    switch (requestType) {
      case "leave":
        return sampleUsers.find(u => u.role === "manager" && u.department === department)?.name || "Sarah Chen";
      case "it-support":
        return sampleUsers.find(u => u.role === "it")?.name || "Lisa Wang";
      case "hr-query":
        return sampleUsers.find(u => u.role === "hr")?.name || "Mike Johnson";
      case "admin-request":
        return sampleUsers.find(u => u.role === "admin")?.name || "David Brown";
      default:
        return sampleUsers.find(u => u.role === "manager" && u.department === department)?.name || "Sarah Chen";
    }
  };

  // Filter requests
  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(req => req.requestType === typeFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }

    // Filter based on user role
    if (currentUserRole === "employee") {
      const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "John Doe";
      filtered = filtered.filter(req => req.submittedBy === userName);
    } else if (currentUserRole === "manager") {
      const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Sarah Chen";
      filtered = filtered.filter(req => req.assignedTo === userName || req.submittedBy === userName);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, typeFilter, priorityFilter, requests, currentUserRole, currentUser]);

  // Submit new request
  const handleSubmitRequest = async () => {
    if (!newRequest.subject || !newRequest.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in subject and description",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "John Doe";
      const department = "Engineering"; // This would come from user profile
      
      const request: Request = {
        id: `REQ-${String(requests.length + 1).padStart(3, '0')}`,
        requestType: newRequest.requestType,
        subject: newRequest.subject,
        description: newRequest.description,
        priority: newRequest.priority,
        status: "pending",
        submittedBy: userName,
        submittedAt: new Date().toISOString(),
        assignedTo: getAutoAssignee(newRequest.requestType, department),
        department,
        escalationLevel: 0,
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
        comments: []
      };

      setRequests(prev => [request, ...prev]);
      
      // Reset form
      setNewRequest({
        requestType: "general-query",
        subject: "",
        description: "",
        priority: "medium",
        attachments: []
      });

      toast({
        title: "Request Submitted",
        description: `Your request has been submitted and assigned to ${request.assignedTo}`,
      });

      // Switch to tracking tab
      setActiveTab("track");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle request actions
  const handleRequestAction = (requestId: string, action: "approve" | "reject" | "assign" | "escalate") => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Manager";

        if (action === "approve") {
          return {
            ...req,
            status: "approved" as const,
            approvedBy: userName,
            approvedAt: new Date().toISOString()
          };
        } else if (action === "reject") {
          return {
            ...req,
            status: "rejected" as const,
            approvedBy: userName,
            approvedAt: new Date().toISOString()
          };
        } else if (action === "escalate") {
          return {
            ...req,
            status: "escalated" as const,
            escalationLevel: req.escalationLevel + 1,
            escalationDate: new Date().toISOString()
          };
        }
      }
      return req;
    }));

    toast({
      title: "Request Updated",
      description: `Request has been ${action}d successfully`,
    });
  };

  // Bulk actions
  const handleBulkAction = (action: "approve" | "reject") => {
    if (selectedRequests.length === 0) return;

    setRequests(prev => prev.map(req => {
      if (selectedRequests.includes(req.id)) {
        const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Manager";

        if (action === "approve") {
          return {
            ...req,
            status: "approved" as const,
            approvedBy: userName,
            approvedAt: new Date().toISOString()
          };
        } else if (action === "reject") {
          return {
            ...req,
            status: "rejected" as const,
            approvedBy: userName,
            approvedAt: new Date().toISOString()
          };
        }
      }
      return req;
    }));

    setSelectedRequests([]);
    toast({
      title: "Bulk Action Completed",
      description: `${selectedRequests.length} requests have been ${action}d`,
    });
  };

  // Add comment to request
  const handleAddComment = (requestId: string, content: string, isInternal: boolean = false) => {
    if (!content.trim()) return;

    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "User";
    const comment: Comment = {
      id: `c${Date.now()}`,
      userId: "current",
      userName,
      content,
      timestamp: new Date().toISOString(),
      isInternal
    };

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          comments: [...req.comments, comment]
        };
      }
      return req;
    }));

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the request",
    });
  };

  // Get status color
  const getStatusColor = (status: Request["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "escalated": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority color
  const getPriorityColor = (priority: Request["priority"]) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get request type icon
  const getRequestTypeIcon = (type: Request["requestType"]) => {
    switch (type) {
      case "leave": return Calendar;
      case "it-support": return Building;
      case "hr-query": return Users;
      case "admin-request": return User;
      default: return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const isOverdue = (dueDate: string, status: Request["status"]) => {
    return new Date(dueDate) < new Date() && status !== "approved" && status !== "rejected";
  };

  const RequestCard = ({ request }: { request: Request }) => {
    const [commentText, setCommentText] = useState("");
    const TypeIcon = getRequestTypeIcon(request.requestType);
    const isUserRequest = request.submittedBy === (currentUser?.displayName || currentUser?.email?.split('@')[0] || "John Doe");
    const canApprove = currentUserRole !== "employee" && request.assignedTo === (currentUser?.displayName || currentUser?.email?.split('@')[0]);

    return (
      <Card className={cn(
        "bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300",
        isOverdue(request.dueDate, request.status) && "border-red-200 bg-red-50/30"
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <TypeIcon className="w-5 h-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{request.subject}</h3>
                  {isOverdue(request.dueDate, request.status) && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {request.submittedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(request.submittedAt)}
                  </span>
                  {request.assignedTo && (
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      {request.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority}
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs">
                {request.id}
              </Badge>
            </div>
          </div>

          {request.comments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                Comments ({request.comments.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {request.comments.slice(-2).map((comment) => (
                  <div key={comment.id} className={cn(
                    "p-2 rounded text-sm",
                    comment.isInternal ? "bg-orange-50 border-l-2 border-orange-300" : "bg-blue-50 border-l-2 border-blue-300"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs">{comment.userName}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {canApprove && request.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleRequestAction(request.id, "approve")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRequestAction(request.id, "reject")}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Comment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                    <DialogDescription>
                      Add a comment to this request
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter your comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          handleAddComment(request.id, commentText);
                          setCommentText("");
                        }}
                        disabled={!commentText.trim()}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Add Comment
                      </Button>
                      {!isUserRequest && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleAddComment(request.id, commentText, true);
                            setCommentText("");
                          }}
                          disabled={!commentText.trim()}
                        >
                          Internal Note
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Timer className="w-3 h-3" />
              Due: {formatDate(request.dueDate)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Approval Workflow</h1>
              <p className="text-gray-600">Submit, track, and manage approval requests</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
                  </div>
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {requests.filter(r => r.status === "pending").length}
                    </p>
                  </div>
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-900">
                      {requests.filter(r => r.status === "approved").length}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-900">
                      {requests.filter(r => isOverdue(r.dueDate, r.status)).length}
                    </p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submit">Submit Request</TabsTrigger>
            <TabsTrigger value="track">Track Requests</TabsTrigger>
            <TabsTrigger value="manage">
              {currentUserRole === "employee" ? "My Requests" : "Manage Requests"}
            </TabsTrigger>
          </TabsList>

          {/* Submit Request Tab */}
          <TabsContent value="submit" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Submit New Request
                </CardTitle>
                <CardDescription>
                  Fill out the form below to submit your request for approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Request Type</label>
                    <Select value={newRequest.requestType} onValueChange={(value: Request["requestType"]) => 
                      setNewRequest(prev => ({ ...prev, requestType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leave">Leave Request</SelectItem>
                        <SelectItem value="it-support">IT Support</SelectItem>
                        <SelectItem value="hr-query">HR Query</SelectItem>
                        <SelectItem value="admin-request">Admin Request</SelectItem>
                        <SelectItem value="general-query">General Query</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select value={newRequest.priority} onValueChange={(value: Request["priority"]) => 
                      setNewRequest(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    placeholder="Brief description of your request"
                    value={newRequest.subject}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Detailed description of your request..."
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Attachments (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Drag and drop files here, or click to select</p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Track Requests Tab */}
          <TabsContent value="track" className="space-y-6">
            {/* Filters */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="leave">Leave Request</SelectItem>
                      <SelectItem value="it-support">IT Support</SelectItem>
                      <SelectItem value="hr-query">HR Query</SelectItem>
                      <SelectItem value="admin-request">Admin Request</SelectItem>
                      <SelectItem value="general-query">General Query</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Request List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                    <p className="text-gray-600">Try adjusting your filters or submit a new request.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </div>
          </TabsContent>

          {/* Manage Requests Tab */}
          <TabsContent value="manage" className="space-y-6">
            {currentUserRole === "employee" ? (
              // Employee view - their requests only
              <div className="space-y-4">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5 text-blue-500" />
                      My Request History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Manager/Admin view
              <div className="space-y-6">
                {/* Bulk Actions */}
                {selectedRequests.length > 0 && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {selectedRequests.length} request(s) selected
                        </span>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Bulk Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Bulk Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pending Approvals */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-500" />
                      Pending Approvals
                      <Badge className="bg-orange-100 text-orange-800">
                        {filteredRequests.filter(r => r.status === "pending").length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRequests
                        .filter(r => r.status === "pending")
                        .map((request) => (
                          <RequestCard key={request.id} request={request} />
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* All Requests */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      All Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
