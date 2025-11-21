"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";

interface Announcement {
    id: string;
    title: string;
    date: string;
    category: "General" | "Academic" | "Events";
    content: string;
}

const dummyAnnouncements: Announcement[] = [
    {
        id: "a1",
        title: "Campus Reopening Dates Announced",
        date: "2025-08-01T09:00:00Z",
        category: "General",
        content: "The University of Hargeisa will reopen for the Fall semester starting September 1st. Students are advised to complete registration by August 25th.\n\nAll students must ensure they have completed their course registrations and paid the necessary fees before the deadline. Late registrations will incur additional charges.\n\nThe administration office will be open from 8:00 AM to 4:00 PM Monday through Friday to assist with any inquiries.",
    },
    // ... add your other announcements here
];

const categoryColors = {
    General: "bg-blue-100 text-blue-800 border-blue-200",
    Academic: "bg-green-100 text-green-800 border-green-200",
    Events: "bg-purple-100 text-purple-800 border-purple-200",
};

const categoryIcons = {
    General: "📢",
    Academic: "📚",
    Events: "🎉",
};

export default function AnnouncementDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params["id"];

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        // Load user from localStorage like your other pages
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (!id) {
            router.push("/dashboard/student/announcements");
            return;
        }

        setTimeout(() => {
            const found = dummyAnnouncements.find((a) => a.id === id) || null;
            setAnnouncement(found);
            setLoading(false);
        }, 700);
    }, [id, router]);

    if (loading) {
        return (
            <DashboardLayout loading={true} user={user}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading announcement...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!announcement) {
        return (
            <DashboardLayout loading={false} user={user}>
                <section className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center border border-gray-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Announcement Not Found</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            The announcement you&apos;re looking for doesn&apos;t exist or may have been removed.
                        </p>
                        <Link
                            href="/dashboard/student/announcements"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 font-medium"
                        >
                            <ArrowLeft size={18} />
                            Back to Announcements
                        </Link>
                    </div>
                </section>
            </DashboardLayout>
        );
    }

    const formattedDate = new Date(announcement.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = new Date(announcement.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <DashboardLayout loading={false} user={user}>
            <section className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/dashboard/student/announcements"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Announcements
                    </Link>
                </div>

                {/* Announcement Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm bg-white/10 ${categoryColors[announcement.category]}`}>
                                <span>{categoryIcons[announcement.category]}</span>
                                <span className="font-medium">{announcement.category}</span>
                            </span>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                                <span className="inline-flex items-center gap-1">
                                    <Calendar size={16} />
                                    {formattedDate}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Clock size={16} />
                                    {formattedTime}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                            {announcement.title}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <article className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                {announcement.content}
                            </div>
                        </article>

                        {/* Footer Actions */}
                        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4 justify-between items-center">
                            <Link
                                href="/dashboard/student/announcements"
                                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                            >
                                <ArrowLeft size={18} />
                                All Announcements
                            </Link>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Tag size={16} />
                                <span>Category: {announcement.category}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <span className="text-blue-600 text-xl">💡</span>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Need More Information?</h3>
                            <p className="text-blue-700 text-sm">
                                If you have questions about this announcement, please contact the administration office 
                                or visit the student portal for additional details.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}