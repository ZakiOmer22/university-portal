"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Assignment {
    id: string;
    title: string;
    dueDate: string; // ISO date string
    courseId: string;
    courseCode: string;
    courseName: string;
    status: "pending" | "completed" | "overdue";
}

const dummyAssignments: Assignment[] = [
    {
        id: "a1",
        title: "Project Proposal",
        dueDate: "2025-08-20",
        courseId: "course-uuid-1",
        courseCode: "CS101",
        courseName: "Computer Science 101",
        status: "pending",
    },
    {
        id: "a2",
        title: "Final Exam",
        dueDate: "2025-09-15",
        courseId: "course-uuid-1",
        courseCode: "CS101",
        courseName: "Computer Science 101",
        status: "pending",
    },
    {
        id: "a3",
        title: "Homework 5",
        dueDate: "2025-08-18",
        courseId: "course-uuid-2",
        courseCode: "MATH201",
        courseName: "Advanced Mathematics",
        status: "completed",
    },
    {
        id: "a4",
        title: "Midterm Exam",
        dueDate: "2025-08-25",
        courseId: "course-uuid-2",
        courseCode: "MATH201",
        courseName: "Advanced Mathematics",
        status: "pending",
    },
];

// Helper to render status badges
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

export default function AssignmentsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        // Simulate API call delay
        setTimeout(() => {
            try {
                // Replace with real API call
                setAssignments(dummyAssignments);
                setLoading(false);
            } catch {
                setError("Failed to load assignments.");
                setLoading(false);
            }
        }, 1200);
    }, []);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900 mb-4">Assignments</h1>

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
                            <Skeleton key={i} className="h-28 rounded-lg" />
                        ))}
                    </div>
                ) : assignments.length === 0 ? (
                    <p className="text-center text-gray-500 italic">No assignments found.</p>
                ) : (
                    <ul className="space-y-4">
                        {assignments.map(({ id, title, dueDate, courseCode, courseName, status }) => (
                            <li
                                key={id}
                                className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4
                  ${status === "overdue"
                                        ? "border-red-400 bg-red-50"
                                        : status === "completed"
                                            ? "border-green-400 bg-green-50"
                                            : "border-yellow-400 bg-yellow-50"
                                    }
                `}
                            >
                                <div>
                                    <p className="font-semibold text-lg text-indigo-900">{title}</p>
                                    <p className="text-sm text-gray-600">
                                        Course: {courseCode} - {courseName}
                                    </p>
                                    <p className="text-sm text-gray-600">Due: {new Date(dueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {statusBadge(status)}

                                    <Link
                                        href={`/dashboard/student/assignments/${id}`}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition whitespace-nowrap"
                                        aria-label={`View details for assignment ${title}`}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </DashboardLayout>
    );
}
