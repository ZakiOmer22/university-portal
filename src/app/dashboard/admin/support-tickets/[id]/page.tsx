"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle, CheckCircle } from "lucide-react";

interface SupportTicket {
    id: string;
    ticketNo: string;
    subject: string;
    requester: string;
    createdDate: string;
    status: "Open" | "In Progress" | "Closed";
    priority: "Low" | "Medium" | "High";
    description: string;
}

// Dummy data (normally fetched from backend)
const ticketsData: SupportTicket[] = [
    {
        id: "1",
        ticketNo: "TCK-2025-001",
        subject: "Unable to login",
        requester: "John Doe",
        createdDate: "2025-08-01",
        status: "Open",
        priority: "High",
        description:
            "User reports unable to login since password reset. System shows 'invalid credentials'. Needs urgent resolution.",
    },
    {
        id: "2",
        ticketNo: "TCK-2025-002",
        subject: "Issue with invoice generation",
        requester: "Jane Smith",
        createdDate: "2025-07-30",
        status: "In Progress",
        priority: "Medium",
        description:
            "Invoice generation crashes the system when amount is over $10,000. Reproducible in testing environment.",
    },
    {
        id: "3",
        ticketNo: "TCK-2025-003",
        subject: "Course material not visible",
        requester: "Sam Wilson",
        createdDate: "2025-07-28",
        status: "Closed",
        priority: "Low",
        description:
            "Student cannot see course materials in dashboard after enrollment. Issue resolved by clearing cache.",
    },
];

export default function SupportTicketView() {
    const { id } = useParams();
    const router = useRouter();

    // Find ticket by id from dummy data
    const ticket = ticketsData.find((t) => t.id === id);

    // Local state for status and priority (simulate edit)
    const [status, setStatus] = useState(ticket?.status || "Open");
    const [priority, setPriority] = useState(ticket?.priority || "Low");

    // Messages state (dummy conversation)
    const [messages, setMessages] = useState<
        { sender: "User" | "Support"; content: string; timestamp: string }[]
    >([
        {
            sender: "User",
            content: "I can't log in since the password reset.",
            timestamp: "2025-08-01 09:30",
        },
        {
            sender: "Support",
            content: "We are looking into it and will update you shortly.",
            timestamp: "2025-08-01 10:00",
        },
    ]);
    const [reply, setReply] = useState("");

    if (!ticket) {
        return (
            <div className="p-6 min-h-screen bg-gray-50">
                <p className="text-red-600 font-bold text-lg">Ticket not found.</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const handleSendReply = () => {
        if (!reply.trim()) return;
        setMessages([
            ...messages,
            {
                sender: "Support",
                content: reply.trim(),
                timestamp: new Date().toLocaleString(),
            },
        ]);
        setReply("");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto space-y-6">
            <header className="flex items-center gap-3">
                <MessageCircle size={28} className="text-indigo-600" />
                <h1 className="text-2xl font-bold">Support Ticket Details</h1>
            </header>

            <section className="bg-white rounded shadow p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{ticket.subject}</h2>
                    <span className="text-sm font-mono text-gray-600">{ticket.ticketNo}</span>
                </div>

                <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="font-semibold">Requester:</p>
                        <p>{ticket.requester}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Created Date:</p>
                        <p>{new Date(ticket.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Status:</p>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as SupportTicket["status"])}
                            className="border rounded p-2"
                        >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <div>
                        <p className="font-semibold">Priority:</p>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as SupportTicket["priority"])}
                            className="border rounded p-2"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => alert("Changes saved! (simulate backend call)")}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                    >
                        <CheckCircle size={18} /> Save Changes
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </section>

            {/* Messages Section */}
            <section className="bg-white rounded shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                <div className="max-h-96 overflow-y-auto border rounded p-4 bg-gray-50 space-y-6">
                    {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded ${msg.sender === "User" ? "bg-indigo-100 text-indigo-900" : "bg-gray-200"
                                }`}
                        >
                            <p className="font-semibold">{msg.sender}</p>
                            <p>{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reply Section */}
            <section className="bg-white rounded shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Reply</h2>
                <textarea
                    rows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full border rounded p-2 resize-none"
                />
                <button
                    onClick={handleSendReply}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Send Reply
                </button>
            </section>
        </div>
    );
}
