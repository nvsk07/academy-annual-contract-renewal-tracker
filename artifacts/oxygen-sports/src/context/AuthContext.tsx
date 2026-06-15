/**
 * AuthContext — currently uses local credential validation via authService.
 * Replace validateCredentials() with Firebase Auth signInWithEmailAndPassword()
 * and loadSession()/persistSession() with onAuthStateChanged() when
 * Firebase integration is added.
 */
import { createContext, useState, useEffect, ReactNode } from "react";
import { validateCredentials, persistSession, loadSession, clearSession, AuthUser } from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { AuthContextType };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = loadSession();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const loggedInUser = validateCredentials(employeeId, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        persistSession(loggedInUser);
      } else {
        throw new Error("Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

