"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | "none";

interface StudentAttendance {
    studentId: string;
    fullName: string;
    attendanceStatus: AttendanceStatus;
}

interface Course {
    id: string;
    name: string;
    code: string;
}

const dummyCourses: Course[] = [
    { id: "course-uuid-1", name: "Computer Science 101", code: "CS101" },
    { id: "course-uuid-2", name: "Mathematics 101", code: "MATH101" },
];

function statusBadge(status: AttendanceStatus) {
    switch (status) {
        case "present":
            return (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Present
                </Badge>
            );
        case "absent":
            return (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                    <XCircle size={14} />
                    Absent
                </Badge>
            );
        case "late":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <Clock size={14} />
                    Late
                </Badge>
            );
        default:
            return (
                <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1">
                    N/A
                </Badge>
            );
    }
}

export default function AttendancePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    const [selectedCourseId, setSelectedCourseId] = useState<string>(dummyCourses[0].id);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [attendance, setAttendance] = useState<StudentAttendance[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);
    // Fetch attendance for course + date
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        setTimeout(() => {
            // Replace with real API fetch here
            const dummyStudents: StudentAttendance[] = [
                { studentId: "stu-1", fullName: "John Doe", attendanceStatus: "present" },
                { studentId: "stu-2", fullName: "Jane Smith", attendanceStatus: "absent" },
                { studentId: "stu-3", fullName: "Bob Johnson", attendanceStatus: "late" },
            ];
            setAttendance(dummyStudents);
            setLoading(false);
        }, 1000);
    }, [selectedCourseId, date]);

    // Summary counts
    const presentCount = attendance.filter((a) => a.attendanceStatus === "present").length;
    const absentCount = attendance.filter((a) => a.attendanceStatus === "absent").length;
    const lateCount = attendance.filter((a) => a.attendanceStatus === "late").length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Header & Course/Date selectors */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900">Attendance Record</h2>
                        <p className="text-gray-600">View student attendance for your child’s courses.</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Course selector */}
                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {dummyCourses.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.code} - {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Date picker */}
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Summary cards */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="text-sm font-semibold text-green-900">Present</h3>
                            <p className="text-xl font-bold">{presentCount}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h3 className="text-sm font-semibold text-red-900">Absent</h3>
                            <p className="text-xl font-bold">{absentCount}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="text-sm font-semibold text-yellow-900">Late</h3>
                            <p className="text-xl font-bold">{lateCount}</p>
                        </div>
                    </div>
                )}

                {/* Attendance Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <Skeleton className="h-40 w-full rounded-lg" />
                    ) : attendance.length === 0 ? (
                        <p className="text-center text-gray-500 italic">No attendance records found.</p>
                    ) : (
                        <table className="min-w-full border border-indigo-200 rounded-lg overflow-hidden">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-indigo-900 border-b">Student Name</th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-indigo-900 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map(({ studentId, fullName, attendanceStatus }) => (
                                    <tr key={studentId} className="hover:bg-indigo-50">
                                        <td className="px-4 py-2 border-b">{fullName}</td>
                                        <td className="px-4 py-2 border-b text-center">{statusBadge(attendanceStatus)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </DashboardLayout>
    );
}
