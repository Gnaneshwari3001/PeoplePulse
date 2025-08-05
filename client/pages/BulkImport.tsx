import { useState, useRef } from "react";
import {
  Upload,
  Download,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileSpreadsheet,
  Database,
  Eye,
  Trash2,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AdminOnly, HROnly } from "@/components/RoleAccess";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ImportRecord {
  row: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  status: "pending" | "success" | "error";
  error?: string;
}

interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  fields: string[];
  example: Record<string, string>;
}

export default function BulkImport() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importType, setImportType] = useState("employees");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<ImportRecord[]>([]);
  const [importResults, setImportResults] = useState<ImportRecord[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const importTemplates: ImportTemplate[] = [
    {
      id: "employees",
      name: "Employee Data",
      description: "Import employee information including personal details and roles",
      fields: [
        "firstName",
        "lastName",
        "email",
        "department",
        "role",
        "employeeId",
        "startDate",
        "phoneNumber",
      ],
      example: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        department: "engineering",
        role: "employee",
        employeeId: "EMP001",
        startDate: "2024-01-15",
        phoneNumber: "+1234567890",
      },
    },
    {
      id: "policies",
      name: "Company Policies",
      description: "Import policy documents and acknowledgment requirements",
      fields: ["title", "description", "category", "priority", "effectiveDate"],
      example: {
        title: "Remote Work Policy",
        description: "Guidelines for remote work arrangements",
        category: "hr",
        priority: "high",
        effectiveDate: "2024-02-01",
      },
    },
    {
      id: "tasks",
      name: "Task Assignments",
      description: "Import task lists and assignments for teams",
      fields: ["title", "description", "assignee", "priority", "dueDate", "project"],
      example: {
        title: "Update Documentation",
        description: "Review and update API documentation",
        assignee: "john.doe@company.com",
        priority: "medium",
        dueDate: "2024-02-15",
        project: "API Development",
      },
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        toast({
          title: "File Selected",
          description: `${file.name} is ready for import`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setSelectedFile(file);
      toast({
        title: "File Dropped",
        description: `${file.name} is ready for import`,
      });
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop a CSV file",
        variant: "destructive",
      });
    }
  };

  const generateSampleData = () => {
    const template = importTemplates.find((t) => t.id === importType);
    if (!template) return;

    const csvContent = [
      template.fields.join(","),
      Object.values(template.example).join(","),
      // Add a few more sample rows
      ...(importType === "employees"
        ? [
            "Jane,Smith,jane.smith@company.com,marketing,senior_employee,EMP002,2024-01-10,+1234567891",
            "Mike,Johnson,mike.johnson@company.com,sales,team_lead,EMP003,2024-01-05,+1234567892",
          ]
        : importType === "policies"
          ? [
              "Data Security Policy,Guidelines for data protection,security,critical,2024-02-01",
              "Code of Conduct,Employee behavior guidelines,hr,high,2024-01-20",
            ]
          : [
              "Review Code,Code review for new feature,jane.smith@company.com,high,2024-02-20,Frontend",
              "Testing Phase,Complete testing phase,mike.johnson@company.com,medium,2024-02-25,Mobile App",
            ]),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${importType}-template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: `Sample ${importType} template has been downloaded`,
    });
  };

  const parseCSV = (csvText: string): ImportRecord[] => {
    const lines = csvText.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim());
    const records: ImportRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const record: ImportRecord = {
        row: i,
        firstName: values[0] || "",
        lastName: values[1] || "",
        email: values[2] || "",
        department: values[3] || "",
        role: values[4] || "",
        status: "pending",
      };

      // Basic validation
      if (!record.firstName || !record.lastName || !record.email) {
        record.status = "error";
        record.error = "Missing required fields";
      } else if (!record.email.includes("@")) {
        record.status = "error";
        record.error = "Invalid email format";
      }

      records.push(record);
    }

    return records;
  };

  const handlePreview = async () => {
    if (!selectedFile) return;

    const text = await selectedFile.text();
    const parsed = parseCSV(text);
    setPreviewData(parsed);
    setShowPreview(true);

    toast({
      title: "Preview Generated",
      description: `Loaded ${parsed.length} records for preview`,
    });
  };

  const handleImport = async () => {
    if (!selectedFile || previewData.length === 0) return;

    setIsImporting(true);
    setImportProgress(0);
    setShowResults(false);

    // Simulate import process
    const results: ImportRecord[] = [];
    const totalRecords = previewData.length;

    for (let i = 0; i < totalRecords; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate processing time

      const record = { ...previewData[i] };

      // Simulate success/failure
      if (record.status === "pending") {
        const success = Math.random() > 0.1; // 90% success rate
        record.status = success ? "success" : "error";
        if (!success) {
          record.error = "Duplicate email found";
        }
      }

      results.push(record);
      setImportProgress(((i + 1) / totalRecords) * 100);
    }

    setImportResults(results);
    setIsImporting(false);
    setShowResults(true);

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    toast({
      title: "Import Completed",
      description: `${successCount} records imported successfully, ${errorCount} errors`,
    });
  };

  const currentTemplate = importTemplates.find((t) => t.id === importType);

  return (
    <HROnly
      fallback={
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You need HR or Admin privileges to access bulk import.
          </p>
        </div>
      }
    >
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-500" />
              Bulk Import
            </h1>
            <p className="text-gray-600">
              Import large datasets from CSV files into the system
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={generateSampleData}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Import Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Import Type Selection */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  Import Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Data Type
                  </Label>
                  <Select value={importType} onValueChange={setImportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {importTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {currentTemplate && (
                    <p className="text-sm text-gray-600 mt-2">
                      {currentTemplate.description}
                    </p>
                  )}
                </div>

                {/* Required Fields */}
                {currentTemplate && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Required Fields
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {currentTemplate.fields.map((field) => (
                        <Badge key={field} variant="outline">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Upload CSV File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-4">
                      <FileText className="w-12 h-12 text-green-500 mx-auto" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          size="sm"
                        >
                          Change File
                        </Button>
                        <Button
                          onClick={() => setSelectedFile(null)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Drop your CSV file here
                        </p>
                        <p className="text-gray-600">
                          or click to browse files
                        </p>
                      </div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Select File
                      </Button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={handlePreview}
                      variant="outline"
                      className="gap-2"
                      disabled={!selectedFile}
                    >
                      <Eye className="w-4 h-4" />
                      Preview Data
                    </Button>
                    <Button
                      onClick={handleImport}
                      className="gap-2"
                      disabled={!selectedFile || previewData.length === 0 || isImporting}
                    >
                      {isImporting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      {isImporting ? "Importing..." : "Start Import"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Import Progress */}
            {isImporting && (
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
                    Import Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing records...</span>
                      <span>{Math.round(importProgress)}%</span>
                    </div>
                    <Progress value={importProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Data */}
            {showPreview && previewData.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    Data Preview ({previewData.length} records)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>First Name</TableHead>
                          <TableHead>Last Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 10).map((record) => (
                          <TableRow key={record.row}>
                            <TableCell>{record.row}</TableCell>
                            <TableCell>{record.firstName}</TableCell>
                            <TableCell>{record.lastName}</TableCell>
                            <TableCell>{record.email}</TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell>{record.role}</TableCell>
                            <TableCell>
                              <Badge
                                className={cn(
                                  record.status === "error"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700",
                                )}
                              >
                                {record.status}
                              </Badge>
                              {record.error && (
                                <p className="text-xs text-red-600 mt-1">
                                  {record.error}
                                </p>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {previewData.length > 10 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Showing first 10 of {previewData.length} records
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Import Results */}
            {showResults && importResults.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Import Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {importResults.filter((r) => r.status === "success").length}
                        </div>
                        <div className="text-sm text-gray-600">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {importResults.filter((r) => r.status === "error").length}
                        </div>
                        <div className="text-sm text-gray-600">Errors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {importResults.length}
                        </div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                    </div>

                    {/* Error Records */}
                    {importResults.some((r) => r.status === "error") && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Records with Errors:
                        </h4>
                        <div className="max-h-32 overflow-auto">
                          {importResults
                            .filter((r) => r.status === "error")
                            .map((record) => (
                              <div
                                key={record.row}
                                className="flex justify-between items-center p-2 bg-red-50 rounded mb-2"
                              >
                                <span className="text-sm">
                                  Row {record.row}: {record.firstName}{" "}
                                  {record.lastName}
                                </span>
                                <span className="text-xs text-red-600">
                                  {record.error}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Import Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File Selected</span>
                    <Badge className={selectedFile ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {selectedFile ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Records Found</span>
                    <span className="font-medium">{previewData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valid Records</span>
                    <span className="font-medium text-green-600">
                      {previewData.filter((r) => r.status !== "error").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Errors</span>
                    <span className="font-medium text-red-600">
                      {previewData.filter((r) => r.status === "error").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import Guidelines */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Import Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Use CSV format with proper headers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Download template for correct format</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Ensure all required fields are filled</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Preview data before importing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Avoid duplicate email addresses</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Imports */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Recent Imports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "Employees", count: 25, date: "2024-01-15", status: "success" },
                    { type: "Policies", count: 8, date: "2024-01-10", status: "success" },
                    { type: "Tasks", count: 45, date: "2024-01-08", status: "partial" },
                  ].map((import_, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{import_.type}</div>
                        <div className="text-xs text-gray-500">{import_.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{import_.count}</div>
                        <Badge className={import_.status === "success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {import_.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </HROnly>
  );
}
