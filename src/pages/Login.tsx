import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ShieldCheck, FileCheck2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const { user, login, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});

    try {
      await login(email.trim().toLowerCase(), password);
      setLocation("/");
    } catch (err: any) {
      setErrors({ general: err.message || "Invalid email or password. Please try again." });
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Password Reset",
      description: "Please contact your system administrator to reset your password.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* ── Brand Panel (left) ── */}
      <div className="hidden md:flex md:w-[46%] bg-[#0A192F] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Background grid decoration */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-10 translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-400 rounded-full opacity-5 -translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">Oxygen Sports</div>
              <div className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">Contract Management System</div>
            </div>
          </div>

          <h1 className="text-4xl font-black leading-tight mb-4 max-w-sm">
            Manage Academy Contracts with Confidence
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            The internal platform for Oxygen Sports relationship managers and administrators to track, renew, and manage academy contracts.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 space-y-4">
            {[
              { icon: FileCheck2, label: "Role-based contract visibility" },
              { icon: Bell, label: "Proactive renewal alerts" },
              { icon: ShieldCheck, label: "Secure, permission-driven access" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-slate-300">
                <div className="h-8 w-8 bg-blue-600/20 border border-blue-600/30 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} Oxygen Sports Pvt. Ltd. — Internal Use Only
        </div>
      </div>

      {/* ── Login Form Panel (right) ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 bg-slate-50">
        <div className="w-full max-w-md mx-auto">

          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2 mb-10">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 tracking-tight">Oxygen Sports</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Contract Management</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h2>
              <p className="text-slate-500 text-sm mt-1">Enter your Oxygen Sports credentials to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              {/* General error */}
              {errors.general && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  <span className="mt-0.5 text-red-500">⚠</span>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@oxygensports.in"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  className={`h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors ${errors.email ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
                  autoComplete="email"
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                  <a
                    href="#"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                    className={`h-11 bg-slate-50 border-slate-200 focus:bg-white pr-11 transition-colors ${errors.password ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
                    autoComplete="current-password"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm mt-2"
                disabled={isLoading}
                data-testid="button-sign-in"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider + help */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Access restricted to Oxygen Sports employees only.
                <br />
                Contact <span className="font-semibold text-slate-600">admin@oxygensports.in</span> for account issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
