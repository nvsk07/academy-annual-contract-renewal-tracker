import { AUTH_CREDENTIALS } from "@/constants/appConstants";

export interface AuthUser {
  id: string;
  employeeId: string;
  name: string;
  role: "admin" | "relationship_manager";
  department: string;
  avatar: string;
}

const SESSION_KEY = "oxy_session";

export function validateCredentials(employeeId: string, password: string): AuthUser | null {
  const credential = AUTH_CREDENTIALS.find(c => c.employeeId === employeeId && c.password === password);
  if (credential) {
    return {
      id: credential.employeeId,
      employeeId: credential.employeeId,
      name: credential.name,
      role: credential.role,
      department: credential.department,
      avatar: credential.avatar
    };
  }
  return null;
}

export function persistSession(user: AuthUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loadSession(): AuthUser | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }
  return null;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.role === "admin";
}
