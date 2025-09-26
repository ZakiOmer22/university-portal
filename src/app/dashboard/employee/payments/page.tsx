"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CreditCard, Clock, XCircle, CheckCircle } from "lucide-react";

interface Payment {
    id: string;
    studentName: string;
    regNo: string;
    amount: number;
    date: string;
    status: "Paid" | "Pending" | "Failed";
    method: string;
}

const paymentsData: Payment[] = [
    { id: "1", studentName: "John Doe", regNo: "CS2025001", amount: 500, date: "2025-07-01", status: "Paid", method: "Credit Card" },
    { id: "2", studentName: "Jane Smith", regNo: "CS2025002", amount: 300, date: "2025-07-03", status: "Pending", method: "Bank Transfer" },
    { id: "3", studentName: "Sam Wilson", regNo: "CS2025003", amount: 450, date: "2025-07-02", status: "Paid", method: "Cash" },
    { id: "4", studentName: "Emily Clark", regNo: "CS2025004", amount: 600, date: "2025-07-05", status: "Failed", method: "Credit Card" },
    { id: "5", studentName: "Michael Lee", regNo: "CS2025005", amount: 700, date: "2025-07-06", status: "Paid", method: "Bank Transfer" },
];

export default function PaymentsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const filteredPayments = useMemo(() => {
        return paymentsData.filter((p) => (statusFilter === "All" ? true : p.status === statusFilter));
    }, [statusFilter]);

    const totalPaid = paymentsData.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
    const totalPending = paymentsData.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);
    const totalFailed = paymentsData.filter(p => p.status === "Failed").reduce((sum, p) => sum + p.amount, 0);

    const chartData = [
        { name: "Paid", value: totalPaid },
        { name: "Pending", value: totalPending },
        { name: "Failed", value: totalFailed },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold">Payments Overview</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-5 flex items-center gap-4">
                    <CheckCircle className="text-green-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Total Paid</p>
                        <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
                    </div>
                </div>
                <div className="border-2 border-yellow-500 bg-yellow-50 rounded-lg p-5 flex items-center gap-4">
                    <Clock className="text-yellow-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Total Pending</p>
                        <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
                    </div>
                </div>
                <div className="border-2 border-red-500 bg-red-50 rounded-lg p-5 flex items-center gap-4">
                    <XCircle className="text-red-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Total Failed</p>
                        <p className="text-2xl font-bold">${totalFailed.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Payment Status Distribution</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
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
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Failed</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Student</th>
                            <th className="px-4 py-3 text-left">Reg No</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-6 text-center text-gray-500">
                                    No payments found.
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((p, idx) => (
                                <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{p.studentName}</td>
                                    <td className="px-4 py-3">{p.regNo}</td>
                                    <td className="px-4 py-3">${p.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3">{new Date(p.date).toLocaleDateString()}</td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${p.status === "Paid"
                                                ? "text-green-600"
                                                : p.status === "Pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {p.status}
                                    </td>
                                    <td className="px-4 py-3">{p.method}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
