export interface Activity {
  id: string;
  type: "contract_created" | "contract_renewed" | "price_updated" | "status_changed" | "reminder_generated";
  description: string;
  timestamp: string;
  actor: string;
  contractId?: string;
  contractName?: string;
}

export const mockActivity: Activity[] = [
  {
    id: "ACT-001",
    type: "contract_renewed",
    description: "Contract renewed for Elite Cricket Academy with a 15% value increase.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actor: "Priya Sharma",
    contractId: "OXY-2024-001",
    contractName: "Elite Cricket Academy"
  },
  {
    id: "ACT-002",
    type: "reminder_generated",
    description: "Automated renewal reminder sent to Delhi Smashers (Expiring in 30 days).",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actor: "System",
    contractId: "OXY-2024-003",
    contractName: "Delhi Smashers"
  },
  {
    id: "ACT-003",
    type: "status_changed",
    description: "Chennai Hoops status changed to 'Expiring Soon'.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    actor: "System",
    contractId: "OXY-2024-004",
    contractName: "Chennai Hoops"
  },
  {
    id: "ACT-004",
    type: "price_updated",
    description: "Price revision applied for Mumbai FC Youth. New value: ₹16,00,000.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actor: "Arjun Mehta",
    contractId: "OXY-2024-002",
    contractName: "Mumbai FC Youth"
  },
  {
    id: "ACT-005",
    type: "contract_created",
    description: "New contract drafted for Pune Titans.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    actor: "Priya Sharma",
    contractId: "OXY-2024-005",
    contractName: "Pune Titans"
  },
  {
    id: "ACT-006",
    type: "contract_renewed",
    description: "Kolkata Strikers contract renewed successfully.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    actor: "Arjun Mehta",
    contractId: "OXY-2023-006",
    contractName: "Kolkata Strikers"
  },
  {
    id: "ACT-007",
    type: "reminder_generated",
    description: "Final notice generated for Jaipur Royals.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    actor: "Priya Sharma",
    contractId: "OXY-2024-009",
    contractName: "Jaipur Royals"
  },
  {
    id: "ACT-008",
    type: "status_changed",
    description: "Hyderabad United contract archived.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    actor: "Sneha Patel",
    contractId: "OXY-2022-007",
    contractName: "Hyderabad United"
  },
  {
    id: "ACT-009",
    type: "contract_created",
    description: "Initial terms agreed with Ahmedabad Shuttle.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    actor: "Vikram Singh",
    contractId: "OXY-2024-008",
    contractName: "Ahmedabad Shuttle"
  },
  {
    id: "ACT-010",
    type: "price_updated",
    description: "Value adjustment logged for Lucknow Warriors.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    actor: "Arjun Mehta",
    contractId: "OXY-2024-010",
    contractName: "Lucknow Warriors"
  }
];