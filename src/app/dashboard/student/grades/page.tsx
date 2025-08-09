"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, CheckCircle2, XCircle, Upload } from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    currentGrade: number; // percentage
}

type ReviewStatus = "pending" | "resolved" | "rejected";

interface GradeReviewRequest {
    id: string;
    courseId: string;
    message: string;
    attachmentFileName?: string;
    status: ReviewStatus;
    createdAt: string;
    responseMessage?: string;
}

// Dummy courses and reviews for demo:
const dummyCourses: Course[] = [
    { id: "course-uuid-1", code: "CS101", name: "Computer Science 101", currentGrade: 92.5 },
    { id: "course-uuid-2", code: "MATH201", name: "Advanced Mathematics", currentGrade: 87 },
];

const dummyGradeReviews: GradeReviewRequest[] = [
    {
        id: "rev-1",
        courseId: "course-uuid-1",
        message: "I think the grade on my final project was unfair due to grading criteria...",
        status: "pending",
        createdAt: "2025-08-01T10:00:00Z",
    },
    {
        id: "rev-2",
        courseId: "course-uuid-2",
        message: "Could you review my midterm exam grading? I believe some answers were marked incorrectly.",
        status: "resolved",
        createdAt: "2025-07-15T15:20:00Z",
        responseMessage: "After review, your grade was correct. Thank you.",
    },
];

export default function GradeReviewPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [reviews, setReviews] = useState<GradeReviewRequest[]>([]);

    // Form state
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",
        "application/x-rar-compressed",
        "text/plain",
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        // Simulate loading data
        setTimeout(() => {
            setCourses(dummyCourses);
            setReviews(dummyGradeReviews);
            setLoading(false);
        }, 1000);
    }, []);

    // File selection handler
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubmitError(null);
        setSubmitSuccess(null);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!allowedTypes.includes(file.type)) {
                setSubmitError(
                    `File type "${file.type}" not allowed. Allowed types: PDF, DOC, DOCX, ZIP, RAR, TXT.`
                );
                e.target.value = "";
                return;
            }
            setSelectedFile(file);
        }
    }

    // Submit handler
    async function handleSubmit() {
        setSubmitError(null);
        setSubmitSuccess(null);

        if (!selectedCourseId) {
            setSubmitError("Please select a course.");
            return;
        }
        if (!message.trim()) {
            setSubmitError("Please enter your message.");
            return;
        }
        if (submitting) return;

        // Check if pending review exists for this course
        const existingPending = reviews.find(
            (r) => r.courseId === selectedCourseId && r.status === "pending"
        );
        if (existingPending) {
            setSubmitError("You already have a pending review request for this course.");
            return;
        }

        // Confirm submission
        if (!window.confirm("Submit this grade review request?")) return;

        setSubmitting(true);

        // Simulate sending request and uploading file
        setTimeout(() => {
            const newReview: GradeReviewRequest = {
                id: `rev-${Date.now()}`,
                courseId: selectedCourseId,
                message,
                attachmentFileName: selectedFile?.name,
                status: "pending",
                createdAt: new Date().toISOString(),
            };
            setReviews((prev) => [newReview, ...prev]);
            setSubmitSuccess("Grade review request submitted successfully.");
            setSelectedCourseId("");
            setMessage("");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setSubmitting(false);
        }, 1500);
    }

    // Helper to get course name from id
    function getCourseName(id: string) {
        return courses.find((c) => c.id === id)?.name ?? "";
    }

    function statusBadge(status: ReviewStatus) {
        switch (status) {
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <Clock size={14} />
                        Pending
                    </Badge>
                );
            case "resolved":
                return (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Resolved
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                        <XCircle size={14} />
                        Rejected
                    </Badge>
                );
        }
    }

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900">Grade Review Requests</h1>

                {/* Submit new review */}
                <section className="border border-indigo-200 rounded p-4 space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-900">Submit New Review Request</h2>

                    <div>
                        <label htmlFor="course-select" className="block mb-1 font-semibold">
                            Select Course
                        </label>
                        <select
                            id="course-select"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full rounded border border-gray-300 p-2"
                            disabled={submitting}
                            aria-required="true"
                        >
                            <option value="">-- Select a course --</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.code} - {c.name} (Current Grade: {c.currentGrade.toFixed(1)}%)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="review-message" className="block mb-1 font-semibold">
                            Message
                        </label>
                        <textarea
                            id="review-message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full rounded border border-gray-300 p-2 resize-y"
                            disabled={submitting}
                            aria-required="true"
                            placeholder="Explain your concerns or questions about the grade."
                        />
                    </div>

                    <div>
                        <label htmlFor="file-upload" className="block mb-1 font-semibold cursor-pointer">
                            <div
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                                }}
                                className={`inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition select-none ${submitting ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                aria-describedby="fileHelp"
                            >
                                <Upload size={20} />
                                {selectedFile ? selectedFile.name : "Attach Supporting Document (optional)"}
                            </div>
                        </label>
                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.zip,.rar,.txt"
                            onChange={handleFileChange}
                            disabled={submitting}
                            className="hidden"
                        />
                        <div id="fileHelp" className="text-sm text-gray-600 mt-1">
                            Allowed formats: PDF, DOC, DOCX, ZIP, RAR, TXT
                        </div>
                    </div>

                    {submitError && (
                        <p className="text-red-600" role="alert">
                            {submitError}
                        </p>
                    )}

                    {submitSuccess && (
                        <p className="text-green-600" role="status">
                            {submitSuccess}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`px-6 py-2 rounded text-white transition ${submitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        aria-label="Submit grade review request"
                    >
                        {submitting ? "Submitting..." : "Submit Review Request"}
                    </button>
                </section>

                {/* Existing reviews */}
                <section>
                    <h2 className="text-xl font-semibold text-indigo-900 mb-4">Your Previous Requests</h2>
                    {reviews.length === 0 ? (
                        <p className="italic text-gray-600">You have not submitted any grade review requests yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {reviews.map((r) => (
                                <li
                                    key={r.id}
                                    className="border border-gray-300 rounded p-4 bg-white shadow-sm space-y-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">
                                            {getCourseName(r.courseId)} - Request
                                        </h3>
                                        {statusBadge(r.status)}
                                    </div>
                                    <p className="whitespace-pre-wrap">{r.message}</p>
                                    {r.attachmentFileName && (
                                        <p>
                                            Attached file: <strong>{r.attachmentFileName}</strong>
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Submitted on {new Date(r.createdAt).toLocaleString()}
                                    </p>
                                    {r.responseMessage && (
                                        <p className={`italic ${r.status === "rejected" ? "text-red-600" : "text-green-700"
                                            }`}>
                                            Response: {r.responseMessage}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </section>
        </DashboardLayout>
    );
}
