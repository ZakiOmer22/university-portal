"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import Link from "next/link";

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
    method: string; // e.g. Credit Card, Bank Transfer, Mobile Payment
    transactionId: string;
    status: "confirmed" | "pending" | "failed";
}

// Dummy data as before
const dummyFeeItems: FeeItem[] = [
    {
        id: "fee1",
        description: "Tuition Fee Semester 1",
        amount: 500,
        dueDate: "2025-09-01",
        semester: 1,
        status: "paid",
    },
    {
        id: "fee2",
        description: "Lab Fee Semester 1",
        amount: 100,
        dueDate: "2025-09-01",
        semester: 1,
        status: "partial",
    },
];

const dummyPayments: PaymentRecord[] = [
    {
        id: "pay1",
        feeId: "fee1",
        paymentDate: "2025-08-15T10:30:00Z",
        amountPaid: 500,
        receiptUrl: "/receipts/receipt1.pdf",
        method: "Credit Card",
        transactionId: "TXN123456789",
        status: "confirmed",
    },
    {
        id: "pay2",
        feeId: "fee2",
        paymentDate: "2025-08-20T15:45:00Z",
        amountPaid: 50,
        method: "Bank Transfer",
        transactionId: "TXN987654321",
        status: "pending",
    },
];

// Reuse the status badge function for Fee status display
function statusBadge(status: FeeItem["status"]) {
    switch (status) {
        case "paid":
            return <span className="inline-block px-3 py-1 rounded bg-green-100 text-green-800 font-semibold">Paid</span>;
        case "partial":
            return <span className="inline-block px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold">Partial</span>;
        case "unpaid":
            return <span className="inline-block px-3 py-1 rounded bg-red-100 text-red-800 font-semibold">Unpaid</span>;
        default:
            return null;
    }
}

export default function PaymentViewPage() {
    const params = useParams();
    const router = useRouter();
    const payId = params["pay-id"];

    const [payment, setPayment] = useState<PaymentRecord | null>(null);
    const [fee, setFee] = useState<FeeItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!payId) {
            router.push("/dashboard/student/fees");
            return;
        }

        // Simulate fetching payment & fee data by id
        setTimeout(() => {
            const foundPayment = dummyPayments.find((p) => p.id === payId) || null;
            setPayment(foundPayment);

            if (foundPayment) {
                const relatedFee = dummyFeeItems.find((f) => f.id === foundPayment.feeId) || null;
                setFee(relatedFee);
            }
            setLoading(false);
        }, 700);
    }, [payId, router]);

    function printReceipt() {
        window.print();
    }

    if (loading) {
        return (
            <DashboardLayout loading={true} user={null}>
                <p className="text-center mt-20 text-gray-600 text-lg">Loading payment details...</p>
            </DashboardLayout>
        );
    }

    if (!payment) {
        return (
            <DashboardLayout loading={false} user={null}>
                <section className="max-w-xl mx-auto my-20 p-8 bg-white rounded shadow text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">Payment Not Found</h2>
                    <p className="mb-6">The payment record you requested does not exist or is unavailable.</p>
                    <Link
                        href="/dashboard/student/fees"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
                    >
                        Back to Fees & Payments
                    </Link>
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={null}>
            <section className="max-w-4xl mx-auto bg-white rounded shadow p-10 my-12 font-serif print:font-sans print:p-6 print:my-4">
                {/* Header with university logo and info */}
                <header className="flex items-center gap-4 mb-8 print:mb-4">
                    <img
                        src="/favicon.ico"
                        alt="University Logo"
                        className="w-16 h-16 object-contain print:w-12 print:h-12"
                        loading="lazy"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-900 print:text-xl">
                            University of Hargeisa
                        </h1>
                        <p className="italic text-gray-700 print:text-xs">Official Payment Receipt</p>
                    </div>
                </header>

                {/* Fee Details Section */}
                {fee && (
                    <section className="mb-8 print:mb-4 border border-gray-300 rounded p-6 bg-gray-50">
                        <h2 className="text-2xl font-semibold mb-4 print:text-lg">Fee Details</h2>
                        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 print:text-xs">
                            <dt className="font-semibold">Description:</dt>
                            <dd>{fee.description}</dd>

                            <dt className="font-semibold">Amount:</dt>
                            <dd>${fee.amount.toFixed(2)}</dd>

                            <dt className="font-semibold">Due Date:</dt>
                            <dd>{new Date(fee.dueDate).toLocaleDateString()}</dd>

                            <dt className="font-semibold">Semester:</dt>
                            <dd>{fee.semester}</dd>

                            <dt className="font-semibold">Status:</dt>
                            <dd>{statusBadge(fee.status)}</dd>
                        </dl>
                    </section>
                )}

                {/* Payment Details Section */}
                <section className="mb-8 print:mb-4">
                    <h2 className="text-2xl font-semibold mb-4 print:text-lg">Payment Details</h2>
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-4 print:text-xs">
                        <dt className="font-semibold">Payment ID:</dt>
                        <dd>{payment.id}</dd>

                        <dt className="font-semibold">Payment Date:</dt>
                        <dd>{new Date(payment.paymentDate).toLocaleString()}</dd>

                        <dt className="font-semibold">Amount Paid:</dt>
                        <dd>${payment.amountPaid.toFixed(2)}</dd>

                        <dt className="font-semibold">Payment Method:</dt>
                        <dd>{payment.method}</dd>

                        <dt className="font-semibold">Transaction ID:</dt>
                        <dd>{payment.transactionId}</dd>

                        <dt className="font-semibold">Payment Status:</dt>
                        <dd>
                            <span
                                className={`inline-block px-3 py-1 rounded font-semibold ${payment.status === "confirmed"
                                        ? "bg-green-100 text-green-800"
                                        : payment.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                        </dd>
                    </dl>
                </section>

                {/* Receipt Section */}
                {payment.receiptUrl ? (
                    <section className="mb-8 print:mb-4">
                        <h3 className="text-xl font-semibold mb-2 print:text-sm">Receipt</h3>
                        <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-indigo-700 hover:underline"
                        >
                            View / Download Receipt (PDF)
                        </a>
                    </section>
                ) : (
                    <p className="italic text-gray-500 mb-8 print:mb-4">
                        No receipt available for this payment.
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-4 justify-center print:hidden">
                    <button
                        onClick={printReceipt}
                        className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700"
                        aria-label="Print Payment Receipt"
                    >
                        Print Receipt
                    </button>

                    <Link
                        href="/dashboard/student/fees"
                        className="bg-gray-300 text-gray-900 px-6 py-2 rounded shadow hover:bg-gray-400"
                        aria-label="Back to Fees & Payments"
                    >
                        Back to Fees & Payments
                    </Link>
                </div>

                {/* Footer for printing */}
                <footer className="mt-12 pt-6 border-t border-gray-400 text-center text-xs text-gray-500 print:block hidden">
                    Powered by University Portal Ealif Team
                </footer>
            </section>
        </DashboardLayout>
    );
}
