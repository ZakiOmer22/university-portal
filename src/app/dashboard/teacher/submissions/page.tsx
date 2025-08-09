"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Users, Search, ChevronDown, ChevronUp, Eye } from "lucide-react";

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
        const submitted = i % 3 !== 0; // some submitted, some not
        const submissionDate = submitted
            ? new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
                .toISOString()
                .split("T")[0]
            : null;
        assignments.push({ id: `${courseId}-stu${i + 1}`, fullName, email, submitted, submissionDate });
    }
    return assignments;
}

const PAGE_SIZE = 15;

type SortKey = "fullName" | "email" | "submissionDate" | "submitted" | null;
type SortDirection = "asc" | "desc";

export default function AssignmentsPage() {
    const params = useParams();
    const router = useRouter();

    // Normalize params.id to string (if it's array, take first element)
    const rawId = params.id;
    const initialCourseId =
        Array.isArray(rawId) ? rawId[0] : rawId ?? dummyCourses[0].id;

    const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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

    // Filter assignments by search term
    const filteredAssignments = useMemo(() => {
        if (!searchTerm.trim()) return assignments;
        const lower = searchTerm.toLowerCase();
        return assignments.filter(
            (a) =>
                a.fullName.toLowerCase().includes(lower) ||
                a.email.toLowerCase().includes(lower) ||
                (a.submissionDate ? a.submissionDate.toLowerCase().includes(lower) : false) ||
                (a.submitted ? "submitted".includes(lower) : "not submitted".includes(lower))
        );
    }, [assignments, searchTerm]);

    // Sort assignments
    const sortedAssignments = useMemo(() => {
        if (!sortKey) return filteredAssignments;
        return [...filteredAssignments].sort((a, b) => {
            let aVal = a[sortKey];
            let bVal = b[sortKey];

            if (sortKey === "submissionDate") {
                aVal = aVal || ""; // null dates come last
                bVal = bVal || "";
                if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
                if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
                return 0;
            }

            if (sortKey === "submitted") {
                // true/false sorting
                if (aVal === bVal) return 0;
                return aVal ? (sortDirection === "asc" ? -1 : 1) : sortDirection === "asc" ? 1 : -1;
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

    return (
        <DashboardLayout >
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <Users size={32} />
                    Assignments for {selectedCourseId.toUpperCase()}
                </h1>

                {/* Stats */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className="flex-1 bg-indigo-100 rounded-lg p-6 shadow flex flex-col items-center">
                        <p className="text-xl font-semibold text-indigo-900">Total Students</p>
                        <p className="text-3xl font-bold text-indigo-800">{assignments.length}</p>
                    </div>
                    <div className="flex-1 bg-green-100 rounded-lg p-6 shadow flex flex-col items-center">
                        <p className="text-xl font-semibold text-green-900 mb-1">Submitted Assignments</p>
                        <p className="text-4xl font-extrabold text-green-800">
                            {assignments.filter((a) => a.submitted).length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                    <div className="flex items-center gap-3">
                        <label htmlFor="course-select" className="font-semibold text-gray-700 whitespace-nowrap">
                            Select Class / Course:
                        </label>
                        <select
                            id="course-select"
                            value={selectedCourseId}
                            onChange={handleCourseChange}
                            className="border border-gray-300 rounded px-4 py-2"
                        >
                            {dummyCourses.map(({ id, code, name, semester }) => (
                                <option key={id} value={id}>
                                    {code} - {name} (Semester {semester})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative max-w-sm w-full">
                        <input
                            type="search"
                            placeholder="Search by name, email, or status..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            aria-label="Search assignments"
                        />
                        <Search
                            size={20}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Loading Skeleton */}
                {loading ? (
                    <table className="w-full table-auto border-collapse border border-gray-300 rounded-md">
                        <thead>
                            <tr>
                                {["Name", "Email", "Submitted", "Submission Date", "Actions"].map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`border border-gray-300 p-3 bg-gray-100 ${idx === 0 ? "rounded-tl-md" : ""
                                            } ${idx === 4 ? "rounded-tr-md" : ""} whitespace-nowrap text-left font-semibold text-indigo-900`}
                                    >
                                        <Skeleton className="h-5 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(PAGE_SIZE)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(5)].map((_, j) => (
                                        <td key={j} className="border border-gray-300 p-3">
                                            <Skeleton className="h-5 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : filteredAssignments.length === 0 ? (
                    <p className="italic text-center text-gray-600 py-12">No assignments found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                            <table
                                className="min-w-full table-fixed border-collapse border border-gray-300"
                                style={{ tableLayout: "fixed" }}
                            >
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        {[
                                            { key: "fullName", label: "Name" },
                                            { key: "email", label: "Email" },
                                            { key: "submitted", label: "Submitted" },
                                            { key: "submissionDate", label: "Submission Date" },
                                        ].map(({ key, label }) => (
                                            <th
                                                key={key}
                                                onClick={() => onSort(key as SortKey)}
                                                className="cursor-pointer select-none border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap"
                                                title={`Sort by ${label}`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <span>{label}</span>
                                                    {sortKey === key ? (
                                                        sortDirection === "asc" ? (
                                                            <ChevronUp size={16} />
                                                        ) : (
                                                            <ChevronDown size={16} />
                                                        )
                                                    ) : null}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAssignments.map(({ id, fullName, email, submitted, submissionDate }) => (
                                        <tr
                                            key={id}
                                            className="hover:bg-indigo-50 transition cursor-pointer"
                                            onClick={() => alert(`Viewing assignment for ${fullName}`)}
                                        >
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{fullName}</td>
                                            <td className="border border-gray-300 p-3 truncate">{email}</td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">
                                                {submitted ? (
                                                    <span className="inline-block px-2 py-1 rounded text-sm font-semibold bg-green-100 text-green-800">
                                                        Submitted
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 rounded text-sm font-semibold bg-red-100 text-red-800">
                                                        Not Submitted
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">
                                                {submissionDate || "N/A"}
                                            </td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert(`Viewing submission details for ${fullName}`);
                                                    }}
                                                    aria-label={`View assignment submission for ${fullName}`}
                                                >
                                                    <Eye size={16} /> View
                                                </button>
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

                {/* Back button */}
                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded shadow-md transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
}
