import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FileText, Download, Filter, Search, Award, BookOpen, GraduationCap } from "lucide-react";

interface TranscriptRecord {
    courseCode: string;
    courseTitle: string;
    semester: string;
    year: number;
    grade: string;
    credits: number;
    instructor?: string;
}

interface TranscriptTabProps {
    transcript: TranscriptRecord[];
}

export default function TranscriptTab({ transcript }: TranscriptTabProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const [filterSemester, setFilterSemester] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handlePrint = useReactToPrint({
        // content: () => printRef.current,
        // documentTitle: "Academic Transcript",
        // pageStyle: `
        //     @media print {
        //         body { -webkit-print-color-adjust: exact; }
        //         .no-print { display: none !important; }
        //         .print-break { page-break-after: always; }
        //     }
        // `,
    });

    const calculateGPA = (records: TranscriptRecord[]) => {
        const gradePoints: Record<string, number> = {
            A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
            "C+": 2.3, C: 2.0, "C-": 1.7, D: 1.0, F: 0.0,
        };

        const totalCredits = records.reduce((acc, r) => acc + r.credits, 0);
        const totalPoints = records.reduce(
            (acc, r) => acc + (gradePoints[r.grade] || 0) * r.credits,
            0
        );

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    };

    const getGradeColor = (grade: string) => {
        if (["A", "A-", "A+"].includes(grade)) return "text-green-600 bg-green-50 border-green-200";
        if (["B", "B+", "B-"].includes(grade)) return "text-blue-600 bg-blue-50 border-blue-200";
        if (["C", "C+", "C-"].includes(grade)) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    const filteredTranscript = transcript
        .filter(record => 
            filterSemester === "all" || record.semester === filterSemester
        )
        .filter(record =>
            record.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const semesters = [...new Set(transcript.map(record => record.semester))];
    const totalCredits = transcript.reduce((acc, r) => acc + r.credits, 0);
    const overallGPA = calculateGPA(transcript);
    const filteredGPA = calculateGPA(filteredTranscript);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Academic Transcript</h2>
                        <p className="text-indigo-100">Complete course history and grades</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{overallGPA}</div>
                        <div className="text-indigo-100">Overall GPA</div>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-200" />
                        <span>{transcript.length} Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award size={16} className="text-indigo-200" />
                        <span>{totalCredits} Total Credits</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 no-print">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 sm:max-w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Semesters</option>
                            {semesters.map(semester => (
                                <option key={semester} value={semester}>{semester}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Transcript Content */}
            <div ref={printRef} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                {filteredTranscript.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Transcript Data</h4>
                        <p className="text-gray-500">
                            {searchQuery || filterSemester !== "all" 
                                ? "No courses match your search criteria."
                                : "No transcript records available."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="text-2xl font-bold text-blue-900">{filteredTranscript.length}</div>
                                <div className="text-sm text-blue-700">Courses</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="text-2xl font-bold text-green-900">
                                    {filteredTranscript.reduce((acc, r) => acc + r.credits, 0)}
                                </div>
                                <div className="text-sm text-green-700">Credits</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <div className="text-2xl font-bold text-purple-900">{filteredGPA}</div>
                                <div className="text-sm text-purple-700">GPA</div>
                            </div>
                        </div>

                        {/* Transcript Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Course</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Semester</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Instructor</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Credits</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredTranscript.map((record, index) => (
                                        <tr 
                                            key={`${record.courseCode}-${record.semester}-${record.year}`}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-mono font-medium text-gray-900">
                                                    {record.courseCode}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="max-w-xs">
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {record.courseTitle}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-700">
                                                    {record.semester} {record.year}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-600">
                                                    {record.instructor || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.credits}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(record.grade)}`}>
                                                    {record.grade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Summary */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Showing {filteredTranscript.length} of {transcript.length} courses
                                {filterSemester !== "all" && ` in ${filterSemester}`}
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-gray-700">
                                    <span className="font-semibold">Filtered GPA:</span> {filteredGPA}
                                </div>
                                <div className="text-gray-700">
                                    <span className="font-semibold">Overall GPA:</span> {overallGPA}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}