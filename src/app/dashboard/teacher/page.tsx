"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Users, CalendarCheck, FileText } from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    semester: number;
    enrolledStudents: number;
    attendanceRate: number;
    nextAssignmentDue?: string;
}

interface Announcement {
    id: string;
    title: string;
    date: string;
    message: string;
}

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    courseId: string;
    status: "pending" | "completed" | "overdue";
}

// Explicitly type dummyUser with literal union for role to satisfy User type expected by DashboardLayout
const dummyUser: {
    fullName: string;
    role: "student" | "admin" | "teacher";
    profilePicture?: string | undefined;
} = {
    fullName: "Ms. Angela Johnson",
    role: "teacher",
    profilePicture: undefined,
};

const dummyCourses: Course[] = [
    {
        id: "course1",
        code: "ENG101",
        name: "English Literature",
        semester: 1,
        enrolledStudents: 30,
        attendanceRate: 92,
        nextAssignmentDue: "2025-08-23",
    },
    {
        id: "course2",
        code: "HIST202",
        name: "Modern History",
        semester: 2,
        enrolledStudents: 25,
        attendanceRate: 87,
        nextAssignmentDue: "2025-08-27",
    },
    {
        id: "course3",
        code: "PHYS150",
        name: "Intro to Physics",
        semester: 1,
        enrolledStudents: 28,
        attendanceRate: 90,
    },
];

const dummyAnnouncements: Announcement[] = [
    {
        id: "ann1",
        title: "Faculty Meeting - Aug 20",
        date: "2025-08-10",
        message: "All teachers are required to attend the faculty meeting in room 203 at 3 PM.",
    },
    {
        id: "ann2",
        title: "New Grading Policy",
        date: "2025-08-05",
        message: "Please review the updated grading rubric sent via email last week.",
    },
];

const dummyAssignments: Assignment[] = [
    {
        id: "assign1",
        title: "Essay Review Deadline",
        dueDate: "2025-08-23",
        courseId: "course1",
        status: "pending",
    },
    {
        id: "assign2",
        title: "Quiz Preparation",
        dueDate: "2025-08-26",
        courseId: "course2",
        status: "pending",
    },
    {
        id: "assign3",
        title: "Lab Report Submission",
        dueDate: "2025-08-15",
        courseId: "course3",
        status: "completed",
    },
];

export default function TeachersDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<typeof dummyUser | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    useEffect(() => {
        setTimeout(() => {
            try {
                setUser(dummyUser);
                setCourses(dummyCourses);
                setAnnouncements(dummyAnnouncements);
                setAssignments(dummyAssignments);
                setLoading(false);
            } catch {
                setError("Failed to load teacher dashboard data.");
                setLoading(false);
            }
        }, 1200);
    }, []);

    const totalStudents = courses.reduce((acc, c) => acc + c.enrolledStudents, 0);
    const avgAttendance = courses.length
        ? (courses.reduce((acc, c) => acc + c.attendanceRate, 0) / courses.length).toFixed(1)
        : "N/A";
    const pendingAssignmentsCount = assignments.filter((a) => a.status === "pending").length;

    return (
        <DashboardLayout>
            <section className="flex flex-col flex-1 min-h-0 overflow-auto space-y-8 p-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-shrink-0">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-28 rounded-lg" />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 flex-shrink-0">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                                <Users className="mx-auto mb-2 text-indigo-700" size={32} />
                                <h3 className="font-semibold text-indigo-900">Total Students</h3>
                                <p className="text-3xl font-bold">{totalStudents}</p>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <CalendarCheck className="mx-auto mb-2 text-green-700" size={32} />
                                <h3 className="font-semibold text-green-900">Avg Attendance</h3>
                                <p className="text-3xl font-bold">{avgAttendance}%</p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                <FileText className="mx-auto mb-2 text-yellow-700" size={32} />
                                <h3 className="font-semibold text-yellow-900">Pending Assignments</h3>
                                <p className="text-3xl font-bold">{pendingAssignmentsCount}</p>
                            </div>
                        </div>

                        {/* Courses List */}
                        <section className="flex-shrink-0">
                            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Your Courses</h2>
                            {courses.length === 0 ? (
                                <p className="italic text-gray-600">You have no assigned courses.</p>
                            ) : (
                                <div className="space-y-4">
                                    {courses.map(
                                        ({
                                            id,
                                            code,
                                            name,
                                            semester,
                                            enrolledStudents,
                                            attendanceRate,
                                            nextAssignmentDue,
                                        }) => (
                                            <div
                                                key={id}
                                                className="border border-indigo-200 rounded-lg p-4 flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-semibold">
                                                        {code} - {name} (Semester {semester})
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Enrolled Students: {enrolledStudents}
                                                    </p>
                                                </div>
                                                <div className="text-right space-y-1 min-w-[120px]">
                                                    <p className="font-semibold text-green-700">
                                                        Attendance: {attendanceRate}%
                                                    </p>
                                                    {nextAssignmentDue && (
                                                        <p className="text-sm text-gray-600">
                                                            Next Due:{" "}
                                                            {new Date(nextAssignmentDue).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Assignments */}
                        <section className="flex-shrink-0">
                            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Assignments</h2>
                            {assignments.length === 0 ? (
                                <p className="italic text-gray-600">No assignments assigned.</p>
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
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Announcements */}
                        <section className="flex-shrink-0">
                            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Announcements</h2>
                            {announcements.length === 0 ? (
                                <p className="italic text-gray-600">No announcements.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {announcements.map(({ id, title, date, message }) => (
                                        <li
                                            key={id}
                                            className="border rounded-lg p-3 bg-indigo-50 border-indigo-200"
                                        >
                                            <p className="font-semibold">{title}</p>
                                            <p className="text-sm text-gray-600">
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
            </section>
        </DashboardLayout>
    );
}
