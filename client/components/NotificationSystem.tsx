import { useState, useEffect } from "react";
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "request-submitted" | "request-approved" | "request-rejected" | "request-escalated" | "new-assignment" | "reminder";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedRequestId?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
}

export function NotificationSystem({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDismiss 
}: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "request-approved": return CheckCircle;
      case "request-rejected": return XCircle;
      case "request-escalated": return AlertTriangle;
      case "new-assignment": return Bell;
      case "reminder": return Info;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification["type"], priority: Notification["priority"]) => {
    if (priority === "urgent") return "border-red-200 bg-red-50";
    
    switch (type) {
      case "request-approved": return "border-green-200 bg-green-50";
      case "request-rejected": return "border-red-200 bg-red-50";
      case "request-escalated": return "border-orange-200 bg-orange-50";
      case "new-assignment": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onMarkAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.isRead && "bg-blue-50/50",
                      getNotificationColor(notification.type, notification.priority)
                    )}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        notification.priority === "urgent" ? "bg-red-100" :
                        notification.type === "request-approved" ? "bg-green-100" :
                        notification.type === "request-rejected" ? "bg-red-100" :
                        notification.type === "request-escalated" ? "bg-orange-100" :
                        "bg-blue-100"
                      )}>
                        <IconComponent className={cn(
                          "w-4 h-4",
                          notification.priority === "urgent" ? "text-red-600" :
                          notification.type === "request-approved" ? "text-green-600" :
                          notification.type === "request-rejected" ? "text-red-600" :
                          notification.type === "request-escalated" ? "text-orange-600" :
                          "text-blue-600"
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {notification.priority === "urgent" && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                Urgent
                              </Badge>
                            )}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          
                          {notification.actionRequired && (
                            <Badge variant="outline" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismiss(notification.id);
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Sample notifications data
export const sampleNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "new-assignment",
    title: "New Leave Request Assigned",
    message: "John Doe has submitted a vacation leave request for your approval.",
    timestamp: "2024-01-15T09:00:00Z",
    isRead: false,
    actionRequired: true,
    relatedRequestId: "REQ-001",
    priority: "medium"
  },
  {
    id: "notif-2",
    type: "request-escalated",
    title: "Request Escalated",
    message: "Benefits enrollment query from Maria Rodriguez has been escalated due to timeout.",
    timestamp: "2024-01-14T17:00:00Z",
    isRead: false,
    actionRequired: true,
    relatedRequestId: "REQ-003",
    priority: "urgent"
  },
  {
    id: "notif-3",
    type: "request-approved",
    title: "Access Card Request Approved",
    message: "Your office access card replacement request has been approved.",
    timestamp: "2024-01-13T10:30:00Z",
    isRead: true,
    relatedRequestId: "REQ-004",
    priority: "medium"
  },
  {
    id: "notif-4",
    type: "reminder",
    title: "Pending Approval Reminder",
    message: "You have 2 requests pending approval that require your attention.",
    timestamp: "2024-01-15T08:00:00Z",
    isRead: false,
    actionRequired: true,
    priority: "high"
  }
];
