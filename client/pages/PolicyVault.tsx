import { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Clock,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Shield,
  Settings,
  Building,
  Users,
  Globe,
  Lock,
  History,
  Star,
  Archive
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
} from "@/components/ui/dropdown-menu";
import { RoleAccess, HROnly, ManagerOnly } from "@/components/RoleAccess";
import { cn } from "@/lib/utils";

interface Policy {
  id: string;
  title: string;
  description: string;
  content: string;
  category: "hr" | "it" | "security" | "compliance" | "operations" | "finance" | "general";
  status: "draft" | "active" | "under_review" | "archived";
  priority: "low" | "medium" | "high" | "critical";
  version: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  effectiveDate: string;
  expiryDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  tags: string[];
  departments: string[];
  attachments?: string[];
  acknowledgments: PolicyAcknowledgment[];
  reviewers: string[];
  isPublic: boolean;
}

interface PolicyAcknowledgment {
  userId: string;
  userName: string;
  acknowledgedAt: string;
  ipAddress?: string;
}

interface PolicyVersion {
  id: string;
  policyId: string;
  version: string;
  content: string;
  changes: string;
  createdBy: string;
  createdAt: string;
}

const samplePolicies: Policy[] = [
  {
    id: "POL-001",
    title: "Remote Work Policy",
    description: "Guidelines for employees working remotely, including equipment, security, and communication requirements.",
    content: `# Remote Work Policy

## Purpose
This policy establishes guidelines for employees who work remotely to ensure productivity, security, and effective communication.

## Scope
This policy applies to all employees who are authorized to work remotely, whether on a temporary or permanent basis.

## Guidelines

### Equipment and Technology
- Employees must use company-approved devices and software
- All devices must have updated antivirus software
- VPN must be used for accessing company resources

### Communication
- Employees must be available during core business hours (9 AM - 3 PM)
- Video conferencing is preferred for important meetings
- Response time for messages should not exceed 4 hours during business hours

### Security Requirements
- Use of secure Wi-Fi networks only
- Physical security of workspace and equipment
- Compliance with data protection policies

### Performance Standards
- Maintain same productivity levels as in-office work
- Regular check-ins with supervisors
- Adherence to project deadlines and quality standards

## Compliance
Failure to comply with this policy may result in revocation of remote work privileges and disciplinary action.`,
    category: "hr",
    status: "active",
    priority: "high",
    version: "2.1",
    createdBy: "HR Team",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    effectiveDate: "2024-02-01T00:00:00Z",
    approvedBy: "Sarah Chen",
    approvedAt: "2024-01-20T16:00:00Z",
    tags: ["remote work", "productivity", "security"],
    departments: ["all"],
    acknowledgments: [
      { userId: "user1", userName: "John Doe", acknowledgedAt: "2024-01-21T09:00:00Z" },
      { userId: "user2", userName: "Jane Smith", acknowledgedAt: "2024-01-21T10:15:00Z" }
    ],
    reviewers: ["HR Manager", "IT Security"],
    isPublic: true
  },
  {
    id: "POL-002",
    title: "Data Security and Privacy Policy",
    description: "Comprehensive guidelines for handling, storing, and protecting sensitive company and customer data.",
    content: `# Data Security and Privacy Policy

## Introduction
This policy defines how employees must handle sensitive data to protect company and customer information.

## Data Classification
### Confidential Data
- Customer personal information
- Financial records
- Strategic business plans
- Employee personal records

### Internal Data
- Internal communications
- Process documentation
- Training materials

### Public Data
- Marketing materials
- Published information
- Press releases

## Security Measures
- Encryption requirements for data transmission
- Access control and authentication
- Regular security training
- Incident reporting procedures

## Compliance Requirements
All employees must complete annual security training and sign confidentiality agreements.`,
    category: "security",
    status: "active",
    priority: "critical",
    version: "3.0",
    createdBy: "IT Security Team",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-25T11:45:00Z",
    effectiveDate: "2024-01-30T00:00:00Z",
    tags: ["security", "privacy", "compliance", "GDPR"],
    departments: ["all"],
    acknowledgments: [
      { userId: "user1", userName: "John Doe", acknowledgedAt: "2024-01-26T09:30:00Z" }
    ],
    reviewers: ["CISO", "Legal Team"],
    isPublic: false
  },
  {
    id: "POL-003",
    title: "Leave and Time Off Policy",
    description: "Policy governing vacation days, sick leave, personal time off, and holiday schedules.",
    content: `# Leave and Time Off Policy

## Annual Leave
- 21 days annual leave for employees with 1-5 years of service
- 25 days for employees with 5+ years of service
- Maximum carry-over: 5 days to following year

## Sick Leave
- 10 days paid sick leave per year
- Medical certificate required for absence > 3 days
- Unused sick days do not carry over

## Personal Time Off
- 3 days personal time off per year
- 48 hours advance notice required
- Subject to supervisor approval

## Holidays
Company observes 12 public holidays annually. Holiday schedule published by December 31st each year.

## Application Process
All leave requests must be submitted through the HR system with supervisor approval.`,
    category: "hr",
    status: "active",
    priority: "medium",
    version: "1.5",
    createdBy: "HR Department",
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-18T16:20:00Z",
    effectiveDate: "2024-01-01T00:00:00Z",
    expiryDate: "2024-12-31T23:59:59Z",
    tags: ["leave", "vacation", "sick leave", "holidays"],
    departments: ["all"],
    acknowledgments: [],
    reviewers: ["HR Manager"],
    isPublic: true
  },
  {
    id: "POL-004",
    title: "Code of Conduct and Ethics",
    description: "Standards of behavior and ethical guidelines for all employees in their professional conduct.",
    content: `# Code of Conduct and Ethics

## Core Values
- Integrity in all business dealings
- Respect for colleagues and customers
- Accountability for actions and decisions
- Excellence in service delivery

## Professional Conduct
### Workplace Behavior
- Treat all individuals with dignity and respect
- Maintain professional demeanor
- Avoid conflicts of interest
- Report unethical behavior

### Communication
- Professional language in all communications
- Confidentiality of sensitive information
- Accurate and honest reporting

### Social Media Guidelines
- No sharing of confidential information
- Professional representation of company
- Personal opinions clearly distinguished from company positions

## Compliance and Reporting
Violations should be reported to HR or through the anonymous ethics hotline.`,
    category: "compliance",
    status: "active",
    priority: "high",
    version: "2.0",
    createdBy: "Legal Department",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    effectiveDate: "2024-01-01T00:00:00Z",
    tags: ["ethics", "conduct", "compliance", "values"],
    departments: ["all"],
    acknowledgments: [
      { userId: "user1", userName: "John Doe", acknowledgedAt: "2024-01-02T14:00:00Z" },
      { userId: "user2", userName: "Jane Smith", acknowledgedAt: "2024-01-02T15:30:00Z" }
    ],
    reviewers: ["Legal Team", "HR Director"],
    isPublic: true
  },
  {
    id: "POL-005",
    title: "IT Equipment and Software Policy",
    description: "Guidelines for the use, maintenance, and security of company IT equipment and software.",
    content: `# IT Equipment and Software Policy

## Equipment Assignment
- All equipment remains company property
- Employees responsible for care and security
- Report damage or loss immediately
- Return equipment upon termination

## Acceptable Use
### Hardware
- Business use priority
- No personal software installation without approval
- Regular maintenance and updates required

### Software
- Use only licensed software
- No unauthorized downloads
- Regular security updates mandatory

## Security Requirements
- Strong passwords (minimum 12 characters)
- Two-factor authentication where available
- Automatic screen locks after 10 minutes
- No sharing of login credentials

## Personal Use
Limited personal use permitted during breaks and lunch hours, subject to all security policies.

## Violations
Misuse may result in loss of equipment privileges and disciplinary action.`,
    category: "it",
    status: "under_review",
    priority: "medium",
    version: "1.8",
    createdBy: "IT Department",
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
    effectiveDate: "2024-02-15T00:00:00Z",
    tags: ["IT", "equipment", "software", "security"],
    departments: ["all"],
    acknowledgments: [],
    reviewers: ["IT Manager", "Security Team"],
    isPublic: true
  }
];

export default function PolicyVault() {
  const { userProfile, hasPermission } = useAuth();
  const { toast } = useToast();

  const [policies, setPolicies] = useState<Policy[]>(samplePolicies);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>(samplePolicies);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // New policy form state
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    description: "",
    content: "",
    category: "general" as Policy["category"],
    priority: "medium" as Policy["priority"],
    effectiveDate: "",
    expiryDate: "",
    tags: "",
    departments: "",
    isPublic: true
  });

  // Filter policies
  useEffect(() => {
    let filtered = policies;

    if (searchTerm) {
      filtered = filtered.filter(policy => 
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(policy => policy.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(policy => policy.status === selectedStatus);
    }

    // Filter by user permissions
    if (userProfile?.role === "employee" || userProfile?.role === "intern") {
      filtered = filtered.filter(policy => policy.isPublic && policy.status === "active");
    }

    setFilteredPolicies(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, policies, userProfile]);

  const handleCreatePolicy = async () => {
    if (!newPolicy.title || !newPolicy.description || !newPolicy.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const policy: Policy = {
      id: `POL-${String(policies.length + 1).padStart(3, '0')}`,
      title: newPolicy.title,
      description: newPolicy.description,
      content: newPolicy.content,
      category: newPolicy.category,
      status: "draft",
      priority: newPolicy.priority,
      version: "1.0",
      createdBy: userProfile?.displayName || "Unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      effectiveDate: newPolicy.effectiveDate || new Date().toISOString(),
      expiryDate: newPolicy.expiryDate || undefined,
      tags: newPolicy.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      departments: newPolicy.departments.split(',').map(dept => dept.trim()).filter(Boolean),
      acknowledgments: [],
      reviewers: [],
      isPublic: newPolicy.isPublic
    };

    setPolicies(prev => [policy, ...prev]);
    
    // Reset form
    setNewPolicy({
      title: "",
      description: "",
      content: "",
      category: "general",
      priority: "medium",
      effectiveDate: "",
      expiryDate: "",
      tags: "",
      departments: "",
      isPublic: true
    });

    setIsCreateDialogOpen(false);

    toast({
      title: "Policy Created",
      description: "Your policy has been created successfully",
    });
  };

  const handleAcknowledgePolicy = (policyId: string) => {
    if (!userProfile) return;

    setPolicies(prev => prev.map(policy => {
      if (policy.id === policyId) {
        const hasAcknowledged = policy.acknowledgments.some(ack => ack.userId === userProfile.uid);
        if (!hasAcknowledged) {
          return {
            ...policy,
            acknowledgments: [...policy.acknowledgments, {
              userId: userProfile.uid,
              userName: userProfile.displayName,
              acknowledgedAt: new Date().toISOString()
            }]
          };
        }
      }
      return policy;
    }));

    toast({
      title: "Policy Acknowledged",
      description: "You have successfully acknowledged this policy",
    });
  };

  const getCategoryIcon = (category: Policy["category"]) => {
    switch (category) {
      case "hr": return Users;
      case "it": return Settings;
      case "security": return Shield;
      case "compliance": return CheckCircle;
      case "operations": return Building;
      case "finance": return Globe;
      default: return FileText;
    }
  };

  const getStatusColor = (status: Policy["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Policy["priority"]) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const hasAcknowledged = (policy: Policy) => {
    if (!userProfile) return false;
    return policy.acknowledgments.some(ack => ack.userId === userProfile.uid);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Policy Vault</h1>
                <p className="text-gray-600">Company policies, procedures, and documentation</p>
              </div>
            </div>

            <RoleAccess 
              requiredPermissions={[{ module: "policies", action: "create" }]}
              fallback={null}
            >
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-500 hover:bg-indigo-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Policy</DialogTitle>
                    <DialogDescription>
                      Create a new company policy or procedure document
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Policy Title</label>
                        <Input
                          placeholder="Enter policy title"
                          value={newPolicy.title}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select value={newPolicy.category} onValueChange={(value: Policy["category"]) => 
                          setNewPolicy(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hr">Human Resources</SelectItem>
                            <SelectItem value="it">Information Technology</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Brief description of the policy"
                        value={newPolicy.description}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Policy Content</label>
                      <Textarea
                        placeholder="Enter the full policy content (Markdown supported)"
                        value={newPolicy.content}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, content: e.target.value }))}
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Priority</label>
                        <Select value={newPolicy.priority} onValueChange={(value: Policy["priority"]) => 
                          setNewPolicy(prev => ({ ...prev, priority: value }))}>
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
                      <div>
                        <label className="text-sm font-medium mb-2 block">Effective Date</label>
                        <Input
                          type="date"
                          value={newPolicy.effectiveDate.split('T')[0]}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, effectiveDate: e.target.value + 'T00:00:00Z' }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                        <Input
                          placeholder="e.g., remote work, security, compliance"
                          value={newPolicy.tags}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, tags: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Departments (comma-separated)</label>
                        <Input
                          placeholder="e.g., all, engineering, hr"
                          value={newPolicy.departments}
                          onChange={(e) => setNewPolicy(prev => ({ ...prev, departments: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newPolicy.isPublic}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="isPublic" className="text-sm">Make this policy publicly visible to all employees</label>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleCreatePolicy} className="bg-indigo-500 hover:bg-indigo-600">
                        Create Policy
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </RoleAccess>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Policies</p>
                    <p className="text-2xl font-bold text-indigo-900">{policies.length}</p>
                  </div>
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {policies.filter(p => p.status === "active").length}
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
                    <p className="text-sm font-medium text-gray-600">Under Review</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {policies.filter(p => p.status === "under_review").length}
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
                    <p className="text-sm font-medium text-gray-600">Need Acknowledgment</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {policies.filter(p => p.status === "active" && !hasAcknowledged(p)).length}
                    </p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Policies</TabsTrigger>
            <TabsTrigger value="active">Active Policies</TabsTrigger>
            <TabsTrigger value="acknowledgments">Need Acknowledgment</TabsTrigger>
            <TabsTrigger value="drafts">Drafts & Reviews</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all" className="space-y-4">
            {filteredPolicies.length === 0 ? (
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                  <p className="text-gray-600">Try adjusting your filters or create a new policy.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredPolicies.map((policy) => {
                  const CategoryIcon = getCategoryIcon(policy.category);
                  return (
                    <Card key={policy.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "p-3 rounded-lg shadow-lg",
                              policy.status === "active" ? "bg-green-100" :
                              policy.status === "under_review" ? "bg-yellow-100" :
                              policy.status === "draft" ? "bg-gray-100" : "bg-red-100"
                            )}>
                              <CategoryIcon className={cn(
                                "w-6 h-6",
                                policy.status === "active" ? "text-green-600" :
                                policy.status === "under_review" ? "text-yellow-600" :
                                policy.status === "draft" ? "text-gray-600" : "text-red-600"
                              )} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">{policy.title}</h3>
                                {!hasAcknowledged(policy) && policy.status === "active" && (
                                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                                )}
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{policy.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {policy.createdBy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(policy.updatedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  v{policy.version}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(policy.status)}>
                                {policy.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(policy.priority)}>
                                {policy.priority}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {policy.id}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {policy.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPolicy(policy);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            
                            {policy.status === "active" && !hasAcknowledged(policy) && (
                              <Button
                                size="sm"
                                onClick={() => handleAcknowledgePolicy(policy.id)}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Acknowledge
                              </Button>
                            )}

                            <RoleAccess 
                              requiredPermissions={[{ module: "policies", action: "edit" }]}
                              fallback={null}
                            >
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </RoleAccess>
                          </div>

                          <div className="text-sm text-gray-500">
                            {hasAcknowledged(policy) ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Acknowledged
                              </span>
                            ) : policy.status === "active" ? (
                              <span className="flex items-center gap-1 text-orange-600">
                                <AlertTriangle className="w-4 h-4" />
                                Acknowledgment Required
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            <div className="grid gap-6">
              {filteredPolicies.filter(p => p.status === "active").map((policy) => {
                const CategoryIcon = getCategoryIcon(policy.category);
                return (
                  <Card key={policy.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CategoryIcon className="w-6 h-6 text-green-600" />
                          <div>
                            <h3 className="font-semibold text-lg">{policy.title}</h3>
                            <p className="text-sm text-gray-600">{policy.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!hasAcknowledged(policy) && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledgePolicy(policy.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Acknowledge
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="acknowledgments">
            <div className="grid gap-6">
              {filteredPolicies.filter(p => p.status === "active" && !hasAcknowledged(p)).map((policy) => (
                <Card key={policy.id} className="bg-orange-50/50 backdrop-blur-sm border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                        <div>
                          <h3 className="font-semibold text-lg">{policy.title}</h3>
                          <p className="text-sm text-gray-600">Acknowledgment required</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAcknowledgePolicy(policy.id)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Acknowledge Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drafts">
            <RoleAccess 
              requiredPermissions={[{ module: "policies", action: "view" }]}
              fallback={
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardContent className="p-12 text-center">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                    <p className="text-gray-600">You don't have permission to view draft policies.</p>
                  </CardContent>
                </Card>
              }
            >
              <div className="grid gap-6">
                {filteredPolicies.filter(p => p.status === "draft" || p.status === "under_review").map((policy) => {
                  const CategoryIcon = getCategoryIcon(policy.category);
                  return (
                    <Card key={policy.id} className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CategoryIcon className="w-6 h-6 text-gray-600" />
                            <div>
                              <h3 className="font-semibold text-lg">{policy.title}</h3>
                              <p className="text-sm text-gray-600">{policy.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(policy.status)}>
                              {policy.status.replace('_', ' ')}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </RoleAccess>
          </TabsContent>
        </Tabs>

        {/* Policy View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPolicy && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-2xl">{selectedPolicy.title}</DialogTitle>
                      <DialogDescription className="mt-2">
                        {selectedPolicy.description}
                      </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(selectedPolicy.status)}>
                        {selectedPolicy.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(selectedPolicy.priority)}>
                        {selectedPolicy.priority}
                      </Badge>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Policy Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Version</p>
                      <p className="text-lg font-bold">{selectedPolicy.version}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Created By</p>
                      <p className="text-lg font-bold">{selectedPolicy.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Effective Date</p>
                      <p className="text-lg font-bold">{formatDate(selectedPolicy.effectiveDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Updated</p>
                      <p className="text-lg font-bold">{formatDate(selectedPolicy.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Policy Content */}
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed border-l-4 border-indigo-200 pl-4 bg-gray-50 p-4 rounded-r-lg">
                      {selectedPolicy.content}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPolicy.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Acknowledgment Section */}
                  {selectedPolicy.status === "active" && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Policy Acknowledgment</h4>
                        {!hasAcknowledged(selectedPolicy) ? (
                          <Button
                            onClick={() => {
                              handleAcknowledgePolicy(selectedPolicy.id);
                              setIsViewDialogOpen(false);
                            }}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Acknowledge Policy
                          </Button>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Acknowledged
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">
                          By acknowledging this policy, you confirm that you have read, understood, 
                          and agree to comply with all the terms and conditions outlined above.
                        </p>
                        <p>
                          Acknowledgments: {selectedPolicy.acknowledgments.length} employees
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
