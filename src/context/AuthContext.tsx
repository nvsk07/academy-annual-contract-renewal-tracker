/**
 * AuthContext — provides auth session state backed by Firebase Authentication.
 * Uses onAuthStateChanged to persist sessions and fetches role from Firestore.
 */
import { createContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { getUserProfile, AuthUser } from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { AuthContextType };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (
            profile &&
            profile.email &&
            profile.employeeId &&
            profile.role &&
            profile.status === "active"
          ) {
            setUser(profile);
          } else {
            // User inactive or invalid/missing properties — sign out
            await signOut(auth);
            setUser(null);
          }
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
      const profile = await getUserProfile(credential.user.uid);

      if (!profile) {
        await signOut(auth);
        throw new Error("User role not found. Please contact admin.");
      }

      if (!profile.email || !profile.employeeId || !profile.role) {
        await signOut(auth);
        throw new Error("User role not found. Please contact admin.");
      }

      if (profile.status === "inactive") {
        await signOut(auth);
        throw new Error("Your account is inactive. Please contact admin.");
      }

      setUser(profile);
      return profile;
    } catch (err: any) {
      setIsLoading(false);
      // Check if it's our custom errors
      if (
        err.message === "Your account is inactive. Please contact admin." ||
        err.message === "User role not found. Please contact admin."
      ) {
        throw err;
      }
      // Translate Firebase error codes to friendly messages
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        throw new Error("Invalid email or password. Please try again.");
      }
      if (err.code === "auth/invalid-email") {
        throw new Error("Invalid email address format.");
      }
      if (err.code === "auth/too-many-requests") {
        throw new Error("Too many failed attempts. Please try again later.");
      }
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      throw new Error("No authenticated user found.");
    }

    // Re-authenticate before changing password
    const credential = EmailAuthProvider.credential(
      firebaseUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(firebaseUser, credential);
    await firebaseUpdatePassword(firebaseUser, newPassword);

    // Refresh user profile in state
    if (user && auth.currentUser) {
      const updated = await getUserProfile(auth.currentUser.uid);
      if (updated) setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
