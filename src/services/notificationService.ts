import { ContractWithHealth } from "@/services/contractService";

export interface AppNotification {
  id: string;
  type: "expiry_warning" | "contract_renewed" | "reminder_sent" | "status_changed";
  title: string;
  message: string;
  contractId: string;
  timestamp: string;
  read: boolean;
}

/**
 * Generate expiry warning notifications from a list of enriched contracts.
 * Activities are no longer included here — they're fetched async from Firestore.
 */
export function generateExpiryNotifications(contracts: ContractWithHealth[]): AppNotification[] {
  const notifications: AppNotification[] = [];
  contracts.forEach(c => {
    if (c.status !== "Archived" && c.daysRemaining > 0 && c.daysRemaining <= 30) {
      notifications.push({
        id: `notif-${c.id}-expiry`,
        type: "expiry_warning",
        title: "Contract Expiring Soon",
        message: `${c.academyName} expires in ${c.daysRemaining} days.`,
        contractId: c.id,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  });

  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
