"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";

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
        body:
            "Please be reminded that the final exam will cover chapters 1 to 5. Make sure to review your notes and complete the practice problems sent last week.",
        timestamp: "2025-08-05T09:30:00Z",
        isRead: false,
    },
    {
        id: "msg-2",
        senderName: "Registrar Office",
        subject: "Course Registration Opens Soon",
        body:
            "Registration for the Fall semester courses will begin next Monday. Please log in to your portal to select your courses early and avoid last-minute issues.",
        timestamp: "2025-07-30T14:00:00Z",
        isRead: true,
    },
    {
        id: "msg-3",
        senderName: "Prof. Jane",
        senderAvatarUrl: "/avatars/prof-jane.png",
        subject: "Homework 4 Feedback",
        body:
            "Great work on your last assignment! Just a few notes to improve: pay attention to question 3 where you missed the edge cases.",
        timestamp: "2025-08-03T12:15:00Z",
        isRead: false,
    },
];

export default function MessageDetailPage() {
    const params = useParams();
    const router = useRouter();
    const messageId = params?.id ?? "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        // Simulate API fetch delay
        setTimeout(() => {
            const foundMsg = dummyMessages.find((msg) => msg.id === messageId);
            if (foundMsg) {
                setMessage(foundMsg);
                setLoading(false);
            } else {
                setError("Message not found.");
                setLoading(false);
            }
        }, 900);
    }, [messageId]);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6 max-w-3xl mx-auto">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-semibold"
                    aria-label="Go back to messages list"
                >
                    <ArrowLeft size={18} />
                    Back to Messages
                </button>

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
                        <Skeleton className="h-10 w-48 mb-4" />
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-40 rounded-lg" />
                    </>
                ) : message ? (
                    <article>
                        <header className="flex items-center gap-4 mb-6">
                            <img
                                src={message.senderAvatarUrl || "/avatars/default-avatar.png"}
                                alt={`${message.senderName} avatar`}
                                className="w-16 h-16 rounded-full object-cover"
                                loading="lazy"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-indigo-900">{message.subject}</h1>
                                <p className="text-gray-600">From: {message.senderName}</p>
                                <time
                                    className="text-sm text-gray-500"
                                    dateTime={message.timestamp}
                                    title={new Date(message.timestamp).toLocaleString()}
                                >
                                    {new Date(message.timestamp).toLocaleString()}
                                </time>
                            </div>
                        </header>

                        <section className="prose max-w-none text-gray-800 whitespace-pre-wrap">{message.body}</section>
                    </article>
                ) : null}
            </section>
        </DashboardLayout>
    );
}
