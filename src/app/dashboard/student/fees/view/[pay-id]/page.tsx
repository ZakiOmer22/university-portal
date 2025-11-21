"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Printer, Download, FileText, Calendar, DollarSign, CreditCard, CheckCircle2, Clock, XCircle, Building2, User, Shield } from "lucide-react";

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
    method: string;
    transactionId: string;
    status: "confirmed" | "pending" | "failed";
}

const dummyFeeItems: FeeItem[] = [
    {
        id: "fee1",
        description: "Tuition Fee - Semester 1",
        amount: 500,
        dueDate: "2025-09-01",
        semester: 1,
        status: "paid",
    },
    {
        id: "fee2",
        description: "Laboratory Fee - Semester 1",
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

function PaymentStatusBadge({ status }: { status: PaymentRecord["status"] }) {
    const config = {
        confirmed: { 
            bg: "bg-green-50", 
            text: "text-green-700", 
            border: "border-green-200",
            icon: CheckCircle2 
        },
        pending: { 
            bg: "bg-yellow-50", 
            text: "text-yellow-700", 
            border: "border-yellow-200",
            icon: Clock 
        },
        failed: { 
            bg: "bg-red-50", 
            text: "text-red-700", 
            border: "border-red-200",
            icon: XCircle 
        }
    };

    const { bg, text, border, icon: Icon } = config[status];
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Badge className={`${bg} ${text} ${border} flex items-center gap-2 font-medium px-3 py-1.5`}>
            <Icon size={16} />
            {statusText}
        </Badge>
    );
}

function FeeStatusBadge({ status }: { status: FeeItem["status"] }) {
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
            icon: XCircle 
        }
    };

    const { bg, text, border, icon: Icon } = config[status];
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Badge className={`${bg} ${text} ${border} flex items-center gap-2 font-medium px-3 py-1.5`}>
            <Icon size={16} />
            {statusText}
        </Badge>
    );
}

export default function PaymentViewPage() {
    const params = useParams();
    const router = useRouter();
    const payId = params["pay-id"];

    const [payment, setPayment] = useState<PaymentRecord | null>(null);
    const [fee, setFee] = useState<FeeItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        if (!payId) {
            router.push("/dashboard/student/fees");
            return;
        }

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
            <DashboardLayout loading={true} user={user}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading payment details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!payment) {
        return (
            <DashboardLayout loading={false} user={user}>
                <section className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center border border-gray-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Payment Not Found</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            The payment record you&apos;re looking for doesn&apos;t exist or may have been removed.
                        </p>
                        <Link
                            href="/dashboard/student/fees"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 font-medium"
                        >
                            <ArrowLeft size={18} />
                            Back to Fees & Payments
                        </Link>
                    </div>
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={user}>
            <div className="max-w-4xl mx-auto space-y-6 print:max-w-none print:mx-0">
                {/* Header Actions */}
                <div className="flex items-center justify-between print:hidden">
                    <Link
                        href="/dashboard/student/fees"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Fees & Payments
                    </Link>
                    <div className="flex gap-3">
                        <button
                            onClick={printReceipt}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Printer size={20} />
                            Print Receipt
                        </button>
                        {payment.receiptUrl && (
                            <a
                                href={payment.receiptUrl}
                                download
                                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
                            >
                                <Download size={20} />
                                Download PDF
                            </a>
                        )}
                    </div>
                </div>

                {/* Receipt Document */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:rounded-none print:border-0">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white print:bg-indigo-600 print:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 relative bg-white rounded-xl p-2 print:w-16 print:h-16">
                                    <div className="w-full h-full bg-indigo-100 rounded-lg flex items-center justify-center print:bg-white">
                                        <Building2 className="w-10 h-10 text-indigo-600 print:text-indigo-600" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold print:text-2xl">University of Hargeisa</h1>
                                    <p className="text-indigo-200 text-lg print:text-sm">Official Payment Receipt</p>
                                </div>
                            </div>
                            <div className="text-right print:text-sm">
                                <p className="text-indigo-200">Receipt No: RCP-{payment.id.toUpperCase()}</p>
                                <p className="font-semibold">{payment.transactionId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student & Payment Info */}
                    <div className="p-8 print:p-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Student Name</div>
                                        <div className="font-semibold text-gray-900 text-lg">{user?.fullName || "Zaki Omer"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Student ID</div>
                                        <div className="font-semibold text-gray-900">2025-123456</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Payment Status</div>
                                        <PaymentStatusBadge status={payment.status} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Payment Date</div>
                                        <div className="font-semibold text-gray-900">
                                            {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Payment Method</div>
                                        <div className="font-semibold text-gray-900">{payment.method}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Amount Paid</div>
                                        <div className="font-semibold text-gray-900 text-xl text-green-600">
                                            ${payment.amountPaid.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fee Details */}
                    {fee && (
                        <div className="p-8 print:p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 print:text-xl flex items-center gap-3">
                                <FileText className="w-6 h-6 text-indigo-600" />
                                Fee Information
                            </h2>
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Fee Description</div>
                                            <div className="font-semibold text-gray-900 text-lg">{fee.description}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Original Amount</div>
                                            <div className="font-semibold text-gray-900">${fee.amount.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Due Date</div>
                                            <div className="font-semibold text-gray-900">
                                                {new Date(fee.dueDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Fee Status</div>
                                            <FeeStatusBadge status={fee.status} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div className="p-8 print:p-6 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 print:text-lg">Payment Summary</h3>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">${payment.amountPaid.toFixed(2)}</div>
                                    <div className="text-sm text-gray-600">Amount Paid</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {fee ? `$${(fee.amount - payment.amountPaid).toFixed(2)}` : '$0.00'}
                                    </div>
                                    <div className="text-sm text-gray-600">Remaining Balance</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{payment.method}</div>
                                    <div className="text-sm text-gray-600">Payment Method</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-8 print:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                <p>This is an official payment receipt from University of Hargeisa.</p>
                                <p>Please retain this receipt for your records and any future references.</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                                <p>Finance Department</p>
                                <p>University of Hargeisa</p>
                                <p>Hargeisa, Somaliland</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 print:hidden">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Receipt Information</h3>
                            <p className="text-blue-700 text-sm">
                                This receipt serves as official confirmation of your payment. For any discrepancies or 
                                questions regarding this payment, please contact the finance office with your transaction 
                                ID and receipt number.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0.5in;
                    }
                    
                    body {
                        background: white !important;
                        font-size: 12pt;
                        line-height: 1.4;
                    }
                    
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    .print\\:max-w-none {
                        max-width: none !important;
                    }
                    
                    .print\\:mx-0 {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                    }
                    
                    .print\\:p-6 {
                        padding: 1.5rem !important;
                    }
                    
                    .print\\:text-2xl {
                        font-size: 1.5rem !important;
                    }
                    
                    .print\\:text-xl {
                        font-size: 1.25rem !important;
                    }
                    
                    .print\\:text-lg {
                        font-size: 1.125rem !important;
                    }
                    
                    .print\\:text-sm {
                        font-size: 0.875rem !important;
                    }
                    
                    .print\\:bg-indigo-600 {
                        background-color: #4f46e5 !important;
                    }
                    
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                    
                    .print\\:border-0 {
                        border: 0 !important;
                    }
                    
                    /* Hide all other elements */
                    body > *:not(#__next) {
                        display: none !important;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
}