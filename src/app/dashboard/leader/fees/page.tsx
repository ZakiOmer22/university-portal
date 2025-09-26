"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface FeeItem {
    id: string;
    description: string;
    amount: number;
    dueDate: string; // ISO date string
    semester: number;
    status: "paid" | "partial" | "unpaid";
}

interface PaymentRecord {
    id: string;
    feeId: string;
    paymentDate: string;
    amountPaid: number;
    receiptUrl?: string;
}

const dummyFeeItems: FeeItem[] = [
    { id: "fee1", description: "Tuition Fee", amount: 500, dueDate: "2025-09-01", semester: 1, status: "paid" },
    { id: "fee2", description: "Lab Fee", amount: 100, dueDate: "2025-09-01", semester: 1, status: "partial" },
    { id: "fee3", description: "Library Fee", amount: 50, dueDate: "2025-09-01", semester: 1, status: "unpaid" },
    { id: "fee4", description: "Tuition Fee", amount: 550, dueDate: "2026-02-01", semester: 2, status: "unpaid" },
    // Add more fees for different semesters...
];

const dummyPayments: PaymentRecord[] = [
    { id: "pay1", feeId: "fee1", paymentDate: "2025-08-15", amountPaid: 500, receiptUrl: "/dashboard/student/fees/view/" },
    { id: "pay2", feeId: "fee2", paymentDate: "2025-08-20", amountPaid: 50 },
    // Partial payment for fee2 (100 total, paid 50)
];

function statusBadge(status: FeeItem["status"]) {
    switch (status) {
        case "paid":
            return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
        case "partial":
            return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
        case "unpaid":
            return <Badge className="bg-red-100 text-red-800">Unpaid</Badge>;
        default:
            return null;
    }
}

export default function FeesAndPaymentsPage() {
    const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setFeeItems(dummyFeeItems);
            setPayments(dummyPayments);
            setLoading(false);
        }, 1000);
    }, []);

    const semesters = Array.from(new Set(feeItems.map((f) => f.semester))).sort();

    // Filter fees by selected semester
    const displayedFees =
        selectedSemester === "all" ? feeItems : feeItems.filter((f) => f.semester === selectedSemester);

    // Calculate totals
    const totalAmountDue = displayedFees.reduce((sum, f) => sum + f.amount, 0);
    const totalAmountPaid = displayedFees.reduce((sum, f) => {
        const paidAmount = payments
            .filter((p) => p.feeId === f.id)
            .reduce((a, p) => a + p.amountPaid, 0);
        return sum + paidAmount;
    }, 0);

    return (
        <DashboardLayout loading={loading} user={null}>
            <section className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto my-8">
                <h1 className="text-3xl font-bold text-indigo-900 mb-6">Fees & Payments</h1>

                {/* Semester Filter */}
                <div className="mb-6 flex flex-wrap gap-3 items-center">
                    <label htmlFor="semester" className="font-semibold mr-2 text-indigo-900">
                        Filter by Semester:
                    </label>
                    <select
                        id="semester"
                        value={selectedSemester}
                        onChange={(e) =>
                            setSelectedSemester(e.target.value === "all" ? "all" : Number(e.target.value))
                        }
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="all">All Semesters</option>
                        {semesters.map((sem) => (
                            <option key={sem} value={sem}>
                                Semester {sem}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fees Table */}
                <table className="w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                        <tr className="bg-indigo-100 text-indigo-900">
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Amount (USD)</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Due Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedFees.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-600 italic">
                                    No fees found for selected semester.
                                </td>
                            </tr>
                        ) : (
                            displayedFees.map(({ id, description, amount, dueDate, status }) => (
                                <tr key={id} className="even:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{description}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">${amount.toFixed(2)}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {new Date(dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{statusBadge(status)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="font-semibold bg-indigo-50">
                            <td className="border border-gray-300 px-4 py-2 text-right">Total Due:</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">${totalAmountDue.toFixed(2)}</td>
                            <td colSpan={2}></td>
                        </tr>
                        <tr className="font-semibold bg-indigo-50">
                            <td className="border border-gray-300 px-4 py-2 text-right">Total Paid:</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">${totalAmountPaid.toFixed(2)}</td>
                            <td colSpan={2}></td>
                        </tr>
                        <tr className="font-semibold bg-indigo-50">
                            <td className="border border-gray-300 px-4 py-2 text-right">Balance:</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                ${(totalAmountDue - totalAmountPaid).toFixed(2)}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>

                {/* Payment History */}
                <section>
                    <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Payment History</h2>

                    {payments.length === 0 ? (
                        <p className="italic text-gray-600">No payments have been made yet.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-indigo-100 text-indigo-900">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Payment Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Fee Description</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Amount Paid (USD)</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(({ id, feeId, paymentDate, amountPaid, receiptUrl }) => {
                                    const fee = feeItems.find((f) => f.id === feeId);
                                    return (
                                        <tr key={id} className="even:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {new Date(paymentDate).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{fee?.description ?? "Unknown Fee"}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">${amountPaid.toFixed(2)}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {receiptUrl ? (
                                                    <Link
                                                        href={`/dashboard/student/fees/view/${id}`}  // <-- Use payment record's id here
                                                        className="text-indigo-600 hover:underline"
                                                    >
                                                        View Receipt
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-400 italic">No Receipt</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </section>

                {/* Make Payment Button */}
                {/* <div className="mt-8 text-center">
                    <button
                        onClick={() => alert("Redirect to payment gateway (simulate).")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded shadow"
                    >
                        Make a Payment
                    </button>
                </div> */}
            </section>
        </DashboardLayout>
    );
}
