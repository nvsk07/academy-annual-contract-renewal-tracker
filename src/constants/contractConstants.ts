export const ACADEMY_TYPES = [
  "Cricket Academy",
  "Football Academy",
  "Badminton Academy",
  "Basketball Academy",
  "Multi Sports Academy",
] as const;

export type AcademyType = typeof ACADEMY_TYPES[number];

export const EQUIPMENT_CATEGORIES = [
  "Cricket Equipment",
  "Football Equipment",
  "Badminton Equipment",
  "Sports Apparel",
  "Training Accessories",
  "Fitness Equipment",
] as const;

export type EquipmentCategory = typeof EQUIPMENT_CATEGORIES[number];

export const CONTRACT_STATUSES = ["Active", "Expiring Soon", "Renewed", "Archived"] as const;
export type ContractStatus = typeof CONTRACT_STATUSES[number];

export const SUPPLY_FREQUENCIES = ["Monthly", "Quarterly", "Annually"] as const;
export type SupplyFrequency = typeof SUPPLY_FREQUENCIES[number];

export const HEALTH_THRESHOLDS = {
  CRITICAL: 7,
  HIGH_RISK: 30,
  ATTENTION: 90,
} as const;

export const PRIORITY_LABELS = {
  critical: "Critical",
  "high-risk": "High Risk",
  attention: "Attention Required",
  healthy: "Healthy",
} as const;
