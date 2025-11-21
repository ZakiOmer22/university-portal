"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Clock, XCircle, ArrowLeft, Send, User, Calendar, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        subject: "Issue logging in to student portal",
        message: "I can't access my courses after logging in. I keep getting an authentication error even though my credentials are correct. This started happening after the system update yesterday.\n\nI've tried:\n- Clearing browser cache\n- Using different browsers\n- Resetting my password\n\nNothing seems to work. Please help!",
        status: "open",
        createdAt: "2025-08-01T10:00:00Z",
        replies: [
            {
                id: "r1",
                author: "Support Agent",
                message: "Thank you for reporting this issue. We're looking into the authentication problem that started after the recent update. Can you try using the incognito mode and let me know if that works?",
                timestamp: "2025-08-02T08:00:00Z",
            },
            {
                id: "r2",
                author: "You",
                message: "I tried incognito mode but still getting the same error. The page loads but when I click on any course, it redirects me back to the login page.",
                timestamp: "2025-08-02T10:30:00Z",
            },
            {
                id: "r3",
                author: "Support Agent",
                message: "I see the issue now. There's a known bug with session management that our development team is working on. As a temporary workaround, please try accessing through the mobile app if you have it installed. We expect a fix to be deployed within 24 hours.",
                timestamp: "2025-08-02T14:15:00Z",
            },
        ],
    },
    "ticket-2": {
        id: "ticket-2",
        subject: "Assignment upload problem - file not uploading",
        message: "The upload button on the assignment submission page is not responding when I try to submit my files. I've tried multiple file formats (PDF, DOCX) and sizes, but nothing happens when I click the upload button.",
        status: "in-progress",
        createdAt: "2025-08-03T15:30:00Z",
        updatedAt: "2025-08-05T09:00:00Z",
        replies: [],
    },
};

function StatusBadge({ status }: { status: SupportTicket["status"] }) {
    const config = {
        open: { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200", icon: Clock },
        "in-progress": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200", icon: Clock },
        resolved: { bg: "bg-green-50", text: "text-green-800", border: "border-green-200", icon: CheckCircle2 },
        closed: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: XCircle }
    };

    const { bg, text, border, icon: Icon } = config[status];
    const statusText = status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Badge className={`${bg} ${text} ${border} flex items-center gap-2 font-medium px-3 py-1.5`}>
            <Icon size={16} />
            {statusText}
        </Badge>
    );
}

export default function SupportTicketDetailPage() {
    const params = useParams();
    const router = useRouter();

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

    useEffect(() => {
        repliesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket?.replies]);

    function handleReplySubmit(e: React.FormEvent) {
        e.preventDefault();
        setReplyError(null);

        if (!replyMessage.trim()) {
            setReplyError("Please write a message before sending.");
            return;
        }

        if (!ticket) {
            setReplyError("Ticket not loaded.");
            return;
        }

        setReplySubmitting(true);

        setTimeout(() => {
            const newReply: SupportReply = {
                id: `reply-${Date.now()}`,
                author: user?.fullName || "You",
                message: replyMessage.trim(),
                timestamp: new Date().toISOString(),
            };

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
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Support
                    </button>
                    
                    {ticket && (
                        <div className="flex items-center gap-4">
                            <StatusBadge status={ticket.status} />
                        </div>
                    )}
                </div>

                {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                        <AlertTitle className="text-red-800">Error</AlertTitle>
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <Skeleton className="h-8 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-32 mb-6" />
                            <Skeleton className="h-20 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ) : ticket ? (
                    <div className="space-y-6">
                        {/* Ticket Header Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{ticket.subject}</h1>
                                    
                                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                        </div>
                                        {ticket.updatedAt && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Original Message */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{user?.fullName || "You"}</div>
                                        <div className="text-sm text-gray-500">Original Message</div>
                                    </div>
                                </div>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {ticket.message}
                                </div>
                            </div>
                        </div>

                        {/* Replies Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageCircle size={24} className="text-indigo-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Conversation</h2>
                                {ticket.replies && ticket.replies.length > 0 && (
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                        {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                                    </Badge>
                                )}
                            </div>

                            {(!ticket.replies || ticket.replies.length === 0) ? (
                                <div className="text-center py-12">
                                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No replies yet</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Be the first to reply to this ticket. Our support team will respond shortly.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                                    {ticket.replies.map((reply) => (
                                        <div
                                            key={reply.id}
                                            className={`flex gap-4 ${reply.author === (user?.fullName || "You")
                                                    ? "flex-row-reverse"
                                                    : "flex-row"
                                                }`}
                                        >
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                reply.author === (user?.fullName || "You")
                                                    ? "bg-indigo-100"
                                                    : "bg-gray-100"
                                            }`}>
                                                <User size={20} className={
                                                    reply.author === (user?.fullName || "You")
                                                        ? "text-indigo-600"
                                                        : "text-gray-600"
                                                } />
                                            </div>
                                            <div className={`flex-1 max-w-[85%] ${reply.author === (user?.fullName || "You")
                                                    ? "text-right"
                                                    : "text-left"
                                                }`}>
                                                <div className={`rounded-2xl p-4 ${
                                                    reply.author === (user?.fullName || "You")
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 text-gray-900"
                                                }`}>
                                                    <div className="font-semibold mb-2">{reply.author}</div>
                                                    <div className="whitespace-pre-line leading-relaxed">{reply.message}</div>
                                                </div>
                                                <div className={`text-xs text-gray-500 mt-2 ${
                                                    reply.author === (user?.fullName || "You")
                                                        ? "text-right"
                                                        : "text-left"
                                                }`}>
                                                    {new Date(reply.timestamp).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={repliesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Reply Form */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add a Reply</h3>
                            
                            {replyError && (
                                <Alert variant="destructive" className="bg-red-50 border-red-200 mb-6">
                                    <AlertTitle className="text-red-800">Error</AlertTitle>
                                    <AlertDescription className="text-red-700">{replyError}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleReplySubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="replyMessage" className="block font-semibold text-gray-700 mb-2">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="replyMessage"
                                        rows={4}
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-vertical"
                                        placeholder="Type your reply here... Provide as much detail as possible to help us assist you better."
                                        disabled={replySubmitting}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-sm text-gray-500">
                                        {ticket.status === "resolved" || ticket.status === "closed" 
                                            ? "This ticket is closed. You can view but cannot reply."
                                            : "Your reply will be visible to support agents."
                                        }
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={replySubmitting || ticket.status === "resolved" || ticket.status === "closed"}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        {replySubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Send Reply
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : null}
            </div>
        </DashboardLayout>
    );
}