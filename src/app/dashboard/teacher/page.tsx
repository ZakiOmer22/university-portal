"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    AlertCircle, 
    Users, 
    CalendarCheck, 
    FileText, 
    BookOpen,
    Bell,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertTriangle,
    MoreHorizontal,
    Plus,
    Search,
    Filter,
    MessageSquare,
    BarChart3,
    Download,
    Eye
} from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    semester: number;
    enrolledStudents: number;
    attendanceRate: number;
    nextAssignmentDue?: string;
    color: string;
    progress: number;
    department: string;
}

interface Announcement {
    id: string;
    title: string;
    date: string;
    message: string;
    priority: "low" | "medium" | "high";
    author: string;
    category: string;
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
    type: string;
    points: number;
}

interface StudentMessage {
    id: string;
    studentName: string;
    course: string;
    message: string;
    time: string;
    unread: boolean;
    urgency: "normal" | "urgent";
}

// Real data that would come from your API
const mockCourses: Course[] = [
    {
        id: "course1",
        code: "ENG201",
        name: "Advanced Composition",
        semester: 2,
        enrolledStudents: 24,
        attendanceRate: 94,
        nextAssignmentDue: "2024-03-15",
        color: "from-purple-500 to-pink-500",
        progress: 65,
        department: "English Department"
    },
    {
        id: "course2",
        code: "LIT405",
        name: "Modern American Literature",
        semester: 4,
        enrolledStudents: 18,
        attendanceRate: 88,
        nextAssignmentDue: "2024-03-18",
        color: "from-blue-500 to-cyan-500",
        progress: 42,
        department: "Literature Department"
    },
    {
        id: "course3",
        code: "WRI301",
        name: "Creative Writing Workshop",
        semester: 3,
        enrolledStudents: 16,
        attendanceRate: 96,
        nextAssignmentDue: "2024-03-12",
        color: "from-green-500 to-emerald-500",
        progress: 78,
        department: "Writing Department"
    },
    {
        id: "course4",
        code: "COM202",
        name: "Professional Communication",
        semester: 2,
        enrolledStudents: 28,
        attendanceRate: 91,
        nextAssignmentDue: "2024-03-20",
        color: "from-orange-500 to-red-500",
        progress: 55,
        department: "Communications Department"
    },
];

const mockAnnouncements: Announcement[] = [
    {
        id: "ann1",
        title: "Midterm Grading Deadline",
        date: "2024-03-08",
        message: "All midterm grades must be submitted through the faculty portal by March 15th. Late submissions will affect student registration for next semester.",
        priority: "high",
        author: "Dean's Office",
        category: "Academic"
    },
    {
        id: "ann2",
        title: "Faculty Development Workshop",
        date: "2024-03-05",
        message: "Join us for an interactive workshop on innovative teaching methodologies and digital classroom tools. Session will be held in the Faculty Innovation Center.",
        priority: "medium",
        author: "Professional Development",
        category: "Training"
    },
    {
        id: "ann3",
        title: "Spring Semester Curriculum Review",
        date: "2024-03-01",
        message: "Department heads are requested to review and update course materials for the upcoming spring semester. Submit proposed changes by April 1st.",
        priority: "medium",
        author: "Curriculum Committee",
        category: "Academic"
    },
];

const mockAssignments: Assignment[] = [
    {
        id: "assign1",
        title: "Research Paper Draft Submission",
        dueDate: "2024-03-15",
        courseId: "course1",
        courseName: "Advanced Composition",
        status: "pending",
        submissions: 18,
        totalStudents: 24,
        type: "Research Paper",
        points: 100
    },
    {
        id: "assign2",
        title: "Literary Analysis Essay",
        dueDate: "2024-03-18",
        courseId: "course2",
        courseName: "Modern American Literature",
        status: "pending",
        submissions: 12,
        totalStudents: 18,
        type: "Critical Essay",
        points: 85
    },
    {
        id: "assign3",
        title: "Short Story Portfolio",
        dueDate: "2024-03-12",
        courseId: "course3",
        courseName: "Creative Writing Workshop",
        status: "completed",
        submissions: 16,
        totalStudents: 16,
        type: "Creative Portfolio",
        points: 150
    },
    {
        id: "assign4",
        title: "Persuasive Speech Outline",
        dueDate: "2024-03-10",
        courseId: "course4",
        courseName: "Professional Communication",
        status: "overdue",
        submissions: 22,
        totalStudents: 28,
        type: "Speech Preparation",
        points: 50
    },
];

const mockMessages: StudentMessage[] = [
    {
        id: "msg1",
        studentName: "Emily Rodriguez",
        course: "Advanced Composition",
        message: "I'm having trouble accessing the research materials for the paper. Could you please share the library database credentials?",
        time: "2 hours ago",
        unread: true,
        urgency: "normal"
    },
    {
        id: "msg2",
        studentName: "Marcus Thompson",
        course: "Modern American Literature",
        message: "I need an extension on the Fitzgerald analysis due to medical reasons. I have documentation from the health center.",
        time: "5 hours ago",
        unread: true,
        urgency: "urgent"
    },
    {
        id: "msg3",
        studentName: "Jessica Kim",
        course: "Creative Writing Workshop",
        message: "Thank you for the feedback on my character development exercise! The suggestions were really helpful for my final project.",
        time: "1 day ago",
        unread: false,
        urgency: "normal"
    },
    {
        id: "msg4",
        studentName: "David Chen",
        course: "Professional Communication",
        message: "I'd like to schedule office hours to discuss my career presentation topic. Are you available Thursday afternoon?",
        time: "1 day ago",
        unread: false,
        urgency: "normal"
    }
];

export default function TeachersDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [messages, setMessages] = useState<StudentMessage[]>([]);
    const [activeTab, setActiveTab] = useState<"overview" | "courses" | "assignments">("overview");

    useEffect(() => {
        // Simulate API calls to fetch real data
        const fetchDashboardData = async () => {
            try {
                // In a real app, these would be actual API calls:
                // const coursesResponse = await fetch('/api/teacher/courses');
                // const assignmentsResponse = await fetch('/api/teacher/assignments');
                // etc.
                
                setTimeout(() => {
                    setCourses(mockCourses);
                    setAnnouncements(mockAnnouncements);
                    setAssignments(mockAssignments);
                    setMessages(mockMessages);
                    setLoading(false);
                }, 1200);
            } catch (err) {
                setError("Failed to load dashboard data. Please try refreshing the page.");
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalStudents = courses.reduce((acc, c) => acc + c.enrolledStudents, 0);
    const avgAttendance = courses.length
        ? (courses.reduce((acc, c) => acc + c.attendanceRate, 0) / courses.length).toFixed(1)
        : "N/A";
    const pendingAssignmentsCount = assignments.filter((a) => a.status === "pending").length;
    const overdueAssignmentsCount = assignments.filter((a) => a.status === "overdue").length;
    const unreadMessagesCount = messages.filter((m) => m.unread).length;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-100 text-red-800 border-red-200";
            case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "overdue": return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-2xl" />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Skeleton className="h-96 rounded-2xl" />
                        <Skeleton className="h-96 rounded-2xl" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Teacher Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {pendingAssignmentsCount} assignments to grade • {unreadMessagesCount} unread messages • {courses.length} active courses
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Filter className="w-4 h-4" />
                                Filter Courses
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200">
                                <Plus className="w-4 h-4" />
                                New Assignment
                            </button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 mt-0.5" />
                            <div>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </div>
                        </Alert>
                    )}

                    {/* Enhanced Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <Users className="mb-3" size={32} />
                                <h3 className="font-semibold text-blue-100">Total Students</h3>
                                <p className="text-3xl font-bold mt-2">{totalStudents}</p>
                                <div className="flex items-center gap-1 mt-2 text-blue-100 text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Across {courses.length} courses</span>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <CalendarCheck className="mb-3" size={32} />
                                <h3 className="font-semibold text-green-100">Attendance Rate</h3>
                                <p className="text-3xl font-bold mt-2">{avgAttendance}%</p>
                                <div className="flex items-center gap-1 mt-2 text-green-100 text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Class average</span>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <FileText className="mb-3" size={32} />
                                <h3 className="font-semibold text-amber-100">Pending Reviews</h3>
                                <p className="text-3xl font-bold mt-2">{pendingAssignmentsCount}</p>
                                <div className="text-amber-100 text-sm mt-2">
                                    {overdueAssignmentsCount} overdue
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <MessageSquare className="mb-3" size={32} />
                                <h3 className="font-semibold text-purple-100">Student Messages</h3>
                                <p className="text-3xl font-bold mt-2">{unreadMessagesCount}</p>
                                <div className="text-purple-100 text-sm mt-2">
                                    {messages.filter(m => m.urgency === 'urgent').length} urgent
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 bg-gray-100/80 rounded-2xl p-1 w-fit">
                        {[
                            { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
                            { id: "courses", label: "Course Management", icon: BookOpen },
                            { id: "assignments", label: "Assignment Grading", icon: FileText }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id as "overview" | "courses" | "assignments")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${activeTab === id
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column - Courses & Assignments */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Active Courses Section */}
                            <section className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Your Active Courses</h2>
                                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Export Roster
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="border border-gray-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200 group cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-bold text-sm`}>
                                                    {course.code.slice(0, 3)}
                                                </div>
                                                <div className="flex gap-1">
                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-600 p-1">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-600 p-1">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{course.department}</p>
                                            <div className="flex justify-between items-center text-sm mb-3">
                                                <span className="text-gray-600">{course.enrolledStudents} enrolled</span>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="font-medium text-gray-900">{course.attendanceRate}% attendance</span>
                                                </div>
                                            </div>
                                            {/* Course Progress */}
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>Course Progress</span>
                                                    <span>{course.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full bg-gradient-to-r ${course.color}`}
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            {course.nextAssignmentDue && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500">
                                                        Next assignment due: {new Date(course.nextAssignmentDue).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Assignment Grading Section */}
                            <section className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Assignment Grading Queue</h2>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                            <Search className="w-4 h-4" />
                                        </button>
                                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                            View Gradebook
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {assignments.map((assignment) => (
                                        <div
                                            key={assignment.id}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md cursor-pointer group
                                                ${assignment.status === "overdue"
                                                    ? "border-red-200 bg-red-50/50 hover:bg-red-50"
                                                    : assignment.status === "completed"
                                                        ? "border-green-200 bg-green-50/50 hover:bg-green-50"
                                                        : "border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(assignment.status)}
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                                                        <p className="text-sm text-gray-600">{assignment.courseName} • {assignment.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={
                                                            assignment.status === "completed"
                                                                ? "bg-green-100 text-green-800 border-green-200"
                                                                : assignment.status === "overdue"
                                                                    ? "bg-red-100 text-red-800 border-red-200"
                                                                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                        }
                                                    >
                                                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                                    </Badge>
                                                    <span className="text-sm font-medium text-gray-700">{assignment.points} pts</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <div className="text-sm text-gray-600">
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    {assignment.submissions}/{assignment.totalStudents} submitted
                                                </div>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-1000
                                                        ${assignment.status === "completed" ? "bg-green-500" :
                                                            assignment.status === "overdue" ? "bg-red-500" : "bg-yellow-500"
                                                        }`}
                                                    style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Messages & Announcements */}
                        <div className="space-y-8">
                            {/* Student Messages */}
                            <section className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Student Messages</h2>
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-gray-400" />
                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {unreadMessagesCount}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md cursor-pointer group
                                                ${message.unread ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-200 bg-gray-50/50'}
                                                ${message.urgency === 'urgent' ? 'border-l-4 border-l-red-400' : ''}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`font-semibold ${message.unread ? 'text-indigo-900' : 'text-gray-900'} group-hover:text-indigo-600 transition-colors duration-200`}>
                                                    {message.studentName}
                                                </h3>
                                                {message.unread && (
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{message.course}</p>
                                            <p className="text-gray-700 text-sm leading-relaxed mb-2 line-clamp-2">
                                                {message.message}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">{message.time}</span>
                                                {message.urgency === 'urgent' && (
                                                    <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                                        Urgent
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 py-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium border border-dashed border-gray-300 rounded-xl hover:border-indigo-300 transition-colors duration-200">
                                    View All Messages
                                </button>
                            </section>

                            {/* Faculty Announcements */}
                            <section className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Faculty Announcements</h2>
                                    <div className="text-sm text-gray-500">This Week</div>
                                </div>
                                <div className="space-y-4">
                                    {announcements.map((announcement) => (
                                        <div
                                            key={announcement.id}
                                            className="p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                                                    {announcement.title}
                                                </h3>
                                                <Badge className={getPriorityColor(announcement.priority)}>
                                                    {announcement.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {new Date(announcement.date).toLocaleDateString()} • {announcement.author}
                                            </p>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {announcement.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Quick Actions */}
                            <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                                <h2 className="text-xl font-semibold mb-4 text-indigo-100">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <div className="font-semibold">Upload Lecture Materials</div>
                                        <div className="text-indigo-200 text-sm">Share resources with students</div>
                                    </button>
                                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <div className="font-semibold">Schedule Office Hours</div>
                                        <div className="text-indigo-200 text-sm">Set availability for students</div>
                                    </button>
                                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <div className="font-semibold">Generate Progress Reports</div>
                                        <div className="text-indigo-200 text-sm">Create student performance summaries</div>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}