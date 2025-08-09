"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Users, Search, ChevronDown, ChevronUp } from "lucide-react";

// Dummy student data grouped by courseId
const dummyStudentsByCourseId: Record<
    string,
    {
        id: string;
        fullName: string;
        email: string;
        attendedDates: string[]; // dates student attended class
    }[]
> = {
    course1: [
        { id: "stu1", fullName: "Alice Johnson", email: "alice.johnson@example.com", attendedDates: ["2025-08-01", "2025-08-03"] },
        { id: "stu2", fullName: "Bob Smith", email: "bob.smith@example.com", attendedDates: ["2025-08-02"] },
    ],
    course2: [
        { id: "stu3", fullName: "Charlie Lee", email: "charlie.lee@example.com", attendedDates: ["2025-08-01", "2025-08-04"] },
    ],
    course3: [
        { id: "stu4", fullName: "Dana White", email: "dana.white@example.com", attendedDates: [] },
    ],
};

const dummyCourses = [
    { id: "course1", code: "ENG101", name: "English Literature", semester: 1 },
    { id: "course2", code: "HIST202", name: "Modern History", semester: 2 },
    { id: "course3", code: "PHYS150", name: "Intro to Physics", semester: 1 },
];

const PAGE_SIZE = 10;

type SortKey = "fullName" | "email" | null;
type SortDirection = "asc" | "desc";

export default function AttendancePage() {
    const params = useParams();
    const router = useRouter();

    // Fix string | string[] issue by extracting string properly
    const rawCourseId = params.id;
    const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;

    const [selectedCourseId, setSelectedCourseId] = useState(courseId ?? dummyCourses[0].id);
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
        }, 600);

        return () => clearTimeout(timeoutId);
    }, [selectedCourseId]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm.trim()) return students;
        const lower = searchTerm.toLowerCase();
        return students.filter(
            (s) =>
                s.fullName.toLowerCase().includes(lower) || s.email.toLowerCase().includes(lower)
        );
    }, [students, searchTerm]);

    const sortedStudents = useMemo(() => {
        if (!sortKey) return filteredStudents;
        return [...filteredStudents].sort((a, b) => {
            const aVal = a[sortKey] || "";
            const bVal = b[sortKey] || "";
            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
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

    return (
        <DashboardLayout>
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <Users size={32} />
                    Attendance for {selectedCourseId.toUpperCase()}
                </h1>

                {/* Course selector */}
                <div className="mb-6 flex items-center gap-4">
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

                    <input
                        type="search"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="ml-auto border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        aria-label="Search students"
                    />
                </div>

                {/* Error message */}
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
                                {["Name", "Email", "Attendance"].map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`border border-gray-300 p-3 bg-gray-100 ${idx === 0 ? "rounded-tl-md" : ""} ${idx === 2 ? "rounded-tr-md" : ""
                                            } whitespace-nowrap text-left font-semibold text-indigo-900`}
                                    >
                                        <Skeleton className="h-5 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(PAGE_SIZE)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(3)].map((_, j) => (
                                        <td key={j} className="border border-gray-300 p-3">
                                            <Skeleton className="h-5 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : paginatedStudents.length === 0 ? (
                    <p className="italic text-center text-gray-600 py-12">No students found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300" style={{ tableLayout: "fixed" }}>
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        {[
                                            { key: "fullName", label: "Name" },
                                            { key: "email", label: "Email" },
                                            { key: "attendance", label: "Attendance Count" },
                                        ].map(({ key, label }) => (
                                            <th
                                                key={key}
                                                onClick={() => (key !== "attendance" ? onSort(key as SortKey) : undefined)}
                                                className={`cursor-pointer select-none border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap ${key === "attendance" ? "" : "hover:bg-indigo-200"
                                                    }`}
                                                title={key !== "attendance" ? `Sort by ${label}` : ""}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedStudents.map(({ id, fullName, email, attendedDates }) => (
                                        <tr key={id} className="hover:bg-indigo-50 transition cursor-pointer">
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{fullName}</td>
                                            <td className="border border-gray-300 p-3 truncate">{email}</td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{attendedDates.length}</td>
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
