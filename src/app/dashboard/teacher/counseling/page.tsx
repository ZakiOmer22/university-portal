"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    UserCheck, 
    CalendarCheck, 
    PlusCircle, 
    ChevronDown, 
    ChevronUp, 
    Search,
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    ArrowLeft,
    MoreVertical,
    Mail
} from "lucide-react";

type CounselingSession = {
    id: string;
    studentName: string;
    dateTime: string;
    topic: string;
    status: "Scheduled" | "Completed" | "Cancelled";
};

const dummySessions: CounselingSession[] = [
    {
        id: "cs1",
        studentName: "John Doe",
        dateTime: "2025-08-10T10:00:00",
        topic: "Career Guidance and future planning discussion",
        status: "Scheduled",
    },
    {
        id: "cs2",
        studentName: "Jane Smith",
        dateTime: "2025-07-20T14:30:00",
        topic: "Academic Progress Review",
        status: "Completed",
    },
    {
        id: "cs3",
        studentName: "Ali Mohamed",
        dateTime: "2025-08-05T09:00:00",
        topic: "Personal Counseling - Anxiety management",
        status: "Cancelled",
    },
    {
        id: "cs4",
        studentName: "Sarah Johnson",
        dateTime: "2025-08-15T11:00:00",
        topic: "Course Selection Advice",
        status: "Scheduled",
    },
    {
        id: "cs5",
        studentName: "Mike Chen",
        dateTime: "2025-07-25T15:30:00",
        topic: "Study Skills Improvement",
        status: "Completed",
    },
];

const PAGE_SIZE = 8;

type SortKey = "studentName" | "dateTime" | "status" | null;
type SortDirection = "asc" | "desc";

function formatDateTime(dtStr: string) {
    const d = new Date(dtStr);
    return {
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        full: d.toLocaleString()
    };
}

function getStatusIcon(status: CounselingSession["status"]) {
    switch (status) {
        case "Scheduled":
            return <Clock className="h-4 w-4" />;
        case "Completed":
            return <CheckCircle className="h-4 w-4" />;
        case "Cancelled":
            return <XCircle className="h-4 w-4" />;
    }
}

function getStatusColor(status: CounselingSession["status"]) {
    switch (status) {
        case "Scheduled":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "Completed":
            return "bg-green-100 text-green-800 border-green-200";
        case "Cancelled":
            return "bg-red-100 text-red-800 border-red-200";
    }
}

export default function StudentCounselingPage() {
    const [sessions, setSessions] = useState<CounselingSession[]>([]);
    const [loading, setLoading] = useState(true);

    // New session form state
    const [formStudent, setFormStudent] = useState("");
    const [formDateTime, setFormDateTime] = useState("");
    const [formTopic, setFormTopic] = useState("");
    const [formError, setFormError] = useState("");
    const [showForm, setShowForm] = useState(false);

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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        if (!formStudent.trim() || !formDateTime || !formTopic.trim()) {
            setFormError("All fields are required.");
            return;
        }

        const newSession: CounselingSession = {
            id: `cs${Date.now()}`,
            studentName: formStudent.trim(),
            dateTime: formDateTime,
            topic: formTopic.trim(),
            status: "Scheduled",
        };

        setSessions((prev) => [newSession, ...prev]);
        setFormStudent("");
        setFormDateTime("");
        setFormTopic("");
        setShowForm(false);
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
                    s.studentName.toLowerCase().includes(term) || 
                    s.topic.toLowerCase().includes(term)
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
        <DashboardLayout>
            <section className="p-6 max-w-12xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <UserCheck className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Student Counseling</h1>
                        </div>
                        <p className="text-gray-600">
                            Manage counseling sessions and student support appointments
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PlusCircle className="h-4 w-4" />
                            New Session
                        </Button>
                        <Button 
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>

                {/* New Counseling Session Form */}
                {showForm && (
                    <Card className="border-indigo-200">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
                                        <PlusCircle size={20} /> Schedule New Counseling Session
                                    </h2>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Student Name</label>
                                        <Input
                                            type="text"
                                            value={formStudent}
                                            onChange={(e) => setFormStudent(e.target.value)}
                                            placeholder="Enter student's full name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Date & Time</label>
                                        <Input
                                            type="datetime-local"
                                            value={formDateTime}
                                            onChange={(e) => setFormDateTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <label className="text-sm font-medium text-gray-700">Topic / Notes</label>
                                    <textarea
                                        rows={3}
                                        value={formTopic}
                                        onChange={(e) => setFormTopic(e.target.value)}
                                        placeholder="Reason or topic for counseling session..."
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                        required
                                    />
                                </div>

                                {formError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-red-700 text-sm">{formError}</p>
                                    </div>
                                )}

                                <Button type="submit" className="w-full md:w-auto">
                                    Schedule Counseling Session
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Total Sessions</p>
                                    <p className="text-3xl font-bold text-indigo-900">{totalCount}</p>
                                </div>
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <CalendarCheck className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Scheduled</p>
                                    <p className="text-3xl font-bold text-blue-900">{scheduledCount}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-green-900">{completedCount}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600 mb-1">Cancelled</p>
                                    <p className="text-3xl font-bold text-red-900">{cancelledCount}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Section */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <select
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
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
                                </div>
                            </div>

                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search by student name or topic..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sessions Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading counseling sessions...</p>
                            </div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="text-center py-12">
                                <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {searchTerm || filterStatus !== "All" 
                                        ? "No sessions match your current filters." 
                                        : "No counseling sessions scheduled yet."
                                    }
                                </p>
                                {!showForm && (
                                    <Button 
                                        onClick={() => setShowForm(true)}
                                        className="mt-4"
                                    >
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Schedule First Session
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50/50">
                                                {[
                                                    { key: "studentName", label: "Student", width: "w-1/4" },
                                                    { key: "dateTime", label: "Date & Time", width: "w-1/4" },
                                                    { key: "topic", label: "Topic / Notes", width: "w-2/5" },
                                                    { key: "status", label: "Status", width: "w-1/6" },
                                                    { key: "actions", label: "", width: "w-1/12" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => key !== "topic" && key !== "actions" && toggleSort(key as SortKey)}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 ${width} ${
                                                            key !== "topic" && key !== "actions" 
                                                                ? "cursor-pointer hover:bg-gray-100 transition-colors" 
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {key !== "topic" && key !== "actions" && sortKey === key && (
                                                                sortDir === "asc" ? 
                                                                <ChevronUp className="h-4 w-4" /> : 
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {paginatedSessions.map((session) => {
                                                const { date, time, full } = formatDateTime(session.dateTime);
                                                return (
                                                    <tr 
                                                        key={session.id} 
                                                        className="hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                                                    <span className="font-semibold text-indigo-600 text-sm">
                                                                        {session.studentName.split(' ').map(n => n[0]).join('')}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{session.studentName}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="space-y-1">
                                                                <p className="font-medium text-gray-900">{date}</p>
                                                                <p className="text-sm text-gray-500">{time}</p>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="text-gray-600 line-clamp-2">{session.topic}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge 
                                                                variant="outline"
                                                                className={`flex items-center gap-1 w-fit ${getStatusColor(session.status)}`}
                                                            >
                                                                {getStatusIcon(session.status)}
                                                                {session.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => alert(`Message ${session.studentName}`)}
                                                                >
                                                                    <Mail className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pageCount > 1 && (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-gray-50/50">
                                        <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredSessions.length)} of {filteredSessions.length} sessions
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                })}
                                                {pageCount > 5 && <span className="px-2 text-gray-500">...</span>}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={nextPage}
                                                disabled={currentPage === pageCount}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </section>
        </DashboardLayout>
    );
}