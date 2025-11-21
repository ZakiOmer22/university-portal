"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
    MessageSquare, 
    Search, 
    ChevronDown, 
    ChevronUp, 
    X, 
    Filter,
    Mail,
    Clock,
    User,
    Calendar,
    Eye,
    Reply,
    Archive,
    MoreVertical,
    Download,
    Phone,
    MapPin,
    BookOpen,
    Star,
    CheckCircle2,
    AlertCircle,
    Send,
    FileText
} from "lucide-react";

const PAGE_SIZE = 12;

type Message = {
    id: string;
    studentName: string;
    email: string;
    course: string;
    content: string;
    date: string;
    priority: "normal" | "urgent";
    status: "unread" | "read" | "replied";
    studentYear: string;
    phone?: string;
    attachments?: string[];
};

function generateDummyMessages(count: number): Message[] {
    const firstNames = ["Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia"];
    const lastNames = ["Johnson", "Smith", "Lee", "White", "Brown", "Davis", "Wilson", "Moore", "Taylor", "Anderson"];
    const courses = ["Advanced Composition", "Modern Literature", "Creative Writing", "Professional Communication"];
    const years = ["Freshman", "Sophomore", "Junior", "Senior"];

    const messages: Message[] = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 4) % lastNames.length];
        const studentName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.university.edu`;
        const course = courses[i % courses.length];
        const content = `Dear Professor, I'm writing to follow up on ${i % 2 === 0 ? "the recent assignment submission" : "our discussion in class"}. ${i % 3 === 0 ? "I'm having trouble understanding the requirements for the research paper." : "Could you please clarify the grading criteria for the final project?"} ${i % 4 === 0 ? "I've attached my draft for your review." : "I'm available to meet during your office hours if that would be helpful."} Thank you for your time and guidance. Best regards, ${firstName}`;
        const date = new Date(
            2024,
            Math.floor(Math.random() * 3), // Last 3 months
            Math.floor(Math.random() * 28) + 1,
            Math.floor(Math.random() * 24),
            Math.floor(Math.random() * 60)
        ).toISOString();
        const priority = i % 5 === 0 ? "urgent" : "normal";
        const status = i % 3 === 0 ? "unread" : i % 3 === 1 ? "read" : "replied";
        const studentYear = years[i % years.length];
        const phone = i % 4 === 0 ? `+1 (555) ${100 + i}-${1000 + i}` : undefined;
        const attachments = i % 6 === 0 ? ["draft_paper.pdf", "research_notes.docx"] : undefined;

        messages.push({ 
            id: `msg${i + 1}`, 
            studentName, 
            email, 
            course,
            content, 
            date, 
            priority,
            status,
            studentYear,
            phone,
            attachments
        });
    }
    return messages;
}

export default function MessagesPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<keyof Message | null>("date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [courseFilter, setCourseFilter] = useState<string>("all");
    const [replyText, setReplyText] = useState("");
    const [replying, setReplying] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API fetch delay
        const timeoutId = setTimeout(() => {
            const data = generateDummyMessages(48);
            setMessages(data);
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timeoutId);
    }, []);

    // Filter messages by search term and filters
    const filteredMessages = useMemo(() => {
        let filtered = messages;
        
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (msg) =>
                    msg.studentName.toLowerCase().includes(lower) ||
                    msg.email.toLowerCase().includes(lower) ||
                    msg.course.toLowerCase().includes(lower) ||
                    msg.content.toLowerCase().includes(lower)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(msg => msg.status === statusFilter);
        }

        if (priorityFilter !== "all") {
            filtered = filtered.filter(msg => msg.priority === priorityFilter);
        }

        if (courseFilter !== "all") {
            filtered = filtered.filter(msg => msg.course === courseFilter);
        }

        return filtered;
    }, [messages, searchTerm, statusFilter, priorityFilter, courseFilter]);

    // Sorting logic
    const sortedMessages = useMemo(() => {
        if (!sortKey) return filteredMessages;

        return [...filteredMessages].sort((a, b) => {
            const key = sortKey as keyof Message;
            const aVal = a[key];
            const bVal = b[key];

            if (key === "date") {
                const aTime = new Date(aVal as string).getTime();
                const bTime = new Date(bVal as string).getTime();
                if (aTime < bTime) return sortDirection === "asc" ? -1 : 1;
                if (aTime > bTime) return sortDirection === "asc" ? 1 : -1;
                return 0;
            }

            // Fallback to string comparison for other fields
            const aStr = String(aVal ?? "");
            const bStr = String(bVal ?? "");
            const cmp = aStr.localeCompare(bStr);
            return sortDirection === "asc" ? cmp : -cmp;
        });
    }, [filteredMessages, sortKey, sortDirection]);

    const pageCount = Math.ceil(sortedMessages.length / PAGE_SIZE);
    const paginatedMessages = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return sortedMessages.slice(start, start + PAGE_SIZE);
    }, [sortedMessages, currentPage]);

    function onSort(key: keyof Message) {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDirection("desc");
        } else if (sortDirection === "desc") {
            setSortDirection("asc");
        } else {
            setSortKey(null);
            setSortDirection("desc");
        }
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    function getStatusIcon(status: Message["status"]) {
        switch (status) {
            case "unread": return <AlertCircle className="w-4 h-4 text-red-500" />;
            case "read": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "replied": return <Reply className="w-4 h-4 text-blue-500" />;
            default: return <Mail className="w-4 h-4 text-gray-500" />;
        }
    }

    function getPriorityBadge(priority: Message["priority"]) {
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                priority === "urgent" 
                    ? "bg-red-100 text-red-800 border border-red-200" 
                    : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}>
                {priority === "urgent" ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {priority}
            </span>
        );
    }

    async function handleReply() {
        if (!selectedMessage || !replyText.trim()) return;

        setReplying(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update message status to replied
        setMessages(prev => prev.map(msg => 
            msg.id === selectedMessage.id ? { ...msg, status: "replied" } : msg
        ));
        
        setSelectedMessage(prev => prev ? { ...prev, status: "replied" } : null);
        setReplyText("");
        setReplying(false);
    }

    const uniqueCourses = Array.from(new Set(messages.map(msg => msg.course)));

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Student Messages
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {messages.filter(m => m.status === 'unread').length} unread messages • Manage student communications
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200">
                                <Mail className="w-4 h-4" />
                                Compose
                            </button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search messages, students, or courses..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                            </select>
                            <select
                                value={priorityFilter}
                                onChange={(e) => {
                                    setPriorityFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Priority</option>
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <select
                                value={courseFilter}
                                onChange={(e) => {
                                    setCourseFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            >
                                <option value="all">All Courses</option>
                                {uniqueCourses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Messages</p>
                                    <p className="text-2xl font-bold">{messages.length}</p>
                                </div>
                                <Mail className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm">Unread</p>
                                    <p className="text-2xl font-bold">{messages.filter(m => m.status === 'unread').length}</p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-red-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm">Urgent</p>
                                    <p className="text-2xl font-bold">{messages.filter(m => m.priority === 'urgent').length}</p>
                                </div>
                                <Clock className="w-8 h-8 text-amber-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Replied</p>
                                    <p className="text-2xl font-bold">{messages.filter(m => m.status === 'replied').length}</p>
                                </div>
                                <Reply className="w-8 h-8 text-green-200" />
                            </div>
                        </div>
                    </div>

                    {/* Messages Table */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(8)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 rounded-xl" />
                                ))}
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
                                <p className="text-gray-600">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                {[
                                                    { key: "studentName", label: "Student", width: "w-48" },
                                                    { key: "course", label: "Course", width: "w-48" },
                                                    { key: "content", label: "Message", width: "flex-1" },
                                                    { key: "date", label: "Date", width: "w-32" },
                                                    { key: "status", label: "Status", width: "w-24" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => onSort(key as keyof Message)}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${width}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {sortKey === key && (
                                                                sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="p-4 w-20"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedMessages.map((message) => (
                                                <tr
                                                    key={message.id}
                                                    className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                                                        message.status === 'unread' ? 'bg-blue-50/50' : ''
                                                    }`}
                                                    onClick={() => setSelectedMessage(message)}
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                                {message.studentName.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{message.studentName}</div>
                                                                <div className="text-sm text-gray-500">{message.studentYear}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-700">{message.course}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-start gap-2">
                                                            {getPriorityBadge(message.priority)}
                                                            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                                                {message.content}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(message.date).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(message.date).toLocaleTimeString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(message.status)}
                                                            <span className="text-sm text-gray-700 capitalize">{message.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, sortedMessages.length)} of {sortedMessages.length} messages
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={prevPage}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={nextPage}
                                            disabled={currentPage === pageCount}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-start p-6 border-b border-gray-200">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {selectedMessage.studentName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedMessage.studentName}</h2>
                                        <p className="text-gray-600">{selectedMessage.studentYear} • {selectedMessage.course}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    {getPriorityBadge(selectedMessage.priority)}
                                    {getStatusIcon(selectedMessage.status)}
                                    <span className="text-sm text-gray-500 capitalize">{selectedMessage.status}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                    <Archive className="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="prose max-w-none">
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.content}
                                    </p>
                                </div>

                                {/* Student Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-blue-600">Email</p>
                                            <p className="font-medium">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <Phone className="w-4 h-4 text-green-600" />
                                            <div>
                                                <p className="text-sm text-green-600">Phone</p>
                                                <p className="font-medium">{selectedMessage.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Attachments */}
                                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Attachments</h4>
                                        <div className="flex gap-2">
                                            {selectedMessage.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                                    <FileText className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm text-gray-700">{file}</span>
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <Download className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reply Section */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Reply to {selectedMessage.studentName}</h4>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your response here..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-sm text-gray-600">
                                            This response will be sent to {selectedMessage.email}
                                        </div>
                                        <button
                                            onClick={handleReply}
                                            disabled={replying || !replyText.trim()}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            {replying ? (
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}