"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Clock, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";

type LeaveRequest = {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
    submittedAt: string; // ISO date of submission
};

const dummyLeaveRequests: LeaveRequest[] = [
    {
        id: "lr1",
        startDate: "2025-08-05",
        endDate: "2025-08-07",
        reason: "Family event",
        status: "Approved",
        submittedAt: "2025-07-25",
    },
    {
        id: "lr2",
        startDate: "2025-08-12",
        endDate: "2025-08-14",
        reason: "Medical leave",
        status: "Pending",
        submittedAt: "2025-08-01",
    },
    {
        id: "lr3",
        startDate: "2025-07-15",
        endDate: "2025-07-16",
        reason: "Personal reasons",
        status: "Rejected",
        submittedAt: "2025-07-05",
    },
];

const PAGE_SIZE = 8;

type SortKey = "startDate" | "endDate" | "status" | "submittedAt" | null;
type SortDirection = "asc" | "desc";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
}

export default function TeacherLeaveRequestsPage() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // New leave form state
    const [formStartDate, setFormStartDate] = useState("");
    const [formEndDate, setFormEndDate] = useState("");
    const [formReason, setFormReason] = useState("");
    const [formError, setFormError] = useState("");

    // Filters & pagination & sorting
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLeaveRequests(dummyLeaveRequests);
            setLoading(false);
        }, 600);
    }, []);

    // Submit new leave request
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        if (!formStartDate || !formEndDate || !formReason.trim()) {
            setFormError("All fields are required.");
            return;
        }

        if (new Date(formEndDate) < new Date(formStartDate)) {
            setFormError("End date cannot be before start date.");
            return;
        }

        const newRequest: LeaveRequest = {
            id: Date.now().toString(),
            startDate: formStartDate,
            endDate: formEndDate,
            reason: formReason.trim(),
            status: "Pending",
            submittedAt: new Date().toISOString(),
        };

        setLeaveRequests((prev) => [newRequest, ...prev]);
        setFormStartDate("");
        setFormEndDate("");
        setFormReason("");
        setCurrentPage(1);
    }

    const filteredRequests = useMemo(() => {
        let filtered = leaveRequests;

        if (filterStatus !== "All") {
            filtered = filtered.filter((r) => r.status === filterStatus);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.reason.toLowerCase().includes(term)
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "startDate") {
                    comp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                } else if (sortKey === "endDate") {
                    comp = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                } else if (sortKey === "status") {
                    comp = a.status.localeCompare(b.status);
                } else if (sortKey === "submittedAt") {
                    comp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [leaveRequests, filterStatus, searchTerm, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredRequests.length / PAGE_SIZE);

    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredRequests.slice(start, start + PAGE_SIZE);
    }, [filteredRequests, currentPage]);

    // Summary counts
    const totalRequests = filteredRequests.length;
    const approvedCount = filteredRequests.filter((r) => r.status === "Approved").length;
    const pendingCount = filteredRequests.filter((r) => r.status === "Pending").length;
    const rejectedCount = filteredRequests.filter((r) => r.status === "Rejected").length;

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    return (
        <DashboardLayout
        >
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <Clock size={32} /> My Leave Requests
                </h1>

                {/* New Leave Request Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mb-10 bg-indigo-50 p-6 rounded shadow max-w-xl mx-auto"
                    noValidate
                >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
                        <PlusCircle size={20} /> Submit New Leave Request
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                        <label className="flex flex-col">
                            <span className="font-semibold mb-1">Start Date</span>
                            <input
                                type="date"
                                value={formStartDate}
                                onChange={(e) => setFormStartDate(e.target.value)}
                                required
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="font-semibold mb-1">End Date</span>
                            <input
                                type="date"
                                value={formEndDate}
                                onChange={(e) => setFormEndDate(e.target.value)}
                                required
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col mb-4">
                        <span className="font-semibold mb-1">Reason</span>
                        <textarea
                            rows={3}
                            value={formReason}
                            onChange={(e) => setFormReason(e.target.value)}
                            required
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Explain your reason for leave"
                        />
                    </label>

                    {formError && <p className="text-red-600 mb-4 font-semibold">{formError}</p>}

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded font-semibold transition"
                    >
                        Submit Request
                    </button>
                </form>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div className="bg-indigo-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-indigo-800">Total Requests</h2>
                        <p className="text-3xl font-bold text-indigo-900">{totalRequests}</p>
                    </div>
                    <div className="bg-green-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-green-700">Approved</h2>
                        <p className="text-3xl font-bold text-green-900">{approvedCount}</p>
                    </div>
                    <div className="bg-yellow-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-yellow-700">Pending</h2>
                        <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
                    </div>
                    <div className="bg-red-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-red-700">Rejected</h2>
                        <p className="text-3xl font-bold text-red-900">{rejectedCount}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-center gap-4 justify-center max-w-4xl mx-auto">
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <input
                        type="search"
                        placeholder="Search by reason..."
                        className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Leave Requests Table */}
                {loading ? (
                    <p className="text-center py-12 text-gray-600">Loading leave requests...</p>
                ) : filteredRequests.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">No leave requests found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm max-w-6xl mx-auto">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("startDate")}
                                        >
                                            Start Date
                                            {sortKey === "startDate" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("endDate")}
                                        >
                                            End Date
                                            {sortKey === "endDate" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                            Reason
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("status")}
                                        >
                                            Status
                                            {sortKey === "status" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("submittedAt")}
                                        >
                                            Submitted On
                                            {sortKey === "submittedAt" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRequests.map(({ id, startDate, endDate, reason, status, submittedAt }) => (
                                        <tr key={id} className="hover:bg-indigo-50 transition">
                                            <td className="border border-gray-300 p-3 text-center whitespace-nowrap">
                                                {formatDate(startDate)}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center whitespace-nowrap">
                                                {formatDate(endDate)}
                                            </td>
                                            <td className="border border-gray-300 p-3">{reason}</td>
                                            <td
                                                className={`border border-gray-300 p-3 text-center font-semibold ${status === "Approved"
                                                        ? "text-green-700"
                                                        : status === "Pending"
                                                            ? "text-yellow-700"
                                                            : "text-red-700"
                                                    }`}
                                            >
                                                {status}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-center whitespace-nowrap">
                                                {formatDate(submittedAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap max-w-6xl mx-auto">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === 1
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
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
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === pageCount
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                    } transition`}
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* Back Button */}
                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={() => history.back()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded shadow-md transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
}
