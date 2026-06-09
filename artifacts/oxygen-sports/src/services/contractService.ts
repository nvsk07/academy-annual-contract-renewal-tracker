import { mockContracts, Contract } from "@/data/contracts";
import { getDaysUntilExpiry } from "@/utils/dateUtils";
import { getHealthStatus, HealthStatus } from "@/utils/contractUtils";

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
