import { useState } from "react";
import { ArrowLeft, Plus, Headphones, MessageSquare, Search, Filter, Clock, CheckCircle, AlertCircle, XCircle, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: "IT" | "HR" | "Admin" | "Finance" | "General";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdDate: string;
  updatedDate: string;
  assignee?: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  timestamp: string;
  author: string;
  isStaff: boolean;
}

const initialTickets: Ticket[] = [
  {
    id: "1",
    title: "Password Reset Request",
    description: "I cannot access my email account and need to reset my password for the company portal.",
    category: "IT",
    priority: "medium",
    status: "resolved",
    createdDate: "2024-12-02",
    updatedDate: "2024-12-03",
    assignee: "Tech Support Team",
    responses: [
      {
        id: "1",
        message: "Hi! I've reset your password and sent the new credentials to your personal email. Please check your inbox.",
        timestamp: "2024-12-03T10:30:00",
        author: "John Smith - IT Support",
        isStaff: true
      },
      {
        id: "2", 
        message: "Thank you! I received the email and can now access my account successfully.",
        timestamp: "2024-12-03T11:15:00",
        author: "You",
        isStaff: false
      }
    ]
  },
  {
    id: "2",
    title: "Laptop Hardware Issue",
    description: "My laptop screen flickers intermittently and sometimes goes black. This is affecting my productivity.",
    category: "IT",
    priority: "high",
    status: "in-progress",
    createdDate: "2024-12-04",
    updatedDate: "2024-12-05",
    assignee: "Hardware Support",
    responses: [
      {
        id: "1",
        message: "We've received your request. Can you please provide the laptop model and serial number?",
        timestamp: "2024-12-04T14:20:00",
        author: "Sarah Wilson - IT Support",
        isStaff: true
      },
      {
        id: "2",
        message: "The model is Dell Latitude 7420, Serial: DL7420-2023-001234",
        timestamp: "2024-12-04T15:45:00",
        author: "You",
        isStaff: false
      },
      {
        id: "3",
        message: "Thanks! We're arranging a replacement laptop. You should receive it by tomorrow.",
        timestamp: "2024-12-05T09:10:00",
        author: "Sarah Wilson - IT Support",
        isStaff: true
      }
    ]
  },
  {
    id: "3",
    title: "Leave Balance Inquiry",
    description: "Could you please clarify my current leave balance? The portal shows different numbers than my records.",
    category: "HR",
    priority: "low",
    status: "open",
    createdDate: "2024-12-05",
    updatedDate: "2024-12-05",
    responses: []
  },
  {
    id: "4",
    title: "Office Key Card Access",
    description: "My access card is not working for the building entrance and conference rooms.",
    category: "Admin",
    priority: "medium",
    status: "resolved",
    createdDate: "2024-11-28",
    updatedDate: "2024-11-29",
    assignee: "Facilities Team",
    responses: [
      {
        id: "1",
        message: "Your access card has been reactivated. Please try accessing the building now.",
        timestamp: "2024-11-29T08:30:00",
        author: "Mike Johnson - Facilities",
        isStaff: true
      }
    ]
  },
  {
    id: "5",
    title: "Expense Report System Error",
    description: "Getting a system error when trying to submit my monthly expense report. Error code: EXP_001",
    category: "Finance",
    priority: "urgent",
    status: "in-progress",
    createdDate: "2024-12-05",
    updatedDate: "2024-12-05",
    assignee: "Finance IT Team",
    responses: [
      {
        id: "1",
        message: "We're aware of this issue and working on a fix. Expected resolution within 2 hours.",
        timestamp: "2024-12-05T13:45:00",
        author: "Lisa Chen - Finance Support",
        isStaff: true
      }
    ]
  }
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking 'Forgot Password' on the login page, or submit a ticket to IT support."
  },
  {
    question: "Who do I contact for HR issues?",
    answer: "Submit an HR ticket through this portal or contact hr@peoplepulse.com directly."
  },
  {
    question: "How long does it take to resolve tickets?",
    answer: "Response times vary by priority: Urgent (2 hours), High (4 hours), Medium (1 day), Low (2-3 days)."
  },
  {
    question: "Can I update my ticket after submission?",
    answer: "Yes, you can add comments and responses to your existing tickets anytime."
  }
];

const quickTemplates = [
  {
    title: "Password Reset Request",
    description: "I need to reset my password for [specify which system/account]. I am unable to access [provide details about the issue].",
    category: "IT" as Ticket["category"],
    priority: "medium" as Ticket["priority"]
  },
  {
    title: "Leave Request Question",
    description: "I have a question about my leave balance/policy. [Please specify your question about vacation, sick leave, etc.]",
    category: "HR" as Ticket["category"],
    priority: "low" as Ticket["priority"]
  },
  {
    title: "Equipment/Hardware Issue",
    description: "I am experiencing an issue with my [laptop/desktop/phone/other equipment]. The problem is: [describe the issue in detail].",
    category: "IT" as Ticket["category"],
    priority: "high" as Ticket["priority"]
  },
  {
    title: "Expense Reimbursement Query",
    description: "I have a question about my expense reimbursement for [specify expense type]. [Provide details about your query].",
    category: "Finance" as Ticket["category"],
    priority: "medium" as Ticket["priority"]
  },
  {
    title: "Office Access/Security Issue",
    description: "I am having trouble with [access card/building entry/office security]. [Describe the specific issue you're experiencing].",
    category: "Admin" as Ticket["category"],
    priority: "medium" as Ticket["priority"]
  }
];

export default function SupportHelpdesk() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "General" as Ticket["category"],
    priority: "medium" as Ticket["priority"]
  });
  
  const { toast } = useToast();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const ticketsByStatus = {
    open: filteredTickets.filter(ticket => ticket.status === "open"),
    "in-progress": filteredTickets.filter(ticket => ticket.status === "in-progress"),
    resolved: filteredTickets.filter(ticket => ticket.status === "resolved"),
    closed: filteredTickets.filter(ticket => ticket.status === "closed")
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress": return "bg-purple-100 text-purple-800 border-purple-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      case "closed": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <Zap className="w-4 h-4" />;
      case "high": return <AlertCircle className="w-4 h-4" />;
      case "medium": return <Clock className="w-4 h-4" />;
      case "low": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleSubmitTicket = () => {
    // Enhanced validation
    if (!newTicket.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a clear subject for your query.",
        variant: "destructive"
      });
      return;
    }

    if (!newTicket.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide detailed information about your issue or question.",
        variant: "destructive"
      });
      return;
    }

    if (newTicket.title.length < 10) {
      toast({
        title: "Title Too Short",
        description: "Please provide a more descriptive subject (at least 10 characters).",
        variant: "destructive"
      });
      return;
    }

    if (newTicket.description.length < 20) {
      toast({
        title: "Description Too Short",
        description: "Please provide more details about your query (at least 20 characters).",
        variant: "destructive"
      });
      return;
    }

    const ticket: Ticket = {
      id: (tickets.length + 1).toString(),
      title: newTicket.title.trim(),
      description: newTicket.description.trim(),
      category: newTicket.category,
      priority: newTicket.priority,
      status: "open",
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      responses: [
        {
          id: "auto-1",
          message: `Thank you for submitting your ${newTicket.category} query. Our support team has been notified and will respond according to the ${newTicket.priority} priority level. Expected response time: ${
            newTicket.priority === "urgent" ? "within 2 hours" :
            newTicket.priority === "high" ? "within 4 hours" :
            newTicket.priority === "medium" ? "within 1 business day" :
            "within 2-3 business days"
          }.`,
          timestamp: new Date().toISOString(),
          author: "PeoplePulse Support System",
          isStaff: true
        }
      ]
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ title: "", description: "", category: "General", priority: "medium" });
    setIsNewTicketOpen(false);

    toast({
      title: "✅ Query Submitted Successfully!",
      description: `Your ticket #${ticket.id} has been created. Check your ticket status in the Open tab.`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support & Helpdesk</h1>
              <p className="text-gray-600 mt-1">IT support, HR assistance, and help tickets</p>
            </div>
            <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Support Ticket</DialogTitle>
                  <DialogDescription>
                    Describe your issue and we'll get back to you as soon as possible. You can use a template or create a custom query.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Quick Templates (Optional)</Label>
                    <Select value="" onValueChange={(value) => {
                      const template = quickTemplates.find(t => t.title === value);
                      if (template) {
                        setNewTicket({
                          title: template.title,
                          description: template.description,
                          category: template.category,
                          priority: template.priority
                        });
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template or create custom" />
                      </SelectTrigger>
                      <SelectContent>
                        {quickTemplates.map((template, index) => (
                          <SelectItem key={index} value={template.title}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Subject * <span className="text-xs text-gray-500">({newTicket.title.length}/100)</span></Label>
                    <Input
                      id="title"
                      placeholder="Brief, clear description of your issue or question"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                      maxLength={100}
                    />
                    {newTicket.title.length > 0 && newTicket.title.length < 10 && (
                      <p className="text-xs text-amber-600">Please provide a more descriptive subject (at least 10 characters)</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTicket.category} onValueChange={(value: Ticket["category"]) => setNewTicket({...newTicket, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT Support</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                        <SelectItem value="Admin">Administration</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTicket.priority} onValueChange={(value: Ticket["priority"]) => setNewTicket({...newTicket, priority: value})}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description * <span className="text-xs text-gray-500">({newTicket.description.length}/500)</span></Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your issue, question, or request. Include any error messages, steps you've tried, or specific assistance needed."
                      className="min-h-[120px]"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      maxLength={500}
                    />
                    {newTicket.description.length > 0 && newTicket.description.length < 20 && (
                      <p className="text-xs text-amber-600">Please provide more details (at least 20 characters)</p>
                    )}
                    <p className="text-xs text-gray-500">
                      💡 Tip: The more details you provide, the faster we can help you!
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitTicket}>
                    Submit Ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                </div>
                <Headphones className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-blue-600">{ticketsByStatus.open.length}</p>
                </div>
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{ticketsByStatus["in-progress"].length}</p>
                </div>
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{ticketsByStatus.resolved.length}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="IT">IT Support</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Admin">Administration</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tickets Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({filteredTickets.length})</TabsTrigger>
                <TabsTrigger value="open">Open ({ticketsByStatus.open.length})</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress ({ticketsByStatus["in-progress"].length})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({ticketsByStatus.resolved.length})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({ticketsByStatus.closed.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">#{ticket.id} - {ticket.title}</h3>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              <div className="flex items-center space-x-1">
                                {getPriorityIcon(ticket.priority)}
                                <span>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                              </div>
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(ticket.status)}
                                <span>{ticket.status === "in-progress" ? "In Progress" : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                              </div>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{ticket.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Category: {ticket.category}</span>
                            <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                            <span>Updated: {new Date(ticket.updatedDate).toLocaleDateString()}</span>
                            {ticket.assignee && <span>Assigned to: {ticket.assignee}</span>}
                          </div>
                        </div>
                      </div>
                      
                      {ticket.responses.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Latest Response:</p>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {ticket.responses[ticket.responses.length - 1].author}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(ticket.responses[ticket.responses.length - 1].timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {ticket.responses[ticket.responses.length - 1].message}
                            </p>
                          </div>
                          {ticket.responses.length > 1 && (
                            <p className="text-xs text-gray-500 mt-2">
                              +{ticket.responses.length - 1} more response{ticket.responses.length > 2 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {["open", "in-progress", "resolved", "closed"].map((status) => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {ticketsByStatus[status as keyof typeof ticketsByStatus].map((ticket) => (
                    <Card key={ticket.id} className={`hover:shadow-md transition-shadow ${
                      status === "resolved" ? "border-green-200 bg-green-50/30" :
                      status === "in-progress" ? "border-purple-200" :
                      status === "open" ? "border-blue-200" : ""
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">#{ticket.id} - {ticket.title}</h3>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                <div className="flex items-center space-x-1">
                                  {getPriorityIcon(ticket.priority)}
                                  <span>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                                </div>
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{ticket.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Category: {ticket.category}</span>
                              <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                              {ticket.assignee && <span>Assigned to: {ticket.assignee}</span>}
                            </div>
                          </div>
                        </div>
                        
                        {ticket.responses.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">Latest Response:</p>
                            <div className="bg-white rounded-lg p-3 border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {ticket.responses[ticket.responses.length - 1].author}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(ticket.responses[ticket.responses.length - 1].timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {ticket.responses[ticket.responses.length - 1].message}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* FAQ and Quick Help */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Quick Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IT Support:</span>
                    <span className="text-sm font-medium">ext. 1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">HR Support:</span>
                    <span className="text-sm font-medium">ext. 5678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Admin:</span>
                    <span className="text-sm font-medium">ext. 9012</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Emergency Support: Available 24/7<br/>
                    Call ext. 911 for urgent issues
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-medium text-blue-900 mb-2">Need Immediate Help?</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    For urgent issues, call our support hotline or use the emergency contact.
                  </p>
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Emergency Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
