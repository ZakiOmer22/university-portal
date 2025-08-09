"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, CheckCircle2, XCircle, BookOpen, Upload, User } from "lucide-react";

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    status: "pending" | "completed" | "overdue";
}

interface CourseDetail {
    id: string;
    code: string;
    name: string;
    instructor: string;
    instructorAvatarUrl?: string; // added avatar url
    creditHours: number;
    currentGrade: number;
    assignments: Assignment[];
}

// Dummy data for demo purposes
const dummyCourseDetails: Record<string, CourseDetail> = {
    "course-uuid-1": {
        id: "course-uuid-1",
        code: "CS101",
        name: "Computer Science 101",
        instructor: "Dr. Smith",
        instructorAvatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        creditHours: 3,
        currentGrade: 92.5,
        assignments: [
            { id: "a1", title: "Project Proposal", dueDate: "2025-08-20", status: "pending" },
            { id: "a2", title: "Final Exam", dueDate: "2025-09-15", status: "pending" },
        ],
    },
    "course-uuid-2": {
        id: "course-uuid-2",
        code: "MATH201",
        name: "Advanced Mathematics",
        instructor: "Prof. Jane",
        instructorAvatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        creditHours: 4,
        currentGrade: 87,
        assignments: [
            { id: "a3", title: "Homework 5", dueDate: "2025-08-18", status: "completed" },
            { id: "a4", title: "Midterm Exam", dueDate: "2025-08-25", status: "pending" },
        ],
    },
};

function statusBadge(status: Assignment["status"]) {
    switch (status) {
        case "pending":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <Clock size={14} />
                    Pending
                </Badge>
            );
        case "completed":
            return (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                </Badge>
            );
        case "overdue":
            return (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                    <XCircle size={14} />
                    Overdue
                </Badge>
            );
    }
}

export default function CourseDetailPage() {
    const params = useParams();

    // Narrowing the courseId param to string
    const courseIdParam = params?.id;
    const courseId = Array.isArray(courseIdParam) ? courseIdParam[0] : courseIdParam ?? "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        // Load user info from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API fetch delay
        setTimeout(() => {
            if (dummyCourseDetails[courseId]) {
                setCourse(dummyCourseDetails[courseId]);
                setLoading(false);
            } else {
                setError("Course not found.");
                setLoading(false);
            }
        }, 1000);
    }, [courseId]);

    return (
        <DashboardLayout loading={loading} user={user}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6 max-w-4xl mx-auto">
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
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-40 rounded-lg mb-6" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-40 rounded-lg" />
                    </>
                ) : course ? (
                    <>
                        {/* Banner */}
                        <div className="bg-indigo-600 rounded-lg p-4 mb-6 text-white flex items-center gap-4">
                            <h1 className="text-3xl font-bold">
                                {course.code} - {course.name}
                            </h1>
                        </div>

                        {/* Instructor info and course id */}
                        <div className="flex items-center gap-4 mb-6">
                            {course.instructorAvatarUrl ? (
                                <img
                                    src={course.instructorAvatarUrl}
                                    alt={`${course.instructor} avatar`}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-600"
                                    loading="lazy"
                                />
                            ) : (
                                <User className="w-14 h-14 text-indigo-600" />
                            )}
                            <div>
                                <p className="font-semibold text-lg text-indigo-900">{course.instructor}</p>
                                <p className="text-gray-600 text-sm">Instructor</p>
                                <p className="text-gray-600 text-sm mt-1">
                                    <span className="font-semibold">Course ID:</span> {course.id}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    <span className="font-semibold flex items-center gap-1">
                                        Credit Hours: <span>{course.creditHours}</span> <BookOpen size={16} />
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Current grade */}
                        <p className="text-indigo-900 font-semibold text-xl mb-6">
                            Current Grade: {course.currentGrade.toFixed(1)}%
                        </p>

                        {/* Assignments Section */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                <Clock /> Assignments
                            </h2>
                            {course.assignments.length === 0 ? (
                                <p>No assignments found.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {course.assignments.map((a) => (
                                        <li
                                            key={a.id}
                                            className={`border rounded-lg p-3 ${a.status === "overdue"
                                                    ? "border-red-400 bg-red-50"
                                                    : a.status === "completed"
                                                        ? "border-green-400 bg-green-50"
                                                        : "border-yellow-400 bg-yellow-50"
                                                }`}
                                        >
                                            <p className="font-semibold">{a.title}</p>
                                            <p className="text-sm text-gray-600">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-700">{statusBadge(a.status)}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Submit Assignment Section */}
                        <section className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                <Upload /> Submit Assignment
                            </h2>
                            <p className="text-gray-700 italic">Feature coming soon: Upload your assignments here.</p>
                            {/* You can add a form or file input here later */}
                        </section>

                        {/* Books & Resources Section */}
                        <section className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                <BookOpen /> Books & Resources
                            </h2>
                            <p className="text-gray-700 italic">Feature coming soon: Access course books and materials here.</p>
                            {/* Add resource links or embedded materials here later */}
                        </section>

                        {/* Extras Section */}
                        <section className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold text-indigo-900 mb-3">Extras</h2>
                            <p className="text-gray-700 italic">Additional resources and notes will be displayed here.</p>
                        </section>
                    </>
                ) : null}
            </section>
        </DashboardLayout>
    );
}
