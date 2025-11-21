"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Plus, MessageCircle, Search, Filter } from "lucide-react";
import Link from "next/link";

interface SupportTicket {
    id: string;
    category: string;
    subject: string;
    message: string;
    status: "open" | "in-progress" | "resolved" | "closed";
    createdAt: string;
    updatedAt?: string;
}

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
        subject: "Can't log in to student portal",
        message: "I can't access my courses after logging in. Getting authentication error.",
        status: "open",
        createdAt: "2025-08-01T10:00:00Z",
    },
    {
        id: "ticket-2",
        category: "Assignment Problems",
        subject: "Upload button not working on assignment page",
        message: "Upload button is not responding when trying to submit assignment files.",
        status: "in-progress",
        createdAt: "2025-08-03T15:30:00Z",
        updatedAt: "2025-08-05T09:00:00Z",
    },
    {
        id: "ticket-3",
        category: "Login Issues",
        subject: "Password reset not working",
        message: "I forgot my password and cannot reset it through the email link.",
        status: "resolved",
        createdAt: "2025-07-28T08:00:00Z",
    },
];

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
        <Badge className={`${bg} ${text} ${border} flex items-center gap-1.5 font-medium`}>
            <Icon size={14} />
            {statusText}
        </Badge>
    );
}

function TicketCard({ ticket }: { ticket: SupportTicket }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <StatusBadge status={ticket.status} />
                        <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            {ticket.category}
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                        {ticket.subject}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {ticket.message}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                    <div>Created: {new Date(ticket.createdAt).toLocaleDateString()}</div>
                    {ticket.updatedAt && (
                        <div>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</div>
                    )}
                </div>
                <Link
                    href={`/dashboard/student/support/${ticket.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
                >
                    <MessageCircle size={16} />
                    View Details
                </Link>
            </div>
        </div>
    );
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
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | SupportTicket["status"]>("all");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setTimeout(() => {
            setTickets(dummyTickets);
            setLoading(false);
        }, 1000);
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!category.trim()) {
            setError("Please select a category for your ticket.");
            return;
        }
        if (!subject.trim()) {
            setError("Please provide a subject for your ticket.");
            return;
        }
        if (!message.trim()) {
            setError("Please describe your issue in detail.");
            return;
        }

        setSubmitting(true);
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
            setShowForm(false);
        }, 1200);
    }

    // Filter tickets based on search and status
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openTickets = tickets.filter(t => t.status === "open").length;
    const inProgressTickets = tickets.filter(t => t.status === "in-progress").length;
    const resolvedTickets = tickets.filter(t => t.status === "resolved").length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
                        <p className="text-gray-600 mt-2">Get help with technical issues and inquiries</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Plus size={20} />
                        New Support Ticket
                    </button>
                </div>

                {/* Stats Cards */}
                {!loading && tickets.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-yellow-200" />
                                <div className="text-yellow-200 text-sm font-medium">Open</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{openTickets}</div>
                            <div className="text-yellow-200 text-sm">Awaiting Response</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">In Progress</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{inProgressTickets}</div>
                            <div className="text-blue-200 text-sm">Being Reviewed</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Resolved</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{resolvedTickets}</div>
                            <div className="text-green-200 text-sm">Completed Tickets</div>
                        </div>
                    </div>
                )}

                {/* New Ticket Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Support Ticket</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive" className="bg-red-50 border-red-200">
                                    <AlertTitle className="text-red-800">Error</AlertTitle>
                                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="category" className="block font-semibold mb-2 text-gray-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={submitting}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block font-semibold mb-2 text-gray-700">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Brief summary of your issue"
                                        disabled={submitting}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block font-semibold mb-2 text-gray-700">
                                    Detailed Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Please describe your issue or question in as much detail as possible. Include any error messages, steps to reproduce, and what you've already tried."
                                    disabled={submitting}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-vertical"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={20} />
                                            Submit Ticket
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    disabled={submitting}
                                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tickets Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Your Support Tickets</h2>
                        
                        {tickets.length > 0 && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search tickets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as "all" | SupportTicket["status"])}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                                    <Skeleton className="h-6 w-32 mb-4" />
                                    <Skeleton className="h-8 w-full mb-3" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4 mb-4" />
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm || statusFilter !== "all" ? "No matching tickets found" : "No support tickets yet"}
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                {searchTerm || statusFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria."
                                    : "Create your first support ticket to get help with any issues you're experiencing."
                                }
                            </p>
                            {!showForm && (searchTerm || statusFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                    }}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredTickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}