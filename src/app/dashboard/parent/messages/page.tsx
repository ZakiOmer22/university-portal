"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Send } from "lucide-react";

/**
 * Teacher Messages Page
 * - Responsive parent-teacher chat hub
 * - Uses localStorage to persist messages per conversation (simple demo)
 * - Avatars loaded via external URLs with plain <img> to avoid Next Image host config
 */

// --- Types
type Message = {
    id: string;
    sender: "teacher" | "parent";
    text: string;
    time: string; // ISO
};

type Conversation = {
    id: string;
    teacherName: string;
    subject: string;
    avatar: string;
    unread?: number;
    messages: Message[];
};

// --- Dummy initial conversations (will be stored to localStorage)
const initialConversations: Conversation[] = [
    {
        id: "t-1",
        teacherName: "Mrs. Hoda Ali",
        subject: "Mathematics — Grade 10",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        unread: 2,
        messages: [
            {
                id: "m-1",
                sender: "teacher",
                text: "Hello — we noticed Ayaan could use extra practice on quadratic equations. Would you like recommended exercises?",
                time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            },
            {
                id: "m-2",
                sender: "teacher",
                text: "Also, attendance is improving — great work!",
                time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
            },
        ],
    },
    {
        id: "t-2",
        teacherName: "Mr. Omar Farah",
        subject: "English — Grade 10",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        unread: 0,
        messages: [
            {
                id: "m-3",
                sender: "teacher",
                text: "Hi — just a quick note: Fatima did very well on her last reading comprehension test.",
                time: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
            },
            {
                id: "m-4",
                sender: "parent",
                text: "That's wonderful to hear — thank you!",
                time: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
            },
        ],
    },
    {
        id: "t-3",
        teacherName: "Ms. Leila Ibrahim",
        subject: "Science — Grade 8",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        unread: 1,
        messages: [
            {
                id: "m-5",
                sender: "teacher",
                text: "Reminder: science fair project proposals due next week.",
                time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            },
        ],
    },
];

// --- Helpers
const uid = (prefix = "") => prefix + Math.random().toString(36).slice(2, 9);

function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

// --- Component
export default function TeacherMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [composerText, setComposerText] = useState("");
    const [sending, setSending] = useState(false);
    const [showSidebarMobile, setShowSidebarMobile] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Load from localStorage or seed initial conversations
    useEffect(() => {
        const raw = typeof window !== "undefined" && localStorage.getItem("teacher_convos_v1");
        if (raw) {
            try {
                setConversations(JSON.parse(raw));
                // choose first conversation by default
                const parsed: Conversation[] = JSON.parse(raw);
                setSelectedId(parsed[0]?.id ?? null);
            } catch {
                setConversations(initialConversations);
                setSelectedId(initialConversations[0]?.id ?? null);
            }
            setTimeout(() => setLoading(false), 600);
            return;
        }

        // seed
        setConversations(initialConversations);
        setSelectedId(initialConversations[0]?.id ?? null);
        setTimeout(() => {
            // persist seed
            localStorage.setItem("teacher_convos_v1", JSON.stringify(initialConversations));
            setLoading(false);
        }, 600);
    }, []);

    // Auto-save to localStorage whenever convos change
    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem("teacher_convos_v1", JSON.stringify(conversations));
            } catch {
                // ignore
            }
        }
    }, [conversations, loading]);

    // Auto scroll to bottom on selected conversation change or messages update
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
        setShowSidebarMobile(false); // on mobile, hide list and show chat
        // mark as read
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
        };

        // append to conversation
        setConversations((prev) =>
            prev.map((c) => (c.id === selectedId ? { ...c, messages: [...c.messages, newMsg] } : c))
        );

        setComposerText("");
        setTimeout(() => {
            setSending(false);
            scrollToBottom();

            // Optionally simulate teacher reply after a short delay (comment out if undesired)
            setTimeout(() => {
                const teacherReply: Message = {
                    id: uid("tm-"),
                    sender: "teacher",
                    text: "Thanks for your message — I'll review and get back to you soon.",
                    time: new Date().toISOString(),
                };
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === selectedId ? { ...c, messages: [...c.messages, teacherReply] } : c
                    )
                );
            }, 1200);
        }, 350);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // Compose UI
    const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;

    return (
        <DashboardLayout user={user} loading={loading}>
            <main className="min-h-[70vh]">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">Teacher Messages</h1>
                        <p className="text-sm text-gray-600">Contact your child’s teachers directly — ask about progress, attendance, or schedule a meeting.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 min-h-[60vh]">
                            {/* Sidebar (conversations) */}
                            <aside
                                className={`border-r border-indigo-100 md:col-span-1 lg:col-span-1 bg-indigo-50 md:static ${showSidebarMobile ? "block" : "hidden"
                                    } md:block`}
                                aria-label="Conversation list"
                            >
                                <div className="p-4 border-b border-indigo-100 flex items-center gap-3">
                                    <input
                                        type="search"
                                        placeholder="Search teachers..."
                                        className="flex-1 px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        onChange={(e) => {
                                            // For demo: we don't filter but you can add filtering here
                                        }}
                                        aria-label="Search teachers"
                                    />
                                    <button
                                        className="md:hidden p-2 rounded-lg bg-indigo-600 text-white"
                                        onClick={() => setShowSidebarMobile(false)}
                                        aria-label="Close list"
                                        title="Close"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="p-3 space-y-2 h-[calc(100%-72px)] overflow-y-auto">
                                    {loading ? (
                                        // sidebar skeleton
                                        <>
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm animate-pulse">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-3 bg-gray-200 rounded w-3/5" />
                                                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        conversations.map((conv) => (
                                            <button
                                                key={conv.id}
                                                onClick={() => selectConversation(conv.id)}
                                                className={`w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-white transition ${selectedId === conv.id ? "bg-white shadow-sm" : ""
                                                    }`}
                                                aria-current={selectedId === conv.id}
                                            >
                                                <img
                                                    src={conv.avatar}
                                                    alt={conv.teacherName}
                                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <div className="font-semibold text-indigo-900">{conv.teacherName}</div>
                                                            <div className="text-sm text-gray-600">{conv.subject}</div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500">
                                                                {conv.messages[conv.messages.length - 1]
                                                                    ? new Date(conv.messages[conv.messages.length - 1].time).toLocaleDateString()
                                                                    : ""}
                                                            </div>
                                                            {conv.unread ? (
                                                                <span className="inline-block mt-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                                    {conv.unread}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 text-sm text-gray-700 truncate">
                                                        {conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text : "No messages yet."}
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </aside>

                            {/* Chat panel */}
                            <section className="md:col-span-2 lg:col-span-3 flex flex-col">
                                {/* Header for chat */}
                                <div className="p-4 border-b border-indigo-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Mobile back button */}
                                        <button
                                            className="md:hidden p-2 rounded-full hover:bg-indigo-100"
                                            onClick={() => setShowSidebarMobile(true)}
                                            aria-label="Back to conversations"
                                        >
                                            ←
                                        </button>

                                        {selectedConv ? (
                                            <>
                                                <img src={selectedConv.avatar} alt={selectedConv.teacherName} className="w-12 h-12 rounded-full object-cover" />
                                                <div>
                                                    <div className="font-semibold text-indigo-900">{selectedConv.teacherName}</div>
                                                    <div className="text-sm text-gray-600">{selectedConv.subject}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div>
                                                <div className="font-semibold text-indigo-900">Select a teacher</div>
                                                <div className="text-sm text-gray-600">Choose a conversation from the left to start</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm text-gray-600">Parent / Teacher Chat</div>
                                </div>

                                {/* Messages area */}
                                <div className="flex-1 p-6 overflow-y-auto bg-[linear-gradient(#f8fafc,#ffffff)]" aria-live="polite">
                                    {loading ? (
                                        // messages skeleton
                                        <>
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className={`mb-4 ${i % 2 === 0 ? "flex" : "flex justify-end"}`}>
                                                    <div className={`max-w-[70%] p-3 rounded-lg ${i % 2 === 0 ? "bg-white" : "bg-indigo-600 text-white"}`}>
                                                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                                                        <div className="h-3 bg-gray-200 rounded w-32 mt-2 animate-pulse" />
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : !selectedConv ? (
                                        // empty placeholder
                                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                            <img src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=800&q=60" alt="placeholder" className="w-64 rounded-lg shadow-md mb-6" />
                                            <h3 className="text-lg font-semibold text-indigo-900 mb-2">No conversation selected</h3>
                                            <p className="max-w-md">Select a teacher from the list to view the messages. You can ask about performance, attendance, homework, or schedule meetings.</p>
                                        </div>
                                    ) : selectedConv.messages.length === 0 ? (
                                        <div className="h-full flex items-center justify-center text-gray-500">No messages yet. Say hello 👋</div>
                                    ) : (
                                        // real messages
                                        <div className="space-y-4">
                                            {selectedConv.messages.map((msg) => (
                                                <div key={msg.id} className={`${msg.sender === "teacher" ? "flex" : "flex justify-end"}`}>
                                                    <div className={`${msg.sender === "teacher" ? "bg-white text-gray-900" : "bg-indigo-600 text-white"} max-w-[78%] p-3 rounded-lg shadow-sm`}>
                                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                                        <div className={`mt-2 text-[11px] ${msg.sender === "teacher" ? "text-gray-400" : "text-indigo-100"} text-right`}>
                                                            {formatTime(msg.time)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* spacer to scroll to */}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </div>

                                {/* Composer */}
                                <div className="p-4 border-t border-indigo-100 bg-white">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSend();
                                        }}
                                        className="flex gap-3 items-end"
                                    >
                                        <Textarea
                                            placeholder={selectedConv ? "Write a message to the teacher… (Enter to send, Shift+Enter for new line)" : "Select a conversation to start typing"}
                                            value={composerText}
                                            onChange={(e: any) => setComposerText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={!selectedConv || sending}
                                            className="flex-1 min-h-[56px] max-h-[200px] resize-none"
                                            aria-label="Message input"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <Button type="submit" disabled={!selectedConv || sending || !composerText.trim()} aria-label="Send message" className="flex items-center gap-2">
                                                <Send size={16} />
                                                Send
                                            </Button>
                                            <div className="text-xs text-gray-500 text-right">Press Enter to send</div>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
}
