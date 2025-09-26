"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import Link from "next/link";

interface Announcement {
    id: string;
    title: string;
    date: string;
    category: "General" | "Academic" | "Events";
    content: string;
}

const dummyAnnouncements: Announcement[] = [
    // Same array as above (copy-paste all 15 items here)
    {
        id: "a1",
        title: "Campus Reopening Dates Announced",
        date: "2025-08-01T09:00:00Z",
        category: "General",
        content:
            "The University of Hargeisa will reopen for the Fall semester starting September 1st. Students are advised to complete registration by August 25th.",
    },
    // ...add all 15 announcements here as above
];

export default function AnnouncementDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params["id"];

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            <DashboardLayout loading={true} user={null}>
                <p className="text-center mt-20 text-gray-600 text-lg">Loading announcement...</p>
            </DashboardLayout>
        );
    }

    if (!announcement) {
        return (
            <DashboardLayout loading={false} user={null}>
                <section className="max-w-xl mx-auto my-20 p-8 bg-white rounded shadow text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">Announcement Not Found</h2>
                    <p className="mb-6">The announcement you requested does not exist or is unavailable.</p>
                    <Link
                        href="/dashboard/student/announcements"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
                    >
                        Back to Announcements
                    </Link>
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={null}>
            <section className="max-w-4xl mx-auto p-10 bg-white rounded shadow my-12 font-serif">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-indigo-900">{announcement.title}</h1>
                    <p className="text-gray-600 italic">
                        {new Date(announcement.date).toLocaleDateString()} &mdash; <span className="font-semibold">{announcement.category}</span>
                    </p>
                </header>

                <article className="text-gray-800 whitespace-pre-line">{announcement.content}</article>

                <div className="mt-12 text-center">
                    <Link
                        href="/dashboard/student/announcements"
                        className="inline-block bg-gray-300 text-gray-900 px-6 py-2 rounded shadow hover:bg-gray-400"
                    >
                        Back to Announcements
                    </Link>
                </div>
            </section>
        </DashboardLayout>
    );
}
