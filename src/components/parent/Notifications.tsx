import React from "react";
import { Bell, CheckCircle, AlertCircle, Info, X, Clock } from "lucide-react";

interface Notification {
    id: string;
    message: string;
    type: "info" | "warning" | "success" | "urgent";
    timestamp: Date;
    read: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationsProps {
    notifications: Notification[];
    onMarkAsRead?: (id: string) => void;
    onDismiss?: (id: string) => void;
}

export default function Notifications({ 
    notifications, 
    onMarkAsRead, 
    onDismiss 
}: NotificationsProps) {
    const getNotificationConfig = (type: Notification["type"]) => {
        switch (type) {
            case "success":
                return {
                    icon: <CheckCircle size={18} className="text-green-500" />,
                    border: "border-l-green-400",
                    bg: "bg-green-50"
                };
            case "warning":
                return {
                    icon: <AlertCircle size={18} className="text-yellow-500" />,
                    border: "border-l-yellow-400",
                    bg: "bg-yellow-50"
                };
            case "urgent":
                return {
                    icon: <AlertCircle size={18} className="text-red-500" />,
                    border: "border-l-red-400",
                    bg: "bg-red-50"
                };
            default:
                return {
                    icon: <Info size={18} className="text-blue-500" />,
                    border: "border-l-blue-400",
                    bg: "bg-blue-50"
                };
        }
    };

    const formatTime = (timestamp: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return timestamp.toLocaleDateString();
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Bell className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                        <p className="text-gray-600 text-sm">Stay updated with important alerts</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-sm px-2 py-1 rounded-full">
                        {unreadCount} new
                    </span>
                )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No notifications</p>
                    <p className="text-sm text-gray-500 mt-1">You&apos;re all caught up!</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => {
                        const config = getNotificationConfig(notification.type);
                        
                        return (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-xl border-l-4 ${config.border} ${config.bg} border border-gray-200 hover:shadow-md transition-all duration-200 ${
                                    !notification.read ? "ring-2 ring-indigo-100" : ""
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {config.icon}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-relaxed ${
                                            notification.read ? "text-gray-700" : "text-gray-900 font-medium"
                                        }`}>
                                            {notification.message}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock size={12} />
                                                <span>{formatTime(notification.timestamp)}</span>
                                            </div>
                                            
                                            {!notification.read && (
                                                <button
                                                    onClick={() => onMarkAsRead?.(notification.id)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                            
                                            {notification.action && (
                                                <button
                                                    onClick={notification.action.onClick}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    {notification.action.label}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => onDismiss?.(notification.id)}
                                        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer Actions */}
            {notifications.length > 0 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => notifications.forEach(n => onMarkAsRead?.(n.id))}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Mark all as read
                    </button>
                    <span className="text-sm text-gray-500">
                        {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </span>
                </div>
            )}
        </div>
    );
}