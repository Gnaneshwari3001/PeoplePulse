import { useState } from "react";
import { ArrowLeft, Search, Mail, Phone, MapPin, Users, Filter, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  status: "active" | "away" | "offline";
  avatar?: string;
  joinDate: string;
  manager: string;
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
    status: "active",
    joinDate: "2022-01-15",
    manager: "John Smith"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@peoplepulse.com", 
    phone: "+1 (555) 234-5678",
    role: "Product Manager",
    department: "Product",
    location: "New York, NY",
    status: "active",
    joinDate: "2021-08-22",
    manager: "Lisa Wang"
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@peoplepulse.com",
    phone: "+1 (555) 345-6789", 
    role: "HR Specialist",
    department: "Human Resources",
    location: "Chicago, IL",
    status: "away",
    joinDate: "2023-03-10",
    manager: "Robert Brown"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@peoplepulse.com",
    phone: "+1 (555) 456-7890",
    role: "Marketing Manager",
    department: "Marketing",
    location: "Los Angeles, CA", 
    status: "active",
    joinDate: "2022-11-05",
    manager: "Jennifer Lee"
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
    joinDate: "2023-01-20",
    manager: "Michael Chen"
  },
  {
    id: "6",
    name: "Ryan Thompson",
    email: "ryan.thompson@peoplepulse.com",
    phone: "+1 (555) 678-9012",
    role: "DevOps Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    status: "active",
    joinDate: "2022-06-12",
    manager: "John Smith"
  },
  {
    id: "7",
    name: "Amanda White",
    email: "amanda.white@peoplepulse.com",
    phone: "+1 (555) 789-0123",
    role: "Financial Analyst",
    department: "Finance",
    location: "Boston, MA",
    status: "active",
    joinDate: "2023-05-08",
    manager: "Karen Davis"
  },
  {
    id: "8",
    name: "James Brown",
    email: "james.brown@peoplepulse.com",
    phone: "+1 (555) 890-1234",
    role: "Sales Representative",
    department: "Sales",
    location: "Miami, FL",
    status: "away",
    joinDate: "2022-09-15",
    manager: "Steve Miller"
  }
];

export default function TeamDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "away": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
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
              <h1 className="text-3xl font-bold text-gray-900">Team Directory</h1>
              <p className="text-gray-600 mt-1">Browse team members, contact information, and organizational structure</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{filteredEmployees.length}</p>
              <p className="text-sm text-gray-600">Total Employees</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold text-green-600">
                    {employees.filter(emp => emp.status === "active").length}
                  </p>
                </div>
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
                </div>
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold text-indigo-600">3</p>
                </div>
                <User className="w-6 h-6 text-indigo-600" />
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
                    placeholder="Search employees by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="away">Away</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-brand-teal to-brand-blue text-white font-semibold">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusDot(employee.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{employee.name}</h3>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-1">{employee.role}</p>
                    <p className="text-sm text-gray-600 mb-3">{employee.department}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{employee.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Joined: {new Date(employee.joinDate).toLocaleDateString()}</span>
                        <span>Manager: {employee.manager}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
