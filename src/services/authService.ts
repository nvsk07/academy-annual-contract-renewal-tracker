/**
 * authService — Firebase Auth + Firestore user management.
 * Replaces the localStorage mock with real Firebase backend.
 * Firestore collection: /users/{uid}
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export interface AuthUser {
  uid: string;            // Firebase Auth UID
  id: string;             // same as employeeId for compatibility
  employeeId: string;
  name: string;
  email: string;
  role: "admin" | "relationship_manager";
  department: string;
  avatar: string;
  status: "active" | "inactive";
  mustChangePassword?: boolean;
  createdAt: string;
}

// ── Firestore User Profile Fetch ──

/**
 * Fetch user profile from Firestore users collection by email.
 */
export async function getUserProfileByEmail(email: string): Promise<AuthUser | null> {
  const q = query(
    collection(db, "users"),
    where("email", "==", email.toLowerCase().trim())
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    uid: d.id,
    id: data.employeeId || d.id,
    employeeId: data.employeeId || "",
    name: data.name || "",
    email: data.email || "",
    role: data.role || undefined,
    department: data.department || "",
    avatar: data.avatar || data.name?.slice(0, 2).toUpperCase() || "US",
    status: data.status || "active",
    mustChangePassword: data.mustChangePassword || false,
    createdAt: data.createdAt || new Date().toISOString(),
  } as any;
}

/**
 * Fetch user profile from Firestore /users/{uid} by Firebase Auth UID.
 */
export async function getUserProfile(uid: string): Promise<AuthUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    id: data.employeeId || uid,
    employeeId: data.employeeId || "",
    name: data.name || "",
    email: data.email || "",
    role: data.role || undefined,
    department: data.department || "",
    avatar: data.avatar || data.name?.slice(0, 2).toUpperCase() || "US",
    status: data.status || "active",
    mustChangePassword: data.mustChangePassword || false,
    createdAt: data.createdAt || new Date().toISOString(),
  } as any;
}

/**
 * Fetch all users from Firestore /users collection.
 */
export async function getAllUsers(): Promise<AuthUser[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      id: data.employeeId || d.id,
      employeeId: data.employeeId || "",
      name: data.name || "",
      email: data.email || "",
      role: data.role || "relationship_manager",
      department: data.department || "",
      avatar: data.avatar || data.name?.slice(0, 2).toUpperCase() || "US",
      status: data.status || "active",
      mustChangePassword: data.mustChangePassword || false,
      createdAt: data.createdAt || new Date().toISOString(),
    } as AuthUser;
  });
}

/**
 * Get active relationship managers from Firestore.
 */
export async function getActiveRelationshipManagers(): Promise<AuthUser[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "relationship_manager"),
    where("status", "==", "active")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      id: data.employeeId || d.id,
      employeeId: data.employeeId || "",
      name: data.name || "",
      email: data.email || "",
      role: "relationship_manager" as const,
      department: data.department || "",
      avatar: data.avatar || data.name?.slice(0, 2).toUpperCase() || "US",
      status: "active" as const,
      mustChangePassword: data.mustChangePassword || false,
      createdAt: data.createdAt || new Date().toISOString(),
    };
  });
}

// ── Admin User Management (Firestore writes) ──

/**
 * Create a Firebase Auth user using a secondary Firebase app instance.
 * This prevents the signed-in administrator from being logged out by the Client SDK.
 */
export async function adminCreateAuthUser(email: string, password: string): Promise<string> {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  const tempAppName = `TempAdminApp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const tempApp = initializeApp(firebaseConfig, tempAppName);
  try {
    const tempAuth = getAuth(tempApp);
    const credential = await createUserWithEmailAndPassword(tempAuth, email.toLowerCase().trim(), password);
    return credential.user.uid;
  } finally {
    await deleteApp(tempApp);
  }
}

/**
 * Create a Firestore user document for a newly-created Firebase Auth account.
 */
export async function adminCreateFirestoreUser(
  uid: string,
  data: {
    employeeId: string;
    name: string;
    email: string;
    role: "admin" | "relationship_manager";
    department: string;
  }
): Promise<AuthUser> {
  const initials = data.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userDoc = {
    employeeId: data.employeeId,
    name: data.name,
    email: data.email,
    role: data.role,
    department: data.department,
    avatar: initials || "US",
    status: "active",
    mustChangePassword: true,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", uid), userDoc);

  return {
    uid,
    id: data.employeeId,
    ...userDoc,
    status: "active" as const,
  };
}

/**
 * Update Firestore user document fields.
 */
export async function adminUpdateUser(
  uid: string,
  updates: Partial<
    Pick<AuthUser, "name" | "email" | "role" | "department" | "status">
  >
): Promise<void> {
  await updateDoc(doc(db, "users", uid), updates);
}

/**
 * Toggle user active/inactive status in Firestore.
 */
export async function adminToggleUserStatus(
  uid: string,
  currentStatus: "active" | "inactive"
): Promise<"active" | "inactive"> {
  const nextStatus = currentStatus === "active" ? "inactive" : "active";
  await updateDoc(doc(db, "users", uid), { status: nextStatus });
  return nextStatus;
}

/**
 * Reset user's mustChangePassword flag in Firestore.
 */
export async function adminResetUserPassword(uid: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { mustChangePassword: true });
}

// ── Role Permissions Guarding ──

const ROLE_PERMISSIONS: Record<AuthUser["role"], Set<string>> = {
  admin: new Set([
    "view:contracts",
    "create:contracts",
    "edit:contracts",
    "delete:contracts",
    "view:analytics",
    "view:reports",
    "view:alerts",
    "view:settings",
    "manage:users",
    "view:all_contracts",
  ]),
  relationship_manager: new Set([
    "view:contracts",
    "create:contracts",
    "edit:contracts",
    "view:analytics",
    "view:reports",
    "view:alerts",
  ]),
};

export function hasPermission(user: AuthUser, permission: string): boolean {
  return ROLE_PERMISSIONS[user.role]?.has(permission) ?? false;
}
