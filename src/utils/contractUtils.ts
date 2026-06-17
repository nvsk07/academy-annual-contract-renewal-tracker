import { HEALTH_THRESHOLDS } from "@/constants/contractConstants";

export type HealthStatus = "expired" | "healthy" | "attention" | "high-risk" | "critical";

export function getHealthStatus(daysRemaining: number): HealthStatus {
  if (daysRemaining < 0) return "expired";
  if (daysRemaining < HEALTH_THRESHOLDS.CRITICAL) return "critical";
  if (daysRemaining < HEALTH_THRESHOLDS.HIGH_RISK) return "high-risk";
  if (daysRemaining < HEALTH_THRESHOLDS.ATTENTION) return "attention";
  return "healthy";
}

export function getHealthLabel(health: HealthStatus): string {
  switch (health) {
    case "expired": return "Expired";
    case "critical": return "Critical";
    case "high-risk": return "High Risk";
    case "attention": return "Attention Required";
    case "healthy": return "Healthy";
    default: return "Unknown";
  }
}

export function getHealthBadgeClasses(health: HealthStatus): string {
  switch (health) {
    case "expired": return "bg-slate-200 text-slate-800";
    case "critical": return "bg-red-100 text-red-800";
    case "high-risk": return "bg-orange-100 text-orange-800";
    case "attention": return "bg-yellow-100 text-yellow-800";
    case "healthy": return "bg-green-100 text-green-800";
    default: return "bg-slate-100 text-slate-800";
  }
}

export function getHealthBorderClass(health: HealthStatus): string {
  switch (health) {
    case "expired": return "border-slate-400";
    case "critical": return "border-red-500";
    case "high-risk": return "border-orange-500";
    case "attention": return "border-yellow-500";
    case "healthy": return "border-green-500";
    default: return "border-slate-500";
  }
}

export function getPriorityLabel(daysRemaining: number): "Critical" | "High" | "Medium" | "Low" {
  if (daysRemaining < HEALTH_THRESHOLDS.CRITICAL) return "Critical";
  if (daysRemaining < HEALTH_THRESHOLDS.HIGH_RISK) return "High";
  if (daysRemaining < HEALTH_THRESHOLDS.ATTENTION) return "Medium";
  return "Low";
}

export function getPriorityClasses(priority: string): string {
  switch (priority) {
    case "Critical": return "bg-red-100 text-red-800";
    case "High": return "bg-orange-100 text-orange-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-slate-100 text-slate-800";
  }
}

export function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Expiring Soon": return "bg-orange-100 text-orange-800";
    case "Renewed": return "bg-blue-100 text-blue-800";
    case "Archived": return "bg-slate-100 text-slate-800";
    default: return "bg-slate-100 text-slate-800";
  }
}

export function getRenewalStageIndex(status: string): number {
  switch (status) {
    case "Active": return 1;
    case "Expiring Soon": return 2;
    case "Renewed": return 4;
    case "Archived": return 0;
    default: return 0;
  }
}
