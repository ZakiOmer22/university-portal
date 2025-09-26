"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Upload } from "lucide-react";

interface AssignmentDetail {
    id: string;
    title: string;
    dueDate: string;
    courseCode: string;
    courseName: string;
    description: string;
    status: "pending" | "completed" | "overdue";
    maxScore: number;
    teacherFeedback?: string;
    studentSubmission?: {
        fileName: string;
        submittedAt: string; // ISO string
        score?: number; // out of maxScore
    };
}

// Dummy data for demonstration
const dummyAssignmentDetails: Record<string, AssignmentDetail> = {
    a1: {
        id: "a1",
        title: "Project Proposal",
        dueDate: "2025-08-20T23:59:59Z",
        courseCode: "CS101",
        courseName: "Computer Science 101",
        description:
            "Submit your project proposal outlining your topic, objectives, and methodology.",
        status: "pending",
        maxScore: 100,
        studentSubmission: undefined,
    },
    a3: {
        id: "a3",
        title: "Homework 5",
        dueDate: "2025-08-18T23:59:59Z",
        courseCode: "MATH201",
        courseName: "Advanced Mathematics",
        description: "Solve the set of problems listed in the homework sheet.",
        status: "completed",
        maxScore: 50,
        teacherFeedback: "Good work! A few minor mistakes.",
        studentSubmission: {
            fileName: "homework5.pdf",
            submittedAt: "2025-08-15T14:30:00Z",
            score: 45,
        },
    },
};

function statusBadge(status: AssignmentDetail["status"]) {
    switch (status) {
        case "pending":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <XCircle size={14} />
                    Pending
                </Badge>
            );
        case "completed":
            return (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                </Badge>
            );
        case "overdue":
            return (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                    <XCircle size={14} />
                    Overdue
                </Badge>
            );
    }
}

export default function AssignmentDetailPage() {
    const params = useParams();
    // Narrowing assignmentId from string | string[] | undefined to string
    const assignmentIdParam = params?.id;
    const assignmentId = Array.isArray(assignmentIdParam)
        ? assignmentIdParam[0]
        : assignmentIdParam ?? "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
    const [user, setUser] = useState<{
        fullName: string;
        role: string;
        profilePicture?: string;
    } | null>(null);

    // Submission state
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Allowed file types for upload
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

        setLoading(true);
        setError(null);

        // Simulate fetching assignment details
        setTimeout(() => {
            if (dummyAssignmentDetails[assignmentId]) {
                setAssignment(dummyAssignmentDetails[assignmentId]);
                setLoading(false);
            } else {
                setError("Assignment not found.");
                setLoading(false);
            }
        }, 1000);
    }, [assignmentId]);

    // Handle file selection + validation
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSubmitError(null);
        setSubmitSuccess(null);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            if (!allowedTypes.includes(file.type)) {
                setSubmitError(
                    `File type "${file.type}" not allowed. Allowed types: PDF, DOC, DOCX, ZIP, RAR, TXT.`
                );
                e.target.value = ""; // reset file input
                return;
            }

            setSelectedFile(file);
        }
    }

    // Confirmation dialog + submit
    async function handleSubmit() {
        if (!selectedFile) {
            setSubmitError("Please select a file to submit.");
            return;
        }

        if (!assignment) {
            setSubmitError("Assignment data not loaded.");
            return;
        }

        // Confirm before submitting
        const confirm = window.confirm(
            `Are you sure you want to submit "${selectedFile.name}" for this assignment? Once submitted, you cannot re-upload.`
        );
        if (!confirm) return;

        // Check if past due date
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        if (now > dueDate) {
            setSubmitError("Submission deadline has passed.");
            return;
        }

        setUploading(true);
        setSubmitError(null);

        // Simulate upload delay
        setTimeout(() => {
            setAssignment((prev) =>
                prev
                    ? {
                        ...prev,
                        studentSubmission: {
                            fileName: selectedFile.name,
                            submittedAt: new Date().toISOString(),
                            score: undefined,
                        },
                        status: "pending",
                    }
                    : prev
            );

            setUploading(false);
            setSubmitSuccess("Assignment submitted successfully!");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }, 1500);
    }

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6 max-w-3xl mx-auto">
                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {loading ? (
                    <>
                        <Skeleton className="h-10 w-64 mb-4" />
                        <Skeleton className="h-32 rounded-lg mb-6" />
                        <Skeleton className="h-16 rounded-lg" />
                    </>
                ) : assignment ? (
                    <>
                        <h1 className="text-3xl font-bold text-indigo-900">
                            {assignment.courseCode} - {assignment.courseName}
                        </h1>
                        <h2 className="text-xl font-semibold text-indigo-800 mb-2">
                            {assignment.title}
                        </h2>

                        <p className="text-gray-600 mb-4">{assignment.description}</p>

                        <p className="mb-2">
                            Due Date:{" "}
                            <time dateTime={assignment.dueDate} className="font-semibold">
                                {new Date(assignment.dueDate).toLocaleString()}
                            </time>{" "}
                            {statusBadge(assignment.status)}
                        </p>

                        {assignment.studentSubmission ? (
                            <div className="bg-green-50 border border-green-200 p-4 rounded space-y-2">
                                <p>
                                    <strong>Your Submission:</strong>{" "}
                                    {assignment.studentSubmission.fileName}
                                </p>
                                <p>
                                    Submitted at:{" "}
                                    {new Date(
                                        assignment.studentSubmission.submittedAt
                                    ).toLocaleString()}
                                </p>

                                {assignment.studentSubmission.score !== undefined ? (
                                    <>
                                        <p>
                                            <strong>Score:</strong> {assignment.studentSubmission.score} /{" "}
                                            {assignment.maxScore}
                                        </p>
                                        {assignment.teacherFeedback && (
                                            <p className="italic text-gray-700">
                                                Teacher Feedback: {assignment.teacherFeedback}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="italic text-yellow-800">Awaiting grading...</p>
                                )}
                            </div>
                        ) : (
                            <>
                                <label
                                    htmlFor="file-upload"
                                    className="block mb-2 font-semibold cursor-pointer"
                                >
                                    <div
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ")
                                                fileInputRef.current?.click();
                                        }}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition select-none"
                                        aria-describedby="fileHelp"
                                    >
                                        <Upload size={20} />
                                        Choose File to Upload
                                    </div>
                                </label>
                                <input
                                    ref={fileInputRef}
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.zip,.rar,.txt"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                {selectedFile && (
                                    <p className="mt-2 text-gray-700">Selected file: {selectedFile.name}</p>
                                )}

                                <div id="fileHelp" className="text-sm text-gray-600 mb-4">
                                    Allowed formats: PDF, DOC, DOCX, ZIP, RAR, TXT
                                </div>

                                {submitError && (
                                    <p className="text-red-600 mb-2" role="alert">
                                        {submitError}
                                    </p>
                                )}

                                {submitSuccess && (
                                    <p className="text-green-600 mb-2" role="status">
                                        {submitSuccess}
                                    </p>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={uploading || !selectedFile}
                                    className={`px-6 py-2 rounded text-white transition ${uploading || !selectedFile
                                            ? "bg-indigo-300 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                    aria-label="Submit assignment"
                                >
                                    {uploading ? "Submitting..." : "Submit Assignment"}
                                </button>
                            </>
                        )}
                    </>
                ) : null}
            </section>
        </DashboardLayout>
    );
}
