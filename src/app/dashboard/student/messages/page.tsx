"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, User, Clock, Eye, Search, Filter, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
    id: string;
    senderName: string;
    senderAvatarUrl?: string;
    senderRole?: string;
    subject: string;
    body: string;
    timestamp: string;
    isRead: boolean;
    priority?: "high" | "normal" | "low";
    category?: "academic" | "administrative" | "announcement" | "personal";
}

const dummyMessages: Message[] = [
    {
        id: "msg-1",
        senderName: "Dr. Smith",
        senderAvatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        senderRole: "Computer Science Instructor",
        subject: "Upcoming Final Exam Details and Preparation Guidelines",
        body: "Please be reminded that the final exam will cover chapters 1 to 5 of the textbook. The exam will be held in the main auditorium and will last 3 hours. Make sure to bring your student ID and calculator.",
        timestamp: "2025-08-05T09:30:00Z",
        isRead: false,
        priority: "high",
        category: "academic"
    },
    {
        id: "msg-2",
        senderName: "Registrar Office",
        senderRole: "Administration",
        subject: "Fall Semester Course Registration Opens Next Week",
        body: "Registration for the Fall semester courses will begin next Monday at 9:00 AM. Please ensure you have met with your academic advisor and have your course selections ready. Late registration will incur additional fees.",
        timestamp: "2025-07-30T14:00:00Z",
        isRead: true,
        priority: "normal",
        category: "administrative"
    },
    {
        id: "msg-3",
        senderName: "Prof. Jane",
        senderAvatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        senderRole: "Mathematics Department",
        subject: "Homework 4 Feedback and Important Corrections",
        body: "Great work on your last assignment! I've reviewed your submission and have some notes to help improve your understanding of linear algebra concepts. Please review the attached feedback document.",
        timestamp: "2025-08-03T12:15:00Z",
        isRead: false,
        priority: "normal",
        category: "academic"
    },
    {
        id: "msg-4",
        senderName: "Student Affairs",
        senderRole: "University Administration",
        subject: "Important: Campus Safety Guidelines Update",
        body: "Due to recent events, we are updating our campus safety protocols. All students must complete the new safety training module by the end of the month. Access the module through the student portal.",
        timestamp: "2025-08-01T16:45:00Z",
        isRead: true,
        priority: "high",
        category: "announcement"
    },
    {
        id: "msg-5",
        senderName: "Library Services",
        senderRole: "University Library",
        subject: "Extended Library Hours for Finals Week",
        body: "To support your exam preparation, the main library will extend its operating hours during finals week. We will be open until 2:00 AM from Monday through Friday.",
        timestamp: "2025-07-28T11:20:00Z",
        isRead: true,
        priority: "low",
        category: "announcement"
    },
];

function PriorityBadge({ priority }: { priority: Message["priority"] }) {
    switch (priority) {
        case "high":
            return <Badge className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
        case "normal":
            return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Normal</Badge>;
        case "low":
            return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Low Priority</Badge>;
        default:
            return null;
    }
}

function CategoryBadge({ category }: { category: Message["category"] }) {
    switch (category) {
        case "academic":
            return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Academic</Badge>;
        case "administrative":
            return <Badge className="bg-green-100 text-green-800 border-green-200">Administrative</Badge>;
        case "announcement":
            return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Announcement</Badge>;
        case "personal":
            return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Personal</Badge>;
        default:
            return null;
    }
}

export default function MessagesPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setTimeout(() => {
            setMessages(dummyMessages);
            setLoading(false);
        }, 1100);
    }, []);

    // Filter and search messages
    const filteredMessages = messages.filter(message => {
        const matchesFilter = filter === "all" || 
                            (filter === "unread" && !message.isRead) || 
                            (filter === "read" && message.isRead);
        const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            message.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            message.senderName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const unreadCount = messages.filter(msg => !msg.isRead).length;
    const totalMessages = messages.length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                        <p className="text-gray-600 mt-1">Communications from instructors and university staff</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {totalMessages} Messages
                    </Badge>
                </div>

                {/* Summary Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Mail className="w-6 h-6 text-indigo-200" />
                                <div className="text-indigo-200 text-sm font-medium">Total Messages</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalMessages}</div>
                            <div className="text-indigo-200 text-sm">All Communications</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Eye className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Unread</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{unreadCount}</div>
                            <div className="text-blue-200 text-sm">Require Attention</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <User className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Instructors</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                                {new Set(messages.filter(m => m.category === 'academic').map(m => m.senderName)).size}
                            </div>
                            <div className="text-green-200 text-sm">Active Senders</div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-amber-200" />
                                <div className="text-amber-200 text-sm font-medium">Latest</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                                {messages.length > 0 ? formatDistanceToNow(new Date(messages[0].timestamp), { addSuffix: true }).split(' ')[0] : '0'}
                            </div>
                            <div className="text-amber-200 text-sm">Days Ago</div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search messages by subject, content, or sender..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as "all" | "unread" | "read")}
                                >
                                    <option value="all">All Messages</option>
                                    <option value="unread">Unread Only</option>
                                    <option value="read">Read Only</option>
                                </select>
                            </div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {filteredMessages.length} results
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Messages List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {searchTerm || filter !== "all" 
                                ? "No messages match your search criteria. Try adjusting your filters."
                                : "You don't have any messages at the moment."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${
                                    !message.isRead ? "border-l-4 border-l-indigo-500 bg-indigo-50/30" : ""
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    {/* Message Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="flex-shrink-0">
                                                    {message.senderAvatarUrl ? (
                                                        <img
                                                            src={message.senderAvatarUrl}
                                                            alt={`${message.senderName} avatar`}
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                                                            <User className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className={`font-bold text-gray-900 text-lg ${!message.isRead ? "text-indigo-900" : ""}`}>
                                                            {message.subject}
                                                        </h3>
                                                        {!message.isRead && (
                                                            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                                                New
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">{message.senderName}</span>
                                                        {message.senderRole && (
                                                            <span className="text-gray-500">• {message.senderRole}</span>
                                                        )}
                                                    </div>

                                                    <p className="text-gray-600 line-clamp-2 mb-3">
                                                        {message.body}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {message.priority && <PriorityBadge priority={message.priority} />}
                                                        {message.category && <CategoryBadge category={message.category} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 items-start lg:items-end justify-between lg:justify-start">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
                                        </div>
                                        <Link
                                            href={`/dashboard/student/messages/${message.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                                        >
                                            View Message
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}