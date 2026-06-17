export interface Activity {
  id: string;
  type: "contract_created" | "contract_renewed" | "price_updated" | "status_changed" | "reminder_generated";
  description: string;
  timestamp: string;
  actor: string;
  contractId?: string;
  contractName?: string;
}
