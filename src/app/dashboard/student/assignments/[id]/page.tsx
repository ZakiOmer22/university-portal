"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Upload, Calendar, FileText, Clock, Download, User, Award } from "lucide-react";

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
    instructions?: string;
    attachments?: { name: string; url: string }[];
    studentSubmission?: {
        fileName: string;
        submittedAt: string;
        score?: number;
        feedback?: string;
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
        description: "Submit your project proposal outlining your topic, objectives, and methodology.",
        instructions: "Your proposal should be 2-3 pages long and include:\n• Problem statement\n• Objectives\n• Methodology\n• Expected outcomes\n• Timeline\n\nFormat: PDF or Word document",
        status: "pending",
        maxScore: 100,
        attachments: [
            { name: "Assignment Guidelines.pdf", url: "#" },
            { name: "Project Examples.zip", url: "#" }
        ],
        studentSubmission: undefined,
    },
    a3: {
        id: "a3",
        title: "Homework 5 - Linear Algebra Problems",
        dueDate: "2025-08-18T23:59:59Z",
        courseCode: "MATH201",
        courseName: "Advanced Mathematics",
        description: "Solve the set of problems listed in the homework sheet covering matrix operations and linear transformations.",
        instructions: "Show all your work and calculations. Submit as a single PDF file.\n\nProblems to solve:\n1. Matrix multiplication\n2. Determinants\n3. Eigenvalues and eigenvectors\n4. Linear transformations",
        status: "completed",
        maxScore: 50,
        teacherFeedback: "Excellent work on problems 1-3! For problem 4, remember to show the transformation matrix explicitly. Overall, great understanding of the concepts.",
        attachments: [
            { name: "Homework_Problems.pdf", url: "#" },
            { name: "Solution_Template.docx", url: "#" }
        ],
        studentSubmission: {
            fileName: "homework5_solutions.pdf",
            submittedAt: "2025-08-15T14:30:00Z",
            score: 45,
        },
    },
};

function StatusBadge({ status }: { status: AssignmentDetail["status"] }) {
    switch (status) {
        case "pending":
            return (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                    <Clock size={14} />
                    Pending Submission
                </Badge>
            );
        case "completed":
            return (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Submitted
                </Badge>
            );
        case "overdue":
            return (
                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <XCircle size={14} />
                    Overdue
                </Badge>
            );
    }
}

export default function AssignmentDetailPage() {
    const params = useParams();
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

    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

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

        setLoading(true);
        setError(null);

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

            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                setSubmitError("File size too large. Maximum size is 50MB.");
                e.target.value = "";
                return;
            }

            setSelectedFile(file);
        }
    }

    async function handleSubmit() {
        if (!selectedFile) {
            setSubmitError("Please select a file to submit.");
            return;
        }

        if (!assignment) {
            setSubmitError("Assignment data not loaded.");
            return;
        }

        const confirm = window.confirm(
            `Are you sure you want to submit "${selectedFile.name}" for this assignment? Once submitted, you cannot re-upload.`
        );
        if (!confirm) return;

        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        if (now > dueDate) {
            setSubmitError("Submission deadline has passed.");
            return;
        }

        setUploading(true);
        setSubmitError(null);

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
                        status: "completed",
                    }
                    : prev
            );

            setUploading(false);
            setSubmitSuccess("Assignment submitted successfully!");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }, 1500);
    }

    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysUntilDue = assignment ? getDaysUntilDue(assignment.dueDate) : 0;
    const isUrgent = daysUntilDue <= 2 && assignment?.status === "pending";

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8 max-w-4xl mx-auto">
                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2 border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                        <div>
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {loading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-48 rounded-2xl" />
                        <Skeleton className="h-40 rounded-2xl" />
                    </div>
                ) : assignment ? (
                    <>
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1">
                                    <Badge className="bg-white/20 text-white border-none mb-4">
                                        {assignment.courseCode}
                                    </Badge>
                                    <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                                    <p className="text-indigo-100 text-lg opacity-90">
                                        {assignment.courseName}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-48">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold mb-1">{assignment.maxScore}</div>
                                        <div className="text-indigo-100 text-sm">Maximum Points</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Assignment Details */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Assignment Information */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Assignment Details
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-500">Due Date</label>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="font-semibold text-gray-900">
                                                        {new Date(assignment.dueDate).toLocaleDateString()} at {new Date(assignment.dueDate).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                {assignment.status === "pending" && (
                                                    <span className={`text-sm font-medium ${
                                                        daysUntilDue < 0 
                                                            ? "text-red-600"
                                                            : daysUntilDue <= 2
                                                            ? "text-amber-600"
                                                            : "text-green-600"
                                                    }`}>
                                                        {daysUntilDue < 0 
                                                            ? `${Math.abs(daysUntilDue)} days overdue`
                                                            : `${daysUntilDue} days remaining`
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-500">Status</label>
                                                <StatusBadge status={assignment.status} />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Description</label>
                                            <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
                                        </div>

                                        {assignment.instructions && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-500">Instructions</label>
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                                        {assignment.instructions}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Submission Section */}
                                {assignment.studentSubmission ? (
                                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            Your Submission
                                        </h2>
                                        
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-8 h-8 text-green-600" />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {assignment.studentSubmission.fileName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Submitted on {new Date(assignment.studentSubmission.submittedAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200">
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                            </div>

                                            {assignment.studentSubmission.score !== undefined ? (
                                                <div className="bg-white rounded-lg p-4 border border-green-300">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                            <Award className="w-4 h-4 text-green-600" />
                                                            Grading Results
                                                        </h4>
                                                        <Badge className="bg-green-100 text-green-800 border-green-200 text-lg font-bold">
                                                            {assignment.studentSubmission.score} / {assignment.maxScore}
                                                        </Badge>
                                                    </div>
                                                    {assignment.teacherFeedback && (
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                                                Teacher Feedback
                                                            </label>
                                                            <p className="text-gray-700 italic bg-gray-50 p-3 rounded border border-gray-200">
                                                                {assignment.teacherFeedback}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 text-amber-800">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="font-medium">Awaiting teacher feedback and grading</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                ) : (
                                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                            <Upload className="w-5 h-5 text-amber-600" />
                                            Submit Assignment
                                        </h2>
                                        
                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                            isUrgent ? "border-amber-300 bg-amber-50" : "border-gray-300 bg-gray-50"
                                        }`}>
                                            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                Upload Your Submission
                                            </h3>
                                            <p className="text-gray-600 mb-4 max-w-md mx-auto">
                                                Drag and drop your file here, or click to browse
                                            </p>
                                            
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx,.zip,.rar,.txt"
                                                onChange={handleFileChange}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                            
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Choose File
                                            </button>
                                            
                                            {selectedFile && (
                                                <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-green-600" />
                                                            <span className="font-medium text-gray-900">{selectedFile.name}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 text-sm text-gray-500">
                                                Allowed formats: PDF, DOC, DOCX, ZIP, RAR, TXT (Max 50MB)
                                            </div>

                                            {submitError && (
                                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-red-700 text-sm">{submitError}</p>
                                                </div>
                                            )}

                                            {submitSuccess && (
                                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <p className="text-green-700 text-sm">{submitSuccess}</p>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleSubmit}
                                                disabled={uploading || !selectedFile}
                                                className={`mt-6 w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                                                    uploading || !selectedFile
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                            >
                                                {uploading ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Submitting...
                                                    </div>
                                                ) : (
                                                    "Submit Assignment"
                                                )}
                                            </button>
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Right Column - Resources & Info */}
                            <div className="space-y-8">
                                {/* Assignment Resources */}
                                {assignment.attachments && assignment.attachments.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                            <Download className="w-5 h-5 text-blue-600" />
                                            Assignment Resources
                                        </h3>
                                        <div className="space-y-2">
                                            {assignment.attachments.map((attachment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                                >
                                                    <FileText className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium text-gray-900 text-sm flex-1">
                                                        {attachment.name}
                                                    </span>
                                                    <Download className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Quick Info */}
                                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <User className="w-5 h-5 text-purple-600" />
                                        Submission Guidelines
                                    </h3>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Ensure your file is properly named</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Check file size (max 50MB)</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Submit before the deadline</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>You cannot re-upload after submission</span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </DashboardLayout>
    );
}