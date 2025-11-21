"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { 
    ArrowLeft, 
    MessageCircle, 
    Send,
    Clock,
    User,
    Shield,
    Calendar,
    FileText,
    AlertCircle,
    CheckCircle2,
    Clock4,
    CheckCircle,
    Download,
    Paperclip,
    MoreVertical,
    Tag,
    Bell,
    Share2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    attachments?: string[];
};

type Reply = {
    id: string;
    sender: "Admin" | "Teacher";
    senderName: string;
    message: string;
    createdAt: string;
    isInternal?: boolean;
    attachments?: string[];
};

// Mock data that would come from your API
const mockTickets: SupportTicket[] = [
    {
        id: "ST-2024-001",
        subject: "Gradebook Export Not Working",
        message: "When I try to export the gradebook for my Advanced Composition class, the system returns an error: 'Internal Server Error 500'. This has been happening since the last platform update. I've tried clearing my browser cache and using different browsers, but the issue persists. The export is crucial for submitting midterm grades.\n\nSteps to reproduce:\n1. Navigate to Gradebook\n2. Select Advanced Composition class\n3. Click Export button\n4. Choose PDF format\n5. Error occurs immediately",
        status: "In Progress",
        priority: "High",
        category: "technical",
        createdAt: "2024-03-08T10:30:00Z",
        updatedAt: "2024-03-09T14:20:00Z",
        responses: 3,
        lastResponse: "2024-03-09T14:20:00Z",
        assignedTo: "Tech Support Team",
        attachments: ["error_screenshot.png", "gradebook_export.log"]
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
    }
];

const mockReplies: Record<string, Reply[]> = {
    "ST-2024-001": [
        {
            id: "r1",
            sender: "Admin",
            senderName: "Sarah Chen - Tech Support",
            message: "Thank you for reporting this issue. We can see the error in our logs and are investigating the gradebook export functionality. Could you please confirm which specific course you're trying to export and whether this affects all your courses or just Advanced Composition?",
            createdAt: "2024-03-08T11:45:00Z"
        },
        {
            id: "r2",
            sender: "Teacher",
            senderName: "You",
            message: "This issue only affects my Advanced Composition course (ENG201). My other courses export without problems. The error occurs specifically when trying to export the full gradebook. Individual student exports seem to work fine.",
            createdAt: "2024-03-08T14:20:00Z"
        },
        {
            id: "r3",
            sender: "Admin",
            senderName: "Mike Rodriguez - Senior Developer",
            message: "We've identified the issue - there's a data formatting problem with student records that have special characters in their names. Our team is working on a fix. In the meantime, you can export by selecting individual student groups. The fix should be deployed by tomorrow morning.",
            createdAt: "2024-03-09T09:30:00Z",
            isInternal: true
        },
        {
            id: "r4",
            sender: "Admin",
            senderName: "Sarah Chen - Tech Support",
            message: "The fix has been deployed. Could you please try exporting the gradebook now? If you continue to experience issues, please let us know immediately.",
            createdAt: "2024-03-09T14:20:00Z"
        }
    ]
};

const categoryInfo = {
    technical: { name: "Technical Issues", color: "from-blue-500 to-cyan-500", icon: FileText },
    academic: { name: "Academic Support", color: "from-green-500 to-emerald-500", icon: User },
    administrative: { name: "Administrative", color: "from-purple-500 to-pink-500", icon: Shield },
    student: { name: "Student Issues", color: "from-orange-500 to-red-500", icon: MessageCircle }
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
    const [attachments, setAttachments] = useState<File[]>([]);

    useEffect(() => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const found = mockTickets.find((t) => t.id === id) || null;
            setTicket(found);
            setReplies(mockReplies[id as string] || []);
            setLoading(false);
        }, 1000);
    }, [id]);

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
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold border ${colors[status]}`}
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
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${colors[priority]}`}
            >
                <Tag className="w-3 h-3" />
                {priority}
            </span>
        );
    }

    async function handleReplySubmit(e: React.FormEvent) {
        e.preventDefault();
        setReplyError(null);
        setReplySuccess(false);

        if (!replyText.trim()) {
            setReplyError("Please enter a message before sending.");
            return;
        }

        setSending(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const newReply: Reply = {
                id: `r${Date.now()}`,
                sender: "Teacher",
                senderName: "You",
                message: replyText.trim(),
                createdAt: new Date().toISOString(),
                attachments: attachments.map(file => file.name)
            };

            setReplies((prev) => [...prev, newReply]);
            setReplyText("");
            setAttachments([]);
            setReplySuccess(true);

            // Update ticket responses count and last response time
            if (ticket) {
                setTicket({
                    ...ticket,
                    responses: ticket.responses + 1,
                    lastResponse: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
        } catch (error) {
            setReplyError("Failed to send reply. Please check your connection and try again.");
        } finally {
            setSending(false);
        }
    }

    function handleAttachmentSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        setAttachments(prev => [...prev, ...files]);
    }

    function removeAttachment(index: number) {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex-1 min-h-0 overflow-auto">
                    <div className="p-6 space-y-8">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Skeleton className="h-32 rounded-2xl" />
                            <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!ticket) {
        return (
            <DashboardLayout>
                <div className="flex-1 min-h-0 overflow-auto">
                    <div className="p-6">
                        <div className="text-center py-12">
                            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h1>
                            <p className="text-gray-600 mb-6">The support ticket you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                            <button
                                onClick={() => router.push('/dashboard/teacher/support')}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Support Tickets
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const category = categoryInfo[ticket.category as keyof typeof categoryInfo] || categoryInfo.technical;

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard/teacher/support')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Tickets
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Support Ticket</h1>
                                <p className="text-gray-600">Ticket #{ticket.id}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200">
                                <Bell className="w-4 h-4" />
                                Subscribe
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Ticket Info */}
                        <div className="space-y-6">
                            {/* Ticket Overview */}
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Overview</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <div className="mt-1">{statusBadge(ticket.status)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Priority</label>
                                        <div className="mt-1">{priorityBadge(ticket.priority)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Category</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                                                <category.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-medium text-gray-900">{category.name}</span>
                                        </div>
                                    </div>
                                    {ticket.assignedTo && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Assigned To</label>
                                            <p className="mt-1 font-medium text-gray-900">{ticket.assignedTo}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Created</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Last Updated</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Responses</p>
                                            <p className="text-sm text-gray-600">{ticket.responses} messages</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Conversation */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ticket Header */}
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
                                    {priorityBadge(ticket.priority)}
                                </div>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket.message}</p>
                                </div>
                                
                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {ticket.attachments.map((attachment, index) => (
                                                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                                                    <FileText className="w-4 h-4 text-gray-600" />
                                                    <span className="text-gray-700">{attachment}</span>
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <Download className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Conversation Thread */}
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversation</h2>
                                
                                {replies.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">No messages yet. Be the first to reply!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {replies.map((reply) => (
                                            <div
                                                key={reply.id}
                                                className={`flex gap-4 ${reply.sender === "Teacher" ? "flex-row-reverse" : ""}`}
                                            >
                                                {/* Avatar */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    reply.sender === "Teacher" 
                                                        ? "bg-green-100 text-green-600" 
                                                        : reply.isInternal
                                                            ? "bg-purple-100 text-purple-600"
                                                            : "bg-blue-100 text-blue-600"
                                                }`}>
                                                    {reply.sender === "Teacher" ? (
                                                        <User className="w-5 h-5" />
                                                    ) : reply.isInternal ? (
                                                        <Shield className="w-5 h-5" />
                                                    ) : (
                                                        <User className="w-5 h-5" />
                                                    )}
                                                </div>

                                                {/* Message */}
                                                <div className={`flex-1 ${reply.sender === "Teacher" ? "text-right" : ""}`}>
                                                    <div className={`inline-block max-w-md p-4 rounded-2xl ${
                                                        reply.sender === "Teacher" 
                                                            ? "bg-green-50 border border-green-200" 
                                                            : reply.isInternal
                                                                ? "bg-purple-50 border border-purple-200"
                                                                : "bg-blue-50 border border-blue-200"
                                                    }`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`font-semibold ${
                                                                reply.sender === "Teacher" 
                                                                    ? "text-green-800" 
                                                                    : reply.isInternal
                                                                        ? "text-purple-800"
                                                                        : "text-blue-800"
                                                            }`}>
                                                                {reply.senderName}
                                                            </span>
                                                            {reply.isInternal && (
                                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                                    Internal Note
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                            {reply.message}
                                                        </p>
                                                        {reply.attachments && reply.attachments.length > 0 && (
                                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {reply.attachments.map((attachment, index) => (
                                                                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs">
                                                                            <FileText className="w-3 h-3 text-gray-600" />
                                                                            <span className="text-gray-600">{attachment}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs text-gray-500 mt-2 ${reply.sender === "Teacher" ? "text-right" : ""}`}>
                                                        {new Date(reply.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reply Form */}
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <form onSubmit={handleReplySubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                                            Add to Conversation
                                        </label>
                                        <textarea
                                            id="reply"
                                            rows={4}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                            placeholder="Type your reply here... Include any additional details or questions that might help resolve this ticket faster."
                                            disabled={sending}
                                        />
                                    </div>

                                    {/* File Attachments */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Attachments
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                                                    <FileText className="w-4 h-4 text-gray-600" />
                                                    <span className="text-gray-700">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200 w-fit">
                                            <Paperclip className="w-4 h-4" />
                                            <span className="text-sm font-medium">Add Files</span>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleAttachmentSelect}
                                                className="hidden"
                                                disabled={sending}
                                            />
                                        </label>
                                    </div>

                                    {replyError && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                            {replyError}
                                        </div>
                                    )}

                                    {replySuccess && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                                            Reply sent successfully! The support team will respond soon.
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            Typical response time: 2-4 hours during business days
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={sending || !replyText.trim()}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                        >
                                            {sending ? (
                                                <>
                                                    <Clock className="w-4 h-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Reply
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}