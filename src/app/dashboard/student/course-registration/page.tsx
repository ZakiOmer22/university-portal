"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    instructor: string;
    creditHours: number;
}

const dummyAvailableCourses: Course[] = [
    { id: "course-uuid-1", code: "CS101", name: "Computer Science 101", instructor: "Dr. Smith", creditHours: 3 },
    { id: "course-uuid-2", code: "MATH201", name: "Advanced Mathematics", instructor: "Prof. Jane", creditHours: 4 },
    { id: "course-uuid-3", code: "ENG105", name: "English Literature", instructor: "Ms. Green", creditHours: 2 },
    { id: "course-uuid-4", code: "HIST210", name: "World History", instructor: "Mr. Black", creditHours: 3 },
];

export default function CourseRegistrationPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    // Simulate registered courses
    const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>(["course-uuid-1", "course-uuid-2"]);

    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

    useEffect(() => {
        // Load user
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        // Simulate API fetch
        setTimeout(() => {
            try {
                setAvailableCourses(dummyAvailableCourses);
                setLoading(false);
            } catch {
                setError("Failed to load available courses.");
                setLoading(false);
            }
        }, 1200);
    }, []);

    function registerCourse(courseId: string) {
        setLoading(true);
        setTimeout(() => {
            if (!registeredCourseIds.includes(courseId)) {
                setRegisteredCourseIds((prev) => [...prev, courseId]);
            }
            setLoading(false);
        }, 800);
    }

    return (
        <DashboardLayout loading={loading} user={user}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900 mb-4">Course Registration</h1>

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
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-28 rounded-lg" />
                        ))}
                    </div>
                ) : availableCourses.length === 0 ? (
                    <p className="text-center text-gray-500 italic">No courses available for registration.</p>
                ) : (
                    <div className="space-y-4">
                        {availableCourses.map((course) => {
                            const isRegistered = registeredCourseIds.includes(course.id);

                            return (
                                <div
                                    key={course.id}
                                    className={`border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center
                  ${isRegistered ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"}`}
                                >
                                    <div>
                                        <p className="font-semibold text-lg text-indigo-900">
                                            {course.code} - {course.name}
                                        </p>
                                        <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            Credit Hours: {course.creditHours}
                                        </p>
                                    </div>

                                    <div className="mt-3 md:mt-0">
                                        {isRegistered ? (
                                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                                <CheckCircle2 size={16} /> Registered
                                            </Badge>
                                        ) : (
                                            <button
                                                onClick={() => registerCourse(course.id)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                                aria-label={`Register for ${course.name}`}
                                                disabled={loading}
                                            >
                                                Register
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
