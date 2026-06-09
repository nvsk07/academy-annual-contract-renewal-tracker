import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!employeeId || !password) {
      setError("Both fields are required.");
      return;
    }
    
    try {
      await login(employeeId, password);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Password Reset",
      description: "Contact your system administrator to reset your password.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-10 w-10 text-white" />
            <span className="font-bold text-2xl tracking-tight">Oxygen Sports</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 mt-16 max-w-md">
            Managing Academy Contracts, Effortlessly
          </h1>
          <ul className="space-y-4 mt-8 text-blue-100 text-lg">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 bg-white rounded-full"></div> Track Renewals
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 bg-white rounded-full"></div> Monitor Health
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 bg-white rounded-full"></div> Generate Reports
            </li>
          </ul>
        </div>
        <div className="text-blue-200 text-sm">
          &copy; {new Date().getFullYear()} Oxygen Sports. Enterprise CRM.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24">
        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">Oxygen Sports</span>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Enter your credentials to access the contract tracker.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input 
                id="employeeId" 
                placeholder="e.g. OXY-001" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" onClick={handleForgotPassword} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
              >
                Remember me for 30 days
              </label>
            </div>
            
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}