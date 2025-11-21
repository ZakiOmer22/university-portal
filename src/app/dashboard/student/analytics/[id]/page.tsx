"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, BookOpen, Calendar, User, Award, BarChart3, Clock, Target } from "lucide-react";

interface GradeDetails {
    final: number;
    midterm: number;
    assignments: number;
    projects: number;
    overall: number;
    remarks?: string;
}

interface CourseProgressDetail {
    id: string;
    code: string;
    name: string;
    creditHours: number;
    instructor: string;
    instructorAvatar?: string;
    grades: GradeDetails;
    semester: string;
    attendancePercentage: number;
    lastUpdated: string;
    department?: string;
    classAverage?: number;
    rank?: number;
    totalStudents?: number;
}

// Dummy data for demo
const dummyProgressData: Record<string, CourseProgressDetail> = {
    "course-uuid-1": {
        id: "course-uuid-1",
        code: "CS101",
        name: "Computer Science 101",
        creditHours: 3,
        instructor: "Dr. Smith",
        instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        grades: {
            final: 88,
            midterm: 90,
            assignments: 92,
            projects: 85,
            overall: 89,
            remarks: "Excellent performance in assignments and consistent progress throughout the semester. Final exam showed strong understanding of core concepts.",
        },
        semester: "Fall 2025",
        attendancePercentage: 95,
        lastUpdated: "2025-08-01T12:00:00Z",
        department: "Computer Science",
        classAverage: 82,
        rank: 5,
        totalStudents: 45
    },
    "course-uuid-2": {
        id: "course-uuid-2",
        code: "MATH201",
        name: "Advanced Mathematics",
        creditHours: 4,
        instructor: "Prof. Jane",
        instructorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        grades: {
            final: 80,
            midterm: 78,
            assignments: 85,
            projects: 82,
            overall: 81,
            remarks: "Good progress with room for improvement in exam performance. Assignment submissions are consistently high quality.",
        },
        semester: "Fall 2025",
        attendancePercentage: 89,
        lastUpdated: "2025-07-30T14:00:00Z",
        department: "Mathematics",
        classAverage: 76,
        rank: 12,
        totalStudents: 38
    },
};

function getGradeColor(grade: number) {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600";
}

function getGradeBadgeColor(grade: number) {
    if (grade >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (grade >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (grade >= 60) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
}

function getAttendanceColor(percentage: number) {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
}

function getAttendanceBadgeColor(percentage: number) {
    if (percentage >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
}

export default function CourseProgressDetailPage() {
    const params = useParams();
    const courseIdParam = params?.id;
    const courseId = Array.isArray(courseIdParam) ? courseIdParam[0] : courseIdParam ?? "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courseProgress, setCourseProgress] = useState<CourseProgressDetail | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        setTimeout(() => {
            if (courseId && dummyProgressData[courseId]) {
                setCourseProgress(dummyProgressData[courseId]);
                setLoading(false);
            } else {
                setError("Course progress data not found.");
                setCourseProgress(null);
                setLoading(false);
            }
        }, 1000);
    }, [courseId]);

    return (
        <DashboardLayout user={null} loading={loading}>
            <div className="space-y-8 max-w-6xl mx-auto">
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
                        <Skeleton className="h-10 w-64" />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-2xl" />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Skeleton className="h-96 rounded-2xl" />
                            <Skeleton className="h-96 rounded-2xl" />
                        </div>
                    </div>
                ) : courseProgress ? (
                    <>
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1">
                                    <Badge className="bg-white/20 text-white border-none mb-4">
                                        {courseProgress.department}
                                    </Badge>
                                    <h1 className="text-3xl font-bold mb-2">
                                        {courseProgress.code} - {courseProgress.name}
                                    </h1>
                                    <p className="text-blue-100 text-lg opacity-90">
                                        {courseProgress.semester} • {courseProgress.creditHours} Credit Hours
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-48">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">{courseProgress.grades.overall}%</div>
                                        <div className="text-blue-100 text-sm">Overall Grade</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <Award className="w-6 h-6 text-green-200" />
                                    <div className="text-green-200 text-sm font-medium">Overall Grade</div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{courseProgress.grades.overall}%</div>
                                <div className="text-green-200 text-sm">Current Performance</div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <TrendingUp className="w-6 h-6 text-blue-200" />
                                    <div className="text-blue-200 text-sm font-medium">Class Rank</div>
                                </div>
                                <div className="text-3xl font-bold mb-1">
                                    #{courseProgress.rank}/{courseProgress.totalStudents}
                                </div>
                                <div className="text-blue-200 text-sm">In Class</div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <Target className="w-6 h-6 text-amber-200" />
                                    <div className="text-amber-200 text-sm font-medium">Class Average</div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{courseProgress.classAverage}%</div>
                                <div className="text-amber-200 text-sm">Course Benchmark</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <BookOpen className="w-6 h-6 text-purple-200" />
                                    <div className="text-purple-200 text-sm font-medium">Attendance</div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{courseProgress.attendancePercentage}%</div>
                                <div className="text-purple-200 text-sm">Present Rate</div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Grades Breakdown */}
                            <div className="space-y-8">
                                {/* Detailed Grades */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <BarChart3 className="w-5 h-5 text-blue-600" />
                                        Detailed Grades Breakdown
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        {[
                                            { label: "Final Exam", value: courseProgress.grades.final },
                                            { label: "Midterm Exam", value: courseProgress.grades.midterm },
                                            { label: "Assignments", value: courseProgress.grades.assignments },
                                            { label: "Projects", value: courseProgress.grades.projects },
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                                <span className="font-medium text-gray-700">{item.label}</span>
                                                <Badge className={`text-lg font-bold px-3 py-1 ${getGradeBadgeColor(item.value)}`}>
                                                    {item.value}%
                                                </Badge>
                                            </div>
                                        ))}
                                        
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-gray-900 text-lg">Overall Grade</span>
                                                <Badge className={`text-xl font-bold px-4 py-2 ${getGradeBadgeColor(courseProgress.grades.overall)}`}>
                                                    {courseProgress.grades.overall}%
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Instructor Information */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <User className="w-5 h-5 text-purple-600" />
                                        Instructor Information
                                    </h2>
                                    
                                    <div className="flex items-center gap-4">
                                        {courseProgress.instructorAvatar ? (
                                            <img
                                                src={courseProgress.instructorAvatar}
                                                alt={courseProgress.instructor}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                                                <User className="w-8 h-8 text-purple-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{courseProgress.instructor}</h3>
                                            <p className="text-gray-600">Course Instructor</p>
                                            <p className="text-sm text-gray-500 mt-1">{courseProgress.department} Department</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column - Additional Information */}
                            <div className="space-y-8">
                                {/* Performance Remarks */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <Award className="w-5 h-5 text-green-600" />
                                        Performance Analysis
                                    </h2>
                                    
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 mb-3">Instructor Remarks</h3>
                                        <p className="text-gray-700 leading-relaxed italic">
                                            &quot;{courseProgress.grades.remarks}&quot;
                                        </p>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                #{courseProgress.rank}
                                            </div>
                                            <div className="text-sm text-blue-700">Class Rank</div>
                                        </div>
                                        <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                                            <div className="text-2xl font-bold text-amber-600 mb-1">
                                                {courseProgress.classAverage}%
                                            </div>
                                            <div className="text-sm text-amber-700">Class Average</div>
                                        </div>
                                    </div>
                                </section>

                                {/* Attendance & Updates */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                        Attendance & Updates
                                    </h2>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Attendance Rate</h3>
                                                <p className="text-sm text-gray-600">Overall class attendance</p>
                                            </div>
                                            <Badge className={`text-lg font-bold px-3 py-2 ${getAttendanceBadgeColor(courseProgress.attendancePercentage)}`}>
                                                {courseProgress.attendancePercentage}%
                                            </Badge>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Last Updated</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(courseProgress.lastUpdated).toLocaleDateString()} at {' '}
                                                        {new Date(courseProgress.lastUpdated).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                            <h4 className="font-medium text-gray-900 mb-2">Course Information</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex justify-between">
                                                    <span>Course Code:</span>
                                                    <span className="font-medium">{courseProgress.code}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Credit Hours:</span>
                                                    <span className="font-medium">{courseProgress.creditHours}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Semester:</span>
                                                    <span className="font-medium">{courseProgress.semester}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Department:</span>
                                                    <span className="font-medium">{courseProgress.department}</span>
                                                </div>
                                            </div>
                                        </div>
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