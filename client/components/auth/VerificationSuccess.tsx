import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export function VerificationSuccess() {
  const { currentUser, reloadUser } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Reload user to get updated verification status
    reloadUser();
    
    // Countdown timer for automatic redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect will happen automatically due to verification status change
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reloadUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Email Verified!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your email address has been successfully verified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm font-medium text-green-800">
                Welcome to PeoplePulse!
              </p>
              <p className="text-sm text-green-700 mt-1">
                You now have full access to all features.
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* User Info */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Logged in as{" "}
              <span className="font-medium text-gray-900">
                {currentUser?.email}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
