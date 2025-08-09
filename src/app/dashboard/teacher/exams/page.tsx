"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Upload, FileText, Eye, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

type Exam = {
    id: string;
    title: string;
    subject: string;
    examDate: string; // ISO string
    status: "Draft" | "Published" | "Archived";
    fileName: string;
    teacherComment?: string;
    previewUrl?: string; // Added here to fix TS error
};

const dummyExams: Exam[] = [
    {
        id: "e1",
        title: "Midterm Math Exam",
        subject: "Mathematics",
        examDate: "2025-09-15",
        status: "Published",
        fileName: "midterm-math.pdf",
        teacherComment: "Please review chapter 1-5",
        previewUrl: "/uploads/midterm-math.pdf", // example URL
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

export default function ExamManagementPage() {
    // Flag: does system require teacher to upload exam?
    const [examRequired, setExamRequired] = useState(true);
    const router = useRouter();

    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadComment, setUploadComment] = useState("");

    // These are fixed, come from context / system, no user input:
    const fixedSubject = "Mathematics"; // e.g. teacher's assigned subject/course
    const fixedExamDate = "2025-10-20"; // system exam date

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setExams(dummyExams);
            setLoading(false);

            // Example: simulate system config for examRequired flag
            setExamRequired(true); // change to false to test hiding upload form and show message
        }, 600);
    }, []);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files?.length) {
            setUploadFile(e.target.files[0]);
        }
    }

    function resetUploadForm() {
        setUploadFile(null);
        setUploadTitle("");
        setUploadComment("");
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();

        if (!uploadFile) {
            alert("Please select a file to upload.");
            return;
        }
        if (!uploadTitle.trim()) {
            alert("Please enter the exam title.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", uploadFile);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Upload failed: ${res.statusText}`);
            }

            const data = await res.json();

            const newExam: Exam = {
                id: Date.now().toString(),
                title: uploadTitle.trim(),
                subject: fixedSubject,
                examDate: fixedExamDate,
                status: "Draft",
                fileName: uploadFile.name,
                teacherComment: uploadComment.trim() || undefined,
                previewUrl: data.fileUrl, // Here is the previewUrl stored safely
            };

            setExams((prev) => [newExam, ...prev]);
            alert("Exam uploaded successfully!");
            resetUploadForm();
        } catch (error) {
            alert(`Upload error: ${(error as Error).message}`);
        } finally {
            setUploading(false);
        }
    }

    // Delete exam handler
    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this exam?")) {
            setExams((prev) => prev.filter((e) => e.id !== id));
        }
    }

    // Status badge component
    function StatusBadge({ status }: { status: Exam["status"] }) {
        const colors = {
            Draft: "bg-yellow-100 text-yellow-800",
            Published: "bg-green-100 text-green-800",
            Archived: "bg-gray-100 text-gray-600",
        };
        return (
            <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold select-none ${colors[status]}`}
                aria-label={`Status: ${status}`}
            >
                {status}
            </span>
        );
    }

    return (
        <DashboardLayout
            
        >
            <section className="p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-10 flex items-center gap-4 text-indigo-700">
                    <FileText size={36} /> Exam Management
                </h1>

                {/* Show info message when exam upload is NOT required (and data is loaded) */}
                {!examRequired && !loading && (
                    <div className="mb-12 max-w-3xl mx-auto flex items-center gap-3 rounded-md bg-yellow-50 border border-yellow-300 p-4 text-yellow-800 font-semibold shadow-sm">
                        <Clock size={24} />
                        <p>
                            Exam upload period is not open yet. You can upload exams starting from the
                            scheduled date.
                        </p>
                    </div>
                )}

                {/* Conditionally show upload form if examRequired is true */}
                {examRequired && (
                    <form
                        onSubmit={handleUpload}
                        className="mb-12 bg-indigo-50 rounded-lg shadow-lg p-8 max-w-3xl mx-auto grid grid-cols-1 gap-6"
                        aria-label="Upload new exam form"
                    >
                        <p className="mb-4 text-indigo-700 font-semibold">
                            Upload Exam for <span className="underline">{fixedSubject}</span> (Scheduled on{" "}
                            {new Date(fixedExamDate).toLocaleDateString()})
                        </p>

                        <div>
                            <label
                                htmlFor="uploadTitle"
                                className="block font-semibold mb-2 text-indigo-900"
                            >
                                Exam Title
                            </label>
                            <input
                                id="uploadTitle"
                                type="text"
                                className="w-full border border-indigo-300 rounded-md px-4 py-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="e.g. Midterm Algebra Exam"
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="uploadComment"
                                className="block font-semibold mb-2 text-indigo-900"
                            >
                                Comments / Remarks (optional)
                            </label>
                            <textarea
                                id="uploadComment"
                                rows={3}
                                className="w-full border border-indigo-300 rounded-md px-4 py-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                                placeholder="Add any comments about this exam..."
                                value={uploadComment}
                                onChange={(e) => setUploadComment(e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="uploadFile"
                                className="block font-semibold mb-2 text-indigo-900"
                            >
                                Upload File
                            </label>
                            <label
                                htmlFor="uploadFile"
                                className="relative cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-md border border-indigo-500 bg-white px-4 py-3 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                            >
                                <Upload size={20} />
                                {uploadFile ? uploadFile.name : "Choose File"}
                                <input
                                    type="file"
                                    id="uploadFile"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required={!uploadFile}
                                />
                            </label>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md px-8 py-3 shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {uploading ? "Uploading..." : "Upload Exam"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Exams List */}
                {loading ? (
                    <p className="text-center py-12 text-gray-600 text-lg">Loading exams...</p>
                ) : exams.length === 0 ? (
                    <p className="text-center py-12 text-gray-600 text-lg">No exams uploaded yet.</p>
                ) : (
                    <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
                        {exams.map(
                            ({
                                id,
                                title,
                                subject,
                                examDate,
                                status,
                                fileName,
                                teacherComment,
                                previewUrl,
                            }) => (
                                <article
                                    key={id}
                                    className="flex justify-between items-center bg-white rounded-lg border border-indigo-200 shadow-sm p-6 hover:shadow-lg transition"
                                    role="region"
                                    aria-labelledby={`exam-title-${id}`}
                                >
                                    <div>
                                        <h3
                                            id={`exam-title-${id}`}
                                            className="text-xl font-bold text-indigo-800 mb-1"
                                            title={title}
                                        >
                                            {title}
                                        </h3>
                                        <p className="text-indigo-600 font-medium mb-0.5">Subject: {subject}</p>
                                        <p className="text-indigo-600 font-medium mb-0.5">
                                            Exam Date: {new Date(examDate).toLocaleDateString()}
                                        </p>
                                        <StatusBadge status={status} />
                                        {teacherComment && (
                                            <p className="text-gray-500 mt-2 italic">Comment: {teacherComment}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-2">File: {fileName}</p>

                                        {/* If previewUrl is available, show a preview link */}
                                        {previewUrl && (
                                            <p className="mt-1">
                                                <a
                                                    href={previewUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 underline hover:text-indigo-800"
                                                >
                                                    Preview File
                                                </a>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            aria-label={`View exam ${title}`}
                                            onClick={() => router.push(`/dashboard/teacher/exams/${id}`)}
                                            className="text-indigo-600 hover:text-indigo-900 transition rounded p-2 hover:bg-indigo-100"
                                            title="View Exam"
                                        >
                                            <Eye size={20} />
                                        </button>

                                        {/* Uncomment if delete is needed */}
                                        {/* <button
                      aria-label={`Delete exam ${title}`}
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:text-red-900 transition rounded p-2 hover:bg-red-100"
                      title="Delete Exam"
                    >
                      <Trash2 size={20} />
                    </button> */}
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
