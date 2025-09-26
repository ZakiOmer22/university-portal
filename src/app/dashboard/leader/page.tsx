"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  profilePicture?: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  currentGrade: number;
  nextAssignmentDue?: string;
  creditHours: number;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  courseId: string;
  status: "pending" | "completed" | "overdue";
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  message: string;
}

const dummyStudent: Student = {
  id: "stu-123",
  fullName: "John Doe",
  profilePicture: undefined,
};

const dummyCourses: Course[] = [
  {
    id: "c1",
    code: "CS101",
    name: "Computer Science 101",
    instructor: "Dr. Smith",
    currentGrade: 92,
    nextAssignmentDue: "2025-08-20",
    creditHours: 3,
  },
  {
    id: "c2",
    code: "MATH201",
    name: "Advanced Mathematics",
    instructor: "Prof. Jane",
    currentGrade: 87,
    nextAssignmentDue: "2025-08-22",
    creditHours: 4,
  },
];

const dummyAttendance: AttendanceSummary = {
  present: 28,
  absent: 2,
  late: 1,
  total: 31,
};

const dummyAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Project Proposal",
    dueDate: "2025-08-20",
    courseId: "c1",
    status: "pending",
  },
  {
    id: "a2",
    title: "Homework 5",
    dueDate: "2025-08-18",
    courseId: "c2",
    status: "completed",
  },
  {
    id: "a3",
    title: "Midterm Exam",
    dueDate: "2025-08-25",
    courseId: "c2",
    status: "pending",
  },
];

const dummyAnnouncements: Announcement[] = [
  {
    id: "n1",
    title: "Campus Closed on Friday",
    date: "2025-08-07",
    message: "Due to maintenance, campus will be closed this Friday.",
  },
  {
    id: "n2",
    title: "New Library Hours",
    date: "2025-08-01",
    message: "Library hours extended to 10 PM on weekdays.",
  },
];

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setTimeout(() => {
      try {
        setStudent(dummyStudent);
        setCourses(dummyCourses);
        setAttendance(dummyAttendance);
        setAssignments(dummyAssignments);
        setAnnouncements(dummyAnnouncements);
        setLoading(false);
      } catch {
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const attendancePercent = attendance
    ? ((attendance.present / attendance.total) * 100).toFixed(1)
    : "0";

  const gpa = courses.length
    ? (courses.reduce((acc, c) => acc + c.currentGrade, 0) / courses.length).toFixed(1)
    : "N/A";

  return (
    <DashboardLayout user={user} loading={loading}>
      <section className="p-6 bg-white rounded-lg shadow space-y-8">
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
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-indigo-900">Current GPA</h3>
                <p className="text-3xl font-bold">{gpa}%</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-blue-900">Total Credits</h3>
                <p className="text-3xl font-bold">
                  {courses.reduce((acc, c) => acc + c.creditHours, 0)}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-green-900">Attendance Rate</h3>
                <p className="text-3xl font-bold">{attendancePercent}%</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <h3 className="font-semibold text-yellow-900">Upcoming Assignments</h3>
                <p className="text-3xl font-bold">
                  {assignments.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
            {/* Courses List */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-3">Your Courses</h2>
              {courses.length === 0 ? (
                <p>No enrolled courses found.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-indigo-200 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {course.code} - {course.name}
                        </p>
                        <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Grade: {course.currentGrade.toFixed(1)}%</p>
                        {course.nextAssignmentDue && (
                          <p className="text-sm text-gray-600">
                            Next Due: {new Date(course.nextAssignmentDue).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Attendance Summary */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-3">Attendance Summary</h2>
              {attendance ? (
                <div className="flex gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex-1 text-center">
                    <CheckCircle2 className="mx-auto mb-1 text-green-600" size={30} />
                    <p className="font-semibold text-green-900">{attendance.present} Present</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex-1 text-center">
                    <XCircle className="mx-auto mb-1 text-red-600" size={30} />
                    <p className="font-semibold text-red-900">{attendance.absent} Absent</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex-1 text-center">
                    <Clock className="mx-auto mb-1 text-yellow-600" size={30} />
                    <p className="font-semibold text-yellow-900">{attendance.late} Late</p>
                  </div>
                </div>
              ) : (
                <p>No attendance data available.</p>
              )}
            </section>

            {/* Assignments */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-3">Upcoming Assignments</h2>
              {assignments.length === 0 ? (
                <p>No assignments found.</p>
              ) : (
                <ul className="space-y-3">
                  {assignments.map((a) => (
                    <li
                      key={a.id}
                      className={`border rounded-lg p-3 ${a.status === "overdue"
                          ? "border-red-400 bg-red-50"
                          : a.status === "completed"
                            ? "border-green-400 bg-green-50"
                            : "border-yellow-400 bg-yellow-50"
                        }`}
                    >
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(a.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        Status:{" "}
                        <Badge
                          className={
                            a.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : a.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </Badge>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Announcements */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-3">Announcements</h2>
              {announcements.length === 0 ? (
                <p>No announcements found.</p>
              ) : (
                <ul className="space-y-3">
                  {announcements.map((n) => (
                    <li
                      key={n.id}
                      className="border rounded-lg p-3 bg-indigo-50 border-indigo-200"
                    >
                      <p className="font-semibold">{n.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(n.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">{n.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
