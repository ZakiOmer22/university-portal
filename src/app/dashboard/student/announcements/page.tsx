"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";

interface Announcement {
    id: string;
    title: string;
    date: string; // ISO date string
    category: "General" | "Academic" | "Events";
    content: string;
}

const dummyAnnouncements: Announcement[] = [
    {
        id: "a1",
        title: "Campus Reopening Dates Announced",
        date: "2025-08-01T09:00:00Z",
        category: "General",
        content:
            "The University of Hargeisa will reopen for the Fall semester starting September 1st. Students are advised to complete registration by August 25th.",
    },
    {
        id: "a2",
        title: "Midterm Exams Schedule Released",
        date: "2025-09-15T12:00:00Z",
        category: "Academic",
        content:
            "The midterm exams will take place from October 10th to October 20th. Please check your respective department notice boards for detailed schedules.",
    },
    {
        id: "a3",
        title: "Health Awareness Week",
        date: "2025-08-20T08:00:00Z",
        category: "Events",
        content:
            "Join us for Health Awareness Week starting August 25th, with workshops and seminars on nutrition, mental health, and fitness at the Student Center.",
    },
    {
        id: "a4",
        title: "Library Extended Hours",
        date: "2025-09-05T14:00:00Z",
        category: "General",
        content:
            "The university library will extend its opening hours during exam weeks from 8 AM to 10 PM to support students' study needs.",
    },
    {
        id: "a5",
        title: "Scholarship Application Deadline",
        date: "2025-08-30T10:00:00Z",
        category: "Academic",
        content:
            "Applications for the 2025/2026 academic year scholarships close on September 15th. Make sure to submit your documents to the financial aid office.",
    },
    {
        id: "a6",
        title: "Cultural Festival Scheduled",
        date: "2025-09-25T16:00:00Z",
        category: "Events",
        content:
            "The annual Cultural Festival will be held on October 5th. All students are invited to participate and celebrate diverse traditions and arts.",
    },
    {
        id: "a7",
        title: "New Student Portal Features",
        date: "2025-08-10T11:00:00Z",
        category: "General",
        content:
            "We have launched new features in the student portal including improved course registration and real-time academic progress tracking.",
    },
    {
        id: "a8",
        title: "COVID-19 Guidelines Update",
        date: "2025-08-18T13:00:00Z",
        category: "General",
        content:
            "Please adhere to updated health guidelines including mandatory masks indoors and social distancing protocols to keep the campus safe.",
    },
    {
        id: "a9",
        title: "Guest Lecture Series",
        date: "2025-09-12T09:00:00Z",
        category: "Academic",
        content:
            "Renowned experts will present lectures on various topics in technology and health sciences throughout September. Check schedules online.",
    },
    {
        id: "a10",
        title: "Sports Day Announcement",
        date: "2025-09-20T10:00:00Z",
        category: "Events",
        content:
            "Sports Day will take place on October 15th at the University Sports Complex. Teams are forming now, join your favorite sport!",
    },
    // Past announcements (5 more)
    {
        id: "a11",
        title: "Graduation Ceremony Highlights",
        date: "2025-06-30T18:00:00Z",
        category: "General",
        content:
            "The 2025 Graduation Ceremony was held with great success. Congratulations to all graduates! View photos and videos on the official portal.",
    },
    {
        id: "a12",
        title: "Final Exam Results Released",
        date: "2025-07-10T08:30:00Z",
        category: "Academic",
        content:
            "Final exam results for the Spring semester are now available online. Students can check their results via the student portal.",
    },
    {
        id: "a13",
        title: "Campus Wi-Fi Upgrade Completed",
        date: "2025-07-15T13:00:00Z",
        category: "General",
        content:
            "The campus Wi-Fi has been upgraded to provide faster and more reliable internet access for all students and staff.",
    },
    {
        id: "a14",
        title: "Art Exhibition Opens Next Week",
        date: "2025-07-20T09:00:00Z",
        category: "Events",
        content:
            "The annual Art Exhibition opens next Monday at the University Gallery. All are welcome to view student and faculty artworks.",
    },
    {
        id: "a15",
        title: "Student Council Elections Results",
        date: "2025-07-25T12:00:00Z",
        category: "General",
        content:
            "The Student Council election results are out. Congratulations to the new council members who will serve for the 2025/2026 term.",
    },
];

const ITEMS_PER_PAGE = 5;

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<"All" | Announcement["category"]>("All");

    useEffect(() => {
        setTimeout(() => {
            setAnnouncements(dummyAnnouncements);
            setLoading(false);
        }, 1000);
    }, []);

    // Filtered & paginated data
    const filtered = selectedCategory === "All" ? announcements : announcements.filter(a => a.category === selectedCategory);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <DashboardLayout loading={loading} user={null}>
            <section className="max-w-4xl mx-auto p-6 bg-white rounded shadow my-8">
                <h1 className="text-3xl font-bold text-indigo-900 mb-6">Announcements</h1>

                {/* Category Filter */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <label htmlFor="category" className="font-semibold text-indigo-900">
                        Filter by Category:
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={e => {
                            setSelectedCategory(e.target.value as any);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="All">All</option>
                        <option value="General">General</option>
                        <option value="Academic">Academic</option>
                        <option value="Events">Events</option>
                    </select>
                </div>

                {loading ? (
                    <p className="text-center text-gray-600">Loading announcements...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-gray-600 italic">No announcements found.</p>
                ) : (
                    <ul className="space-y-6">
                        {paged.map(({ id, title, date, category, content }) => (
                            <li key={id} className="border border-gray-300 rounded p-4 shadow-sm">
                                <header className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-indigo-900">{title}</h2>
                                    <span className="text-sm text-gray-600 italic">{new Date(date).toLocaleDateString()}</span>
                                </header>
                                <p className="mb-2 text-sm font-semibold text-indigo-700">Category: {category}</p>
                                <p className="text-gray-800">
                                    {content.length > 150 ? content.slice(0, 150) + "..." : content}
                                </p>
                                <Link
                                    href={`/dashboard/student/announcements/${id}`}
                                    className="inline-block mt-2 text-indigo-600 hover:underline"
                                    aria-label={`Read more about ${title}`}
                                >
                                    Read More &rarr;
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination */}
                {!loading && filtered.length > ITEMS_PER_PAGE && (
                    <div className="mt-8 flex justify-center gap-3">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border ${currentPage === 1
                                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                }`}
                            aria-label="Previous Page"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded border ${currentPage === i + 1
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                    }`}
                                aria-current={currentPage === i + 1 ? "page" : undefined}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded border ${currentPage === totalPages
                                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                    : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                }`}
                            aria-label="Next Page"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
