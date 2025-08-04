import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function VerificationTest() {
  const { currentUser, sendEmailVerification, reloadUser } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await sendEmailVerification();
      toast({
        title: "Verification Email Sent",
        description: "Check your email for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      await reloadUser();
      toast({
        title: "Status Updated",
        description: `Email verified: ${currentUser?.emailVerified ? 'Yes' : 'No'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to check verification status.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (!currentUser) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Email Verification Test
          {currentUser.emailVerified ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p className="text-sm">
            <strong>Status:</strong>{" "}
            <Badge className={currentUser.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {currentUser.emailVerified ? "Verified" : "Not Verified"}
            </Badge>
          </p>
          <p className="text-sm">
            <strong>Display Name:</strong> {currentUser.displayName || "Not set"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleCheckStatus}
            disabled={isChecking}
            variant="outline"
            className="w-full"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Status
              </>
            )}
          </Button>

          {!currentUser.emailVerified && (
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
