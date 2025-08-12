"use client";

import { useState, useEffect } from "react";

interface Notification {
    id: string;
    title: string;
    description: string;
    timestamp: string; // ISO string
    read: boolean;
    type: "info" | "warning" | "error" | "success";
}

const STATUS_COLORS: Record<string, string> = {
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
};

const ITEMS_PER_PAGE = 5;

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Load sample notifications on mount
    useEffect(() => {
        const sampleNotifications: Notification[] = [
            {
                id: "1",
                title: "Server Restarted",
                description: "The web server was restarted successfully.",
                timestamp: new Date(Date.now() - 600000).toISOString(),
                read: false,
                type: "success",
            },
            {
                id: "2",
                title: "High CPU Usage",
                description: "Database server CPU usage exceeded 90%.",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                read: false,
                type: "warning",
            },
            {
                id: "3",
                title: "New User Registered",
                description: "A new user signed up: john.doe@example.com",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                read: true,
                type: "info",
            },
            {
                id: "4",
                title: "Backup Failed",
                description: "Nightly backup failed due to disk space issues.",
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                read: false,
                type: "error",
            },
            {
                id: "5",
                title: "Password Changed",
                description: "User jane.smith changed their password.",
                timestamp: new Date(Date.now() - 14400000).toISOString(),
                read: true,
                type: "success",
            },
            {
                id: "6",
                title: "Scheduled Maintenance",
                description: "Scheduled maintenance will start tomorrow at 1 AM.",
                timestamp: new Date(Date.now() - 18000000).toISOString(),
                read: false,
                type: "info",
            },
            // add more if needed to test pagination
        ];
        setNotifications(sampleNotifications);
        setLoading(false);
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentNotifications = notifications.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    function markAsRead(id: string) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }

    function markAsUnread(id: string) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: false } : n))
        );
    }

    function deleteNotification(id: string) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        // If deleting last item on page and page > 1, move back a page
        if (
            currentNotifications.length === 1 &&
            currentPage > 1
        ) {
            setCurrentPage(currentPage - 1);
        }
    }

    function markAllRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    function clearAll() {
        setNotifications([]);
        setCurrentPage(1);
    }

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-indigo-700 text-lg">
                Loading notifications...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-indigo-900">Notifications</h1>
                <div className="space-x-3">
                    <button
                        onClick={markAllRead}
                        disabled={notifications.length === 0}
                        className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300"
                        aria-label="Mark all notifications as read"
                    >
                        Mark All Read
                    </button>
                    <button
                        onClick={clearAll}
                        disabled={notifications.length === 0}
                        className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-red-300"
                        aria-label="Clear all notifications"
                    >
                        Clear All
                    </button>
                </div>
            </header>

            {notifications.length === 0 ? (
                <p className="text-center text-gray-600 text-lg mt-20">
                    No notifications to show.
                </p>
            ) : (
                <>
                    <ul
                        role="list"
                        className="flex flex-col space-y-3 flex-grow overflow-auto"
                    >
                        {currentNotifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={`flex justify-between items-start space-x-4 p-4 rounded-lg border ${notification.read
                                        ? "bg-white border-gray-300"
                                        : "bg-indigo-100 border-indigo-500"
                                    } shadow-sm`}
                                tabIndex={0}
                                aria-label={`Notification: ${notification.title}`}
                            >
                                <div className="flex-1">
                                    <div
                                        className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-1 ${STATUS_COLORS[notification.type]
                                            }`}
                                        aria-label={`Notification type: ${notification.type}`}
                                    >
                                        {notification.type.toUpperCase()}
                                    </div>
                                    <h2 className="text-lg font-semibold text-indigo-900">
                                        {notification.title}
                                    </h2>
                                    <p className="text-gray-700">{notification.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    {notification.read ? (
                                        <button
                                            onClick={() => markAsUnread(notification.id)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                                            aria-label="Mark as unread"
                                            title="Mark as unread"
                                        >
                                            Mark Unread
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                                            aria-label="Mark as read"
                                            title="Mark as read"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                        aria-label="Delete notification"
                                        title="Delete notification"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination controls */}
                    <nav
                        aria-label="Pagination"
                        className="mt-6 flex justify-center space-x-2 select-none"
                    >
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-indigo-100 disabled:opacity-50"
                            aria-label="Previous page"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                aria-current={currentPage === page ? "page" : undefined}
                                className={`px-3 py-1 rounded border border-gray-300 hover:bg-indigo-100 ${currentPage === page
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-gray-700"
                                    }`}
                                aria-label={`Page ${page}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-indigo-100 disabled:opacity-50"
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </nav>
                </>
            )}
        </div>
    );
}
