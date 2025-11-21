"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    CheckSquare, 
    Search, 
    ChevronDown, 
    ChevronUp, 
    Users,
    UserCheck,
    UserX,
    Calendar,
    Filter,
    Download,
    ArrowLeft,
    Save,
    MoreVertical
} from "lucide-react";

// Helper to generate dummy students for each course
function generateDummyStudents(courseId: string, count: number) {
    const firstNames = [
        "Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George", "Hannah",
        "Ian", "Julia", "Kevin", "Laura", "Mike", "Nina", "Oscar", "Pam", "Quinn",
        "Rachel", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zane",
    ];
    const lastNames = [
        "Johnson", "Smith", "Lee", "White", "Brown", "Davis", "Wilson", "Moore",
        "Taylor", "Anderson", "Thomas", "Jackson", "Martin", "Thompson", "Garcia",
        "Martinez", "Robinson", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young",
        "King", "Wright", "Scott",
    ];

    const students = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 7) % lastNames.length];
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const phone = `+1 (555) 123-${(1000 + i).toString().padStart(4, "0")}`;
        students.push({ id: `${courseId}-stu${i + 1}`, fullName, email, phone });
    }
    return students;
}

// Dummy courses array
const dummyCourses = [
    { id: "course1", code: "ENG101", name: "English Literature", semester: 1 },
    { id: "course2", code: "HIST202", name: "Modern History", semester: 2 },
    { id: "course3", code: "PHYS150", name: "Intro to Physics", semester: 1 },
];

// Generate dummy students for all courses
const dummyStudentsByCourseId: Record<
    string,
    { id: string; fullName: string; email: string; phone: string }[]
> = {
    course1: generateDummyStudents("course1", 25),
    course2: generateDummyStudents("course2", 25),
    course3: generateDummyStudents("course3", 25),
};

const PAGE_SIZE = 12;

type SortKey = "fullName" | "email" | "phone" | null;
type SortDirection = "asc" | "desc";

export default function AttendancePage() {
    const params = useParams();
    const router = useRouter();

    const rawId = params.id;
    const initialCourseId = Array.isArray(rawId) ? rawId[0] : rawId ?? dummyCourses[0].id;

    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [students, setStudents] = useState<typeof dummyStudentsByCourseId[string]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLoading(true);
        setError(null);
        setStudents([]);
        setSearchTerm("");
        setCurrentPage(1);
        setSortKey(null);

        const timeoutId = setTimeout(() => {
            if (!selectedCourseId || !dummyStudentsByCourseId[selectedCourseId]) {
                setError("Invalid or unknown course ID.");
                setLoading(false);
                return;
            }
            const loadedStudents = dummyStudentsByCourseId[selectedCourseId];
            setStudents(loadedStudents);

            // Initialize attendance with some random present students for demo
            const initialAttendance: Record<string, boolean> = {};
            loadedStudents.forEach((s, index) => {
                initialAttendance[s.id] = index % 4 !== 0; // 75% present for demo
            });
            setAttendance(initialAttendance);

            setLoading(false);
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [selectedCourseId]);

    // Filtering
    const filteredStudents = useMemo(() => {
        if (!searchTerm.trim()) return students;
        const lower = searchTerm.toLowerCase();
        return students.filter(
            (s) =>
                s.fullName.toLowerCase().includes(lower) ||
                s.email.toLowerCase().includes(lower) ||
                s.phone.toLowerCase().includes(lower)
        );
    }, [students, searchTerm]);

    // Sorting
    const sortedStudents = useMemo(() => {
        if (!sortKey) return filteredStudents;
        return [...filteredStudents].sort((a, b) => {
            const aVal = a[sortKey]!;
            const bVal = b[sortKey]!;

            const aStr = aVal.toString().toLowerCase();
            const bStr = bVal.toString().toLowerCase();
            if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
            if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredStudents, sortKey, sortDirection]);

    const pageCount = Math.ceil(sortedStudents.length / PAGE_SIZE);
    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return sortedStudents.slice(start, start + PAGE_SIZE);
    }, [sortedStudents, currentPage]);

    function onSort(key: SortKey) {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDirection("asc");
        } else if (sortDirection === "asc") {
            setSortDirection("desc");
        } else {
            setSortKey(null);
            setSortDirection("asc");
        }
    }

    function handleCourseChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newId = e.target.value;
        setSelectedCourseId(newId);
        router.replace(`/dashboard/teacher/attendance/${newId}`);
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    function toggleAttendance(studentId: string) {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    }

    function markAllPresent() {
        const newAttendance: Record<string, boolean> = {};
        students.forEach(student => {
            newAttendance[student.id] = true;
        });
        setAttendance(newAttendance);
    }

    function markAllAbsent() {
        const newAttendance: Record<string, boolean> = {};
        students.forEach(student => {
            newAttendance[student.id] = false;
        });
        setAttendance(newAttendance);
    }

    function saveAttendance() {
        const presentCount = Object.values(attendance).filter(Boolean).length;
        const absentCount = students.length - presentCount;
        const attendanceRate = ((presentCount / students.length) * 100).toFixed(1);
        
        alert(`Attendance saved for ${attendanceDate}!\n\nPresent: ${presentCount}\nAbsent: ${absentCount}\nAttendance Rate: ${attendanceRate}%`);
    }

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = students.length - presentCount;
    const attendanceRate = students.length > 0 ? (presentCount / students.length) * 100 : 0;
    const selectedCourse = dummyCourses.find(course => course.id === selectedCourseId);

    return (
        <DashboardLayout>
            <section className="p-6 w-full mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <CheckSquare className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
                        </div>
                        <p className="text-gray-600">
                            {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : "Track and manage student attendance"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Total Students</p>
                                    <p className="text-3xl font-bold text-indigo-900">{students.length}</p>
                                </div>
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <Users className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Present Today</p>
                                    <p className="text-3xl font-bold text-green-900">{presentCount}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <UserCheck className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600 mb-1">Absent Today</p>
                                    <p className="text-3xl font-bold text-red-900">{absentCount}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <UserX className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Attendance Rate</p>
                                    <p className="text-3xl font-bold text-blue-900">{attendanceRate.toFixed(1)}%</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <CheckSquare className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">Date</p>
                                    <p className="text-lg font-bold text-purple-900">
                                        {new Date(attendanceDate).toLocaleDateString('en-US', { 
                                            weekday: 'short',
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Calendar className="h-6 w-6 text-purple-600" />
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
                                    <label htmlFor="course-select" className="font-semibold text-gray-700 whitespace-nowrap text-sm">
                                        Select Course:
                                    </label>
                                    <select
                                        id="course-select"
                                        value={selectedCourseId}
                                        onChange={handleCourseChange}
                                        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[250px]"
                                    >
                                        {dummyCourses.map(({ id, code, name, semester }) => (
                                            <option key={id} value={id}>
                                                {code} - {name} (Semester {semester})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="attendance-date" className="font-semibold text-gray-700 whitespace-nowrap text-sm">
                                        Date:
                                    </label>
                                    <Input
                                        type="date"
                                        id="attendance-date"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                        className="min-w-[150px]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative max-w-md w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="search"
                                        placeholder="Search by student name or email..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                <div className="flex flex-wrap gap-3 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={markAllPresent}
                            className="flex items-center gap-2"
                        >
                            <UserCheck className="h-4 w-4" />
                            Mark All Present
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={markAllAbsent}
                            className="flex items-center gap-2"
                        >
                            <UserX className="h-4 w-4" />
                            Mark All Absent
                        </Button>
                    </div>
                    <Button 
                        onClick={saveAttendance}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                        <Save className="h-4 w-4" />
                        Save Attendance
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Attendance Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading attendance data...</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {searchTerm 
                                        ? "No students match your search criteria." 
                                        : "No students enrolled in this course."
                                    }
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50/50">
                                                {[
                                                    { key: "fullName", label: "Student", width: "w-2/5" },
                                                    { key: "email", label: "Email", width: "w-1/4" },
                                                    { key: "phone", label: "Phone", width: "w-1/6" },
                                                    { key: "attendance", label: "Attendance Status", width: "w-1/6" },
                                                    { key: "actions", label: "", width: "w-1/12" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => key !== "attendance" && key !== "actions" ? onSort(key as SortKey) : undefined}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 ${width} ${
                                                            key !== "attendance" && key !== "actions" 
                                                                ? "cursor-pointer hover:bg-gray-100 transition-colors" 
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {key !== "attendance" && key !== "actions" && sortKey === key && (
                                                                sortDirection === "asc" ? 
                                                                <ChevronUp className="h-4 w-4" /> : 
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {paginatedStudents.map((student) => (
                                                <tr 
                                                    key={student.id} 
                                                    className="hover:bg-gray-50 transition-colors group"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                                                <span className="font-semibold text-indigo-600 text-sm">
                                                                    {student.fullName.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{student.fullName}</p>
                                                                <p className="text-sm text-gray-500">ID: {student.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{student.email}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{student.phone}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={attendance[student.id] || false}
                                                                    onChange={() => toggleAttendance(student.id)}
                                                                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                                                />
                                                                <span className={`text-sm font-medium ${
                                                                    attendance[student.id] ? 'text-green-700' : 'text-gray-700'
                                                                }`}>
                                                                    {attendance[student.id] ? 'Present' : 'Absent'}
                                                                </span>
                                                            </label>
                                                            {attendance[student.id] ? (
                                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                    Present
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                                    Absent
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pageCount > 1 && (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-gray-50/50">
                                        <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length} students
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