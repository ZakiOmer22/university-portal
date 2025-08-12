"use client";

import React, { useState } from "react";
import { Shield, Search } from "lucide-react";

interface AuditEntry {
    id: string;
    user: string;
    role: string;
    action: string;
    entity: string;
    oldValue?: string;
    newValue?: string;
    timestamp: string;
    ipAddress: string;
    location?: string;
}

const auditData: AuditEntry[] = [
    {
        id: "1",
        user: "John Doe",
        role: "Admin",
        action: "Deleted",
        entity: "Course: Physics 101",
        oldValue: "Physics 101 - Room B",
        newValue: "N/A",
        timestamp: "2025-08-12T10:45:22Z",
        ipAddress: "192.168.0.12",
        location: "New York, USA",
    },
    {
        id: "2",
        user: "Jane Smith",
        role: "Faculty",
        action: "Updated",
        entity: "Student: Mark Lee",
        oldValue: "Email: mark.old@example.com",
        newValue: "Email: mark.lee@example.com",
        timestamp: "2025-08-11T15:22:10Z",
        ipAddress: "192.168.0.24",
        location: "Chicago, USA",
    },
    {
        id: "3",
        user: "Admin Bot",
        role: "System",
        action: "Generated",
        entity: "Monthly Report",
        oldValue: "N/A",
        newValue: "Report for July 2025",
        timestamp: "2025-08-10T08:12:55Z",
        ipAddress: "127.0.0.1",
        location: "Server",
    },
];

export default function AuditTrailPage() {
    const [search, setSearch] = useState("");

    const filteredData = auditData.filter(
        (entry) =>
            entry.user.toLowerCase().includes(search.toLowerCase()) ||
            entry.action.toLowerCase().includes(search.toLowerCase()) ||
            entry.entity.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Page Title */}
            <div className="flex items-center gap-3">
                <Shield size={32} className="text-indigo-600" />
                <h1 className="text-2xl font-bold">Audit Trail</h1>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-white p-3 rounded shadow w-full sm:w-1/3">
                <Search size={18} className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search actions, users, entities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none flex-1"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Action</th>
                            <th className="px-4 py-3 text-left">Entity</th>
                            <th className="px-4 py-3 text-left">Old Value</th>
                            <th className="px-4 py-3 text-left">New Value</th>
                            <th className="px-4 py-3 text-left">Timestamp</th>
                            <th className="px-4 py-3 text-left">IP Address</th>
                            <th className="px-4 py-3 text-left">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-6 text-center text-gray-500">
                                    No matching records found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((entry, idx) => (
                                <tr
                                    key={entry.id}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium">{entry.user}</td>
                                    <td className="px-4 py-3">{entry.role}</td>
                                    <td className="px-4 py-3">{entry.action}</td>
                                    <td className="px-4 py-3">{entry.entity}</td>
                                    <td className="px-4 py-3 text-gray-500">{entry.oldValue}</td>
                                    <td className="px-4 py-3 text-green-600">{entry.newValue}</td>
                                    <td className="px-4 py-3">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">{entry.ipAddress}</td>
                                    <td className="px-4 py-3">{entry.location || "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
