import { useState } from "react";
import { Copy, Eye, EyeOff, Mail, Key, CheckCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EmployeeCredentialsProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    employeeId: string;
    department: string;
    role: string;
  };
  onSendCredentials?: () => void;
}

export function EmployeeCredentials({ 
  isOpen, 
  onClose, 
  employee, 
  onSendCredentials 
}: EmployeeCredentialsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const copyAllCredentials = () => {
    const credentials = `
Employee: ${employee.firstName} ${employee.lastName}
Employee ID: ${employee.employeeId}
Email: ${employee.email}
Username: ${employee.username}
Password: ${employee.password}
Department: ${employee.department}
Role: ${employee.role}
    `.trim();

    navigator.clipboard.writeText(credentials);
    toast({
      title: "All Credentials Copied",
      description: "Complete employee information copied to clipboard",
    });
  };

  const handleSendCredentials = async () => {
    if (onSendCredentials) {
      await onSendCredentials();
      setIsEmailSent(true);
      toast({
        title: "Credentials Sent",
        description: `Login credentials sent to ${employee.email}`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Employee Added Successfully
          </DialogTitle>
          <DialogDescription>
            Login credentials have been generated for {employee.firstName} {employee.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800">Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-700">Full Name:</span>
                  <p className="text-green-900">{employee.firstName} {employee.lastName}</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Employee ID:</span>
                  <p className="text-green-900">{employee.employeeId}</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Email:</span>
                  <p className="text-green-900">{employee.email}</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Department:</span>
                  <p className="text-green-900">{employee.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Credentials */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Generated Login Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Username */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-blue-700">Username</label>
                    <p className="text-lg font-mono text-blue-900">{employee.username}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(employee.username, "Username")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-blue-700">Temporary Password</label>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-mono text-blue-900">
                        {showPassword ? employee.password : "••••••••••"}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(employee.password, "Password")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Key className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Security Notice</p>
                    <p className="text-yellow-700 mt-1">
                      This is a temporary password. The employee will be required to change it upon first login.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={copyAllCredentials}
              variant="outline"
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Information
            </Button>

            <Button
              onClick={handleSendCredentials}
              disabled={isEmailSent}
              className={cn(
                "flex-1",
                isEmailSent 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              {isEmailSent ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Credentials Sent
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Credentials via Email
                </>
              )}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
            >
              Close
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">1</Badge>
                  <p>Employee will receive credentials via email</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">2</Badge>
                  <p>They must change password on first login</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">3</Badge>
                  <p>Complete employee profile in Employee Management</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">4</Badge>
                  <p>Assign to appropriate teams and projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Success notification component
export function EmployeeAddedNotification({ 
  employeeName, 
  onViewCredentials 
}: { 
  employeeName: string; 
  onViewCredentials: () => void; 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="bg-white shadow-xl border border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Employee Added</h4>
              <p className="text-sm text-gray-600 mt-1">
                {employeeName} has been added successfully with auto-generated credentials.
              </p>
              <Button
                size="sm"
                onClick={onViewCredentials}
                className="mt-2 bg-green-500 hover:bg-green-600"
              >
                View Credentials
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
