"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Send, MessageCircle, Clock, CheckCircle, Eye } from "lucide-react";

type SupportTicket = {
    id: string;
    subject: string;
    message: string;
    status: "Open" | "In Progress" | "Closed";
    createdAt: string;
};

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTickets([
                {
                    id: "t1",
                    subject: "Issue with Exam Upload",
                    message: "I can't upload my exam file, please help.",
                    status: "Open",
                    createdAt: new Date().toISOString(),
                },
                {
                    id: "t2",
                    subject: "Login Problem",
                    message: "Sometimes I get logged out unexpectedly.",
                    status: "In Progress",
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!subject.trim() || !message.trim()) {
            setError("Please fill out both subject and message.");
            return;
        }

        setSubmitting(true);

        try {
            // Replace this with your API call to submit ticket
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const newTicket: SupportTicket = {
                id: `t${Date.now()}`,
                subject: subject.trim(),
                message: message.trim(),
                status: "Open",
                createdAt: new Date().toISOString(),
            };

            setTickets((prev) => [newTicket, ...prev]);
            setSubject("");
            setMessage("");
        } catch {
            setError("Failed to submit the support ticket. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

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

    return (
        <DashboardLayout
            
        >
            <section className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3 mb-8">
                    <MessageCircle size={36} /> Support Center
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-indigo-50 rounded-lg p-6 shadow mb-12"
                    aria-label="Submit a new support ticket"
                >
                    <h2 className="text-xl font-semibold mb-4">Submit a Ticket</h2>

                    {error && (
                        <p className="mb-4 text-red-700 font-semibold bg-red-100 p-3 rounded">
                            {error}
                        </p>
                    )}

                    <div className="mb-4">
                        <label htmlFor="subject" className="block mb-1 font-semibold text-indigo-900">
                            Subject
                        </label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full rounded border border-indigo-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Brief summary of your issue"
                            required
                            disabled={submitting}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-1 font-semibold text-indigo-900">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full rounded border border-indigo-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Describe your issue in detail"
                            required
                            disabled={submitting}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Ticket"}
                        <Send size={20} />
                    </button>
                </form>

                <section aria-label="List of support tickets">
                    <h2 className="text-2xl font-semibold mb-6">Your Tickets</h2>

                    {loading ? (
                        <p className="text-center text-gray-600 py-12">Loading tickets...</p>
                    ) : tickets.length === 0 ? (
                        <p className="text-center text-gray-600 py-12">No tickets submitted yet.</p>
                    ) : (
                        <ul className="space-y-6">
                            {tickets.map(({ id, subject, message, status, createdAt }) => (
                                <li
                                    key={id}
                                    className="bg-white rounded-lg shadow p-6 border border-indigo-200 flex justify-between items-start"
                                    role="article"
                                    aria-labelledby={`ticket-subject-${id}`}
                                >
                                    <div>
                                        <header className="flex justify-between items-center mb-2">
                                            <h3
                                                id={`ticket-subject-${id}`}
                                                className="text-lg font-bold text-indigo-800"
                                                title={subject}
                                            >
                                                {subject}
                                            </h3>
                                            {statusBadge(status)}
                                        </header>
                                        <p className="text-gray-700 mb-3 whitespace-pre-wrap max-w-xl">{message}</p>
                                        <p className="text-sm text-gray-500">
                                            Submitted on {new Date(createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        aria-label={`View ticket ${subject}`}
                                        onClick={() => router.push(`/dashboard/teacher/support/${id}`)}
                                        className="ml-6 text-indigo-600 hover:text-indigo-900 transition rounded p-2 hover:bg-indigo-100"
                                        title="View Ticket Details"
                                    >
                                        <Eye size={24} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </section>
        </DashboardLayout>
    );
}
