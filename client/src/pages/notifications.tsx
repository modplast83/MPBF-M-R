import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Settings, Monitor } from "lucide-react";
import { DesktopNotifications } from "@/components/notifications/desktop-notifications";
import { useTranslation } from "react-i18next";

export default function NotificationsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Notification Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure your notification preferences and desktop alerts
          </p>
        </div>
      </div>

      {/* Desktop Notifications Card */}
      <div className="grid gap-6">
        <DesktopNotifications />
        
        {/* Additional Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Browser Requirements</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Desktop notifications require permission from your browser</li>
                  <li>• Make sure notifications are enabled in your browser settings</li>
                  <li>• For best results, keep this tab open while working</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Notification Types</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• <strong>Job Order Updates:</strong> Status changes, assignments, completions</li>
                  <li>• <strong>Production Alerts:</strong> Priority changes, bottlenecks, delays</li>
                  <li>• <strong>Quality Issues:</strong> Quality control failures, corrective actions</li>
                  <li>• <strong>Urgent Orders:</strong> High-priority orders requiring immediate attention</li>
                  <li>• <strong>Machine Downtime:</strong> Equipment failures, maintenance alerts</li>
                </ul>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-900 mb-2">Privacy & Security</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Notifications are shown only on your device</li>
                  <li>• No sensitive data is stored in browser notifications</li>
                  <li>• Settings are stored locally in your browser</li>
                  <li>• You can revoke notification permissions at any time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}