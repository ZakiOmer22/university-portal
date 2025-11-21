import React, { useState } from "react";
import { CreditCard, Calendar, Filter, Download, TrendingUp, TrendingDown } from "lucide-react";

interface Payment {
    id: string;
    date: Date;
    amount: number;
    method: string;
    status: "Completed" | "Pending" | "Failed";
    description?: string;
    childName?: string;
}

interface PaymentHistoryProps {
    payments: Payment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
    const [sortedPayments, setSortedPayments] = useState(payments);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const getStatusConfig = (status: Payment["status"]) => {
        switch (status) {
            case "Completed":
                return {
                    class: "bg-green-50 text-green-700 border-green-200",
                    icon: <TrendingUp size={14} />
                };
            case "Pending":
                return {
                    class: "bg-yellow-50 text-yellow-700 border-yellow-200",
                    icon: <Calendar size={14} />
                };
            case "Failed":
                return {
                    class: "bg-red-50 text-red-700 border-red-200",
                    icon: <TrendingDown size={14} />
                };
        }
    };

    const toggleSortByDate = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        const sorted = [...sortedPayments].sort((a, b) =>
            newOrder === "asc"
                ? a.date.getTime() - b.date.getTime()
                : b.date.getTime() - a.date.getTime()
        );
        setSortedPayments(sorted);
        setSortOrder(newOrder);
    };

    const filteredPayments = sortedPayments.filter(payment =>
        filterStatus === "all" || payment.status.toLowerCase() === filterStatus
    );

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = payments.filter(p => p.status === "Completed").length;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
                        <p className="text-gray-600 text-sm">Track all fee payments and transactions</p>
                    </div>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download size={16} />
                    Export
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Paid</p>
                            <p className="text-2xl font-bold text-blue-900">${totalAmount.toFixed(2)}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Successful</p>
                            <p className="text-2xl font-bold text-green-900">{completedPayments}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Filters and Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                        <span className="text-sm text-gray-500">
                            {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <button
                        onClick={toggleSortByDate}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                    >
                        <Calendar size={14} />
                        Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Child</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => {
                                    const statusConfig = getStatusConfig(payment.status);
                                    const isRecent = new Date().getTime() - payment.date.getTime() < 7 * 24 * 60 * 60 * 1000;
                                    
                                    return (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <span className={`font-medium ${isRecent ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {payment.date.toLocaleDateString()}
                                                    </span>
                                                    {isRecent && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-gray-900">
                                                    {payment.description || "School Fees"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-gray-700">
                                                    {payment.childName || "General"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-gray-900">
                                                    ${payment.amount.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-gray-700">{payment.method}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.class}`}>
                                                    {statusConfig.icon}
                                                    {payment.status}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}