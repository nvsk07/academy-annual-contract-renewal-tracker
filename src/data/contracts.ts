/**
 * Contract data model.
 * Prepared for Firestore collection: /contracts/{contractId}
 */

export type AcademyType =
  | "Cricket Academy"
  | "Football Academy"
  | "Badminton Academy"
  | "Basketball Academy"
  | "Multi Sports Academy";

export type ContractStatus = "Active" | "Expiring Soon" | "Renewed" | "Archived";

export type WorkflowStage =
  | "created"
  | "active"
  | "reminder_sent"
  | "negotiation"
  | "renewed";

export type SupplyFrequency = "Monthly" | "Quarterly" | "Annually";

export interface Contract {
  // camelCase keys (used by existing UI components)
  id: string;
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
  contractValue: number; // Hidden from UI, stored for backend
  createdAt: string;
  updatedAt: string;

  // Backwards compatibility aliases
  contractExpiryDate: string;
  relationshipManager: string;

  // Firestore-ready snake_case aliases
  academy_name: string;
  academy_type: string;
  contact_person: string;
  contact_number: string;
  location: string;
  contract_start_date: string;
  contract_end_date: string;
  equipment_category: string[];
  contract_value: number;
  relationship_manager_id: string;
  relationship_manager_name: string;
  contract_status: string;
  created_at: string;
  updated_at: string;
}


