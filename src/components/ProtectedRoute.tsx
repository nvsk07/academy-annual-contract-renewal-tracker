import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  /** If set, only users with this role can access. Others are redirected to /401 */
  requiredRole?: "admin" | "relationship_manager";
  /** If true, allows users who must change password to view this route (used for /change-password) */
  allowMustChangePassword?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowMustChangePassword = false 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    
    // 1. Not authenticated
    if (!user) {
      setLocation("/login");
      return;
    }

    // 2. User must change password
    if (user.mustChangePassword) {
      if (!allowMustChangePassword) {
        setLocation("/change-password");
      }
      return;
    }

    // 3. User does NOT need password change, but is trying to access /change-password
    if (allowMustChangePassword && !user.mustChangePassword) {
      setLocation("/");
      return;
    }

    // 4. Role-based check
    if (requiredRole && user.role !== requiredRole) {
      setLocation("/401");
    }
  }, [user, isLoading, setLocation, requiredRole, allowMustChangePassword]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Render rules validation matching effect logic to prevent flicker before redirect
  if (user.mustChangePassword && !allowMustChangePassword) return null;
  if (!user.mustChangePassword && allowMustChangePassword) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}
