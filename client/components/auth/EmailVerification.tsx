import { useState, useEffect } from "react";
import { Mail, CheckCircle, RefreshCw, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function EmailVerification() {
  const { currentUser, sendEmailVerification, reloadUser, logout } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check verification status every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentUser && !currentUser.emailVerified) {
        await reloadUser();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser, reloadUser]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      await sendEmailVerification();
      setResendCooldown(60); // 60 second cooldown
      toast({
        title: "Verification Email Sent",
        description: "Please check your email inbox and spam folder.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    try {
      await reloadUser();
      if (currentUser?.emailVerified) {
        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified. Redirecting...",
        });
        // The app will automatically redirect due to state change
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
        description: "Failed to check verification status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a verification link to{" "}
            <span className="font-medium text-gray-900">
              {currentUser?.email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <Clock className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">
              Waiting for email verification...
            </span>
          </div>

          {/* Instructions */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">
                1
              </div>
              <p>Check your email inbox for a verification message from PeoplePulse</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">
                2
              </div>
              <p>Click the verification link in the email</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">
                3
              </div>
              <p>Return to this page and click "I've verified my email"</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I've verified my email
                </>
              )}
            </Button>

            <Button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Resend in {resendCooldown}s
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend verification email
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Don't see the email? Check your spam or junk folder.
            </p>
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <a href="mailto:support@peoplepulse.com" className="text-blue-600 hover:text-blue-800">
                Contact Support
              </a>
            </p>
          </div>

          {/* Sign out option */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Sign out and use different email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
