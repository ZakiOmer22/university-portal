"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, CheckCircle2, XCircle, Upload, FileText, MessageSquare, BookOpen, Send, Download } from "lucide-react";

interface Course {
    id: string;
    code: string;
    name: string;
    currentGrade: number;
    instructor?: string;
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
    responseDate?: string;
}

// Dummy courses and reviews for demo:
const dummyCourses: Course[] = [
    { 
        id: "course-uuid-1", 
        code: "CS101", 
        name: "Computer Science 101", 
        currentGrade: 92.5,
        instructor: "Dr. Smith"
    },
    { 
        id: "course-uuid-2", 
        code: "MATH201", 
        name: "Advanced Mathematics", 
        currentGrade: 87,
        instructor: "Prof. Jane"
    },
    { 
        id: "course-uuid-3", 
        code: "ENG201", 
        name: "Academic Writing", 
        currentGrade: 78.5,
        instructor: "Ms. Johnson"
    },
];

const dummyGradeReviews: GradeReviewRequest[] = [
    {
        id: "rev-1",
        courseId: "course-uuid-1",
        message: "I believe the grade on my final project was unfair. According to the rubric, I should have received full marks for the implementation section, but I was deducted 10 points without clear explanation.",
        attachmentFileName: "project_rubric_comparison.pdf",
        status: "pending",
        createdAt: "2025-08-01T10:00:00Z",
    },
    {
        id: "rev-2",
        courseId: "course-uuid-2",
        message: "Could you review my midterm exam grading? I believe questions 3 and 7 were marked incorrectly. For question 3, my solution follows the correct methodology, and for question 7, I think there was a calculation error in the grading.",
        status: "resolved",
        createdAt: "2025-07-15T15:20:00Z",
        responseMessage: "After careful review, we found that your answer for question 7 was indeed correct. Your grade has been updated from 85% to 87%. For question 3, the original grading stands as your solution missed a key step.",
        responseDate: "2025-07-18T09:15:00Z"
    },
    {
        id: "rev-3",
        courseId: "course-uuid-3",
        message: "I would like to request a review of my research paper grade. The feedback mentions lack of citations, but I included 8 peer-reviewed sources as required.",
        attachmentFileName: "research_paper_citations.docx",
        status: "rejected",
        createdAt: "2025-07-10T14:30:00Z",
        responseMessage: "Upon review, we found that while you included the required number of citations, they were not properly formatted according to APA guidelines as specified in the assignment requirements. The grade remains unchanged.",
        responseDate: "2025-07-12T11:45:00Z"
    },
];

function StatusBadge({ status }: { status: ReviewStatus }) {
    switch (status) {
        case "pending":
            return (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                    <Clock size={14} />
                    Under Review
                </Badge>
            );
        case "resolved":
            return (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Resolved
                </Badge>
            );
        case "rejected":
            return (
                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <XCircle size={14} />
                    Request Denied
                </Badge>
            );
    }
}

export default function GradeReviewPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [reviews, setReviews] = useState<GradeReviewRequest[]>([]);

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

        setTimeout(() => {
            setCourses(dummyCourses);
            setReviews(dummyGradeReviews);
            setLoading(false);
        }, 1000);
    }, []);

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

    async function handleSubmit() {
        setSubmitError(null);
        setSubmitSuccess(null);

        if (!selectedCourseId) {
            setSubmitError("Please select a course.");
            return;
        }
        if (!message.trim()) {
            setSubmitError("Please enter your review message.");
            return;
        }
        if (submitting) return;

        const existingPending = reviews.find(
            (r) => r.courseId === selectedCourseId && r.status === "pending"
        );
        if (existingPending) {
            setSubmitError("You already have a pending review request for this course.");
            return;
        }

        if (!window.confirm("Submit this grade review request?")) return;

        setSubmitting(true);

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
            setSubmitSuccess("Grade review request submitted successfully!");
            setSelectedCourseId("");
            setMessage("");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setSubmitting(false);
        }, 1500);
    }

    function getCourseName(id: string) {
        return courses.find((c) => c.id === id)?.name ?? "";
    }

    function getCourseCode(id: string) {
        return courses.find((c) => c.id === id)?.code ?? "";
    }

    function getCourseInstructor(id: string) {
        return courses.find((c) => c.id === id)?.instructor ?? "";
    }

    const pendingCount = reviews.filter(r => r.status === "pending").length;
    const resolvedCount = reviews.filter(r => r.status === "resolved").length;
    const rejectedCount = reviews.filter(r => r.status === "rejected").length;

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Grade Review Requests</h1>
                        <p className="text-gray-600 mt-1">Request reviews for your course grades and assignments</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {reviews.length} Total Requests
                    </Badge>
                </div>

                {/* Summary Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-amber-200" />
                                <div className="text-amber-200 text-sm font-medium">Pending Review</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{pendingCount}</div>
                            <div className="text-amber-200 text-sm">Awaiting Response</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Resolved</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{resolvedCount}</div>
                            <div className="text-green-200 text-sm">Requests Approved</div>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <XCircle className="w-6 h-6 text-red-200" />
                                <div className="text-red-200 text-sm font-medium">Rejected</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{rejectedCount}</div>
                            <div className="text-red-200 text-sm">Requests Denied</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <BookOpen className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Eligible Courses</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{courses.length}</div>
                            <div className="text-blue-200 text-sm">Available for Review</div>
                        </div>
                    </div>
                )}

                {/* New Request Form */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                        Submit New Review Request
                    </h2>

                    <div className="space-y-6">
                        {/* Course Selection */}
                        <div>
                            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Course *
                            </label>
                            <select
                                id="course-select"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
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

                        {/* Message */}
                        <div>
                            <label htmlFor="review-message" className="block text-sm font-medium text-gray-700 mb-2">
                                Review Message *
                            </label>
                            <textarea
                                id="review-message"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical disabled:opacity-50"
                                disabled={submitting}
                                aria-required="true"
                                placeholder="Please provide a detailed explanation of why you believe your grade should be reviewed. Include specific assignments, questions, or criteria you'd like us to reconsider..."
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Supporting Documents (Optional)
                            </label>
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                                selectedFile ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
                            }`}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.zip,.rar,.txt"
                                    onChange={handleFileChange}
                                    disabled={submitting}
                                    className="hidden"
                                />
                                
                                {selectedFile ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-2 text-green-600">
                                            <FileText className="w-5 h-5" />
                                            <span className="font-medium">{selectedFile.name}</span>
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm text-indigo-600 hover:text-indigo-700"
                                        >
                                            Choose different file
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                                        <p className="text-gray-600 mb-2">
                                            Drag and drop your file here, or click to browse
                                        </p>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={submitting}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Choose File
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                                Allowed formats: PDF, DOC, DOCX, ZIP, RAR, TXT (Max 50MB)
                            </div>
                        </div>

                        {/* Submit Button and Messages */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                {submitError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700 text-sm">{submitError}</p>
                                    </div>
                                )}
                                {submitSuccess && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700 text-sm">{submitSuccess}</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Review Request
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Previous Requests */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-gray-600" />
                        Your Review Requests
                    </h2>

                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-lg" />
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-semibold mb-2">No Review Requests</p>
                            <p>You haven&apos;t submitted any grade review requests yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className={`border rounded-xl p-6 transition-all duration-200 ${
                                        review.status === "pending"
                                            ? "border-amber-200 bg-amber-50/50"
                                            : review.status === "resolved"
                                            ? "border-green-200 bg-green-50/50"
                                            : "border-red-200 bg-red-50/50"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {getCourseCode(review.courseId)} - {getCourseName(review.courseId)}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Instructor: {getCourseInstructor(review.courseId)}
                                            </p>
                                        </div>
                                        <StatusBadge status={review.status} />
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2">Your Message:</h4>
                                            <p className="text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
                                                {review.message}
                                            </p>
                                        </div>

                                        {review.attachmentFileName && (
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm text-gray-700">
                                                    Attached: {review.attachmentFileName}
                                                </span>
                                                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                                                    <Download className="w-3 h-3" />
                                                    Download
                                                </button>
                                            </div>
                                        )}

                                        <div className="text-sm text-gray-500">
                                            Submitted on {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString()}
                                        </div>

                                        {review.responseMessage && (
                                            <div className={`mt-4 p-4 rounded-lg border ${
                                                review.status === "resolved"
                                                    ? "bg-green-50 border-green-200"
                                                    : "bg-red-50 border-red-200"
                                            }`}>
                                                <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4" />
                                                    Instructor Response:
                                                </h4>
                                                <p className="text-gray-600">{review.responseMessage}</p>
                                                {review.responseDate && (
                                                    <div className="text-sm text-gray-500 mt-2">
                                                        Responded on {new Date(review.responseDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}