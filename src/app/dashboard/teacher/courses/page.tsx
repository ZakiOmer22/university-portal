"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Users, 
    CalendarCheck, 
    FileText, 
    CheckSquare, 
    BookOpen,
    Bell,
    TrendingUp,
    Clock,
    AlertCircle,
    ArrowRight,
    GraduationCap,
    BarChart3,
    MessageSquare
} from "lucide-react";

interface User {
    fullName: string;
    role: "student" | "admin" | "teacher";
    profilePicture?: string | undefined;
}

interface Course {
    id: string;
    code: string;
    name: string;
    semester: number;
    enrolledStudents: number;
    attendanceRate: number;
    nextAssignmentDue?: string;
    color: string;
}

interface Announcement {
    id: string;
    title: string;
    date: string;
    message: string;
    type: "info" | "warning" | "urgent";
}

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    courseId: string;
    courseName: string;
    status: "pending" | "completed" | "overdue";
    submissions: number;
    totalStudents: number;
}

const dummyUser: User = {
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
        color: "from-blue-500 to-blue-600"
    },
    {
        id: "course2",
        code: "HIST202",
        name: "Modern History",
        semester: 2,
        enrolledStudents: 25,
        attendanceRate: 87,
        nextAssignmentDue: "2025-08-27",
        color: "from-green-500 to-green-600"
    },
    {
        id: "course3",
        code: "PHYS150",
        name: "Intro to Physics",
        semester: 1,
        enrolledStudents: 28,
        attendanceRate: 90,
        color: "from-purple-500 to-purple-600"
    },
    {
        id: "course4",
        code: "MATH201",
        name: "Advanced Calculus",
        semester: 2,
        enrolledStudents: 22,
        attendanceRate: 85,
        nextAssignmentDue: "2025-08-25",
        color: "from-orange-500 to-orange-600"
    },
];

const dummyAnnouncements: Announcement[] = [
    {
        id: "ann1",
        title: "Faculty Meeting - Aug 20",
        date: "2025-08-10",
        message: "All teachers are required to attend the faculty meeting in room 203 at 3 PM. Please bring your quarterly reports.",
        type: "info"
    },
    {
        id: "ann2",
        title: "New Grading Policy Update",
        date: "2025-08-05",
        message: "Please review the updated grading rubric sent via email last week. Implementation starts next Monday.",
        type: "warning"
    },
    {
        id: "ann3",
        title: "System Maintenance Notice",
        date: "2025-08-08",
        message: "The learning management system will be unavailable this Saturday from 2 AM to 6 AM for scheduled maintenance.",
        type: "urgent"
    },
];

const dummyAssignments: Assignment[] = [
    {
        id: "assign1",
        title: "Essay Review - Shakespeare Analysis",
        dueDate: "2025-08-23",
        courseId: "course1",
        courseName: "English Literature",
        status: "pending",
        submissions: 24,
        totalStudents: 30
    },
    {
        id: "assign2",
        title: "World War II Research Paper",
        dueDate: "2025-08-26",
        courseId: "course2",
        courseName: "Modern History",
        status: "pending",
        submissions: 18,
        totalStudents: 25
    },
    {
        id: "assign3",
        title: "Lab Report - Newton's Laws",
        dueDate: "2025-08-15",
        courseId: "course3",
        courseName: "Intro to Physics",
        status: "completed",
        submissions: 28,
        totalStudents: 28
    },
    {
        id: "assign4",
        title: "Calculus Problem Set #5",
        dueDate: "2025-08-12",
        courseId: "course4",
        courseName: "Advanced Calculus",
        status: "overdue",
        submissions: 20,
        totalStudents: 22
    },
];

export default function TeachersDashboardPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
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
        ? (courses.reduce((acc, c) => acc + c.attendanceRate, 0) / courses.length)
        : 0;
    const pendingAssignmentsCount = assignments.filter((a) => a.status === "pending").length;
    const overdueAssignmentsCount = assignments.filter((a) => a.status === "overdue").length;
    const totalSubmissions = assignments.reduce((acc, a) => acc + a.submissions, 0);
    const totalPossibleSubmissions = assignments.reduce((acc, a) => acc + a.totalStudents, 0);
    const submissionRate = totalPossibleSubmissions > 0 ? (totalSubmissions / totalPossibleSubmissions) * 100 : 0;

    const getAnnouncementColor = (type: Announcement["type"]) => {
        switch (type) {
            case "info": return "bg-blue-50 border-blue-200";
            case "warning": return "bg-yellow-50 border-yellow-200";
            case "urgent": return "bg-red-50 border-red-200";
        }
    };

    const getAnnouncementIcon = (type: Announcement["type"]) => {
        switch (type) {
            case "info": return <Bell className="h-4 w-4 text-blue-600" />;
            case "warning": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            case "urgent": return <AlertCircle className="h-4 w-4 text-red-600" />;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <section className="p-6 w-full mx-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-200 rounded mb-4"></div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <section className="p-6 w-full mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.fullName}!
                        </h1>
                        <p className="text-gray-600">
                            Here&apos;s what&apos;s happening with your classes today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <CalendarCheck className="h-4 w-4" />
                            Today: {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long', 
                                day: 'numeric'
                            })}
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Total Students</p>
                                    <p className="text-3xl font-bold text-indigo-900">{totalStudents}</p>
                                </div>
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <Users className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Avg Attendance</p>
                                    <p className="text-3xl font-bold text-green-900">{avgAttendance.toFixed(1)}%</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600 mb-1">Pending Assignments</p>
                                    <p className="text-3xl font-bold text-yellow-900">{pendingAssignmentsCount}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <FileText className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Submission Rate</p>
                                    <p className="text-3xl font-bold text-blue-900">{submissionRate.toFixed(1)}%</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <BarChart3 className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Courses Section */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
                            <Button variant="outline" className="flex items-center gap-2">
                                View All Courses
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {courses.map((course) => {
                                const courseAssignments = assignments.filter(a => a.courseId === course.id);
                                const pendingCourseAssignments = courseAssignments.filter(a => a.status === "pending");
                                
                                return (
                                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className={`w-full h-2 rounded-t-lg bg-gradient-to-r ${course.color} mb-4`}></div>
                                            
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{course.code}</h3>
                                                    <p className="text-gray-600">{course.name}</p>
                                                    <p className="text-sm text-gray-500">Semester {course.semester}</p>
                                                </div>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                    {course.enrolledStudents} students
                                                </Badge>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Attendance Progress */}
                                                <div>
                                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                        <span>Attendance Rate</span>
                                                        <span>{course.attendanceRate}%</span>
                                                    </div>
                                                    <Progress value={course.attendanceRate} className="h-2" />
                                                </div>

                                                {/* Pending Assignments */}
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Pending Assignments</span>
                                                    <span className="font-semibold">{pendingCourseAssignments.length}</span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => router.push(`/dashboard/teacher/students/${course.id}`)}
                                                    >
                                                        <Users className="h-4 w-4 mr-1" />
                                                        Students
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => router.push(`/dashboard/teacher/attendance/${course.id}`)}
                                                    >
                                                        <CheckSquare className="h-4 w-4 mr-1" />
                                                        Attendance
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => router.push(`/dashboard/teacher/assignments/${course.id}`)}
                                                    >
                                                        <FileText className="h-4 w-4 mr-1" />
                                                        Assignments
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Assignments Overview */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Assignments Overview</h3>
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="space-y-4">
                                    {assignments.slice(0, 4).map((assignment) => (
                                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">
                                                    {assignment.title}
                                                </p>
                                                <p className="text-xs text-gray-500">{assignment.courseName}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge 
                                                    variant={assignment.status === "completed" ? "default" : "secondary"}
                                                    className={
                                                        assignment.status === "completed" ? "bg-green-100 text-green-800" :
                                                        assignment.status === "overdue" ? "bg-red-100 text-red-800" :
                                                        "bg-yellow-100 text-yellow-800"
                                                    }
                                                >
                                                    {assignment.status}
                                                </Badge>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(assignment.dueDate)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full" asChild>
                                        <div onClick={() => router.push('/dashboard/teacher/assignments')}>
                                            View All Assignments
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Announcements */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                                    <Bell className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="space-y-4">
                                    {announcements.map((announcement) => (
                                        <div 
                                            key={announcement.id} 
                                            className={`p-4 rounded-lg border ${getAnnouncementColor(announcement.type)}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {getAnnouncementIcon(announcement.type)}
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        {announcement.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {formatDate(announcement.date)}
                                                    </p>
                                                    <p className="text-sm text-gray-700 line-clamp-2">
                                                        {announcement.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="h-16 flex-col" asChild>
                                        <div onClick={() => router.push('/dashboard/teacher/gradebook')}>
                                            <BookOpen className="h-5 w-5 mb-1" />
                                            <span className="text-xs">Gradebook</span>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="h-16 flex-col" asChild>
                                        <div onClick={() => router.push('/dashboard/teacher/attendance')}>
                                            <CheckSquare className="h-5 w-5 mb-1" />
                                            <span className="text-xs">Attendance</span>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="h-16 flex-col" asChild>
                                        <div onClick={() => router.push('/dashboard/teacher/assignments')}>
                                            <FileText className="h-5 w-5 mb-1" />
                                            <span className="text-xs">Assignments</span>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="h-16 flex-col" asChild>
                                        <div onClick={() => router.push('/dashboard/teacher/students')}>
                                            <Users className="h-5 w-5 mb-1" />
                                            <span className="text-xs">Students</span>
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}