import { useState } from "react";
import { ArrowLeft, Download, DollarSign, TrendingUp, Calendar, FileText, Eye, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Payslip {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payDate: string;
  status: "paid" | "pending" | "processing";
}

interface CompensationDetails {
  basicSalary: number;
  hra: number;
  transportAllowance: number;
  medicalAllowance: number;
  performanceBonus: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  totalCTC: number;
}

const payslips: Payslip[] = [
  {
    id: "PAY-2024-11",
    month: "November",
    year: 2024,
    grossSalary: 85000,
    basicSalary: 50000,
    allowances: 35000,
    deductions: 12500,
    netSalary: 72500,
    payDate: "2024-11-30",
    status: "paid"
  },
  {
    id: "PAY-2024-10",
    month: "October",
    year: 2024,
    grossSalary: 85000,
    basicSalary: 50000,
    allowances: 35000,
    deductions: 12500,
    netSalary: 72500,
    payDate: "2024-10-31",
    status: "paid"
  },
  {
    id: "PAY-2024-09",
    month: "September",
    year: 2024,
    grossSalary: 85000,
    basicSalary: 50000,
    allowances: 35000,
    deductions: 12500,
    netSalary: 72500,
    payDate: "2024-09-30",
    status: "paid"
  },
  {
    id: "PAY-2024-12",
    month: "December",
    year: 2024,
    grossSalary: 85000,
    basicSalary: 50000,
    allowances: 35000,
    deductions: 12500,
    netSalary: 72500,
    payDate: "2024-12-31",
    status: "processing"
  }
];

const compensationDetails: CompensationDetails = {
  basicSalary: 600000,
  hra: 240000,
  transportAllowance: 24000,
  medicalAllowance: 15000,
  performanceBonus: 120000,
  providentFund: 72000,
  professionalTax: 2500,
  incomeTax: 85000,
  totalCTC: 1020000
};

export default function SalaryCenter() {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    month: "",
    year: new Date().getFullYear().toString(),
    basicSalary: "",
    allowances: "",
    deductions: ""
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleViewPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setIsPayslipModalOpen(true);
  };

  const handleDownloadPayslip = (payslip: Payslip) => {
    toast({
      title: "Download Started",
      description: `Downloading payslip for ${payslip.month} ${payslip.year}`
    });
  };

  const handleUploadPayslip = () => {
    if (!uploadData.month || !uploadData.basicSalary || !uploadData.allowances) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payslip Uploaded Successfully!",
      description: `Payslip for ${uploadData.month} ${uploadData.year} has been added to the system.`
    });

    setUploadData({ month: "", year: new Date().getFullYear().toString(), basicSalary: "", allowances: "", deductions: "" });
    setIsUploadModalOpen(false);
  };

  const currentYearPayslips = payslips.filter(p => p.year === 2024);
  const totalEarnings = currentYearPayslips.reduce((sum, p) => sum + p.netSalary, 0);
  const totalDeductions = currentYearPayslips.reduce((sum, p) => sum + p.deductions, 0);

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
              <h1 className="text-3xl font-bold text-gray-900">Salary Center</h1>
              <p className="text-gray-600 mt-1">Monthly payslips, compensation overview, and tax information</p>
            </div>
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payslip
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Upload New Payslip</DialogTitle>
                  <DialogDescription>
                    Add a new monthly payslip to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="month">Month *</Label>
                      <Select value={uploadData.month} onValueChange={(value) => setUploadData({...uploadData, month: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="January">January</SelectItem>
                          <SelectItem value="February">February</SelectItem>
                          <SelectItem value="March">March</SelectItem>
                          <SelectItem value="April">April</SelectItem>
                          <SelectItem value="May">May</SelectItem>
                          <SelectItem value="June">June</SelectItem>
                          <SelectItem value="July">July</SelectItem>
                          <SelectItem value="August">August</SelectItem>
                          <SelectItem value="September">September</SelectItem>
                          <SelectItem value="October">October</SelectItem>
                          <SelectItem value="November">November</SelectItem>
                          <SelectItem value="December">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2024"
                        value={uploadData.year}
                        onChange={(e) => setUploadData({...uploadData, year: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="basicSalary">Basic Salary *</Label>
                    <Input
                      id="basicSalary"
                      type="number"
                      placeholder="50000"
                      value={uploadData.basicSalary}
                      onChange={(e) => setUploadData({...uploadData, basicSalary: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="allowances">Total Allowances *</Label>
                    <Input
                      id="allowances"
                      type="number"
                      placeholder="35000"
                      value={uploadData.allowances}
                      onChange={(e) => setUploadData({...uploadData, allowances: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deductions">Total Deductions</Label>
                    <Input
                      id="deductions"
                      type="number"
                      placeholder="12500"
                      value={uploadData.deductions}
                      onChange={(e) => setUploadData({...uploadData, deductions: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUploadPayslip}>
                    Upload Payslip
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Annual CTC</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(compensationDetails.totalCTC)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Gross</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(85000)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">YTD Earnings</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalEarnings)}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">YTD Deductions</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p>
                </div>
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payslips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="compensation">Compensation Breakdown</TabsTrigger>
            <TabsTrigger value="tax">Tax Information</TabsTrigger>
          </TabsList>

          <TabsContent value="payslips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payslips.map((payslip) => (
                <Card key={payslip.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{payslip.month} {payslip.year}</CardTitle>
                      <Badge className={getStatusColor(payslip.status)}>
                        {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gross Salary:</span>
                        <span className="font-medium">{formatCurrency(payslip.grossSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deductions:</span>
                        <span className="font-medium text-red-600">-{formatCurrency(payslip.deductions)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Net Salary:</span>
                        <span className="font-bold text-green-600">{formatCurrency(payslip.netSalary)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Pay Date: {new Date(payslip.payDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewPayslip(payslip)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownloadPayslip(payslip)}
                        disabled={payslip.status !== "paid"}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compensation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>House Rent Allowance</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.hra)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Allowance</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.transportAllowance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Allowance</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.medicalAllowance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Bonus</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.performanceBonus)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4 font-bold text-lg">
                    <span>Total Earnings</span>
                    <span className="text-green-600">
                      {formatCurrency(
                        compensationDetails.basicSalary +
                        compensationDetails.hra +
                        compensationDetails.transportAllowance +
                        compensationDetails.medicalAllowance +
                        compensationDetails.performanceBonus
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">Deductions Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Provident Fund</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.providentFund)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Tax</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.professionalTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Income Tax</span>
                    <span className="font-medium">{formatCurrency(compensationDetails.incomeTax)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4 font-bold text-lg">
                    <span>Total Deductions</span>
                    <span className="text-red-600">
                      {formatCurrency(
                        compensationDetails.providentFund +
                        compensationDetails.professionalTax +
                        compensationDetails.incomeTax
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-4 font-bold text-xl">
                    <span>Net Annual CTC</span>
                    <span className="text-blue-600">{formatCurrency(compensationDetails.totalCTC)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tax" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax Summary 2024-25</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Gross Annual Income</span>
                    <span className="font-medium">{formatCurrency(999000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Deduction</span>
                    <span className="font-medium">{formatCurrency(50000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>80C Investments</span>
                    <span className="font-medium">{formatCurrency(150000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Deductions</span>
                    <span className="font-medium">{formatCurrency(25000)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="font-medium">Taxable Income</span>
                    <span className="font-medium">{formatCurrency(774000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Tax Payable</span>
                    <span className="font-bold text-red-600">{formatCurrency(85000)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Form 16 (2023-24)</p>
                      <p className="text-sm text-gray-600">Annual tax certificate</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">TDS Certificate</p>
                      <p className="text-sm text-gray-600">Tax deducted at source</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Investment Proof</p>
                      <p className="text-sm text-gray-600">80C and other deductions</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Payslip Detail Modal */}
        <Dialog open={isPayslipModalOpen} onOpenChange={setIsPayslipModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Payslip Details - {selectedPayslip?.month} {selectedPayslip?.year}
              </DialogTitle>
            </DialogHeader>
            {selectedPayslip && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">Earnings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span>{formatCurrency(selectedPayslip.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allowances:</span>
                        <span>{formatCurrency(selectedPayslip.allowances)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Gross Salary:</span>
                        <span>{formatCurrency(selectedPayslip.grossSalary)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3">Deductions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>PF Contribution:</span>
                        <span>{formatCurrency(6000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Tax:</span>
                        <span>{formatCurrency(200)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Income Tax:</span>
                        <span>{formatCurrency(6300)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total Deductions:</span>
                        <span>{formatCurrency(selectedPayslip.deductions)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Net Salary:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedPayslip.netSalary)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Paid on: {new Date(selectedPayslip.payDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPayslipModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => selectedPayslip && handleDownloadPayslip(selectedPayslip)}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
