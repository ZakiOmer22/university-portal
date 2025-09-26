"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, CheckCircle, AlertCircle, Users, ClipboardList } from "lucide-react";
import EmployeeLayout from "@/components/employee/DashboardLayout";

// Interfaces
interface Task {
  id: string;
  title: string;
  deadline: string;
  status: "completed" | "in-progress" | "pending";
}

interface Notification {
  id: string;
  title: string;
  type: "info" | "warning" | "error";
  date: string;
  message: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  message: string;
}

// Dummy Data
const dummyTasks: Task[] = [
  { id: "t1", title: "Prepare monthly report", deadline: "2025-09-30", status: "in-progress" },
  { id: "t2", title: "Team meeting prep", deadline: "2025-09-26", status: "pending" },
  { id: "t3", title: "Update project documentation", deadline: "2025-09-28", status: "completed" },
];

const dummyNotifications: Notification[] = [
  { id: "n1", title: "Meeting Reminder", type: "info", date: "2025-09-25", message: "Team meeting at 10 AM in Conference Room A." },
  { id: "n2", title: "Deadline Approaching", type: "warning", date: "2025-09-25", message: "Prepare monthly report by 30th Sep." },
];

const dummyAnnouncements: Announcement[] = [
  { id: "a1", title: "New HR Policy", date: "2025-09-20", message: "Please review updated HR guidelines by next week." },
  { id: "a2", title: "Office Maintenance", date: "2025-09-22", message: "Server room maintenance from 2 PM - 5 PM." },
];

export default function EmployeeDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    setTimeout(() => {
      try {
        setTasks(dummyTasks);
        setNotifications(dummyNotifications);
        setAnnouncements(dummyAnnouncements);
        setLoading(false);
      } catch {
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    }, 1000);
  }, []);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status !== "completed").length;

  return (
      <div className="space-y-8 min-h-full p-4">
        {error && (
          <Alert variant="destructive" className="flex items-start gap-2 mb-6">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {loading ? (
          <>
            <Skeleton className="h-12 w-64 mb-6 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center shadow-sm">
                <Calendar className="mx-auto mb-3 text-blue-700" size={36} />
                <h3 className="font-semibold text-blue-900 mb-1">Total Tasks</h3>
                <p className="text-4xl font-bold">{totalTasks}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center shadow-sm">
                <CheckCircle className="mx-auto mb-3 text-green-700" size={36} />
                <h3 className="font-semibold text-green-900 mb-1">Completed</h3>
                <p className="text-4xl font-bold">{completedTasks}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center shadow-sm">
                <Calendar className="mx-auto mb-3 text-yellow-700" size={36} />
                <h3 className="font-semibold text-yellow-900 mb-1">Pending</h3>
                <p className="text-4xl font-bold">{pendingTasks}</p>
              </div>
            </div>

            {/* My Tasks */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">My Tasks</h2>
              {tasks.length === 0 ? (
                <p className="italic text-gray-600">No tasks assigned.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3">Task</th>
                        <th className="px-4 py-3">Deadline</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(({ id, title, deadline, status }) => (
                        <tr key={id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 py-3">{title}</td>
                          <td className="px-4 py-3">{new Date(deadline).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : status === "in-progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Notifications */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">Notifications</h2>
              {notifications.length === 0 ? (
                <p className="italic text-gray-600">No notifications.</p>
              ) : (
                <ul className="space-y-4">
                  {notifications.map(({ id, title, type, date, message }) => (
                    <li
                      key={id}
                      className={`border rounded-lg p-4 shadow-sm ${type === "info"
                          ? "bg-blue-50 border-blue-200"
                          : type === "warning"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-red-50 border-red-200"
                        }`}
                    >
                      <h3 className="font-semibold text-blue-900 mb-1">{title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{new Date(date).toLocaleDateString()}</p>
                      <p className="text-gray-700">{message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Announcements */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">Announcements</h2>
              {announcements.length === 0 ? (
                <p className="italic text-gray-600">No announcements.</p>
              ) : (
                <ul className="space-y-4">
                  {announcements.map(({ id, title, date, message }) => (
                    <li key={id} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{new Date(date).toLocaleDateString()}</p>
                      <p className="text-gray-700">{message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Recent Activities */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">Recent Activities</h2>
              <ul className="space-y-2">
                {tasks
                  .filter(t => t.status === "completed")
                  .map(t => (
                    <li key={t.id} className="p-3 bg-green-50 rounded-lg shadow-sm">
                      <ClipboardList className="inline mr-2 text-green-700" size={16} />
                      {t.title} - Completed on {new Date(t.deadline).toLocaleDateString()}
                    </li>
                  ))}
              </ul>
            </section>

            {/* Quick Actions */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-sm">
                  Submit Report
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-sm">
                  Request Leave
                </button>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg shadow-sm">
                  View Profile
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg shadow-sm">
                  Mark Task Done
                </button>
              </div>
            </section>
          </>
        )}
      </div>
  );
}
