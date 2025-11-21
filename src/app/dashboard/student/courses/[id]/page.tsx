"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, CheckCircle2, XCircle, BookOpen, Upload, User, Calendar, FileText, Download, BarChart3, Users, Award } from "lucide-react";

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    status: "pending" | "completed" | "overdue";
    description?: string;
    points?: number;
    submitted?: boolean;
}

interface CourseDetail {
    id: string;
    code: string;
    name: string;
    instructor: string;
    instructorAvatarUrl?: string;
    instructorEmail?: string;
    creditHours: number;
    currentGrade: number;
    semester: string;
    description?: string;
    assignments: Assignment[];
    resources?: {
        id: string;
        title: string;
        type: "book" | "pdf" | "video" | "link";
        url?: string;
    }[];
}

// Dummy data for demo purposes
const dummyCourseDetails: Record<string, CourseDetail> = {
    "course-uuid-1": {
        id: "course-uuid-1",
        code: "CS101",
        name: "Computer Science 101",
        instructor: "Dr. Smith",
        instructorAvatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        instructorEmail: "smith@university.edu",
        creditHours: 3,
        currentGrade: 92.5,
        semester: "Fall 2024",
        description: "Introduction to computer science fundamentals including programming, algorithms, and data structures. This course covers basic programming concepts and problem-solving techniques.",
        assignments: [
            { 
                id: "a1", 
                title: "Project Proposal", 
                dueDate: "2025-08-20", 
                status: "pending",
                description: "Submit a 2-page proposal for your final project",
                points: 100,
                submitted: false
            },
            { 
                id: "a2", 
                title: "Final Exam", 
                dueDate: "2025-09-15", 
                status: "pending",
                description: "Comprehensive final examination covering all course materials",
                points: 200,
                submitted: false
            },
            { 
                id: "a3", 
                title: "Homework 4", 
                dueDate: "2025-08-10", 
                status: "completed",
                description: "Data structures and algorithms practice problems",
                points: 50,
                submitted: true
            },
        ],
        resources: [
            { id: "r1", title: "Course Textbook", type: "book" },
            { id: "r2", title: "Lecture Slides Week 1-4", type: "pdf" },
            { id: "r3", title: "Programming Tutorial Videos", type: "video" },
            { id: "r4", title: "Online Compiler", type: "link" },
        ],
    },
    "course-uuid-2": {
        id: "course-uuid-2",
        code: "MATH201",
        name: "Advanced Mathematics",
        instructor: "Prof. Jane",
        instructorAvatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        instructorEmail: "jane@university.edu",
        creditHours: 4,
        currentGrade: 87,
        semester: "Fall 2024",
        description: "Advanced mathematical concepts including calculus, linear algebra, and differential equations.",
        assignments: [
            { 
                id: "a3", 
                title: "Homework 5", 
                dueDate: "2025-08-18", 
                status: "completed",
                description: "Linear algebra problem set",
                points: 75,
                submitted: true
            },
            { 
                id: "a4", 
                title: "Midterm Exam", 
                dueDate: "2025-08-25", 
                status: "pending",
                description: "Midterm examination covering chapters 1-5",
                points: 150,
                submitted: false
            },
        ],
        resources: [
            { id: "r5", title: "Mathematics Textbook", type: "book" },
            { id: "r6", title: "Practice Problems PDF", type: "pdf" },
        ],
    },
};

function StatusBadge({ status }: { status: Assignment["status"] }) {
    switch (status) {
        case "pending":
            return (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                    <Clock size={14} />
                    Pending
                </Badge>
            );
        case "completed":
            return (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                </Badge>
            );
        case "overdue":
            return (
                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <XCircle size={14} />
                    Overdue
                </Badge>
            );
    }
}

function ResourceIcon({ type }: { type: string }) {
    switch (type) {
        case "book":
            return <BookOpen className="w-4 h-4 text-blue-500" />;
        case "pdf":
            return <FileText className="w-4 h-4 text-red-500" />;
        case "video":
            return <Download className="w-4 h-4 text-purple-500" />;
        case "link":
            return <Users className="w-4 h-4 text-green-500" />;
        default:
            return <FileText className="w-4 h-4 text-gray-500" />;
    }
}

export default function CourseDetailPage() {
    const params = useParams();
    const courseIdParam = params?.id;
    const courseId = Array.isArray(courseIdParam) ? courseIdParam[0] : courseIdParam ?? "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        setTimeout(() => {
            if (dummyCourseDetails[courseId]) {
                setCourse(dummyCourseDetails[courseId]);
                setLoading(false);
            } else {
                setError("Course not found.");
                setLoading(false);
            }
        }, 1000);
    }, [courseId]);

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return "text-green-600";
        if (grade >= 80) return "text-blue-600";
        if (grade >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const pendingAssignments = course?.assignments.filter(a => a.status === "pending") || [];
    const completedAssignments = course?.assignments.filter(a => a.status === "completed") || [];

    return (
        <DashboardLayout loading={loading} user={user}>
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
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-40 rounded-2xl mb-6" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-32 rounded-xl" />
                                <Skeleton className="h-32 rounded-xl" />
                            </div>
                            <div className="space-y-6">
                                <Skeleton className="h-40 rounded-xl" />
                                <Skeleton className="h-40 rounded-xl" />
                            </div>
                        </div>
                    </div>
                ) : course ? (
                    <>
                        {/* Course Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1">
                                    <Badge className="bg-white/20 text-white border-none mb-4">
                                        {course.semester}
                                    </Badge>
                                    <h1 className="text-3xl font-bold mb-2">
                                        {course.code} - {course.name}
                                    </h1>
                                    <p className="text-blue-100 text-lg opacity-90">
                                        {course.description}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-48">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">{course.currentGrade.toFixed(1)}%</div>
                                        <div className="text-blue-100 text-sm">Current Grade</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Assignments & Resources */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Instructor Information */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                        <User className="w-5 h-5 text-blue-600" />
                                        Instructor
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        {course.instructorAvatarUrl ? (
                                            <img
                                                src={course.instructorAvatarUrl}
                                                alt={`${course.instructor} avatar`}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                                                <User className="w-8 h-8 text-blue-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{course.instructor}</h3>
                                            <p className="text-gray-600">Course Instructor</p>
                                            {course.instructorEmail && (
                                                <p className="text-blue-600 text-sm mt-1">{course.instructorEmail}</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Upcoming Assignments */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-amber-600" />
                                            Upcoming Assignments
                                        </h2>
                                        <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                                            {pendingAssignments.length} Pending
                                        </Badge>
                                    </div>
                                    
                                    {pendingAssignments.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>No upcoming assignments.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingAssignments.map((assignment) => (
                                                <div
                                                    key={assignment.id}
                                                    className="border border-amber-200 rounded-xl p-4 bg-amber-50 hover:bg-amber-100 transition-all duration-200"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                                {assignment.title}
                                                            </h3>
                                                            {assignment.description && (
                                                                <p className="text-gray-600 text-sm mb-2">
                                                                    {assignment.description}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <div className="flex items-center gap-1 text-gray-600">
                                                                    <Calendar className="w-4 h-4" />
                                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                                </div>
                                                                {assignment.points && (
                                                                    <div className="text-gray-600">
                                                                        Points: {assignment.points}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <StatusBadge status={assignment.status} />
                                                    </div>
                                                    <button className="w-full bg-white border border-amber-300 text-amber-700 rounded-lg py-2 px-4 hover:bg-amber-200 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                                                        <Upload className="w-4 h-4" />
                                                        Submit Assignment
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* Completed Assignments */}
                                {completedAssignments.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            Completed Assignments
                                        </h2>
                                        <div className="space-y-3">
                                            {completedAssignments.map((assignment) => (
                                                <div
                                                    key={assignment.id}
                                                    className="border border-green-200 rounded-xl p-4 bg-green-50 hover:border-green-300 transition-all duration-200"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {assignment.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm">
                                                                Submitted on {new Date(assignment.dueDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <StatusBadge status={assignment.status} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Right Column - Course Info & Resources */}
                            <div className="space-y-8">
                                {/* Course Information */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <BarChart3 className="w-5 h-5 text-purple-600" />
                                        Course Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Course Code</span>
                                            <span className="font-semibold text-gray-900">{course.code}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Credit Hours</span>
                                            <span className="font-semibold text-gray-900">{course.creditHours}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Current Grade</span>
                                            <span className={`font-semibold ${getGradeColor(course.currentGrade)}`}>
                                                {course.currentGrade.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Semester</span>
                                            <span className="font-semibold text-gray-900">{course.semester}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Course Resources */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                        Course Resources
                                    </h2>
                                    
                                    {course.resources && course.resources.length > 0 ? (
                                        <div className="space-y-3">
                                            {course.resources.map((resource) => (
                                                <div
                                                    key={resource.id}
                                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                                                >
                                                    <ResourceIcon type={resource.type} />
                                                    <span className="font-medium text-gray-900 flex-1">
                                                        {resource.title}
                                                    </span>
                                                    <Download className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-500">
                                            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>No resources available.</p>
                                        </div>
                                    )}
                                </section>

                                {/* Quick Actions */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <Award className="w-5 h-5 text-green-600" />
                                        Quick Actions
                                    </h2>
                                    <div className="space-y-3">
                                        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                                            <div className="font-medium text-gray-900">View Course Syllabus</div>
                                            <div className="text-sm text-gray-600">Download course outline and schedule</div>
                                        </button>
                                        
                                        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                                            <div className="font-medium text-gray-900">Contact Instructor</div>
                                            <div className="text-sm text-gray-600">Send message to {course.instructor}</div>
                                        </button>
                                        
                                        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                                            <div className="font-medium text-gray-900">Course Forum</div>
                                            <div className="text-sm text-gray-600">Discuss with classmates</div>
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </DashboardLayout>
    );
}