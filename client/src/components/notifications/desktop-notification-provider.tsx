import React, { createContext, useContext, useEffect } from "react";
import { useDesktopNotifications } from "@/hooks/use-desktop-notifications";

interface DesktopNotificationContextType {
  settings: any;
  permissionStatus: NotificationPermission;
  activeNotificationsCount: number;
  requestPermission: () => Promise<NotificationPermission>;
  updateSetting: (key: string, value: boolean | number) => void;
  closeAllNotifications: () => void;
  sendTestNotification: () => void;
}

const DesktopNotificationContext = createContext<DesktopNotificationContextType | undefined>(undefined);

export function DesktopNotificationProvider({ children }: { children: React.ReactNode }) {
  const desktopNotifications = useDesktopNotifications();

  return (
    <DesktopNotificationContext.Provider value={desktopNotifications}>
      {children}
    </DesktopNotificationContext.Provider>
  );
}

export function useDesktopNotificationContext() {
  const context = useContext(DesktopNotificationContext);
  if (!context) {
    throw new Error("useDesktopNotificationContext must be used within a DesktopNotificationProvider");
  }
  return context;
}