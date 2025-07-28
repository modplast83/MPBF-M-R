import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Bell, 
  BellRing, 
  Settings, 
  Monitor, 
  AlertTriangle,
  Factory,
  Package,
  Clock,
  CheckCircle,
  Volume2,
  VolumeX
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth-v2";
import { apiRequest } from "@/lib/queryClient";

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

export function DesktopNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
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
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
        toast({
          title: "Desktop Notifications Enabled",
          description: "You'll now receive desktop notifications for critical job order updates.",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Desktop notifications require permission to work properly.",
          variant: "destructive",
        });
      }
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

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.wav');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
      console.log('Audio not available');
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

  const updateSetting = (key: keyof DesktopNotificationSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted': return 'Granted';
      case 'denied': return 'Denied';
      default: return 'Not Requested';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Desktop Notifications
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure desktop notifications for critical job order updates
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="font-medium">Notification Permission</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getPermissionStatusColor()}>
              {getPermissionStatusText()}
            </Badge>
            {permissionStatus !== 'granted' && (
              <Button size="sm" onClick={requestPermission}>
                Request Permission
              </Button>
            )}
          </div>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <Label htmlFor="notifications-enabled" className="font-medium">
              Enable Desktop Notifications
            </Label>
          </div>
          <Switch
            id="notifications-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
            disabled={permissionStatus !== 'granted'}
          />
        </div>

        <Separator />

        {/* Notification Categories */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-700">Notification Categories</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <Label htmlFor="job-order-updates">Job Order Updates</Label>
              </div>
              <Switch
                id="job-order-updates"
                checked={settings.jobOrderUpdates}
                onCheckedChange={(checked) => updateSetting('jobOrderUpdates', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-orange-500" />
                <Label htmlFor="production-alerts">Production Alerts</Label>
              </div>
              <Switch
                id="production-alerts"
                checked={settings.productionAlerts}
                onCheckedChange={(checked) => updateSetting('productionAlerts', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <Label htmlFor="quality-issues">Quality Issues</Label>
              </div>
              <Switch
                id="quality-issues"
                checked={settings.qualityIssues}
                onCheckedChange={(checked) => updateSetting('qualityIssues', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <Label htmlFor="urgent-orders">Urgent Orders</Label>
              </div>
              <Switch
                id="urgent-orders"
                checked={settings.urgentOrders}
                onCheckedChange={(checked) => updateSetting('urgentOrders', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" />
                <Label htmlFor="machine-downtime">Machine Downtime</Label>
              </div>
              <Switch
                id="machine-downtime"
                checked={settings.machineDowntime}
                onCheckedChange={(checked) => updateSetting('machineDowntime', checked)}
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Sound and Auto-close Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-700">Notification Behavior</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-green-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-500" />
                )}
                <Label htmlFor="sound-enabled">Sound Alerts</Label>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <Label htmlFor="auto-close">Auto-close Notifications</Label>
              </div>
              <Switch
                id="auto-close"
                checked={settings.autoClose}
                onCheckedChange={(checked) => updateSetting('autoClose', checked)}
                disabled={!settings.enabled}
              />
            </div>

            {settings.autoClose && (
              <div className="flex items-center justify-between pl-6">
                <Label htmlFor="auto-close-delay">Auto-close Delay (seconds)</Label>
                <select
                  id="auto-close-delay"
                  value={settings.autoCloseDelay / 1000}
                  onChange={(e) => updateSetting('autoCloseDelay', parseInt(e.target.value) * 1000)}
                  className="px-3 py-1 border rounded-md"
                  disabled={!settings.enabled}
                >
                  <option value="5">5 seconds</option>
                  <option value="8">8 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Test Notification */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="font-medium">Test Notification</p>
            <p className="text-sm text-gray-600">Send a test notification to verify settings</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
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
            }}
            disabled={!settings.enabled || permissionStatus !== 'granted'}
          >
            Send Test
          </Button>
        </div>

        {/* Close All Notifications */}
        {activeNotifications.current.size > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={closeAllNotifications}
            className="w-full"
          >
            Close All Active Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
}