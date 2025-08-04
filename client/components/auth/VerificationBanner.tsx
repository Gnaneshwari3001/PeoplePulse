import { useState } from "react";
import { AlertTriangle, Mail, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function VerificationBanner() {
  const { currentUser, sendEmailVerification, reloadUser } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Don't show banner if user is verified or banner is hidden
  if (!currentUser || currentUser.emailVerified || isHidden) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await sendEmailVerification();
      toast({
        title: "Verification Email Sent",
        description: "Please check your email inbox and spam folder.",
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

  const handleCheckVerification = async () => {
    try {
      await reloadUser();
      if (currentUser?.emailVerified) {
        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified.",
        });
      } else {
        toast({
          title: "Not Verified Yet",
          description: "Please click the verification link in your email first.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to check verification status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="text-sm font-medium text-yellow-800">
              Please verify your email address
            </p>
            <p className="text-sm text-yellow-700">
              Check {currentUser.email} for a verification link
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCheckVerification}
            className="bg-white hover:bg-yellow-50 border-yellow-300 text-yellow-800"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Check Status
          </Button>
          
          <Button
            size="sm"
            onClick={handleResendEmail}
            disabled={isResending}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-3 h-3 mr-1" />
                Resend
              </>
            )}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsHidden(true)}
            className="text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
