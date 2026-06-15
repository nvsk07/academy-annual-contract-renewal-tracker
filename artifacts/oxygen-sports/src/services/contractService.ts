/**
 * contractService — currently backed by mockContracts for development.
 * Replace each function body with the equivalent Firestore query when
 * Firebase integration is added. The function signatures are intentionally
 * kept stable so callers (hooks, pages) need no changes.
 *
 * Firestore collections expected:
 *   /contracts/{contractId}    — contract documents
 *   /users/{userId}            — user profile documents
 */
import { mockContracts, Contract } from "@/data/contracts";
import { getDaysUntilExpiry } from "@/utils/dateUtils";
import { getHealthStatus, HealthStatus } from "@/utils/contractUtils";
import type { AuthUser } from "@/services/authService";

export interface ContractWithHealth extends Contract {
  daysRemaining: number;
  healthStatus: HealthStatus;
}

export function getAllContracts(): ContractWithHealth[] {
  return mockContracts.map(c => {
    const daysRemaining = getDaysUntilExpiry(c.contractExpiryDate);
    return {
      ...c,
      daysRemaining,
      healthStatus: getHealthStatus(daysRemaining)
    };
  });
}

// Main entry point — returns contracts visible to this user
export function getVisibleContracts(user: AuthUser | null): ContractWithHealth[] {
  const all = getAllContracts();
  if (!user || user.role === "admin") return all;
  // RM sees only their own contracts
  return all.filter(c => c.relationshipManager === user.name);
}

export function getVisibleContractById(user: AuthUser | null, id: string): ContractWithHealth | null {
  const contract = getVisibleContracts(user).find(c => c.id === id);
  if (!contract) return null;
  return contract;
}

export function getContractById(id: string): ContractWithHealth | null {
  const contract = mockContracts.find(c => c.id === id);
  if (!contract) return null;
  const daysRemaining = getDaysUntilExpiry(contract.contractExpiryDate);
  return {
    ...contract,
    daysRemaining,
    healthStatus: getHealthStatus(daysRemaining)
  };
}

export function getContractsByStatus(status: string): ContractWithHealth[] {
  return getAllContracts().filter(c => c.status === status);
}

export function getContractsExpiringWithin(days: number): ContractWithHealth[] {
  return getAllContracts().filter(c => c.daysRemaining > 0 && c.daysRemaining <= days);
}

export function getVisibleContractsExpiringWithin(user: AuthUser | null, days: number): ContractWithHealth[] {
  return getVisibleContracts(user).filter(c => c.daysRemaining > 0 && c.daysRemaining <= days);
}

export function getHealthSummary(): Record<HealthStatus, number> {
  const summary: Record<HealthStatus, number> = {
    critical: 0,
    "high-risk": 0,
    attention: 0,
    healthy: 0
  };
  getAllContracts().forEach(c => {
    summary[c.healthStatus]++;
  });
  return summary;
}

export function getVisibleHealthSummary(user: AuthUser | null): Record<HealthStatus, number> {
  const summary: Record<HealthStatus, number> = {
    critical: 0,
    "high-risk": 0,
    attention: 0,
    healthy: 0
  };
  getVisibleContracts(user).forEach(c => {
    summary[c.healthStatus]++;
  });
  return summary;
}

export function getContractsByRM(): Record<string, ContractWithHealth[]> {
  const grouped: Record<string, ContractWithHealth[]> = {};
  getAllContracts().forEach(c => {
    if (!grouped[c.relationshipManager]) {
      grouped[c.relationshipManager] = [];
    }
    grouped[c.relationshipManager].push(c);
  });
  return grouped;
}

export function getContractsSortedByUrgency(): ContractWithHealth[] {
  return getAllContracts().sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export function getVisibleContractsSortedByUrgency(user: AuthUser | null): ContractWithHealth[] {
  return getVisibleContracts(user).sort((a, b) => a.daysRemaining - b.daysRemaining);
}
