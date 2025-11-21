"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, User, Calendar, Mail, Clock, Reply, Archive, Flag } from "lucide-react";

interface Message {
    id: string;
    senderName: string;
    senderAvatarUrl?: string;
    senderRole?: string;
    senderEmail?: string;
    subject: string;
    body: string;
    timestamp: string;
    isRead: boolean;
    priority?: "high" | "normal" | "low";
    category?: "academic" | "administrative" | "announcement" | "personal";
    attachments?: { name: string; url: string; size: string }[];
}

const dummyMessages: Message[] = [
    {
        id: "msg-1",
        senderName: "Dr. Smith",
        senderAvatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        senderRole: "Computer Science Instructor",
        senderEmail: "smith@university.edu",
        subject: "Upcoming Final Exam Details and Preparation Guidelines",
        body: `Dear Students,

I hope this message finds you well. I'm writing to provide important details about the upcoming final exam for CS101.

**Exam Details:**
- Date: August 15, 2025
- Time: 9:00 AM - 12:00 PM
- Location: Main Auditorium, Science Building
- Duration: 3 hours
- Materials Allowed: Calculator, two double-sided cheat sheets

**Exam Coverage:**
The final exam will comprehensively cover chapters 1 to 5 of our textbook, with particular emphasis on:
- Data structures and algorithms
- Object-oriented programming concepts
- Memory management
- Basic computational complexity

**Preparation Tips:**
1. Review all lecture slides from weeks 1-12
2. Complete the practice problems in the study guide
3. Attend the review session this Friday at 2:00 PM
4. Focus on understanding core concepts rather than memorization

Please make sure to bring your student ID and arrive at least 15 minutes early. If you have any questions or require special accommodations, don't hesitate to reach out.

Best regards,
Dr. Smith
Computer Science Department`,
        timestamp: "2025-08-05T09:30:00Z",
        isRead: false,
        priority: "high",
        category: "academic",
        attachments: [
            { name: "Exam_Study_Guide.pdf", url: "#", size: "2.4 MB" },
            { name: "Practice_Problems.zip", url: "#", size: "1.1 MB" }
        ]
    },
    {
        id: "msg-2",
        senderName: "Registrar Office",
        senderRole: "University Administration",
        senderEmail: "registrar@university.edu",
        subject: "Fall Semester Course Registration Opens Next Week",
        body: "Registration for the Fall semester courses will begin next Monday. Please log in to your portal to select your courses early and avoid last-minute issues.",
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
        senderEmail: "jane@university.edu",
        subject: "Homework 4 Feedback and Important Corrections",
        body: "Great work on your last assignment! Just a few notes to improve: pay attention to question 3 where you missed the edge cases.",
        timestamp: "2025-08-03T12:15:00Z",
        isRead: false,
        priority: "normal",
        category: "academic"
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

export default function MessageDetailPage() {
    const params = useParams();
    const router = useRouter();
    const messageId = params?.id ?? "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

        setTimeout(() => {
            const foundMsg = dummyMessages.find((msg) => msg.id === messageId);
            if (foundMsg) {
                setMessage(foundMsg);
                setLoading(false);
            } else {
                setError("Message not found.");
                setLoading(false);
            }
        }, 900);
    }, [messageId]);

    const formatMessageBody = (body: string) => {
        return body.split('\n').map((line, index) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={index} className="font-bold text-gray-900 mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
            }
            if (line.startsWith('- ')) {
                return <li key={index} className="ml-4 text-gray-700">{line.substring(2)}</li>;
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            if (line.match(/^\d+\./)) {
                return <li key={index} className="ml-4 text-gray-700">{line}</li>;
            }
            return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>;
        });
    };

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                    aria-label="Go back to messages list"
                >
                    <ArrowLeft size={18} />
                    Back to Messages
                </button>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2 border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                        <div>
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {loading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-64" />
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <Skeleton className="w-16 h-16 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-full mb-3" />
                            <Skeleton className="h-4 w-full mb-3" />
                            <Skeleton className="h-4 w-3/4 mb-3" />
                            <Skeleton className="h-4 w-full mb-3" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                ) : message ? (
                    <div className="space-y-6">
                        {/* Message Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        {message.priority && <PriorityBadge priority={message.priority} />}
                                        {message.category && <CategoryBadge category={message.category} />}
                                        {!message.isRead && (
                                            <Badge className="bg-white/20 text-white border-none">New</Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold mb-2">{message.subject}</h1>
                                    <p className="text-indigo-100 text-lg opacity-90">
                                        Important communication from {message.senderName}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold mb-1">
                                        {new Date(message.timestamp).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                    <div className="text-indigo-100 text-sm">Received</div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Message Content */}
                            <div className="lg:col-span-3 space-y-8">
                                {/* Message Body */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <div className="flex items-start gap-6 mb-8">
                                        {message.senderAvatarUrl ? (
                                            <img
                                                src={message.senderAvatarUrl}
                                                alt={`${message.senderName} avatar`}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-200">
                                                <User className="w-10 h-10 text-indigo-600" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">{message.senderName}</h2>
                                            {message.senderRole && (
                                                <p className="text-gray-600 mb-1">{message.senderRole}</p>
                                            )}
                                            {message.senderEmail && (
                                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{message.senderEmail}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                                                <Clock className="w-4 h-4 ml-2" />
                                                <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-8">
                                        <div className="prose max-w-none text-gray-800 leading-relaxed">
                                            {formatMessageBody(message.body)}
                                        </div>
                                    </div>
                                </section>

                                {/* Attachments */}
                                {message.attachments && message.attachments.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                            <Flag className="w-5 h-5 text-blue-600" />
                                            Attachments ({message.attachments.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {message.attachments.map((attachment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                                >
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-sm">PDF</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{attachment.name}</h4>
                                                        <p className="text-sm text-gray-500">{attachment.size}</p>
                                                    </div>
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm">
                                                        Download
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Sidebar - Quick Actions */}
                            <div className="space-y-6">
                                {/* Message Actions */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Message Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left">
                                            <Reply className="w-4 h-4 text-green-600" />
                                            <div>
                                                <div className="font-medium text-gray-900">Reply</div>
                                                <div className="text-sm text-gray-600">Respond to sender</div>
                                            </div>
                                        </button>
                                        
                                        <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 text-left">
                                            <Archive className="w-4 h-4 text-amber-600" />
                                            <div>
                                                <div className="font-medium text-gray-900">Archive</div>
                                                <div className="text-sm text-gray-600">Move to archives</div>
                                            </div>
                                        </button>
                                        
                                        <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                                            <Flag className="w-4 h-4 text-red-600" />
                                            <div>
                                                <div className="font-medium text-gray-900">Report</div>
                                                <div className="text-sm text-gray-600">Flag as inappropriate</div>
                                            </div>
                                        </button>
                                    </div>
                                </section>

                                {/* Message Information */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Message Info</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <Badge className={message.isRead ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                                                {message.isRead ? "Read" : "Unread"}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Priority:</span>
                                            {message.priority && <PriorityBadge priority={message.priority} />}
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Category:</span>
                                            {message.category && <CategoryBadge category={message.category} />}
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Received:</span>
                                            <span className="font-medium">{new Date(message.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </DashboardLayout>
    );
}