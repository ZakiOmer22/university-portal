"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen, RefreshCw, User, Calendar, Award, Filter, ChevronDown, ChevronUp } from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    creditHours: number;
    semesterNumber: number;
    originalGrade: number;
    canRetake: boolean;
    retakeTeacher: string;
    retakeTeacherAvatar?: string;
    retakeSchedule?: string;
    department?: string;
}

// Dummy 6 courses per semester
const dummyCourses: Course[] = Array.from({ length: 4 }, (_, semIndex) =>
    Array.from({ length: 6 }, (_, courseIndex) => {
        const id = `course-${semIndex + 1}-${courseIndex + 1}`;
        const teacherId = courseIndex + 1;
        return {
            id,
            code: `C${semIndex + 1}${courseIndex + 1}0${courseIndex + 1}`,
            name: `Course ${courseIndex + 1} - Semester ${semIndex + 1}`,
            creditHours: Math.floor(Math.random() * 3) + 2,
            semesterNumber: semIndex + 1,
            originalGrade: Math.floor(Math.random() * 60) + 30, // 30-90
            canRetake: Math.random() > 0.4, // 60% chance can retake
            retakeTeacher: `Prof. Teacher ${teacherId}`,
            retakeTeacherAvatar: `https://randomuser.me/api/portraits/${teacherId % 2 === 0 ? 'women' : 'men'}/${teacherId + 30}.jpg`,
            retakeSchedule: `Mon/Wed ${9 + courseIndex}:00-${10 + courseIndex}:30 AM`,
            department: ["Computer Science", "Mathematics", "Physics", "Engineering", "Business", "Arts"][courseIndex % 6]
        };
    })
).flat();

export default function CourseRetakePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [courses, setCourses] = useState<Course[]>([]);
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

    const [confirmingCourseId, setConfirmingCourseId] = useState<string | null>(null);
    const [processingRetake, setProcessingRetake] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        setTimeout(() => {
            try {
                setCourses(dummyCourses);
                setLoading(false);
            } catch {
                setError("Failed to load courses.");
                setLoading(false);
            }
        }, 1000);
    }, []);

    const filteredCourses = courses.filter(
        (c) => c.semesterNumber === selectedSemester && c.canRetake
    );

    const semesterNumbers = Array.from(new Set(dummyCourses.map((c) => c.semesterNumber))).sort(
        (a, b) => a - b
    );

    const eligibleCoursesCount = courses.filter(c => c.canRetake).length;
    const currentSemesterEligible = filteredCourses.length;

    function handleRetakeClick(courseId: string) {
        setConfirmingCourseId(courseId);
    }

    function cancelRetake() {
        setConfirmingCourseId(null);
    }

    function confirmRetake() {
        if (!confirmingCourseId) return;
        setProcessingRetake(true);

        setTimeout(() => {
            alert(`You have successfully registered to retake the course.`);
            setProcessingRetake(false);
            setConfirmingCourseId(null);
        }, 800);
    }

    const getGradeColor = (grade: number) => {
        if (grade >= 90) return "text-green-600";
        if (grade >= 80) return "text-blue-600";
        if (grade >= 70) return "text-yellow-600";
        if (grade >= 60) return "text-orange-600";
        return "text-red-600";
    };

    const getGradeBadgeColor = (grade: number) => {
        if (grade >= 90) return "bg-green-100 text-green-800 border-green-200";
        if (grade >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
        if (grade >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (grade >= 60) return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-red-100 text-red-800 border-red-200";
    };

    return (
        <DashboardLayout loading={loading} user={user}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Course Retake</h1>
                        <p className="text-gray-600 mt-1">Register for course retakes to improve your grades</p>
                    </div>
                    <Badge variant="secondary" className="bg-red-50 text-red-700 text-sm py-1 px-3">
                        {eligibleCoursesCount} Eligible
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
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <RefreshCw className="w-6 h-6 text-red-200" />
                                <div className="text-red-200 text-sm font-medium">Eligible for Retake</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{eligibleCoursesCount}</div>
                            <div className="text-red-200 text-sm">Total Courses</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Calendar className="w-6 h-6 text-purple-200" />
                                <div className="text-purple-200 text-sm font-medium">Current Semester</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{currentSemesterEligible}</div>
                            <div className="text-purple-200 text-sm">Available Retakes</div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Award className="w-6 h-6 text-amber-200" />
                                <div className="text-amber-200 text-sm font-medium">Average Grade</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                                {filteredCourses.length > 0 
                                    ? Math.round(filteredCourses.reduce((acc, c) => acc + c.originalGrade, 0) / filteredCourses.length)
                                    : 0
                                }%
                            </div>
                            <div className="text-amber-200 text-sm">Current Performance</div>
                        </div>
                    </div>
                )}

                {/* Semester Filter */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <label className="font-medium text-gray-700">Filter by Semester:</label>
                            </div>
                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                            >
                                {semesterNumbers.map((num) => (
                                    <option key={num} value={num}>
                                        Semester {num}
                                    </option>
                                ))}
                            </select>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {filteredCourses.length} courses available
                            </Badge>
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
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Retake Courses Available</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {selectedSemester 
                                ? `No courses are eligible for retake in Semester ${selectedSemester}.`
                                : "No courses are currently eligible for retake."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    {/* Course Information */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-gradient-to-r from-red-500 to-orange-600 w-3 h-8 rounded-full"></div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {course.code} - {course.name}
                                                        </h3>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                                Semester {course.semesterNumber}
                                                            </Badge>
                                                            <span className="text-sm text-gray-500">{course.creditHours} Credits</span>
                                                            {course.department && (
                                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                                    {course.department}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={course.retakeTeacherAvatar}
                                                            alt={course.retakeTeacher}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <span>{course.retakeTeacher}</span>
                                                    </div>
                                                    {course.retakeSchedule && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{course.retakeSchedule}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Grade Badge */}
                                            <Badge className={`text-lg font-bold px-3 py-2 ${getGradeBadgeColor(course.originalGrade)}`}>
                                                {course.originalGrade}%
                                            </Badge>
                                        </div>

                                        {/* Expandable Details */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <button
                                                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                                className="flex items-center gap-2 text-gray-700 font-medium w-full text-left"
                                            >
                                                {expandedCourse === course.id ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                                Course Details
                                            </button>
                                            
                                            {expandedCourse === course.id && (
                                                <div className="mt-3 space-y-2 text-sm text-gray-600">
                                                    <p><strong>Retake Teacher:</strong> {course.retakeTeacher}</p>
                                                    <p><strong>Schedule:</strong> {course.retakeSchedule || "To be announced"}</p>
                                                    <p><strong>Original Grade:</strong> <span className={getGradeColor(course.originalGrade)}>{course.originalGrade}%</span></p>
                                                    <p><strong>Credits:</strong> {course.creditHours}</p>
                                                    <p className="text-amber-600 font-medium mt-2">
                                                        Note: Retaking this course will replace your original grade upon completion.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex flex-col gap-3 items-start lg:items-end">
                                        <button
                                            onClick={() => handleRetakeClick(course.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={processingRetake}
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Register for Retake
                                        </button>
                                        <div className="text-xs text-gray-500 text-center lg:text-right">
                                            Available until semester start
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirmation Modal */}
                {confirmingCourseId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <RefreshCw className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Confirm Course Retake</h2>
                                    <p className="text-gray-600 text-sm">Please confirm your retake registration</p>
                                </div>
                            </div>
                            
                            {confirmingCourseId && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <p className="font-semibold text-gray-900">
                                        {courses.find(c => c.id === confirmingCourseId)?.code} - {courses.find(c => c.id === confirmingCourseId)?.name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Teacher: {courses.find(c => c.id === confirmingCourseId)?.retakeTeacher}
                                    </p>
                                    <p className="text-sm text-red-600 font-medium mt-2">
                                        Original Grade: {courses.find(c => c.id === confirmingCourseId)?.originalGrade}%
                                    </p>
                                </div>
                            )}

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <p className="text-sm text-amber-800">
                                    <strong>Important:</strong> Retaking this course will replace your original grade. 
                                    You will be charged the standard course fee for the retake.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelRetake}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
                                    disabled={processingRetake}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRetake}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    disabled={processingRetake}
                                >
                                    {processingRetake ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Confirm Retake
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}