"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface CourseProgress {
    id: string;
    code: string;
    name: string;
    creditHours: number;
    grade: string; // e.g., A, B+, C
    status: "Passed" | "Failed" | "In Progress";
}

const dummyCourses: CourseProgress[] = [
    { id: "course-uuid-1", code: "CS101", name: "Computer Science 101", creditHours: 3, grade: "A", status: "Passed" },
    { id: "course-uuid-2", code: "MATH101", name: "Mathematics 101", creditHours: 4, grade: "B+", status: "Passed" },
    { id: "course-uuid-3", code: "ENG102", name: "English Literature", creditHours: 2, grade: "-", status: "In Progress" },
    { id: "course-uuid-4", code: "HIST201", name: "World History", creditHours: 3, grade: "D", status: "Failed" },
];

// Helper to convert grade to GPA points (example scale)
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

function statusBadge(status: CourseProgress["status"]) {
    switch (status) {
        case "Passed":
            return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle2 size={14} />Passed</Badge>;
        case "Failed":
            return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle size={14} />Failed</Badge>;
        case "In Progress":
            return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">In Progress</Badge>;
    }
}

export default function ProgressReportPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    // Could also do semester or academic year filter
    const [selectedSemester, setSelectedSemester] = useState("Fall 2025");
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
            // TODO: Replace with real API fetch filtered by semester and user
            setProgressData(dummyCourses);
            setLoading(false);
        }, 1000);
    }, [selectedSemester]);

    // Calculate GPA weighted average
    const totalPoints = progressData.reduce((sum, course) => {
        const points = gradeToPoints(course.grade);
        return course.status !== "In Progress" ? sum + points * course.creditHours : sum;
    }, 0);
    const totalCredits = progressData.reduce((sum, course) => (course.status !== "In Progress" ? sum + course.creditHours : sum), 0);
    const gpa = totalCredits ? totalPoints / totalCredits : 0;

    // Counts
    const passedCount = progressData.filter(c => c.status === "Passed").length;
    const failedCount = progressData.filter(c => c.status === "Failed").length;
    const inProgressCount = progressData.filter(c => c.status === "In Progress").length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Header & Semester Selector */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900">Progress Report</h2>
                        <p className="text-gray-600">View academic progress and GPA for your child.</p>
                    </div>

                    <div className="w-48">
                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                            <SelectTrigger>
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

                {/* Summary Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <h3 className="text-sm font-semibold text-indigo-900">GPA</h3>
                            <p className="text-xl font-bold">{gpa.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="text-sm font-semibold text-green-900">Passed Courses</h3>
                            <p className="text-xl font-bold">{passedCount}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h3 className="text-sm font-semibold text-red-900">Failed Courses</h3>
                            <p className="text-xl font-bold">{failedCount}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="text-sm font-semibold text-yellow-900">In Progress</h3>
                            <p className="text-xl font-bold">{inProgressCount}</p>
                        </div>
                    </div>
                )}

                {/* Progress Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <Skeleton className="h-40 w-full rounded-lg" />
                    ) : progressData.length === 0 ? (
                        <p className="text-center text-gray-500 italic">No progress data found.</p>
                    ) : (
                        <table className="min-w-full border border-indigo-200 rounded-lg overflow-hidden">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-indigo-900 border-b">Course</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-indigo-900 border-b">Credit Hours</th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-indigo-900 border-b">Grade</th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-indigo-900 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progressData.map(({ id, code, name, creditHours, grade, status }) => (
                                    <tr key={id} className="hover:bg-indigo-50">
                                        <td className="px-4 py-2 border-b">{code} - {name}</td>
                                        <td className="px-4 py-2 border-b">{creditHours}</td>
                                        <td className="px-4 py-2 border-b text-center">{grade === "-" ? "N/A" : grade}</td>
                                        <td className="px-4 py-2 border-b text-center">{statusBadge(status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </DashboardLayout>
    );
}
