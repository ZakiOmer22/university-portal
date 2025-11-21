"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, XCircle, Clock, TrendingUp, BookOpen, Award, Target, BarChart3, Download } from "lucide-react";

interface CourseProgress {
    id: string;
    code: string;
    name: string;
    creditHours: number;
    grade: string;
    status: "Passed" | "Failed" | "In Progress";
    instructor: string;
    semester: string;
    progress?: number;
    lastUpdated: string;
}

const dummyCourses: CourseProgress[] = [
    { 
        id: "course-uuid-1", 
        code: "CS101", 
        name: "Computer Science 101", 
        creditHours: 3, 
        grade: "A", 
        status: "Passed",
        instructor: "Dr. Smith",
        semester: "Fall 2025",
        progress: 100,
        lastUpdated: "2025-01-15"
    },
    { 
        id: "course-uuid-2", 
        code: "MATH101", 
        name: "Mathematics 101", 
        creditHours: 4, 
        grade: "B+", 
        status: "Passed",
        instructor: "Ms. Johnson",
        semester: "Fall 2025",
        progress: 100,
        lastUpdated: "2025-01-15"
    },
    { 
        id: "course-uuid-3", 
        code: "ENG102", 
        name: "English Literature", 
        creditHours: 2, 
        grade: "-", 
        status: "In Progress",
        instructor: "Mr. Davis",
        semester: "Fall 2025",
        progress: 65,
        lastUpdated: "2025-01-15"
    },
    { 
        id: "course-uuid-4", 
        code: "HIST201", 
        name: "World History", 
        creditHours: 3, 
        grade: "D", 
        status: "Failed",
        instructor: "Prof. Wilson",
        semester: "Fall 2025",
        progress: 45,
        lastUpdated: "2025-01-15"
    },
    { 
        id: "course-uuid-5", 
        code: "SCI301", 
        name: "Advanced Science", 
        creditHours: 4, 
        grade: "A-", 
        status: "Passed",
        instructor: "Dr. Brown",
        semester: "Fall 2025",
        progress: 100,
        lastUpdated: "2025-01-15"
    },
];

// Helper to convert grade to GPA points
function gradeToPoints(grade: string): number {
    switch (grade) {
        case "A": return 4.0;
        case "A-": return 3.7;
        case "B+": return 3.3;
        case "B": return 3.0;
        case "B-": return 2.7;
        case "C+": return 2.3;
        case "C": return 2.0;
        case "C-": return 1.7;
        case "D+": return 1.3;
        case "D": return 1.0;
        case "F": return 0.0;
        default: return 0.0;
    }
}

function getGradeColor(grade: string): string {
    if (grade === "-") return "text-gray-500";
    
    const points = gradeToPoints(grade);
    if (points >= 3.7) return "text-green-600";
    if (points >= 3.0) return "text-blue-600";
    if (points >= 2.0) return "text-yellow-600";
    return "text-red-600";
}

function StatusBadge({ status }: { status: CourseProgress["status"] }) {
    const baseClasses = "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border";
    
    switch (status) {
        case "Passed":
            return <span className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}><CheckCircle2 size={14} />Passed</span>;
        case "Failed":
            return <span className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}><XCircle size={14} />Failed</span>;
        case "In Progress":
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`}><Clock size={14} />In Progress</span>;
    }
}

function ProgressBar({ progress, status }: { progress?: number; status: CourseProgress["status"] }) {
    const percentage = progress || 0;
    let color = "bg-gray-300";
    
    if (status === "Passed") color = "bg-green-500";
    else if (status === "Failed") color = "bg-red-500";
    else if (percentage >= 70) color = "bg-green-400";
    else if (percentage >= 50) color = "bg-yellow-400";
    else color = "bg-red-400";

    return (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className={`h-2 rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
}

export default function ProgressReportPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [selectedSemester, setSelectedSemester] = useState("Fall 2025");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [progressData, setProgressData] = useState<CourseProgress[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        setTimeout(() => {
            try {
                setProgressData(dummyCourses);
                setLoading(false);
            } catch (err) {
                setError("Unable to load progress data. Please try again later.");
                setProgressData([]);
                setLoading(false);
            }
        }, 1000);
    }, [selectedSemester]);

    const filteredData = progressData.filter(course => 
        selectedStatus === "all" || course.status.toLowerCase().replace(" ", "-") === selectedStatus
    );

    // Calculate GPA and statistics
    const totalPoints = progressData.reduce((sum, course) => {
        const points = gradeToPoints(course.grade);
        return course.status !== "In Progress" ? sum + points * course.creditHours : sum;
    }, 0);
    
    const totalCredits = progressData.reduce((sum, course) => 
        course.status !== "In Progress" ? sum + course.creditHours : sum, 0
    );
    
    const gpa = totalCredits ? totalPoints / totalCredits : 0;
    const completedCredits = progressData.filter(c => c.status === "Passed").reduce((sum, c) => sum + c.creditHours, 0);
    const inProgressCredits = progressData.filter(c => c.status === "In Progress").reduce((sum, c) => sum + c.creditHours, 0);

    // Counts
    const passedCount = progressData.filter(c => c.status === "Passed").length;
    const failedCount = progressData.filter(c => c.status === "Failed").length;
    const inProgressCount = progressData.filter(c => c.status === "In Progress").length;
    const totalCourses = progressData.length;

    // Performance metrics
    const completionRate = totalCourses > 0 ? (passedCount / totalCourses) * 100 : 0;
    const averageProgress = progressData.reduce((sum, course) => sum + (course.progress || 0), 0) / progressData.length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Progress Report
                        </h1>
                        <p className="text-gray-600 mt-2">Track academic performance and course progress</p>
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

                {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Error Loading Data</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Summary Cards */}
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
                                        <p className="text-purple-100 text-sm font-medium">Current GPA</p>
                                        <p className="text-3xl font-bold mt-1">{gpa.toFixed(2)}</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-purple-200" />
                                </div>
                                <div className="mt-4 text-purple-100 text-sm">
                                    {completedCredits} credits completed
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Courses Passed</p>
                                        <p className="text-3xl font-bold mt-1">{passedCount}</p>
                                    </div>
                                    <CheckCircle2 className="w-8 h-8 text-green-200" />
                                </div>
                                <div className="mt-4 text-green-100 text-sm">
                                    {completionRate.toFixed(0)}% success rate
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">In Progress</p>
                                        <p className="text-3xl font-bold mt-1">{inProgressCount}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-blue-200" />
                                </div>
                                <div className="mt-4 text-blue-100 text-sm">
                                    {inProgressCredits} credits ongoing
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm font-medium">Avg Progress</p>
                                        <p className="text-3xl font-bold mt-1">{averageProgress.toFixed(0)}%</p>
                                    </div>
                                    <Target className="w-8 h-8 text-orange-200" />
                                </div>
                                <div className="mt-4 text-orange-100 text-sm">
                                    Across all courses
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Progress Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Course Progress Details
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {filteredData.length} course{filteredData.length !== 1 ? 's' : ''} • {selectedSemester}
                                </p>
                            </div>
                            
                            <div className="flex gap-3">
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-40 bg-white border-gray-300">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="passed">Passed</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                    </SelectContent>
                                </Select>
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
                        ) : filteredData.length === 0 ? (
                            <div className="p-12 text-center">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No courses found</h4>
                                <p className="text-gray-500">
                                    {selectedStatus === "all" 
                                        ? "No course data available for this semester."
                                        : `No ${selectedStatus.replace('-', ' ')} courses found.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Instructor</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Credits</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Grade</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredData.map((course) => (
                                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{course.code}</span>
                                                    <span className="text-sm text-gray-500">{course.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700 text-sm">{course.instructor}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">{course.creditHours}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${getGradeColor(course.grade)}`}>
                                                    {course.grade === "-" ? "N/A" : course.grade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 w-32">
                                                    <ProgressBar progress={course.progress} status={course.status} />
                                                    <span className="text-sm text-gray-600 font-medium w-8">
                                                        {course.progress}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={course.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Performance Insights */}
                {!loading && progressData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                <BarChart3 size={20} />
                                Performance Summary
                            </h4>
                            <div className="space-y-3 text-sm text-blue-800">
                                <div className="flex justify-between">
                                    <span>Overall GPA:</span>
                                    <span className="font-semibold">{gpa.toFixed(2)} / 4.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Completion Rate:</span>
                                    <span className="font-semibold">{completionRate.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Credits Completed:</span>
                                    <span className="font-semibold">{completedCredits}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Courses in Progress:</span>
                                    <span className="font-semibold">{inProgressCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                            <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                                <Award size={20} />
                                Achievement Highlights
                            </h4>
                            <div className="space-y-2 text-sm text-green-800">
                                {passedCount > 0 && (
                                    <p>• Successfully completed <strong>{passedCount}</strong> course{passedCount !== 1 ? 's' : ''}</p>
                                )}
                                {gpa >= 3.5 && (
                                    <p>• Maintaining <strong>Dean&apos;s List</strong> level performance</p>
                                )}
                                {inProgressCount > 0 && (
                                    <p>• Actively progressing in <strong>{inProgressCount}</strong> course{inProgressCount !== 1 ? 's' : ''}</p>
                                )}
                                {completionRate >= 80 && (
                                    <p>• Excellent course completion rate of <strong>{completionRate.toFixed(1)}%</strong></p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}