"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface CourseDetail {
    programId: string;
    courseId: string;
    courseName: string;
    description: string;
    teacherNotes?: string;
    resources?: string[];
    teacherName?: string;
    teacherAvatarUrl?: string;
}

// Demo data with teacher info and avatar from Unsplash
const courseDetailsData: CourseDetail[] = [
    {
        programId: "computer-science",
        courseId: "intro-to-programming",
        courseName: "Intro to Programming",
        description:
            "An introduction to programming fundamentals using Python and JavaScript.",
        teacherNotes:
            "Focus on problem-solving and basic syntax. Use hands-on labs weekly.",
        resources: [
            "Official Python Docs",
            "JavaScript MDN Guide",
            "Codecademy Python Course",
        ],
        teacherName: "Alice Johnson",
        teacherAvatarUrl:
            "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&q=80",
    },
    {
        programId: "mba",
        courseId: "principles-of-management",
        courseName: "Principles of Management",
        description:
            "Covers fundamental management principles, organizational structures, and leadership.",
        teacherNotes:
            "Incorporate case studies and guest lectures from industry leaders.",
        resources: [
            "Harvard Business Review",
            "Management by Drucker",
            "LinkedIn Learning",
        ],
        teacherName: "Mark Spencer",
        teacherAvatarUrl:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&q=80",
    },
    // Add more course details as needed
];

export default function CourseDetailsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const parts = pathname.split("/");
    const programId = parts[parts.indexOf("programs") + 1];
    const courseId = parts[parts.indexOf("courses") + 1];

    const [course, setCourse] = useState<CourseDetail | null>(null);

    useEffect(() => {
        const found = courseDetailsData.find(
            (c) => c.programId === programId && c.courseId === courseId
        );
        setCourse(found ?? null);
    }, [programId, courseId]);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <p className="text-gray-600 text-lg">Course details not found.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto rounded-lg shadow-lg">
            <button
                onClick={() => router.back()}
                className="mb-6 text-indigo-700 hover:text-indigo-900 font-semibold flex items-center space-x-2"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M15 18l-6-6 6-6"></path>
                </svg>
                <span>Back to Curriculum</span>
            </button>

            <h1 className="text-3xl font-extrabold text-indigo-900 mb-4">
                {course.courseName}
            </h1>
            <p className="text-gray-700 mb-8">{course.description}</p>

            {course.teacherNotes && (
                <section className="mb-10 bg-indigo-50 p-6 rounded-lg shadow-inner border border-indigo-200">
                    <div className="flex items-center mb-4">
                        {course.teacherAvatarUrl && (
                            <img
                                src={course.teacherAvatarUrl}
                                alt={`${course.teacherName} avatar`}
                                className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-indigo-300"
                                loading="lazy"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-800">
                                Teacher Notes
                            </h2>
                            {course.teacherName && (
                                <p className="text-indigo-700 text-sm font-medium">
                                    {course.teacherName}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-600 whitespace-pre-line">{course.teacherNotes}</p>
                </section>
            )}

            {course.resources && course.resources.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold text-indigo-800 mb-3">Resources</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {course.resources.map((res, idx) => (
                            <li
                                key={idx}
                                className="hover:text-indigo-600 transition cursor-pointer"
                                title={res}
                            >
                                {res}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
