import { useState, useMemo, useEffect } from "react";
import { generateExpiryNotifications, AppNotification } from "@/services/notificationService";
import { getAllContracts } from "@/services/contractService";

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    // Generate initial notifications
    setNotifications(generateExpiryNotifications(getAllContracts()));
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearAll };
}
