"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Users, 
    BarChart3, 
    ArrowUp, 
    ArrowDown, 
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Target,
    Award,
    ArrowLeft,
    Download,
    MoreVertical
} from "lucide-react";

type GradeEntry = {
    id: string;
    studentName: string;
    subject: string;
    className: string;
    grade: number;
    status: "Pass" | "Fail";
};

// Enhanced sample data
const dummyGrades: GradeEntry[] = [
    { id: "1", studentName: "Alice Johnson", subject: "Mathematics", className: "Math 101", grade: 92, status: "Pass" },
    { id: "2", studentName: "Bob Smith", subject: "Physics", className: "Physics A", grade: 75, status: "Pass" },
    { id: "3", studentName: "Charlie Davis", subject: "Chemistry", className: "Chemistry 1", grade: 58, status: "Fail" },
    { id: "4", studentName: "Diana Evans", subject: "Mathematics", className: "Math 101", grade: 87, status: "Pass" },
    { id: "5", studentName: "Ethan Brown", subject: "Physics", className: "Physics A", grade: 63, status: "Pass" },
    { id: "6", studentName: "Fiona Green", subject: "Chemistry", className: "Chemistry 1", grade: 45, status: "Fail" },
    { id: "7", studentName: "George Wilson", subject: "Biology", className: "Biology Lab", grade: 88, status: "Pass" },
    { id: "8", studentName: "Hannah Martinez", subject: "Mathematics", className: "Math 101", grade: 94, status: "Pass" },
    { id: "9", studentName: "Ian Thompson", subject: "Physics", className: "Physics A", grade: 72, status: "Pass" },
    { id: "10", studentName: "Julia Roberts", subject: "Biology", className: "Biology Lab", grade: 81, status: "Pass" },
    { id: "11", studentName: "Kevin Zhang", subject: "Chemistry", className: "Chemistry 1", grade: 67, status: "Pass" },
    { id: "12", studentName: "Lisa Park", subject: "Mathematics", className: "Math 101", grade: 79, status: "Pass" },
];

const PAGE_SIZE = 12;

type SortKey = "studentName" | "subject" | "grade" | "status" | "className" | null;
type SortDirection = "asc" | "desc";

function getGradeColor(grade: number) {
    if (grade >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (grade >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (grade >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (grade >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
}

function getGradeLabel(grade: number) {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
}

export default function GradebookPage() {
    const [grades, setGrades] = useState<GradeEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState("All Classes");
    const [selectedSubject, setSelectedSubject] = useState("All Subjects");

    // Sorting
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDirection>("asc");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setGrades(dummyGrades);
            setLoading(false);
        }, 800);
    }, []);

    // Extract unique options for filters
    const classOptions = useMemo(() => {
        const classes = new Set(grades.map((g) => g.className));
        return ["All Classes", ...Array.from(classes).sort()];
    }, [grades]);

    const subjectOptions = useMemo(() => {
        const subjects = new Set(grades.map((g) => g.subject));
        return ["All Subjects", ...Array.from(subjects).sort()];
    }, [grades]);

    // Filtered & sorted grades
    const filteredGrades = useMemo(() => {
        let filtered = grades;

        if (selectedClass !== "All Classes") {
            filtered = filtered.filter((g) => g.className === selectedClass);
        }

        if (selectedSubject !== "All Subjects") {
            filtered = filtered.filter((g) => g.subject === selectedSubject);
        }

        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (g) =>
                    g.studentName.toLowerCase().includes(term) ||
                    g.subject.toLowerCase().includes(term) ||
                    g.className.toLowerCase().includes(term)
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "studentName") {
                    comp = a.studentName.localeCompare(b.studentName);
                } else if (sortKey === "subject") {
                    comp = a.subject.localeCompare(b.subject);
                } else if (sortKey === "grade") {
                    comp = a.grade - b.grade;
                } else if (sortKey === "status") {
                    comp = a.status.localeCompare(b.status);
                } else if (sortKey === "className") {
                    comp = a.className.localeCompare(b.className);
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [grades, searchTerm, selectedClass, selectedSubject, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredGrades.length / PAGE_SIZE);
    const paginatedGrades = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredGrades.slice(start, start + PAGE_SIZE);
    }, [filteredGrades, currentPage]);

    // Summary stats - reflect filtered grades
    const totalStudents = new Set(filteredGrades.map((g) => g.studentName)).size;
    const avgGrade = filteredGrades.reduce((sum, g) => sum + g.grade, 0) / (filteredGrades.length || 1);
    const highestGrade = filteredGrades.reduce((max, g) => (g.grade > max ? g.grade : max), 0);
    const lowestGrade = filteredGrades.reduce((min, g) => (g.grade < min ? g.grade : min), 100);
    const passRate = (filteredGrades.filter(g => g.status === "Pass").length / (filteredGrades.length || 1)) * 100;

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
            <section className="p-6 w-full mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Gradebook</h1>
                        </div>
                        <p className="text-gray-600">
                            Track and manage student grades across all subjects and classes
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export Grades
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
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Total Students</p>
                                    <p className="text-3xl font-bold text-indigo-900">{totalStudents}</p>
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
                                    <p className="text-sm font-medium text-green-600 mb-1">Average Grade</p>
                                    <p className="text-3xl font-bold text-green-900">{avgGrade.toFixed(1)}%</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Target className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Highest Grade</p>
                                    <p className="text-3xl font-bold text-blue-900">{highestGrade}%</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600 mb-1">Lowest Grade</p>
                                    <p className="text-3xl font-bold text-red-900">{lowestGrade}%</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <TrendingDown className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">Pass Rate</p>
                                    <p className="text-3xl font-bold text-purple-900">{passRate.toFixed(1)}%</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Award className="h-6 w-6 text-purple-600" />
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
                                        value={selectedClass}
                                        onChange={(e) => {
                                            setSelectedClass(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {classOptions.map((cls) => (
                                            <option key={cls} value={cls}>
                                                {cls}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                                    value={selectedSubject}
                                    onChange={(e) => {
                                        setSelectedSubject(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {subjectOptions.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search by student, subject, or class..."
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

                {/* Grades Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading grade data...</p>
                            </div>
                        ) : filteredGrades.length === 0 ? (
                            <div className="text-center py-12">
                                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No grades found</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {searchTerm || selectedClass !== "All Classes" || selectedSubject !== "All Subjects"
                                        ? "No grades match your current filters." 
                                        : "No grade data available."
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
                                                    { key: "studentName", label: "Student", width: "w-1/5" },
                                                    { key: "subject", label: "Subject", width: "w-1/6" },
                                                    { key: "className", label: "Class", width: "w-1/6" },
                                                    { key: "grade", label: "Grade", width: "w-1/6" },
                                                    { key: "status", label: "Status", width: "w-1/6" },
                                                    { key: "actions", label: "", width: "w-1/12" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => key !== "actions" && toggleSort(key as SortKey)}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 ${width} ${
                                                            key !== "actions" 
                                                                ? "cursor-pointer hover:bg-gray-100 transition-colors" 
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {key !== "actions" && sortKey === key && (
                                                                sortDir === "asc" ? 
                                                                <ArrowUp className="h-4 w-4" /> : 
                                                                <ArrowDown className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {paginatedGrades.map((grade) => (
                                                <tr 
                                                    key={grade.id} 
                                                    className="hover:bg-gray-50 transition-colors group"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                                                <span className="font-semibold text-indigo-600 text-sm">
                                                                    {grade.studentName.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{grade.studentName}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-900">{grade.subject}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{grade.className}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Badge 
                                                                variant="outline"
                                                                className={`font-mono font-bold ${getGradeColor(grade.grade)}`}
                                                            >
                                                                {grade.grade}%
                                                            </Badge>
                                                            <span className="text-sm text-gray-500">
                                                                {getGradeLabel(grade.grade)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge 
                                                            variant={grade.status === "Pass" ? "default" : "secondary"}
                                                            className={grade.status === "Pass" 
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                                                : "bg-red-100 text-red-800 hover:bg-red-100"
                                                            }
                                                        >
                                                            {grade.status}
                                                        </Badge>
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
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredGrades.length)} of {filteredGrades.length} entries
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