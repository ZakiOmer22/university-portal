"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  Activity,
  FileChartPie,
  Settings,
  UserCheck,
  UserPlus,
  AlertCircle,
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "active" | "inactive" | "pending";
  lastLogin: string;
}

interface SystemReport {
  id: string;
  title: string;
  generatedOn: string;
  summary: string;
}

interface Notification {
  id: string;
  title: string;
  type: "info" | "warning" | "error";
  date: string;
  message: string;
}

const dummyUserAccounts: UserAccount[] = [
  {
    id: "u1",
    name: "Alice Morgan",
    email: "alice@example.com",
    role: "teacher",
    status: "active",
    lastLogin: "2025-08-09T14:25:00Z",
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "student",
    status: "pending",
    lastLogin: "2025-07-30T09:15:00Z",
  },
  {
    id: "u3",
    name: "Charlie Rose",
    email: "charlie@example.com",
    role: "teacher",
    status: "inactive",
    lastLogin: "2025-07-01T16:42:00Z",
  },
];

const dummyReports: SystemReport[] = [
  {
    id: "r1",
    title: "Monthly User Activity",
    generatedOn: "2025-08-01",
    summary: "Shows user engagement metrics for July 2025.",
  },
  {
    id: "r2",
    title: "System Uptime",
    generatedOn: "2025-08-05",
    summary: "Reports uptime and downtime for August 2025.",
  },
];

const dummyNotifications: Notification[] = [
  {
    id: "n1",
    title: "Scheduled Maintenance",
    type: "info",
    date: "2025-08-10",
    message: "System maintenance scheduled for Aug 15 from 1 AM to 3 AM.",
  },
  {
    id: "n2",
    title: "New User Registration Pending Approval",
    type: "warning",
    date: "2025-08-09",
    message: "There are 5 new user accounts awaiting approval.",
  },
  {
    id: "n3",
    title: "Database Error Detected",
    type: "error",
    date: "2025-08-08",
    message: "An error occurred during last night’s backup process.",
  },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [reports, setReports] = useState<SystemReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      try {
        setUserAccounts(dummyUserAccounts);
        setReports(dummyReports);
        setNotifications(dummyNotifications);
        setLoading(false);
      } catch {
        setError("Failed to load admin dashboard data.");
        setLoading(false);
      }
    }, 1000);
  }, []);

  // Calculate some stats
  const totalUsers = userAccounts.length;
  const activeUsers = userAccounts.filter((u) => u.status === "active").length;
  const pendingUsers = userAccounts.filter((u) => u.status === "pending").length;

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50 space-y-8">
      {error && (
        <Alert variant="destructive" className="flex items-start gap-2">
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
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-lg" />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center shadow-sm">
              <Users className="mx-auto mb-3 text-blue-600" size={36} />
              <h3 className="font-semibold text-blue-800 mb-1">Total Users</h3>
              <p className="text-4xl font-bold">{totalUsers}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center shadow-sm">
              <UserCheck className="mx-auto mb-3 text-green-700" size={36} />
              <h3 className="font-semibold text-green-900 mb-1">Active Users</h3>
              <p className="text-4xl font-bold">{activeUsers}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center shadow-sm">
              <UserPlus className="mx-auto mb-3 text-yellow-700" size={36} />
              <h3 className="font-semibold text-yellow-900 mb-1">Pending Approvals</h3>
              <p className="text-4xl font-bold">{pendingUsers}</p>
            </div>
          </div>

          {/* User Accounts Table */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">User Accounts</h2>
            {userAccounts.length === 0 ? (
              <p className="italic text-gray-600">No user accounts found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAccounts.map(({ id, name, email, role, status, lastLogin }) => (
                      <tr
                        key={id}
                        className="border-b hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3">{name}</td>
                        <td className="px-4 py-3 lowercase">{email}</td>
                        <td className="px-4 py-3 capitalize">{role}</td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              status === "active"
                                ? "bg-green-100 text-green-800"
                                : status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-600"
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(lastLogin).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* System Reports */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">System Reports</h2>
            {reports.length === 0 ? (
              <p className="italic text-gray-600">No reports available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map(({ id, title, generatedOn, summary }) => (
                  <div
                    key={id}
                    className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FileChartPie className="text-indigo-600" size={24} />
                      <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Generated On:{" "}
                      {new Date(generatedOn).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-700">{summary}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="italic text-gray-600">No notifications.</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map(({ id, title, type, date, message }) => (
                  <li
                    key={id}
                    className={`border rounded-lg p-4 shadow-sm ${type === "info"
                        ? "bg-blue-50 border-blue-300"
                        : type === "warning"
                          ? "bg-yellow-50 border-yellow-300"
                          : "bg-red-50 border-red-300"
                      }`}
                  >
                    <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">{message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
