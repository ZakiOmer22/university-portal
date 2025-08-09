"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Users, Search, ChevronDown, ChevronUp } from "lucide-react";

// Helper to generate dummy students for each course
function generateDummyStudents(courseId: string, count: number) {
    const firstNames = [
        "Alice",
        "Bob",
        "Charlie",
        "Dana",
        "Ethan",
        "Fiona",
        "George",
        "Hannah",
        "Ian",
        "Julia",
        "Kevin",
        "Laura",
        "Mike",
        "Nina",
        "Oscar",
        "Pam",
        "Quinn",
        "Rachel",
        "Steve",
        "Tina",
        "Uma",
        "Victor",
        "Wendy",
        "Xander",
        "Yara",
        "Zane",
    ];
    const lastNames = [
        "Johnson",
        "Smith",
        "Lee",
        "White",
        "Brown",
        "Davis",
        "Wilson",
        "Moore",
        "Taylor",
        "Anderson",
        "Thomas",
        "Jackson",
        "Martin",
        "Thompson",
        "Garcia",
        "Martinez",
        "Robinson",
        "Clark",
        "Lewis",
        "Walker",
        "Hall",
        "Allen",
        "Young",
        "King",
        "Wright",
        "Scott",
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
        const status = i % 3 === 0 ? "Inactive" : "Active";
        students.push({ id: `${courseId}-stu${i + 1}`, fullName, email, phone, enrollmentDate, status });
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

const PAGE_SIZE = 15;

type SortKey = "fullName" | "email" | "phone" | "enrollmentDate" | "status" | null;
type SortDirection = "asc" | "desc";

export default function StudentsPage() {
    const params = useParams();
    const router = useRouter();

    // Fix: Ensure selectedCourseId is always a string, never string[]
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
                // date string comparison
                return sortDirection === "asc"
                    ? new Date(aVal).getTime() - new Date(bVal).getTime()
                    : new Date(bVal).getTime() - new Date(aVal).getTime();
            }

            // string comparison
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

    return (
        <DashboardLayout
            
        >
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <Users size={32} /> Students Enrolled
                </h1>

                {/* Stats Cards */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className="flex-1 bg-indigo-100 rounded-lg p-6 shadow flex flex-col items-center">
                        <div className="text-indigo-700 mb-2">
                            <Users size={36} />
                        </div>
                        <p className="text-xl font-semibold text-indigo-900">Total Students</p>
                        <p className="text-3xl font-bold text-indigo-800">{students.length}</p>
                    </div>
                    <div className="flex-1 bg-green-100 rounded-lg p-6 shadow flex flex-col items-center">
                        <p className="text-xl font-semibold text-green-900 mb-1">
                            Filtered Students
                        </p>
                        <p className="text-4xl font-extrabold text-green-800">
                            {filteredStudents.length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="course-select"
                            className="font-semibold text-gray-700 whitespace-nowrap"
                        >
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
                            placeholder="Search by name, email, phone, or status..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            aria-label="Search students"
                        />
                        <Search
                            size={20}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <table className="w-full table-auto border-collapse border border-gray-300 rounded-md">
                        <thead>
                            <tr>
                                {["Name", "Email", "Phone", "Enrollment Date", "Status", "Actions"].map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`border border-gray-300 p-3 bg-gray-100 ${idx === 0 ? "rounded-tl-md" : ""
                                            } ${idx === 5 ? "rounded-tr-md" : ""} whitespace-nowrap text-left font-semibold text-indigo-900`}
                                    >
                                        <Skeleton className="h-5 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(PAGE_SIZE)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j} className="border border-gray-300 p-3">
                                            <Skeleton className="h-5 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : filteredStudents.length === 0 ? (
                    <p className="italic text-center text-gray-600 py-12">No students found.</p>
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
                                            { key: "phone", label: "Phone" },
                                            { key: "enrollmentDate", label: "Enrollment Date" },
                                            { key: "status", label: "Status" },
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
                                    {paginatedStudents.map(({ id, fullName, email, phone, enrollmentDate, status }) => (
                                        <tr
                                            key={id}
                                            className="hover:bg-indigo-50 transition cursor-pointer"
                                            onClick={() => alert(`Open student details page for ${fullName} (ID: ${id})`)}
                                        >
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{fullName}</td>
                                            <td className="border border-gray-300 p-3 truncate">{email}</td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{phone}</td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">{enrollmentDate}</td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded text-sm font-semibold ${status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert(`Message sent to ${fullName} (${email})`);
                                                    }}
                                                    aria-label={`Send message to ${fullName}`}
                                                >
                                                    Message
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
