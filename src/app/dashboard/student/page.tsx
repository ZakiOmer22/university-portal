"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Clock, BookOpen, Calendar, Bell, TrendingUp, Users, FileText } from "lucide-react";

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

// Dummy data (replace with real API fetch)
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
    // Simulate user & data load
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

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "overdue":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <DashboardLayout user={user} loading={loading}>
      <div className="space-y-8">
        {error && (
          <Alert variant="destructive" className="flex items-start gap-2 border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
            <div>
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {loading ? (
          <>
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Enhanced Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-6 h-6 text-indigo-200" />
                  <div className="text-indigo-200 text-sm font-medium">GPA</div>
                </div>
                <div className="text-3xl font-bold mb-1">{gpa}%</div>
                <div className="text-indigo-200 text-sm">Current Average</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="w-6 h-6 text-blue-200" />
                  <div className="text-blue-200 text-sm font-medium">Credits</div>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {courses.reduce((acc, c) => acc + c.creditHours, 0)}
                </div>
                <div className="text-blue-200 text-sm">Total Enrolled</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-6 h-6 text-green-200" />
                  <div className="text-green-200 text-sm font-medium">Attendance</div>
                </div>
                <div className="text-3xl font-bold mb-1">{attendancePercent}%</div>
                <div className="text-green-200 text-sm">Present Rate</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-6 h-6 text-amber-200" />
                  <div className="text-amber-200 text-sm font-medium">Assignments</div>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {assignments.filter((a) => a.status === "pending").length}
                </div>
                <div className="text-amber-200 text-sm">Upcoming</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Courses & Assignments */}
              <div className="lg:col-span-2 space-y-8">
                {/* Enhanced Courses List */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Your Courses
                    </h2>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                      {courses.length} Enrolled
                    </Badge>
                  </div>
                  
                  {courses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No enrolled courses found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all duration-200 hover:shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-sm font-medium">
                                  {course.code}
                                </div>
                                <h3 className="font-semibold text-gray-900">{course.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`font-semibold ${getGradeColor(course.currentGrade)}`}>
                                  Grade: {course.currentGrade.toFixed(1)}%
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600">{course.creditHours} Credits</span>
                              </div>
                            </div>
                            {course.nextAssignmentDue && (
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                  <Calendar className="w-4 h-4" />
                                  Due:
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(course.nextAssignmentDue).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Enhanced Assignments */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      Upcoming Assignments
                    </h2>
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                      {assignments.filter(a => a.status === "pending").length} Pending
                    </Badge>
                  </div>
                  
                  {assignments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No assignments found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assignments.map((a) => (
                        <div
                          key={a.id}
                          className={`border rounded-xl p-4 transition-all duration-200 ${
                            a.status === "overdue"
                              ? "border-red-200 bg-red-50 hover:border-red-300"
                              : a.status === "completed"
                                ? "border-green-200 bg-green-50 hover:border-green-300"
                                : "border-amber-200 bg-amber-50 hover:border-amber-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(a.status)}
                              <div>
                                <p className="font-semibold text-gray-900">{a.title}</p>
                                <p className="text-sm text-gray-600">
                                  Due: {new Date(a.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={
                                a.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : a.status === "overdue"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : "bg-amber-100 text-amber-800 border-amber-200"
                              }
                            >
                              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Attendance & Announcements */}
              <div className="space-y-8">
                {/* Enhanced Attendance Summary */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-green-600" />
                    Attendance Summary
                  </h2>
                  
                  {attendance ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white text-center">
                        <div className="text-2xl font-bold mb-1">{attendancePercent}%</div>
                        <div className="text-green-100 text-sm">Overall Attendance Rate</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                          <CheckCircle2 className="mx-auto mb-2 text-green-600 w-5 h-5" />
                          <div className="text-lg font-bold text-green-900">{attendance.present}</div>
                          <div className="text-xs text-green-700">Present</div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                          <XCircle className="mx-auto mb-2 text-red-600 w-5 h-5" />
                          <div className="text-lg font-bold text-red-900">{attendance.absent}</div>
                          <div className="text-xs text-red-700">Absent</div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                          <Clock className="mx-auto mb-2 text-yellow-600 w-5 h-5" />
                          <div className="text-lg font-bold text-yellow-900">{attendance.late}</div>
                          <div className="text-xs text-yellow-700">Late</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No attendance data available.</p>
                    </div>
                  )}
                </section>

                {/* Enhanced Announcements */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-indigo-600" />
                      Announcements
                    </h2>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                      {announcements.length} New
                    </Badge>
                  </div>
                  
                  {announcements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No announcements found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((n) => (
                        <div
                          key={n.id}
                          className="border border-indigo-100 rounded-xl p-4 bg-indigo-50/50 hover:bg-indigo-50 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{n.title}</h3>
                            <div className="text-xs text-indigo-600 bg-white px-2 py-1 rounded-full border border-indigo-200">
                              {new Date(n.date).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}