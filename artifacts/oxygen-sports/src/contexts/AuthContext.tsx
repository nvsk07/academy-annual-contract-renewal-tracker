import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  employeeId: string;
  name: string;
  role: "admin" | "relationship_manager";
  department: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("oxygen_auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("oxygen_auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      let loggedInUser: User | null = null;
      if (employeeId === "OXY-001" && password === "admin123") {
        loggedInUser = { id: "1", employeeId: "OXY-001", name: "Rajesh Kumar", role: "admin", department: "Sales", avatar: "RK" };
      } else if (employeeId === "OXY-002" && password === "rm123") {
        loggedInUser = { id: "2", employeeId: "OXY-002", name: "Priya Sharma", role: "relationship_manager", department: "Cricket Sales", avatar: "PS" };
      } else if (employeeId === "OXY-003" && password === "rm123") {
        loggedInUser = { id: "3", employeeId: "OXY-003", name: "Arjun Mehta", role: "relationship_manager", department: "Football Sales", avatar: "AM" };
      }
      
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem("oxygen_auth_user", JSON.stringify(loggedInUser));
      } else {
        throw new Error("Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("oxygen_auth_user");
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