"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
                // Replace with your real API fetch logic here
                setCourses(dummyCourses);
                setLoading(false);
            } catch {
                setError("Failed to load courses data.");
                setLoading(false);
            }
        }, 1200);
    }, []);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900 mb-4">My Courses</h1>

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
                        {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} className="h-36 rounded-lg" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <p className="text-center text-gray-500 italic">You are not enrolled in any courses.</p>
                ) : (
                    <div className="space-y-6">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="border border-indigo-200 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
                            >
                                <div className="md:w-2/3 space-y-1 mb-4 md:mb-0">
                                    <p className="font-semibold text-lg text-indigo-900">
                                        {course.code} - {course.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Instructor:</span> {course.instructor}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Credits:</span> {course.creditHours}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Current Progress:</span> {course.currentProgress ?? "N/A"}
                                    </p>
                                    {course.pendingActions && course.pendingActions.length > 0 && (
                                        <p className="text-sm text-yellow-700 font-semibold mt-1">
                                            Pending Actions:{" "}
                                            <span className="font-normal">
                                                {course.pendingActions.join(", ")}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <div className="md:w-1/3 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="text-indigo-900 font-semibold text-lg">
                                        Grade: {course.currentGrade.toFixed(1)}%
                                    </div>

                                    {course.nextAssignmentDue && (
                                        <div className="text-sm text-gray-600 whitespace-nowrap">
                                            Next Due: {new Date(course.nextAssignmentDue).toLocaleDateString()}
                                        </div>
                                    )}

                                    <Link
                                        href={`/dashboard/student/courses/${course.id}`}
                                        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                        aria-label={`View details and assignments for ${course.name}`}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
