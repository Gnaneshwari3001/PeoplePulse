import { useState } from "react";
import { ArrowLeft, Plus, MessageSquare, Search, Send, Upload, Users, Phone, Mail, MapPin, Clock, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  status: "online" | "away" | "offline";
  avatar?: string;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "announcement";
  channel?: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: "public" | "private" | "announcement";
  memberCount: number;
  unreadCount: number;
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@peoplepulse.com",
    phone: "+1 (555) 123-4567",
    role: "Senior Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    status: "online"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@peoplepulse.com",
    phone: "+1 (555) 234-5678",
    role: "Product Manager",
    department: "Product",
    location: "New York, NY",
    status: "online"
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@peoplepulse.com",
    phone: "+1 (555) 345-6789",
    role: "HR Specialist",
    department: "Human Resources",
    location: "Chicago, IL",
    status: "away"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@peoplepulse.com",
    phone: "+1 (555) 456-7890",
    role: "Marketing Manager",
    department: "Marketing",
    location: "Los Angeles, CA",
    status: "online"
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.martinez@peoplepulse.com",
    phone: "+1 (555) 567-8901",
    role: "UX Designer",
    department: "Design",
    location: "Austin, TX",
    status: "offline",
    lastSeen: "2 hours ago"
  }
];

const channels: Channel[] = [
  {
    id: "general",
    name: "General",
    description: "Company-wide discussions",
    type: "public",
    memberCount: 156,
    unreadCount: 3
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Technical discussions and updates",
    type: "public",
    memberCount: 24,
    unreadCount: 1
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Official company announcements",
    type: "announcement",
    memberCount: 156,
    unreadCount: 1
  },
  {
    id: "hr-updates",
    name: "HR Updates",
    description: "Human resources information",
    type: "public",
    memberCount: 156,
    unreadCount: 0
  }
];

const initialMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Sarah Johnson",
    content: "Good morning everyone! Hope you're all having a great start to the week.",
    timestamp: "2024-12-06T09:15:00",
    type: "text",
    channel: "general"
  },
  {
    id: "2",
    senderId: "2",
    senderName: "Michael Chen",
    content: "Don't forget about the product demo at 2 PM today in the main conference room.",
    timestamp: "2024-12-06T10:30:00",
    type: "text",
    channel: "general"
  },
  {
    id: "3",
    senderId: "admin",
    senderName: "HR Department",
    content: "📢 Reminder: Annual performance reviews are due by December 15th. Please complete your self-assessments in the Growth & Feedback module.",
    timestamp: "2024-12-06T11:00:00",
    type: "announcement",
    channel: "announcements"
  }
];

export default function Connect() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    location: ""
  });

  const { toast } = useToast();

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChannelData = channels.find(c => c.id === selectedChannel);
  const channelMessages = messages.filter(m => m.channel === selectedChannel);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: (messages.length + 1).toString(),
      senderId: "current-user",
      senderName: "You",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      channel: selectedChannel
    };

    setMessages([...messages, message]);
    setNewMessage("");

    toast({
      title: "Message sent!",
      description: `Your message was posted to ${selectedChannelData?.name}`
    });
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would make an API call
    toast({
      title: "Employee Added Successfully!",
      description: `${newEmployee.name} has been added to the company directory.`
    });

    setNewEmployee({ name: "", email: "", phone: "", role: "", department: "", location: "" });
    setIsNewEmployeeOpen(false);
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
              <h1 className="text-3xl font-bold text-gray-900">Connect</h1>
              <p className="text-gray-600 mt-1">Internal chat, team channels, and employee directory</p>
            </div>
            <Dialog open={isNewEmployeeOpen} onOpenChange={setIsNewEmployeeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Add a new employee to the company directory and communication channels.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter employee's full name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="employee@peoplepulse.com"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Job Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g., Software Engineer, Product Manager"
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={newEmployee.location}
                      onChange={(e) => setNewEmployee({...newEmployee, location: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewEmployeeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>
                    Add Employee
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Tabs value={selectedChannel} onValueChange={setSelectedChannel} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                {channels.map((channel) => (
                  <TabsTrigger key={channel.id} value={channel.id} className="relative">
                    {channel.name}
                    {channel.unreadCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {channels.map((channel) => (
                <TabsContent key={channel.id} value={channel.id}>
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">#{channel.name}</CardTitle>
                          <p className="text-sm text-gray-600">{channel.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>{channel.memberCount} members</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                        {channelMessages.map((message) => (
                          <div key={message.id} className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                                {getInitials(message.senderName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{message.senderName}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                {message.type === "announcement" && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">Announcement</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <Textarea
                            placeholder={`Message #${channel.name}...`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="min-h-[60px] pr-20"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <div className="absolute bottom-2 right-2 flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Paperclip className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Smile className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Button onClick={handleSendMessage} className="self-end">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Employee Directory Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Directory</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-brand-teal to-brand-blue text-white">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(employee.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{employee.name}</p>
                      <p className="text-xs text-gray-600 truncate">{employee.role}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {employee.department}
                        </Badge>
                        {employee.status === "offline" && employee.lastSeen && (
                          <span className="text-xs text-gray-500">• {employee.lastSeen}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Share File
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Channel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Start Group Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
