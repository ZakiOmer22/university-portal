"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Mail,
  FileText,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  MessageCircle,
  BarChart3,
  MoreHorizontal,
  User,
  Star,
  TrendingUp,
  Edit3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  status: "pending" | "completed" | "overdue" | "graded";
  priority: "low" | "medium" | "high";
  description: string;
  instructions: string;
  totalStudents: number;
  submittedStudents: number;
  gradedStudents: number;
  averageScore?: number;
  attachments: number;
  createdDate: string;
  maxScore: number;
  rubric?: string;
}

interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submissionDate: string;
  status: "submitted" | "graded" | "late" | "missing";
  score?: number;
  feedback?: string;
  fileCount: number;
  lastModified: string;
}

const dummyAssignment: Assignment = {
  id: "a1",
  title: "Project Proposal - E-commerce Platform",
  dueDate: "2025-02-20T23:59:00Z",
  courseId: "course-uuid-1",
  courseCode: "CS101",
  courseName: "Computer Science 101",
  status: "pending",
  priority: "high",
  description: "Submit a detailed project proposal outlining your e-commerce platform design, including user stories, technical architecture, and implementation timeline.",
  instructions: `## Assignment Instructions

### Requirements:
1. Write a comprehensive project proposal (5-7 pages)
2. Include detailed user stories and use cases
3. Design the technical architecture with diagrams
4. Create an implementation timeline with milestones
5. Include risk assessment and mitigation strategies

### Technical Requirements:
- Use UML diagrams for system design
- Follow IEEE standard for project documentation
- Include database schema design
- Provide API specifications if applicable

### Submission Guidelines:
- Submit as PDF document
- Include all source files in a zip folder
- Maximum file size: 50MB
- Name files as: LastName_FirstName_Proposal.pdf

### Grading Rubric:
- Content Quality (40%)
- Technical Accuracy (30%)
- Documentation (20%)
- Timeliness (10%)`,
  totalStudents: 24,
  submittedStudents: 18,
  gradedStudents: 8,
  averageScore: 85,
  attachments: 3,
  createdDate: "2025-01-15",
  maxScore: 100,
  rubric: "Detailed grading rubric available in the attached PDF file."
};

const dummySubmissions: StudentSubmission[] = [
  {
    id: "sub1",
    studentId: "s1",
    studentName: "Alice Johnson",
    studentEmail: "alice.johnson@university.edu",
    submissionDate: "2025-02-18T14:30:00Z",
    status: "graded",
    score: 92,
    feedback: "Excellent proposal with comprehensive technical details. Well-structured and professionally presented.",
    fileCount: 3,
    lastModified: "2025-02-18T14:30:00Z"
  },
  {
    id: "sub2",
    studentId: "s2",
    studentName: "Bob Smith",
    studentEmail: "bob.smith@university.edu",
    submissionDate: "2025-02-19T10:15:00Z",
    status: "graded",
    score: 88,
    feedback: "Good overall structure but could use more detailed risk assessment.",
    fileCount: 2,
    lastModified: "2025-02-19T10:15:00Z"
  },
  {
    id: "sub3",
    studentId: "s3",
    studentName: "Charlie Lee",
    studentEmail: "charlie.lee@university.edu",
    submissionDate: "2025-02-19T16:45:00Z",
    status: "submitted",
    fileCount: 4,
    lastModified: "2025-02-19T16:45:00Z"
  },
  {
    id: "sub4",
    studentId: "s4",
    studentName: "Diana Ross",
    studentEmail: "diana.ross@university.edu",
    submissionDate: "2025-02-20T09:20:00Z",
    status: "submitted",
    fileCount: 2,
    lastModified: "2025-02-20T09:20:00Z"
  },
  {
    id: "sub5",
    studentId: "s5",
    studentName: "Ethan Hunt",
    studentEmail: "ethan.hunt@university.edu",
    submissionDate: "2025-02-20T11:30:00Z",
    status: "graded",
    score: 78,
    feedback: "Needs improvement in technical architecture documentation.",
    fileCount: 3,
    lastModified: "2025-02-20T11:30:00Z"
  },
  {
    id: "sub6",
    studentId: "s6",
    studentName: "Fiona Gallagher",
    studentEmail: "fiona.gallagher@university.edu",
    submissionDate: "2025-02-20T14:15:00Z",
    status: "graded",
    score: 95,
    feedback: "Outstanding work! Exceptional detail in all sections.",
    fileCount: 5,
    lastModified: "2025-02-20T14:15:00Z"
  },
  {
    id: "sub7",
    studentId: "s7",
    studentName: "George Miller",
    studentEmail: "george.miller@university.edu",
    submissionDate: "2025-02-20T16:40:00Z",
    status: "submitted",
    fileCount: 2,
    lastModified: "2025-02-20T16:40:00Z"
  },
  {
    id: "sub8",
    studentId: "s8",
    studentName: "Hannah Chen",
    studentEmail: "hannah.chen@university.edu",
    submissionDate: "2025-02-20T18:20:00Z",
    status: "graded",
    score: 90,
    feedback: "Very good proposal with clear implementation timeline.",
    fileCount: 3,
    lastModified: "2025-02-20T18:20:00Z"
  },
  {
    id: "sub9",
    studentId: "s9",
    studentName: "Ian Cooper",
    studentEmail: "ian.cooper@university.edu",
    submissionDate: "2025-02-20T20:10:00Z",
    status: "late",
    fileCount: 2,
    lastModified: "2025-02-20T20:10:00Z"
  },
  {
    id: "sub10",
    studentId: "s10",
    studentName: "Julia Park",
    studentEmail: "julia.park@university.edu",
    submissionDate: "2025-02-20T22:45:00Z",
    status: "late",
    fileCount: 1,
    lastModified: "2025-02-20T22:45:00Z"
  }
];

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params["id"] as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (!id) {
      router.push("/dashboard/leader/assignments");
      return;
    }

    setTimeout(() => {
      setAssignment(dummyAssignment);
      setSubmissions(dummySubmissions);
      setLoading(false);
    }, 1000);
  }, [id, router]);

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "completed": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "overdue": return <XCircle className="h-4 w-4 text-red-600" />;
      case "graded": return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200";
      case "graded": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Assignment["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSubmissionStatusColor = (status: StudentSubmission["status"]) => {
    switch (status) {
      case "graded": return "bg-green-100 text-green-800";
      case "submitted": return "bg-blue-100 text-blue-800";
      case "late": return "bg-orange-100 text-orange-800";
      case "missing": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const submissionStats = {
    total: submissions.length,
    graded: submissions.filter(s => s.status === "graded").length,
    submitted: submissions.filter(s => s.status === "submitted").length,
    late: submissions.filter(s => s.status === "late").length,
    missing: (assignment?.totalStudents || 0) - submissions.length,
    averageScore: submissions.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) / submissions.filter(s => s.score).length
  };

  if (loading) {
    return (
      <DashboardLayout user={user} loading={true}>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!assignment) {
    return (
      <DashboardLayout user={user} loading={false}>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-4">Assignment Not Found</h2>
            <p className="text-red-700 mb-6">
              The assignment you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link href="/dashboard/leader/assignments">
              <Button className="bg-red-600 hover:bg-red-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assignments
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const daysUntilDue = calculateDaysUntilDue(assignment.dueDate);

  return (
    <DashboardLayout user={user} loading={false}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/leader/assignments">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Assignments
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Reminder
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Edit3 className="h-4 w-4" />
              Edit Assignment
            </Button>
          </div>
        </div>

        {/* Assignment Header */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className={getStatusColor(assignment.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(assignment.status)}
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </Badge>
              <Badge variant="outline" className={getPriorityColor(assignment.priority)}>
                {assignment.priority} Priority
              </Badge>
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                {assignment.courseCode} - {assignment.courseName}
              </Badge>
              {assignment.attachments > 0 && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  <FileText className="h-3 w-3 mr-1" />
                  {assignment.attachments} files
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900">
              {assignment.title}
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mt-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Due: {formatDate(assignment.dueDate)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {assignment.totalStudents} students
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Created: {formatDate(assignment.createdDate)}
              </span>
              {assignment.averageScore && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Average Score: {assignment.averageScore}%
                </span>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">
              Submissions ({submissions.length})
            </TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissionStats.total}</div>
                  <p className="text-xs text-gray-600">
                    {((submissionStats.total / assignment.totalStudents) * 100).toFixed(1)}% of class
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Graded</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissionStats.graded}</div>
                  <p className="text-xs text-gray-600">
                    {((submissionStats.graded / submissionStats.total) * 100).toFixed(1)}% of submissions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Awaiting Grading</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissionStats.submitted + submissionStats.late}</div>
                  <p className="text-xs text-gray-600">Need attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Missing</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissionStats.missing}</div>
                  <p className="text-xs text-gray-600">
                    {((submissionStats.missing / assignment.totalStudents) * 100).toFixed(1)}% of class
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Progress</CardTitle>
                <CardDescription>Track assignment completion across the class</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Overall Submission Rate</span>
                    <span className="font-medium">
                      {submissionStats.total}/{assignment.totalStudents} students
                    </span>
                  </div>
                  <Progress 
                    value={(submissionStats.total / assignment.totalStudents) * 100} 
                    className={
                      (submissionStats.total / assignment.totalStudents) >= 0.9 ? "bg-green-600" :
                      (submissionStats.total / assignment.totalStudents) >= 0.7 ? "bg-yellow-600" : "bg-red-600"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Grading Progress</span>
                    <span className="font-medium">
                      {submissionStats.graded}/{submissionStats.total} submissions
                    </span>
                  </div>
                  <Progress 
                    value={(submissionStats.graded / submissionStats.total) * 100} 
                    className={
                      (submissionStats.graded / submissionStats.total) >= 0.8 ? "bg-green-600" :
                      (submissionStats.graded / submissionStats.total) >= 0.5 ? "bg-yellow-600" : "bg-red-600"
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest student submissions for this assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map(submission => (
                    <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                          {submission.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{submission.studentName}</p>
                          <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className={getSubmissionStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        {submission.score && (
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{submission.score}%</p>
                            <p className="text-xs text-gray-600">Score</p>
                          </div>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle>Student Submissions</CardTitle>
                    <CardDescription>
                      {submissionStats.total} submissions received out of {assignment.totalStudents} students
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                    <Button size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Message Missing
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submissions.map(submission => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {submission.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 truncate">{submission.studentName}</p>
                            <Badge variant="secondary" className={getSubmissionStatusColor(submission.status)}>
                              {submission.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{submission.studentEmail}</p>
                          <p className="text-xs text-gray-500">
                            Submitted {formatTimeAgo(submission.submissionDate)} • {submission.fileCount} file{submission.fileCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {submission.score && (
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              submission.score >= 90 ? 'text-green-600' :
                              submission.score >= 80 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {submission.score}%
                            </p>
                            <p className="text-xs text-gray-600">Score</p>
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Submission
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              {submission.score ? 'Update Grade' : 'Grade Assignment'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Feedback
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Files
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructions Tab */}
          <TabsContent value="instructions">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Instructions</CardTitle>
                <CardDescription>Detailed requirements and submission guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{assignment.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div 
                      className="text-gray-700 whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: assignment.instructions }}
                    />
                  </div>

                  {assignment.rubric && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Grading Rubric</h3>
                      <p className="text-gray-700">{assignment.rubric}</p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-4">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download Assignment Files
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Rubric
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Analytics</CardTitle>
                <CardDescription>Performance insights and submission patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Score Distribution</h4>
                    <div className="space-y-3">
                      {[90, 80, 70, 60].map(threshold => {
                        const count = submissions.filter(s => s.score && s.score >= threshold && s.score < threshold + 10).length;
                        const percentage = (count / submissionStats.graded) * 100;
                        return (
                          <div key={threshold} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {threshold}+: {count} students
                            </span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  threshold >= 90 ? 'bg-green-500' :
                                  threshold >= 80 ? 'bg-blue-500' :
                                  threshold >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Submission Timeline</h4>
                    <div className="space-y-2">
                      {['On Time', 'Late', 'Missing'].map((status, index) => {
                        const count = status === 'On Time' ? submissionStats.submitted :
                                     status === 'Late' ? submissionStats.late : submissionStats.missing;
                        const percentage = (count / assignment.totalStudents) * 100;
                        return (
                          <div key={status} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{status}</span>
                            <span className="font-medium">{count} students ({percentage.toFixed(1)}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}