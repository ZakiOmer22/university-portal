"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  ArrowLeft,
  Filter,
  Download,
  MoreVertical
} from "lucide-react";

// Helper to generate dummy students for each course
function generateDummyStudents(courseId: string, count: number) {
    const firstNames = [
        "Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia",
        "Kevin", "Laura", "Mike", "Nina", "Oscar", "Pam", "Quinn", "Rachel", "Steve", "Tina",
    ];
    const lastNames = [
        "Johnson", "Smith", "Lee", "White", "Brown", "Davis", "Wilson", "Moore", "Taylor", "Anderson",
        "Thomas", "Jackson", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Lewis", "Walker",
    ];

    const students = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 7) % lastNames.length];
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const phone = `+1 (555) 123-${(1000 + i).toString().padStart(4, "0")}`;
        const enrollmentDate = new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
        ).toISOString().split("T")[0];
        const status = i % 5 === 0 ? "Inactive" : "Active";
        students.push({ 
            id: `${courseId}-stu${i + 1}`, 
            fullName, 
            email, 
            phone, 
            enrollmentDate, 
            status 
        });
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
    { id: string; fullName: string; email: string; phone: string; enrollmentDate: string; status: string }[]
> = {
    course1: generateDummyStudents("course1", 25),
    course2: generateDummyStudents("course2", 25),
    course3: generateDummyStudents("course3", 25),
};

const PAGE_SIZE = 10;

type SortKey = "fullName" | "email" | "phone" | "enrollmentDate" | "status" | null;
type SortDirection = "asc" | "desc";

export default function StudentsPage() {
    const params = useParams();
    const router = useRouter();

    const initialCourseId = Array.isArray(params.id) ? params.id[0] : (params.id ?? dummyCourses[0].id);
    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [students, setStudents] = useState<typeof dummyStudentsByCourseId[string]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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
            setStudents(dummyStudentsByCourseId[selectedCourseId]);
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
                s.phone.toLowerCase().includes(lower) ||
                s.status.toLowerCase().includes(lower)
        );
    }, [students, searchTerm]);

    // Sorting
    const sortedStudents = useMemo(() => {
        if (!sortKey) return filteredStudents;
        return [...filteredStudents].sort((a, b) => {
            const aVal = a[sortKey]!;
            const bVal = b[sortKey]!;

            if (sortKey === "enrollmentDate") {
                return sortDirection === "asc"
                    ? new Date(aVal).getTime() - new Date(bVal).getTime()
                    : new Date(bVal).getTime() - new Date(aVal).getTime();
            }

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
        router.replace(`/dashboard/teacher/students/${newId}`);
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    const selectedCourse = dummyCourses.find(course => course.id === selectedCourseId);

    return (
        <DashboardLayout>
            <section className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
                        </div>
                        <p className="text-gray-600">
                            {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : "Manage student enrollments and information"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button 
                            onClick={() => router.back()}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    <p className="text-sm font-medium text-green-600 mb-1">Active Students</p>
                                    <p className="text-3xl font-bold text-green-900">
                                        {students.filter(s => s.status === "Active").length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Filtered Results</p>
                                    <p className="text-3xl font-bold text-blue-900">{filteredStudents.length}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Filter className="h-6 w-6 text-blue-600" />
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
                            </div>

                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search students by name, email, phone, or status..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 pr-4 py-2.5 w-full"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Table Section */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {searchTerm ? "No students match your search criteria." : "No students are enrolled in this course."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50/50">
                                                {[
                                                    { key: "fullName", label: "Student Name", width: "w-1/4" },
                                                    { key: "email", label: "Email Address", width: "w-1/4" },
                                                    { key: "phone", label: "Phone", width: "w-1/6" },
                                                    { key: "enrollmentDate", label: "Enrollment Date", width: "w-1/6" },
                                                    { key: "status", label: "Status", width: "w-1/6" },
                                                    { key: "actions", label: "Actions", width: "w-1/6" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => key !== "actions" && onSort(key as SortKey)}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 ${width} ${
                                                            key !== "actions" ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {key !== "actions" && sortKey === key && (
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
                                            {paginatedStudents.map(({ id, fullName, email, phone, enrollmentDate, status }) => (
                                                <tr 
                                                    key={id} 
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                                    onClick={() => alert(`Open student details page for ${fullName} (ID: ${id})`)}
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                                                <span className="font-semibold text-indigo-600 text-sm">
                                                                    {fullName.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{fullName}</p>
                                                                <p className="text-sm text-gray-500">ID: {id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-900">{email}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{phone}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{enrollmentDate}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge 
                                                            variant={status === "Active" ? "default" : "secondary"}
                                                            className={status === "Active" 
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                            }
                                                        >
                                                            {status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex items-center gap-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    alert(`Message sent to ${fullName} (${email})`);
                                                                }}
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                                Message
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={(e) => e.stopPropagation()}
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
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-gray-50/50">
                                    <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                                        Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, sortedStudents.length)} of {sortedStudents.length} students
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
                                            {pageCount > 5 && <span className="px-2">...</span>}
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
                            </>
                        )}
                    </CardContent>
                </Card>
            </section>
        </DashboardLayout>
    );
}