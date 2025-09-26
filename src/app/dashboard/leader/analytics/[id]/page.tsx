"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    grades: GradeDetails;
    semester: string;
    attendancePercentage: number;
    lastUpdated: string; // ISO string
}

// Dummy data for demo
const dummyProgressData: Record<string, CourseProgressDetail> = {
    "course-uuid-1": {
        id: "course-uuid-1",
        code: "CS101",
        name: "Computer Science 101",
        creditHours: 3,
        instructor: "Dr. Smith",
        grades: {
            final: 88,
            midterm: 90,
            assignments: 92,
            projects: 85,
            overall: 89,
            remarks: "Good performance, keep up the great work!",
        },
        semester: "Fall 2025",
        attendancePercentage: 95,
        lastUpdated: "2025-08-01T12:00:00Z",
    },
    "course-uuid-2": {
        id: "course-uuid-2",
        code: "MATH201",
        name: "Advanced Mathematics",
        creditHours: 4,
        instructor: "Prof. Jane",
        grades: {
            final: 80,
            midterm: 78,
            assignments: 85,
            projects: 82,
            overall: 81,
            remarks: "Needs improvement on midterm exam.",
        },
        semester: "Fall 2025",
        attendancePercentage: 89,
        lastUpdated: "2025-07-30T14:00:00Z",
    },
};

export default function CourseProgressDetailPage() {
    const params = useParams();
    const courseIdParam = params?.id;
    // Narrow the courseId to a string from possibly string[]
    const courseId = Array.isArray(courseIdParam) ? courseIdParam[0] : courseIdParam ?? "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [courseProgress, setCourseProgress] = useState<CourseProgressDetail | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API fetch delay
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
            <section className="bg-white rounded-lg shadow p-6 space-y-6">
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
                    <>
                        <Skeleton className="h-10 w-64 mb-6" />
                        <Skeleton className="h-6 w-48 mb-3" />
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                    </>
                ) : courseProgress ? (
                    <>
                        <h1 className="text-3xl font-bold text-indigo-900">
                            {courseProgress.code} - {courseProgress.name}
                        </h1>

                        <p className="text-gray-600">Instructor: {courseProgress.instructor}</p>
                        <p className="text-gray-600">Credits: {courseProgress.creditHours}</p>
                        <p className="text-gray-600 mb-4">Semester: {courseProgress.semester}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Grades Breakdown */}
                            <div className="bg-indigo-50 rounded-lg p-6 shadow">
                                <h2 className="text-xl font-semibold mb-4 text-indigo-900">Grades Breakdown</h2>
                                <ul className="space-y-3">
                                    <li>
                                        <strong>Final Exam:</strong> {courseProgress.grades.final}%
                                    </li>
                                    <li>
                                        <strong>Midterm Exam:</strong> {courseProgress.grades.midterm}%
                                    </li>
                                    <li>
                                        <strong>Assignments:</strong> {courseProgress.grades.assignments}%
                                    </li>
                                    <li>
                                        <strong>Projects:</strong> {courseProgress.grades.projects}%
                                    </li>
                                    <li className="mt-3 font-bold text-lg">
                                        Overall Grade: {courseProgress.grades.overall}%
                                    </li>
                                </ul>
                                {courseProgress.grades.remarks && (
                                    <p className="mt-4 italic text-gray-700">Notes: {courseProgress.grades.remarks}</p>
                                )}
                            </div>

                            {/* Attendance & Last Update */}
                            <div className="bg-indigo-50 rounded-lg p-6 shadow">
                                <h2 className="text-xl font-semibold mb-4 text-indigo-900">Attendance & Updates</h2>
                                <p>
                                    <strong>Attendance:</strong> {courseProgress.attendancePercentage}%
                                </p>
                                <p>
                                    <strong>Last Updated:</strong>{" "}
                                    {new Date(courseProgress.lastUpdated).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </>
                ) : null}
            </section>
        </DashboardLayout>
    );
}
