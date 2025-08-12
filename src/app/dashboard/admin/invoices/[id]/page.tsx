"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileDown, Printer } from "lucide-react";
import React from "react";

export default function InvoiceViewPage() {
    const router = useRouter();
    const params = useParams();

    // Fake data — in production you'd fetch this from API
    const invoice = {
        invoiceNo: "INV-2025-001",
        studentName: "John Doe",
        regNo: "CS2025001",
        amount: 500,
        issueDate: "2025-07-01",
        dueDate: "2025-07-15",
        status: "Paid",
        items: [
            { description: "Tuition Fee - July 2025", qty: 1, price: 400 },
            { description: "Library Fee", qty: 1, price: 50 },
            { description: "Lab Fee", qty: 1, price: 50 },
        ],
        notes: "Thank you for your payment.",
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <FileDown size={18} /> Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        <Printer size={18} /> Print
                    </button>
                </div>
            </div>

            {/* Invoice Card */}
            <div className="bg-white shadow rounded-lg p-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Invoice</h1>
                        <p className="text-sm text-gray-600">#{invoice.invoiceNo}</p>
                    </div>
                    <div className="text-right">
                        <p
                            className={`font-semibold px-3 py-1 rounded-full text-sm inline-block ${invoice.status === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : invoice.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                        >
                            {invoice.status}
                        </p>
                    </div>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                        <p className="text-gray-500 text-sm">Student Name</p>
                        <p className="font-medium">{invoice.studentName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Registration No</p>
                        <p className="font-medium">{invoice.regNo}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Issue Date</p>
                        <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Due Date</p>
                        <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-8">
                    <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Description</th>
                                <th className="border px-4 py-2 text-left">Qty</th>
                                <th className="border px-4 py-2 text-left">Price</th>
                                <th className="border px-4 py-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="border px-4 py-2">{item.description}</td>
                                    <td className="border px-4 py-2">{item.qty}</td>
                                    <td className="border px-4 py-2">${item.price.toFixed(2)}</td>
                                    <td className="border px-4 py-2">${(item.qty * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                            {/* Total Row */}
                            <tr className="bg-gray-50 font-bold">
                                <td colSpan={3} className="border px-4 py-2 text-right">
                                    Total
                                </td>
                                <td className="border px-4 py-2">${invoice.amount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Notes</p>
                        <p className="text-gray-700">{invoice.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
