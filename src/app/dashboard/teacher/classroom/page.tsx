"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Users, 
    BookOpen, 
    PlusCircle, 
    ChevronDown, 
    ChevronUp,
    Search,
    Filter,
    Download,
    ArrowLeft,
    Edit,
    MoreVertical,
    UserCheck,
    UserX,
    GraduationCap,
    Building
} from "lucide-react";

type Classroom = {
    id: string;
    name: string;
    grade: string;
    studentsCount: number;
    subjects: string[];
    status: "Active" | "Inactive";
    teacher: string;
    roomNumber: string;
    schedule: string;
    academicYear: string;
};

const dummyClassrooms: Classroom[] = [
    {
        id: "c1",
        name: "Mathematics 101",
        grade: "Grade 10",
        studentsCount: 28,
        subjects: ["Algebra", "Geometry", "Calculus"],
        status: "Active",
        teacher: "Dr. Sarah Johnson",
        roomNumber: "Room 201",
        schedule: "Mon, Wed, Fri - 9:00 AM",
        academicYear: "2024-2025"
    },
    {
        id: "c2",
        name: "Science 9A",
        grade: "Grade 9",
        studentsCount: 25,
        subjects: ["Biology", "Chemistry", "Physics"],
        status: "Active",
        teacher: "Mr. David Chen",
        roomNumber: "Lab 105",
        schedule: "Tue, Thu - 10:30 AM",
        academicYear: "2024-2025"
    },
    {
        id: "c3",
        name: "History 11B",
        grade: "Grade 11",
        studentsCount: 20,
        subjects: ["World History", "Geography"],
        status: "Inactive",
        teacher: "Ms. Maria Garcia",
        roomNumber: "Room 315",
        schedule: "Mon, Wed - 1:00 PM",
        academicYear: "2023-2024"
    },
    {
        id: "c4",
        name: "English Literature",
        grade: "Grade 12",
        studentsCount: 22,
        subjects: ["Literature", "Creative Writing"],
        status: "Active",
        teacher: "Dr. Robert Wilson",
        roomNumber: "Room 118",
        schedule: "Tue, Thu, Fri - 11:00 AM",
        academicYear: "2024-2025"
    },
    {
        id: "c5",
        name: "Computer Science",
        grade: "Grade 11",
        studentsCount: 18,
        subjects: ["Programming", "Data Structures"],
        status: "Active",
        teacher: "Ms. Lisa Park",
        roomNumber: "Lab 203",
        schedule: "Mon, Wed - 2:00 PM",
        academicYear: "2024-2025"
    },
];

const PAGE_SIZE = 8;

type SortKey = "name" | "grade" | "studentsCount" | "status" | "teacher" | null;
type SortDirection = "asc" | "desc";

export default function ClassroomManagementPage() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & search
    const [filterGrade, setFilterGrade] = useState<string>("All");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [filterYear, setFilterYear] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Sorting & pagination
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setClassrooms(dummyClassrooms);
            setLoading(false);
        }, 800);
    }, []);

    // Unique values for filter dropdowns
    const uniqueGrades = useMemo(() => {
        const grades = classrooms.map((c) => c.grade);
        return ["All Grades", ...Array.from(new Set(grades)).sort()];
    }, [classrooms]);

    const uniqueYears = useMemo(() => {
        const years = classrooms.map((c) => c.academicYear);
        return ["All Years", ...Array.from(new Set(years)).sort()];
    }, [classrooms]);

    const filteredClassrooms = useMemo(() => {
        let filtered = classrooms;

        if (filterGrade !== "All Grades") {
            filtered = filtered.filter((c) => c.grade === filterGrade);
        }

        if (filterStatus !== "All") {
            filtered = filtered.filter((c) => c.status === filterStatus);
        }

        if (filterYear !== "All Years") {
            filtered = filtered.filter((c) => c.academicYear === filterYear);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((c) => 
                c.name.toLowerCase().includes(term) ||
                c.teacher.toLowerCase().includes(term) ||
                c.roomNumber.toLowerCase().includes(term) ||
                c.subjects.some(subject => subject.toLowerCase().includes(term))
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "name") comp = a.name.localeCompare(b.name);
                else if (sortKey === "grade") comp = a.grade.localeCompare(b.grade);
                else if (sortKey === "studentsCount") comp = a.studentsCount - b.studentsCount;
                else if (sortKey === "status") comp = a.status.localeCompare(b.status);
                else if (sortKey === "teacher") comp = a.teacher.localeCompare(b.teacher);

                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [classrooms, filterGrade, filterStatus, filterYear, searchTerm, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredClassrooms.length / PAGE_SIZE);
    const paginatedClassrooms = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredClassrooms.slice(start, start + PAGE_SIZE);
    }, [filteredClassrooms, currentPage]);

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

    // Summary stats for cards
    const totalClassrooms = classrooms.length;
    const activeClassrooms = classrooms.filter((c) => c.status === "Active").length;
    const inactiveClassrooms = classrooms.filter((c) => c.status === "Inactive").length;
    const totalStudents = classrooms.reduce((sum, c) => sum + c.studentsCount, 0);
    const averageClassSize = Math.round(totalStudents / totalClassrooms);

    return (
        <DashboardLayout>
            <section className="p-6 w-full mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Building className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
                        </div>
                        <p className="text-gray-600">
                            Manage classrooms, track student enrollment, and organize academic schedules
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add Classroom
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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Total Classrooms</p>
                                    <p className="text-3xl font-bold text-indigo-900">{totalClassrooms}</p>
                                </div>
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <Building className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Active Classrooms</p>
                                    <p className="text-3xl font-bold text-green-900">{activeClassrooms}</p>
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
                                    <p className="text-sm font-medium text-red-600 mb-1">Inactive Classrooms</p>
                                    <p className="text-3xl font-bold text-red-900">{inactiveClassrooms}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <UserX className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600 mb-1">Total Students</p>
                                    <p className="text-3xl font-bold text-yellow-900">{totalStudents}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <Users className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Avg Class Size</p>
                                    <p className="text-3xl font-bold text-blue-900">{averageClassSize}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <GraduationCap className="h-6 w-6 text-blue-600" />
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
                                        value={filterGrade}
                                        onChange={(e) => {
                                            setFilterGrade(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {uniqueGrades.map((grade) => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                                    value={filterYear}
                                    onChange={(e) => {
                                        setFilterYear(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {uniqueYears.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search by class name, teacher, room, or subject..."
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

                {/* Classrooms Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading classrooms...</p>
                            </div>
                        ) : filteredClassrooms.length === 0 ? (
                            <div className="text-center py-12">
                                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No classrooms found</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {searchTerm || filterGrade !== "All Grades" || filterStatus !== "All" || filterYear !== "All Years"
                                        ? "No classrooms match your current filters." 
                                        : "No classrooms available."
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
                                                    { key: "name", label: "Class Details", width: "w-2/6" },
                                                    { key: "grade", label: "Grade", width: "w-1/12" },
                                                    { key: "teacher", label: "Teacher", width: "w-1/6" },
                                                    { key: "studentsCount", label: "Students", width: "w-1/12" },
                                                    { key: "subjects", label: "Subjects", width: "w-1/6" },
                                                    { key: "status", label: "Status", width: "w-1/12" },
                                                    { key: "actions", label: "", width: "w-1/12" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => key !== "subjects" && key !== "actions" ? toggleSort(key as SortKey) : undefined}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 ${width} ${
                                                            key !== "subjects" && key !== "actions" 
                                                                ? "cursor-pointer hover:bg-gray-100 transition-colors" 
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {key !== "subjects" && key !== "actions" && sortKey === key && (
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
                                            {paginatedClassrooms.map((classroom) => (
                                                <tr 
                                                    key={classroom.id} 
                                                    className="hover:bg-gray-50 transition-colors group"
                                                >
                                                    <td className="p-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{classroom.name}</p>
                                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                                <span>{classroom.roomNumber}</span>
                                                                <span>•</span>
                                                                <span>{classroom.schedule}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {classroom.academicYear}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-900">{classroom.grade}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{classroom.teacher}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <span className="font-semibold text-gray-900">
                                                                {classroom.studentsCount}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {classroom.subjects.map((subject, index) => (
                                                                <Badge 
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                                                >
                                                                    {subject}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge 
                                                            variant={classroom.status === "Active" ? "default" : "secondary"}
                                                            className={classroom.status === "Active" 
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                                                : "bg-red-100 text-red-800 hover:bg-red-100"
                                                            }
                                                        >
                                                            {classroom.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                                Edit
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pageCount > 1 && (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-gray-50/50">
                                        <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredClassrooms.length)} of {filteredClassrooms.length} classrooms
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