"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Users, BarChart2, ArrowUp, ArrowDown } from "lucide-react";

type GradeEntry = {
    id: string;
    studentName: string;
    subject: string;
    className: string; // Added className for filtering
    grade: number; // 0 - 100
    status: "Pass" | "Fail";
};

// Sample dummy data with className
const dummyGrades: GradeEntry[] = [
    { id: "1", studentName: "Alice Johnson", subject: "Math", className: "Math 101", grade: 92, status: "Pass" },
    { id: "2", studentName: "Bob Smith", subject: "Physics", className: "Physics A", grade: 75, status: "Pass" },
    { id: "3", studentName: "Charlie Davis", subject: "Chemistry", className: "Chemistry 1", grade: 58, status: "Fail" },
    { id: "4", studentName: "Diana Evans", subject: "Math", className: "Math 101", grade: 87, status: "Pass" },
    { id: "5", studentName: "Ethan Brown", subject: "Physics", className: "Physics A", grade: 63, status: "Pass" },
    { id: "6", studentName: "Fiona Green", subject: "Chemistry", className: "Chemistry 1", grade: 45, status: "Fail" },
    // Add more entries if needed
];

const PAGE_SIZE = 10;

type SortKey = "studentName" | "subject" | "grade" | "status" | "className" | null;
type SortDirection = "asc" | "desc";

export default function GradebookPage() {
    const [grades, setGrades] = useState<GradeEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState("All Classes");

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
        }, 600);
    }, []);

    // Extract unique class names for filter dropdown
    const classOptions = useMemo(() => {
        const classes = new Set(grades.map((g) => g.className));
        return ["All Classes", ...Array.from(classes).sort()];
    }, [grades]);

    // Filtered & sorted grades
    const filteredGrades = useMemo(() => {
        let filtered = grades;

        if (selectedClass !== "All Classes") {
            filtered = filtered.filter((g) => g.className === selectedClass);
        }

        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (g) =>
                    g.studentName.toLowerCase().includes(term) ||
                    g.subject.toLowerCase().includes(term)
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
    }, [grades, searchTerm, selectedClass, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredGrades.length / PAGE_SIZE);

    const paginatedGrades = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredGrades.slice(start, start + PAGE_SIZE);
    }, [filteredGrades, currentPage]);

    // Summary stats - reflect filtered grades to match the table
    const totalStudents = new Set(filteredGrades.map((g) => g.studentName)).size;
    const avgGrade =
        filteredGrades.reduce((sum, g) => sum + g.grade, 0) / (filteredGrades.length || 1);
    const highestGrade = filteredGrades.reduce(
        (max, g) => (g.grade > max ? g.grade : max),
        0
    );
    const lowestGrade = filteredGrades.reduce(
        (min, g) => (g.grade < min ? g.grade : min),
        100
    );

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
        <DashboardLayout
        >
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <BarChart2 size={32} /> Gradebook
                </h1>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-indigo-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-indigo-800">Total Students</h2>
                        <p className="text-3xl font-bold text-indigo-900">{totalStudents}</p>
                    </div>
                    <div className="bg-green-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-green-700">Average Grade</h2>
                        <p className="text-3xl font-bold text-green-900">{avgGrade.toFixed(1)}</p>
                    </div>
                    <div className="bg-yellow-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-yellow-700">Highest Grade</h2>
                        <p className="text-3xl font-bold text-yellow-900">{highestGrade}</p>
                    </div>
                    <div className="bg-red-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-red-700">Lowest Grade</h2>
                        <p className="text-3xl font-bold text-red-900">{lowestGrade}</p>
                    </div>
                </div>

                {/* Filters: Class dropdown + Search */}
                <div className="mb-6 flex flex-wrap items-center gap-4 max-w-lg">
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
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

                    <input
                        type="search"
                        placeholder="Search by student or subject..."
                        className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Table */}
                {loading ? (
                    <p className="text-center py-12 text-gray-600">Loading grades...</p>
                ) : filteredGrades.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">No grades found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("studentName")}
                                        >
                                            Student
                                            {sortKey === "studentName" &&
                                                (sortDir === "asc" ? (
                                                    <ArrowUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ArrowDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("subject")}
                                        >
                                            Subject
                                            {sortKey === "subject" &&
                                                (sortDir === "asc" ? (
                                                    <ArrowUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ArrowDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("className")}
                                        >
                                            Class
                                            {sortKey === "className" &&
                                                (sortDir === "asc" ? (
                                                    <ArrowUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ArrowDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-right text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("grade")}
                                        >
                                            Grade
                                            {sortKey === "grade" &&
                                                (sortDir === "asc" ? (
                                                    <ArrowUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ArrowDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("status")}
                                        >
                                            Status
                                            {sortKey === "status" &&
                                                (sortDir === "asc" ? (
                                                    <ArrowUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ArrowDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedGrades.map(({ id, studentName, subject, className, grade, status }) => (
                                        <tr
                                            key={id}
                                            className="hover:bg-indigo-50 transition"
                                        >
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{studentName}</td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{subject}</td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{className}</td>
                                            <td className="border border-gray-300 p-3 text-right">{grade}</td>
                                            <td
                                                className={`border border-gray-300 p-3 text-center font-semibold ${status === "Pass" ? "text-green-700" : "text-red-700"
                                                    }`}
                                            >
                                                {status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === 1
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                    } transition`}
                                aria-label="Previous page"
                            >
                                Previous
                            </button>

                            <span className="font-semibold text-gray-700 whitespace-nowrap">
                                Page {currentPage} of {pageCount}
                            </span>

                            <button
                                onClick={nextPage}
                                disabled={currentPage === pageCount}
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === pageCount
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                    } transition`}
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* Back Button */}
                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={() => history.back()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded shadow-md transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
}
