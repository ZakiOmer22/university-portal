"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { UserCheck, CalendarCheck, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";

type CounselingSession = {
    id: string;
    studentName: string;
    dateTime: string; // ISO datetime string
    topic: string;
    status: "Scheduled" | "Completed" | "Cancelled";
};

const dummySessions: CounselingSession[] = [
    {
        id: "cs1",
        studentName: "John Doe",
        dateTime: "2025-08-10T10:00:00",
        topic: "Career Guidance",
        status: "Scheduled",
    },
    {
        id: "cs2",
        studentName: "Jane Smith",
        dateTime: "2025-07-20T14:30:00",
        topic: "Academic Progress",
        status: "Completed",
    },
    {
        id: "cs3",
        studentName: "Ali Mohamed",
        dateTime: "2025-08-05T09:00:00",
        topic: "Personal Counseling",
        status: "Cancelled",
    },
];

const PAGE_SIZE = 8;

type SortKey = "studentName" | "dateTime" | "status" | null;
type SortDirection = "asc" | "desc";

function formatDateTime(dtStr: string) {
    const d = new Date(dtStr);
    return d.toLocaleString();
}

export default function StudentCounselingPage() {
    const [sessions, setSessions] = useState<CounselingSession[]>([]);
    const [loading, setLoading] = useState(true);

    // New session form state
    const [formStudent, setFormStudent] = useState("");
    const [formDateTime, setFormDateTime] = useState("");
    const [formTopic, setFormTopic] = useState("");
    const [formError, setFormError] = useState("");

    // Filters, pagination, sorting
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setSessions(dummySessions);
            setLoading(false);
        }, 600);
    }, []);

    // Submit new counseling session
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        if (!formStudent.trim() || !formDateTime || !formTopic.trim()) {
            setFormError("All fields are required.");
            return;
        }

        const newSession: CounselingSession = {
            id: Date.now().toString(),
            studentName: formStudent.trim(),
            dateTime: formDateTime,
            topic: formTopic.trim(),
            status: "Scheduled",
        };

        setSessions((prev) => [newSession, ...prev]);
        setFormStudent("");
        setFormDateTime("");
        setFormTopic("");
        setCurrentPage(1);
    }

    const filteredSessions = useMemo(() => {
        let filtered = sessions;

        if (filterStatus !== "All") {
            filtered = filtered.filter((s) => s.status === filterStatus);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.studentName.toLowerCase().includes(term) || s.topic.toLowerCase().includes(term)
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "studentName") {
                    comp = a.studentName.localeCompare(b.studentName);
                } else if (sortKey === "dateTime") {
                    comp = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
                } else if (sortKey === "status") {
                    comp = a.status.localeCompare(b.status);
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [sessions, filterStatus, searchTerm, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredSessions.length / PAGE_SIZE);

    const paginatedSessions = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredSessions.slice(start, start + PAGE_SIZE);
    }, [filteredSessions, currentPage]);

    // Summary counts
    const totalCount = filteredSessions.length;
    const scheduledCount = filteredSessions.filter((s) => s.status === "Scheduled").length;
    const completedCount = filteredSessions.filter((s) => s.status === "Completed").length;
    const cancelledCount = filteredSessions.filter((s) => s.status === "Cancelled").length;

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
        <DashboardLayout >
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <UserCheck size={32} /> Student Counseling
                </h1>

                {/* New Counseling Session Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mb-10 bg-indigo-50 p-6 rounded shadow max-w-xl mx-auto"
                    noValidate
                >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
                        <PlusCircle size={20} /> Schedule New Session
                    </h2>

                    <label className="flex flex-col mb-4">
                        <span className="font-semibold mb-1">Student Name</span>
                        <input
                            type="text"
                            value={formStudent}
                            onChange={(e) => setFormStudent(e.target.value)}
                            placeholder="Enter student's full name"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </label>

                    <label className="flex flex-col mb-4">
                        <span className="font-semibold mb-1">Date & Time</span>
                        <input
                            type="datetime-local"
                            value={formDateTime}
                            onChange={(e) => setFormDateTime(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </label>

                    <label className="flex flex-col mb-4">
                        <span className="font-semibold mb-1">Topic / Notes</span>
                        <textarea
                            rows={3}
                            value={formTopic}
                            onChange={(e) => setFormTopic(e.target.value)}
                            placeholder="Reason or topic for counseling"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </label>

                    {formError && <p className="text-red-600 mb-4 font-semibold">{formError}</p>}

                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded font-semibold transition"
                    >
                        Schedule Session
                    </button>
                </form>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div className="bg-indigo-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-indigo-800">Total Sessions</h2>
                        <p className="text-3xl font-bold text-indigo-900">{totalCount}</p>
                    </div>
                    <div className="bg-blue-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-blue-700">Scheduled</h2>
                        <p className="text-3xl font-bold text-blue-900">{scheduledCount}</p>
                    </div>
                    <div className="bg-green-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-green-700">Completed</h2>
                        <p className="text-3xl font-bold text-green-900">{completedCount}</p>
                    </div>
                    <div className="bg-red-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-red-700">Cancelled</h2>
                        <p className="text-3xl font-bold text-red-900">{cancelledCount}</p>
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
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <input
                        type="search"
                        placeholder="Search by student or topic..."
                        className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Sessions Table */}
                {loading ? (
                    <p className="text-center py-12 text-gray-600">Loading counseling sessions...</p>
                ) : filteredSessions.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">No counseling sessions found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm max-w-6xl mx-auto">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("studentName")}
                                        >
                                            Student Name
                                            {sortKey === "studentName" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("dateTime")}
                                        >
                                            Date & Time
                                            {sortKey === "dateTime" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                            Topic / Notes
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedSessions.map(({ id, studentName, dateTime, topic, status }) => (
                                        <tr key={id} className="hover:bg-indigo-50 transition">
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{studentName}</td>
                                            <td className="border border-gray-300 p-3 text-center whitespace-nowrap">{formatDateTime(dateTime)}</td>
                                            <td className="border border-gray-300 p-3">{topic}</td>
                                            <td
                                                className={`border border-gray-300 p-3 text-center font-semibold ${status === "Completed"
                                                        ? "text-green-700"
                                                        : status === "Scheduled"
                                                            ? "text-blue-700"
                                                            : "text-red-700"
                                                    }`}
                                            >
                                                {status}
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
