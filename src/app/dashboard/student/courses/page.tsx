"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen, Calendar, User, Clock, FileText, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Course {
    id: string;
    code: string;
    name: string;
    instructor: string;
    currentGrade: number; // percentage
    creditHours: number;
    nextAssignmentDue?: string; // ISO date string
    currentProgress?: string; // e.g., "75% complete"
    pendingActions?: string[]; // e.g., ["Retake Midterm", "Submit Project Proposal"]
    semester?: string;
    color?: string;
}

const dummyCourses: Course[] = [
    {
        id: "course-uuid-1",
        code: "CS101",
        name: "Computer Science 101",
        instructor: "Dr. Smith",
        currentGrade: 92.5,
        creditHours: 3,
        nextAssignmentDue: "2025-08-20",
        currentProgress: "80% complete",
        pendingActions: ["Submit Project Proposal", "Retake Quiz 2"],
        semester: "Fall 2024",
        color: "from-blue-500 to-cyan-600"
    },
    {
        id: "course-uuid-2",
        code: "MATH201",
        name: "Advanced Mathematics",
        instructor: "Prof. Jane",
        currentGrade: 87,
        creditHours: 4,
        nextAssignmentDue: "2025-08-22",
        currentProgress: "60% complete",
        pendingActions: ["Complete Homework 7"],
        semester: "Fall 2024",
        color: "from-purple-500 to-pink-600"
    },
    {
        id: "course-uuid-3",
        code: "PHY301",
        name: "Modern Physics",
        instructor: "Dr. Johnson",
        currentGrade: 78.5,
        creditHours: 4,
        nextAssignmentDue: "2025-08-25",
        currentProgress: "45% complete",
        pendingActions: ["Lab Report 3", "Midterm Preparation"],
        semester: "Fall 2024",
        color: "from-green-500 to-emerald-600"
    },
];

export default function MyCoursesPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            try {
                setCourses(dummyCourses);
                setLoading(false);
            } catch {
                setError("Failed to load courses data.");
                setLoading(false);
            }
        }, 1200);
    }, []);

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return "text-green-600";
        if (grade >= 80) return "text-blue-600";
        if (grade >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getGradeBadgeColor = (grade: number) => {
        if (grade >= 90) return "bg-green-100 text-green-800 border-green-200";
        if (grade >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
        if (grade >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        return "bg-red-100 text-red-800 border-red-200";
    };

    const totalCredits = courses.reduce((acc, course) => acc + course.creditHours, 0);
    const averageGrade = courses.length > 0 
        ? (courses.reduce((acc, course) => acc + course.currentGrade, 0) / courses.length).toFixed(1)
        : "0.0";

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                        <p className="text-gray-600 mt-1">Manage and track your enrolled courses</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {courses.length} Courses
                    </Badge>
                </div>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2 border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                        <div>
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Summary Cards */}
                {!loading && courses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <BookOpen className="w-6 h-6 text-indigo-200" />
                                <div className="text-indigo-200 text-sm font-medium">Total Courses</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{courses.length}</div>
                            <div className="text-indigo-200 text-sm">Enrolled</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <TrendingUp className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Average Grade</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{averageGrade}%</div>
                            <div className="text-blue-200 text-sm">Current Average</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <FileText className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Credit Hours</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalCredits}</div>
                            <div className="text-green-200 text-sm">This Semester</div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            You are not currently enrolled in any courses. Please contact your academic advisor.
                        </p>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200">
                            <BookOpen className="w-4 h-4" />
                            Browse Available Courses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    {/* Left Section - Course Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`bg-gradient-to-r ${course.color} w-3 h-8 rounded-full`}></div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {course.code} - {course.name}
                                                        </h3>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                                {course.semester}
                                                            </Badge>
                                                            <span className="text-sm text-gray-500">{course.creditHours} Credits</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        <span>{course.instructor}</span>
                                                    </div>
                                                    {course.currentProgress && (
                                                        <div className="flex items-center gap-1">
                                                            <TrendingUp className="w-4 h-4" />
                                                            <span>{course.currentProgress}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Grade Badge */}
                                            <Badge className={`text-lg font-bold px-3 py-2 ${getGradeBadgeColor(course.currentGrade)}`}>
                                                {course.currentGrade.toFixed(1)}%
                                            </Badge>
                                        </div>

                                        {/* Pending Actions */}
                                        {course.pendingActions && course.pendingActions.length > 0 && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-4 h-4 text-amber-600" />
                                                    <span className="text-sm font-medium text-amber-800">Pending Actions</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {course.pendingActions.map((action, index) => (
                                                        <Badge 
                                                            key={index}
                                                            variant="secondary" 
                                                            className="bg-amber-100 text-amber-800 border-amber-200"
                                                        >
                                                            {action}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Section - Actions & Due Date */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 items-start lg:items-end justify-between lg:justify-start">
                                        {course.nextAssignmentDue && (
                                            <div className="text-right lg:text-left">
                                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Next Due:
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                                    {new Date(course.nextAssignmentDue).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <Link
                                            href={`/dashboard/student/courses/${course.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}