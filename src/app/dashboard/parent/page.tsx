"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { FiFileText, FiMessageCircle, FiTrendingUp, FiCalendar, FiDollarSign } from "react-icons/fi";
import AttendanceTrendsChart from "@/components/parent/AttendanceChart";
import GpaTrendsChart from "@/components/parent/GpaTrendsChart";
import UpcomingEvents from "@/components/parent/UpcomingEvents";
import PaymentHistory from "@/components/parent/PaymentHistory";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface ChildData {
  id: string;
  name: string;
  grade: string;
  gpa: number;
  attendancePercent: number;
  reportsAvailable: number;
  status: "Good" | "Warning" | "At Risk";
}

interface Notification {
  id: string;
  message: string;
  type: "info" | "warning" | "alert";
  date: Date;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "alert" | "meeting" | "deadline";
}

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const gpaData = [
    { semester: "Fall 2024", "Ayaan Omer": 3.7, "Layla Omer": 3.4 },
    { semester: "Spring 2025", "Ayaan Omer": 3.8, "Layla Omer": 3.6 },
    { semester: "Fall 2025", "Ayaan Omer": 3.9, "Layla Omer": 3.7 },
  ];

  const attendanceData = [
    { semester: "Fall 2024", "Ayaan Omer": 95, "Layla Omer": 88 },
    { semester: "Spring 2025", "Ayaan Omer": 96, "Layla Omer": 89 },
    { semester: "Fall 2025", "Ayaan Omer": 97, "Layla Omer": 91 },
  ];

  const events: Event[] = [
    {
      id: "e1",
      title: "Parent-Teacher Meeting",
      description: "Discuss your child's progress and upcoming goals.",
      date: new Date("2025-08-10T10:00:00"),
      type: "meeting",
    },
    {
      id: "e2",
      title: "Fee Payment Deadline",
      description: "Last date to pay tuition fees for Fall semester.",
      date: new Date("2025-08-15T23:59:59"),
      type: "deadline",
    },
    {
      id: "e3",
      title: "School Closed - Holiday",
      description: "School will be closed on this day due to public holiday.",
      date: new Date("2025-08-20T00:00:00"),
      type: "alert",
    },
  ];

  interface Payment {
    id: string;
    date: Date;
    amount: number;
    method: string;
    status: "Completed" | "Pending" | "Failed";
  }

  const payments: Payment[] = [
    {
      id: "p1",
      date: new Date("2025-07-15"),
      amount: 250.0,
      method: "Credit Card",
      status: "Completed",
    },
    {
      id: "p2",
      date: new Date("2025-06-15"),
      amount: 250.0,
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: "p3",
      date: new Date("2025-05-15"),
      amount: 250.0,
      method: "Credit Card",
      status: "Pending",
    },
  ];

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    } catch (err) {
      setUser(null);
      console.error("Error parsing user data from localStorage", err);
    }

    // Simulate API fetch delay
    setTimeout(() => {
      setChildren([
        {
          id: "1",
          name: "Ayaan Omer",
          grade: "Grade 8",
          gpa: 3.8,
          attendancePercent: 96,
          reportsAvailable: 5,
          status: "Good",
        },
        {
          id: "2",
          name: "Layla Omer",
          grade: "Grade 5",
          gpa: 3.6,
          attendancePercent: 89,
          reportsAvailable: 3,
          status: "Warning",
        },
      ]);

      setNotifications([
        {
          id: "n1",
          message: "📅 Parent-teacher meeting scheduled for next week.",
          type: "info",
          date: new Date("2025-08-10T10:00:00"),
        },
        {
          id: "n2",
          message: "📄 New academic calendar uploaded.",
          type: "info",
          date: new Date("2025-08-01T09:30:00"),
        },
        {
          id: "n3",
          message: "💳 Payment receipt available for review.",
          type: "alert",
          date: new Date("2025-08-04T16:45:00"),
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  // Calculate summary statistics
  const totalChildren = children.length;
  const averageGPA = children.reduce((acc, child) => acc + child.gpa, 0) / totalChildren;
  const averageAttendance = children.reduce((acc, child) => acc + child.attendancePercent, 0) / totalChildren;
  const totalReports = children.reduce((acc, child) => acc + child.reportsAvailable, 0);

  if (loading) {
    return (
      <DashboardLayout user={user} loading={true}>
        <div></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} loading={false}>
      {isPending && (
        <div
          aria-live="assertive"
          className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50"
        >
          <svg
            className="animate-spin h-12 w-12 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      
      {children.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm border border-gray-200/60">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Children Found</h3>
            <p className="text-gray-600">Please contact the school administration to add your children to the system.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-3xl font-bold text-gray-900">{totalChildren}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <FiTrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg GPA</p>
                  <p className="text-3xl font-bold text-gray-900">{averageGPA.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <FiTrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                  <p className="text-3xl font-bold text-gray-900">{averageAttendance.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FiCalendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FiFileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Children Cards & Academic Summary */}
            <div className="xl:col-span-2 space-y-8">
              {/* Children Cards */}
              <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Children</h2>
                  <span className="text-sm text-gray-500">{totalChildren} student{totalChildren !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {children.map((child) => (
                    <article
                      key={child.id}
                      tabIndex={0}
                      onClick={() => {
                        startTransition(() => {
                          router.push(`/dashboard/parent/child/${child.id}`);
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          startTransition(() => {
                            router.push(`/dashboard/parent/child/${child.id}`);
                          });
                        }
                      }}
                      className="bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/60 rounded-xl p-6 
                      hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 
                      transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{child.name}</h3>
                          <p className="text-gray-600 font-medium">{child.grade}</p>
                        </div>
                        <StatusBadge status={child.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{child.gpa.toFixed(1)}</div>
                          <div className="text-blue-600 text-xs">GPA</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{child.attendancePercent}%</div>
                          <div className="text-green-600 text-xs">Attendance</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg 
                          hover:bg-indigo-700 transition-colors text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view reports
                          }}
                        >
                          <FiFileText className="text-sm" />
                          Reports
                        </button>
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg 
                          hover:bg-green-700 transition-colors text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle message teacher
                          }}
                        >
                          <FiMessageCircle className="text-sm" />
                          Message
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/60 p-6">
                  <GpaTrendsChart data={gpaData} childrenNames={children.map(c => c.name)} />
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/60 p-6">
                  <AttendanceTrendsChart data={attendanceData} childrenNames={children.map(c => c.name)} />
                </div>
              </div>

              {/* Academic Summary */}
              <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/60 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Academic Summary</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Child</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">GPA</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Attendance</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Reports</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {children.map((child) => (
                        <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900">{child.name}</td>
                          <td className="py-3 px-4 text-gray-600">{child.grade}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900">{child.gpa.toFixed(1)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900">{child.attendancePercent}%</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900">{child.reportsAvailable}</span>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={child.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column - Notifications, Events, Payments */}
            <div className="space-y-8">
              {/* Notifications */}
              <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/60 p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Notifications</h2>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No new notifications</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map(({ id, message, type, date }) => (
                      <div
                        key={id}
                        className={`p-4 rounded-xl border-l-4 ${
                          type === "info"
                            ? "border-blue-500 bg-blue-50/50"
                            : type === "warning"
                            ? "border-yellow-500 bg-yellow-50/50"
                            : "border-red-500 bg-red-50/50"
                        }`}
                      >
                        <p className="text-sm text-gray-700">{message}</p>
                        <time className="text-xs text-gray-500 mt-2 block">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </time>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Upcoming Events */}
              <UpcomingEvents events={events} />

              {/* Payment History */}
              <PaymentHistory payments={payments} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: "Good" | "Warning" | "At Risk" }) {
  const getStatusConfig = () => {
    switch (status) {
      case "Good":
        return {
          className: "bg-green-100 text-green-800 border-green-200",
          tooltip: "Good standing: Keep up the great work!",
          icon: "✅"
        };
      case "Warning":
        return {
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          tooltip: "Warning: Some areas need attention.",
          icon: "⚠️"
        };
      case "At Risk":
        return {
          className: "bg-red-100 text-red-800 border-red-200",
          tooltip: "At Risk: Immediate action recommended.",
          icon: "🔴"
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span 
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
      title={config.tooltip}
    >
      <span>{config.icon}</span>
      {status}
    </span>
  );
}