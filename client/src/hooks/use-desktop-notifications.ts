import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth-v2';

interface DesktopNotificationSettings {
  enabled: boolean;
  jobOrderUpdates: boolean;
  productionAlerts: boolean;
  qualityIssues: boolean;
  urgentOrders: boolean;
  machineDowntime: boolean;
  soundEnabled: boolean;
  autoClose: boolean;
  autoCloseDelay: number;
}

interface JobOrderUpdate {
  id: number;
  jobOrderId: string;
  type: 'status_change' | 'priority_change' | 'assigned' | 'completed' | 'delayed' | 'quality_issue';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  timestamp: string;
  metadata?: Record<string, any>;
}

const DEFAULT_SETTINGS: DesktopNotificationSettings = {
  enabled: false,
  jobOrderUpdates: true,
  productionAlerts: true,
  qualityIssues: true,
  urgentOrders: true,
  machineDowntime: true,
  soundEnabled: true,
  autoClose: true,
  autoCloseDelay: 8000,
};

export function useDesktopNotifications() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DesktopNotificationSettings>(DEFAULT_SETTINGS);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const lastNotificationRef = useRef<number>(0);
  const activeNotifications = useRef<Set<Notification>>(new Set());

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('desktop-notification-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('desktop-notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Poll for new job order updates
  const { data: jobOrderUpdates = [] } = useQuery<JobOrderUpdate[]>({
    queryKey: ['/api/job-order-updates'],
    enabled: !!user && settings.enabled,
    refetchInterval: 15000, // Check every 15 seconds
  });

  // Request notification permission
  const requestPermission = async (): Promise<NotificationPermission> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
      }
      
      return permission;
    }
    return 'denied';
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  // Show desktop notification
  const showDesktopNotification = (update: JobOrderUpdate) => {
    if (!settings.enabled || permissionStatus !== 'granted') return;
    
    // Check if we should show this type of notification
    if (update.type === 'status_change' && !settings.jobOrderUpdates) return;
    if (update.type === 'priority_change' && !settings.productionAlerts) return;
    if (update.type === 'quality_issue' && !settings.qualityIssues) return;
    if (update.type === 'delayed' && !settings.urgentOrders) return;

    const iconMap = {
      'status_change': '🔄',
      'priority_change': '⚡',
      'assigned': '👷',
      'completed': '✅',
      'delayed': '⏰',
      'quality_issue': '⚠️',
    };

    const priorityEmoji = {
      low: '🔵',
      medium: '🟡',
      high: '🟠',
      urgent: '🔴',
      critical: '🚨',
    };

    try {
      const notification = new Notification(
        `${iconMap[update.type]} ${update.title}`,
        {
          body: `${priorityEmoji[update.priority]} ${update.message}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `job-order-${update.jobOrderId}`,
          requireInteraction: update.priority === 'urgent' || update.priority === 'critical',
          silent: !settings.soundEnabled,
          data: {
            jobOrderId: update.jobOrderId,
            updateId: update.id,
            type: update.type,
          },
        }
      );

      // Store reference to close later
      activeNotifications.current.add(notification);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        // Navigate to job order details
        window.location.href = `/production/job-orders/${update.jobOrderId}`;
        notification.close();
      };

      // Auto-close notification
      if (settings.autoClose) {
        setTimeout(() => {
          notification.close();
          activeNotifications.current.delete(notification);
        }, settings.autoCloseDelay);
      }

      // Clean up on close
      notification.onclose = () => {
        activeNotifications.current.delete(notification);
      };

      // Play sound for critical updates
      if (settings.soundEnabled && (update.priority === 'urgent' || update.priority === 'critical')) {
        playNotificationSound();
      }

    } catch (error) {
      console.error('Failed to show desktop notification:', error);
    }
  };

  // Process new job order updates
  useEffect(() => {
    if (!jobOrderUpdates.length) return;

    const latestUpdate = jobOrderUpdates[0];
    if (latestUpdate.id > lastNotificationRef.current) {
      showDesktopNotification(latestUpdate);
      lastNotificationRef.current = latestUpdate.id;
    }
  }, [jobOrderUpdates, settings]);

  // Close all active notifications
  const closeAllNotifications = () => {
    activeNotifications.current.forEach(notification => {
      notification.close();
    });
    activeNotifications.current.clear();
  };

  // Update settings
  const updateSetting = (key: keyof DesktopNotificationSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Send test notification
  const sendTestNotification = () => {
    const testUpdate: JobOrderUpdate = {
      id: Date.now(),
      jobOrderId: 'JO-TEST-001',
      type: 'status_change',
      title: 'Test Notification',
      message: 'This is a test notification for job order updates.',
      priority: 'medium',
      timestamp: new Date().toISOString(),
    };
    showDesktopNotification(testUpdate);
  };

  return {
    settings,
    permissionStatus,
    activeNotificationsCount: activeNotifications.current.size,
    requestPermission,
    updateSetting,
    closeAllNotifications,
    sendTestNotification,
    showDesktopNotification,
  };
}