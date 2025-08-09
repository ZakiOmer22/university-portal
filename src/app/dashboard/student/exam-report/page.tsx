"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import Image from "next/image";
import Link from "next/link";

interface CourseScores {
    code: string;
    name: string;
    creditHours: number;
    midterm: number;
    final: number;
    assignment: number;
    total: number;
    gradePoint: number;
}

interface SemesterExamReport {
    semester: number;
    courses: CourseScores[];
    semesterGPA: number;
    totalCredits: number;
}

// Generate dummy course scores data per semester
function generateExamData(sem: number): SemesterExamReport {
    const coursesBase = [
        { code: `CS${sem}01`, name: "Intro to Programming", creditHours: 3 },
        { code: `MATH${sem}02`, name: "Calculus", creditHours: 4 },
        { code: `ENG${sem}03`, name: "English Composition", creditHours: 2 },
        { code: `HIST${sem}04`, name: "World History", creditHours: 3 },
        { code: `PHY${sem}05`, name: "Physics", creditHours: 3 },
        { code: `ELEC${sem}06`, name: "Elective Course", creditHours: 2 },
    ];

    // Random scores generator for demo
    const randomScore = () => Math.floor(Math.random() * 41) + 60; // 60 to 100

    const courses = coursesBase.map((course, i) => {
        const midterm = randomScore();
        const final = randomScore();
        const assignment = randomScore();
        const total = Math.round(midterm * 0.3 + final * 0.5 + assignment * 0.2);
        // Map total score to grade point scale (simplified)
        let gradePoint = 0;
        if (total >= 90) gradePoint = 4.0;
        else if (total >= 85) gradePoint = 3.7;
        else if (total >= 80) gradePoint = 3.3;
        else if (total >= 75) gradePoint = 3.0;
        else if (total >= 70) gradePoint = 2.7;
        else if (total >= 65) gradePoint = 2.3;
        else if (total >= 60) gradePoint = 2.0;
        else gradePoint = 0;

        return {
            ...course,
            midterm,
            final,
            assignment,
            total,
            gradePoint,
        };
    });

    // Calculate semester GPA weighted by credits
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(({ creditHours, gradePoint }) => {
        totalPoints += creditHours * gradePoint;
        totalCredits += creditHours;
    });
    const semesterGPA = totalPoints / totalCredits;

    return { semester: sem, courses, semesterGPA, totalCredits };
}

const semesters = [1, 2, 3, 4, 5, 6];

export default function ExamReportPage() {
    const [selectedSem, setSelectedSem] = useState(1);
    const [report, setReport] = useState<SemesterExamReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const data = generateExamData(selectedSem);
        setReport(data);
        setLoading(false);
    }, [selectedSem]);

    function printReport() {
        window.print();
    }

    return (
        <DashboardLayout loading={loading} user={null}>
            <section
                className="max-w-6xl mx-auto bg-white p-6 rounded shadow my-8 print:p-4 print:shadow-none print:my-0 font-serif relative"
                id="print-area"
            >
                {/* HEADER */}
                <header className="flex items-center justify-between mb-8 print:mb-4 border-b border-gray-300 pb-3 print:pb-2 print:border-b-2 print:border-indigo-900 print:mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative print:w-12 print:h-12">
                            <Image
                                src="/favicon.ico"
                                alt="University Logo"
                                fill
                                sizes="64px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-900 print:text-xl leading-tight">
                                University of Hargeisa
                            </h1>
                            <p className="italic text-gray-700 print:text-xs print:italic">
                                Official Exam Report
                            </p>
                            <p className="text-sm text-gray-600 print:text-[10px]">
                                Comprehensive examination results per semester
                            </p>
                        </div>
                    </div>

                    {/* Semester selector */}
                    <select
                        className="border border-indigo-600 rounded px-3 py-2 text-indigo-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        value={selectedSem}
                        onChange={(e) => setSelectedSem(Number(e.target.value))}
                        aria-label="Select semester"
                    >
                        {semesters.map((sem) => (
                            <option key={sem} value={sem}>
                                Semester {sem}
                            </option>
                        ))}
                    </select>
                </header>

                {/* DESCRIPTION */}
                <p className="mb-6 text-gray-700 print:text-xs print:mb-4">
                    This report details the student's performance in all courses taken during the selected semester, including midterm, final exams, and assignments. The total score is a weighted average reflecting the contribution of each assessment type.
                </p>

                {/* REPORT TABLE */}
                {report && (
                    <table className="w-full border-collapse border border-gray-300 print:text-xs">
                        <thead>
                            <tr className="bg-indigo-100 text-indigo-900 print:bg-gray-200">
                                <th className="border border-gray-300 px-3 py-2 text-left">Course Code</th>
                                <th className="border border-gray-300 px-3 py-2 text-left">Course Name</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Credit Hours</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Midterm (30%)</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Final (50%)</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Assignment (20%)</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Total</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Grade Point</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.courses.map(
                                ({ code, name, creditHours, midterm, final, assignment, total, gradePoint }) => (
                                    <tr key={code} className="even:bg-gray-50 print:even:bg-white">
                                        <td className="border border-gray-300 px-3 py-2">{code}</td>
                                        <td className="border border-gray-300 px-3 py-2">{name}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{creditHours}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{midterm}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{final}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{assignment}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center font-semibold">{total}</td>
                                        <td className="border border-gray-300 px-3 py-2 text-center">{gradePoint.toFixed(2)}</td>
                                    </tr>
                                )
                            )}
                            <tr className="font-semibold bg-indigo-50 print:bg-gray-100">
                                <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right">
                                    Semester Total Credits:
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center">{report.totalCredits}</td>
                                <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right">
                                    Semester GPA:
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center">{report.semesterGPA.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {/* FOOTER */}
                <footer className="mt-12 text-center text-gray-600 text-sm print:text-xs print:fixed print:bottom-0 print:left-0 print:right-0 print:bg-white print:py-2 print:border-t print:border-gray-300">
                    Powered by University Portal ealif Team
                </footer>

                {/* ACTIONS */}
                <div className="mt-10 flex gap-4 justify-center print:hidden">
                    <button
                        onClick={printReport}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded shadow"
                        aria-label="Print Exam Report"
                    >
                        Print Exam Report
                    </button>

                    <Link
                        href="/dashboard/student/support"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded shadow"
                        aria-label="Report an Issue"
                    >
                        Report an Issue
                    </Link>
                </div>

                {/* PRINT STYLES */}
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
              padding-bottom: 40px; /* for footer space */
            }
            footer {
              position: fixed !important;
              bottom: 0;
              width: 100%;
              background: white;
              padding: 8px 0;
              box-shadow: none !important;
              text-align: center;
              font-size: 10px;
              color: #555;
              border-top: 1px solid #ddd;
            }
            header {
              page-break-after: avoid;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}</style>
            </section>
        </DashboardLayout>
    );
}
