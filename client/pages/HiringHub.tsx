import { useState } from "react";
import { ArrowLeft, Plus, Briefcase, MapPin, Clock, DollarSign, Users, Search, Filter, Star, Send, Upload, Calendar, Eye } from "lucide-react";
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

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  status: "open" | "closed" | "filled";
  applicants: number;
}

interface Referral {
  id: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  status: "pending" | "interview-scheduled" | "hired" | "rejected";
  submittedDate: string;
  bonus?: number;
}

const initialJobOpenings: JobOpening[] = [
  {
    id: "JOB-001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "4-6 years",
    salary: "$120,000 - $150,000",
    description: "We're looking for a passionate Senior Frontend Developer to join our growing engineering team. You'll be responsible for building user-facing features, optimizing performance, and collaborating with designers to create exceptional user experiences.",
    requirements: [
      "4+ years of experience with React, TypeScript, and modern JavaScript",
      "Strong understanding of CSS, HTML, and responsive design",
      "Experience with state management (Redux, Zustand, etc.)",
      "Knowledge of testing frameworks (Jest, React Testing Library)",
      "Familiarity with build tools (Webpack, Vite, etc.)"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work from home policy",
      "Annual learning & development budget",
      "Unlimited PTO policy"
    ],
    postedDate: "2024-12-01",
    status: "open",
    applicants: 23
  },
  {
    id: "JOB-002",
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    experience: "3-5 years",
    salary: "$110,000 - $140,000",
    description: "Join our product team to drive innovation and shape the future of our platform. You'll work closely with engineering, design, and business stakeholders to define product strategy and deliver features that delight our users.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile development methodologies",
      "Excellent communication and collaboration skills",
      "Data-driven approach to decision making"
    ],
    benefits: [
      "Stock options and performance bonuses",
      "Premium healthcare coverage",
      "Flexible working hours",
      "Professional development opportunities",
      "Team building and company events"
    ],
    postedDate: "2024-11-28",
    status: "open",
    applicants: 31
  },
  {
    id: "JOB-003",
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    experience: "2-4 years",
    salary: "$85,000 - $110,000",
    description: "We're seeking a creative UX Designer to help us create intuitive and engaging user experiences. You'll conduct user research, create wireframes and prototypes, and collaborate with product and engineering teams.",
    requirements: [
      "2+ years of UX/UI design experience",
      "Proficiency in Figma, Sketch, or similar design tools",
      "Strong portfolio demonstrating design process",
      "Experience with user research and usability testing",
      "Understanding of accessibility principles"
    ],
    benefits: [
      "Remote-first work environment",
      "Top-tier design tools and equipment",
      "Conference and workshop allowances",
      "Flexible vacation policy",
      "Health and wellness stipend"
    ],
    postedDate: "2024-12-03",
    status: "open",
    applicants: 18
  },
  {
    id: "JOB-004",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    experience: "3-5 years",
    salary: "$100,000 - $130,000",
    description: "Help us scale our infrastructure and improve our deployment processes. You'll work on CI/CD pipelines, monitoring systems, and cloud infrastructure to ensure our platform runs smoothly.",
    requirements: [
      "Experience with AWS, Azure, or Google Cloud",
      "Strong knowledge of Docker and Kubernetes",
      "Proficiency in scripting languages (Python, Bash)",
      "Experience with CI/CD tools (Jenkins, GitLab CI, GitHub Actions)",
      "Understanding of monitoring and logging tools"
    ],
    benefits: [
      "Competitive compensation package",
      "Cutting-edge technology stack",
      "Professional certification support",
      "Flexible work arrangements",
      "Performance-based bonuses"
    ],
    postedDate: "2024-11-25",
    status: "open",
    applicants: 15
  },
  {
    id: "JOB-005",
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "Full-time",
    experience: "1-3 years",
    salary: "$60,000 - $80,000",
    description: "Join our marketing team to help grow our brand and reach new audiences. You'll work on digital marketing campaigns, content creation, and marketing analytics.",
    requirements: [
      "1+ years of digital marketing experience",
      "Knowledge of SEO, SEM, and social media marketing",
      "Experience with marketing automation tools",
      "Strong writing and communication skills",
      "Analytics-driven approach to marketing"
    ],
    benefits: [
      "Growth opportunities in fast-paced environment",
      "Marketing tools and software access",
      "Creative freedom and autonomy",
      "Team collaboration and mentorship",
      "Results-based incentives"
    ],
    postedDate: "2024-12-02",
    status: "open",
    applicants: 27
  }
];

const referrals: Referral[] = [
  {
    id: "REF-001",
    referrerName: "Sarah Johnson",
    candidateName: "Alex Chen",
    candidateEmail: "alex.chen@email.com",
    position: "Senior Frontend Developer",
    status: "interview-scheduled",
    submittedDate: "2024-11-30",
    bonus: 2500
  },
  {
    id: "REF-002",
    referrerName: "Michael Davis",
    candidateName: "Jessica Liu",
    candidateEmail: "jessica.liu@email.com",
    position: "UX Designer",
    status: "pending",
    submittedDate: "2024-12-01",
    bonus: 2000
  },
  {
    id: "REF-003",
    referrerName: "Emily Rodriguez",
    candidateName: "David Kim",
    candidateEmail: "david.kim@email.com",
    position: "DevOps Engineer",
    status: "hired",
    submittedDate: "2024-11-15",
    bonus: 3000
  }
];

export default function HiringHub() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(initialJobOpenings);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time" as JobOpening["type"],
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: ""
  });

  const [newReferral, setNewReferral] = useState({
    candidateName: "",
    candidateEmail: "",
    position: "",
    notes: ""
  });

  const { toast } = useToast();

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    
    return matchesSearch && matchesDepartment && matchesType && job.status === "open";
  });

  const departments = [...new Set(jobOpenings.map(job => job.department))];
  const jobTypes = [...new Set(jobOpenings.map(job => job.type))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-red-100 text-red-800 border-red-200";
      case "filled": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReferralStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "interview-scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "hired": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.department || !newJob.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const job: JobOpening = {
      id: `JOB-${String(jobOpenings.length + 1).padStart(3, '0')}`,
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      type: newJob.type,
      experience: newJob.experience,
      salary: newJob.salary,
      description: newJob.description,
      requirements: newJob.requirements.split('\n').filter(req => req.trim()),
      benefits: newJob.benefits.split('\n').filter(benefit => benefit.trim()),
      postedDate: new Date().toISOString().split('T')[0],
      status: "open",
      applicants: 0
    };

    setJobOpenings([job, ...jobOpenings]);
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      experience: "",
      salary: "",
      description: "",
      requirements: "",
      benefits: ""
    });
    setIsNewJobOpen(false);

    toast({
      title: "Job Opening Created!",
      description: `${job.title} position has been posted successfully.`
    });
  };

  const handleSubmitReferral = () => {
    if (!newReferral.candidateName || !newReferral.candidateEmail || !newReferral.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Referral Submitted!",
      description: `Thank you for referring ${newReferral.candidateName}. HR will review the application.`
    });

    setNewReferral({ candidateName: "", candidateEmail: "", position: "", notes: "" });
    setIsReferralOpen(false);
  };

  const handleViewJob = (job: JobOpening) => {
    setSelectedJob(job);
    setIsJobDetailOpen(true);
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
              <h1 className="text-3xl font-bold text-gray-900">Hiring Hub</h1>
              <p className="text-gray-600 mt-1">Job postings, referrals, and recruitment management</p>
            </div>
            <div className="flex space-x-3">
              <Dialog open={isReferralOpen} onOpenChange={setIsReferralOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Submit Referral
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Submit Employee Referral</DialogTitle>
                    <DialogDescription>
                      Refer a qualified candidate for our open positions and earn a referral bonus.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="candidateName">Candidate Name *</Label>
                      <Input
                        id="candidateName"
                        placeholder="Enter candidate's full name"
                        value={newReferral.candidateName}
                        onChange={(e) => setNewReferral({...newReferral, candidateName: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="candidateEmail">Candidate Email *</Label>
                      <Input
                        id="candidateEmail"
                        type="email"
                        placeholder="candidate@email.com"
                        value={newReferral.candidateEmail}
                        onChange={(e) => setNewReferral({...newReferral, candidateEmail: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Position *</Label>
                      <Select value={newReferral.position} onValueChange={(value) => setNewReferral({...newReferral, position: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobOpenings.filter(job => job.status === "open").map(job => (
                            <SelectItem key={job.id} value={job.title}>{job.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Why do you think this candidate would be a great fit?"
                        value={newReferral.notes}
                        onChange={(e) => setNewReferral({...newReferral, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsReferralOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitReferral}>
                      Submit Referral
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isNewJobOpen} onOpenChange={setIsNewJobOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Job Opening</DialogTitle>
                    <DialogDescription>
                      Post a new job opening to attract qualified candidates.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Senior Software Engineer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select value={newJob.department} onValueChange={(value) => setNewJob({...newJob, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="HR">Human Resources</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Employment Type</Label>
                        <Select value={newJob.type} onValueChange={(value: JobOpening["type"]) => setNewJob({...newJob, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., San Francisco, CA or Remote"
                          value={newJob.location}
                          onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Input
                          id="experience"
                          placeholder="e.g., 3-5 years"
                          value={newJob.experience}
                          onChange={(e) => setNewJob({...newJob, experience: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        placeholder="e.g., $80,000 - $120,000"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                        className="min-h-[100px]"
                        value={newJob.description}
                        onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="requirements">Requirements (one per line)</Label>
                      <Textarea
                        id="requirements"
                        placeholder="• 5+ years of experience with React&#10;• Strong knowledge of TypeScript&#10;• Experience with testing frameworks"
                        className="min-h-[80px]"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="benefits">Benefits (one per line)</Label>
                      <Textarea
                        id="benefits"
                        placeholder="• Competitive salary and equity&#10;• Health insurance&#10;• Flexible work hours"
                        className="min-h-[80px]"
                        value={newJob.benefits}
                        onChange={(e) => setNewJob({...newJob, benefits: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewJobOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateJob}>
                      Post Job Opening
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Positions</p>
                  <p className="text-2xl font-bold text-blue-600">{jobOpenings.filter(job => job.status === "open").length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applicants</p>
                  <p className="text-2xl font-bold text-green-600">{jobOpenings.reduce((sum, job) => sum + job.applicants, 0)}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Referrals</p>
                  <p className="text-2xl font-bold text-purple-600">{referrals.filter(ref => ref.status !== "rejected").length}</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Positions Filled</p>
                  <p className="text-2xl font-bold text-orange-600">{jobOpenings.filter(job => job.status === "filled").length}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
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
                    placeholder="Search job openings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="openings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="openings">Job Openings ({filteredJobs.length})</TabsTrigger>
            <TabsTrigger value="referrals">Referrals ({referrals.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="openings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewJob(job)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{job.type}</Badge>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{job.experience}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {job.applicants} applicants
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <div className="space-y-4">
              {referrals.map((referral) => (
                <Card key={referral.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{referral.candidateName}</h3>
                          <Badge className={getReferralStatusColor(referral.status)}>
                            {referral.status.replace('-', ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>Position: {referral.position}</span>
                          <span>Referred by: {referral.referrerName}</span>
                          <span>Email: {referral.candidateEmail}</span>
                          <span>Submitted: {new Date(referral.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {referral.bonus && (
                          <p className="text-sm text-green-600 font-medium">
                            Bonus: ${referral.bonus.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Hiring Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Time to Fill (Average)</span>
                    <span className="font-medium">32 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Application to Interview Rate</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interview to Offer Rate</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offer Acceptance Rate</span>
                    <span className="font-medium">82%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {departments.map(dept => {
                    const deptJobs = jobOpenings.filter(job => job.department === dept && job.status === "open");
                    return (
                      <div key={dept} className="flex justify-between">
                        <span>{dept}</span>
                        <span className="font-medium">{deptJobs.length} openings</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Detail Modal */}
        <Dialog open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  <span>{selectedJob?.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{selectedJob?.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{selectedJob?.experience}</span>
                </div>
              </div>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-gray-700">{selectedJob.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Employment Type</p>
                    <p className="font-medium">{selectedJob.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salary Range</p>
                    <p className="font-medium">{selectedJob.salary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applicants</p>
                    <p className="font-medium">{selectedJob.applicants} applications</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posted Date</p>
                    <p className="font-medium">{new Date(selectedJob.postedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsJobDetailOpen(false)}>
                Close
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
