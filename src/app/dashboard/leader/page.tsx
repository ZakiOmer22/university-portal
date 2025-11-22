"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Clock, BookOpen, Users, Calendar, TrendingUp } from "lucide-react";

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
  courseName: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  message: string;
  type: "info" | "warning" | "urgent";
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
  {
    id: "c3",
    code: "PHY301",
    name: "Physics Laboratory",
    instructor: "Dr. Brown",
    currentGrade: 95,
    nextAssignmentDue: "2025-08-25",
    creditHours: 2,
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
    courseName: "Computer Science 101",
    status: "pending",
  },
  {
    id: "a2",
    title: "Homework 5",
    dueDate: "2025-08-18",
    courseId: "c2",
    courseName: "Advanced Mathematics",
    status: "completed",
  },
  {
    id: "a3",
    title: "Midterm Exam",
    dueDate: "2025-08-25",
    courseId: "c2",
    courseName: "Advanced Mathematics",
    status: "pending",
  },
  {
    id: "a4",
    title: "Lab Report 3",
    dueDate: "2025-08-15",
    courseId: "c3",
    courseName: "Physics Laboratory",
    status: "overdue",
  },
];

const dummyAnnouncements: Announcement[] = [
  {
    id: "n1",
    title: "Campus Closed on Friday",
    date: "2025-08-07",
    message: "Due to maintenance, campus will be closed this Friday. All classes will be held online.",
    type: "warning"
  },
  {
    id: "n2",
    title: "New Library Hours",
    date: "2025-08-01",
    message: "Library hours extended to 10 PM on weekdays. Study rooms available for booking.",
    type: "info"
  },
  {
    id: "n3",
    title: "Important: Final Exam Schedule",
    date: "2025-08-05",
    message: "Final exam schedule has been posted. Check your student portal for details.",
    type: "urgent"
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Simulate progressive loading
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 20;
      });
    }, 240);

    const loadData = async () => {
      try {
        // Simulate API calls with different loading times
        await new Promise(resolve => setTimeout(resolve, 600));
        setStudent(dummyStudent);
        
        await new Promise(resolve => setTimeout(resolve, 400));
        setCourses(dummyCourses);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        setAttendance(dummyAttendance);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setAssignments(dummyAssignments);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        setAnnouncements(dummyAnnouncements);
        
        setLoading(false);
        clearInterval(timer);
      } catch {
        setError("Failed to load dashboard data. Please try refreshing the page.");
        setLoading(false);
        clearInterval(timer);
      }
    };

    loadData();

    return () => clearInterval(timer);
  }, []);

  const attendancePercent = attendance
    ? ((attendance.present / attendance.total) * 100).toFixed(1)
    : "0";

  const gpa = courses.length
    ? (courses.reduce((acc, c) => acc + c.currentGrade, 0) / courses.length).toFixed(1)
    : "N/A";

  const pendingAssignments = assignments.filter(a => a.status === "pending").length;
  const overdueAssignments = assignments.filter(a => a.status === "overdue").length;

  // Loading Skeleton Components
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-16 mt-2" />
      <Skeleton className="h-4 w-32 mt-2" />
    </div>
  );

  const CourseCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <div className="flex justify-between mt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );

  const AssignmentCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );

  const AnnouncementCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );

  return (
    <DashboardLayout user={user} loading={loading}>
      <div className="space-y-8">
        {error && (
          <Alert variant="destructive" className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <AlertTitle>Error Loading Dashboard</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {loading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Analytics Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-100">Current GPA</h3>
                    <TrendingUp className="h-6 w-6 text-blue-200" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{gpa}%</p>
                  <p className="text-blue-100 text-sm mt-1">Outstanding Performance</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-green-100">Attendance Rate</h3>
                    <Users className="h-6 w-6 text-green-200" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{attendancePercent}%</p>
                  <p className="text-green-100 text-sm mt-1">{attendance?.present} of {attendance?.total} classes</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-purple-100">Active Courses</h3>
                    <BookOpen className="h-6 w-6 text-purple-200" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{courses.length}</p>
                  <p className="text-purple-100 text-sm mt-1">
                    {courses.reduce((acc, c) => acc + c.creditHours, 0)} total credits
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-orange-100">Assignments Due</h3>
                    <Calendar className="h-6 w-6 text-orange-200" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{pendingAssignments}</p>
                  <p className="text-orange-100 text-sm mt-1">
                    {overdueAssignments > 0 ? `${overdueAssignments} overdue` : 'All caught up'}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Courses List */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {courses.length} Enrolled
                </Badge>
              </div>
              {loading ? (
                <div className="space-y-4">
                  <CourseCardSkeleton />
                  <CourseCardSkeleton />
                  <CourseCardSkeleton />
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No enrolled courses found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {course.code} - {course.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">Instructor: {course.instructor}</p>
                        </div>
                        <Badge 
                          className={
                            course.currentGrade >= 90 ? "bg-green-100 text-green-800" :
                            course.currentGrade >= 80 ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {course.currentGrade}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                        <span>{course.creditHours} credit hours</span>
                        {course.nextAssignmentDue && (
                          <span>
                            Next due: {new Date(course.nextAssignmentDue).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Attendance Summary */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Summary</h2>
              {loading ? (
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                </div>
              ) : !attendance ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No attendance data available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <CheckCircle2 className="mx-auto mb-2 text-green-600" size={32} />
                    <p className="font-bold text-green-900 text-2xl">{attendance.present}</p>
                    <p className="text-green-700 text-sm">Present</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <XCircle className="mx-auto mb-2 text-red-600" size={32} />
                    <p className="font-bold text-red-900 text-2xl">{attendance.absent}</p>
                    <p className="text-red-700 text-sm">Absent</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <Clock className="mx-auto mb-2 text-yellow-600" size={32} />
                    <p className="font-bold text-yellow-900 text-2xl">{attendance.late}</p>
                    <p className="text-yellow-700 text-sm">Late</p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Assignments */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {pendingAssignments} Pending
                </Badge>
              </div>
              {loading ? (
                <div className="space-y-3">
                  <AssignmentCardSkeleton />
                  <AssignmentCardSkeleton />
                  <AssignmentCardSkeleton />
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No assignments found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`border rounded-xl p-4 transition-all duration-200 ${
                        assignment.status === "overdue"
                          ? "border-red-300 bg-red-50 hover:bg-red-100"
                          : assignment.status === "completed"
                            ? "border-green-300 bg-green-50 hover:bg-green-100"
                            : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{assignment.courseName}</p>
                        </div>
                        <Badge
                          className={
                            assignment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : assignment.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Announcements */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {announcements.length} New
                </Badge>
              </div>
              {loading ? (
                <div className="space-y-4">
                  <AnnouncementCardSkeleton />
                  <AnnouncementCardSkeleton />
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No announcements found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`border rounded-xl p-4 ${
                        announcement.type === "urgent"
                          ? "border-red-300 bg-red-50"
                          : announcement.type === "warning"
                            ? "border-yellow-300 bg-yellow-50"
                            : "border-blue-300 bg-blue-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <Badge
                          className={
                            announcement.type === "urgent"
                              ? "bg-red-100 text-red-800"
                              : announcement.type === "warning"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {announcement.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(announcement.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-700 leading-relaxed">{announcement.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}