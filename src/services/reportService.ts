/**
 * reportService — generates reports from real contract data.
 * No fake analytics, no fake financial metrics, no fake RM performance.
 * All functions derive data purely from actual contract records.
 */
import { ContractWithHealth } from "@/services/contractService";

/** Equipment category frequency across contracts */
export function getEquipmentCategoryBreakdown(contracts: ContractWithHealth[]): Record<string, number> {
  const breakdown: Record<string, number> = {};
  contracts.forEach(c => {
    c.equipmentCategories.forEach(category => {
      breakdown[category] = (breakdown[category] || 0) + 1;
    });
  });
  return breakdown;
}

/** Contracts expiring within 90 days, sorted by urgency */
export function getExpiringContractReport(contracts: ContractWithHealth[]): ContractWithHealth[] {
  return contracts
    .filter(c => c.daysRemaining >= 0 && c.daysRemaining <= 90)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/** Status distribution count for charts */
export function getStatusDistribution(contracts: ContractWithHealth[]): Record<string, number> {
  return contracts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/** Academy type distribution count for charts */
export function getAcademyTypeDistribution(contracts: ContractWithHealth[]): Record<string, number> {
  return contracts.reduce((acc, c) => {
    acc[c.academyType] = (acc[c.academyType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
