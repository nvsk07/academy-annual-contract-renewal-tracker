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
  { employeeId: "OXY-004", password: "rm123", role: "relationship_manager" as const, name: "Sneha Patel", department: "Regional Sales", avatar: "SP" },
  { employeeId: "OXY-005", password: "rm123", role: "relationship_manager" as const, name: "Vikram Singh", department: "Corporate Sales", avatar: "VS" },
] as const;

export interface MockUser {
  employeeId: string;
  name: string;
  email: string;
  role: "admin" | "relationship_manager";
  department: string;
  status: "active" | "inactive";
}

export const MOCK_USERS: MockUser[] = [
  { employeeId: "OXY-001", name: "Rajesh Kumar", email: "rajesh.kumar@oxygensports.in", role: "admin", department: "Administration", status: "active" },
  { employeeId: "OXY-002", name: "Priya Sharma", email: "priya.sharma@oxygensports.in", role: "relationship_manager", department: "Sports Equipment Sales", status: "active" },
  { employeeId: "OXY-003", name: "Arjun Mehta", email: "arjun.mehta@oxygensports.in", role: "relationship_manager", department: "Academy Relations", status: "active" },
  { employeeId: "OXY-004", name: "Sneha Patel", email: "sneha.patel@oxygensports.in", role: "relationship_manager", department: "Regional Sales", status: "active" },
  { employeeId: "OXY-005", name: "Vikram Singh", email: "vikram.singh@oxygensports.in", role: "relationship_manager", department: "Corporate Sales", status: "active" },
];

export const PAGINATION_PAGE_SIZE = 10;
export const ALERT_BADGE_COUNT_KEY = "criticalHighCount";
