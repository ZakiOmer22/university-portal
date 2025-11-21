"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Printer, Download, Flag, BookOpen, Calendar, Award, ChevronDown, BarChart3 } from "lucide-react";

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

function generateExamData(sem: number): SemesterExamReport {
    const coursesBase = [
        { code: `CS${sem}01`, name: "Introduction to Programming", creditHours: 3 },
        { code: `MATH${sem}02`, name: "Calculus and Analytical Geometry", creditHours: 4 },
        { code: `ENG${sem}03`, name: "English Composition and Communication", creditHours: 2 },
        { code: `HIST${sem}04`, name: "World History and Civilizations", creditHours: 3 },
        { code: `PHY${sem}05`, name: "Physics Fundamentals", creditHours: 3 },
        { code: `ELEC${sem}06`, name: "Professional Elective Course", creditHours: 2 },
    ];

    const randomScore = () => Math.floor(Math.random() * 41) + 60;

    const courses = coursesBase.map((course, i) => {
        const midterm = randomScore();
        const final = randomScore();
        const assignment = randomScore();
        const total = Math.round(midterm * 0.3 + final * 0.5 + assignment * 0.2);
        
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

function GradeBadge({ score }: { score: number }) {
    const getGradeColor = (score: number) => {
        if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
        if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
        if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (score >= 60) return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-red-100 text-red-800 border-red-200";
    };

    return (
        <Badge className={`${getGradeColor(score)} font-mono font-bold`}>
            {score}
        </Badge>
    );
}

function getGPAStatus(gpa: number) {
    if (gpa >= 3.7) return { text: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (gpa >= 3.3) return { text: "Very Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (gpa >= 3.0) return { text: "Good", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (gpa >= 2.0) return { text: "Satisfactory", color: "text-orange-600", bg: "bg-orange-50" };
    return { text: "Needs Improvement", color: "text-red-600", bg: "bg-red-50" };
}

export default function ExamReportPage() {
    const [selectedSem, setSelectedSem] = useState(1);
    const [report, setReport] = useState<SemesterExamReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        const data = generateExamData(selectedSem);
        setReport(data);
        setLoading(false);
    }, [selectedSem]);

    function printReport() {
        window.print();
    }

    if (loading) {
        return (
            <DashboardLayout loading={true} user={user}>
                <div className="max-w-6xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </DashboardLayout>
        );
    }

    const gpaStatus = report ? getGPAStatus(report.semesterGPA) : null;

    return (
        <DashboardLayout loading={false} user={user}>
            <div className="max-w-6xl mx-auto space-y-6 print:max-w-none print:mx-0">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Exam Performance Report</h1>
                        <p className="text-gray-600 mt-2">Detailed analysis of your academic performance by semester</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={printReport}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Printer size={20} />
                            Print Report
                        </button>
                        <button className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200">
                            <Download size={20} />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Semester Selector */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:hidden">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <label className="font-semibold text-gray-700">Select Semester:</label>
                        </div>
                        <select
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            value={selectedSem}
                            onChange={(e) => setSelectedSem(Number(e.target.value))}
                        >
                            {semesters.map((sem) => (
                                <option key={sem} value={sem}>
                                    Semester {sem} - {sem === 1 ? "First Year" : sem === 2 ? "First Year" : sem === 3 ? "Second Year" : sem === 4 ? "Second Year" : sem === 5 ? "Third Year" : "Third Year"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Exam Report Document */}
                {report && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:rounded-none print:border-0">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white print:bg-indigo-600 print:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 relative bg-white rounded-xl p-2 print:w-16 print:h-16">
                                        <Image
                                            src="/favicon.ico"
                                            alt="University Logo"
                                            fill
                                            sizes="80px"
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold print:text-2xl">University of Hargeisa</h1>
                                        <p className="text-indigo-200 text-lg print:text-sm">Official Examination Report</p>
                                    </div>
                                </div>
                                <div className="text-right print:text-sm">
                                    <p className="text-indigo-200">Semester {report.semester}</p>
                                    <p className="font-semibold">Report No: EX-{Date.now().toString().slice(-8)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Student Info & Summary */}
                        <div className="p-8 print:p-6 border-b border-gray-200">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500">Student Name</div>
                                            <div className="font-semibold text-gray-900 text-lg">{user?.fullName || "Zaki Omer"}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500">Student ID</div>
                                            <div className="font-semibold text-gray-900">2025-123456</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500">Academic Year</div>
                                            <div className="font-semibold text-gray-900">2024-2025</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <BarChart3 className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500">Program</div>
                                            <div className="font-semibold text-gray-900">Bachelor of Computer Science</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-indigo-600">{report.semesterGPA.toFixed(2)}</div>
                                    <div className="text-sm text-gray-600">Semester GPA</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{report.totalCredits}</div>
                                    <div className="text-sm text-gray-600">Total Credits</div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-lg font-bold ${gpaStatus?.color}`}>{gpaStatus?.text}</div>
                                    <div className="text-sm text-gray-600">Performance</div>
                                </div>
                            </div>
                        </div>

                        {/* Exam Results Table */}
                        <div className="p-8 print:p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 print:text-xl flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                                Detailed Course Results - Semester {report.semester}
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 text-sm print:text-xs">
                                    <thead>
                                        <tr className="bg-indigo-50 print:bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Course Code</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Course Name</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Credits</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Midterm (30%)</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Final (50%)</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Assignment (20%)</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Total Score</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Grade Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.courses.map((course) => (
                                            <tr key={course.code} className="hover:bg-gray-50 print:hover:bg-transparent">
                                                <td className="border border-gray-300 px-4 py-3 font-mono font-semibold">{course.code}</td>
                                                <td className="border border-gray-300 px-4 py-3">{course.name}</td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">{course.creditHours}</td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    <GradeBadge score={course.midterm} />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    <GradeBadge score={course.final} />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    <GradeBadge score={course.assignment} />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 font-bold">
                                                        {course.total}
                                                    </Badge>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center font-mono font-semibold">
                                                    {course.gradePoint.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Grading Legend */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 print:text-xs">
                                <h3 className="font-semibold text-gray-900 mb-2">Grading Scale:</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                                        <span>90-100: A (4.0)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                                        <span>80-89: B+ (3.3-3.7)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                                        <span>70-79: B-C+ (2.7-3.0)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
                                        <span>60-69: C-D (1.0-2.3)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                                        <span>Below 60: F (0.0)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-8 print:p-6 border-t border-gray-200">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    <p>This examination report is generated by the University of Hargeisa Portal System.</p>
                                    <p>For any discrepancies, please contact the examination office within 7 days.</p>
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                    <p>Examination Office</p>
                                    <p>University of Hargeisa</p>
                                    <p>Hargeisa, Somaliland</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Support Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 print:hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Questions About Your Results?</h3>
                            <p className="text-gray-600">Report any discrepancies or request clarification for your exam scores.</p>
                        </div>
                        <Link
                            href="/dashboard/student/support"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                        >
                            <Flag size={20} />
                            Report Issue
                        </Link>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0.5in;
                    }
                    
                    body {
                        background: white !important;
                        font-size: 10pt;
                        line-height: 1.3;
                    }
                    
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    .print\\:max-w-none {
                        max-width: none !important;
                    }
                    
                    .print\\:mx-0 {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                    }
                    
                    .print\\:p-6 {
                        padding: 1rem !important;
                    }
                    
                    .print\\:text-2xl {
                        font-size: 1.25rem !important;
                    }
                    
                    .print\\:text-xl {
                        font-size: 1.125rem !important;
                    }
                    
                    .print\\:text-sm {
                        font-size: 0.75rem !important;
                    }
                    
                    .print\\:text-xs {
                        font-size: 0.625rem !important;
                    }
                    
                    .print\\:bg-gray-100 {
                        background-color: #f3f4f6 !important;
                    }
                    
                    .print\\:bg-indigo-600 {
                        background-color: #4f46e5 !important;
                    }
                    
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                    
                    .print\\:border-0 {
                        border: 0 !important;
                    }
                    
                    .print\\:hover\\:bg-transparent:hover {
                        background-color: transparent !important;
                    }
                    
                    /* Table optimizations for print */
                    table {
                        page-break-inside: auto;
                    }
                    
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    
                    /* Hide all other elements */
                    body > *:not(#__next) {
                        display: none !important;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
}