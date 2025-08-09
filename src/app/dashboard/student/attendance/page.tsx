"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";

interface AttendanceRecord {
    id: string;
    date: string; // ISO date string
    course: string;
    status: "Present" | "Absent" | "Late" | "Excused";
    remarks?: string;
}

const dummyAttendanceRecords: AttendanceRecord[] = [
    { id: "a1", date: "2025-08-01", course: "Mathematics", status: "Present" },
    { id: "a2", date: "2025-08-02", course: "Physics", status: "Absent", remarks: "Sick" },
    { id: "a3", date: "2025-08-03", course: "Chemistry", status: "Late", remarks: "Bus delay" },
    { id: "a4", date: "2025-08-04", course: "Biology", status: "Present" },
    { id: "a5", date: "2025-08-05", course: "Computer Science", status: "Present" },
    { id: "a6", date: "2025-08-06", course: "Mathematics", status: "Excused", remarks: "Family event" },
    { id: "a7", date: "2025-08-07", course: "Physics", status: "Present" },
    { id: "a8", date: "2025-08-08", course: "Chemistry", status: "Present" },
    { id: "a9", date: "2025-08-09", course: "Biology", status: "Absent" },
    { id: "a10", date: "2025-08-10", course: "Computer Science", status: "Present" },
    { id: "a11", date: "2025-08-11", course: "Mathematics", status: "Present" },
    { id: "a12", date: "2025-08-12", course: "Physics", status: "Late", remarks: "Traffic jam" },
    { id: "a13", date: "2025-08-13", course: "Chemistry", status: "Present" },
    { id: "a14", date: "2025-08-14", course: "Biology", status: "Present" },
    { id: "a15", date: "2025-08-15", course: "Computer Science", status: "Absent", remarks: "Sick" },
    { id: "a16", date: "2025-08-16", course: "Mathematics", status: "Present" },
    { id: "a17", date: "2025-08-17", course: "Physics", status: "Present" },
    { id: "a18", date: "2025-08-18", course: "Chemistry", status: "Excused", remarks: "Doctor appointment" },
    { id: "a19", date: "2025-08-19", course: "Biology", status: "Present" },
    { id: "a20", date: "2025-08-20", course: "Computer Science", status: "Present" },
];

// Constants
const ITEMS_PER_PAGE = 7;

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterCourse, setFilterCourse] = useState("All");

    // Load data (simulate API call)
    useEffect(() => {
        setTimeout(() => {
            setAttendance(dummyAttendanceRecords);
            setLoading(false);
        }, 800);
    }, []);

    // Get unique courses for filter dropdown
    const courses = Array.from(new Set(dummyAttendanceRecords.map((rec) => rec.course))).sort();

    // Filter attendance by course
    const filtered = filterCourse === "All" ? attendance : attendance.filter((rec) => rec.course === filterCourse);

    // Pagination calculation
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Summary stats
    const totalSessions = filtered.length;
    const presentCount = filtered.filter((rec) => rec.status === "Present").length;
    const absentCount = filtered.filter((rec) => rec.status === "Absent").length;
    const lateCount = filtered.filter((rec) => rec.status === "Late").length;
    const excusedCount = filtered.filter((rec) => rec.status === "Excused").length;

    if (loading) {
        return (
            <DashboardLayout loading={true} user={null}>
                <p className="text-center mt-20 text-gray-600 text-lg">Loading attendance records...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={null}>
            <section className="max-w-6xl mx-auto bg-white rounded shadow p-8 mt-10">
                <h1 className="text-3xl font-bold mb-6 text-indigo-900">Attendance Records</h1>

                {/* Filters */}
                <div className="mb-6 flex items-center gap-4">
                    <label htmlFor="courseFilter" className="font-semibold text-indigo-900">
                        Filter by Course:
                    </label>
                    <select
                        id="courseFilter"
                        value={filterCourse}
                        onChange={(e) => {
                            setFilterCourse(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="All">All Courses</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-indigo-100 rounded py-3 font-semibold text-indigo-900">
                        Total Sessions
                        <div className="text-2xl mt-1">{totalSessions}</div>
                    </div>
                    <div className="bg-green-100 rounded py-3 font-semibold text-green-900">
                        Present
                        <div className="text-2xl mt-1">{presentCount}</div>
                    </div>
                    <div className="bg-red-100 rounded py-3 font-semibold text-red-900">
                        Absent
                        <div className="text-2xl mt-1">{absentCount}</div>
                    </div>
                    <div className="bg-yellow-100 rounded py-3 font-semibold text-yellow-900">
                        Late
                        <div className="text-2xl mt-1">{lateCount}</div>
                    </div>
                    <div className="bg-blue-100 rounded py-3 font-semibold text-blue-900 col-span-2 sm:col-span-1">
                        Excused
                        <div className="text-2xl mt-1">{excusedCount}</div>
                    </div>
                </div>

                {/* Attendance Table */}
                <table className="w-full border-collapse border border-gray-300 text-gray-800">
                    <thead>
                        <tr className="bg-indigo-50 text-indigo-900">
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Course</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center p-4 italic text-gray-500">
                                    No attendance records found.
                                </td>
                            </tr>
                        ) : (
                            paged.map((rec) => (
                                <tr key={rec.id} className="hover:bg-indigo-50 transition-colors">
                                    <td className="border border-gray-300 px-4 py-2">{new Date(rec.date).toLocaleDateString()}</td>
                                    <td className="border border-gray-300 px-4 py-2">{rec.course}</td>
                                    <td
                                        className={`border border-gray-300 px-4 py-2 text-center font-semibold ${rec.status === "Present"
                                                ? "text-green-700"
                                                : rec.status === "Absent"
                                                    ? "text-red-700"
                                                    : rec.status === "Late"
                                                        ? "text-yellow-700"
                                                        : "text-blue-700"
                                            }`}
                                    >
                                        {rec.status}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 italic text-gray-600">
                                        {rec.remarks ?? "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={`px-4 py-2 rounded border ${currentPage === 1
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                }`}
                        >
                            Prev
                        </button>
                        <span className="font-semibold text-indigo-900">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={`px-4 py-2 rounded border ${currentPage === totalPages
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
