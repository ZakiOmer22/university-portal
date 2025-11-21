"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Clock, XCircle, Download, Filter, CreditCard, Calendar } from "lucide-react";

interface Fee {
    id: string;
    description?: string;
    dueDate: string;
    amount: number;
    status: "Paid" | "Pending" | "Overdue";
    paymentMethod?: string;
    lateFee?: number;
}

interface RawFee {
    id: string;
    studentId: string;
    amount: number;
    status: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    description?: string;
    paymentMethod?: string;
    lateFee?: number;
}

interface Child {
    id: string;
    name: string;
    grade: string;
}

const dummyChildren: Child[] = [
    { id: "student-uuid-1", name: "Ayaan Omer", grade: "Grade 5" },
    { id: "student-uuid-2", name: "Layla Omer", grade: "Grade 3" },
];

export default function FeesPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [selectedChildId, setSelectedChildId] = useState<string>(dummyChildren[0].id);
    const [fees, setFees] = useState<Fee[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        if (!selectedChildId) return;

        setLoading(true);
        setError(null);

        import("../../../../data/dummyData.json")
            .then((module) => {
                const data = module.default as { fees: RawFee[] };

                const feesForChildRaw = data.fees.filter(fee => fee.studentId === selectedChildId);

                function mapStatus(status: string): "Paid" | "Pending" | "Overdue" {
                    if (status === "Paid" || status === "Pending" || status === "Overdue") return status;
                    return "Pending";
                }

                const feesForChild: Fee[] = feesForChildRaw.map(fee => ({
                    id: fee.id,
                    description: fee.description || "",
                    dueDate: fee.dueDate,
                    amount: fee.amount,
                    status: mapStatus(fee.status),
                    paymentMethod: fee.paymentMethod,
                    lateFee: fee.lateFee,
                }));

                setFees(feesForChild);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load fees data. Please try again later.");
                setFees([]);
                setLoading(false);
            });
    }, [selectedChildId]);

    const filteredFees = fees.filter(fee => 
        filterStatus === "all" || fee.status.toLowerCase() === filterStatus
    );

    const totalAmount = fees.reduce((acc, fee) => acc + fee.amount + (fee.lateFee || 0), 0);
    const totalPaid = fees.filter((f) => f.status === "Paid").reduce((acc, fee) => acc + fee.amount, 0);
    const totalPending = fees.filter((f) => f.status === "Pending").reduce((acc, fee) => acc + fee.amount, 0);
    const totalOverdue = fees.filter((f) => f.status === "Overdue").reduce((acc, fee) => acc + fee.amount + (fee.lateFee || 0), 0);

    const selectedChild = dummyChildren.find(child => child.id === selectedChildId);

    function statusBadge(status: Fee["status"]) {
        const baseClasses = "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium";
        
        switch (status) {
            case "Paid":
                return <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}><CheckCircle2 size={14} />Paid</span>;
            case "Pending":
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}><Clock size={14} />Pending</span>;
            case "Overdue":
                return <span className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}><XCircle size={14} />Overdue</span>;
        }
    }

    function getDaysUntilDue(dueDate: string): number {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Fees & Payments
                        </h1>
                        <p className="text-gray-600 mt-2">Manage and track your children&apos;s school fees and payments</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-64">
                            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                <SelectTrigger className="bg-white border-gray-300">
                                    <SelectValue placeholder="Select Child" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dummyChildren.map((child) => (
                                        <SelectItem key={child.id} value={child.id}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{child.name}</span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {child.grade}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Error Loading Data</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))
                    ) : (
                        <>
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Balance</p>
                                        <p className="text-2xl font-bold mt-1">${totalAmount.toFixed(2)}</p>
                                    </div>
                                    <CreditCard className="w-8 h-8 text-blue-200" />
                                </div>
                                <div className="mt-4 text-blue-100 text-sm">
                                    {fees.length} fee{fees.length !== 1 ? 's' : ''} total
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Paid</p>
                                        <p className="text-2xl font-bold mt-1">${totalPaid.toFixed(2)}</p>
                                    </div>
                                    <CheckCircle2 className="w-8 h-8 text-green-200" />
                                </div>
                                <div className="mt-4 text-green-100 text-sm">
                                    {fees.filter(f => f.status === "Paid").length} payment{fees.filter(f => f.status === "Paid").length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm font-medium">Pending</p>
                                        <p className="text-2xl font-bold mt-1">${totalPending.toFixed(2)}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-200" />
                                </div>
                                <div className="mt-4 text-yellow-100 text-sm">
                                    {fees.filter(f => f.status === "Pending").length} pending
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-100 text-sm font-medium">Overdue</p>
                                        <p className="text-2xl font-bold mt-1">${totalOverdue.toFixed(2)}</p>
                                    </div>
                                    <XCircle className="w-8 h-8 text-red-200" />
                                </div>
                                <div className="mt-4 text-red-100 text-sm">
                                    {fees.filter(f => f.status === "Overdue").length} overdue
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Fees Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Fee Details {selectedChild && `- ${selectedChild.name}`}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {filteredFees.length} fee{filteredFees.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                            
                            <div className="flex gap-3">
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-40 bg-white border-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Filter size={14} />
                                            <SelectValue placeholder="Filter by status" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                                ))}
                            </div>
                        ) : filteredFees.length === 0 ? (
                            <div className="p-12 text-center">
                                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No fees found</h4>
                                <p className="text-gray-500">
                                    {filterStatus === "all" 
                                        ? "No fees available for this student."
                                        : `No ${filterStatus} fees found.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Late Fee</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredFees.map((fee) => {
                                        const daysUntilDue = getDaysUntilDue(fee.dueDate);
                                        const isDueSoon = daysUntilDue <= 7 && daysUntilDue > 0 && fee.status === "Pending";
                                        
                                        return (
                                            <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{fee.description || "School Fee"}</span>
                                                        {isDueSoon && (
                                                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1 inline-flex items-center gap-1 w-fit">
                                                                <Clock size={12} />
                                                                Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        <span className="text-gray-700">
                                                            {new Date(fee.dueDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-900">
                                                        ${fee.amount.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{statusBadge(fee.status)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        fee.paymentMethod 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {fee.paymentMethod || "Not set"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-medium ${
                                                        fee.lateFee ? 'text-red-600' : 'text-gray-500'
                                                    }`}>
                                                        {fee.lateFee ? `$${fee.lateFee.toFixed(2)}` : "-"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {fee.status !== "Paid" && (
                                                            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                                                                Pay Now
                                                            </button>
                                                        )}
                                                        <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                                            Details
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}