import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Shield,
  Key,
  Download,
  Upload,
  Send,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  UserCheck,
  Star,
  Clock
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
import { HROnly, AdminOnly } from "@/components/RoleAccess";
import { UserRole, Department, getRoleDisplayName, getDepartmentDisplayName, getRoleColor } from "@/types/roles";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  workInfo: {
    role: UserRole;
    department: Department;
    joinDate: string;
    reportingManager: string;
    workLocation: string;
    employmentType: "full-time" | "part-time" | "contract" | "intern";
    salary: number;
    benefits: string[];
  };
  credentials: {
    username: string;
    temporaryPassword: string;
    isPasswordChanged: boolean;
    lastLogin?: string;
    loginAttempts: number;
    accountStatus: "active" | "inactive" | "suspended" | "pending";
  };
  documents: {
    resume?: string;
    idProof?: string;
    addressProof?: string;
    educationCertificates?: string[];
    contracts?: string[];
  };
  status: "active" | "inactive" | "terminated" | "on-leave";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const sampleEmployees: Employee[] = [
  {
    id: "emp-001",
    employeeId: "EMP001",
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      phone: "+1-555-0123",
      dateOfBirth: "1990-05-15",
      address: "123 Main St, New York, NY 10001",
      emergencyContact: {
        name: "Jane Doe",
        phone: "+1-555-0124",
        relationship: "Spouse"
      }
    },
    workInfo: {
      role: "employee",
      department: "engineering",
      joinDate: "2023-01-15",
      reportingManager: "Sarah Chen",
      workLocation: "New York Office",
      employmentType: "full-time",
      salary: 85000,
      benefits: ["Health Insurance", "Dental", "401k", "PTO"]
    },
    credentials: {
      username: "john.doe",
      temporaryPassword: "TempPass123!",
      isPasswordChanged: true,
      lastLogin: "2024-01-20T09:30:00Z",
      loginAttempts: 0,
      accountStatus: "active"
    },
    documents: {},
    status: "active",
    createdAt: "2023-01-10T10:00:00Z",
    updatedAt: "2024-01-20T09:30:00Z",
    createdBy: "HR Team"
  },
  {
    id: "emp-002",
    employeeId: "EMP002",
    personalInfo: {
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@company.com",
      phone: "+1-555-0125",
      dateOfBirth: "1985-08-22",
      address: "456 Oak Ave, San Francisco, CA 94102",
      emergencyContact: {
        name: "Michael Chen",
        phone: "+1-555-0126",
        relationship: "Brother"
      }
    },
    workInfo: {
      role: "department_manager",
      department: "engineering",
      joinDate: "2020-03-01",
      reportingManager: "CTO",
      workLocation: "San Francisco Office",
      employmentType: "full-time",
      salary: 120000,
      benefits: ["Health Insurance", "Dental", "401k", "PTO", "Stock Options"]
    },
    credentials: {
      username: "sarah.chen",
      temporaryPassword: "Manager456!",
      isPasswordChanged: true,
      lastLogin: "2024-01-21T08:15:00Z",
      loginAttempts: 0,
      accountStatus: "active"
    },
    documents: {},
    status: "active",
    createdAt: "2020-02-25T14:00:00Z",
    updatedAt: "2024-01-21T08:15:00Z",
    createdBy: "HR Team"
  }
];

export default function EmployeeManagement() {
  const { userProfile, hasPermission } = useAuth();
  const { toast } = useToast();

  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(sampleEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    role: "employee" as UserRole,
    department: "engineering" as Department,
    joinDate: "",
    reportingManager: "",
    workLocation: "",
    employmentType: "full-time" as Employee["workInfo"]["employmentType"],
    salary: "",
    benefits: [] as string[]
  });

  // Filter employees
  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(emp => emp.workInfo.department === departmentFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, departmentFilter, statusFilter, employees]);

  // Generate login credentials
  const generateCredentials = (firstName: string, lastName: string) => {
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const password = generatePassword();
    return { username, password };
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // At least one uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // At least one lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // At least one number
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)]; // At least one special char
    
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const generateEmployeeId = () => {
    const prefix = "EMP";
    const number = String(employees.length + 1).padStart(3, '0');
    return `${prefix}${number}`;
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const credentials = generateCredentials(newEmployee.firstName, newEmployee.lastName);
      const employeeId = generateEmployeeId();

      const employee: Employee = {
        id: `emp-${Date.now()}`,
        employeeId,
        personalInfo: {
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          email: newEmployee.email,
          phone: newEmployee.phone,
          dateOfBirth: newEmployee.dateOfBirth,
          address: newEmployee.address,
          emergencyContact: {
            name: newEmployee.emergencyContactName,
            phone: newEmployee.emergencyContactPhone,
            relationship: newEmployee.emergencyContactRelationship
          }
        },
        workInfo: {
          role: newEmployee.role,
          department: newEmployee.department,
          joinDate: newEmployee.joinDate || new Date().toISOString().split('T')[0],
          reportingManager: newEmployee.reportingManager,
          workLocation: newEmployee.workLocation,
          employmentType: newEmployee.employmentType,
          salary: parseInt(newEmployee.salary) || 0,
          benefits: newEmployee.benefits
        },
        credentials: {
          username: credentials.username,
          temporaryPassword: credentials.password,
          isPasswordChanged: false,
          loginAttempts: 0,
          accountStatus: "pending"
        },
        documents: {},
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userProfile?.displayName || "HR"
      };

      setEmployees(prev => [employee, ...prev]);

      // Show credentials dialog
      toast({
        title: "Employee Added Successfully",
        description: `Login credentials generated for ${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
      });

      // Send credentials email (simulated)
      await sendCredentialsEmail(employee);

      // Reset form
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        role: "employee",
        department: "engineering",
        joinDate: "",
        reportingManager: "",
        workLocation: "",
        employmentType: "full-time",
        salary: "",
        benefits: []
      });

      setIsAddDialogOpen(false);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendCredentialsEmail = async (employee: Employee) => {
    // Simulate sending email with credentials
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Credentials Sent",
      description: `Login credentials have been sent to ${employee.personalInfo.email}`,
    });
  };

  const copyCredentials = (employee: Employee) => {
    const credentials = `Username: ${employee.credentials.username}\nPassword: ${employee.credentials.temporaryPassword}`;
    navigator.clipboard.writeText(credentials);
    toast({
      title: "Credentials Copied",
      description: "Login credentials copied to clipboard",
    });
  };

  const resetPassword = (employeeId: string) => {
    const newPassword = generatePassword();
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { 
            ...emp, 
            credentials: { 
              ...emp.credentials, 
              temporaryPassword: newPassword, 
              isPasswordChanged: false 
            } 
          }
        : emp
    ));

    toast({
      title: "Password Reset",
      description: "New temporary password generated",
    });
  };

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "terminated": return "bg-red-100 text-red-800";
      case "on-leave": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAccountStatusColor = (status: Employee["credentials"]["accountStatus"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-600">Manage employee records, credentials, and information</p>
              </div>
            </div>

            <HROnly>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Create a new employee record and generate login credentials automatically
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="personal">Personal Info</TabsTrigger>
                      <TabsTrigger value="work">Work Details</TabsTrigger>
                      <TabsTrigger value="review">Review & Submit</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">First Name *</label>
                          <Input
                            placeholder="Enter first name"
                            value={newEmployee.firstName}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Last Name *</label>
                          <Input
                            placeholder="Enter last name"
                            value={newEmployee.lastName}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email *</label>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone</label>
                          <Input
                            placeholder="Enter phone number"
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Date of Birth</label>
                        <Input
                          type="date"
                          value={newEmployee.dateOfBirth}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Address</label>
                        <Textarea
                          placeholder="Enter full address"
                          value={newEmployee.address}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, address: e.target.value }))}
                          rows={3}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-4">Emergency Contact</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Name</label>
                            <Input
                              placeholder="Contact name"
                              value={newEmployee.emergencyContactName}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Phone</label>
                            <Input
                              placeholder="Contact phone"
                              value={newEmployee.emergencyContactPhone}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Relationship</label>
                            <Input
                              placeholder="e.g., Spouse, Parent"
                              value={newEmployee.emergencyContactRelationship}
                              onChange={(e) => setNewEmployee(prev => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="work" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Role *</label>
                          <Select value={newEmployee.role} onValueChange={(value: UserRole) => 
                            setNewEmployee(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="senior_employee">Senior Employee</SelectItem>
                              <SelectItem value="team_lead">Team Lead</SelectItem>
                              <SelectItem value="department_manager">Department Manager</SelectItem>
                              <SelectItem value="hr_manager">HR Manager</SelectItem>
                              <SelectItem value="admin">Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Department *</label>
                          <Select value={newEmployee.department} onValueChange={(value: Department) => 
                            setNewEmployee(prev => ({ ...prev, department: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="operations">Operations</SelectItem>
                              <SelectItem value="it">Information Technology</SelectItem>
                              <SelectItem value="admin">Administration</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Join Date</label>
                          <Input
                            type="date"
                            value={newEmployee.joinDate}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, joinDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Employment Type</label>
                          <Select value={newEmployee.employmentType} onValueChange={(value: Employee["workInfo"]["employmentType"]) => 
                            setNewEmployee(prev => ({ ...prev, employmentType: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Reporting Manager</label>
                          <Input
                            placeholder="Enter manager name"
                            value={newEmployee.reportingManager}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, reportingManager: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Work Location</label>
                          <Input
                            placeholder="e.g., New York Office"
                            value={newEmployee.workLocation}
                            onChange={(e) => setNewEmployee(prev => ({ ...prev, workLocation: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Annual Salary</label>
                        <Input
                          type="number"
                          placeholder="Enter annual salary"
                          value={newEmployee.salary}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="review" className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Login Credentials (Auto-Generated)
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Username:</span> {newEmployee.firstName && newEmployee.lastName ? `${newEmployee.firstName.toLowerCase()}.${newEmployee.lastName.toLowerCase()}` : "Will be generated"}
                          </div>
                          <div>
                            <span className="font-medium">Password:</span> Will be auto-generated and sent via email
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Review Employee Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> {newEmployee.firstName} {newEmployee.lastName}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {newEmployee.email}
                          </div>
                          <div>
                            <span className="font-medium">Role:</span> {getRoleDisplayName(newEmployee.role)}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {getDepartmentDisplayName(newEmployee.department)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleAddEmployee} className="bg-blue-500 hover:bg-blue-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Employee Account
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </HROnly>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
                  </div>
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">
                      {employees.filter(e => e.status === "active").length}
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
                    <p className="text-sm font-medium text-gray-600">Pending Accounts</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {employees.filter(e => e.credentials.accountStatus === "pending").length}
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
                    <p className="text-sm font-medium text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-purple-900">3</p>
                  </div>
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employee List */}
        <div className="grid gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {employee.personalInfo.firstName[0]}{employee.personalInfo.lastName[0]}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">
                        {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {employee.personalInfo.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {getDepartmentDisplayName(employee.workInfo.department)}
                        </span>
                        <span>ID: {employee.employeeId}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getRoleColor(employee.workInfo.role)}>
                          {getRoleDisplayName(employee.workInfo.role)}
                        </Badge>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                        <Badge className={getAccountStatusColor(employee.credentials.accountStatus)}>
                          {employee.credentials.accountStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <HROnly>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCredentials(employee)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Credentials
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetPassword(employee.id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Reset Password
                      </Button>
                    </HROnly>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employee Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedEmployee && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedEmployee.personalInfo.firstName} {selectedEmployee.personalInfo.lastName}
                  </DialogTitle>
                  <DialogDescription>
                    Employee ID: {selectedEmployee.employeeId}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="work">Work Details</TabsTrigger>
                    <TabsTrigger value="credentials">Credentials</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {selectedEmployee.personalInfo.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {selectedEmployee.personalInfo.phone || "Not provided"}
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{selectedEmployee.personalInfo.address || "Not provided"}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Emergency Contact</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> {selectedEmployee.personalInfo.emergencyContact.name || "Not provided"}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {selectedEmployee.personalInfo.emergencyContact.phone || "Not provided"}
                          </div>
                          <div>
                            <span className="font-medium">Relationship:</span> {selectedEmployee.personalInfo.emergencyContact.relationship || "Not provided"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="work" className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Position Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Role:</span> {getRoleDisplayName(selectedEmployee.workInfo.role)}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {getDepartmentDisplayName(selectedEmployee.workInfo.department)}
                          </div>
                          <div>
                            <span className="font-medium">Employment Type:</span> {selectedEmployee.workInfo.employmentType}
                          </div>
                          <div>
                            <span className="font-medium">Reporting Manager:</span> {selectedEmployee.workInfo.reportingManager}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Employment Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Join Date:</span> {selectedEmployee.workInfo.joinDate}
                          </div>
                          <div>
                            <span className="font-medium">Work Location:</span> {selectedEmployee.workInfo.workLocation}
                          </div>
                          <div>
                            <span className="font-medium">Annual Salary:</span> ${selectedEmployee.workInfo.salary.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="credentials" className="space-y-4">
                    <HROnly
                      fallback={
                        <div className="text-center py-8">
                          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Access restricted to HR personnel only</p>
                        </div>
                      }
                    >
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Login Credentials</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Username:</span>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                                {selectedEmployee.credentials.username}
                              </code>
                              <Button size="sm" variant="outline" onClick={() => copyCredentials(selectedEmployee)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Temporary Password:</span>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                                {selectedEmployee.credentials.temporaryPassword}
                              </code>
                              <Button size="sm" variant="outline" onClick={() => resetPassword(selectedEmployee.id)}>
                                <RefreshCw className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Account Status:</span>
                            <Badge className={getAccountStatusColor(selectedEmployee.credentials.accountStatus)}>
                              {selectedEmployee.credentials.accountStatus}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Password Changed:</span>
                            <Badge className={selectedEmployee.credentials.isPasswordChanged ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {selectedEmployee.credentials.isPasswordChanged ? "Yes" : "No"}
                            </Badge>
                          </div>

                          {selectedEmployee.credentials.lastLogin && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Last Login:</span>
                              <span className="text-sm text-gray-600">
                                {new Date(selectedEmployee.credentials.lastLogin).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Button
                            size="sm"
                            onClick={() => sendCredentialsEmail(selectedEmployee)}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Resend Credentials Email
                          </Button>
                        </div>
                      </div>
                    </HROnly>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
