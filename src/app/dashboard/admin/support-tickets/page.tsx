"use client";

import React, { useState, useMemo } from "react";
import { MessageCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
interface SupportTicket {
    id: string;
    ticketNo: string;
    subject: string;
    requester: string;
    createdDate: string;
    status: "Open" | "In Progress" | "Closed";
    priority: "Low" | "Medium" | "High";
}

const ticketsData: SupportTicket[] = [
    {
        id: "1",
        ticketNo: "TCK-2025-001",
        subject: "Unable to login",
        requester: "John Doe",
        createdDate: "2025-08-01",
        status: "Open",
        priority: "High",
    },
    {
        id: "2",
        ticketNo: "TCK-2025-002",
        subject: "Issue with invoice generation",
        requester: "Jane Smith",
        createdDate: "2025-07-30",
        status: "In Progress",
        priority: "Medium",
    },
    {
        id: "3",
        ticketNo: "TCK-2025-003",
        subject: "Course material not visible",
        requester: "Sam Wilson",
        createdDate: "2025-07-28",
        status: "Closed",
        priority: "Low",
    },
];

export default function SupportTicketsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const filteredTickets = useMemo(() => {
        return ticketsData.filter((t) =>
            statusFilter === "All" ? true : t.status === statusFilter
        );
    }, [statusFilter]);

    const totalOpen = ticketsData.filter((t) => t.status === "Open").length;
    const totalInProgress = ticketsData.filter((t) => t.status === "In Progress").length;
    const totalClosed = ticketsData.filter((t) => t.status === "Closed").length;

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle size={28} className="text-indigo-600" /> Support Tickets
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-5 flex items-center gap-4">
                    <CheckCircle className="text-green-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Open</p>
                        <p className="text-2xl font-bold">{totalOpen}</p>
                    </div>
                </div>
                <div className="border-2 border-yellow-500 bg-yellow-50 rounded-lg p-5 flex items-center gap-4">
                    <Clock className="text-yellow-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">In Progress</p>
                        <p className="text-2xl font-bold">{totalInProgress}</p>
                    </div>
                </div>
                <div className="border-2 border-gray-500 bg-gray-100 rounded-lg p-5 flex items-center gap-4">
                    <XCircle className="text-gray-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Closed</p>
                        <p className="text-2xl font-bold">{totalClosed}</p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div>
                <label className="block mb-2 font-medium">Filter by Status</label>
                <select
                    className="p-2 border rounded"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Closed</option>
                </select>
            </div>

            {/* Tickets Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Ticket No</th>
                            <th className="px-4 py-3 text-left">Subject</th>
                            <th className="px-4 py-3 text-left">Requester</th>
                            <th className="px-4 py-3 text-left">Created Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Priority</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-gray-500">
                                    No tickets found.
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket, idx) => (
                                <tr
                                    key={ticket.id}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3 font-mono">{ticket.ticketNo}</td>
                                    <td className="px-4 py-3">{ticket.subject}</td>
                                    <td className="px-4 py-3">{ticket.requester}</td>
                                    <td className="px-4 py-3">
                                        {new Date(ticket.createdDate).toLocaleDateString()}
                                    </td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${ticket.status === "Open"
                                            ? "text-green-600"
                                            : ticket.status === "In Progress"
                                                ? "text-yellow-600"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        {ticket.status}
                                    </td>
                                    <td
                                        className={`px-4 py-3 ${ticket.priority === "High"
                                            ? "text-red-600 font-bold"
                                            : ticket.priority === "Medium"
                                                ? "text-yellow-600 font-semibold"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        {ticket.priority}
                                    </td>
                                    {/* You can add view / edit buttons here */}
                                    <td>
                                        <Link href={`/dashboard/admin/support-tickets/${ticket.id}`}>
                                            <button className="text-indigo-600 hover:underline flex items-center gap-1">
                                                <MessageCircle size={16} /> View
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
