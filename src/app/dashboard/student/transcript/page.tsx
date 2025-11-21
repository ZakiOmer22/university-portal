"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Printer, Download, Flag, Award, BookOpen, Calendar, User, Shield } from "lucide-react";

interface CourseRecord {
    code: string;
    name: string;
    creditHours: number;
    grade: string;
    gradePoint: number;
}

interface SemesterRecord {
    semester: number;
    courses: CourseRecord[];
    semesterGPA: number;
    totalCredits: number;
}

function generateCoursesForSemester(sem: number): CourseRecord[] {
    const courses = [
        { code: `CS${sem}01`, name: "Introduction to Programming", creditHours: 3 },
        { code: `MATH${sem}02`, name: "Calculus and Analytical Geometry", creditHours: 4 },
        { code: `ENG${sem}03`, name: "English Composition and Communication", creditHours: 2 },
        { code: `HIST${sem}04`, name: "World History and Civilizations", creditHours: 3 },
        { code: `PHY${sem}05`, name: "Physics Fundamentals", creditHours: 3 },
        { code: `ELEC${sem}06`, name: "Professional Elective Course", creditHours: 2 },
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

function GradeBadge({ grade }: { grade: string }) {
    const getGradeColor = (grade: string) => {
        if (grade === "A" || grade === "A-") return "bg-green-100 text-green-800 border-green-200";
        if (grade === "B+" || grade === "B" || grade === "B-") return "bg-blue-100 text-blue-800 border-blue-200";
        if (grade === "C+" || grade === "C" || grade === "C-") return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (grade === "D") return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-red-100 text-red-800 border-red-200";
    };

    return (
        <Badge className={`${getGradeColor(grade)} font-mono font-bold`}>
            {grade}
        </Badge>
    );
}

export default function TranscriptLetterPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        
        setTimeout(() => setLoading(false), 700);
    }, []);

    const cumulative = transcriptData.reduce(
        (acc, sem) => {
            acc.totalPoints += sem.semesterGPA * sem.totalCredits;
            acc.totalCredits += sem.totalCredits;
            return acc;
        },
        { totalPoints: 0, totalCredits: 0 }
    );

    const cumulativeGPA = cumulative.totalCredits > 0 ? cumulative.totalPoints / cumulative.totalCredits : 0;
    const totalCredits = cumulative.totalCredits;

    function getGPAStatus(gpa: number) {
        if (gpa >= 3.7) return { text: "First Class Honors", color: "text-green-600", bg: "bg-green-50" };
        if (gpa >= 3.3) return { text: "Second Class Upper", color: "text-blue-600", bg: "bg-blue-50" };
        if (gpa >= 3.0) return { text: "Second Class Lower", color: "text-yellow-600", bg: "bg-yellow-50" };
        if (gpa >= 2.0) return { text: "Pass", color: "text-orange-600", bg: "bg-orange-50" };
        return { text: "Conditional", color: "text-red-600", bg: "bg-red-50" };
    }

    const gpaStatus = getGPAStatus(cumulativeGPA);

    function printPDF() {
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

    return (
        <DashboardLayout loading={false} user={user}>
            <div className="max-w-6xl mx-auto space-y-6 print:max-w-none print:mx-0">
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Academic Transcript</h1>
                        <p className="text-gray-600 mt-2">Official record of your academic performance</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={printPDF}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Printer size={20} />
                            Print Transcript
                        </button>
                        <button className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200">
                            <Download size={20} />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Transcript Document */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:rounded-none print:border-0">
                    {/* University Header */}
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
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold print:text-2xl">University of Hargeisa</h1>
                                    <p className="text-indigo-200 text-lg print:text-sm">Quality Education for National Development</p>
                                </div>
                            </div>
                            <div className="text-right print:text-sm">
                                <p className="text-indigo-200">Official Academic Transcript</p>
                                <p className="font-semibold">Document No: TR-{Date.now().toString().slice(-8)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="p-8 print:p-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Student Name</div>
                                        <div className="font-semibold text-gray-900 text-lg">{user?.fullName || "Zaki Omer"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Student ID</div>
                                        <div className="font-semibold text-gray-900">2025-123456</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Program</div>
                                        <div className="font-semibold text-gray-900">Bachelor of Computer Science</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Date of Issue</div>
                                        <div className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Award className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Academic Year</div>
                                        <div className="font-semibold text-gray-900">2024-2025</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Current Semester</div>
                                        <div className="font-semibold text-gray-900">6 of 8</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Summary */}
                    <div className="p-8 print:p-6 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">{cumulativeGPA.toFixed(2)}</div>
                                <div className="text-sm text-gray-600">Cumulative GPA</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{totalCredits}</div>
                                <div className="text-sm text-gray-600">Total Credits</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-lg font-bold ${gpaStatus.color}`}>{gpaStatus.text}</div>
                                <div className="text-sm text-gray-600">Academic Standing</div>
                            </div>
                        </div>
                    </div>

                    {/* Semester Transcripts */}
                    <div className="p-8 print:p-6">
                        {transcriptData.map(({ semester, courses, semesterGPA, totalCredits }) => (
                            <div key={semester} className="mb-12 last:mb-0 print:mb-8">
                                <div className="flex items-center justify-between mb-6 print:mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 print:text-xl">
                                        Semester {semester}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>GPA: <strong className="text-gray-900">{semesterGPA.toFixed(2)}</strong></span>
                                        <span>Credits: <strong className="text-gray-900">{totalCredits}</strong></span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300 text-sm print:text-xs">
                                        <thead>
                                            <tr className="bg-indigo-50 print:bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Course Code</th>
                                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Course Name</th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Credits</th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Grade</th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Grade Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map(({ code, name, creditHours, grade, gradePoint }) => (
                                                <tr key={code} className="hover:bg-gray-50 print:hover:bg-transparent">
                                                    <td className="border border-gray-300 px-4 py-3 font-mono">{code}</td>
                                                    <td className="border border-gray-300 px-4 py-3">{name}</td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">{creditHours}</td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        <GradeBadge grade={grade} />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center font-mono">
                                                        {gradePoint.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-8 print:p-6 border-t border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="text-sm text-gray-600">
                                <p>This is an official document issued by the University of Hargeisa.</p>
                                <p>Any alteration invalidates this transcript.</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                                <p>Registrar&apos;s Office</p>
                                <p>University of Hargeisa</p>
                                <p>Hargeisa, Somaliland</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 print:hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help with Your Transcript?</h3>
                            <p className="text-gray-600">Report any discrepancies or issues with your academic record.</p>
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
                        size: A4;
                        margin: 0.5in;
                    }
                    
                    body {
                        background: white !important;
                        font-size: 12pt;
                        line-height: 1.4;
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
                        padding: 1.5rem !important;
                    }
                    
                    .print\\:mb-8 {
                        margin-bottom: 2rem !important;
                    }
                    
                    .print\\:text-2xl {
                        font-size: 1.5rem !important;
                    }
                    
                    .print\\:text-xl {
                        font-size: 1.25rem !important;
                    }
                    
                    .print\\:text-sm {
                        font-size: 0.875rem !important;
                    }
                    
                    .print\\:text-xs {
                        font-size: 0.75rem !important;
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
                    
                    /* Hide all other elements */
                    body > *:not(#__next) {
                        display: none !important;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
}