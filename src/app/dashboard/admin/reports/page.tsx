"use client";

import Link from "next/link";
import React, { useState } from "react";
import { BarChart3, FileText, Download, Eye } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

const reportStats = [
    {
        id: 1,
        title: "Total Reports Generated",
        value: 124,
        colorClass: "border-indigo-500 bg-indigo-100",
    },
    {
        id: 2,
        title: "Pending Approvals",
        value: 8,
        colorClass: "border-yellow-500 bg-yellow-100",
    },
    {
        id: 3,
        title: "Completed Reports",
        value: 116,
        colorClass: "border-green-500 bg-green-100",
    },
];

const chartData = [
    { month: "Jan", reports: 12 },
    { month: "Feb", reports: 18 },
    { month: "Mar", reports: 24 },
    { month: "Apr", reports: 20 },
    { month: "May", reports: 15 },
    { month: "Jun", reports: 35 },
];

const recentReports = [
    {
        id: "RPT-001",
        name: "Enrollment Summary Q1",
        date: "2025-06-12",
        status: "Completed",
    },
    {
        id: "RPT-002",
        name: "Attendance Overview",
        date: "2025-06-10",
        status: "Completed",
    },
    {
        id: "RPT-003",
        name: "Financial Statement May",
        date: "2025-06-05",
        status: "Pending",
    },
    {
        id: "RPT-004",
        name: "Faculty Workload Analysis",
        date: "2025-06-01",
        status: "Completed",
    },
];

export default function ReportsPage() {
    const [reports] = useState(recentReports);

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Title */}
            <div className="flex items-center gap-3">
                <BarChart3 size={32} className="text-indigo-600" />
                <h1 className="text-2xl font-bold">Reports</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {reportStats.map((stat) => (
                    <div
                        key={stat.id}
                        className={`border-2 ${stat.colorClass} rounded-lg p-5 shadow-sm hover:shadow-lg transition`}
                    >
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Reports Generated Per Month</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="reports" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left">Report ID</th>
                            <th className="px-4 py-3 text-left">Report Name</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, idx) => (
                            <tr
                                key={report.id}
                                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="px-4 py-3 font-medium">{report.id}</td>
                                <td className="px-4 py-3">{report.name}</td>
                                <td className="px-4 py-3">
                                    {new Date(report.date).toLocaleDateString()}
                                </td>
                                <td
                                    className={`px-4 py-3 font-semibold ${report.status === "Completed"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                        }`}
                                >
                                    {report.status}
                                </td>
                                <td className="px-4 py-3 flex gap-3">
                                    {/* View Report */}
                                    <Link
                                        href={`/dashboard/admin/reports/${report.id}/view`}
                                        className="text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        <Eye size={16} /> View
                                    </Link>

                                    {/* Download */}
                                    <button className="text-green-600 hover:underline flex items-center gap-1">
                                        <Download size={16} /> Download
                                    </button>

                                    {/* Details */}
                                    <Link
                                        href={`/dashboard/admin/reports/${report.id}/details`}
                                        className="text-gray-600 hover:underline flex items-center gap-1"
                                    >
                                        <FileText size={16} /> Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
