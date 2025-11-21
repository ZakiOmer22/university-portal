"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Filter, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, UserCheck } from "lucide-react";

interface AttendanceRecord {
    id: string;
    date: string;
    course: string;
    courseCode?: string;
    instructor?: string;
    status: "Present" | "Absent" | "Late" | "Excused";
    remarks?: string;
    time?: string;
}

const dummyAttendanceRecords: AttendanceRecord[] = [
    { id: "a1", date: "2025-08-01", course: "Mathematics", courseCode: "MATH201", instructor: "Prof. Jane", status: "Present", time: "09:00 AM" },
    { id: "a2", date: "2025-08-02", course: "Physics", courseCode: "PHY101", instructor: "Dr. Wilson", status: "Absent", remarks: "Sick leave", time: "10:30 AM" },
    { id: "a3", date: "2025-08-03", course: "Chemistry", courseCode: "CHEM201", instructor: "Dr. Brown", status: "Late", remarks: "Bus delay", time: "11:00 AM" },
    { id: "a4", date: "2025-08-04", course: "Biology", courseCode: "BIO101", instructor: "Ms. Davis", status: "Present", time: "08:00 AM" },
    { id: "a5", date: "2025-08-05", course: "Computer Science", courseCode: "CS101", instructor: "Dr. Smith", status: "Present", time: "02:00 PM" },
    { id: "a6", date: "2025-08-06", course: "Mathematics", courseCode: "MATH201", instructor: "Prof. Jane", status: "Excused", remarks: "Family event", time: "09:00 AM" },
    { id: "a7", date: "2025-08-07", course: "Physics", courseCode: "PHY101", instructor: "Dr. Wilson", status: "Present", time: "10:30 AM" },
    { id: "a8", date: "2025-08-08", course: "Chemistry", courseCode: "CHEM201", instructor: "Dr. Brown", status: "Present", time: "11:00 AM" },
    { id: "a9", date: "2025-08-09", course: "Biology", courseCode: "BIO101", instructor: "Ms. Davis", status: "Absent", time: "08:00 AM" },
    { id: "a10", date: "2025-08-10", course: "Computer Science", courseCode: "CS101", instructor: "Dr. Smith", status: "Present", time: "02:00 PM" },
    { id: "a11", date: "2025-08-11", course: "Mathematics", courseCode: "MATH201", instructor: "Prof. Jane", status: "Present", time: "09:00 AM" },
    { id: "a12", date: "2025-08-12", course: "Physics", courseCode: "PHY101", instructor: "Dr. Wilson", status: "Late", remarks: "Traffic jam", time: "10:30 AM" },
    { id: "a13", date: "2025-08-13", course: "Chemistry", courseCode: "CHEM201", instructor: "Dr. Brown", status: "Present", time: "11:00 AM" },
    { id: "a14", date: "2025-08-14", course: "Biology", courseCode: "BIO101", instructor: "Ms. Davis", status: "Present", time: "08:00 AM" },
    { id: "a15", date: "2025-08-15", course: "Computer Science", courseCode: "CS101", instructor: "Dr. Smith", status: "Absent", remarks: "Medical appointment", time: "02:00 PM" },
    { id: "a16", date: "2025-08-16", course: "Mathematics", courseCode: "MATH201", instructor: "Prof. Jane", status: "Present", time: "09:00 AM" },
    { id: "a17", date: "2025-08-17", course: "Physics", courseCode: "PHY101", instructor: "Dr. Wilson", status: "Present", time: "10:30 AM" },
    { id: "a18", date: "2025-08-18", course: "Chemistry", courseCode: "CHEM201", instructor: "Dr. Brown", status: "Excused", remarks: "University event", time: "11:00 AM" },
    { id: "a19", date: "2025-08-19", course: "Biology", courseCode: "BIO101", instructor: "Ms. Davis", status: "Present", time: "08:00 AM" },
    { id: "a20", date: "2025-08-20", course: "Computer Science", courseCode: "CS101", instructor: "Dr. Smith", status: "Present", time: "02:00 PM" },
];

const ITEMS_PER_PAGE = 8;

function StatusBadge({ status }: { status: AttendanceRecord["status"] }) {
    switch (status) {
        case "Present":
            return (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Present
                </Badge>
            );
        case "Absent":
            return (
                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <XCircle size={14} />
                    Absent
                </Badge>
            );
        case "Late":
            return (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                    <Clock size={14} />
                    Late
                </Badge>
            );
        case "Excused":
            return (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
                    <UserCheck size={14} />
                    Excused
                </Badge>
            );
    }
}

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCourse, setFilterCourse] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        // Load user from localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data:", error);
            }
        }

        setLoading(true);

        setTimeout(() => {
            setAttendance(dummyAttendanceRecords);
            setLoading(false);
        }, 800);
    }, []);

    const courses = Array.from(new Set(dummyAttendanceRecords.map((rec) => rec.course))).sort();
    const statuses = ["All", "Present", "Absent", "Late", "Excused"];

    // Filter attendance
    const filtered = attendance.filter((rec) => {
        const courseMatch = filterCourse === "All" || rec.course === filterCourse;
        const statusMatch = filterStatus === "All" || rec.status === filterStatus;
        return courseMatch && statusMatch;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Summary stats
    const totalSessions = filtered.length;
    const presentCount = filtered.filter((rec) => rec.status === "Present").length;
    const absentCount = filtered.filter((rec) => rec.status === "Absent").length;
    const lateCount = filtered.filter((rec) => rec.status === "Late").length;
    const excusedCount = filtered.filter((rec) => rec.status === "Excused").length;
    const attendanceRate = totalSessions > 0 ? ((presentCount + lateCount) / totalSessions) * 100 : 0;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
                        <p className="text-gray-600 mt-1">Track your class attendance and presence</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {attendance.length} Records
                    </Badge>
                </div>

                {/* Summary Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Calendar className="w-6 h-6 text-indigo-200" />
                                <div className="text-indigo-200 text-sm font-medium">Total Sessions</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalSessions}</div>
                            <div className="text-indigo-200 text-sm">Classes Tracked</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Present</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{presentCount}</div>
                            <div className="text-green-200 text-sm">On Time</div>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <XCircle className="w-6 h-6 text-red-200" />
                                <div className="text-red-200 text-sm font-medium">Absent</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{absentCount}</div>
                            <div className="text-red-200 text-sm">Missed Classes</div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-amber-200" />
                                <div className="text-amber-200 text-sm font-medium">Late</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{lateCount}</div>
                            <div className="text-amber-200 text-sm">Delayed Arrivals</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <UserCheck className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Attendance Rate</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{attendanceRate.toFixed(1)}%</div>
                            <div className="text-blue-200 text-sm">Overall</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <label className="font-medium text-gray-700">Filter by:</label>
                            </div>
                            <select
                                value={filterCourse}
                                onChange={(e) => {
                                    setFilterCourse(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Courses</option>
                                {courses.map((course) => (
                                    <option key={course} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {filtered.length} records
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Attendance Records */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : paged.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                No attendance records match your current filters. Try adjusting your selection.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Course</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Instructor</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paged.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">
                                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className="text-sm text-gray-500">{record.time}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{record.course}</span>
                                                        <span className="text-sm text-gray-500">{record.courseCode}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-gray-700">{record.instructor}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge status={record.status} />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-gray-600 text-sm italic">
                                                        {record.remarks || "No remarks"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} records
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                className={`p-2 rounded-lg border transition-all duration-200 ${currentPage === 1
                                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                                    : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                                    }`}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === pageNum
                                                                ? "bg-indigo-600 text-white border border-indigo-600"
                                                                : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                className={`p-2 rounded-lg border transition-all duration-200 ${currentPage === totalPages
                                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                                    : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                                    }`}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}