"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Users, BookOpen, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";

type Classroom = {
    id: string;
    name: string;
    grade: string;
    studentsCount: number;
    subjects: string[];
    status: "Active" | "Inactive";
};

const dummyClassrooms: Classroom[] = [
    {
        id: "c1",
        name: "Math 101",
        grade: "Grade 10",
        studentsCount: 28,
        subjects: ["Mathematics"],
        status: "Active",
    },
    {
        id: "c2",
        name: "Science 9A",
        grade: "Grade 9",
        studentsCount: 25,
        subjects: ["Biology", "Chemistry"],
        status: "Active",
    },
    {
        id: "c3",
        name: "History 11B",
        grade: "Grade 11",
        studentsCount: 20,
        subjects: ["History", "Geography"],
        status: "Inactive",
    },
    // add more classrooms as needed
];

const PAGE_SIZE = 7;

type SortKey = "name" | "grade" | "studentsCount" | "status" | null;
type SortDirection = "asc" | "desc";

export default function ClassroomManagementPage() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & search
    const [filterGrade, setFilterGrade] = useState<string>("All");
    const [filterStatus, setFilterStatus] = useState<string>("All");
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
        }, 600);
    }, []);

    // Unique grades for filter dropdown
    const uniqueGrades = useMemo(() => {
        const grades = classrooms.map((c) => c.grade);
        return Array.from(new Set(grades)).sort();
    }, [classrooms]);

    const filteredClassrooms = useMemo(() => {
        let filtered = classrooms;

        if (filterGrade !== "All") {
            filtered = filtered.filter((c) => c.grade === filterGrade);
        }

        if (filterStatus !== "All") {
            filtered = filtered.filter((c) => c.status === filterStatus);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((c) => c.name.toLowerCase().includes(term));
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "name") comp = a.name.localeCompare(b.name);
                else if (sortKey === "grade") comp = a.grade.localeCompare(b.grade);
                else if (sortKey === "studentsCount") comp = a.studentsCount - b.studentsCount;
                else if (sortKey === "status") comp = a.status.localeCompare(b.status);

                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [classrooms, filterGrade, filterStatus, searchTerm, sortKey, sortDir]);

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

    return (
        <DashboardLayout>
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <BookOpen size={32} /> Classroom Management
                </h1>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div className="bg-indigo-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-indigo-800">Total Classrooms</h2>
                        <p className="text-3xl font-bold text-indigo-900">{totalClassrooms}</p>
                    </div>
                    <div className="bg-green-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-green-700">Active Classrooms</h2>
                        <p className="text-3xl font-bold text-green-900">{activeClassrooms}</p>
                    </div>
                    <div className="bg-red-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-red-700">Inactive Classrooms</h2>
                        <p className="text-3xl font-bold text-red-900">{inactiveClassrooms}</p>
                    </div>
                    <div className="bg-yellow-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-yellow-800">Total Students</h2>
                        <p className="text-3xl font-bold text-yellow-900">{totalStudents}</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="mb-6 flex flex-wrap items-center gap-4 justify-between max-w-6xl mx-auto">
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
                        value={filterGrade}
                        onChange={(e) => {
                            setFilterGrade(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Grades</option>
                        {uniqueGrades.map((grade) => (
                            <option key={grade} value={grade}>
                                {grade}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border border-gray-300 rounded px-4 py-2"
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

                    <input
                        type="search"
                        placeholder="Search classrooms by name..."
                        className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <button
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow font-semibold transition"
                        onClick={() => alert("Add Classroom functionality to be implemented")}
                    >
                        <PlusCircle size={20} /> Add Classroom
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <p className="text-center py-12 text-gray-600">Loading classrooms...</p>
                ) : filteredClassrooms.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">No classrooms found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm max-w-6xl mx-auto">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("name")}
                                        >
                                            Class Name
                                            {sortKey === "name" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("grade")}
                                        >
                                            Grade
                                            {sortKey === "grade" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-right text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("studentsCount")}
                                        >
                                            Students
                                            {sortKey === "studentsCount" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                            Subjects
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("status")}
                                        >
                                            Status
                                            {sortKey === "status" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedClassrooms.map(
                                        ({ id, name, grade, studentsCount, subjects, status }) => (
                                            <tr key={id} className="hover:bg-indigo-50 transition">
                                                <td className="border border-gray-300 p-3 whitespace-nowrap">{name}</td>
                                                <td className="border border-gray-300 p-3 whitespace-nowrap">{grade}</td>
                                                <td className="border border-gray-300 p-3 text-right">{studentsCount}</td>
                                                <td className="border border-gray-300 p-3">{subjects.join(", ")}</td>
                                                <td
                                                    className={`border border-gray-300 p-3 text-center font-semibold ${status === "Active" ? "text-green-700" : "text-red-700"
                                                        }`}
                                                >
                                                    {status}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                                        onClick={() => alert(`Edit classroom ${name} (feature TBD)`)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap max-w-6xl mx-auto">
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
