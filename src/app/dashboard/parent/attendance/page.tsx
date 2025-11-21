"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Clock, XCircle, Calendar, BookOpen, Users, TrendingUp } from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | "excused" | "none";

interface StudentAttendance {
    studentId: string;
    fullName: string;
    grade: string;
    attendanceStatus: AttendanceStatus;
    lastUpdated: string;
    period?: string;
}

interface Course {
    id: string;
    name: string;
    code: string;
    teacher: string;
    schedule: string;
}

const dummyCourses: Course[] = [
    { id: "course-uuid-1", name: "Computer Science 101", code: "CS101", teacher: "Dr. Smith", schedule: "Mon, Wed, Fri 9:00 AM" },
    { id: "course-uuid-2", name: "Mathematics 101", code: "MATH101", teacher: "Ms. Johnson", schedule: "Tue, Thu 10:30 AM" },
    { id: "course-uuid-3", name: "English Literature", code: "ENG201", teacher: "Mr. Davis", schedule: "Mon, Wed 1:00 PM" },
];

function StatusBadge({ status }: { status: AttendanceStatus }) {
    const baseClasses = "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border";
    
    switch (status) {
        case "present":
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}>
                    <CheckCircle2 size={14} />
                    Present
                </span>
            );
        case "absent":
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>
                    <XCircle size={14} />
                    Absent
                </span>
            );
        case "late":
            return (
                <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`}>
                    <Clock size={14} />
                    Late
                </span>
            );
        case "excused":
            return (
                <span className={`${baseClasses} bg-blue-100 text-blue-800 border-blue-200`}>
                    <CheckCircle2 size={14} />
                    Excused
                </span>
            );
        default:
            return (
                <span className={`${baseClasses} bg-gray-100 text-gray-600 border-gray-200`}>
                    Not Recorded
                </span>
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
    const [timeRange, setTimeRange] = useState<string>("today");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        setTimeout(() => {
            try {
                const dummyStudents: StudentAttendance[] = [
                    { 
                        studentId: "stu-1", 
                        fullName: "Ayaan Omer", 
                        grade: "Grade 5",
                        attendanceStatus: "present",
                        lastUpdated: new Date().toISOString(),
                        period: "Morning"
                    },
                    { 
                        studentId: "stu-2", 
                        fullName: "Layla Omer", 
                        grade: "Grade 3",
                        attendanceStatus: "late",
                        lastUpdated: new Date().toISOString(),
                        period: "Morning"
                    },
                    { 
                        studentId: "stu-3", 
                        fullName: "John Smith", 
                        grade: "Grade 5",
                        attendanceStatus: "absent",
                        lastUpdated: new Date().toISOString(),
                        period: "Morning"
                    },
                    { 
                        studentId: "stu-4", 
                        fullName: "Sarah Johnson", 
                        grade: "Grade 3",
                        attendanceStatus: "present",
                        lastUpdated: new Date().toISOString(),
                        period: "Morning"
                    },
                ];
                setAttendance(dummyStudents);
                setLoading(false);
            } catch (err) {
                setError("Failed to load attendance data");
                setLoading(false);
            }
        }, 1000);
    }, [selectedCourseId, date, timeRange]);

    // Summary counts and calculations
    const presentCount = attendance.filter((a) => a.attendanceStatus === "present").length;
    const absentCount = attendance.filter((a) => a.attendanceStatus === "absent").length;
    const lateCount = attendance.filter((a) => a.attendanceStatus === "late").length;
    const excusedCount = attendance.filter((a) => a.attendanceStatus === "excused").length;
    
    const totalStudents = attendance.length;
    const attendanceRate = totalStudents > 0 ? ((presentCount + excusedCount) / totalStudents) * 100 : 0;
    
    const selectedCourse = dummyCourses.find(course => course.id === selectedCourseId);

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Attendance Tracker
                        </h1>
                        <p className="text-gray-600 mt-2">Monitor your children&apos;s class attendance and patterns</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-64">
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="bg-white border-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <SelectValue placeholder="Time Range" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="semester">This Semester</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Details</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-64">
                                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                        <SelectTrigger className="bg-white border-gray-300">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={16} />
                                                <SelectValue placeholder="Select Course" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dummyCourses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{course.code}</span>
                                                        <span className="text-sm text-gray-500">{course.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="w-full sm:w-48">
                                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white">
                                        <Calendar size={16} className="text-gray-400" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="flex-1 outline-none bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {selectedCourse && (
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                <h4 className="text-sm font-semibold text-indigo-900 mb-1">Course Info</h4>
                                <p className="text-sm text-indigo-700">{selectedCourse.teacher}</p>
                                <p className="text-xs text-indigo-600">{selectedCourse.schedule}</p>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Error Loading Data</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))
                    ) : (
                        <>
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Students</p>
                                        <p className="text-2xl font-bold mt-1">{totalStudents}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-200" />
                                </div>
                                <div className="mt-4 text-blue-100 text-sm">
                                    In class
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Present</p>
                                        <p className="text-2xl font-bold mt-1">{presentCount}</p>
                                    </div>
                                    <CheckCircle2 className="w-8 h-8 text-green-200" />
                                </div>
                                <div className="mt-4 text-green-100 text-sm">
                                    {totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}% of class
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-red-100 text-sm font-medium">Absent</p>
                                        <p className="text-2xl font-bold mt-1">{absentCount}</p>
                                    </div>
                                    <XCircle className="w-8 h-8 text-red-200" />
                                </div>
                                <div className="mt-4 text-red-100 text-sm">
                                    {totalStudents > 0 ? Math.round((absentCount / totalStudents) * 100) : 0}% of class
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-100 text-sm font-medium">Late</p>
                                        <p className="text-2xl font-bold mt-1">{lateCount}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-200" />
                                </div>
                                <div className="mt-4 text-yellow-100 text-sm">
                                    {totalStudents > 0 ? Math.round((lateCount / totalStudents) * 100) : 0}% of class
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">Attendance Rate</p>
                                        <p className="text-2xl font-bold mt-1">{attendanceRate.toFixed(1)}%</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-purple-200" />
                                </div>
                                <div className="mt-4 text-purple-100 text-sm">
                                    Overall rate
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Attendance Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Student Attendance {selectedCourse && `- ${selectedCourse.code}`}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {attendance.length} student{attendance.length !== 1 ? 's' : ''} • {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock size={14} />
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                                ))}
                            </div>
                        ) : attendance.length === 0 ? (
                            <div className="p-12 text-center">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h4>
                                <p className="text-gray-500">
                                    No attendance data available for the selected date and course.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Grade</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Period</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {attendance.map((student) => (
                                        <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{student.fullName}</span>
                                                    {student.fullName.includes("Omer") && (
                                                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded mt-1 inline-flex items-center gap-1 w-fit">
                                                            Your Child
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{student.grade}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700">{student.period || "Full Day"}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={student.attendanceStatus} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(student.lastUpdated).toLocaleTimeString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Additional Information */}
                {!loading && attendance.length > 0 && (
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-900 mb-3">Attendance Insights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <div>
                                <p>• Class attendance rate: <strong>{attendanceRate.toFixed(1)}%</strong></p>
                                <p>• Your children: {attendance.filter(s => s.fullName.includes("Omer")).map(s => `${s.fullName.split(' ')[0]} (${s.attendanceStatus})`).join(', ')}</p>
                            </div>
                            <div>
                                <p>• Most common status: <strong>Present ({presentCount} students)</strong></p>
                                <p>• Last updated: <strong>{new Date().toLocaleString()}</strong></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}