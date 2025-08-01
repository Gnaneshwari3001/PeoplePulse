import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();

  // Check if current domain is authorized for Google auth
  const isAuthorizedDomain = () => {
    const hostname = window.location.hostname;
    const authorizedDomains = [
      'localhost',
      '127.0.0.1',
      'peoplepulse-8d008.firebaseapp.com',
      'peoplepulse-8d008.web.app'
    ];
    return authorizedDomains.includes(hostname);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && !displayName)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to PeoplePulse."
        });
      } else {
        await signup(email, password, displayName);
        toast({
          title: "Account Created!",
          description: "Welcome to PeoplePulse! Your account has been created successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    // This function should only be called on authorized domains
    if (!isAuthorizedDomain()) {
      toast({
        title: "Google Login Unavailable",
        description: "Please add this domain to Firebase authorized domains or use email/password login.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await loginWithGoogle();
      toast({
        title: "Welcome!",
        description: "You've successfully logged in with Google."
      });
    } catch (error: any) {
      console.error("Google login error:", error);

      toast({
        title: "Google Login Error",
        description: error.message || "An error occurred during Google login.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-brand-teal to-brand-blue rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-blue bg-clip-text text-transparent">
              PeoplePulse
            </CardTitle>
            <CardDescription className="mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter your full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90 h-11"
              disabled={loading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          {isAuthorizedDomain() ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Google Auth Unavailable</span>
                </div>
              </div>

              {/* Domain Authorization Instructions */}
              <div className="text-xs text-center bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <p className="font-medium text-blue-800">Google Login Setup Required</p>
                </div>

                <div className="text-left space-y-2">
                  <p className="text-blue-700 font-medium">To enable Google authentication:</p>
                  <ol className="text-blue-700 space-y-1 text-xs list-decimal list-inside">
                    <li>Go to <strong>Firebase Console</strong> → Your Project</li>
                    <li>Navigate to <strong>Authentication</strong> → <strong>Settings</strong></li>
                    <li>Click <strong>Authorized domains</strong></li>
                    <li>Add this domain:</li>
                  </ol>
                  <code className="text-xs bg-blue-100 px-2 py-1 rounded block text-blue-800 font-mono">
                    {window.location.hostname}
                  </code>
                  <p className="text-blue-600 mt-2">
                    <strong>For now, please use email/password authentication below.</strong>
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="text-center space-y-3">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>

            {isLogin && (
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-2">Quick Demo Access:</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {
                    setEmail("demo@peoplepulse.com");
                    setPassword("demo123456");
                  }}
                >
                  Fill Demo Credentials
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
