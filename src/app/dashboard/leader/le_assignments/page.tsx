"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  MessageCircle,
  Users,
  BarChart3,
  Plus,
  MoreHorizontal
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
  totalStudents: number;
  submittedStudents: number;
  averageScore?: number;
  attachments: number;
  createdDate: string;
}

const dummyAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Project Proposal - E-commerce Platform",
    dueDate: "2025-02-20",
    courseId: "course-uuid-1",
    courseCode: "CS101",
    courseName: "Computer Science 101",
    status: "pending",
    priority: "high",
    description: "Submit a detailed project proposal outlining your e-commerce platform design, including user stories, technical architecture, and implementation timeline.",
    totalStudents: 24,
    submittedStudents: 18,
    attachments: 3,
    createdDate: "2025-01-15"
  },
  {
    id: "a2",
    title: "Final Exam",
    dueDate: "2025-03-15",
    courseId: "course-uuid-1",
    courseCode: "CS101",
    courseName: "Computer Science 101",
    status: "pending",
    priority: "high",
    description: "Comprehensive final examination covering all topics from the semester including algorithms, data structures, and software engineering principles.",
    totalStudents: 24,
    submittedStudents: 0,
    attachments: 1,
    createdDate: "2025-01-20"
  },
  {
    id: "a3",
    title: "Homework 5 - Algorithm Analysis",
    dueDate: "2025-01-25",
    courseId: "course-uuid-1",
    courseCode: "CS101",
    courseName: "Computer Science 101",
    status: "overdue",
    priority: "medium",
    description: "Analyze time complexity of given algorithms and provide optimized solutions for computational problems.",
    totalStudents: 24,
    submittedStudents: 20,
    averageScore: 85,
    attachments: 2,
    createdDate: "2025-01-10"
  },
  {
    id: "a4",
    title: "Midterm Exam",
    dueDate: "2025-02-25",
    courseId: "course-uuid-2",
    courseCode: "MATH201",
    courseName: "Advanced Mathematics",
    status: "pending",
    priority: "high",
    description: "Midterm examination covering calculus, linear algebra, and differential equations topics.",
    totalStudents: 18,
    submittedStudents: 0,
    attachments: 1,
    createdDate: "2025-01-18"
  },
  {
    id: "a5",
    title: "Linear Algebra Problem Set",
    dueDate: "2025-01-30",
    courseId: "course-uuid-2",
    courseCode: "MATH201",
    courseName: "Advanced Mathematics",
    status: "graded",
    priority: "medium",
    description: "Complete problem set covering matrix operations, vector spaces, and linear transformations.",
    totalStudents: 18,
    submittedStudents: 16,
    averageScore: 92,
    attachments: 1,
    createdDate: "2025-01-05"
  },
  {
    id: "a6",
    title: "Research Paper - Machine Learning",
    dueDate: "2025-02-10",
    courseId: "course-uuid-3",
    courseCode: "CS301",
    courseName: "Machine Learning Fundamentals",
    status: "pending",
    priority: "medium",
    description: "Write a research paper on recent advancements in machine learning algorithms and their real-world applications.",
    totalStudents: 15,
    submittedStudents: 8,
    attachments: 4,
    createdDate: "2025-01-12"
  },
  {
    id: "a7",
    title: "Lab Report 3 - Data Analysis",
    dueDate: "2025-01-22",
    courseId: "course-uuid-3",
    courseCode: "CS301",
    courseName: "Machine Learning Fundamentals",
    status: "overdue",
    priority: "low",
    description: "Complete data analysis lab using Python and provide detailed report with visualizations.",
    totalStudents: 15,
    submittedStudents: 12,
    averageScore: 78,
    attachments: 2,
    createdDate: "2025-01-08"
  },
  {
    id: "a8",
    title: "Final Project - Mobile App Development",
    dueDate: "2025-03-20",
    courseId: "course-uuid-4",
    courseCode: "CS401",
    courseName: "Mobile Application Development",
    status: "pending",
    priority: "high",
    description: "Develop a complete mobile application with frontend and backend components, including documentation and deployment.",
    totalStudents: 20,
    submittedStudents: 5,
    attachments: 5,
    createdDate: "2025-01-25"
  }
];

export default function AssignmentsPage() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      setAssignments(dummyAssignments);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(search.toLowerCase()) ||
                         assignment.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || assignment.priority === priorityFilter;
    const matchesCourse = courseFilter === "all" || assignment.courseId === courseFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCourse;
  });

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

  const getCourses = () => {
    const courses = assignments.map(a => ({ id: a.courseId, code: a.courseCode, name: a.courseName }));
    return Array.from(new Map(courses.map(item => [item.id, item])).values());
  };

  const calculateDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDueDateColor = (daysUntilDue: number, status: Assignment["status"]) => {
    if (status === "overdue" || status === "graded") return "text-gray-600";
    if (daysUntilDue <= 0) return "text-red-600";
    if (daysUntilDue <= 3) return "text-orange-600";
    if (daysUntilDue <= 7) return "text-yellow-600";
    return "text-green-600";
  };

  const getDueDateText = (dueDate: string, status: Assignment["status"]) => {
    if (status === "overdue") return "Overdue";
    if (status === "graded") return "Graded";
    
    const daysUntilDue = calculateDaysUntilDue(dueDate);
    if (daysUntilDue <= 0) return "Due today";
    if (daysUntilDue === 1) return "Due tomorrow";
    return `Due in ${daysUntilDue} days`;
  };

  const overallStats = {
    totalAssignments: assignments.length,
    pendingAssignments: assignments.filter(a => a.status === "pending").length,
    overdueAssignments: assignments.filter(a => a.status === "overdue").length,
    gradedAssignments: assignments.filter(a => a.status === "graded").length,
    totalSubmissions: assignments.reduce((acc, a) => acc + a.submittedStudents, 0),
    totalStudents: assignments.reduce((acc, a) => acc + a.totalStudents, 0) / assignments.length
  };

  const submissionRate = (overallStats.totalSubmissions / (overallStats.totalStudents * assignments.length)) * 100;

  if (loading) {
    return (
      <DashboardLayout user={user} loading={true}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} loading={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-1">Manage and track all class assignments and submissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalAssignments}</div>
              <p className="text-xs text-gray-600">Active assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.pendingAssignments}</div>
              <p className="text-xs text-gray-600">Awaiting grading</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.overdueAssignments}</div>
              <p className="text-xs text-gray-600">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submission Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissionRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-600">Overall completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search assignments or courses..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>Overdue</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("graded")}>Graded</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Priority: {priorityFilter === "all" ? "All" : priorityFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Course: {courseFilter === "all" ? "All" : getCourses().find(c => c.id === courseFilter)?.code}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCourseFilter("all")}>All Courses</DropdownMenuItem>
                    {getCourses().map(course => (
                      <DropdownMenuItem key={course.id} onClick={() => setCourseFilter(course.id)}>
                        {course.code} - {course.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredAssignments.length} assignments</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssignments.map(assignment => {
            const daysUntilDue = calculateDaysUntilDue(assignment.dueDate);
            
            return (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={getStatusColor(assignment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(assignment.status)}
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(assignment.priority)}>
                          {assignment.priority} priority
                        </Badge>
                        {assignment.attachments > 0 && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            <FileText className="h-3 w-3 mr-1" />
                            {assignment.attachments}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{assignment.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {assignment.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Students
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Submissions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Course and Due Date */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">
                        {assignment.courseCode} - {assignment.courseName}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 font-medium ${getDueDateColor(daysUntilDue, assignment.status)}`}>
                      <Calendar className="h-4 w-4" />
                      {getDueDateText(assignment.dueDate, assignment.status)}
                    </div>
                  </div>

                  {/* Submission Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-gray-700">Submissions</span>
                      <span className="font-medium">
                        {assignment.submittedStudents}/{assignment.totalStudents} students
                      </span>
                    </div>
                    <Progress 
                      value={(assignment.submittedStudents / assignment.totalStudents) * 100} 
                      className={
                        assignment.submittedStudents === assignment.totalStudents ? "bg-green-600" :
                        (assignment.submittedStudents / assignment.totalStudents) >= 0.7 ? "bg-yellow-600" : "bg-red-600"
                      }
                    />
                  </div>

                  {/* Average Score (if graded) */}
                  {assignment.averageScore && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Average Score</span>
                      <span className={`font-bold ${
                        assignment.averageScore >= 90 ? "text-green-600" :
                        assignment.averageScore >= 80 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {assignment.averageScore}%
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Remind
                    </Button>
                    <Link 
                      href={`/dashboard/leader/le_assignments/${assignment.id}`}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAssignments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? `No assignments found for "${search}"` : "No assignments match your filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setCourseFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}