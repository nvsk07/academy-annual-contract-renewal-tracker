import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { validateCredentials, persistSession, loadSession, clearSession, AuthUser } from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
