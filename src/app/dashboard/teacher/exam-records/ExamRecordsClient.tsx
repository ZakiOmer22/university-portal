"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { CheckSquare } from "lucide-react";

const dummyCourses = [
    { id: "course1", code: "ENG101", name: "English Literature", semester: 1 },
    { id: "course2", code: "HIST202", name: "Modern History", semester: 2 },
    { id: "course3", code: "PHYS150", name: "Intro to Physics", semester: 1 },
];

function generateDummyStudents(courseId: string, count: number) {
    const firstNames = [
        "Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George", "Hannah",
        "Ian", "Julia", "Kevin", "Laura", "Mike", "Nina", "Oscar", "Pam",
        "Quinn", "Rachel", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xander",
        "Yara", "Zane",
    ];
    const lastNames = [
        "Johnson", "Smith", "Lee", "White", "Brown", "Davis", "Wilson", "Moore",
        "Taylor", "Anderson", "Thomas", "Jackson", "Martin", "Thompson", "Garcia",
        "Martinez", "Robinson", "Clark", "Lewis", "Walker", "Hall", "Allen",
        "Young", "King", "Wright", "Scott",
    ];

    const students = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 7) % lastNames.length];
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        students.push({ id: `${courseId}-stu${i + 1}`, fullName, email });
    }
    return students;
}

const dummyStudentsByCourseId: Record<string, { id: string; fullName: string; email: string }[]> = {
    course1: generateDummyStudents("course1", 25),
    course2: generateDummyStudents("course2", 25),
    course3: generateDummyStudents("course3", 25),
};

type ScoreEntry = {
    midterm: number | null;
    final: number | null;
    assignment: number | null;
    locked: { midterm: boolean; final: boolean; assignment: boolean };
};

const PAGE_SIZE = 15;

export default function ExamRecordsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idParam = searchParams.get("id") ?? dummyCourses[0].id;

    const [selectedCourseId, setSelectedCourseId] = useState(idParam);
    const [students, setStudents] = useState(dummyStudentsByCourseId[idParam] || []);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState<Record<string, ScoreEntry>>({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setCurrentPage(1);
        setScores({});
        if (dummyStudentsByCourseId[selectedCourseId]) {
            setStudents(dummyStudentsByCourseId[selectedCourseId]);
        } else {
            setStudents([]);
        }
        setLoading(false);
    }, [selectedCourseId]);

    function handleCourseChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newId = e.target.value;
        setSelectedCourseId(newId);
        router.replace(`/dashboard/teacher/exam-records?id=${newId}`);
    }

    function handleScoreChange(studentId: string, type: keyof Omit<ScoreEntry, "locked">, value: string) {
        if (value === "") {
            setScores((prev) => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    [type]: null,
                    locked: {
                        ...prev[studentId]?.locked,
                        [type]: false,
                    },
                },
            }));
            return;
        }

        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setScores((prev) => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    [type]: numValue,
                    locked: {
                        ...prev[studentId]?.locked,
                        [type]: false,
                    },
                },
            }));
        }
    }

    function handleScoreBlur(studentId: string, type: keyof Omit<ScoreEntry, "locked">) {
        const scoreEntry = scores[studentId];
        if (scoreEntry) {
            const val = scoreEntry[type];
            if (typeof val === "number" && val >= 0 && val <= 100) {
                setScores((prev) => ({
                    ...prev,
                    [studentId]: {
                        ...prev[studentId],
                        locked: {
                            ...prev[studentId].locked,
                            [type]: true,
                        },
                    },
                }));
            }
        }
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        const pageCount = Math.ceil(students.length / PAGE_SIZE);
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    const pageCount = Math.ceil(students.length / PAGE_SIZE);
    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return students.slice(start, start + PAGE_SIZE);
    }, [students, currentPage]);

    return (
        <DashboardLayout>
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <CheckSquare size={32} /> Exam Records for {selectedCourseId.toUpperCase()}
                </h1>

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
                </div>

                {loading ? (
                    <p className="text-center py-12 text-gray-600">Loading students...</p>
                ) : students.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">No students found for this course.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                            Name
                                        </th>
                                        <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                            Email
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap">
                                            Midterm Score (0-100)
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap">
                                            Final Score (0-100)
                                        </th>
                                        <th className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap">
                                            Assignment Score (0-100)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedStudents.map(({ id, fullName, email }) => {
                                        const scoreEntry = scores[id] || {
                                            midterm: null,
                                            final: null,
                                            assignment: null,
                                            locked: { midterm: false, final: false, assignment: false },
                                        };
                                        return (
                                            <tr key={id} className="hover:bg-indigo-50 transition">
                                                <td className="border border-gray-300 p-3 whitespace-nowrap">{fullName}</td>
                                                <td className="border border-gray-300 p-3 truncate">{email}</td>
                                                {(["midterm", "final", "assignment"] as const).map((type) => (
                                                    <td key={type} className="border border-gray-300 p-3 text-center">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={100}
                                                            value={scoreEntry[type] ?? ""}
                                                            onChange={(e) => handleScoreChange(id, type, e.target.value)}
                                                            onBlur={() => handleScoreBlur(id, type)}
                                                            disabled={scoreEntry.locked[type]}
                                                            className={`w-20 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${scoreEntry.locked[type] ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                                                }`}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

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

                        <div className="mt-12 flex justify-center">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded shadow-md transition"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </>
                )}
            </section>
        </DashboardLayout>
    );
}
