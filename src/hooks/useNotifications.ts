import { useState, useMemo, useEffect } from "react";
import { generateExpiryNotifications, AppNotification } from "@/services/notificationService";
import { getVisibleContracts } from "@/services/contractService";
import { useAuth } from "@/hooks/useAuth";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const contracts = await getVisibleContracts(user);
        setNotifications(generateExpiryNotifications(contracts));
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    load();
  }, [user]);

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
