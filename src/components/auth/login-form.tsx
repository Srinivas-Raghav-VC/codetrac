import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Eye, EyeOff, LogIn, UserPlus, Code, Terminal } from "lucide-react";
import { useAuth } from "./auth-wrapper";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const result = await signIn(email, password);
    
    if (!result.success) {
      setError(result.error || "Sign in failed");
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const result = await signUp(email, password, name);
    
    if (!result.success) {
      setError(result.error || "Sign up failed");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* ASCII Logo */}
        <div className="text-center">
          <div className="text-catppuccin-blue select-none mb-4">
            <pre className="text-xs leading-tight">
{`╭──────────────────────────────────╮
│  ██████╗ ██████╗ ██████╗ ███████╗ │
│ ██╔════╝██╔═══██╗██╔══██╗██╔════╝ │
│ ██║     ██║   ██║██║  ██║█████╗   │
│ ██║     ██║   ██║██║  ██║██╔══╝   │
│ ╚██████╗╚██████╔╝██████╔╝███████╗ │
│  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝ │
│                                  │
│     ████████╗██████╗  █████╗ ██████╗ │
│     ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝│
│        ██║   ██████╔╝███████║██║     │
│        ██║   ██╔══██╗██╔══██║██║     │
│        ██║   ██║  ██║██║  ██║╚██████╗│
│        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝│
╰──────────────────────────────────╯`}
            </pre>
          </div>
          <h1 className="text-2xl font-bold text-catppuccin-blue">CodeTrac</h1>
          <p className="text-catppuccin-overlay1 mt-2">
            Competitive Programming Progress Tracker
          </p>
        </div>

        <Card className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader className="space-y-1">
              <TabsList className="grid w-full grid-cols-2 bg-catppuccin-surface1">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-catppuccin-blue data-[state=active]:text-catppuccin-surface0"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            {error && (
              <div className="px-6">
                <Alert className="border-catppuccin-red bg-catppuccin-red/10">
                  <AlertDescription className="text-catppuccin-red">
                    {error}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-catppuccin-overlay2">
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-catppuccin-overlay2">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-catppuccin-overlay1" />
                        ) : (
                          <Eye className="h-4 w-4 text-catppuccin-overlay1" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-catppuccin-blue hover:bg-catppuccin-blue/80 text-catppuccin-surface0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-catppuccin-surface0 border-t-transparent" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-catppuccin-overlay2">
                      Name (Optional)
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-catppuccin-overlay2">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-catppuccin-overlay2">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-catppuccin-surface1 border-catppuccin-surface2 text-catppuccin-foreground pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-catppuccin-overlay1" />
                        ) : (
                          <Eye className="h-4 w-4 text-catppuccin-overlay1" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-catppuccin-overlay1">
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-catppuccin-green hover:bg-catppuccin-green/80 text-catppuccin-surface0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-catppuccin-surface0 border-t-transparent" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-catppuccin-overlay1">
            <Code className="h-3 w-3" />
            <span>Track your competitive programming journey</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs text-catppuccin-overlay1">
            <Terminal className="h-3 w-3" />
            <span>Built for developers, by developers</span>
          </div>
        </div>
      </div>
    </div>
  );
}