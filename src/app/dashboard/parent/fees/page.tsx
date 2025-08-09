"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

interface Fee {
    id: string;
    description?: string; // optional
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
    status: string; // string here because from JSON it's untyped
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
}

const dummyChildren: Child[] = [
    { id: "student-uuid-1", name: "Ayaan Omer" },
    { id: "student-uuid-2", name: "Layla Omer" },
];

export default function FeesPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [selectedChildId, setSelectedChildId] = useState<string>(dummyChildren[0].id);
    const [fees, setFees] = useState<Fee[]>([]);
    const [error, setError] = useState<string | null>(null);

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

                // Map raw fees to strict Fee type with status validation
                function mapStatus(status: string): "Paid" | "Pending" | "Overdue" {
                    if (status === "Paid" || status === "Pending" || status === "Overdue") return status;
                    return "Pending"; // fallback default
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

    const totalAmount = fees.reduce((acc, fee) => acc + fee.amount + (fee.lateFee || 0), 0);
    const totalPaid = fees.filter((f) => f.status === "Paid").reduce((acc, fee) => acc + fee.amount, 0);
    const totalOverdue = fees.filter((f) => f.status === "Overdue").reduce((acc, fee) => acc + fee.amount + (fee.lateFee || 0), 0);

    function statusBadge(status: Fee["status"]) {
        switch (status) {
            case "Paid":
                return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle2 size={14} />Paid</Badge>;
            case "Pending":
                return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock size={14} />Pending</Badge>;
            case "Overdue":
                return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle size={14} />Overdue</Badge>;
        }
    }

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Header & Child Selector */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900">Fees & Payments</h2>
                        <p className="text-gray-600">Track your child's school fees and payment history.</p>
                    </div>
                    <div className="w-full md:w-64">
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Child" />
                            </SelectTrigger>
                            <SelectContent>
                                {dummyChildren.map((child) => (
                                    <SelectItem key={child.id} value={child.id}>
                                        {child.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Summary Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    fees.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                <h3 className="text-sm font-semibold text-indigo-900">Total Amount Due</h3>
                                <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h3 className="text-sm font-semibold text-green-900">Total Paid</h3>
                                <p className="text-xl font-bold">${totalPaid.toFixed(2)}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h3 className="text-sm font-semibold text-red-900">Total Overdue</h3>
                                <p className="text-xl font-bold">${totalOverdue.toFixed(2)}</p>
                            </div>
                        </div>
                    )
                )}

                {/* Fees Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <Skeleton className="h-40 w-full rounded-lg" />
                    ) : (
                        <table className="min-w-full border border-indigo-200 rounded-lg overflow-hidden">
                            <thead className="bg-indigo-100">
                                <tr>
                                    {["Description", "Due Date", "Amount ($)", "Status", "Payment Method", "Late Fee ($)"].map((head) => (
                                        <th key={head} className="px-4 py-2 text-left text-sm font-semibold text-indigo-900 border-b">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {fees.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                                            No fees data available for this child.
                                        </td>
                                    </tr>
                                ) : (
                                    fees.map(({ id, description, dueDate, amount, status, paymentMethod, lateFee }) => (
                                        <tr key={id} className="hover:bg-indigo-50">
                                            <td className="px-4 py-2 border-b">{description}</td>
                                            <td className="px-4 py-2 border-b">{new Date(dueDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 border-b">${amount.toFixed(2)}</td>
                                            <td className="px-4 py-2 border-b">{statusBadge(status)}</td>
                                            <td className="px-4 py-2 border-b">{paymentMethod || "-"}</td>
                                            <td className="px-4 py-2 border-b">{lateFee ? `$${lateFee.toFixed(2)}` : "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </DashboardLayout>
    );
}
