"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import Image from "next/image";
import Link from "next/link";

interface CourseRecord {
    code: string;
    name: string;
    creditHours: number;
    grade: string; // Letter grade or percentage
    gradePoint: number; // 4.0 scale or similar
}

interface SemesterRecord {
    semester: number;
    courses: CourseRecord[];
    semesterGPA: number;
    totalCredits: number;
}

// Helper to generate dummy courses with random grades for demonstration
function generateCoursesForSemester(sem: number): CourseRecord[] {
    const courses = [
        { code: `CS${sem}01`, name: "Intro to Programming", creditHours: 3 },
        { code: `MATH${sem}02`, name: "Calculus", creditHours: 4 },
        { code: `ENG${sem}03`, name: "English Composition", creditHours: 2 },
        { code: `HIST${sem}04`, name: "World History", creditHours: 3 },
        { code: `PHY${sem}05`, name: "Physics", creditHours: 3 },
        { code: `ELEC${sem}06`, name: "Elective Course", creditHours: 2 },
    ];

    const gradeScale = [
        { grade: "A", gp: 4.0 },
        { grade: "A-", gp: 3.7 },
        { grade: "B+", gp: 3.3 },
        { grade: "B", gp: 3.0 },
        { grade: "B-", gp: 2.7 },
        { grade: "C+", gp: 2.3 },
        { grade: "C", gp: 2.0 },
        { grade: "C-", gp: 1.7 },
        { grade: "D", gp: 1.0 },
        { grade: "F", gp: 0.0 },
    ];

    return courses.map((c, i) => {
        const g = gradeScale[(sem + i) % gradeScale.length];
        return { ...c, grade: g.grade, gradePoint: g.gp };
    });
}

function calculateSemesterGPA(courses: CourseRecord[]): { gpa: number; credits: number } {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(({ creditHours, gradePoint }) => {
        totalPoints += creditHours * gradePoint;
        totalCredits += creditHours;
    });
    return { gpa: totalPoints / totalCredits, credits: totalCredits };
}

const transcriptData: SemesterRecord[] = Array.from({ length: 6 }, (_, i) => {
    const sem = i + 1;
    const courses = generateCoursesForSemester(sem);
    const { gpa, credits } = calculateSemesterGPA(courses);
    return {
        semester: sem,
        courses,
        semesterGPA: gpa,
        totalCredits: credits,
    };
});

export default function TranscriptLetterPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 700);
    }, []);

    // Calculate cumulative GPA across semesters
    const cumulative = transcriptData.reduce(
        (acc, sem) => {
            acc.totalPoints += sem.semesterGPA * sem.totalCredits;
            acc.totalCredits += sem.totalCredits;
            return acc;
        },
        { totalPoints: 0, totalCredits: 0 }
    );

    const cumulativeGPA = cumulative.totalPoints / cumulative.totalCredits;

    function printPDF() {
        window.print();
    }

    return (
        <DashboardLayout loading={loading} user={null}>
            <section className="bg-white p-8 rounded-lg shadow max-w-5xl mx-auto my-8 print:max-w-full print:shadow-none print:p-4 print:my-0 font-serif" id="print-area">
                {/* Header */}
                <header className="flex items-center mb-10 print:mb-6 border-b border-gray-400 pb-4">
                    <div className="w-20 h-20 relative mr-6 print:w-16 print:h-16 print:block hidden">
                        <Image
                            src="/favicon.ico"
                            alt="University Logo"
                            fill
                            sizes="80px"
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-indigo-900 print:text-2xl">
                            University of Hargeisa
                        </h1>
                        <p className="text-gray-700 italic print:text-xs">Official Academic Transcript</p>
                    </div>
                </header>

                {/* Student info */}
                <section className="mb-10 grid grid-cols-2 gap-6 print:text-xs print:mb-6">
                    <div>
                        <p>
                            <span className="font-semibold">Student Name:</span> Zaki Omer
                        </p>
                        <p>
                            <span className="font-semibold">Student ID:</span> 2025-123456
                        </p>
                        <p>
                            <span className="font-semibold">Program:</span> Bachelor of Computer Science
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="font-semibold">Date of Issue:</span>{" "}
                            {new Date().toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-semibold">Academic Year:</span> 2024-2025
                        </p>
                        <p>
                            <span className="font-semibold">Current Semester:</span> 6
                        </p>
                    </div>
                </section>

                {/* Transcript Tables for each semester */}
                {transcriptData.map(({ semester, courses, semesterGPA, totalCredits }) => (
                    <section key={semester} className="mb-10 print:mb-6">
                        <h2 className="text-2xl font-semibold text-indigo-800 mb-4 print:text-base">
                            Semester {semester}
                        </h2>

                        <table className="w-full border-collapse border border-gray-300 print:text-xs">
                            <thead>
                                <tr className="bg-indigo-100 text-indigo-900 print:bg-gray-200">
                                    <th className="border border-gray-300 px-3 py-2 text-left">Course Code</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Course Name</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Credit Hours</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Grade</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Grade Point</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(({ code, name, creditHours, grade, gradePoint }) => (
                                    <tr key={code} className="even:bg-gray-50 print:even:bg-white">
                                        <td className="border border-gray-300 px-3 py-2">{code}</td>
                                        <td className="border border-gray-300 px-3 py-2">{name}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{creditHours}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{grade}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{gradePoint.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="font-semibold bg-indigo-50 print:bg-gray-100">
                                    <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right">
                                        Semester Total Credits:
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">{totalCredits}</td>
                                    <td className="border border-gray-300 px-3 py-2 text-right">Semester GPA:</td>
                                    <td className="border border-gray-300 px-3 py-2 text-center">{semesterGPA.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                ))}

                {/* Cumulative GPA */}
                <section className="border-t border-gray-400 pt-6 mt-8 print:mt-4 print:pt-3">
                    <h3 className="text-xl font-semibold text-indigo-900 mb-2 print:text-sm">Cumulative GPA</h3>
                    <p className="text-gray-700 font-semibold text-lg print:text-xs">
                        {cumulativeGPA.toFixed(2)}
                    </p>
                </section>

                {/* Actions */}
                <div className="mt-12 flex gap-4 print:hidden justify-center">
                    <button
                        onClick={printPDF}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded shadow"
                        aria-label="Print Transcript"
                    >
                        Print Transcript
                    </button>

                    <Link
                        href="/dashboard/student/support"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded shadow"
                        aria-label="Report an Issue"
                    >
                        Report an Issue
                    </Link>
                </div>

                <style jsx global>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #print-area,
                        #print-area * {
                            visibility: visible;
                        }
                        #print-area {
                            position: relative;
                            top: 0;
                            left: 0;
                            width: 100%;
                            margin: 0 auto;
                            box-shadow: none !important;
                        }
                        footer {
                            position: fixed !important;
                            bottom: 0;
                            width: 100%;
                            background: white;
                            padding: 4px 0;
                            box-shadow: none !important;
                        }
                    }
                `}</style>
            </section>
        </DashboardLayout>
    );
}
