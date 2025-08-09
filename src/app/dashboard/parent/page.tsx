"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "@/components/parent/ProfileHeader";
import Notifications from "@/components/parent/Notifications";
import QuickLinks from "@/components/parent/QuickLinks";
import DashboardSkeleton from "@/components/parent/DashboardSkeleton";
import { FiFileText, FiMessageCircle, FiEye } from "react-icons/fi";
import AttendanceTrendsChart from "@/components/parent/AttendanceChart";
import GpaTrendsChart from "@/components/parent/GpaTrendsChart";
import UpcomingEvents from "@/components/parent/UpcomingEvents";
import HomeworkSummary from "@/components/parent/HomeworkSummary";
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

// Add the Event interface with the correct union type for `type`
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

  const childrenNames = ["Ayaan Omer", "Layla Omer"];

  const attendanceData = [
    { semester: "Fall 2024", "Ayaan Omer": 95, "Layla Omer": 88 },
    { semester: "Spring 2025", "Ayaan Omer": 96, "Layla Omer": 89 },
    { semester: "Fall 2025", "Ayaan Omer": 97, "Layla Omer": 91 },
  ];

  // Explicitly typed events array using the Event interface
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
    status: "Completed" | "Pending" | "Failed";  // exact literal union here
  }

  const payments: Payment[] = [
    {
      id: "p1",
      date: new Date("2025-07-15"),
      amount: 250.0,
      method: "Credit Card",
      status: "Completed", // exactly one of the three strings
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
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

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

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Parent Dashboard</h1>
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
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <ProfileHeader user={user} />

          {/* QuickLinks top right, horizontal layout */}
          <div className=" mt-4">
            <QuickLinks />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Children Cards */}
            <section
              className="col-span-2"
              aria-label="Children cards with academic details and actions"
            >
              <h2 className="text-xl font-semibold mb-4 text-indigo-900">Your Children</h2>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
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
                    aria-label={`${child.name}, ${child.grade}, GPA ${child.gpa.toFixed(
                      2
                    )}, attendance ${child.attendancePercent} percent, status ${child.status}`}
                    className="bg-white border border-indigo-300 rounded-lg p-5 shadow-sm
                    flex flex-col justify-between hover:shadow-lg focus:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  >
                    <header>
                      <h3 className="text-2xl font-bold text-indigo-900 mb-1">{child.name}</h3>
                      <p className="text-indigo-700 font-semibold">{child.grade}</p>
                    </header>

                    <section className="mt-4 flex flex-wrap gap-4 text-gray-700 text-sm">
                      <div>
                        <span className="font-semibold">GPA:</span> {child.gpa.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-semibold">Attendance:</span> {child.attendancePercent}%
                      </div>
                      <div>
                        <span className="font-semibold">Reports:</span> {child.reportsAvailable}
                      </div>
                      <div>
                        <StatusBadge status={child.status} />
                      </div>
                    </section>

                    <footer className="mt-6 flex gap-3 flex-wrap">
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                        aria-label={`View reports for ${child.name}`}
                      >
                        <FiFileText />
                        View Reports
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        aria-label={`Message teacher regarding ${child.name}`}
                      >
                        <FiMessageCircle />
                        Message Teacher
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                        aria-label={`View profile for ${child.name}`}
                      >
                        <FiEye />
                        View Profile
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            </section>

            {/* Notifications */}
            <section
              className="bg-white rounded-lg shadow p-4 max-h-[600px] overflow-auto"
              aria-label="Your notifications"
            >
              <h2 className="text-xl font-semibold mb-4 text-indigo-900">Notifications</h2>
              {notifications.length === 0 ? (
                <p className="text-gray-600 italic">No new notifications.</p>
              ) : (
                <ul className="space-y-3">
                  {notifications.map(({ id, message, type, date }) => (
                    <li
                      key={id}
                      className={`p-3 rounded-md border-l-4 ${type === "info"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : type === "warning"
                          ? "border-yellow-400 bg-yellow-50 text-yellow-800"
                          : "border-red-500 bg-red-50 text-red-700"
                        } focus:outline-none focus:ring-2 focus:ring-offset-1 ${type === "info"
                          ? "focus:ring-indigo-500"
                          : type === "warning"
                            ? "focus:ring-yellow-400"
                            : "focus:ring-red-500"
                        }`}
                      tabIndex={0}
                      aria-label={`${message}, notification type ${type}`}
                    >
                      <p>{message}</p>
                      <time
                        dateTime={date.toISOString()}
                        className="block text-xs text-gray-500 mt-1"
                        aria-label={`Date: ${date.toLocaleDateString()} Time: ${date.toLocaleTimeString()}`}
                      >
                        {date.toLocaleDateString()}{" "}
                        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Academic Summary Table */}
          <section
            className="bg-white rounded-lg shadow mt-10 p-6 overflow-x-auto"
            aria-label="Academic summary table"
          >
            <h2 className="text-2xl font-bold mb-6 text-indigo-900">Academic Summary</h2>
            <table className="w-full table-auto border-collapse border border-indigo-300 rounded-md text-left">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border border-indigo-300 px-4 py-2">Child</th>
                  <th className="border border-indigo-300 px-4 py-2">Grade</th>
                  <th className="border border-indigo-300 px-4 py-2">GPA</th>
                  <th className="border border-indigo-300 px-4 py-2">Attendance %</th>
                  <th className="border border-indigo-300 px-4 py-2">Reports Available</th>
                  <th className="border border-indigo-300 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {children.map((child) => (
                  <tr
                    key={child.id}
                    tabIndex={0}
                    aria-label={`${child.name} academic summary`}
                    className="hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <td className="border border-indigo-300 px-4 py-2 font-semibold text-indigo-800">
                      {child.name}
                    </td>
                    <td className="border border-indigo-300 px-4 py-2">{child.grade}</td>
                    <td className="border border-indigo-300 px-4 py-2">{child.gpa.toFixed(2)}</td>
                    <td className="border border-indigo-300 px-4 py-2">{child.attendancePercent}%</td>
                    <td className="border border-indigo-300 px-4 py-2">{child.reportsAvailable}</td>
                    <td className="border border-indigo-300 px-4 py-2">
                      <StatusBadge status={child.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <div className="p-6 max-w-7xl mx-auto min-h-screen">
            {/* Container for the two charts side by side */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <GpaTrendsChart data={gpaData} childrenNames={childrenNames} />
              </div>

              <div className="flex-1 bg-white rounded-lg shadow p-4">
                <AttendanceTrendsChart data={attendanceData} childrenNames={childrenNames} />
              </div>
            </div>

            <UpcomingEvents events={events} />

            <PaymentHistory payments={payments} />
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "Good" | "Warning" | "At Risk" }) {
  let className = "inline-block px-2 py-0.5 rounded-full text-xs font-semibold select-none ";
  let tooltipText = "";

  if (status === "Good") {
    className += "bg-green-100 text-green-800";
    tooltipText = "Good standing: Keep up the great work!";
  } else if (status === "Warning") {
    className += "bg-yellow-100 text-yellow-800";
    tooltipText = "Warning: Some areas need attention.";
  } else {
    className += "bg-red-100 text-red-800";
    tooltipText = "At Risk: Immediate action recommended.";
  }

  return (
    <span className={className} title={tooltipText} tabIndex={0} aria-label={tooltipText}>
      {status}
    </span>
  );
}
