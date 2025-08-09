"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface Grade {
    courseId: string;
    courseCode: string;
    courseName: string;
    letterGrade: string; // e.g., A, B, C+
    numericGrade: number; // e.g., 92, 85, 78
    creditHours: number;
}

interface Child {
    id: string;
    name: string;
}

const dummyChildren: Child[] = [
    { id: "child-1", name: "Ayaan Omer" },
    { id: "child-2", name: "Layla Omer" },
];

// Dummy grades per childId
const dummyGradesMap: Record<string, Grade[]> = {
    "child-1": [
        { courseId: "c1", courseCode: "CS101", courseName: "Computer Science 101", letterGrade: "A", numericGrade: 95, creditHours: 3 },
        { courseId: "c2", courseCode: "MATH101", courseName: "Mathematics 101", letterGrade: "B+", numericGrade: 87, creditHours: 4 },
        { courseId: "c3", courseCode: "ENG102", courseName: "English Literature", letterGrade: "A-", numericGrade: 90, creditHours: 2 },
    ],
    "child-2": [
        { courseId: "c4", courseCode: "BIO101", courseName: "Biology Basics", letterGrade: "B-", numericGrade: 81, creditHours: 3 },
        { courseId: "c5", courseCode: "HIST201", courseName: "World History", letterGrade: "C", numericGrade: 75, creditHours: 3 },
    ],
};

function gradeBadge(grade: string) {
    if (["A", "A-", "A+"].includes(grade)) {
        return <Badge className="bg-green-100 text-green-800">{grade}</Badge>;
    }
    if (["B", "B+", "B-"].includes(grade)) {
        return <Badge className="bg-yellow-100 text-yellow-800">{grade}</Badge>;
    }
    if (["C", "C+", "C-"].includes(grade)) {
        return <Badge className="bg-orange-100 text-orange-800">{grade}</Badge>;
    }
    if (["D", "D+"].includes(grade)) {
        return <Badge className="bg-red-100 text-red-800">{grade}</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">{grade}</Badge>;
}

function calculateAverage(grades: Grade[]) {
    const totalPoints = grades.reduce((acc, g) => acc + g.numericGrade * g.creditHours, 0);
    const totalCredits = grades.reduce((acc, g) => acc + g.creditHours, 0);
    return totalCredits ? totalPoints / totalCredits : 0;
}

function getHighestGrade(grades: Grade[]) {
    if (grades.length === 0) return null;
    return grades.reduce((max, g) => (g.numericGrade > max.numericGrade ? g : max), grades[0]);
}

function getLowestGrade(grades: Grade[]) {
    if (grades.length === 0) return null;
    return grades.reduce((min, g) => (g.numericGrade < min.numericGrade ? g : min), grades[0]);
}

export default function GradesOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    const [selectedChildId, setSelectedChildId] = useState(dummyChildren[0].id);
    const [grades, setGrades] = useState<Grade[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate fetch grades for selected child
        setTimeout(() => {
            // Simulated API fetch by childId
            const fetchedGrades = dummyGradesMap[selectedChildId] || [];
            setGrades(fetchedGrades);
            setLoading(false);
        }, 1000);
    }, [selectedChildId]);

    const averageGrade = calculateAverage(grades);
    const highestGrade = getHighestGrade(grades);
    const lowestGrade = getLowestGrade(grades);
    const totalCredits = grades.reduce((acc, g) => acc + g.creditHours, 0);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white rounded-lg shadow p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900">Grades Overview</h2>
                        <p className="text-gray-600">Review your child's academic grades in detail.</p>
                    </div>

                    <div className="w-56">
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Child" />
                            </SelectTrigger>
                            <SelectContent>
                                {dummyChildren.map(child => (
                                    <SelectItem key={child.id} value={child.id}>
                                        {child.name}
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

                {loading ? (
                    <Skeleton className="h-48 rounded-lg" />
                ) : grades.length === 0 ? (
                    <p className="text-center text-gray-500 italic">No grades available.</p>
                ) : (
                    <>
                        {/* Analytics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
                                <h3 className="text-sm font-semibold text-indigo-900">Average Grade</h3>
                                <p className="text-3xl font-bold">{averageGrade.toFixed(2)}%</p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                                <h3 className="text-sm font-semibold text-blue-900">Total Courses</h3>
                                <p className="text-3xl font-bold">{grades.length}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                                <h3 className="text-sm font-semibold text-green-900">Total Credit Hours</h3>
                                <p className="text-3xl font-bold">{totalCredits}</p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                                <h3 className="text-sm font-semibold text-yellow-900">Highest Grade</h3>
                                {highestGrade ? (
                                    <>
                                        <p className="font-semibold">{highestGrade.courseCode}</p>
                                        {gradeBadge(highestGrade.letterGrade)}
                                        <p>{highestGrade.numericGrade.toFixed(1)}%</p>
                                    </>
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                                <h3 className="text-sm font-semibold text-red-900">Lowest Grade</h3>
                                {lowestGrade ? (
                                    <>
                                        <p className="font-semibold">{lowestGrade.courseCode}</p>
                                        {gradeBadge(lowestGrade.letterGrade)}
                                        <p>{lowestGrade.numericGrade.toFixed(1)}%</p>
                                    </>
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>

                        {/* Grades Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-indigo-200 rounded-lg overflow-hidden">
                                <thead className="bg-indigo-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-indigo-900 border-b">
                                            Course
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-indigo-900 border-b">
                                            Credit Hours
                                        </th>
                                        <th className="px-4 py-2 text-center text-sm font-semibold text-indigo-900 border-b">
                                            Letter Grade
                                        </th>
                                        <th className="px-4 py-2 text-center text-sm font-semibold text-indigo-900 border-b">
                                            Numeric Grade (%)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.map(({ courseId, courseCode, courseName, creditHours, letterGrade, numericGrade }) => (
                                        <tr key={courseId} className="hover:bg-indigo-50">
                                            <td className="px-4 py-2 border-b">
                                                {courseCode} - {courseName}
                                            </td>
                                            <td className="px-4 py-2 border-b">{creditHours}</td>
                                            <td className="px-4 py-2 border-b text-center">{gradeBadge(letterGrade)}</td>
                                            <td className="px-4 py-2 border-b text-center">{numericGrade.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>
        </DashboardLayout>
    );
}
