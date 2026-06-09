import { ContractWithHealth } from "@/services/contractService";
import { mockActivity } from "@/data/activity";

export interface AppNotification {
  id: string;
  type: "expiry_warning" | "contract_renewed" | "reminder_sent" | "status_changed";
  title: string;
  message: string;
  contractId: string;
  timestamp: string;
  read: boolean;
}

export function generateExpiryNotifications(contracts: ContractWithHealth[]): AppNotification[] {
  const notifications: AppNotification[] = [];
  contracts.forEach(c => {
    if (c.daysRemaining > 0 && c.daysRemaining <= 30) {
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

  // Include some activity as notifications
  mockActivity.slice(0, 5).forEach((activity, index) => {
    let type: AppNotification["type"] = "status_changed";
    if (activity.type === "contract_renewed") type = "contract_renewed";
    else if (activity.type === "reminder_generated") type = "reminder_sent";
    
    notifications.push({
      id: `notif-act-${activity.id}`,
      type,
      title: "Activity Update",
      message: activity.description,
      contractId: activity.contractId || "",
      timestamp: activity.timestamp,
      read: index > 2
    });
  });

  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
