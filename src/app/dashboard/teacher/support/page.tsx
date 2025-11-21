"use client";

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { 
    Send, 
    MessageCircle, 
    Clock, 
    CheckCircle, 
    Eye, 
    Search,
    Filter,
    Plus,
    AlertCircle,
    CheckCircle2,
    Clock4,
    User,
    Calendar,
    FileText,
    Download,
    Share2,
    MessageSquare,
    Phone,
    Mail,
    Building
} from "lucide-react";

type SupportTicket = {
    id: string;
    subject: string;
    message: string;
    status: "Open" | "In Progress" | "Resolved" | "Closed";
    priority: "Low" | "Medium" | "High" | "Urgent";
    category: string;
    createdAt: string;
    updatedAt: string;
    responses: number;
    lastResponse: string;
    assignedTo?: string;
};

type SupportCategory = {
    id: string;
    name: string;
    description: string;
    icon: JSX.Element;
    color: string;
};

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [activeTab, setActiveTab] = useState<"new" | "tickets">("new");

    const router = useRouter();

    const supportCategories: SupportCategory[] = [
        {
            id: "technical",
            name: "Technical Issues",
            description: "Problems with platform, tools, or system access",
            icon: <Building className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: "academic",
            name: "Academic Support",
            description: "Course materials, curriculum, or teaching resources",
            icon: <FileText className="w-6 h-6" />,
            color: "from-green-500 to-emerald-500"
        },
        {
            id: "administrative",
            name: "Administrative",
            description: "HR, payroll, facilities, or administrative matters",
            icon: <User className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500"
        },
        {
            id: "student",
            name: "Student Issues",
            description: "Student behavior, attendance, or academic concerns",
            icon: <MessageSquare className="w-6 h-6" />,
            color: "from-orange-500 to-red-500"
        }
    ];

    useEffect(() => {
        setLoading(true);
        // Simulate API call to fetch support tickets
        setTimeout(() => {
            setTickets([
                {
                    id: "ST-2024-001",
                    subject: "Gradebook Export Not Working",
                    message: "When I try to export the gradebook for my Advanced Composition class, the system returns an error. This has been happening since the last update.",
                    status: "In Progress",
                    priority: "High",
                    category: "technical",
                    createdAt: "2024-03-08T10:30:00Z",
                    updatedAt: "2024-03-09T14:20:00Z",
                    responses: 3,
                    lastResponse: "2024-03-09T14:20:00Z",
                    assignedTo: "Tech Support Team"
                },
                {
                    id: "ST-2024-002",
                    subject: "Classroom Equipment Request",
                    message: "Need a new projector installed in Room 305. The current one is flickering and affecting lecture quality.",
                    status: "Open",
                    priority: "Medium",
                    category: "administrative",
                    createdAt: "2024-03-10T09:15:00Z",
                    updatedAt: "2024-03-10T09:15:00Z",
                    responses: 0,
                    lastResponse: "2024-03-10T09:15:00Z"
                },
                {
                    id: "ST-2024-003",
                    subject: "Student Plagiarism Case",
                    message: "I've identified a case of plagiarism in student submissions. Need guidance on the proper procedure and documentation required.",
                    status: "Resolved",
                    priority: "High",
                    category: "student",
                    createdAt: "2024-03-05T16:45:00Z",
                    updatedAt: "2024-03-08T11:30:00Z",
                    responses: 5,
                    lastResponse: "2024-03-08T11:30:00Z",
                    assignedTo: "Academic Integrity Office"
                },
                {
                    id: "ST-2024-004",
                    subject: "Course Material Access",
                    message: "Unable to access the new digital library resources for my research. Getting authentication errors.",
                    status: "Closed",
                    priority: "Medium",
                    category: "academic",
                    createdAt: "2024-03-01T08:20:00Z",
                    updatedAt: "2024-03-04T15:40:00Z",
                    responses: 4,
                    lastResponse: "2024-03-04T15:40:00Z",
                    assignedTo: "Library Support"
                }
            ]);
            setLoading(false);
        }, 1500);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!subject.trim() || !message.trim() || !category) {
            setError("Please fill out all required fields.");
            return;
        }

        setSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const newTicket: SupportTicket = {
                id: `ST-2024-${String(tickets.length + 1).padStart(3, '0')}`,
                subject: subject.trim(),
                message: message.trim(),
                status: "Open",
                priority: priority,
                category: category,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                responses: 0,
                lastResponse: new Date().toISOString()
            };

            setTickets((prev) => [newTicket, ...prev]);
            setSubject("");
            setMessage("");
            setCategory("");
            setPriority("Medium");
            setSuccess("Support ticket submitted successfully! Our team will respond within 24 hours.");
            setActiveTab("tickets");
        } catch {
            setError("Failed to submit the support ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    function getStatusIcon(status: SupportTicket["status"]) {
        switch (status) {
            case "Open": return <AlertCircle className="w-4 h-4" />;
            case "In Progress": return <Clock4 className="w-4 h-4" />;
            case "Resolved": return <CheckCircle2 className="w-4 h-4" />;
            case "Closed": return <CheckCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    }

    function statusBadge(status: SupportTicket["status"]) {
        const colors = {
            Open: "bg-red-100 text-red-800 border-red-200",
            "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
            Resolved: "bg-green-100 text-green-800 border-green-200",
            Closed: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${colors[status]}`}
            >
                {getStatusIcon(status)}
                {status}
            </span>
        );
    }

    function priorityBadge(priority: SupportTicket["priority"]) {
        const colors = {
            Low: "bg-gray-100 text-gray-800 border-gray-200",
            Medium: "bg-blue-100 text-blue-800 border-blue-200",
            High: "bg-orange-100 text-orange-800 border-orange-200",
            Urgent: "bg-red-100 text-red-800 border-red-200",
        };
        return (
            <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium border ${colors[priority]}`}
            >
                {priority}
            </span>
        );
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getCategoryInfo = (categoryId: string) => {
        return supportCategories.find(cat => cat.id === categoryId) || supportCategories[0];
    };

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Support Center
                            </h1>
                            <p className="text-gray-600 mt-2">Get help with technical issues, academic support, and administrative matters</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export Tickets
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200">
                                <Plus className="w-4 h-4" />
                                New Ticket
                            </button>
                        </div>
                    </div>

                    {/* Support Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {supportCategories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-2xl border border-gray-200/60 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                                    {category.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                                <p className="text-gray-600 text-sm">{category.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Methods */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-100">Quick Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                                <Phone className="w-5 h-5 text-indigo-200" />
                                <div>
                                    <div className="font-semibold">Phone Support</div>
                                    <div className="text-indigo-200 text-sm">+1 (555) 123-HELP</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                                <Mail className="w-5 h-5 text-indigo-200" />
                                <div>
                                    <div className="font-semibold">Email Support</div>
                                    <div className="text-indigo-200 text-sm">support@university.edu</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                                <Clock className="w-5 h-5 text-indigo-200" />
                                <div>
                                    <div className="font-semibold">Response Time</div>
                                    <div className="text-indigo-200 text-sm">Within 24 hours</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 bg-gray-100/80 rounded-2xl p-1 w-fit">
                        {[
                            { id: "new", label: "New Ticket", icon: Plus },
                            { id: "tickets", label: "My Tickets", icon: MessageCircle }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id as "new" | "tickets")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${activeTab === id
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column - New Ticket Form */}
                        {activeTab === "new" && (
                            <div className="xl:col-span-2">
                                <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit New Support Ticket</h2>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                                            {success}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Category *
                                                </label>
                                                <select
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    required
                                                    disabled={submitting}
                                                >
                                                    <option value="">Select a category</option>
                                                    {supportCategories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Priority *
                                                </label>
                                                <select
                                                    value={priority}
                                                    onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High" | "Urgent")}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    required
                                                    disabled={submitting}
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                    <option value="Urgent">Urgent</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <input
                                                type="text"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Brief summary of your issue"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description *
                                            </label>
                                            <textarea
                                                rows={6}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                                placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
                                                required
                                                disabled={submitting}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Clock className="w-4 h-4 animate-spin" />
                                                    Submitting Ticket...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit Support Ticket
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Right Column - Ticket List */}
                        <div className={activeTab === "new" ? "xl:col-span-1" : "xl:col-span-3"}>
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">My Support Tickets</h2>
                                    <div className="flex gap-3 w-full lg:w-auto">
                                        <div className="relative flex-1 lg:flex-none">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Search tickets..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="All">All Status</option>
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                        <p className="text-gray-600 mt-4">Loading your support tickets...</p>
                                    </div>
                                ) : filteredTickets.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
                                        <p className="text-gray-600">
                                            {searchTerm || statusFilter !== "All" 
                                                ? "Try adjusting your search or filters" 
                                                : "You haven't submitted any support tickets yet"
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredTickets.map((ticket) => {
                                            const categoryInfo = getCategoryInfo(ticket.category);
                                            return (
                                                <div
                                                    key={ticket.id}
                                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group cursor-pointer"
                                                    onClick={() => router.push(`/dashboard/teacher/support/${ticket.id}`)}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center text-white`}>
                                                                {categoryInfo.icon}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                                                                    {ticket.subject}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-sm text-gray-500">#{ticket.id}</span>
                                                                    {priorityBadge(ticket.priority)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {statusBadge(ticket.status)}
                                                            <Eye className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                        {ticket.message}
                                                    </p>
                                                    
                                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MessageSquare className="w-4 h-4" />
                                                                {ticket.responses} responses
                                                            </span>
                                                        </div>
                                                        {ticket.assignedTo && (
                                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                                Assigned to: {ticket.assignedTo}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}