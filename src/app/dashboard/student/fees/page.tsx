"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { CreditCard, Calendar, DollarSign, FileText, Filter, Download, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface FeeItem {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
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
    { id: "fee2", description: "Laboratory Fee", amount: 100, dueDate: "2025-09-01", semester: 1, status: "partial" },
    { id: "fee3", description: "Library Fee", amount: 50, dueDate: "2025-09-01", semester: 1, status: "unpaid" },
    { id: "fee4", description: "Student Activity Fee", amount: 75, dueDate: "2025-09-01", semester: 1, status: "unpaid" },
    { id: "fee5", description: "Tuition Fee", amount: 550, dueDate: "2026-02-01", semester: 2, status: "unpaid" },
    { id: "fee6", description: "Technology Fee", amount: 80, dueDate: "2026-02-01", semester: 2, status: "unpaid" },
];

const dummyPayments: PaymentRecord[] = [
    { id: "pay1", feeId: "fee1", paymentDate: "2025-08-15", amountPaid: 500, receiptUrl: "/dashboard/student/fees/view/" },
    { id: "pay2", feeId: "fee2", paymentDate: "2025-08-20", amountPaid: 50 },
    { id: "pay3", feeId: "fee4", paymentDate: "2025-08-25", amountPaid: 75, receiptUrl: "/dashboard/student/fees/view/" },
];

function StatusBadge({ status }: { status: FeeItem["status"] }) {
    const config = {
        paid: { 
            bg: "bg-green-50", 
            text: "text-green-700", 
            border: "border-green-200",
            icon: CheckCircle2 
        },
        partial: { 
            bg: "bg-yellow-50", 
            text: "text-yellow-700", 
            border: "border-yellow-200",
            icon: Clock 
        },
        unpaid: { 
            bg: "bg-red-50", 
            text: "text-red-700", 
            border: "border-red-200",
            icon: AlertCircle 
        }
    };

    const { bg, text, border, icon: Icon } = config[status];
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Badge className={`${bg} ${text} ${border} flex items-center gap-1.5 font-medium`}>
            <Icon size={14} />
            {statusText}
        </Badge>
    );
}

function PaymentStatusCard({ title, amount, type }: { title: string; amount: number; type: "total" | "paid" | "balance" }) {
    const config = {
        total: { bg: "from-indigo-500 to-purple-600", text: "text-indigo-200", icon: DollarSign },
        paid: { bg: "from-green-500 to-emerald-600", text: "text-green-200", icon: CheckCircle2 },
        balance: { bg: "from-orange-500 to-red-600", text: "text-orange-200", icon: AlertCircle }
    };

    const { bg, text, icon: Icon } = config[type];

    return (
        <div className={`bg-gradient-to-br ${bg} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${text}`} />
                <div className={`${text} text-sm font-medium`}>{title}</div>
            </div>
            <div className="text-3xl font-bold mb-1">${amount.toFixed(2)}</div>
            <div className={`${text} text-sm`}>{type === 'balance' ? 'Remaining Balance' : type === 'paid' ? 'Amount Paid' : 'Total Due'}</div>
        </div>
    );
}

export default function FeesAndPaymentsPage() {
    const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setTimeout(() => {
            setFeeItems(dummyFeeItems);
            setPayments(dummyPayments);
            setLoading(false);
        }, 1000);
    }, []);

    const semesters = Array.from(new Set(feeItems.map((f) => f.semester))).sort();
    const displayedFees = selectedSemester === "all" ? feeItems : feeItems.filter((f) => f.semester === selectedSemester);

    // Calculate totals
    const totalAmountDue = displayedFees.reduce((sum, f) => sum + f.amount, 0);
    const totalAmountPaid = displayedFees.reduce((sum, f) => {
        const paidAmount = payments
            .filter((p) => p.feeId === f.id)
            .reduce((a, p) => a + p.amountPaid, 0);
        return sum + paidAmount;
    }, 0);
    const balance = totalAmountDue - totalAmountPaid;

    // Statistics
    const paidFees = displayedFees.filter(f => f.status === "paid").length;
    const unpaidFees = displayedFees.filter(f => f.status === "unpaid").length;
    const partialFees = displayedFees.filter(f => f.status === "partial").length;

    return (
        <DashboardLayout loading={loading} user={user}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Fees & Payments</h1>
                        <p className="text-gray-600 mt-2">Manage your university fees and payment history</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200">
                            <Download size={20} />
                            Export
                        </button>
                        <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                            <CreditCard size={20} />
                            Make Payment
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PaymentStatusCard title="Total Due" amount={totalAmountDue} type="total" />
                        <PaymentStatusCard title="Amount Paid" amount={totalAmountPaid} type="paid" />
                        <PaymentStatusCard title="Balance" amount={balance} type="balance" />
                    </div>
                )}

                {/* Filters and Stats */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <label className="font-medium text-gray-700">Filter by Semester:</label>
                                </div>
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value === "all" ? "all" : Number(e.target.value))}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">All Semesters</option>
                                    {semesters.map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full"></div>
                                    <span className="text-sm text-gray-600">{paidFees} Paid</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full"></div>
                                    <span className="text-sm text-gray-600">{partialFees} Partial</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full"></div>
                                    <span className="text-sm text-gray-600">{unpaidFees} Unpaid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fees Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-indigo-600" />
                            Fee Structure
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-4">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>
                    ) : displayedFees.length === 0 ? (
                        <div className="text-center py-12">
                            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fees Found</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                {selectedSemester !== "all" 
                                    ? `No fees found for semester ${selectedSemester}.`
                                    : "No fees available at the moment."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amount</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Due Date</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Semester</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {displayedFees.map((fee) => {
                                        const paidAmount = payments
                                            .filter(p => p.feeId === fee.id)
                                            .reduce((sum, p) => sum + p.amountPaid, 0);
                                        
                                        return (
                                            <tr key={fee.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{fee.description}</div>
                                                    {fee.status === "partial" && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            Paid: ${paidAmount.toFixed(2)} of ${fee.amount.toFixed(2)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="font-semibold text-gray-900">${fee.amount.toFixed(2)}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2 text-gray-600">
                                                        <Calendar size={14} />
                                                        {new Date(fee.dueDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                        Sem {fee.semester}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <StatusBadge status={fee.status} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Payment History
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment History</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                You haven&apos;t made any payments yet. Your payment history will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fee Description</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amount Paid</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payments.map((payment) => {
                                        const fee = feeItems.find((f) => f.id === payment.feeId);
                                        return (
                                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar size={14} />
                                                        {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{fee?.description ?? "Unknown Fee"}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="font-semibold text-green-600">${payment.amountPaid.toFixed(2)}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {payment.receiptUrl ? (
                                                        <Link
                                                            href={payment.receiptUrl + payment.id}
                                                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                                                        >
                                                            <FileText size={16} />
                                                            View Receipt
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No Receipt</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Important Payment Information</h3>
                            <p className="text-blue-700 text-sm">
                                All fees must be paid by the due date to avoid late penalties. Partial payments are accepted 
                                but must be completed before the semester ends. Contact the finance office for payment plans 
                                or if you have any questions about your fees.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}