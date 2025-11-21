"use client";

import { 
    ArrowLeft, 
    EyeOff, 
    FileText, 
    Calendar, 
    BookOpen,
    Download,
    Share,
    Edit,
    CheckCircle,
    Clock,
    Archive,
    Users,
    BarChart3,
    MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Exam = {
    id: string;
    title: string;
    subject: string;
    examDate: string;
    status: "Draft" | "Published" | "Archived" | "Approved";
    fileName: string;
    fileSize?: string;
    teacherComment?: string;
    uploadDate: string;
    studentsCompleted?: number;
    totalStudents?: number;
    averageScore?: number;
    duration?: number; // in minutes
    questionsCount?: number;
    approvedBy?: string;
    approvedDate?: string;
};

export default function ExamDetails({ exam }: { exam: Exam }) {
    const router = useRouter();

    const getStatusIcon = (status: Exam["status"]) => {
        switch (status) {
            case "Approved":
                return <CheckCircle className="h-4 w-4" />;
            case "Published":
                return <FileText className="h-4 w-4" />;
            case "Draft":
                return <Edit className="h-4 w-4" />;
            case "Archived":
                return <Archive className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: Exam["status"]) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "Published":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Draft":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Archived":
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });
    };

    const completionRate = exam.studentsCompleted && exam.totalStudents 
        ? (exam.studentsCompleted / exam.totalStudents) * 100 
        : 0;

    return (
        <section className="p-6 w-full mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Exams
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Exam Details</h1>
                        <p className="text-gray-600">Review and manage examination details</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Share className="h-4 w-4" />
                        Share
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Exam
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Exam Overview Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h2>
                                    <Badge 
                                        variant="outline"
                                        className={`flex items-center gap-1 w-fit ${getStatusColor(exam.status)}`}
                                    >
                                        {getStatusIcon(exam.status)}
                                        {exam.status}
                                    </Badge>
                                </div>
                                {exam.fileSize && (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">File Size</p>
                                        <p className="font-semibold text-gray-900">{exam.fileSize}</p>
                                    </div>
                                )}
                            </div>

                            {/* Exam Metadata Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Subject</p>
                                        <p className="font-semibold text-gray-900">{exam.subject}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Exam Date</p>
                                        <p className="font-semibold text-gray-900">{formatDate(exam.examDate)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Clock className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-semibold text-gray-900">
                                            {exam.duration ? `${exam.duration} minutes` : 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                {exam.questionsCount && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <FileText className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Questions</p>
                                            <p className="font-semibold text-gray-900">{exam.questionsCount}</p>
                                        </div>
                                    </div>
                                )}

                                {exam.averageScore && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <BarChart3 className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Average Score</p>
                                            <p className="font-semibold text-gray-900">{exam.averageScore}%</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                        <Users className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Completion</p>
                                        <p className="font-semibold text-gray-900">
                                            {exam.studentsCompleted}/{exam.totalStudents} students
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {exam.totalStudents && exam.studentsCompleted !== undefined && (
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Student Completion Progress</span>
                                        <span>{completionRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={completionRate} className="h-2" />
                                </div>
                            )}

                            {/* Teacher Comments */}
                            {exam.teacherComment && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="h-4 w-4 text-blue-600" />
                                        <h3 className="font-semibold text-blue-900">Teacher's Notes</h3>
                                    </div>
                                    <p className="text-blue-800">{exam.teacherComment}</p>
                                </div>
                            )}

                            {/* Approval Information */}
                            {exam.approvedBy && exam.approvedDate && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <h3 className="font-semibold text-green-900">Approval Information</h3>
                                    </div>
                                    <p className="text-green-800">
                                        Approved by {exam.approvedBy} on {formatDate(exam.approvedDate)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Exam Preview Section */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Preview</h3>
                            
                            {exam.status === "Approved" ? (
                                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-600" />
                                                <span className="font-medium text-gray-900">{exam.fileName}</span>
                                            </div>
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <Download className="h-4 w-4" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="h-[600px] bg-gray-100">
                                        <iframe
                                            src={`/pdfs/${exam.fileName}`}
                                            title={`${exam.title} - PDF Preview`}
                                            width="100%"
                                            height="100%"
                                            className="block border-0"
                                            style={{ minHeight: '600px' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                    <div className="flex flex-col items-center justify-center">
                                        <EyeOff className="h-16 w-16 text-gray-400 mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                            Preview Not Available
                                        </h4>
                                        <p className="text-gray-500 max-w-md">
                                            {exam.status === "Draft" 
                                                ? "This exam is still in draft mode. Please publish or get it approved to enable preview."
                                                : exam.status === "Published"
                                                ? "This exam is published but awaiting approval. Preview will be available once approved."
                                                : "This archived exam is no longer available for preview."
                                            }
                                        </p>
                                        {exam.status === "Draft" && (
                                            <Button className="mt-4">
                                                Submit for Approval
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Exam Details
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Users className="h-4 w-4" />
                                    Manage Access
                                </Button>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    View Results
                                </Button>
                                {exam.status === "Draft" && (
                                    <Button className="w-full justify-start gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Publish Exam
                                    </Button>
                                )}
                                {exam.status === "Published" && (
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Archive className="h-4 w-4" />
                                        Archive Exam
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exam Statistics */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Completion Rate</span>
                                        <span>{completionRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={completionRate} className="h-2" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-600">{exam.studentsCompleted || 0}</p>
                                        <p className="text-sm text-blue-600">Completed</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <p className="text-2xl font-bold text-gray-600">
                                            {(exam.totalStudents || 0) - (exam.studentsCompleted || 0)}
                                        </p>
                                        <p className="text-sm text-gray-600">Pending</p>
                                    </div>
                                </div>

                                {exam.averageScore && (
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">{exam.averageScore}%</p>
                                        <p className="text-sm text-green-600">Average Score</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* File Information */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">File Name</span>
                                    <span className="text-sm font-medium text-gray-900">{exam.fileName}</span>
                                </div>
                                {exam.fileSize && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">File Size</span>
                                        <span className="text-sm font-medium text-gray-900">{exam.fileSize}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Upload Date</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatDate(exam.uploadDate)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Format</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {exam.fileName.split('.').pop()?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}