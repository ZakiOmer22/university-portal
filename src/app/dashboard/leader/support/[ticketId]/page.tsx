"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Clock, XCircle, ArrowLeft, Send } from "lucide-react";

interface SupportTicket {
    id: string;
    subject: string;
    message: string;
    status: "open" | "in-progress" | "resolved" | "closed";
    createdAt: string;
    updatedAt?: string;
    replies?: SupportReply[];
}

interface SupportReply {
    id: string;
    author: string;
    message: string;
    timestamp: string;
}

// Dummy ticket data with replies
const dummyTickets: Record<string, SupportTicket> = {
    "ticket-1": {
        id: "ticket-1",
        subject: "Issue logging in",
        message: "I can't access my courses after logging in.",
        status: "open",
        createdAt: "2025-08-01T10:00:00Z",
        replies: [
            {
                id: "r1",
                author: "Support Agent",
                message: "Have you tried resetting your password?",
                timestamp: "2025-08-02T08:00:00Z",
            },
            {
                id: "r2",
                author: "You",
                message: "Yes, but still no luck.",
                timestamp: "2025-08-02T10:30:00Z",
            },
        ],
    },
    "ticket-2": {
        id: "ticket-2",
        subject: "Assignment upload problem",
        message: "Upload button is not responding on assignment page.",
        status: "in-progress",
        createdAt: "2025-08-03T15:30:00Z",
        updatedAt: "2025-08-05T09:00:00Z",
        replies: [],
    },
};

function statusBadge(status: SupportTicket["status"]) {
    switch (status) {
        case "open":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <Clock size={14} />
                    Open
                </Badge>
            );
        case "in-progress":
            return (
                <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                    <Clock size={14} />
                    In Progress
                </Badge>
            );
        case "resolved":
            return (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Resolved
                </Badge>
            );
        case "closed":
            return (
                <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1">
                    <XCircle size={14} />
                    Closed
                </Badge>
            );
        default:
            return null;
    }
}

export default function SupportTicketDetailPage() {
    const params = useParams();
    const router = useRouter();

    // Fix here: ensure ticketId is a string, not string[]
    const rawTicketId = params?.ticketId;
    const ticketId = Array.isArray(rawTicketId) ? rawTicketId[0] : rawTicketId || "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

    const [replyMessage, setReplyMessage] = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);
    const [replyError, setReplyError] = useState<string | null>(null);

    const repliesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        // Simulate fetch
        setTimeout(() => {
            if (dummyTickets[ticketId]) {
                setTicket(dummyTickets[ticketId]);
                setLoading(false);
            } else {
                setError("Ticket not found.");
                setLoading(false);
            }
        }, 1000);
    }, [ticketId]);

    // Scroll to bottom of replies on new reply
    useEffect(() => {
        repliesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket?.replies]);

    function handleReplySubmit(e: React.FormEvent) {
        e.preventDefault();
        setReplyError(null);

        if (!replyMessage.trim()) {
            setReplyError("Reply cannot be empty.");
            return;
        }

        if (!ticket) {
            setReplyError("Ticket not loaded.");
            return;
        }

        setReplySubmitting(true);

        // Simulate server reply submission delay
        setTimeout(() => {
            const newReply: SupportReply = {
                id: `reply-${Date.now()}`,
                author: user?.fullName || "You",
                message: replyMessage.trim(),
                timestamp: new Date().toISOString(),
            };

            // Append reply to ticket's replies
            setTicket((prev) =>
                prev
                    ? {
                        ...prev,
                        replies: prev.replies ? [...prev.replies, newReply] : [newReply],
                        updatedAt: newReply.timestamp,
                    }
                    : prev
            );

            setReplyMessage("");
            setReplySubmitting(false);
        }, 1200);
    }

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto space-y-6">
                <button
                    onClick={() => router.back()}
                    aria-label="Go back"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <>
                        <div className="h-10 w-64 rounded bg-gray-200 animate-pulse mb-4" />
                        <div className="h-40 rounded bg-gray-200 animate-pulse" />
                    </>
                ) : ticket ? (
                    <>
                        <h1 className="text-3xl font-bold text-indigo-900 mb-2">{ticket.subject}</h1>

                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                            {statusBadge(ticket.status)}
                            <p className="text-sm text-gray-600">
                                Created: {new Date(ticket.createdAt).toLocaleString()}
                                {ticket.updatedAt && (
                                    <>
                                        <br />
                                        Updated: {new Date(ticket.updatedAt).toLocaleString()}
                                    </>
                                )}
                            </p>
                        </div>

                        <p className="whitespace-pre-line text-gray-800 mb-6">{ticket.message}</p>

                        {/* Replies Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-indigo-900">Replies</h2>

                            {(!ticket.replies || ticket.replies.length === 0) && (
                                <p className="text-gray-600 italic">No replies yet.</p>
                            )}

                            <ul className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
                                {ticket.replies?.map((reply) => (
                                    <li
                                        key={reply.id}
                                        className={`p-3 rounded-lg shadow-sm ${reply.author === (user?.fullName || "You")
                                                ? "bg-indigo-100 text-indigo-900 self-end"
                                                : "bg-white text-gray-800"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold">{reply.author}</span>
                                            <time
                                                dateTime={reply.timestamp}
                                                className="text-xs text-gray-500"
                                                title={new Date(reply.timestamp).toLocaleString()}
                                            >
                                                {new Date(reply.timestamp).toLocaleString()}
                                            </time>
                                        </div>
                                        <p className="whitespace-pre-line">{reply.message}</p>
                                    </li>
                                ))}
                                <div ref={repliesEndRef} />
                            </ul>
                        </section>

                        {/* Reply Form */}
                        <form onSubmit={handleReplySubmit} className="mt-6 space-y-3">
                            {replyError && (
                                <Alert variant="destructive" className="flex items-start gap-2">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{replyError}</AlertDescription>
                                </Alert>
                            )}

                            <label htmlFor="replyMessage" className="block font-semibold text-indigo-900">
                                Your Reply
                            </label>
                            <textarea
                                id="replyMessage"
                                rows={4}
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                placeholder="Write your reply here..."
                                disabled={replySubmitting}
                            />

                            <button
                                type="submit"
                                disabled={replySubmitting}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                <Send size={16} />
                                {replySubmitting ? "Sending..." : "Send Reply"}
                            </button>
                        </form>
                    </>
                ) : null}
            </section>
        </DashboardLayout>
    );
}
