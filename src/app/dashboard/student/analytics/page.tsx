"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, BookOpen, Award, Calendar, BarChart3, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CourseProgress {
    id: string;
    code: string;
    name: string;
    creditHours: number;
    semester: number;
    instructor?: string;
    grades: {
        final: number;
        midterm: number;
        assignment: number;
        project: number;
    };
}

// Dummy course data with semester and detailed grades
const dummyCourses: CourseProgress[] = [
    {
        id: "course-uuid-1",
        code: "CS101",
        name: "Computer Science 101",
        creditHours: 3,
        semester: 1,
        instructor: "Dr. Smith",
        grades: { final: 90, midterm: 88, assignment: 95, project: 92 },
    },
    {
        id: "course-uuid-2",
        code: "MATH201",
        name: "Advanced Mathematics",
        creditHours: 4,
        semester: 1,
        instructor: "Prof. Jane",
        grades: { final: 85, midterm: 80, assignment: 90, project: 87 },
    },
    {
        id: "course-uuid-3",
        code: "ENG102",
        name: "English Literature",
        creditHours: 2,
        semester: 2,
        instructor: "Ms. Johnson",
        grades: { final: 78, midterm: 75, assignment: 80, project: 79 },
    },
    {
        id: "course-uuid-4",
        code: "HIST210",
        name: "World History",
        creditHours: 3,
        semester: 2,
        instructor: "Mr. Davis",
        grades: { final: 85, midterm: 83, assignment: 88, project: 84 },
    },
    {
        id: "course-uuid-5",
        code: "PHY301",
        name: "Modern Physics",
        creditHours: 4,
        semester: 3,
        instructor: "Dr. Wilson",
        grades: { final: 92, midterm: 89, assignment: 94, project: 91 },
    },
];

// Convert percentage grade to GPA points
function gradeToGPA(grade: number) {
    if (grade >= 90) return 4.0;
    if (grade >= 80) return 3.0;
    if (grade >= 70) return 2.0;
    if (grade >= 60) return 1.0;
    return 0;
}

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

export default function ProgressPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<CourseProgress[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
    const [showAllGrades, setShowAllGrades] = useState(false);

    const [visibleMarks, setVisibleMarks] = useState<Record<
        string,
        { final: boolean; midterm: boolean; assignment: boolean; project: boolean }
    >>({});

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
                setError("Failed to load progress data.");
                setLoading(false);
            }
        }, 1200);
    }, []);

    const filteredCourses =
        selectedSemester === "all"
            ? courses
            : courses.filter((course) => course.semester === selectedSemester);

    // Calculate statistics
    const totalCredits = filteredCourses.reduce((sum, c) => sum + c.creditHours, 0);
    const totalGradePoints = filteredCourses.reduce(
        (sum, c) => {
            const avgGrade =
                (c.grades.final + c.grades.midterm + c.grades.assignment + c.grades.project) / 4;
            return sum + gradeToGPA(avgGrade) * c.creditHours;
        },
        0
    );
    const gpa = totalCredits ? totalGradePoints / totalCredits : 0;

    // Calculate average grade across all filtered courses
    const averageGrade = filteredCourses.length > 0 
        ? filteredCourses.reduce((sum, c) => {
            const avg = (c.grades.final + c.grades.midterm + c.grades.assignment + c.grades.project) / 4;
            return sum + avg;
        }, 0) / filteredCourses.length
        : 0;

    const semesters = Array.from(new Set(courses.map((c) => c.semester))).sort((a, b) => a - b);

    function toggleMark(courseId: string, mark: keyof CourseProgress["grades"]) {
        setVisibleMarks((prev) => ({
            ...prev,
            [courseId]: {
                final: prev[courseId]?.final || false,
                midterm: prev[courseId]?.midterm || false,
                assignment: prev[courseId]?.assignment || false,
                project: prev[courseId]?.project || false,
                [mark]: !prev[courseId]?.[mark],
            },
        }));
    }

    function toggleAllMarks(courseId: string) {
        const currentState = visibleMarks[courseId];
        const allVisible = currentState?.final && currentState?.midterm && currentState?.assignment && currentState?.project;
        
        setVisibleMarks((prev) => ({
            ...prev,
            [courseId]: {
                final: !allVisible,
                midterm: !allVisible,
                assignment: !allVisible,
                project: !allVisible,
            },
        }));
    }

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Academic Progress</h1>
                        <p className="text-gray-600 mt-1">Track your grades and academic performance across semesters</p>
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
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <TrendingUp className="w-6 h-6 text-indigo-200" />
                                <div className="text-indigo-200 text-sm font-medium">Current GPA</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{gpa.toFixed(2)}</div>
                            <div className="text-indigo-200 text-sm">Cumulative</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <BookOpen className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Credit Hours</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalCredits}</div>
                            <div className="text-blue-200 text-sm">Total Enrolled</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Award className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Average Grade</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{averageGrade.toFixed(1)}%</div>
                            <div className="text-green-200 text-sm">Current Semester</div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Calendar className="w-6 h-6 text-amber-200" />
                                <div className="text-amber-200 text-sm font-medium">Semesters</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{semesters.length}</div>
                            <div className="text-amber-200 text-sm">Completed</div>
                        </div>
                    </div>
                )}

                {/* Semester Filter */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <label className="font-medium text-gray-700">Filter by Semester:</label>
                                </div>
                                <select
                                    value={selectedSemester}
                                    onChange={(e) =>
                                        setSelectedSemester(e.target.value === "all" ? "all" : Number(e.target.value))
                                    }
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="all">All Semesters</option>
                                    {semesters.map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                    {filteredCourses.length} courses
                                </Badge>
                            </div>
                            
                            <button
                                onClick={() => setShowAllGrades(!showAllGrades)}
                                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            >
                                {showAllGrades ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {showAllGrades ? "Hide All Grades" : "Show All Grades"}
                            </button>
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
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Data</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {selectedSemester === "all" 
                                ? "No course progress data available."
                                : `No courses found for Semester ${selectedSemester}.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredCourses.map(({ id, code, name, creditHours, semester, instructor, grades }) => {
                            const avgGrade = (grades.final + grades.midterm + grades.assignment + grades.project) / 4;
                            const courseVisibleMarks = visibleMarks[id] || {};
                            const hasVisibleMarks = Object.values(courseVisibleMarks).some(val => val);
                            const allMarksVisible = Object.values(courseVisibleMarks).every(val => val);

                            return (
                                <div
                                    key={id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        {/* Course Information */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-3 h-8 rounded-full"></div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {code} - {name}
                                                            </h3>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                                    Semester {semester}
                                                                </Badge>
                                                                <span className="text-sm text-gray-500">{creditHours} Credits</span>
                                                                {instructor && (
                                                                    <span className="text-sm text-gray-500">Instructor: {instructor}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Average Grade Badge */}
                                                <Badge className={`text-lg font-bold px-3 py-2 ${getGradeBadgeColor(avgGrade)}`}>
                                                    {avgGrade.toFixed(1)}%
                                                </Badge>
                                            </div>

                                            {/* Grade Toggle Buttons */}
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={() => toggleAllMarks(id)}
                                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                                >
                                                    {allMarksVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                    {allMarksVisible ? "Hide All" : "Show All"}
                                                </button>
                                                
                                                {(["final", "midterm", "assignment", "project"] as const).map(
                                                    (mark) => (
                                                        <button
                                                            key={mark}
                                                            onClick={() => toggleMark(id, mark)}
                                                            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                                                                courseVisibleMarks[mark]
                                                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            }`}
                                                        >
                                                            <span className="capitalize">{mark}</span>
                                                        </button>
                                                    )
                                                )}
                                            </div>

                                            {/* Grade Cards */}
                                            {(hasVisibleMarks || showAllGrades) && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {(showAllGrades ? ["final", "midterm", "assignment", "project"] : 
                                                      Object.entries(courseVisibleMarks)
                                                          .filter(([_, isVisible]) => isVisible)
                                                          .map(([mark]) => mark) as Array<keyof CourseProgress["grades"]>)
                                                    .map((mark) => {
                                                        const m = mark as keyof CourseProgress["grades"];
                                                        return (
                                                            <div
                                                                key={m}
                                                                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center"
                                                            >
                                                                <p className="font-semibold text-gray-700 capitalize text-sm mb-1">
                                                                    {m === "final" ? "Final Exam" :
                                                                     m === "midterm" ? "Midterm" :
                                                                     m === "assignment" ? "Assignments" : "Project"}
                                                                </p>
                                                                <p className={`text-2xl font-bold ${getGradeColor(grades[m])}`}>
                                                                    {grades[m]}%
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Section */}
                                        <div className="flex flex-col gap-3 items-start lg:items-end">
                                            <Link
                                                href={`/dashboard/student/analytics/${id}/`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                                            >
                                                View Details
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                            <div className="text-xs text-gray-500 text-center lg:text-right">
                                                Detailed analytics & trends
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}