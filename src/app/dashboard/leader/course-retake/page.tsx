"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    creditHours: number;
    semesterNumber: number; // 1, 2, 3, ...
    originalGrade: number; // Final grade %
    canRetake: boolean;
    retakeTeacher: string; // Teacher assigned for retake
}

// Dummy 6 courses per semester
const dummyCourses: Course[] = Array.from({ length: 4 }, (_, semIndex) =>
    Array.from({ length: 6 }, (_, courseIndex) => {
        const id = `course-${semIndex + 1}-${courseIndex + 1}`;
        return {
            id,
            code: `C${semIndex + 1}${courseIndex + 1}0${courseIndex + 1}`,
            name: `Course ${courseIndex + 1} - Semester ${semIndex + 1}`,
            creditHours: Math.floor(Math.random() * 3) + 2,
            semesterNumber: semIndex + 1,
            originalGrade: Math.floor(Math.random() * 60) + 30, // 30-90
            canRetake: Math.random() > 0.4, // 60% chance can retake
            retakeTeacher: `Prof. Teacher ${courseIndex + 1}`
        };
    })
).flat();

export default function CourseRetakePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [courses, setCourses] = useState<Course[]>([]);

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

    const semesterNumbers = Array.from(new Set(dummyCourses.map((c) => c.semesterNumber))).sort(
        (a, b) => a - b
    );

    return (
        <DashboardLayout loading={loading} user={user}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900 mb-4">Course Retake</h1>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Semester number filter */}
                <div className="mb-6">
                    <label htmlFor="semester-select" className="block mb-2 font-semibold text-indigo-900">
                        Filter by Semester Number
                    </label>
                    <select
                        id="semester-select"
                        className="border rounded px-3 py-2 w-48"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(Number(e.target.value))}
                        disabled={loading}
                    >
                        {semesterNumbers.map((num) => (
                            <option key={num} value={num}>
                                Semester {num}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-28 rounded-lg" />
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <p className="text-center text-gray-500 italic">No courses eligible for retake this semester.</p>
                ) : (
                    <div className="space-y-4">
                        {filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                className="border border-indigo-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                            >
                                <div>
                                    <p className="font-semibold text-lg text-indigo-900">
                                        {course.code} - {course.name}
                                    </p>
                                    <p className="text-sm text-gray-600">Credits: {course.creditHours}</p>
                                    <p className="text-sm text-gray-600">Retake Teacher: {course.retakeTeacher}</p>
                                    <p className="text-sm text-red-600 font-semibold">
                                        Final Grade: {course.originalGrade}%
                                    </p>
                                </div>

                                <div className="mt-3 md:mt-0">
                                    <button
                                        onClick={() => handleRetakeClick(course.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                        aria-label={`Retake ${course.name}`}
                                        disabled={processingRetake}
                                    >
                                        Retake
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirmation dialog */}
                {confirmingCourseId && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md p-6 space-y-4">
                            <h2 className="text-xl font-bold text-red-700">Confirm Retake</h2>
                            <p>Are you sure you want to retake this course? This will register you for the retake session with the assigned teacher.</p>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={cancelRetake}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                                    disabled={processingRetake}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRetake}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    disabled={processingRetake}
                                >
                                    {processingRetake ? "Processing..." : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
