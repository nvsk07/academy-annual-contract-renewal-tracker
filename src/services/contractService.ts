/**
 * contractService — Firestore-backed contract management.
 * All operations are async and talk to Firestore /contracts and /activities collections.
 * Replaces the localStorage mock with real Firebase Firestore.
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Contract, ContractStatus, AcademyType, SupplyFrequency, WorkflowStage } from "@/data/contracts";
import { getDaysUntilExpiry } from "@/utils/dateUtils";
import { getHealthStatus, HealthStatus } from "@/utils/contractUtils";
import type { AuthUser } from "@/services/authService";
import { Activity } from "@/data/activity";

export interface ContractWithHealth extends Contract {
  daysRemaining: number;
  healthStatus: HealthStatus;
}

// ── Enrichment Helper ──

function enrich(c: Contract): ContractWithHealth {
  const daysRemaining = getDaysUntilExpiry(c.contractEndDate);
  return { ...c, daysRemaining, healthStatus: getHealthStatus(daysRemaining) };
}

function docToContract(id: string, data: any): Contract {
  return {
    id,
    academyName: data.academyName || "",
    academyType: data.academyType || "Multi Sports Academy",
    contactPerson: data.contactPerson || "",
    phone: data.phone || data.contact_number || "",
    email: data.email || "",
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    contractStartDate: data.contractStartDate || data.contract_start_date || "",
    contractEndDate: data.contractEndDate || data.contract_end_date || "",
    durationMonths: data.durationMonths || 12,
    status: data.status || data.contract_status || "Active",
    equipmentCategories: data.equipmentCategories || data.equipment_category || [],
    quantity: data.quantity || 0,
    supplyFrequency: data.supplyFrequency || "Monthly",
    relationshipManagerId: data.relationshipManagerId || data.relationship_manager_id || "",
    relationshipManagerName: data.relationshipManagerName || data.relationship_manager_name || "",
    department: data.department || "",
    notes: data.notes || "",
    workflowStage: data.workflowStage || "created",
    contractValue: data.contractValue || data.contract_value || 0,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt || new Date().toISOString()),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt || new Date().toISOString()),
    // Backwards compatibility aliases
    contractExpiryDate: data.contractEndDate || data.contract_end_date || "",
    relationshipManager: data.relationshipManagerName || data.relationship_manager_name || "",
    // Firestore snake_case aliases
    academy_name: data.academyName || data.academy_name || "",
    academy_type: data.academyType || data.academy_type || "",
    contact_person: data.contactPerson || data.contact_person || "",
    contact_number: data.phone || data.contact_number || "",
    location: data.location || `${data.city || ""}, ${data.state || ""}`,
    contract_start_date: data.contractStartDate || data.contract_start_date || "",
    contract_end_date: data.contractEndDate || data.contract_end_date || "",
    equipment_category: data.equipmentCategories || data.equipment_category || [],
    contract_value: data.contractValue || data.contract_value || 0,
    relationship_manager_id: data.relationshipManagerId || data.relationship_manager_id || "",
    relationship_manager_name: data.relationshipManagerName || data.relationship_manager_name || "",
    contract_status: data.status || data.contract_status || "Active",
    created_at: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : (data.createdAt || new Date().toISOString()),
    updated_at: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : (data.updatedAt || new Date().toISOString()),
  };
}

// ── Contract Queries ──

export async function getAllContracts(): Promise<ContractWithHealth[]> {
  const snap = await getDocs(collection(db, "contracts"));
  return snap.docs.map(d => enrich(docToContract(d.id, d.data())));
}

/**
 * Returns contracts visible to the current user based on role.
 * Admin: all contracts. RM: only their assigned contracts.
 */
export async function getVisibleContracts(user: AuthUser | null): Promise<ContractWithHealth[]> {
  if (!user) return [];
  if (user.role === "admin") {
    return getAllContracts();
  }
  // RM: filter by relationshipManagerId == employeeId
  const q = query(
    collection(db, "contracts"),
    where("relationshipManagerId", "==", user.employeeId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => enrich(docToContract(d.id, d.data())));
}

/**
 * Subscribes to real-time changes of contracts visible to the current user.
 */
export function subscribeVisibleContracts(
  user: AuthUser | null,
  onUpdate: (contracts: ContractWithHealth[]) => void,
  onError: (error: any) => void
): () => void {
  if (!user) {
    onUpdate([]);
    return () => {};
  }

  const q = user.role === "admin"
    ? collection(db, "contracts")
    : query(collection(db, "contracts"), where("relationshipManagerId", "==", user.employeeId));

  return onSnapshot(
    q,
    (snap) => {
      const contracts = snap.docs.map(d => enrich(docToContract(d.id, d.data())));
      onUpdate(contracts);
    },
    (err) => {
      console.error("subscribeVisibleContracts error:", err);
      onError(err);
    }
  );
}

export async function getVisibleContractById(
  user: AuthUser | null,
  id: string
): Promise<ContractWithHealth | null> {
  const snap = await getDoc(doc(db, "contracts", id));
  if (!snap.exists()) return null;
  const contract = docToContract(snap.id, snap.data());

  if (!user) return null;
  if (user.role === "admin") return enrich(contract);
  if (contract.relationshipManagerId !== user.employeeId) return null;
  return enrich(contract);
}

export async function getContractById(id: string): Promise<ContractWithHealth | null> {
  const snap = await getDoc(doc(db, "contracts", id));
  if (!snap.exists()) return null;
  return enrich(docToContract(snap.id, snap.data()));
}

export async function getContractsExpiringWithin(
  user: AuthUser | null,
  days: number
): Promise<ContractWithHealth[]> {
  const contracts = await getVisibleContracts(user);
  return contracts.filter(c => c.daysRemaining > 0 && c.daysRemaining <= days);
}

export async function getHealthSummary(
  user: AuthUser | null
): Promise<Record<HealthStatus, number>> {
  const summary: Record<HealthStatus, number> = { critical: 0, "high-risk": 0, attention: 0, healthy: 0 };
  const contracts = await getVisibleContracts(user);
  contracts
    .filter(c => c.status !== "Archived")
    .forEach(c => { summary[c.healthStatus]++; });
  return summary;
}

export async function getContractsSortedByUrgency(
  user: AuthUser | null
): Promise<ContractWithHealth[]> {
  const contracts = await getVisibleContracts(user);
  return contracts
    .filter(c => c.status !== "Archived")
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

// ── Activity Logging ──

export async function logActivity(
  type: Activity["type"],
  description: string,
  actor: string,
  contractId?: string,
  contractName?: string
): Promise<void> {
  await addDoc(collection(db, "activities"), {
    type,
    description,
    timestamp: serverTimestamp(),
    actor,
    contractId: contractId || null,
    contractName: contractName || null,
  });
}

export async function getContractActivities(contractId: string): Promise<Activity[]> {
  const q = query(
    collection(db, "activities"),
    where("contractId", "==", contractId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => {
      const data = d.data();
      return {
        id: d.id,
        type: data.type,
        description: data.description,
        timestamp: data.timestamp instanceof Timestamp
          ? data.timestamp.toDate().toISOString()
          : data.timestamp,
        actor: data.actor,
        contractId: data.contractId,
        contractName: data.contractName,
      } as Activity;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ── Contract Mutations ──

export async function createContract(
  data: {
    academyName: string;
    academyType: AcademyType;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    contractStartDate: string;
    contractEndDate: string;
    durationMonths: number;
    status: ContractStatus;
    equipmentCategories: string[];
    quantity: number;
    supplyFrequency: SupplyFrequency;
    relationshipManagerId: string;
    relationshipManagerName: string;
    department: string;
    notes: string;
    workflowStage: WorkflowStage;
    contractValue: number;
  },
  creator: AuthUser
): Promise<ContractWithHealth> {
  // Constrain: RMs can only assign to themselves
  let rmId = data.relationshipManagerId;
  let rmName = data.relationshipManagerName;
  if (creator.role === "relationship_manager") {
    rmId = creator.employeeId;
    rmName = creator.name;
  }

  const contractData = {
    ...data,
    relationshipManagerId: rmId,
    relationshipManagerName: rmName,
    // snake_case aliases for Firestore compatibility
    academy_name: data.academyName,
    academy_type: data.academyType,
    contact_person: data.contactPerson,
    contact_number: data.phone,
    location: `${data.address}, ${data.city}, ${data.state}`,
    contract_start_date: data.contractStartDate,
    contract_end_date: data.contractEndDate,
    equipment_category: data.equipmentCategories,
    contract_value: data.contractValue,
    relationship_manager_id: rmId,
    relationship_manager_name: rmName,
    contract_status: data.status,
    contractExpiryDate: data.contractEndDate,
    relationshipManager: rmName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "contracts"), contractData);

  // Generate a friendly ID by updating the document with an OXY-YYYY-NNN id
  const oxyId = `OXY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  await logActivity(
    "contract_created",
    `Contract for ${data.academyName} created by ${creator.name}.`,
    creator.name,
    docRef.id,
    data.academyName
  );

  // Return the created contract with Firestore doc ID
  return enrich(docToContract(docRef.id, {
    ...data,
    relationshipManagerId: rmId,
    relationshipManagerName: rmName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function updateContract(
  id: string,
  updates: Partial<Omit<Contract, "id" | "createdAt">>,
  modifier: AuthUser
): Promise<void> {
  // Security: RMs can only edit their own contracts
  if (modifier.role === "relationship_manager") {
    const contract = await getContractById(id);
    if (!contract) throw new Error("Contract not found.");
    if (contract.relationshipManagerId !== modifier.employeeId) {
      throw new Error("Unauthorized: You can only edit your own contracts.");
    }
    // RMs cannot re-assign contracts
    delete (updates as any).relationshipManagerId;
    delete (updates as any).relationshipManagerName;
  }

  const updatePayload: Record<string, any> = {
    ...updates,
    updatedAt: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  // Keep snake_case aliases in sync
  if (updates.status) updatePayload.contract_status = updates.status;
  if (updates.contractEndDate) updatePayload.contract_end_date = updates.contractEndDate;
  if (updates.contractStartDate) updatePayload.contract_start_date = updates.contractStartDate;
  if (updates.equipmentCategories) updatePayload.equipment_category = updates.equipmentCategories;
  if (updates.relationshipManagerId) updatePayload.relationship_manager_id = updates.relationshipManagerId;
  if (updates.relationshipManagerName) updatePayload.relationship_manager_name = updates.relationshipManagerName;
  if (updates.contractValue !== undefined) updatePayload.contract_value = updates.contractValue;

  await updateDoc(doc(db, "contracts", id), updatePayload);

  await logActivity(
    updates.status ? (updates.status === "Renewed" ? "contract_renewed" : "status_changed") : "price_updated",
    updates.status
      ? `Contract status updated to ${updates.status} by ${modifier.name}.`
      : `Contract details updated by ${modifier.name}.`,
    modifier.name,
    id
  );
}

export async function deleteContract(id: string, actor: AuthUser): Promise<void> {
  if (actor.role !== "admin") {
    throw new Error("Unauthorized: Only admins can delete contracts.");
  }
  const contract = await getContractById(id);
  await deleteDoc(doc(db, "contracts", id));
  await logActivity(
    "status_changed",
    `Contract for ${contract?.academyName || id} deleted from system.`,
    actor.name,
    id,
    contract?.academyName
  );
}

// ── Synchronous helpers used by Sidebar badge (kept for compatibility, uses cached data) ──

/**
 * @deprecated Use async getContractsExpiringWithin instead.
 * Kept for Sidebar badge compatibility — returns empty array if not yet loaded.
 */
export function getVisibleContractsExpiringWithin(
  _user: AuthUser | null,
  _days: number
): ContractWithHealth[] {
  return [];
}

/**
 * @deprecated Use async getContractsSortedByUrgency instead.
 */
export function getVisibleContractsSortedByUrgency(
  _user: AuthUser | null
): ContractWithHealth[] {
  return [];
}
