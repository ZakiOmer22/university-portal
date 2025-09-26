"use client";

import React, { useState, useMemo } from "react";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

interface Invoice {
    id: string;
    invoiceNo: string;
    studentName: string;
    regNo: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: "Paid" | "Pending" | "Overdue";
}

const invoicesData: Invoice[] = [
    {
        id: "1",
        invoiceNo: "INV-2025-001",
        studentName: "John Doe",
        regNo: "CS2025001",
        amount: 500,
        issueDate: "2025-07-01",
        dueDate: "2025-07-15",
        status: "Paid",
    },
    {
        id: "2",
        invoiceNo: "INV-2025-002",
        studentName: "Jane Smith",
        regNo: "CS2025002",
        amount: 300,
        issueDate: "2025-07-05",
        dueDate: "2025-07-20",
        status: "Pending",
    },
    {
        id: "3",
        invoiceNo: "INV-2025-003",
        studentName: "Sam Wilson",
        regNo: "CS2025003",
        amount: 450,
        issueDate: "2025-06-20",
        dueDate: "2025-07-05",
        status: "Overdue",
    },
];

export default function InvoicesPage() {
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const filteredInvoices = useMemo(() => {
        return invoicesData.filter((i) =>
            statusFilter === "All" ? true : i.status === statusFilter
        );
    }, [statusFilter]);

    const totalPaid = invoicesData.filter((i) => i.status === "Paid").length;
    const totalPending = invoicesData.filter((i) => i.status === "Pending").length;
    const totalOverdue = invoicesData.filter((i) => i.status === "Overdue").length;

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold">Invoices</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-5 flex items-center gap-4">
                    <CheckCircle className="text-green-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Paid</p>
                        <p className="text-2xl font-bold">{totalPaid}</p>
                    </div>
                </div>
                <div className="border-2 border-yellow-500 bg-yellow-50 rounded-lg p-5 flex items-center gap-4">
                    <Clock className="text-yellow-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Pending</p>
                        <p className="text-2xl font-bold">{totalPending}</p>
                    </div>
                </div>
                <div className="border-2 border-red-500 bg-red-50 rounded-lg p-5 flex items-center gap-4">
                    <XCircle className="text-red-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Overdue</p>
                        <p className="text-2xl font-bold">{totalOverdue}</p>
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
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                </select>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Invoice No</th>
                            <th className="px-4 py-3 text-left">Student</th>
                            <th className="px-4 py-3 text-left">Reg No</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Issue Date</th>
                            <th className="px-4 py-3 text-left">Due Date</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-6 text-center text-gray-500">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            filteredInvoices.map((inv, idx) => (
                                <tr
                                    key={inv.id}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3 font-mono">{inv.invoiceNo}</td>
                                    <td className="px-4 py-3">{inv.studentName}</td>
                                    <td className="px-4 py-3">{inv.regNo}</td>
                                    <td className="px-4 py-3">${inv.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        {new Date(inv.issueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(inv.dueDate).toLocaleDateString()}
                                    </td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${inv.status === "Paid"
                                                ? "text-green-600"
                                                : inv.status === "Pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {inv.status}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/dashboard/admin/invoices/${inv.id}`}>
                                            <button className="text-indigo-600 hover:underline flex items-center gap-1">
                                                <FileText size={16} /> View
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
