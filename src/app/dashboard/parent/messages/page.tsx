"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, User, Clock, CheckCheck } from "lucide-react";

/**
 * Enhanced Teacher Messages Page
 * Modern parent-teacher communication hub with advanced features
 */

// --- Types
type Message = {
    id: string;
    sender: "teacher" | "parent";
    text: string;
    time: string;
    status?: "sent" | "delivered" | "read";
    attachments?: string[];
};

type Conversation = {
    id: string;
    teacherName: string;
    subject: string;
    grade: string;
    avatar: string;
    unread?: number;
    lastMessageTime: string;
    isOnline?: boolean;
    messages: Message[];
};

// --- Dummy initial conversations
const initialConversations: Conversation[] = [
    {
        id: "t-1",
        teacherName: "Mrs. Hoda Ali",
        subject: "Mathematics",
        grade: "Grade 10",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        unread: 2,
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isOnline: true,
        messages: [
            {
                id: "m-1",
                sender: "teacher",
                text: "Hello — we noticed Ayaan could use extra practice on quadratic equations. Would you like recommended exercises?",
                time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                status: "read"
            },
            {
                id: "m-2",
                sender: "teacher",
                text: "Also, attendance is improving — great work!",
                time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                status: "read"
            },
        ],
    },
    {
        id: "t-2",
        teacherName: "Mr. Omar Farah",
        subject: "English Literature",
        grade: "Grade 10",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        unread: 0,
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        isOnline: false,
        messages: [
            {
                id: "m-3",
                sender: "teacher",
                text: "Hi — just a quick note: Fatima did very well on her last reading comprehension test.",
                time: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
                status: "read"
            },
            {
                id: "m-4",
                sender: "parent",
                text: "That's wonderful to hear — thank you! She's been working hard on her reading.",
                time: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
                status: "read"
            },
        ],
    },
    {
        id: "t-3",
        teacherName: "Ms. Leila Ibrahim",
        subject: "Science",
        grade: "Grade 8",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        unread: 1,
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        isOnline: true,
        messages: [
            {
                id: "m-5",
                sender: "teacher",
                text: "Reminder: science fair project proposals due next week. Please ensure Layla submits her proposal by Friday.",
                time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
                status: "delivered"
            },
        ],
    },
    {
        id: "t-4",
        teacherName: "Dr. Ahmed Hassan",
        subject: "Physics",
        grade: "Grade 11",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        unread: 0,
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        isOnline: false,
        messages: [
            {
                id: "m-6",
                sender: "parent",
                text: "Hello Dr. Hassan, could you please share the topics for the upcoming mid-term exam?",
                time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
                status: "read"
            },
        ],
    },
];

// --- Helpers
const uid = (prefix = "") => prefix + Math.random().toString(36).slice(2, 9);

function formatTime(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
}

function formatMessageTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getStatusIcon(status?: Message["status"]) {
    switch (status) {
        case "read":
            return <CheckCheck size={14} className="text-blue-500" />;
        case "delivered":
            return <CheckCheck size={14} className="text-gray-400" />;
        case "sent":
            return <CheckCheck size={14} className="text-gray-300" />;
        default:
            return <Clock size={14} className="text-gray-300" />;
    }
}

// --- Component
export default function TeacherMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [composerText, setComposerText] = useState("");
    const [sending, setSending] = useState(false);
    const [showSidebarMobile, setShowSidebarMobile] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Load from localStorage or seed initial conversations
    useEffect(() => {
        const raw = typeof window !== "undefined" && localStorage.getItem("teacher_convos_v2");
        if (raw) {
            try {
                const parsed: Conversation[] = JSON.parse(raw);
                setConversations(parsed);
                setSelectedId(parsed[0]?.id ?? null);
            } catch {
                setConversations(initialConversations);
                setSelectedId(initialConversations[0]?.id ?? null);
            }
            setTimeout(() => setLoading(false), 600);
            return;
        }

        setConversations(initialConversations);
        setSelectedId(initialConversations[0]?.id ?? null);
        setTimeout(() => {
            localStorage.setItem("teacher_convos_v2", JSON.stringify(initialConversations));
            setLoading(false);
        }, 600);
    }, []);

    // Auto-save to localStorage
    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem("teacher_convos_v2", JSON.stringify(conversations));
            } catch {}
        }
    }, [conversations, loading]);

    // Auto scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [selectedId, conversations]);

    function scrollToBottom() {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
    }

    function selectConversation(id: string) {
        setSelectedId(id);
        setShowSidebarMobile(false);
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
        );
    }

    function handleSend() {
        if (!selectedId || !composerText.trim()) return;
        setSending(true);
        const text = composerText.trim();
        const newMsg: Message = {
            id: uid("pm-"),
            sender: "parent",
            text,
            time: new Date().toISOString(),
            status: "sent"
        };

        setConversations((prev) =>
            prev.map((c) => 
                c.id === selectedId ? { 
                    ...c, 
                    messages: [...c.messages, newMsg],
                    lastMessageTime: new Date().toISOString()
                } : c
            )
        );

        setComposerText("");
        setTimeout(() => {
            setSending(false);
            scrollToBottom();

            // Update message status to delivered
            setTimeout(() => {
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === selectedId ? {
                            ...c,
                            messages: c.messages.map(msg => 
                                msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg
                            )
                        } : c
                    )
                );
            }, 1000);

            // Simulate teacher reply
            setTimeout(() => {
                const teacherReply: Message = {
                    id: uid("tm-"),
                    sender: "teacher",
                    text: "Thanks for your message. I'll review and get back to you during school hours.",
                    time: new Date().toISOString(),
                    status: "delivered"
                };
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === selectedId ? { 
                            ...c, 
                            messages: [...c.messages, teacherReply],
                            lastMessageTime: new Date().toISOString()
                        } : c
                    )
                );
            }, 3000);
        }, 350);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // Filter conversations based on search
    const filteredConversations = conversations.filter(conv =>
        conv.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Teacher Messages
                            </h1>
                            <p className="text-gray-600 mt-2">Communicate directly with your children&apos;s teachers</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                                <span className="font-semibold text-indigo-600">
                                    {conversations.reduce((acc, conv) => acc + (conv.unread || 0), 0)}
                                </span> unread messages
                            </div>
                        </div>
                    </div>

                    {/* Main Chat Interface */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[70vh]">
                            {/* Conversations Sidebar */}
                            <aside className={`border-r border-gray-200 md:col-span-1 lg:col-span-1 bg-gray-50 ${showSidebarMobile ? "block" : "hidden"} md:block`}>
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search teachers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="h-[calc(100%-80px)] overflow-y-auto">
                                    {loading ? (
                                        <div className="p-4 space-y-4">
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg animate-pulse">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : filteredConversations.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p>No teachers found</p>
                                        </div>
                                    ) : (
                                        filteredConversations.map((conv) => (
                                            <button
                                                key={conv.id}
                                                onClick={() => selectConversation(conv.id)}
                                                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-white transition-all duration-200 ${
                                                    selectedId === conv.id ? "bg-white border-l-4 border-l-indigo-500" : ""
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="relative">
                                                        <img
                                                            src={conv.avatar}
                                                            alt={conv.teacherName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                        {conv.isOnline && (
                                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="font-semibold text-gray-900 truncate">
                                                                {conv.teacherName}
                                                            </h3>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                {formatTime(conv.lastMessageTime)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            {conv.subject} • {conv.grade}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-gray-500 truncate flex-1 mr-2">
                                                                {conv.messages[conv.messages.length - 1]?.text || "No messages yet"}
                                                            </p>
                                                            {conv.unread ? (
                                                                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
                                                                    {conv.unread}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </aside>

                            {/* Chat Area */}
                            <section className="md:col-span-2 lg:col-span-3 flex flex-col">
                                {/* Chat Header */}
                                <div className="p-6 border-b border-gray-200 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                onClick={() => setShowSidebarMobile(true)}
                                            >
                                                ←
                                            </button>

                                            {selectedConv ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img 
                                                            src={selectedConv.avatar} 
                                                            alt={selectedConv.teacherName} 
                                                            className="w-14 h-14 rounded-full object-cover" 
                                                        />
                                                        {selectedConv.isOnline && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-semibold text-gray-900">
                                                            {selectedConv.teacherName}
                                                        </h2>
                                                        <p className="text-gray-600">
                                                            {selectedConv.subject} • {selectedConv.grade}
                                                            {selectedConv.isOnline && (
                                                                <span className="ml-2 text-green-600 text-sm">• Online</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900">Select a Conversation</h2>
                                                    <p className="text-gray-600">Choose a teacher to start messaging</p>
                                                </div>
                                            )}
                                        </div>

                                        {selectedConv && (
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Phone size={16} />
                                                    Call
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Video size={16} />
                                                    Video
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className={`flex ${i % 2 === 0 ? "" : "justify-end"}`}>
                                                    <div className={`max-w-[70%] p-4 rounded-2xl ${i % 2 === 0 ? "bg-white" : "bg-indigo-500"} animate-pulse`}>
                                                        <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                                                        <div className="h-3 bg-gray-200 rounded w-32" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : !selectedConv ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                                <User className="w-12 h-12 text-indigo-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversation selected</h3>
                                            <p className="max-w-md text-gray-600 mb-6">
                                                Choose a teacher from the list to start a conversation about your child&apos;s progress, assignments, or schedule a meeting.
                                            </p>
                                        </div>
                                    ) : selectedConv.messages.length === 0 ? (
                                        <div className="h-full flex items-center justify-center text-gray-500">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Send className="w-8 h-8 text-indigo-400" />
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900 mb-2">No messages yet</p>
                                                <p className="text-gray-600">Send the first message to start the conversation</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedConv.messages.map((msg) => (
                                                <div key={msg.id} className={`flex ${msg.sender === "teacher" ? "" : "justify-end"}`}>
                                                    <div className={`max-w-[75%] rounded-2xl p-4 ${
                                                        msg.sender === "teacher" 
                                                            ? "bg-white border border-gray-200" 
                                                            : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                                                    }`}>
                                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                            {msg.text}
                                                        </div>
                                                        <div className={`flex items-center gap-2 mt-2 text-xs ${
                                                            msg.sender === "teacher" ? "text-gray-500" : "text-indigo-100"
                                                        }`}>
                                                            <span>{formatMessageTime(msg.time)}</span>
                                                            {msg.sender === "parent" && (
                                                                <div className="flex items-center">
                                                                    {getStatusIcon(msg.status)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </div>

                                {/* Message Composer */}
                                <div className="p-6 border-t border-gray-200 bg-white">
                                    {selectedConv ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="space-y-3">
                                            <div className="flex gap-3">
                                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Paperclip size={20} />
                                                </button>
                                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Smile size={20} />
                                                </button>
                                            </div>
                                            <div className="flex gap-3">
                                                <Textarea
                                                    placeholder="Type your message... (Press Enter to send)"
                                                    value={composerText}
                                                    onChange={(e) => setComposerText(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    disabled={sending}
                                                    className="flex-1 min-h-[80px] resize-none border-gray-300 focus:border-indigo-500"
                                                />
                                                <Button 
                                                    type="submit" 
                                                    disabled={!composerText.trim() || sending}
                                                    className="bg-indigo-600 hover:bg-indigo-700 px-6"
                                                >
                                                    <Send size={18} />
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="text-center text-gray-500 py-4">
                                            Select a conversation to start messaging
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}