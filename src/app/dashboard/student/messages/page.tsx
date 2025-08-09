"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Message {
    id: string;
    senderName: string;
    senderAvatarUrl?: string;
    subject: string;
    body: string;
    timestamp: string; // ISO string
    isRead: boolean;
}

const dummyMessages: Message[] = [
    {
        id: "msg-1",
        senderName: "Dr. Smith",
        senderAvatarUrl: "/avatars/dr-smith.png",
        subject: "Upcoming Exam Details",
        body: "Please be reminded that the final exam will cover chapters 1 to 5...",
        timestamp: "2025-08-05T09:30:00Z",
        isRead: false,
    },
    {
        id: "msg-2",
        senderName: "Registrar Office",
        subject: "Course Registration Opens Soon",
        body: "Registration for the Fall semester courses will begin next Monday...",
        timestamp: "2025-07-30T14:00:00Z",
        isRead: true,
    },
    {
        id: "msg-3",
        senderName: "Prof. Jane",
        senderAvatarUrl: "/avatars/prof-jane.png",
        subject: "Homework 4 Feedback",
        body: "Great work on your last assignment! Just a few notes to improve...",
        timestamp: "2025-08-03T12:15:00Z",
        isRead: false,
    },
];

export default function MessagesPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setTimeout(() => {
            setMessages(dummyMessages);
            setLoading(false);
        }, 1100);
    }, []);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white rounded-lg shadow p-6 space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900 mb-4">Messages</h1>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-20 rounded-lg" />
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 italic">You have no messages.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {messages.map(({ id, senderName, senderAvatarUrl, subject, body, timestamp, isRead }) => (
                            <li
                                key={id}
                                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-indigo-50 rounded ${!isRead ? "bg-indigo-100 font-semibold" : "bg-white"
                                    }`}
                            >
                                {/* Link wrapper around sender info and message preview */}
                                <Link
                                    href={`/dashboard/student/messages/${id}`}
                                    className="flex items-center gap-4 flex-grow cursor-pointer min-w-0"
                                    aria-label={`Open message from ${senderName}, subject: ${subject}`}
                                >
                                    <img
                                        src={senderAvatarUrl || "/avatars/default-avatar.png"}
                                        alt={`${senderName} avatar`}
                                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                        loading="lazy"
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <span className="truncate">{subject}</span>
                                        <span className="text-sm text-gray-600 truncate">{body}</span>
                                    </div>
                                </Link>

                                <time
                                    className="text-xs text-gray-500 whitespace-nowrap"
                                    dateTime={timestamp}
                                    title={new Date(timestamp).toLocaleString()}
                                >
                                    {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                                </time>

                                {/* Separate View button linking to same message detail */}
                                <Link
                                    href={`/dashboard/student/messages/${id}`}
                                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition whitespace-nowrap"
                                    aria-label={`View full message from ${senderName} titled ${subject}`}
                                >
                                    View
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </DashboardLayout>
    );
}
