"use client";

import { useState, useEffect, JSX } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, TrendingUp, Award, Target, BookOpen, Download, Star, BarChart3, User } from "lucide-react";

interface Grade {
    courseId: string;
    courseCode: string;
    courseName: string;
    letterGrade: string;
    numericGrade: number;
    creditHours: number;
    instructor: string;
    semester: string;
    lastUpdated: string;
    trend?: "up" | "down" | "stable";
}

interface Child {
    id: string;
    name: string;
    grade: string;
}

const dummyChildren: Child[] = [
    { id: "child-1", name: "Ayaan Omer", grade: "Grade 5" },
    { id: "child-2", name: "Layla Omer", grade: "Grade 3" },
];

const dummyGradesMap: Record<string, Grade[]> = {
    "child-1": [
        { 
            courseId: "c1", 
            courseCode: "CS101", 
            courseName: "Computer Science 101", 
            letterGrade: "A", 
            numericGrade: 95, 
            creditHours: 3,
            instructor: "Dr. Smith",
            semester: "Fall 2025",
            lastUpdated: "2025-01-15",
            trend: "up"
        },
        { 
            courseId: "c2", 
            courseCode: "MATH101", 
            courseName: "Mathematics 101", 
            letterGrade: "B+", 
            numericGrade: 87, 
            creditHours: 4,
            instructor: "Ms. Johnson",
            semester: "Fall 2025",
            lastUpdated: "2025-01-15",
            trend: "stable"
        },
        { 
            courseId: "c3", 
            courseCode: "ENG102", 
            courseName: "English Literature", 
            letterGrade: "A-", 
            numericGrade: 90, 
            creditHours: 2,
            instructor: "Mr. Davis",
            semester: "Fall 2025",
            lastUpdated: "2025-01-15",
            trend: "up"
        },
        { 
            courseId: "c4", 
            courseCode: "SCI201", 
            courseName: "General Science", 
            letterGrade: "A", 
            numericGrade: 92, 
            creditHours: 3,
            instructor: "Dr. Brown",
            semester: "Fall 2025",
            lastUpdated: "2025-01-15",
            trend: "up"
        },
    ],
    "child-2": [
        { 
            courseId: "c5", 
            courseCode: "BIO101", 
            courseName: "Biology Basics", 
            letterGrade: "B-", 
            numericGrade: 81, 
            creditHours: 3,
            instructor: "Prof. Wilson",
            semester: "Fall 2025",
            lastUpdated: "2025-01-15",
            trend: "down"
        },
        { 
            courseId: "c6", 
            courseCode: "HIST201", 
            courseName: "World History", 
            letterGrade: "C+", 
            numericGrade: 78, 
            creditHours: 3,
            instructor: "Ms. Garcia",
            semester: "Fall 2025",
            lastUpdated: "2025-01-15",
            trend: "stable"
        },
        { 
            courseId: "c7", 
            courseCode: "ART101", 
            courseName: "Art Fundamentals", 
            letterGrade: "A", 
            numericGrade: 94, 
            creditHours: 2,
            instructor: "Mr. Thompson",
            semester: "Fall 2025",
            lastUpdated: "2025-01-15",
            trend: "up"
        },
    ],
};

function GradeBadge({ grade, showTrend = false, trend }: { grade: string; showTrend?: boolean; trend?: "up" | "down" | "stable" }) {
    const getGradeColor = (letterGrade: string) => {
        if (["A", "A-", "A+"].includes(letterGrade)) return "bg-green-100 text-green-800 border-green-200";
        if (["B", "B+", "B-"].includes(letterGrade)) return "bg-blue-100 text-blue-800 border-blue-200";
        if (["C", "C+", "C-"].includes(letterGrade)) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (["D", "D+"].includes(letterGrade)) return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-red-100 text-red-800 border-red-200";
    };

    const getTrendIcon = (trend: "up" | "down" | "stable" | undefined) => {
        if (!trend) return null;
        switch (trend) {
            case "up":
                return <TrendingUp size={12} className="text-green-600" />;
            case "down":
                return <TrendingUp size={12} className="text-red-600 rotate-180" />;
            case "stable":
                return <div className="w-2 h-0.5 bg-gray-400" />;
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(grade)}`}>
                {grade}
            </span>
            {showTrend && trend && (
                <div className="flex items-center">
                    {getTrendIcon(trend)}
                </div>
            )}
        </div>
    );
}

function calculateAverage(grades: Grade[]) {
    const totalPoints = grades.reduce((acc, g) => acc + g.numericGrade * g.creditHours, 0);
    const totalCredits = grades.reduce((acc, g) => acc + g.creditHours, 0);
    return totalCredits ? totalPoints / totalCredits : 0;
}

function getGradeStats(grades: Grade[]) {
    if (grades.length === 0) return null;

    const highest = grades.reduce((max, g) => (g.numericGrade > max.numericGrade ? g : max), grades[0]);
    const lowest = grades.reduce((min, g) => (g.numericGrade < min.numericGrade ? g : min), grades[0]);
    
    const gradeDistribution = grades.reduce((acc, grade) => {
        const letter = grade.letterGrade.charAt(0);
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const improvingCourses = grades.filter(g => g.trend === "up").length;
    const decliningCourses = grades.filter(g => g.trend === "down").length;

    return {
        highest,
        lowest,
        gradeDistribution,
        improvingCourses,
        decliningCourses,
        totalCourses: grades.length
    };
}

function getPerformanceLevel(average: number): { level: string; color: string; icon: JSX.Element } {
    if (average >= 90) return { 
        level: "Excellent", 
        color: "from-green-500 to-emerald-600",
        icon: <Award className="w-6 h-6" />
    };
    if (average >= 80) return { 
        level: "Good", 
        color: "from-blue-500 to-cyan-600",
        icon: <TrendingUp className="w-6 h-6" />
    };
    if (average >= 70) return { 
        level: "Satisfactory", 
        color: "from-yellow-500 to-amber-600",
        icon: <Target className="w-6 h-6" />
    };
    return { 
        level: "Needs Improvement", 
        color: "from-orange-500 to-red-600",
        icon: <AlertCircle className="w-6 h-6" />
    };
}

export default function GradesOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [selectedChildId, setSelectedChildId] = useState(dummyChildren[0].id);
    const [selectedSemester, setSelectedSemester] = useState("Fall 2025");
    const [grades, setGrades] = useState<Grade[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        setTimeout(() => {
            try {
                const fetchedGrades = dummyGradesMap[selectedChildId] || [];
                setGrades(fetchedGrades);
                setLoading(false);
            } catch (err) {
                setError("Unable to load grades data. Please try again later.");
                setGrades([]);
                setLoading(false);
            }
        }, 1000);
    }, [selectedChildId, selectedSemester]);

    const averageGrade = calculateAverage(grades);
    const stats = getGradeStats(grades);
    const performance = getPerformanceLevel(averageGrade);
    const totalCredits = grades.reduce((acc, g) => acc + g.creditHours, 0);
    const selectedChild = dummyChildren.find(child => child.id === selectedChildId);

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Grades Overview
                        </h1>
                        <p className="text-gray-600 mt-2">Detailed academic performance and grade analysis</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-48">
                            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                <SelectTrigger className="bg-white border-gray-300">
                                    <SelectValue placeholder="Select Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Fall 2025", "Spring 2025", "Fall 2024", "Spring 2024"].map(sem => (
                                        <SelectItem key={sem} value={sem}>
                                            {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download size={16} />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Child Selector */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-64">
                                    <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                        <SelectTrigger className="bg-white border-gray-300">
                                            <div className="flex items-center gap-2">
                                                <User size={16} />
                                                <SelectValue placeholder="Select Child" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dummyChildren.map(child => (
                                                <SelectItem key={child.id} value={child.id}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{child.name}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                            {child.grade}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        
                        {selectedChild && (
                            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={14} className="text-indigo-600" />
                                    <span className="font-semibold text-indigo-900">{selectedChild.name}</span>
                                    <span className="text-indigo-600">•</span>
                                    <span className="text-indigo-700">{selectedChild.grade}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Error Loading Data</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Performance Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))
                    ) : (
                        <>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">Average Grade</p>
                                        <p className="text-3xl font-bold mt-1">{averageGrade.toFixed(1)}%</p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-purple-200" />
                                </div>
                                <div className="mt-4 text-purple-100 text-sm">
                                    Weighted average
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Courses</p>
                                        <p className="text-3xl font-bold mt-1">{grades.length}</p>
                                    </div>
                                    <BookOpen className="w-8 h-8 text-blue-200" />
                                </div>
                                <div className="mt-4 text-blue-100 text-sm">
                                    {totalCredits} credit hours
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Performance</p>
                                        <p className="text-2xl font-bold mt-1">{performance.level}</p>
                                    </div>
                                    {performance.icon}
                                </div>
                                <div className="mt-4 text-green-100 text-sm">
                                    Current level
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm font-medium">Trending Up</p>
                                        <p className="text-3xl font-bold mt-1">{stats?.improvingCourses || 0}</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-orange-200" />
                                </div>
                                <div className="mt-4 text-orange-100 text-sm">
                                    Courses improving
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Grades Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Course Grades {selectedChild && `- ${selectedChild.name}`}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {grades.length} course{grades.length !== 1 ? 's' : ''} • {selectedSemester}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Star size={14} className="text-yellow-500" />
                                Last updated: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                                ))}
                            </div>
                        ) : grades.length === 0 ? (
                            <div className="p-12 text-center">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No grades available</h4>
                                <p className="text-gray-500">
                                    No grade data found for the selected child and semester.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Instructor</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Credits</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Letter Grade</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Numeric Grade</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {grades.map((course) => (
                                        <tr key={course.courseId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{course.courseCode}</span>
                                                    <span className="text-sm text-gray-500">{course.courseName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 text-sm">{course.instructor}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">{course.creditHours}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <GradeBadge grade={course.letterGrade} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">
                                                    {course.numericGrade.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <GradeBadge grade={course.letterGrade} showTrend trend={course.trend} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Performance Insights */}
                {!loading && stats && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                <Award size={20} />
                                Top Performance
                            </h4>
                            {stats.highest && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-800 font-medium">{stats.highest.courseCode}</span>
                                        <GradeBadge grade={stats.highest.letterGrade} />
                                    </div>
                                    <p className="text-blue-700 text-sm">{stats.highest.courseName}</p>
                                    <div className="flex justify-between text-sm text-blue-800">
                                        <span>Grade: <strong>{stats.highest.numericGrade.toFixed(1)}%</strong></span>
                                        <span>Credits: <strong>{stats.highest.creditHours}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                            <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                                <Target size={20} />
                                Areas for Improvement
                            </h4>
                            {stats.lowest && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-orange-800 font-medium">{stats.lowest.courseCode}</span>
                                        <GradeBadge grade={stats.lowest.letterGrade} />
                                    </div>
                                    <p className="text-orange-700 text-sm">{stats.lowest.courseName}</p>
                                    <div className="flex justify-between text-sm text-orange-800">
                                        <span>Grade: <strong>{stats.lowest.numericGrade.toFixed(1)}%</strong></span>
                                        <span>Credits: <strong>{stats.lowest.creditHours}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}