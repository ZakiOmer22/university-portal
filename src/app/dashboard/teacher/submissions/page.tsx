"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Users, 
    Search, 
    ChevronDown, 
    ChevronUp, 
    Eye, 
    FileText,
    CheckCircle,
    XCircle,
    Calendar,
    Download,
    Filter,
    ArrowLeft,
    Mail,
    MoreVertical
} from "lucide-react";

// Dummy courses data
const dummyCourses = [
    { id: "course1", code: "ENG101", name: "English Literature", semester: 1 },
    { id: "course2", code: "HIST202", name: "Modern History", semester: 2 },
    { id: "course3", code: "PHYS150", name: "Intro to Physics", semester: 1 },
];

// Assignment type
type Assignment = {
    id: string;
    fullName: string;
    email: string;
    submitted: boolean;
    submissionDate: string | null;
    grade?: number;
    lateSubmission: boolean;
};

// Helper to generate dummy assignments with submission status
function generateDummyAssignments(courseId: string, count: number): Assignment[] {
    const firstNames = [
        "Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George",
        "Hannah", "Ian", "Julia", "Kevin", "Laura", "Mike", "Nina",
        "Oscar", "Pam", "Quinn", "Rachel", "Steve", "Tina", "Uma",
        "Victor", "Wendy", "Xander", "Yara", "Zane",
    ];
    const lastNames = [
        "Johnson", "Smith", "Lee", "White", "Brown", "Davis", "Wilson",
        "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "Martin",
        "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Lewis",
        "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott",
    ];

    const assignments: Assignment[] = [];
    for (let i = 0; i < count; i++) {
        const fullName = `${firstNames[i % firstNames.length]} ${lastNames[(i + 7) % lastNames.length]}`;
        const email = `${fullName.toLowerCase().replace(" ", ".")}@example.com`;
        const submitted = i % 3 !== 0;
        const submissionDate = submitted
            ? new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
                .toISOString()
                .split("T")[0]
            : null;
        const grade = submitted ? Math.floor(Math.random() * 40) + 60 : undefined;
        const lateSubmission = submitted && i % 5 === 0;
        
        assignments.push({ 
            id: `${courseId}-stu${i + 1}`, 
            fullName, 
            email, 
            submitted, 
            submissionDate,
            grade,
            lateSubmission
        });
    }
    return assignments;
}

const PAGE_SIZE = 12;

type SortKey = "fullName" | "email" | "submissionDate" | "submitted" | "grade" | null;
type SortDirection = "asc" | "desc";

function formatDate(dateStr: string | null) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

export default function AssignmentsPage() {
    const params = useParams();
    const router = useRouter();

    const rawId = params.id;
    const initialCourseId = Array.isArray(rawId) ? rawId[0] : rawId ?? dummyCourses[0].id;

    const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [submissionFilter, setSubmissionFilter] = useState("All");

    useEffect(() => {
        setLoading(true);
        setError(null);
        setAssignments([]);
        setSearchTerm("");
        setCurrentPage(1);
        setSortKey(null);

        const timeoutId = setTimeout(() => {
            if (!selectedCourseId || !dummyCourses.find((c) => c.id === selectedCourseId)) {
                setError("Invalid or unknown course ID.");
                setLoading(false);
                return;
            }

            setAssignments(generateDummyAssignments(selectedCourseId, 25));
            setLoading(false);
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [selectedCourseId]);

    // Filter assignments by search term and submission status
    const filteredAssignments = useMemo(() => {
        let filtered = assignments;

        // Apply submission status filter
        if (submissionFilter === "Submitted") {
            filtered = filtered.filter(a => a.submitted);
        } else if (submissionFilter === "Not Submitted") {
            filtered = filtered.filter(a => !a.submitted);
        } else if (submissionFilter === "Late") {
            filtered = filtered.filter(a => a.lateSubmission);
        }

        // Apply search term filter
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (a) =>
                    a.fullName.toLowerCase().includes(lower) ||
                    a.email.toLowerCase().includes(lower) ||
                    (a.submissionDate ? a.submissionDate.toLowerCase().includes(lower) : false)
            );
        }

        return filtered;
    }, [assignments, searchTerm, submissionFilter]);

    // Sort assignments
    const sortedAssignments = useMemo(() => {
        if (!sortKey) return filteredAssignments;
        return [...filteredAssignments].sort((a, b) => {
            let aVal = a[sortKey];
            let bVal = b[sortKey];

            if (sortKey === "submissionDate") {
                aVal = aVal || "";
                bVal = bVal || "";
                if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
                if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
                return 0;
            }

            if (sortKey === "submitted") {
                if (aVal === bVal) return 0;
                return aVal ? (sortDirection === "asc" ? -1 : 1) : sortDirection === "asc" ? 1 : -1;
            }

            if (sortKey === "grade") {
                aVal = aVal || 0;
                bVal = bVal || 0;
                return sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
            }

            // String sorting
            if (!aVal) return 1;
            if (!bVal) return -1;

            const aStr = aVal.toString().toLowerCase();
            const bStr = bVal.toString().toLowerCase();

            if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
            if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredAssignments, sortKey, sortDirection]);

    const pageCount = Math.ceil(sortedAssignments.length / PAGE_SIZE);
    const paginatedAssignments = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return sortedAssignments.slice(start, start + PAGE_SIZE);
    }, [sortedAssignments, currentPage]);

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
        router.replace(`/dashboard/teacher/assignments/${newId}`);
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    const selectedCourse = dummyCourses.find(course => course.id === selectedCourseId);
    const submittedCount = assignments.filter(a => a.submitted).length;
    const notSubmittedCount = assignments.filter(a => !a.submitted).length;
    const lateCount = assignments.filter(a => a.lateSubmission).length;
    const averageGrade = submittedCount > 0 
        ? assignments.filter(a => a.submitted && a.grade).reduce((sum, a) => sum + (a.grade || 0), 0) / submittedCount 
        : 0;

    return (
        <DashboardLayout>
            <section className="p-6 w-full mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Assignment Submissions</h1>
                        </div>
                        <p className="text-gray-600">
                            {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : "Manage and review student assignments"}
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
                                    <p className="text-3xl font-bold text-indigo-900">{assignments.length}</p>
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
                                    <p className="text-sm font-medium text-green-600 mb-1">Submitted</p>
                                    <p className="text-3xl font-bold text-green-900">{submittedCount}</p>
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
                                    <p className="text-sm font-medium text-red-600 mb-1">Not Submitted</p>
                                    <p className="text-3xl font-bold text-red-900">{notSubmittedCount}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600 mb-1">Late Submissions</p>
                                    <p className="text-3xl font-bold text-orange-900">{lateCount}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <Calendar className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Avg Grade</p>
                                    <p className="text-3xl font-bold text-blue-900">{averageGrade.toFixed(1)}%</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <FileText className="h-6 w-6 text-blue-600" />
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
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <select
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                                        value={submissionFilter}
                                        onChange={(e) => {
                                            setSubmissionFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="All">All Submissions</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Not Submitted">Not Submitted</option>
                                        <option value="Late">Late Submissions</option>
                                    </select>
                                </div>
                            </div>

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
                    </CardContent>
                </Card>

                {/* Error */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Assignments Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading assignment data...</p>
                            </div>
                        ) : filteredAssignments.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {searchTerm || submissionFilter !== "All"
                                        ? "No assignments match your current filters." 
                                        : "No assignment data available for this course."
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
                                                    { key: "fullName", label: "Student", width: "w-1/5" },
                                                    { key: "email", label: "Email", width: "w-1/5" },
                                                    { key: "submitted", label: "Status", width: "w-1/6" },
                                                    { key: "submissionDate", label: "Submission Date", width: "w-1/6" },
                                                    { key: "grade", label: "Grade", width: "w-1/6" },
                                                    { key: "actions", label: "Actions", width: "w-1/6" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => key !== "actions" && onSort(key as SortKey)}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 ${width} ${
                                                            key !== "actions" 
                                                                ? "cursor-pointer hover:bg-gray-100 transition-colors" 
                                                                : ""
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
                                            {paginatedAssignments.map((assignment) => (
                                                <tr 
                                                    key={assignment.id} 
                                                    className="hover:bg-gray-50 transition-colors group"
                                                    onClick={() => alert(`Viewing assignment for ${assignment.fullName}`)}
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                                                <span className="font-semibold text-indigo-600 text-sm">
                                                                    {assignment.fullName.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{assignment.fullName}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{assignment.email}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col gap-1">
                                                            <Badge 
                                                                variant={assignment.submitted ? "default" : "secondary"}
                                                                className={assignment.submitted 
                                                                    ? "bg-green-100 text-green-800 hover:bg-green-100 w-fit" 
                                                                    : "bg-red-100 text-red-800 hover:bg-red-100 w-fit"
                                                                }
                                                            >
                                                                {assignment.submitted ? "Submitted" : "Not Submitted"}
                                                            </Badge>
                                                            {assignment.lateSubmission && (
                                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 w-fit text-xs">
                                                                    Late
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{formatDate(assignment.submissionDate)}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        {assignment.grade ? (
                                                            <Badge 
                                                                variant="outline"
                                                                className={`font-mono font-bold ${
                                                                    assignment.grade >= 90 ? "text-green-600 bg-green-50 border-green-200" :
                                                                    assignment.grade >= 80 ? "text-blue-600 bg-blue-50 border-blue-200" :
                                                                    assignment.grade >= 70 ? "text-yellow-600 bg-yellow-50 border-yellow-200" :
                                                                    "text-red-600 bg-red-50 border-red-200"
                                                                }`}
                                                            >
                                                                {assignment.grade}%
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">Not graded</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex items-center gap-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    alert(`Viewing submission details for ${assignment.fullName}`);
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View
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
                                {pageCount > 1 && (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-gray-50/50">
                                        <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredAssignments.length)} of {filteredAssignments.length} students
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