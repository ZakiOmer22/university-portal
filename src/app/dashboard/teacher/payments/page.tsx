"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { useRouter } from "next/navigation";
import { 
    DollarSign, 
    FileText, 
    ChevronDown, 
    ChevronUp,
    Download,
    Filter,
    Search,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    MoreVertical,
    TrendingUp,
    Banknote,
    Calculator,
    Receipt,
    Shield
} from "lucide-react";

type PayrollEntry = {
    id: string;
    period: string;
    payDate: string;
    grossSalary: number;
    deductions: number;
    netSalary: number;
    datePaid: string;
    status: "paid" | "pending" | "processing" | "failed";
    paymentMethod: "direct-deposit" | "check";
    accountLastFour?: string;
    breakdown: {
        baseSalary: number;
        overtime?: number;
        bonuses?: number;
        taxes: number;
        insurance: number;
        retirement: number;
        other?: number;
    };
};

const dummyPayrollData: PayrollEntry[] = [
    {
        id: "PY-2024-003",
        period: "March 2024",
        payDate: "2024-03-31",
        grossSalary: 4850.00,
        deductions: 892.50,
        netSalary: 3957.50,
        datePaid: "2024-03-29",
        status: "paid",
        paymentMethod: "direct-deposit",
        accountLastFour: "7890",
        breakdown: {
            baseSalary: 4500.00,
            overtime: 350.00,
            taxes: 645.25,
            insurance: 187.25,
            retirement: 60.00
        }
    },
    {
        id: "PY-2024-002",
        period: "February 2024",
        payDate: "2024-02-29",
        grossSalary: 4500.00,
        deductions: 825.75,
        netSalary: 3674.25,
        datePaid: "2024-02-28",
        status: "paid",
        paymentMethod: "direct-deposit",
        accountLastFour: "7890",
        breakdown: {
            baseSalary: 4500.00,
            taxes: 598.50,
            insurance: 187.25,
            retirement: 40.00
        }
    },
    {
        id: "PY-2024-001",
        period: "January 2024",
        payDate: "2024-01-31",
        grossSalary: 4500.00,
        deductions: 825.75,
        netSalary: 3674.25,
        datePaid: "2024-01-30",
        status: "paid",
        paymentMethod: "direct-deposit",
        accountLastFour: "7890",
        breakdown: {
            baseSalary: 4500.00,
            taxes: 598.50,
            insurance: 187.25,
            retirement: 40.00
        }
    },
    {
        id: "PY-2024-004",
        period: "April 2024",
        payDate: "2024-04-30",
        grossSalary: 4500.00,
        deductions: 825.75,
        netSalary: 3674.25,
        datePaid: "",
        status: "processing",
        paymentMethod: "direct-deposit",
        accountLastFour: "7890",
        breakdown: {
            baseSalary: 4500.00,
            taxes: 598.50,
            insurance: 187.25,
            retirement: 40.00
        }
    },
    {
        id: "PY-2023-012",
        period: "December 2023",
        payDate: "2023-12-31",
        grossSalary: 4875.00,
        deductions: 895.80,
        netSalary: 3979.20,
        datePaid: "2023-12-29",
        status: "paid",
        paymentMethod: "direct-deposit",
        accountLastFour: "7890",
        breakdown: {
            baseSalary: 4500.00,
            bonuses: 375.00,
            taxes: 648.45,
            insurance: 187.25,
            retirement: 60.10
        }
    }
];

const PAGE_SIZE = 8;

type SortKey = "period" | "grossSalary" | "netSalary" | "datePaid" | "payDate" | null;
type SortDirection = "asc" | "desc";

export default function PayrollVerificationPage() {
    const router = useRouter();
    const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(null);

    // Filters
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterYear, setFilterYear] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Sorting
    const [sortKey, setSortKey] = useState<SortKey>("period");
    const [sortDir, setSortDir] = useState<SortDirection>("desc");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPayrolls(dummyPayrollData);
            setLoading(false);
        }, 1200);
    }, []);

    const filteredPayrolls = useMemo(() => {
        let filtered = payrolls;

        if (filterStatus !== "all") {
            filtered = filtered.filter((p) => p.status === filterStatus);
        }

        if (filterYear !== "all") {
            filtered = filtered.filter((p) => p.period.includes(filterYear));
        }

        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((p) => 
                p.period.toLowerCase().includes(term) ||
                p.id.toLowerCase().includes(term)
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "period") {
                    comp = a.period.localeCompare(b.period);
                } else if (sortKey === "grossSalary") {
                    comp = a.grossSalary - b.grossSalary;
                } else if (sortKey === "netSalary") {
                    comp = a.netSalary - b.netSalary;
                } else if (sortKey === "datePaid" || sortKey === "payDate") {
                    const dateA = a[sortKey] ? new Date(a[sortKey]).getTime() : 0;
                    const dateB = b[sortKey] ? new Date(b[sortKey]).getTime() : 0;
                    comp = dateA - dateB;
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [payrolls, filterStatus, filterYear, searchTerm, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredPayrolls.length / PAGE_SIZE);
    const paginatedPayrolls = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredPayrolls.slice(start, start + PAGE_SIZE);
    }, [filteredPayrolls, currentPage]);

    // Summaries
    const totalPaid = filteredPayrolls
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + p.netSalary, 0);

    const totalPending = filteredPayrolls
        .filter((p) => p.status === "pending" || p.status === "processing")
        .reduce((sum, p) => sum + p.grossSalary, 0);

    const totalYTD = payrolls
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + p.netSalary, 0);

    const averageSalary = payrolls.length > 0 
        ? payrolls.reduce((sum, p) => sum + p.netSalary, 0) / payrolls.length 
        : 0;

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    }

    function getStatusIcon(status: PayrollEntry["status"]) {
        switch (status) {
            case "paid": return <CheckCircle2 className="w-4 h-4" />;
            case "processing": return <Clock className="w-4 h-4" />;
            case "pending": return <Clock className="w-4 h-4" />;
            case "failed": return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    }

    function getStatusBadge(status: PayrollEntry["status"]) {
        const colors = {
            paid: "bg-green-100 text-green-800 border-green-200",
            processing: "bg-blue-100 text-blue-800 border-blue-200",
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            failed: "bg-red-100 text-red-800 border-red-200",
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
                {getStatusIcon(status)}
                {status}
            </span>
        );
    }

    function downloadCSV(data: PayrollEntry[]) {
        const headers = ["Period", "Pay Date", "Gross Salary", "Deductions", "Net Salary", "Date Paid", "Status", "Payment Method"];
        const rows = data.map(({ period, payDate, grossSalary, deductions, netSalary, datePaid, status, paymentMethod }) => [
            period,
            payDate,
            grossSalary.toFixed(2),
            deductions.toFixed(2),
            netSalary.toFixed(2),
            datePaid || "-",
            status,
            paymentMethod
        ]);
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows]
                .map((e) => e.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
                .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `payroll_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const years = Array.from(new Set(payrolls.map(p => p.period.split(' ')[1]))).sort().reverse();

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Payroll Verification
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {payrolls.filter(p => p.status === 'paid').length} paid periods • ${totalYTD.toFixed(2)} YTD earnings
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => downloadCSV(filteredPayrolls)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200">
                                <Receipt className="w-4 h-4" />
                                Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total Paid (YTD)</p>
                                    <p className="text-2xl font-bold">${totalYTD.toFixed(2)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-green-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Average Monthly</p>
                                    <p className="text-2xl font-bold">${averageSalary.toFixed(2)}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm">Pending Payments</p>
                                    <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
                                </div>
                                <Clock className="w-8 h-8 text-amber-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Total Deductions</p>
                                    <p className="text-2xl font-bold">
                                        ${payrolls.reduce((sum, p) => sum + p.deductions, 0).toFixed(2)}
                                    </p>
                                </div>
                                <Calculator className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by period or payroll ID..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="processing">Processing</option>
                                <option value="pending">Pending</option>
                            </select>
                            <select
                                value={filterYear}
                                onChange={(e) => {
                                    setFilterYear(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Payroll Table */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                                        <Skeleton className="w-16 h-16 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredPayrolls.length === 0 ? (
                            <div className="text-center py-12">
                                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No payroll records found</h3>
                                <p className="text-gray-600">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                {[
                                                    { key: "period", label: "Pay Period", width: "w-48" },
                                                    { key: "payDate", label: "Pay Date", width: "w-40" },
                                                    { key: "grossSalary", label: "Gross Salary", width: "w-32" },
                                                    { key: "deductions", label: "Deductions", width: "w-32" },
                                                    { key: "netSalary", label: "Net Salary", width: "w-32" },
                                                    { key: "datePaid", label: "Date Paid", width: "w-40" },
                                                    { key: "status", label: "Status", width: "w-32" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => toggleSort(key as SortKey)}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${width}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {sortKey === key && (
                                                                sortDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                                <th className="p-4 w-20"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedPayrolls.map((payroll) => (
                                                <tr
                                                    key={payroll.id}
                                                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                    onClick={() => setSelectedPayroll(payroll)}
                                                >
                                                    <td className="p-4">
                                                        <div className="font-medium text-gray-900">{payroll.period}</div>
                                                        <div className="text-sm text-gray-500 font-mono">{payroll.id}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(payroll.payDate).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-right">
                                                            <div className="font-medium text-gray-900">
                                                                ${payroll.grossSalary.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-right">
                                                            <div className="text-red-600 font-medium">
                                                                -${payroll.deductions.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-right">
                                                            <div className="font-bold text-green-600 text-lg">
                                                                ${payroll.netSalary.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-gray-500">
                                                            {payroll.datePaid ? new Date(payroll.datePaid).toLocaleDateString() : '-'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {getStatusBadge(payroll.status)}
                                                    </td>
                                                    <td className="p-4">
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pageCount > 1 && (
                                    <div className="flex justify-between items-center p-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredPayrolls.length)} of {filteredPayrolls.length} records
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={nextPage}
                                                disabled={currentPage === pageCount}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Payroll Detail Modal */}
            {selectedPayroll && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Payroll Details</h2>
                                <p className="text-gray-600">{selectedPayroll.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPayroll(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <AlertCircle className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="text-sm font-medium text-gray-700">Pay Period</label>
                                    <p className="text-gray-900 font-semibold text-lg">{selectedPayroll.period}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedPayroll.status)}</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="text-sm font-medium text-gray-700">Payment Method</label>
                                    <p className="text-gray-900 font-medium capitalize">
                                        {selectedPayroll.paymentMethod.replace('-', ' ')}
                                        {selectedPayroll.accountLastFour && ` • •••• ${selectedPayroll.accountLastFour}`}
                                    </p>
                                </div>
                            </div>

                            {/* Salary Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Earnings */}
                                <div className="bg-green-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Earnings
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-700">Base Salary</span>
                                            <span className="font-semibold text-green-900">
                                                ${selectedPayroll.breakdown.baseSalary.toFixed(2)}
                                            </span>
                                        </div>
                                        {selectedPayroll.breakdown.overtime && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-700">Overtime</span>
                                                <span className="font-semibold text-green-900">
                                                    +${selectedPayroll.breakdown.overtime.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {selectedPayroll.breakdown.bonuses && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-700">Bonuses</span>
                                                <span className="font-semibold text-green-900">
                                                    +${selectedPayroll.breakdown.bonuses.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t border-green-200 pt-3 mt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-900 font-semibold">Gross Salary</span>
                                                <span className="font-bold text-green-900 text-lg">
                                                    ${selectedPayroll.grossSalary.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div className="bg-red-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                                        <Calculator className="w-5 h-5" />
                                        Deductions
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-red-700">Taxes</span>
                                            <span className="font-semibold text-red-900">
                                                -${selectedPayroll.breakdown.taxes.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-red-700">Insurance</span>
                                            <span className="font-semibold text-red-900">
                                                -${selectedPayroll.breakdown.insurance.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-red-700">Retirement</span>
                                            <span className="font-semibold text-red-900">
                                                -${selectedPayroll.breakdown.retirement.toFixed(2)}
                                            </span>
                                        </div>
                                        {selectedPayroll.breakdown.other && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-red-700">Other</span>
                                                <span className="font-semibold text-red-900">
                                                    -${selectedPayroll.breakdown.other.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t border-red-200 pt-3 mt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-red-900 font-semibold">Total Deductions</span>
                                                <span className="font-bold text-red-900 text-lg">
                                                    -${selectedPayroll.deductions.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Net Salary Summary */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-100">Net Salary</h3>
                                        <p className="text-indigo-200">Amount deposited to your account</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold">${selectedPayroll.netSalary.toFixed(2)}</div>
                                        <div className="text-indigo-200 text-sm">
                                            Paid on {selectedPayroll.datePaid ? new Date(selectedPayroll.datePaid).toLocaleDateString() : 'Pending'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

// Skeleton component for loading state
function Skeleton({ className }: { className: string }) {
    return (
        <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
    );
}