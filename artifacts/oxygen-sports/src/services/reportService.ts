import { ContractWithHealth } from "@/services/contractService";

export interface RMPerformance {
  name: string;
  total: number;
  active: number;
  expiring: number;
  renewed: number;
  renewalRate: number;
}

export function getRMPerformance(contracts: ContractWithHealth[]): RMPerformance[] {
  const grouped: Record<string, ContractWithHealth[]> = {};
  contracts.forEach(c => {
    if (!grouped[c.relationshipManager]) {
      grouped[c.relationshipManager] = [];
    }
    grouped[c.relationshipManager].push(c);
  });

  return Object.entries(grouped).map(([name, rmContracts]) => {
    const total = rmContracts.length;
    const active = rmContracts.filter(c => c.status === "Active").length;
    const expiring = rmContracts.filter(c => c.status === "Expiring Soon").length;
    const renewed = rmContracts.filter(c => c.status === "Renewed").length;
    const previouslyExpiring = expiring + renewed + rmContracts.filter(c => c.status === "Archived").length;
    const renewalRate = previouslyExpiring > 0 ? (renewed / previouslyExpiring) * 100 : 0;

    return {
      name,
      total,
      active,
      expiring,
      renewed,
      renewalRate
    };
  });
}

export function getEquipmentCategoryBreakdown(contracts: ContractWithHealth[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  contracts.forEach(c => {
    c.equipmentCategories.forEach(category => {
      breakdown[category] = (breakdown[category] || 0) + 1;
    });
  });
  return breakdown;
}

export interface ContractSummaryStats {
  totalValue: number;
  avgDuration: number;
  totalQuantity: number;
}

export function getContractSummaryStats(contracts: ContractWithHealth[]): ContractSummaryStats {
  let totalValue = 0;
  let totalDuration = 0;
  let totalQuantity = 0;

  contracts.forEach(c => {
    totalValue += c.currentContractValue;
    totalDuration += c.durationMonths;
    totalQuantity += c.quantity;
  });

  return {
    totalValue,
    avgDuration: contracts.length > 0 ? totalDuration / contracts.length : 0,
    totalQuantity
  };
}

export function getExpiringContractReport(contracts: ContractWithHealth[]): ContractWithHealth[] {
  return contracts
    .filter(c => c.daysRemaining >= 0 && c.daysRemaining <= 90)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}
