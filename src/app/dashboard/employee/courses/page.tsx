"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    uploadedAt: string;
    instructorName: string;
    instructorAvatar: string;
    department: string;
    applyLevel: string;
    approved: boolean;
}

const sampleCourses: Course[] = [
    {
        id: "cs101",
        title: "Intro to Computer Science",
        description:
            "Learn fundamentals of computer science with hands-on coding and projects.",
        thumbnail:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-01-10",
        instructorName: "Alice Johnson",
        instructorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        department: "Computer Science",
        applyLevel: "Undergraduate",
        approved: false,
    },
    {
        id: "mba-marketing",
        title: "Marketing Strategy Masterclass",
        description: "Deep dive into modern marketing techniques and digital tools.",
        thumbnail:
            "https://images.unsplash.com/photo-1515165562835-cd9d8d1f1e54?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-02-20",
        instructorName: "Michael Smith",
        instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        department: "Business Administration",
        applyLevel: "Masters",
        approved: true,
    },
    {
        id: "phd-psychology",
        title: "Advanced Psychology Research",
        description:
            "Explore advanced topics in psychology and research methodologies for PhD students.",
        thumbnail:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-03-05",
        instructorName: "Dr. Emily Carter",
        instructorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
        department: "Psychology",
        applyLevel: "PhD",
        approved: false,
    },
    {
        id: "env-sci-101",
        title: "Basics of Environmental Science",
        description: "Understanding ecosystems and sustainability principles.",
        thumbnail:
            "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-01-15",
        instructorName: "David Green",
        instructorAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
        department: "Environmental Science",
        applyLevel: "Undergraduate",
        approved: true,
    },
    {
        id: "civil-engg-struct",
        title: "Structural Analysis in Civil Engineering",
        description:
            "Learn to analyze structures using theoretical and practical methods.",
        thumbnail:
            "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-02-12",
        instructorName: "Karen Lee",
        instructorAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
        department: "Civil Engineering",
        applyLevel: "Undergraduate",
        approved: false,
    },
    // Adding more for 12 total:
    {
        id: "bio-101",
        title: "Introduction to Biology",
        description: "Study of life, cells, genetics, and ecosystems.",
        thumbnail:
            "https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-03-01",
        instructorName: "Sarah Williams",
        instructorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
        department: "Biology",
        applyLevel: "Undergraduate",
        approved: false,
    },
    {
        id: "art-history",
        title: "Modern Art History",
        description:
            "Explore major art movements and artists of the 19th and 20th centuries.",
        thumbnail:
            "https://images.unsplash.com/photo-1486308510493-cb5cacabb2f2?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-04-10",
        instructorName: "John Doe",
        instructorAvatar: "https://randomuser.me/api/portraits/men/21.jpg",
        department: "Arts",
        applyLevel: "Masters",
        approved: true,
    },
    {
        id: "finance-101",
        title: "Basics of Financial Accounting",
        description: "Understand financial statements, bookkeeping, and analysis.",
        thumbnail:
            "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-02-25",
        instructorName: "Linda Brown",
        instructorAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
        department: "Finance",
        applyLevel: "Undergraduate",
        approved: true,
    },
    {
        id: "law-101",
        title: "Introduction to Business Law",
        description: "Learn the basics of contracts, liabilities, and regulations.",
        thumbnail:
            "https://images.unsplash.com/photo-1551836022-4294eab73a38?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-01-28",
        instructorName: "Mark Green",
        instructorAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
        department: "Law",
        applyLevel: "Undergraduate",
        approved: false,
    },
    {
        id: "eng-lit",
        title: "English Literature: Shakespeare",
        description: "Study the works and influence of William Shakespeare.",
        thumbnail:
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-03-12",
        instructorName: "Emma Wilson",
        instructorAvatar: "https://randomuser.me/api/portraits/women/27.jpg",
        department: "Literature",
        applyLevel: "Masters",
        approved: true,
    },
    {
        id: "psych-101",
        title: "Intro to Psychology",
        description:
            "Understand human behavior, cognition, and emotions in psychology.",
        thumbnail:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
        uploadedAt: "2025-01-20",
        instructorName: "Dr. Emily Carter",
        instructorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
        department: "Psychology",
        applyLevel: "Undergraduate",
        approved: false,
    },
];

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filteredCourses = useMemo(() => {
        if (!searchTerm.trim()) return sampleCourses;
        const lower = searchTerm.toLowerCase();
        return sampleCourses.filter(
            (c) =>
                c.title.toLowerCase().includes(lower) ||
                c.instructorName.toLowerCase().includes(lower) ||
                c.department.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredCourses.length / pageSize);
    const pagedCourses = filteredCourses.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    function toggleApprove(id: string) {
        const index = sampleCourses.findIndex((c) => c.id === id);
        if (index >= 0) {
            sampleCourses[index].approved = !sampleCourses[index].approved;
            setPage(page); // trigger re-render
        }
    }

    return (
        <main className="min-h-screen p-6 bg-gray-50 flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <input
                    disabled
                    placeholder="Search courses (disabled)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow max-w-md rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <Link href="/reports/courses-print.html" target="_blank" rel="noopener noreferrer">
                    <button
                        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        title="Print courses"
                    >
                        Print
                    </button>
                </Link>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-grow">
                {pagedCourses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer flex flex-col max-h-[500px]"
                    >
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-40 object-cover rounded-t-lg flex-shrink-0"
                        />

                        <div className="p-4 flex flex-col flex-grow overflow-hidden">
                            <h2 className="text-lg font-bold text-indigo-900 mb-1 line-clamp-2">
                                {course.title}
                            </h2>

                            <div className="flex items-center gap-3 mb-2">
                                <img
                                    src={course.instructorAvatar}
                                    alt={course.instructorName}
                                    className="w-8 h-8 rounded-full border border-indigo-400 flex-shrink-0"
                                />
                                <span className="text-sm font-medium text-gray-700 truncate">
                                    {course.instructorName}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-3 mb-2 flex-grow overflow-hidden">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full px-3 py-1 truncate">
                                    {course.department}
                                </span>
                                <span className="bg-green-100 text-green-700 text-xs font-semibold rounded-full px-3 py-1 truncate">
                                    {course.applyLevel}
                                </span>
                                <span className="bg-gray-100 text-gray-700 text-xs font-semibold rounded-full px-3 py-1 truncate">
                                    Uploaded: {new Date(course.uploadedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <button
                                onClick={() => toggleApprove(course.id)}
                                className={`px-4 py-2 rounded-md font-semibold text-white transition ${course.approved
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-600 hover:bg-gray-700"
                                    }`}
                                title={course.approved ? "Approved" : "Approve Course"}
                            >
                                {course.approved ? "Approved" : "Approve"}
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            <footer className="flex justify-center items-center space-x-4 mt-auto">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
                >
                    Prev
                </button>
                <span className="font-semibold text-gray-700">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-200"
                >
                    Next
                </button>
            </footer>
        </main>
    );
}
