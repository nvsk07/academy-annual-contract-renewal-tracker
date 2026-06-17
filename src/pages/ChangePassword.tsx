import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ChangePassword() {
  const { user, changePassword, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ currentPassword?: string; password?: string; confirmPassword?: string; general?: string }>({});

  if (!user) return null;

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!currentPassword) newErrors.currentPassword = "Current password is required.";
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    if (password === "Welcome@123") {
      newErrors.password = "You cannot reuse the temporary password.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});

    try {
      await changePassword(currentPassword, password);
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully. Welcome to Oxygen Sports Contract Tracker.",
      });
      setLocation("/");
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrors({ currentPassword: "Current password is incorrect." });
      } else {
        setErrors({ general: err.message || "Failed to update password. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6 animate-in fade-in duration-500">
        
        {/* Brand Warning */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100 shadow-sm">
            <ShieldAlert className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Change Password Required</h2>
            <p className="text-slate-500 text-sm mt-1">
              Hello, <span className="font-semibold text-slate-800">{user.name}</span>. You are logging in with a temporary password and must update it to secure your account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.general}
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Your current / temporary password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setErrors(p => ({ ...p, currentPassword: undefined })); }}
              className={`h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors ${errors.currentPassword ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
              autoComplete="current-password"
              data-testid="input-current-password"
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                className={`h-11 bg-slate-50 border-slate-200 focus:bg-white pr-11 transition-colors ${errors.password ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
                autoComplete="new-password"
                data-testid="input-new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
              className={`h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors ${errors.confirmPassword ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
              autoComplete="new-password"
              data-testid="input-confirm-password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Action */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 mt-3 transition-colors shadow-sm"
            disabled={isLoading}
            data-testid="button-change-password"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update & Continue"
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-400 leading-normal">
            Account security managed by Oxygen Sports IT Administration.
          </p>
        </div>
      </div>
    </div>
  );
}
