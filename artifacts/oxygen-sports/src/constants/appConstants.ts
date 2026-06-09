export const APP_NAME = "Contract Renewal Tracker";
export const COMPANY_NAME = "Oxygen Sports";
export const TODAY_DATE = "2026-06-09"; // reference date for computing days remaining

export const RELATIONSHIP_MANAGERS = [
  { name: "Priya Sharma", department: "Sports Equipment Sales" },
  { name: "Arjun Mehta", department: "Academy Relations" },
  { name: "Sneha Patel", department: "Regional Sales" },
  { name: "Vikram Singh", department: "Corporate Sales" },
] as const;

export const DEPARTMENTS = [
  "Sports Equipment Sales",
  "Academy Relations",
  "Regional Sales",
  "Corporate Sales",
] as const;

export const AUTH_CREDENTIALS = [
  { employeeId: "OXY-001", password: "admin123", role: "admin" as const, name: "Rajesh Kumar", department: "Administration", avatar: "RK" },
  { employeeId: "OXY-002", password: "rm123", role: "relationship_manager" as const, name: "Priya Sharma", department: "Sports Equipment Sales", avatar: "PS" },
  { employeeId: "OXY-003", password: "rm123", role: "relationship_manager" as const, name: "Arjun Mehta", department: "Academy Relations", avatar: "AM" },
] as const;

export const PAGINATION_PAGE_SIZE = 10;
export const ALERT_BADGE_COUNT_KEY = "criticalHighCount";
