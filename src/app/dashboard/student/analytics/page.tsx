"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
interface CourseProgress {
    id: string;
    code: string;
    name: string;
    creditHours: number;
    semester: number;
    grades: {
        final: number; // percentage
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
        grades: { final: 90, midterm: 88, assignment: 95, project: 92 },
    },
    {
        id: "course-uuid-2",
        code: "MATH201",
        name: "Advanced Mathematics",
        creditHours: 4,
        semester: 1,
        grades: { final: 85, midterm: 80, assignment: 90, project: 87 },
    },
    {
        id: "course-uuid-3",
        code: "ENG102",
        name: "English Literature",
        creditHours: 2,
        semester: 2,
        grades: { final: 78, midterm: 75, assignment: 80, project: 79 },
    },
    {
        id: "course-uuid-4",
        code: "HIST210",
        name: "World History",
        creditHours: 3,
        semester: 2,
        grades: { final: 85, midterm: 83, assignment: 88, project: 84 },
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

export default function ProgressPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<CourseProgress[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");

    // This state holds which marks checkboxes are checked per course by id
    // Example: { "course-uuid-1": { final: true, midterm: false, assignment: true, project: false } }
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

    // Filter courses by selected semester or show all
    const filteredCourses =
        selectedSemester === "all"
            ? courses
            : courses.filter((course) => course.semester === selectedSemester);

    // Calculate total credits & GPA only on filtered courses
    const totalCredits = filteredCourses.reduce((sum, c) => sum + c.creditHours, 0);
    const totalGradePoints = filteredCourses.reduce(
        (sum, c) => {
            // Use weighted average of marks for GPA calculation (example)
            const avgGrade =
                (c.grades.final + c.grades.midterm + c.grades.assignment + c.grades.project) / 4;
            return sum + gradeToGPA(avgGrade) * c.creditHours;
        },
        0
    );
    const gpa = totalCredits ? totalGradePoints / totalCredits : 0;

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

    // Get all unique semesters to build dropdown options
    const semesters = Array.from(new Set(courses.map((c) => c.semester))).sort((a, b) => a - b);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow max-w-5xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900">Academic Progress</h1>

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
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-16 rounded-lg" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <p className="text-center text-gray-500 italic">No course progress data available.</p>
                ) : (
                    <>
                        {/* Semester selector */}
                        <div className="mb-6">
                            <label htmlFor="semester-select" className="font-semibold text-indigo-900 mr-2">
                                Select Semester:
                            </label>
                            <select
                                id="semester-select"
                                value={selectedSemester}
                                onChange={(e) =>
                                    setSelectedSemester(e.target.value === "all" ? "all" : Number(e.target.value))
                                }
                                className="border border-indigo-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Semesters</option>
                                {semesters.map((sem) => (
                                    <option key={sem} value={sem}>
                                        Semester {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Summary */}
                        <div className="flex flex-col sm:flex-row justify-between items-center border border-indigo-200 rounded p-4 mb-6">
                            <div>
                                <p className="text-gray-700 text-lg font-semibold">Total Credit Hours</p>
                                <p className="text-indigo-900 text-2xl font-bold">{totalCredits}</p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <p className="text-gray-700 text-lg font-semibold">Current GPA</p>
                                <p className="text-indigo-900 text-3xl font-extrabold">{gpa.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Courses list */}
                        <section>
                            <h2 className="text-xl font-semibold text-indigo-900 mb-4">Courses</h2>
                            <ul className="space-y-6">
                                {filteredCourses.map(({ id, code, name, creditHours, grades }) => {
                                    const avgGrade =
                                        (grades.final + grades.midterm + grades.assignment + grades.project) / 4;

                                    return (
                                        <li
                                            key={id}
                                            className="border border-indigo-300 rounded-lg p-5 bg-indigo-50"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                                <div>
                                                    <p className="font-semibold text-indigo-900 text-lg">
                                                        {code} - {name}
                                                    </p>
                                                    <p className="text-gray-700">Credits: {creditHours}</p>
                                                </div>
                                                <p className="text-indigo-900 font-bold text-xl">
                                                    Avg Grade: {avgGrade.toFixed(1)}%
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mb-4">
                                                {(["final", "midterm", "assignment", "project"] as const).map(
                                                    (mark) => (
                                                        <label
                                                            key={mark}
                                                            className="inline-flex items-center gap-2 cursor-pointer select-none"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={visibleMarks[id]?.[mark] || false}
                                                                onChange={() => toggleMark(id, mark)}
                                                                className="cursor-pointer"
                                                            />
                                                            <span className="capitalize">{mark}</span>
                                                        </label>
                                                    )
                                                )}
                                            </div>

                                            {/* Show marks if toggled */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {visibleMarks[id]?.final && (
                                                    <div className="bg-white p-3 rounded border border-indigo-300 text-indigo-900 text-center shadow-sm">
                                                        <p className="font-semibold">Final Exam</p>
                                                        <p className="text-xl">{grades.final}%</p>
                                                    </div>
                                                )}
                                                {visibleMarks[id]?.midterm && (
                                                    <div className="bg-white p-3 rounded border border-indigo-300 text-indigo-900 text-center shadow-sm">
                                                        <p className="font-semibold">Midterm Exam</p>
                                                        <p className="text-xl">{grades.midterm}%</p>
                                                    </div>
                                                )}
                                                {visibleMarks[id]?.assignment && (
                                                    <div className="bg-white p-3 rounded border border-indigo-300 text-indigo-900 text-center shadow-sm">
                                                        <p className="font-semibold">Assignments</p>
                                                        <p className="text-xl">{grades.assignment}%</p>
                                                    </div>
                                                )}
                                                {visibleMarks[id]?.project && (
                                                    <div className="bg-white p-3 rounded border border-indigo-300 text-indigo-900 text-center shadow-sm">
                                                        <p className="font-semibold">Project</p>
                                                        <p className="text-xl">{grades.project}%</p>
                                                    </div>
                                                )}
                                            </div>
                                            {/* VIEW DETAILS BUTTON */}
                                            <div className="text-right">
                                                <Link
                                                    href={`/dashboard/student/analytics/${id}/`}
                                                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                                    aria-label={`View detailed progress for ${name}`}
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    </>
                )}
            </section>
        </DashboardLayout>
    );
}
