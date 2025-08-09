"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { useRouter } from "next/navigation";
import { DollarSign, FileText, ChevronDown, ChevronUp } from "lucide-react";

type PayrollEntry = {
    id: string;
    period: string; // e.g., "July 2025"
    grossSalary: number;
    deductions: number;
    netSalary: number;
    datePaid: string; // ISO or empty if pending
    status: "Paid" | "Pending";
};

const dummyPayrollData: PayrollEntry[] = [
    { id: "pay1", period: "July 2025", grossSalary: 3000, deductions: 300, netSalary: 2700, datePaid: "2025-07-10", status: "Paid" },
    { id: "pay2", period: "August 2025", grossSalary: 3000, deductions: 300, netSalary: 2700, datePaid: "", status: "Pending" },
    { id: "pay3", period: "June 2025", grossSalary: 3000, deductions: 300, netSalary: 2700, datePaid: "2025-06-10", status: "Paid" },
    // add more records as needed
];

const PAGE_SIZE = 10;

type SortKey = "period" | "grossSalary" | "netSalary" | "datePaid" | null;
type SortDirection = "asc" | "desc";

function formatDate(dateStr: string) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
}

function downloadCSV(data: PayrollEntry[]) {
    const headers = ["Period", "Gross Salary", "Deductions", "Net Salary", "Date Paid", "Status"];
    const rows = data.map(({ period, grossSalary, deductions, netSalary, datePaid, status }) => [
        period,
        grossSalary.toFixed(2),
        deductions.toFixed(2),
        netSalary.toFixed(2),
        datePaid || "-",
        status,
    ]);
    const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows]
            .map((e) => e.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
            .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payroll_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default function PayrollVerificationPage() {
    const router = useRouter();
    const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Sorting
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDirection>("asc");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPayrolls(dummyPayrollData);
            setLoading(false);
        }, 600);
    }, []);

    const filteredPayrolls = useMemo(() => {
        let filtered = payrolls;

        if (filterStatus !== "All") {
            filtered = filtered.filter((p) => p.status === filterStatus);
        }

        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((p) => p.period.toLowerCase().includes(term));
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
                } else if (sortKey === "datePaid") {
                    const dateA = a.datePaid ? new Date(a.datePaid).getTime() : 0;
                    const dateB = b.datePaid ? new Date(b.datePaid).getTime() : 0;
                    comp = dateA - dateB;
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [payrolls, filterStatus, searchTerm, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredPayrolls.length / PAGE_SIZE);

    const paginatedPayrolls = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredPayrolls.slice(start, start + PAGE_SIZE);
    }, [filteredPayrolls, currentPage]);

    // Summaries
    const totalPaid = filteredPayrolls
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + p.netSalary, 0);

    const totalPending = filteredPayrolls
        .filter((p) => p.status === "Pending")
        .reduce((sum, p) => sum + p.grossSalary, 0);

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
            setSortDir("asc");
        }
    }

    return (
        <DashboardLayout>
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <DollarSign size={32} /> Payroll Verification
                </h1>

                <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-green-100 rounded p-4 text-center">
                        <h2 className="text-lg font-semibold text-green-700">Total Paid (Net)</h2>
                        <p className="text-2xl font-bold text-green-900">${totalPaid.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-100 rounded p-4 text-center">
                        <h2 className="text-lg font-semibold text-red-700">Pending Payments (Gross)</h2>
                        <p className="text-2xl font-bold text-red-900">${totalPending.toFixed(2)}</p>
                    </div>
                    <div className="bg-yellow-100 rounded p-4 text-center">
                        <h2 className="text-lg font-semibold text-yellow-700">Total Deductions</h2>
                        <p className="text-2xl font-bold text-yellow-900">
                            ${filteredPayrolls.reduce((sum, p) => sum + p.deductions, 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>

                    <input
                        type="search"
                        placeholder="Search by period (e.g. July 2025)..."
                        className="border border-gray-300 rounded px-4 py-2 max-w-sm w-full sm:w-auto"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <button
                        onClick={() => downloadCSV(filteredPayrolls)}
                        className="flex items-center gap-2 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded px-4 py-2 font-semibold transition"
                    >
                        <FileText size={20} />
                        Export CSV
                    </button>
                </div>

                {loading ? (
                    <p className="text-center py-12 text-gray-600">Loading payroll data...</p>
                ) : filteredPayrolls.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">No payroll records found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("period")}
                                        >
                                            Period
                                            {sortKey === "period" && (sortDir === "asc" ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />)}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-right text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("grossSalary")}
                                        >
                                            Gross Salary
                                            {sortKey === "grossSalary" && (sortDir === "asc" ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />)}
                                        </th>
                                        <th className="border border-gray-300 p-3 text-right text-indigo-900 font-semibold whitespace-nowrap">
                                            Deductions
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-right text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("netSalary")}
                                        >
                                            Net Salary
                                            {sortKey === "netSalary" && (sortDir === "asc" ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />)}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("datePaid")}
                                        >
                                            Date Paid
                                            {sortKey === "datePaid" && (sortDir === "asc" ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />)}
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedPayrolls.map(({ id, period, grossSalary, deductions, netSalary, datePaid, status }) => (
                                        <tr key={id} className="hover:bg-indigo-50 transition">
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{period}</td>
                                            <td className="border border-gray-300 p-3 text-right">${grossSalary.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-3 text-right">${deductions.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-3 text-right">${netSalary.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-3 text-center">{formatDate(datePaid)}</td>
                                            <td className={`border border-gray-300 p-3 text-center font-semibold ${status === "Paid" ? "text-green-700" : "text-red-700"}`}>
                                                {status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                    } transition`}
                                aria-label="Previous page"
                            >
                                Previous
                            </button>

                            <span className="font-semibold text-gray-700 whitespace-nowrap">
                                Page {currentPage} of {pageCount}
                            </span>

                            <button
                                onClick={nextPage}
                                disabled={currentPage === pageCount}
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === pageCount ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                    } transition`}
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded shadow-md transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
}
