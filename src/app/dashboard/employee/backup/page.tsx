"use client";

import React, { useState, useMemo } from "react";
import { Database, CheckCircle, XCircle, Clock } from "lucide-react";

interface Backup {
    id: string;
    backupName: string;
    date: string;
    sizeMB: number;
    status: "Success" | "Failed" | "Pending";
}

const backupData: Backup[] = [
    { id: "1", backupName: "Full Backup - July", date: "2025-07-01T02:00:00Z", sizeMB: 1500, status: "Success" },
    { id: "2", backupName: "Incremental Backup - July 5", date: "2025-07-05T02:00:00Z", sizeMB: 300, status: "Pending" },
    { id: "3", backupName: "Full Backup - June", date: "2025-06-01T02:00:00Z", sizeMB: 1400, status: "Failed" },
    { id: "4", backupName: "Incremental Backup - June 15", date: "2025-06-15T02:00:00Z", sizeMB: 250, status: "Success" },
];

export default function BackupPage() {
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [backups, setBackups] = useState<Backup[]>(backupData);
    const [isBackingUp, setIsBackingUp] = useState(false);

    // Filtering backups by status
    const filteredBackups = useMemo(() => {
        return statusFilter === "All" ? backups : backups.filter(b => b.status === statusFilter);
    }, [statusFilter, backups]);

    // Summary counts
    const totalSuccess = backups.filter(b => b.status === "Success").length;
    const totalFailed = backups.filter(b => b.status === "Failed").length;
    const totalPending = backups.filter(b => b.status === "Pending").length;

    // Simulate backup action
    const handleBackup = () => {
        setIsBackingUp(true);

        setTimeout(() => {
            // Fake new backup added
            const newBackup: Backup = {
                id: (backups.length + 1).toString(),
                backupName: `Manual Backup - ${new Date().toLocaleDateString()}`,
                date: new Date().toISOString(),
                sizeMB: Math.floor(Math.random() * 1000) + 200, // random size 200-1200 MB
                status: "Success",
            };

            setBackups([newBackup, ...backups]);
            setIsBackingUp(false);
        }, 3000);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Database size={28} /> Backups
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-5 flex items-center gap-4">
                    <CheckCircle className="text-green-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Successful Backups</p>
                        <p className="text-2xl font-bold">{totalSuccess}</p>
                    </div>
                </div>
                <div className="border-2 border-yellow-500 bg-yellow-50 rounded-lg p-5 flex items-center gap-4">
                    <Clock className="text-yellow-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Pending Backups</p>
                        <p className="text-2xl font-bold">{totalPending}</p>
                    </div>
                </div>
                <div className="border-2 border-red-500 bg-red-50 rounded-lg p-5 flex items-center gap-4">
                    <XCircle className="text-red-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Failed Backups</p>
                        <p className="text-2xl font-bold">{totalFailed}</p>
                    </div>
                </div>
            </div>

            {/* Backup Button */}
            <div>
                <button
                    disabled={isBackingUp}
                    onClick={handleBackup}
                    className={`px-5 py-2 rounded font-semibold text-white ${isBackingUp ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {isBackingUp ? "Backing up..." : "Create Backup Now"}
                </button>
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
                    <option>Success</option>
                    <option>Pending</option>
                    <option>Failed</option>
                </select>
            </div>

            {/* Backups Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Backup Name</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Size (MB)</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBackups.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No backups found.
                                </td>
                            </tr>
                        ) : (
                            filteredBackups.map((backup, idx) => (
                                <tr key={backup.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{backup.backupName}</td>
                                    <td className="px-4 py-3">{new Date(backup.date).toLocaleString()}</td>
                                    <td className="px-4 py-3">{backup.sizeMB}</td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${backup.status === "Success"
                                                ? "text-green-600"
                                                : backup.status === "Pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {backup.status}
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
