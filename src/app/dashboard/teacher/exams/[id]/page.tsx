"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { ArrowLeft, EyeOff } from "lucide-react";

type Exam = {
    id: string;
    title: string;
    subject: string;
    examDate: string;
    status: "Draft" | "Published" | "Archived" | "Approved";
    fileName: string;
    teacherComment?: string;
    previewUrl?: string; // optional URL to preview uploaded file
};

// Dummy data simulates exams (you can replace with real fetch)
const dummyExams: Exam[] = [
    {
        id: "e1",
        title: "Midterm Math Exam",
        subject: "Mathematics",
        examDate: "2025-09-15",
        status: "Approved",
        fileName: "midterm-math.pdf",
        teacherComment: "Please review chapter 1-5",
        previewUrl: "/uploads/midterm-math.pdf",
    },
    {
        id: "e2",
        title: "Final Physics Exam",
        subject: "Physics",
        examDate: "2025-12-10",
        status: "Draft",
        fileName: "final-physics.docx",
    },
];

export default function ExamViewPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id;

    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulate fetching exam by ID - replace this with real API call
        setTimeout(() => {
            const found = dummyExams.find((e) => e.id === examId) || null;
            setExam(found);
            setLoading(false);
        }, 600);
    }, [examId]);

    return (
        <DashboardLayout
        >
            <section className="p-6 max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-900 font-semibold"
                    aria-label="Back to exam list"
                >
                    <ArrowLeft size={20} /> Back to Exams
                </button>

                {loading ? (
                    <p className="text-center text-gray-600 py-12">Loading exam...</p>
                ) : !exam ? (
                    <p className="text-center text-red-600 text-lg font-semibold py-12">
                        Exam not found.
                    </p>
                ) : (
                    <article className="bg-white rounded-lg shadow p-8 border border-indigo-200">
                        <h1 className="text-3xl font-bold mb-4 text-indigo-700">{exam.title}</h1>
                        <p className="mb-2 font-semibold text-indigo-600">Subject: {exam.subject}</p>
                        <p className="mb-2 font-semibold text-indigo-600">
                            Exam Date: {new Date(exam.examDate).toLocaleDateString()}
                        </p>
                        <p
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold select-none mb-4 ${exam.status === "Approved"
                                    ? "bg-green-100 text-green-800"
                                    : exam.status === "Published"
                                        ? "bg-blue-100 text-blue-800"
                                        : exam.status === "Draft"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            Status: {exam.status}
                        </p>
                        {exam.teacherComment && (
                            <p className="mb-6 italic text-gray-600">Comments: {exam.teacherComment}</p>
                        )}

                        {exam.status === "Approved" && (exam.previewUrl || exam.fileName) ? (
                            <div className="border border-gray-300 rounded shadow overflow-hidden h-[600px]">
                                {/* Preview PDF if previewUrl or fallback to fileName (assuming PDFs served in /uploads/) */}
                                <iframe
                                    src={exam.previewUrl || `/uploads/${exam.fileName}`}
                                    title="Exam PDF Preview"
                                    width="100%"
                                    height="100%"
                                    className="block"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded py-20 text-gray-500">
                                <EyeOff size={48} />
                                <p className="mt-4 text-lg font-semibold">
                                    This exam is not approved yet, preview is not available.
                                </p>
                            </div>
                        )}
                    </article>
                )}
            </section>
        </DashboardLayout>
    );
}
