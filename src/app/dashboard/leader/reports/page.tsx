"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Report {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  courseCode: string;
  grade: number;
  attendance: number;
  completedAssignments: number;
  totalAssignments: number;
  status: "excellent" | "good" | "warning" | "critical";
  lastUpdated: string;
  instructor: string;
  semester: string;
  performanceTrend: "improving" | "stable" | "declining";
  riskFactors: string[];
}

const dummyReports: Report[] = [
  { 
    id: "r1", 
    studentName: "Alice Johnson", 
    studentId: "STU001",
    course: "Introduction to Computer Science", 
    courseCode: "CS101",
    grade: 92, 
    attendance: 95, 
    completedAssignments: 12,
    totalAssignments: 12,
    status: "excellent",
    lastUpdated: "2025-01-28T14:30:00Z",
    instructor: "Dr. Smith",
    semester: "Fall 2024",
    performanceTrend: "improving",
    riskFactors: []
  },
  { 
    id: "r2", 
    studentName: "Bob Smith", 
    studentId: "STU002",
    course: "Advanced Mathematics", 
    courseCode: "MATH201",
    grade: 78, 
    attendance: 82, 
    completedAssignments: 9,
    totalAssignments: 12,
    status: "warning",
    lastUpdated: "2025-01-28T13:45:00Z",
    instructor: "Prof. Chen",
    semester: "Fall 2024",
    performanceTrend: "stable",
    riskFactors: ["Late submissions", "Low quiz scores"]
  },
  { 
    id: "r3", 
    studentName: "Charlie Brown", 
    studentId: "STU003",
    course: "Physics Fundamentals", 
    courseCode: "PHY101",
    grade: 65, 
    attendance: 70, 
    completedAssignments: 6,
    totalAssignments: 12,
    status: "critical",
    lastUpdated: "2025-01-28T12:15:00Z",
    instructor: "Dr. Wilson",
    semester: "Fall 2024",
    performanceTrend: "declining",
    riskFactors: ["Low attendance", "Missing assignments", "Failing grades"]
  },
  { 
    id: "r4", 
    studentName: "Dana White", 
    studentId: "STU004",
    course: "Introduction to Computer Science", 
    courseCode: "CS101",
    grade: 88, 
    attendance: 90, 
    completedAssignments: 11,
    totalAssignments: 12,
    status: "good",
    lastUpdated: "2025-01-28T11:30:00Z",
    instructor: "Dr. Smith",
    semester: "Fall 2024",
    performanceTrend: "improving",
    riskFactors: ["Occasional late submissions"]
  },
  { 
    id: "r5", 
    studentName: "Ethan Hunt", 
    studentId: "STU005",
    course: "Data Structures", 
    courseCode: "CS202",
    grade: 94, 
    attendance: 98, 
    completedAssignments: 10,
    totalAssignments: 10,
    status: "excellent",
    lastUpdated: "2025-01-27T16:20:00Z",
    instructor: "Prof. Garcia",
    semester: "Fall 2024",
    performanceTrend: "stable",
    riskFactors: []
  },
  { 
    id: "r6", 
    studentName: "Fiona Gallagher", 
    studentId: "STU006",
    course: "Calculus II", 
    courseCode: "MATH202",
    grade: 72, 
    attendance: 75, 
    completedAssignments: 7,
    totalAssignments: 12,
    status: "critical",
    lastUpdated: "2025-01-27T14:45:00Z",
    instructor: "Dr. Thompson",
    semester: "Fall 2024",
    performanceTrend: "declining",
    riskFactors: ["Low attendance", "Missing assignments", "Poor exam performance"]
  },
];

export default function LeaderReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      try {
        setReports(dummyReports);
        setLoading(false);
      } catch {
        setError("Failed to load reports.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(search.toLowerCase()) ||
                         report.course.toLowerCase().includes(search.toLowerCase()) ||
                         report.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesCourse = courseFilter === "all" || report.courseCode === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "excellent": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "good": return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800 border-green-200";
      case "good": return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend: Report["performanceTrend"]) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "stable": return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case "declining": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 80) return "text-blue-600";
    if (attendance >= 70) return "text-yellow-600";
    return "text-red-600";
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

  const handleViewReport = (reportId: string) => {
    alert(`Viewing detailed report: ${reportId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    alert(`Downloading report: ${reportId}`);
  };

  const handleGenerateReport = (studentId: string) => {
    alert(`Generating new report for student: ${studentId}`);
  };

  const handleShareReport = (reportId: string) => {
    alert(`Sharing report: ${reportId}`);
  };

  const reportStats = {
    totalReports: reports.length,
    excellentReports: reports.filter(r => r.status === "excellent").length,
    criticalReports: reports.filter(r => r.status === "critical").length,
    averageGrade: reports.reduce((acc, r) => acc + r.grade, 0) / reports.length,
    averageAttendance: reports.reduce((acc, r) => acc + r.attendance, 0) / reports.length,
    totalCourses: new Set(reports.map(r => r.courseCode)).size
  };

  const courses = Array.from(new Set(reports.map(r => r.courseCode)));

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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Student Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive academic performance and progress reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStats.totalReports}</div>
              <p className="text-xs text-gray-600">Student reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Excellent Performance</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStats.excellentReports}</div>
              <p className="text-xs text-gray-600">
                {((reportStats.excellentReports / reportStats.totalReports) * 100).toFixed(1)}% of students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStats.averageGrade.toFixed(1)}%</div>
              <p className="text-xs text-gray-600">Class performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportStats.criticalReports}</div>
              <p className="text-xs text-gray-600">Need immediate attention</p>
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
                    placeholder="Search reports by student, course, or ID..."
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
                    <DropdownMenuItem onClick={() => setStatusFilter("excellent")}>Excellent</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("good")}>Good</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("warning")}>Warning</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("critical")}>Critical</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Course: {courseFilter === "all" ? "All" : courseFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCourseFilter("all")}>All Courses</DropdownMenuItem>
                    {courses.map(course => (
                      <DropdownMenuItem key={course} onClick={() => setCourseFilter(course)}>
                        {course}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredReports.length} reports</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="flex items-start gap-2">
            <XCircle className="h-5 w-5 mt-0.5" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {report.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.studentName}</CardTitle>
                      <CardDescription className="text-sm">{report.studentId}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewReport(report.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadReport(report.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGenerateReport(report.studentId)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate New
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareReport(report.id)}>
                        <Users className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className={getStatusColor(report.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(report.status)}
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTrendIcon(report.performanceTrend)}
                    {report.performanceTrend}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Course Info */}
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{report.course}</p>
                  <p className="text-gray-600">{report.courseCode} • {report.instructor}</p>
                  <p className="text-xs text-gray-500 mt-1">{report.semester}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-xl font-bold ${getGradeColor(report.grade)}`}>
                      {report.grade}%
                    </div>
                    <div className="text-xs text-gray-600">Grade</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${getAttendanceColor(report.attendance)}`}>
                      {report.attendance}%
                    </div>
                    <div className="text-xs text-gray-600">Attendance</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${
                      report.completedAssignments === report.totalAssignments ? 'text-green-600' : 
                      report.completedAssignments >= report.totalAssignments * 0.7 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {report.completedAssignments}/{report.totalAssignments}
                    </div>
                    <div className="text-xs text-gray-600">Assignments</div>
                  </div>
                </div>

                {/* Assignment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Assignment Progress</span>
                    <span className="font-medium">
                      {Math.round((report.completedAssignments / report.totalAssignments) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(report.completedAssignments / report.totalAssignments) * 100} 
                    className={
                      report.completedAssignments === report.totalAssignments ? "bg-green-600" :
                      report.completedAssignments >= report.totalAssignments * 0.7 ? "bg-yellow-600" : "bg-red-600"
                    }
                  />
                </div>

                {/* Risk Factors */}
                {report.riskFactors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>Risk Factors</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {report.riskFactors.slice(0, 2).map(factor => (
                        <Badge key={factor} variant="outline" className="text-xs bg-red-50 text-red-700">
                          {factor}
                        </Badge>
                      ))}
                      {report.riskFactors.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{report.riskFactors.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last updated
                  </span>
                  <span>{formatTimeAgo(report.lastUpdated)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDownloadReport(report.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewReport(report.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? `No reports found for "${search}"` : "No reports match your filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
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