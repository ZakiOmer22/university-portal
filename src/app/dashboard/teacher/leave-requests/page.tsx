"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { 
    Clock, 
    ChevronDown, 
    ChevronUp, 
    PlusCircle,
    Filter,
    Search,
    Download,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock4,
    AlertCircle,
    FileText,
    User,
    MapPin,
    Send,
    MoreVertical,
    Edit,
    Trash2,
    Eye
} from "lucide-react";

type LeaveRequest = {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    type: "sick" | "vacation" | "personal" | "professional" | "emergency";
    status: "pending" | "approved" | "rejected" | "cancelled";
    submittedAt: string;
    daysRequested: number;
    emergencyContact?: string;
    supportingDocs?: string[];
    notes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
};

const dummyLeaveRequests: LeaveRequest[] = [
    {
        id: "LR-2024-001",
        startDate: "2024-03-15",
        endDate: "2024-03-17",
        reason: "Family wedding ceremony out of state",
        type: "personal",
        status: "approved",
        submittedAt: "2024-03-01T10:30:00Z",
        daysRequested: 3,
        emergencyContact: "+1 (555) 123-4567",
        reviewedBy: "Dr. James Wilson",
        reviewedAt: "2024-03-02T14:20:00Z"
    },
    {
        id: "LR-2024-002",
        startDate: "2024-03-20",
        endDate: "2024-03-22",
        reason: "Medical appointment and recovery time for minor procedure",
        type: "sick",
        status: "pending",
        submittedAt: "2024-03-10T09:15:00Z",
        daysRequested: 3,
        emergencyContact: "+1 (555) 987-6543",
        supportingDocs: ["medical_certificate.pdf"]
    },
    {
        id: "LR-2024-003",
        startDate: "2024-02-10",
        endDate: "2024-02-12",
        reason: "Academic conference presentation",
        type: "professional",
        status: "approved",
        submittedAt: "2024-01-25T16:45:00Z",
        daysRequested: 3,
        supportingDocs: ["conference_invitation.pdf", "travel_itinerary.docx"],
        reviewedBy: "Dr. James Wilson",
        reviewedAt: "2024-01-28T11:30:00Z"
    },
    {
        id: "LR-2024-004",
        startDate: "2024-04-01",
        endDate: "2024-04-05",
        reason: "Annual family vacation planned months in advance",
        type: "vacation",
        status: "pending",
        submittedAt: "2024-03-05T08:20:00Z",
        daysRequested: 5
    },
    {
        id: "LR-2023-015",
        startDate: "2023-12-24",
        endDate: "2023-12-26",
        reason: "Unexpected family emergency requiring immediate attention",
        type: "emergency",
        status: "approved",
        submittedAt: "2023-12-23T18:30:00Z",
        daysRequested: 3,
        emergencyContact: "+1 (555) 456-7890",
        reviewedBy: "Dr. James Wilson",
        reviewedAt: "2023-12-24T09:15:00Z"
    }
];

const PAGE_SIZE = 8;

type SortKey = "startDate" | "endDate" | "status" | "submittedAt" | "type" | "daysRequested" | null;
type SortDirection = "asc" | "desc";

export default function TeacherLeaveRequestsPage() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // New leave form state
    const [formStartDate, setFormStartDate] = useState("");
    const [formEndDate, setFormEndDate] = useState("");
    const [formReason, setFormReason] = useState("");
    const [formType, setFormType] = useState<LeaveRequest["type"]>("personal");
    const [formEmergencyContact, setFormEmergencyContact] = useState("");
    const [formNotes, setFormNotes] = useState("");
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    // Filters & pagination & sorting
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
    const [sortDir, setSortDir] = useState<SortDirection>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLeaveRequests(dummyLeaveRequests);
            setLoading(false);
        }, 1200);
    }, []);

    // Calculate days requested
    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Inclusive of both dates
    };

    // Submit new leave request
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!formStartDate || !formEndDate || !formReason.trim()) {
            setFormError("Please fill in all required fields.");
            return;
        }

        if (new Date(formEndDate) < new Date(formStartDate)) {
            setFormError("End date cannot be before start date.");
            return;
        }

        const daysRequested = calculateDays(formStartDate, formEndDate);

        const newRequest: LeaveRequest = {
            id: `LR-2024-${String(leaveRequests.length + 1).padStart(3, '0')}`,
            startDate: formStartDate,
            endDate: formEndDate,
            reason: formReason.trim(),
            type: formType,
            status: "pending",
            submittedAt: new Date().toISOString(),
            daysRequested,
            emergencyContact: formEmergencyContact || undefined,
            notes: formNotes || undefined
        };

        setLeaveRequests((prev) => [newRequest, ...prev]);
        setFormStartDate("");
        setFormEndDate("");
        setFormReason("");
        setFormType("personal");
        setFormEmergencyContact("");
        setFormNotes("");
        setFormSuccess("Leave request submitted successfully!");
        setShowForm(false);
        setCurrentPage(1);
    }

    const filteredRequests = useMemo(() => {
        let filtered = leaveRequests;

        if (filterStatus !== "all") {
            filtered = filtered.filter((r) => r.status === filterStatus);
        }

        if (filterType !== "all") {
            filtered = filtered.filter((r) => r.type === filterType);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.reason.toLowerCase().includes(term) ||
                    r.id.toLowerCase().includes(term)
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "startDate" || sortKey === "endDate" || sortKey === "submittedAt") {
                    comp = new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime();
                } else if (sortKey === "status" || sortKey === "type") {
                    comp = a[sortKey].localeCompare(b[sortKey]);
                } else if (sortKey === "daysRequested") {
                    comp = a.daysRequested - b.daysRequested;
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [leaveRequests, filterStatus, filterType, searchTerm, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredRequests.length / PAGE_SIZE);
    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredRequests.slice(start, start + PAGE_SIZE);
    }, [filteredRequests, currentPage]);

    // Summary counts
    const totalRequests = leaveRequests.length;
    const approvedCount = leaveRequests.filter((r) => r.status === "approved").length;
    const pendingCount = leaveRequests.filter((r) => r.status === "pending").length;
    const rejectedCount = leaveRequests.filter((r) => r.status === "rejected").length;
    const totalDaysRequested = leaveRequests.reduce((sum, r) => sum + r.daysRequested, 0);

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    function getStatusIcon(status: LeaveRequest["status"]) {
        switch (status) {
            case "approved": return <CheckCircle2 className="w-4 h-4" />;
            case "rejected": return <XCircle className="w-4 h-4" />;
            case "cancelled": return <XCircle className="w-4 h-4" />;
            default: return <Clock4 className="w-4 h-4" />;
        }
    }

    function getStatusBadge(status: LeaveRequest["status"]) {
        const colors = {
            approved: "bg-green-100 text-green-800 border-green-200",
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            rejected: "bg-red-100 text-red-800 border-red-200",
            cancelled: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
                {getStatusIcon(status)}
                {status}
            </span>
        );
    }

    function getTypeBadge(type: LeaveRequest["type"]) {
        const colors = {
            sick: "bg-red-100 text-red-800 border-red-200",
            vacation: "bg-blue-100 text-blue-800 border-blue-200",
            personal: "bg-purple-100 text-purple-800 border-purple-200",
            professional: "bg-green-100 text-green-800 border-green-200",
            emergency: "bg-orange-100 text-orange-800 border-orange-200",
        };
        const icons = {
            sick: <User className="w-3 h-3" />,
            vacation: <MapPin className="w-3 h-3" />,
            personal: <Calendar className="w-3 h-3" />,
            professional: <FileText className="w-3 h-3" />,
            emergency: <AlertCircle className="w-3 h-3" />,
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[type]}`}>
                {icons[type]}
                {type}
            </span>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Leave Requests
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {pendingCount} pending requests • {totalDaysRequested} total days requested
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button 
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                            >
                                <PlusCircle className="w-4 h-4" />
                                New Request
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Requests</p>
                                    <p className="text-2xl font-bold">{totalRequests}</p>
                                </div>
                                <FileText className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Approved</p>
                                    <p className="text-2xl font-bold">{approvedCount}</p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-green-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm">Pending</p>
                                    <p className="text-2xl font-bold">{pendingCount}</p>
                                </div>
                                <Clock4 className="w-8 h-8 text-amber-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Total Days</p>
                                    <p className="text-2xl font-bold">{totalDaysRequested}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                    </div>

                    {/* New Leave Request Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Submit New Leave Request</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <XCircle className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={formStartDate}
                                            onChange={(e) => setFormStartDate(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={formEndDate}
                                            onChange={(e) => setFormEndDate(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Leave Type *
                                        </label>
                                        <select
                                            value={formType}
                                            onChange={(e) => setFormType(e.target.value as LeaveRequest["type"])}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="personal">Personal</option>
                                            <option value="sick">Sick Leave</option>
                                            <option value="vacation">Vacation</option>
                                            <option value="professional">Professional Development</option>
                                            <option value="emergency">Emergency</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Emergency Contact
                                        </label>
                                        <input
                                            type="text"
                                            value={formEmergencyContact}
                                            onChange={(e) => setFormEmergencyContact(e.target.value)}
                                            placeholder="Phone number for emergencies"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Leave *
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formReason}
                                        onChange={(e) => setFormReason(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Please provide detailed reason for your leave request..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formNotes}
                                        onChange={(e) => setFormNotes(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Any additional information or special arrangements..."
                                    />
                                </div>

                                {formError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                        {formError}
                                    </div>
                                )}

                                {formSuccess && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                                        {formSuccess}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
                                    >
                                        <Send className="w-4 h-4" />
                                        Submit Request
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search requests by reason or ID..."
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
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="personal">Personal</option>
                                <option value="sick">Sick Leave</option>
                                <option value="vacation">Vacation</option>
                                <option value="professional">Professional</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                    </div>

                    {/* Leave Requests Table */}
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
                        ) : filteredRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No leave requests found</h3>
                                <p className="text-gray-600">Try adjusting your filters or create a new request</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                {[
                                                    { key: "id", label: "Request ID", width: "w-32" },
                                                    { key: "startDate", label: "Date Range", width: "w-48" },
                                                    { key: "type", label: "Type", width: "w-32" },
                                                    { key: "reason", label: "Reason", width: "flex-1" },
                                                    { key: "daysRequested", label: "Days", width: "w-20" },
                                                    { key: "status", label: "Status", width: "w-32" },
                                                    { key: "submittedAt", label: "Submitted", width: "w-40" },
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
                                            {paginatedRequests.map((request) => (
                                                <tr
                                                    key={request.id}
                                                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                    onClick={() => setSelectedRequest(request)}
                                                >
                                                    <td className="p-4">
                                                        <div className="font-mono text-sm font-medium text-gray-900">
                                                            {request.id}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(request.startDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            to {new Date(request.endDate).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {getTypeBadge(request.type)}
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {request.reason}
                                                        </p>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-center">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                                {request.daysRequested}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {getStatusBadge(request.status)}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(request.submittedAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                            <MoreVertical className="w-4 h-4 text-gray-600" />
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
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredRequests.length)} of {filteredRequests.length} requests
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

            {/* Request Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Leave Request Details</h2>
                                <p className="text-gray-600">{selectedRequest.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                <XCircle className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Date Range</label>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">{selectedRequest.daysRequested} days</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Type & Status</label>
                                    <div className="flex gap-2 mt-1">
                                        {getTypeBadge(selectedRequest.type)}
                                        {getStatusBadge(selectedRequest.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Reason</label>
                                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedRequest.reason}</p>
                            </div>

                            {/* Additional Info */}
                            {(selectedRequest.emergencyContact || selectedRequest.notes) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedRequest.emergencyContact && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                                            <p className="text-gray-900">{selectedRequest.emergencyContact}</p>
                                        </div>
                                    )}
                                    {selectedRequest.notes && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                                            <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Review Info */}
                            {selectedRequest.reviewedBy && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Review Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Reviewed By</label>
                                            <p className="text-gray-900">{selectedRequest.reviewedBy}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Reviewed On</label>
                                            <p className="text-gray-900">
                                                {new Date(selectedRequest.reviewedAt!).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
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