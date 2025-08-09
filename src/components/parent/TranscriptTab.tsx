import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface TranscriptRecord {
    courseCode: string;
    courseTitle: string;
    semester: string;
    year: number;
    grade: string;
    credits: number;
}

interface TranscriptTabProps {
    transcript: TranscriptRecord[];
}

export default function TranscriptTab({ transcript }: TranscriptTabProps) {
    const printRef = useRef<HTMLDivElement>(null);

    // TS fix: cast to any to avoid the type error (only if update does not fix)
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: "Transcript",
    } as any);

    const calculateGPA = (records: TranscriptRecord[]) => {
        const gradePoints: Record<string, number> = {
            A: 4.0,
            "A-": 3.7,
            "B+": 3.3,
            B: 3.0,
            "B-": 2.7,
            "C+": 2.3,
            C: 2.0,
            "C-": 1.7,
            D: 1.0,
            F: 0.0,
        };

        const totalCredits = records.reduce((acc, r) => acc + r.credits, 0);
        const totalPoints = records.reduce(
            (acc, r) => acc + (gradePoints[r.grade] || 0) * r.credits,
            0
        );

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
    };

    return (
        <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-indigo-900">Transcript</h3>
                {transcript.length > 0 && (
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Download PDF
                    </button>
                )}
            </div>

            {transcript.length === 0 ? (
                <p className="text-gray-700 italic">Transcript is empty.</p>
            ) : (
                <div ref={printRef} className="space-y-4">
                    <table className="w-full border border-indigo-200 text-sm">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Course Code</th>
                                <th className="border px-4 py-2 text-left">Course Title</th>
                                <th className="border px-4 py-2 text-left">Semester</th>
                                <th className="border px-4 py-2 text-left">Year</th>
                                <th className="border px-4 py-2 text-left">Grade</th>
                                <th className="border px-4 py-2 text-left">Credits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transcript.map(
                                ({
                                    courseCode,
                                    courseTitle,
                                    semester,
                                    year,
                                    grade,
                                    credits,
                                }) => (
                                    <tr
                                        key={courseCode + semester + year}
                                        className="hover:bg-indigo-50"
                                    >
                                        <td className="border px-4 py-2">{courseCode}</td>
                                        <td className="border px-4 py-2">{courseTitle}</td>
                                        <td className="border px-4 py-2">{semester}</td>
                                        <td className="border px-4 py-2">{year}</td>
                                        <td className="border px-4 py-2 font-semibold">{grade}</td>
                                        <td className="border px-4 py-2">{credits}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center mt-4 border-t pt-4">
                        <span className="text-gray-700 font-medium">
                            Total Credits: {transcript.reduce((acc, r) => acc + r.credits, 0)}
                        </span>
                        <span className="text-indigo-900 font-semibold">
                            Overall GPA: {calculateGPA(transcript)}
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
}
