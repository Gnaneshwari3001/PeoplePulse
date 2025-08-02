import { useState } from "react";
import { ArrowLeft, Plus, Receipt, Upload, Clock, CheckCircle, XCircle, DollarSign, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface Claim {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: "pending" | "approved" | "rejected" | "processing";
  submissionDate: string;
  receiptUrl?: string;
  approver?: string;
  reimbursementDate?: string;
}

const initialClaims: Claim[] = [
  {
    id: "1",
    title: "Business Lunch Meeting",
    description: "Lunch meeting with potential client at The Plaza Restaurant",
    amount: 127.50,
    category: "Meals & Entertainment",
    status: "approved",
    submissionDate: "2024-11-28",
    approver: "John Smith",
    reimbursementDate: "2024-12-02"
  },
  {
    id: "2", 
    title: "Conference Travel",
    description: "Flight tickets for Tech Conference 2024 in Seattle",
    amount: 485.00,
    category: "Travel",
    status: "pending",
    submissionDate: "2024-12-03"
  },
  {
    id: "3",
    title: "Office Supplies",
    description: "Ergonomic keyboard and mouse for workstation",
    amount: 95.75,
    category: "Office Equipment",
    status: "processing",
    submissionDate: "2024-12-01",
    approver: "Sarah Wilson"
  },
  {
    id: "4",
    title: "Software License",
    description: "Annual subscription for Adobe Creative Suite",
    amount: 599.88,
    category: "Software",
    status: "approved",
    submissionDate: "2024-11-25",
    approver: "Mike Johnson",
    reimbursementDate: "2024-11-30"
  },
  {
    id: "5",
    title: "Parking Fees",
    description: "Monthly parking at downtown office building",
    amount: 45.00,
    category: "Transportation",
    status: "rejected",
    submissionDate: "2024-11-20",
    approver: "Lisa Davis"
  }
];

const categories = [
  "Travel",
  "Meals & Entertainment", 
  "Office Equipment",
  "Software",
  "Transportation",
  "Training & Development",
  "Communication",
  "Other"
];

export default function ClaimsManager() {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredClaims = claims.filter(claim => {
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || claim.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const claimsByStatus = {
    pending: filteredClaims.filter(claim => claim.status === "pending"),
    processing: filteredClaims.filter(claim => claim.status === "processing"),
    approved: filteredClaims.filter(claim => claim.status === "approved"),
    rejected: filteredClaims.filter(claim => claim.status === "rejected")
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "processing": return <Clock className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalApproved = claims.filter(c => c.status === "approved").reduce((sum, c) => sum + c.amount, 0);
  const totalPending = claims.filter(c => c.status === "pending" || c.status === "processing").reduce((sum, c) => sum + c.amount, 0);

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
              <h1 className="text-3xl font-bold text-gray-900">Claim Manager</h1>
              <p className="text-gray-600 mt-1">Submit and track expense reimbursements</p>
            </div>
            <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900">{claims.length}</p>
                </div>
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Amount</p>
                  <p className="text-2xl font-bold text-green-600">${totalApproved.toFixed(2)}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {claims.filter(c => new Date(c.submissionDate).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Claims Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Claims ({filteredClaims.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({claimsByStatus.pending.length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({claimsByStatus.processing.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({claimsByStatus.approved.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({claimsByStatus.rejected.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredClaims.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                        <Badge className={getStatusColor(claim.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(claim.status)}
                            <span>{claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline">{claim.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{claim.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${claim.amount.toFixed(2)}
                        </span>
                        <span>Submitted: {new Date(claim.submissionDate).toLocaleDateString()}</span>
                        {claim.approver && (
                          <span>Approver: {claim.approver}</span>
                        )}
                        {claim.reimbursementDate && (
                          <span>Reimbursed: {new Date(claim.reimbursementDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-gray-900">${claim.amount.toFixed(2)}</p>
                      {claim.receiptUrl && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="w-4 h-4 mr-1" />
                          View Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {claimsByStatus.pending.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Clock className="w-4 h-4 mr-1" />
                          Pending Review
                        </Badge>
                        <Badge variant="outline">{claim.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{claim.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${claim.amount.toFixed(2)}
                        </span>
                        <span>Submitted: {new Date(claim.submissionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-yellow-600">${claim.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 mt-1">Awaiting Approval</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {claimsByStatus.processing.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <Clock className="w-4 h-4 mr-1" />
                          Processing
                        </Badge>
                        <Badge variant="outline">{claim.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{claim.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${claim.amount.toFixed(2)}
                        </span>
                        <span>Submitted: {new Date(claim.submissionDate).toLocaleDateString()}</span>
                        {claim.approver && <span>Reviewer: {claim.approver}</span>}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-blue-600">${claim.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 mt-1">Under Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {claimsByStatus.approved.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow border-green-200 bg-green-50/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approved
                        </Badge>
                        <Badge variant="outline">{claim.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{claim.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${claim.amount.toFixed(2)}
                        </span>
                        <span>Submitted: {new Date(claim.submissionDate).toLocaleDateString()}</span>
                        <span>Approved by: {claim.approver}</span>
                        {claim.reimbursementDate && (
                          <span>Reimbursed: {new Date(claim.reimbursementDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-green-600">${claim.amount.toFixed(2)}</p>
                      <p className="text-sm text-green-600 mt-1">✓ Reimbursed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {claimsByStatus.rejected.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow border-red-200 bg-red-50/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejected
                        </Badge>
                        <Badge variant="outline">{claim.category}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{claim.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${claim.amount.toFixed(2)}
                        </span>
                        <span>Submitted: {new Date(claim.submissionDate).toLocaleDateString()}</span>
                        <span>Reviewed by: {claim.approver}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-red-600">${claim.amount.toFixed(2)}</p>
                      <p className="text-sm text-red-600 mt-1">✗ Not Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
