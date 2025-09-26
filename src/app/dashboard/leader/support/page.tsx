"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";

interface SupportTicket {
    id: string;
    category: string;
    subject: string;
    message: string;
    status: "open" | "in-progress" | "resolved" | "closed";
    createdAt: string; // ISO string
    updatedAt?: string;
}

// Predefined categories for user to choose from
const categories = [
    "Login Issues",
    "Assignment Problems",
    "Technical Support",
    "Billing",
    "General Inquiry",
];

const dummyTickets: SupportTicket[] = [
    {
        id: "ticket-1",
        category: "Login Issues",
        subject: "Can't log in",
        message: "I can't access my courses after logging in.",
        status: "open",
        createdAt: "2025-08-01T10:00:00Z",
    },
    {
        id: "ticket-2",
        category: "Assignment Problems",
        subject: "Upload button not working",
        message: "Upload button is not responding on assignment page.",
        status: "in-progress",
        createdAt: "2025-08-03T15:30:00Z",
        updatedAt: "2025-08-05T09:00:00Z",
    },
    {
        id: "ticket-3",
        category: "Login Issues",
        subject: "Password reset",
        message: "I forgot my password and cannot reset it.",
        status: "resolved",
        createdAt: "2025-07-28T08:00:00Z",
    },
];

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

function groupTicketsByCategory(tickets: SupportTicket[]) {
    const groups: Record<string, SupportTicket[]> = {};

    tickets.forEach((ticket) => {
        const category = ticket.category || "Uncategorized";

        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(ticket);
    });

    return groups;
}

export default function SupportPage() {
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        // Simulate fetching tickets
        setTimeout(() => {
            setTickets(dummyTickets);
            setLoading(false);
        }, 1000);
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!category.trim()) {
            setError("Category is required.");
            return;
        }
        if (!subject.trim()) {
            setError("Subject is required.");
            return;
        }
        if (!message.trim()) {
            setError("Message is required.");
            return;
        }

        setSubmitting(true);
        // Simulate API call to submit ticket
        setTimeout(() => {
            const newTicket: SupportTicket = {
                id: `ticket-${Date.now()}`,
                category,
                subject,
                message,
                status: "open",
                createdAt: new Date().toISOString(),
            };
            setTickets((prev) => [newTicket, ...prev]);
            setCategory("");
            setSubject("");
            setMessage("");
            setSubmitting(false);
        }, 1200);
    }

    const groupedTickets = groupTicketsByCategory(tickets);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-indigo-900">Support</h1>

                {/* New Ticket Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive" className="flex items-start gap-2">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div>
                        <label htmlFor="category" className="block font-semibold mb-1 text-indigo-900">
                            Category <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block font-semibold mb-1 text-indigo-900">
                            Subject <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Brief summary of your issue"
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block font-semibold mb-1 text-indigo-900">
                            Message <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your issue or question in detail"
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit Ticket"}
                    </button>
                </form>

                {/* Tickets Grouped by Category */}
                <section>
                    <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Your Tickets</h2>

                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 rounded-lg bg-gray-200 animate-pulse" />
                            ))}
                        </div>
                    ) : tickets.length === 0 ? (
                        <p className="text-gray-600 italic">You have not submitted any tickets yet.</p>
                    ) : (
                        Object.entries(groupedTickets).map(([cat, tickets]) => (
                            <div key={cat} className="mb-8">
                                <h3 className="text-xl font-semibold text-indigo-800 mb-3 border-b border-indigo-200 pb-1">
                                    {cat}
                                </h3>
                                <ul className="divide-y divide-gray-200">
                                    {tickets.map(({ id, subject, status, createdAt, updatedAt }) => (
                                        <li
                                            key={id}
                                            className="flex justify-between items-center py-3"
                                            title={`Created at ${new Date(createdAt).toLocaleString()}`}
                                        >
                                            <div>
                                                <p className="font-semibold text-indigo-900">{subject}</p>
                                                <p className="text-sm text-gray-600">
                                                    Created: {new Date(createdAt).toLocaleDateString()}
                                                    {updatedAt && `, Updated: ${new Date(updatedAt).toLocaleDateString()}`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {statusBadge(status)}

                                                <Link
                                                    href={`/dashboard/student/support/${id}`}
                                                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition whitespace-nowrap"
                                                    aria-label={`View details for ticket ${subject}`}
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </section>
            </section>
        </DashboardLayout>
    );
}
