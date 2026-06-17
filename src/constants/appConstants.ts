export const APP_NAME = "Contract Renewal Tracker";
export const COMPANY_NAME = "Oxygen Sports";
export const TODAY_DATE = new Date().toISOString().split("T")[0]; // always today's date

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



export const PAGINATION_PAGE_SIZE = 10;
export const ALERT_BADGE_COUNT_KEY = "criticalHighCount";
