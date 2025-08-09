"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { ArrowLeft, MessageCircle } from "lucide-react";

type SupportTicket = {
    id: string;
    subject: string;
    message: string;
    status: "Open" | "In Progress" | "Closed";
    createdAt: string;
};

type Reply = {
    id: string;
    sender: "Admin" | "Teacher";
    message: string;
    createdAt: string;
};

const dummyTickets: SupportTicket[] = [
    {
        id: "t1",
        subject: "Issue with Exam Upload",
        message: "I can't upload my exam file, please help. When I try, it throws an error 500.",
        status: "Open",
        createdAt: "2025-08-09T10:15:00Z",
    },
    {
        id: "t2",
        subject: "Login Problem",
        message: "Sometimes I get logged out unexpectedly after a few minutes.",
        status: "In Progress",
        createdAt: "2025-08-08T14:30:00Z",
    },
];

// Sample admin replies for ticket "t1"
const dummyReplies: Record<string, Reply[]> = {
    t1: [
        {
            id: "r1",
            sender: "Admin",
            message:
                "Hi! We're looking into the issue. Can you tell me which file format you're trying to upload?",
            createdAt: "2025-08-09T11:00:00Z",
        },
        {
            id: "r2",
            sender: "Teacher",
            message: "I'm uploading a PDF file.",
            createdAt: "2025-08-09T11:15:00Z",
        },
        {
            id: "r3",
            sender: "Admin",
            message:
                "Thanks! We found a temporary server issue, please try again now.",
            createdAt: "2025-08-09T12:00:00Z",
        },
    ],
};

export default function SupportTicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [loading, setLoading] = useState(true);

    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [replyError, setReplyError] = useState<string | null>(null);
    const [replySuccess, setReplySuccess] = useState(false);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            const found = dummyTickets.find((t) => t.id === id) || null;
            setTicket(found);
            // Load replies for this ticket or empty array
            setReplies(dummyReplies[id as string] || []);
            setLoading(false);
        }, 600);
    }, [id]);

    function statusBadge(status: SupportTicket["status"]) {
        const colors = {
            Open: "bg-red-100 text-red-800",
            "In Progress": "bg-yellow-100 text-yellow-800",
            Closed: "bg-green-100 text-green-800",
        };
        return (
            <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold select-none ${colors[status]}`}
                aria-label={`Status: ${status}`}
            >
                {status}
            </span>
        );
    }

    async function handleReplySubmit(e: React.FormEvent) {
        e.preventDefault();
        setReplyError(null);
        setReplySuccess(false);

        if (!replyText.trim()) {
            setReplyError("Reply cannot be empty.");
            return;
        }

        setSending(true);

        try {
            await new Promise((r) => setTimeout(r, 1000));

            const newReply: Reply = {
                id: Date.now().toString(),
                sender: "Teacher",
                message: replyText.trim(),
                createdAt: new Date().toISOString(),
            };

            setReplies((prev) => [...prev, newReply]);
            setReplyText("");
            setReplySuccess(true);
        } catch (error) {
            setReplyError("Failed to send reply. Please try again.");
        } finally {
            setSending(false);
        }
    }

    return (
        <DashboardLayout >
            <section className="max-w-3xl mx-auto p-6">
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-900 font-semibold"
                    aria-label="Back to support tickets"
                >
                    <ArrowLeft size={20} /> Back to Support Tickets
                </button>

                {loading ? (
                    <p className="text-center text-gray-600 py-12">Loading ticket details...</p>
                ) : !ticket ? (
                    <p className="text-center text-red-600 font-semibold py-12">Support ticket not found.</p>
                ) : (
                    <>
                        {/* Ticket Details */}
                        <article className="bg-white rounded-lg shadow p-8 border border-indigo-200 mb-8">
                            <h1 className="text-3xl font-bold mb-4 text-indigo-700">{ticket.subject}</h1>
                            <p className="mb-4 italic text-gray-600">
                                Submitted on {new Date(ticket.createdAt).toLocaleString()}
                            </p>
                            <p className="mb-6 whitespace-pre-wrap text-gray-800">{ticket.message}</p>
                            {statusBadge(ticket.status)}
                        </article>

                        {/* Replies Thread */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Conversation</h2>
                            {replies.length === 0 ? (
                                <p className="text-gray-600 italic">No replies yet.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {replies.map(({ id, sender, message, createdAt }) => (
                                        <li
                                            key={id}
                                            className={`p-4 rounded-lg shadow ${sender === "Admin"
                                                    ? "bg-indigo-50 text-indigo-900 self-start"
                                                    : "bg-green-50 text-green-900 self-end"
                                                } max-w-xl`}
                                            aria-label={`${sender} said on ${new Date(createdAt).toLocaleString()}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <strong>{sender}</strong>
                                                <time className="text-xs text-gray-500" dateTime={createdAt}>
                                                    {new Date(createdAt).toLocaleString()}
                                                </time>
                                            </div>
                                            <p className="whitespace-pre-wrap">{message}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Reply Form */}
                        <form onSubmit={handleReplySubmit} className="space-y-4">
                            <label
                                htmlFor="reply"
                                className="block font-semibold text-indigo-900 mb-2 flex items-center gap-2"
                            >
                                <MessageCircle size={20} /> Your Reply
                            </label>
                            <textarea
                                id="reply"
                                rows={4}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full border border-indigo-300 rounded-md px-4 py-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                                placeholder="Write your reply here..."
                                disabled={sending}
                            />

                            {replyError && <p className="text-red-600 font-semibold">{replyError}</p>}
                            {replySuccess && <p className="text-green-600 font-semibold">Reply sent successfully!</p>}

                            <button
                                type="submit"
                                disabled={sending}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md px-6 py-3 shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {sending ? "Sending..." : "Send Reply"}
                            </button>
                        </form>
                    </>
                )}
            </section>
        </DashboardLayout>
    );
}
