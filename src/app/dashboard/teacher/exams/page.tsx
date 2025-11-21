"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Upload, 
    FileText, 
    Eye, 
    Clock, 
    Download,
    ArrowLeft,
    Calendar,
    BookOpen,
    Edit,
    Trash2,
    MoreVertical,
    CheckCircle,
    AlertCircle,
    Archive
} from "lucide-react";
import { useRouter } from "next/navigation";

type Exam = {
    id: string;
    title: string;
    subject: string;
    examDate: string;
    status: "Draft" | "Published" | "Archived";
    fileName: string;
    fileSize?: string;
    teacherComment?: string;
    previewUrl?: string;
    uploadDate: string;
    studentsCompleted?: number;
    totalStudents?: number;
};

const dummyExams: Exam[] = [
    {
        id: "e1",
        title: "Midterm Mathematics Examination",
        subject: "Mathematics",
        examDate: "2025-09-15",
        status: "Published",
        fileName: "midterm-math-algebra.pdf",
        fileSize: "2.4 MB",
        teacherComment: "Please review chapters 1-5, focus on algebraic expressions and equations",
        previewUrl: "/uploads/midterm-math.pdf",
        uploadDate: "2025-08-20",
        studentsCompleted: 24,
        totalStudents: 30
    },
    {
        id: "e2",
        title: "Final Physics Assessment",
        subject: "Physics",
        examDate: "2025-12-10",
        status: "Draft",
        fileName: "final-physics-mechanics.docx",
        fileSize: "1.8 MB",
        uploadDate: "2025-11-15",
        studentsCompleted: 0,
        totalStudents: 28
    },
    {
        id: "e3",
        title: "Chemistry Quiz - Organic Compounds",
        subject: "Chemistry",
        examDate: "2025-10-05",
        status: "Archived",
        fileName: "chemistry-organic-quiz.pdf",
        fileSize: "1.2 MB",
        teacherComment: "Focus on hydrocarbon naming and functional groups",
        previewUrl: "/uploads/chemistry-quiz.pdf",
        uploadDate: "2025-09-28",
        studentsCompleted: 30,
        totalStudents: 30
    },
];

export default function ExamManagementPage() {
    const [examRequired, setExamRequired] = useState(true);
    const router = useRouter();

    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);

    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadComment, setUploadComment] = useState("");
    const [uploadSubject, setUploadSubject] = useState("Mathematics");

    const fixedSubjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];
    const fixedExamDate = "2025-10-20";

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setExams(dummyExams);
            setLoading(false);
            setExamRequired(true);
        }, 800);
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
        setUploadSubject("Mathematics");
        setShowUploadForm(false);
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

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newExam: Exam = {
            id: Date.now().toString(),
            title: uploadTitle.trim(),
            subject: uploadSubject,
            examDate: fixedExamDate,
            status: "Draft",
            fileName: uploadFile.name,
            fileSize: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
            teacherComment: uploadComment.trim() || undefined,
            uploadDate: new Date().toISOString().split('T')[0],
            studentsCompleted: 0,
            totalStudents: 30
        };

        setExams((prev) => [newExam, ...prev]);
        alert("Exam uploaded successfully!");
        resetUploadForm();
        setUploading(false);
    }

    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this exam?")) {
            setExams((prev) => prev.filter((e) => e.id !== id));
        }
    }

    function handlePublish(id: string) {
        setExams(prev => prev.map(exam => 
            exam.id === id ? { ...exam, status: "Published" as const } : exam
        ));
    }

    function handleArchive(id: string) {
        setExams(prev => prev.map(exam => 
            exam.id === id ? { ...exam, status: "Archived" as const } : exam
        ));
    }

    function getStatusIcon(status: Exam["status"]) {
        switch (status) {
            case "Draft":
                return <Edit className="h-4 w-4" />;
            case "Published":
                return <CheckCircle className="h-4 w-4" />;
            case "Archived":
                return <Archive className="h-4 w-4" />;
        }
    }

    function getStatusColor(status: Exam["status"]) {
        switch (status) {
            case "Draft":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Published":
                return "bg-green-100 text-green-800 border-green-200";
            case "Archived":
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Stats calculations
    const totalExams = exams.length;
    const publishedCount = exams.filter(e => e.status === "Published").length;
    const draftCount = exams.filter(e => e.status === "Draft").length;
    const archivedCount = exams.filter(e => e.status === "Archived").length;
    const completionRate = exams.filter(e => e.status === "Published").reduce((acc, exam) => {
        if (exam.studentsCompleted && exam.totalStudents) {
            return acc + (exam.studentsCompleted / exam.totalStudents);
        }
        return acc;
    }, 0) / publishedCount * 100 || 0;

    return (
        <DashboardLayout>
            <section className="p-6 w-full mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
                        </div>
                        <p className="text-gray-600">
                            Create, manage, and track examination materials and student progress
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button 
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Total Exams</p>
                                    <p className="text-3xl font-bold text-indigo-900">{totalExams}</p>
                                </div>
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Published</p>
                                    <p className="text-3xl font-bold text-green-900">{publishedCount}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600 mb-1">Drafts</p>
                                    <p className="text-3xl font-bold text-yellow-900">{draftCount}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <Edit className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Archived</p>
                                    <p className="text-3xl font-bold text-gray-900">{archivedCount}</p>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-full">
                                    <Archive className="h-6 w-6 text-gray-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Avg Completion</p>
                                    <p className="text-3xl font-bold text-blue-900">{completionRate.toFixed(1)}%</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upload Section */}
                {!examRequired && !loading && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <h3 className="font-semibold text-yellow-800">Exam Upload Period Closed</h3>
                                    <p className="text-yellow-700 text-sm">
                                        Exam upload period is not open yet. You can upload exams starting from the scheduled date.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {examRequired && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Upload New Exam</h2>
                                    <p className="text-gray-600 text-sm">
                                        Scheduled for {formatDate(fixedExamDate)}
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => setShowUploadForm(!showUploadForm)}
                                    className="flex items-center gap-2 w-full lg:w-auto"
                                >
                                    <Upload className="h-4 w-4" />
                                    {showUploadForm ? 'Cancel Upload' : 'Upload New Exam'}
                                </Button>
                            </div>

                            {showUploadForm && (
                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Exam Title</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g. Midterm Algebra Examination"
                                                value={uploadTitle}
                                                onChange={(e) => setUploadTitle(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Subject</label>
                                            <select
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={uploadSubject}
                                                onChange={(e) => setUploadSubject(e.target.value)}
                                            >
                                                {fixedSubjects.map(subject => (
                                                    <option key={subject} value={subject}>{subject}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Comments (Optional)</label>
                                        <textarea
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                            placeholder="Add any comments or instructions about this exam..."
                                            value={uploadComment}
                                            onChange={(e) => setUploadComment(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Upload File</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex-1 cursor-pointer">
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600">
                                                        {uploadFile ? uploadFile.name : 'Choose exam file (PDF, DOC, DOCX)'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Max file size: 10MB
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    required
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button 
                                            type="submit" 
                                            disabled={uploading}
                                            className="flex items-center gap-2"
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4" />
                                                    Upload Exam
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            onClick={resetUploadForm}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Exams List */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading exams...</p>
                            </div>
                        ) : exams.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No exams uploaded</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {examRequired 
                                        ? "Get started by uploading your first exam using the form above." 
                                        : "No exams available at the moment."
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {exams.map((exam) => (
                                    <div key={exam.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-indigo-100 rounded-lg">
                                                        <FileText className="h-6 w-6 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {exam.title}
                                                            </h3>
                                                            <Badge 
                                                                variant="outline"
                                                                className={`flex items-center gap-1 ${getStatusColor(exam.status)}`}
                                                            >
                                                                {getStatusIcon(exam.status)}
                                                                {exam.status}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="h-4 w-4 text-gray-400" />
                                                                <span>{exam.subject}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span>{formatDate(exam.examDate)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4 text-gray-400" />
                                                                <span>{exam.fileName} • {exam.fileSize}</span>
                                                            </div>
                                                            {exam.studentsCompleted !== undefined && (
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="h-4 w-4 text-gray-400" />
                                                                    <span>{exam.studentsCompleted}/{exam.totalStudents} completed</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {exam.teacherComment && (
                                                            <p className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
                                                                <span className="font-medium">Note:</span> {exam.teacherComment}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-2"
                                                    onClick={() => router.push(`/dashboard/teacher/exams/${exam.id}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Button>
                                                {exam.status === "Draft" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handlePublish(exam.id)}
                                                    >
                                                        Publish
                                                    </Button>
                                                )}
                                                {exam.status === "Published" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleArchive(exam.id)}
                                                    >
                                                        Archive
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(exam.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </DashboardLayout>
    );
}