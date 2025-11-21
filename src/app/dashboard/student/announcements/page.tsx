"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Calendar, Filter, ChevronLeft, ChevronRight, Eye, Megaphone, BookOpen, Users } from "lucide-react";

interface Announcement {
    id: string;
    title: string;
    date: string;
    category: "General" | "Academic" | "Events";
    content: string;
    isNew?: boolean;
    priority?: "high" | "normal" | "low";
}

const dummyAnnouncements: Announcement[] = [
    {
        id: "a1",
        title: "Campus Reopening Dates Announced for Fall Semester",
        date: "2025-08-01T09:00:00Z",
        category: "General",
        content: "The University of Hargeisa will reopen for the Fall semester starting September 1st. Students are advised to complete registration by August 25th. All campus facilities including libraries, labs, and student centers will be fully operational.",
        isNew: true,
        priority: "high"
    },
    {
        id: "a2",
        title: "Midterm Exams Schedule Released - Check Your Departments",
        date: "2025-09-15T12:00:00Z",
        category: "Academic",
        content: "The midterm exams will take place from October 10th to October 20th. Please check your respective department notice boards for detailed schedules. Important: Bring your student ID to all exam sessions.",
        isNew: true,
        priority: "high"
    },
    {
        id: "a3",
        title: "Health Awareness Week: Workshops on Nutrition and Mental Wellness",
        date: "2025-08-20T08:00:00Z",
        category: "Events",
        content: "Join us for Health Awareness Week starting August 25th, with workshops and seminars on nutrition, mental health, and fitness at the Student Center. Free health screenings and counseling sessions available.",
        isNew: true,
        priority: "normal"
    },
    {
        id: "a4",
        title: "Library Extended Hours During Examination Period",
        date: "2025-09-05T14:00:00Z",
        category: "General",
        content: "The university library will extend its opening hours during exam weeks from 8 AM to 10 PM to support students' study needs. Group study rooms can be booked in advance through the library portal.",
        isNew: false,
        priority: "normal"
    },
    {
        id: "a5",
        title: "Scholarship Application Deadline Approaching - Submit Now",
        date: "2025-08-30T10:00:00Z",
        category: "Academic",
        content: "Applications for the 2025/2026 academic year scholarships close on September 15th. Make sure to submit your documents to the financial aid office. Merit-based and need-based scholarships available.",
        isNew: false,
        priority: "high"
    },
    {
        id: "a6",
        title: "Annual Cultural Festival: Celebrate Diversity and Traditions",
        date: "2025-09-25T16:00:00Z",
        category: "Events",
        content: "The annual Cultural Festival will be held on October 5th. All students are invited to participate and celebrate diverse traditions and arts. Food, music, and performances from around the world.",
        isNew: false,
        priority: "normal"
    },
    {
        id: "a7",
        title: "New Student Portal Features Launched - Enhanced Experience",
        date: "2025-08-10T11:00:00Z",
        category: "General",
        content: "We have launched new features in the student portal including improved course registration and real-time academic progress tracking. Mobile app updates coming next week.",
        isNew: false,
        priority: "normal"
    },
    {
        id: "a8",
        title: "Updated COVID-19 Safety Guidelines for Campus",
        date: "2025-08-18T13:00:00Z",
        category: "General",
        content: "Please adhere to updated health guidelines including mandatory masks indoors and social distancing protocols to keep the campus safe. Hand sanitizing stations installed throughout campus.",
        isNew: false,
        priority: "normal"
    },
    {
        id: "a9",
        title: "Guest Lecture Series: Experts in Technology and Health Sciences",
        date: "2025-09-12T09:00:00Z",
        category: "Academic",
        content: "Renowned experts will present lectures on various topics in technology and health sciences throughout September. Check schedules online. Attendance certificates available for participants.",
        isNew: false,
        priority: "low"
    },
    {
        id: "a10",
        title: "Annual Sports Day: Register Your Teams Now",
        date: "2025-09-20T10:00:00Z",
        category: "Events",
        content: "Sports Day will take place on October 15th at the University Sports Complex. Teams are forming now, join your favorite sport! Basketball, soccer, volleyball, and track events available.",
        isNew: false,
        priority: "low"
    },
];

const ITEMS_PER_PAGE = 6;

function CategoryBadge({ category }: { category: Announcement["category"] }) {
    const getCategoryConfig = (cat: Announcement["category"]) => {
        switch (cat) {
            case "General":
                return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" };
            case "Academic":
                return { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" };
            case "Events":
                return { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" };
        }
    };

    const config = getCategoryConfig(category);
    return (
        <Badge className={`${config.bg} ${config.text} ${config.border}`}>
            {category}
        </Badge>
    );
}

function PriorityBadge({ priority }: { priority: Announcement["priority"] }) {
    switch (priority) {
        case "high":
            return <Badge className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
        case "normal":
            return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Normal</Badge>;
        case "low":
            return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Low Priority</Badge>;
        default:
            return null;
    }
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<"All" | Announcement["category"]>("All");
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setTimeout(() => {
            setAnnouncements(dummyAnnouncements);
            setLoading(false);
        }, 1000);
    }, []);

    // Filtered & paginated data
    const filtered = selectedCategory === "All" ? announcements : announcements.filter(a => a.category === selectedCategory);
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Statistics
    const totalAnnouncements = announcements.length;
    const newAnnouncements = announcements.filter(a => a.isNew).length;
    const generalCount = announcements.filter(a => a.category === "General").length;
    const academicCount = announcements.filter(a => a.category === "Academic").length;
    const eventsCount = announcements.filter(a => a.category === "Events").length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                        <p className="text-gray-600 mt-1">Stay updated with the latest university news and events</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {totalAnnouncements} Total
                    </Badge>
                </div>

                {/* Summary Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Bell className="w-6 h-6 text-indigo-200" />
                                <div className="text-indigo-200 text-sm font-medium">Total Announcements</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalAnnouncements}</div>
                            <div className="text-indigo-200 text-sm">University Updates</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Eye className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">New</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{newAnnouncements}</div>
                            <div className="text-green-200 text-sm">Unread Updates</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <BookOpen className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Academic</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{academicCount}</div>
                            <div className="text-blue-200 text-sm">Academic Notices</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Users className="w-6 h-6 text-purple-200" />
                                <div className="text-purple-200 text-sm font-medium">Events</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{eventsCount}</div>
                            <div className="text-purple-200 text-sm">Upcoming Events</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <label className="font-medium text-gray-700">Filter by Category:</label>
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={e => {
                                    setSelectedCategory(e.target.value as "All" | Announcement["category"]);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Categories</option>
                                <option value="General">General</option>
                                <option value="Academic">Academic</option>
                                <option value="Events">Events</option>
                            </select>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {filtered.length} announcements
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Announcements List */}
                {loading ? (
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {selectedCategory !== "All" 
                                ? `No ${selectedCategory.toLowerCase()} announcements available.`
                                : "No announcements available at the moment."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {paged.map((announcement) => (
                            <div
                                key={announcement.id}
                                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${
                                    announcement.isNew ? "border-l-4 border-l-indigo-500 bg-indigo-50/30" : ""
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    {/* Announcement Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    {announcement.isNew && (
                                                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                                            New
                                                        </Badge>
                                                    )}
                                                    <CategoryBadge category={announcement.category} />
                                                    {announcement.priority && <PriorityBadge priority={announcement.priority} />}
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                    {announcement.title}
                                                </h2>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed">
                                            {announcement.content.length > 200 
                                                ? announcement.content.slice(0, 200) + "..."
                                                : announcement.content
                                            }
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(announcement.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bell className="w-4 h-4" />
                                                <span>
                                                    {new Date(announcement.date).toLocaleTimeString([], { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex flex-col gap-3 items-start lg:items-end">
                                        <Link
                                            href={`/dashboard/student/announcements/${announcement.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                                        >
                                            Read More
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        {announcement.content.length > 200 && (
                                            <div className="text-xs text-gray-500 text-center lg:text-right">
                                                {Math.ceil(announcement.content.length / 200)} min read
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} announcements
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border transition-all duration-200 ${
                                        currentPage === 1
                                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                            : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                    }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                    currentPage === pageNum
                                                        ? "bg-indigo-600 text-white border border-indigo-600"
                                                        : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border transition-all duration-200 ${
                                        currentPage === totalPages
                                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                            : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                    }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}