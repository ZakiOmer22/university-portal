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
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Target,
  Award,
  Clock,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  UserCheck,
  XCircle,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PerformanceMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

interface StudentPerformance {
  id: string;
  name: string;
  studentId: string;
  overallGrade: number;
  attendance: number;
  assignmentCompletion: number;
  participation: number;
  trend: "improving" | "declining" | "stable";
  riskLevel: "low" | "medium" | "high";
  courses: {
    name: string;
    grade: number;
    trend: "up" | "down" | "stable";
  }[];
  lastActive: string;
}

interface CoursePerformance {
  id: string;
  name: string;
  code: string;
  averageGrade: number;
  completionRate: number;
  studentCount: number;
  satisfaction: number;
  trend: "improving" | "declining" | "stable";
}

const dummyPerformanceMetrics: PerformanceMetric[] = [
  { 
    id: "m1", 
    title: "Overall Class Average", 
    value: 84.5, 
    change: 2.3, 
    changeType: "increase", 
    target: 85, 
    unit: "%", 
    trend: "up" 
  },
  { 
    id: "m2", 
    title: "Attendance Rate", 
    value: 92.1, 
    change: 1.2, 
    changeType: "increase", 
    target: 95, 
    unit: "%", 
    trend: "up" 
  },
  { 
    id: "m3", 
    title: "Assignment Completion", 
    value: 88.7, 
    change: -0.8, 
    changeType: "decrease", 
    target: 90, 
    unit: "%", 
    trend: "down" 
  },
  { 
    id: "m4", 
    title: "Student Satisfaction", 
    value: 4.2, 
    change: 0.3, 
    changeType: "increase", 
    target: 4.5, 
    unit: "/5", 
    trend: "up" 
  },
];

const dummyStudentPerformance: StudentPerformance[] = [
  { 
    id: "s1", 
    name: "Alice Johnson", 
    studentId: "STU001",
    overallGrade: 92, 
    attendance: 98, 
    assignmentCompletion: 100,
    participation: 95,
    trend: "improving",
    riskLevel: "low",
    courses: [
      { name: "CS101", grade: 94, trend: "up" },
      { name: "MATH201", grade: 89, trend: "stable" },
      { name: "PHY301", grade: 93, trend: "up" }
    ],
    lastActive: "2025-01-28T14:30:00Z"
  },
  { 
    id: "s2", 
    name: "Bob Smith", 
    studentId: "STU002",
    overallGrade: 78, 
    attendance: 85, 
    assignmentCompletion: 82,
    participation: 75,
    trend: "declining",
    riskLevel: "medium",
    courses: [
      { name: "CS101", grade: 76, trend: "down" },
      { name: "ENG101", grade: 80, trend: "stable" }
    ],
    lastActive: "2025-01-28T13:45:00Z"
  },
  { 
    id: "s3", 
    name: "Charlie Lee", 
    studentId: "STU003",
    overallGrade: 65, 
    attendance: 72, 
    assignmentCompletion: 68,
    participation: 60,
    trend: "declining",
    riskLevel: "high",
    courses: [
      { name: "CS101", grade: 62, trend: "down" },
      { name: "MATH201", grade: 68, trend: "down" },
      { name: "BIO101", grade: 65, trend: "stable" }
    ],
    lastActive: "2025-01-27T16:20:00Z"
  },
  { 
    id: "s4", 
    name: "Diana Ross", 
    studentId: "STU004",
    overallGrade: 88, 
    attendance: 94, 
    assignmentCompletion: 96,
    participation: 90,
    trend: "stable",
    riskLevel: "low",
    courses: [
      { name: "CS101", grade: 86, trend: "up" },
      { name: "PHY301", grade: 90, trend: "stable" }
    ],
    lastActive: "2025-01-28T11:30:00Z"
  },
  { 
    id: "s5", 
    name: "Ethan Hunt", 
    studentId: "STU005",
    overallGrade: 95, 
    attendance: 100, 
    assignmentCompletion: 100,
    participation: 98,
    trend: "improving",
    riskLevel: "low",
    courses: [
      { name: "CS101", grade: 96, trend: "up" },
      { name: "MATH201", grade: 94, trend: "up" },
      { name: "ENG101", grade: 95, trend: "stable" }
    ],
    lastActive: "2025-01-28T15:20:00Z"
  },
];

const dummyCoursePerformance: CoursePerformance[] = [
  { 
    id: "c1", 
    name: "Introduction to Computer Science", 
    code: "CS101",
    averageGrade: 85.2, 
    completionRate: 92, 
    studentCount: 45,
    satisfaction: 4.3,
    trend: "improving"
  },
  { 
    id: "c2", 
    name: "Advanced Mathematics", 
    code: "MATH201",
    averageGrade: 82.7, 
    completionRate: 88, 
    studentCount: 32,
    satisfaction: 4.1,
    trend: "stable"
  },
  { 
    id: "c3", 
    name: "Physics Fundamentals", 
    code: "PHY301",
    averageGrade: 79.8, 
    completionRate: 85, 
    studentCount: 28,
    satisfaction: 3.9,
    trend: "declining"
  },
  { 
    id: "c4", 
    name: "Biology Basics", 
    code: "BIO101",
    averageGrade: 81.5, 
    completionRate: 90, 
    studentCount: 38,
    satisfaction: 4.2,
    trend: "improving"
  },
];

export default function LeaderPerformancePage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [students, setStudents] = useState<StudentPerformance[]>([]);
  const [courses, setCourses] = useState<CoursePerformance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [trendFilter, setTrendFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("semester");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      try {
        setMetrics(dummyPerformanceMetrics);
        setStudents(dummyStudentPerformance);
        setCourses(dummyCoursePerformance);
        setLoading(false);
      } catch {
        setError("Failed to load performance data.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || student.riskLevel === riskFilter;
    const matchesTrend = trendFilter === "all" || student.trend === trendFilter;
    
    return matchesSearch && matchesRisk && matchesTrend;
  });

  const getTrendIcon = (trend: "up" | "down" | "stable" | "improving" | "declining") => {
    if (trend === "up" || trend === "improving") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down" || trend === "declining") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <BarChart3 className="h-4 w-4 text-blue-600" />;
  };

  const getTrendColor = (trend: "up" | "down" | "stable" | "improving" | "declining") => {
    if (trend === "up" || trend === "improving") return "text-green-600";
    if (trend === "down" || trend === "declining") return "text-red-600";
    return "text-blue-600";
  };

  const getRiskIcon = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "high": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (riskLevel: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBgColor = (grade: number) => {
    if (grade >= 90) return "bg-green-50 border-green-200";
    if (grade >= 80) return "bg-blue-50 border-blue-200";
    if (grade >= 70) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
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

  const handleViewStudentDetails = (studentId: string) => {
    alert(`Viewing performance details for student: ${studentId}`);
  };

  const handleGenerateReport = (studentId: string) => {
    alert(`Generating performance report for student: ${studentId}`);
  };

  const handleViewCourseAnalytics = (courseId: string) => {
    alert(`Viewing detailed analytics for course: ${courseId}`);
  };

  const handleExportData = () => {
    alert("Exporting performance data...");
  };

  // Calculate overall statistics
  const overallStats = {
    totalStudents: students.length,
    averageGrade: students.reduce((acc, s) => acc + s.overallGrade, 0) / students.length,
    averageAttendance: students.reduce((acc, s) => acc + s.attendance, 0) / students.length,
    atRiskStudents: students.filter(s => s.riskLevel === "high").length,
    improvingStudents: students.filter(s => s.trend === "improving").length,
    totalCourses: courses.length,
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into student and course performance</p>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {timeRange === "semester" ? "This Semester" : 
                   timeRange === "month" ? "This Month" : "All Time"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeRange("month")}>This Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("semester")}>This Semester</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("all")}>All Time</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Grade</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageGrade.toFixed(1)}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+2.3% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageAttendance.toFixed(1)}%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+1.1% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk Students</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.atRiskStudents}</div>
              <p className="text-xs text-gray-600">
                {((overallStats.atRiskStudents / overallStats.totalStudents) * 100).toFixed(1)}% of class
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improving</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.improvingStudents}</div>
              <p className="text-xs text-gray-600">
                {((overallStats.improvingStudents / overallStats.totalStudents) * 100).toFixed(1)}% of class
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(metric => (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {getTrendIcon(metric.trend)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value}
                  <span className="text-sm font-normal text-gray-600">{metric.unit}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.changeType === "increase" ? "text-green-600" : 
                  metric.changeType === "decrease" ? "text-red-600" : "text-gray-600"
                }`}>
                  {metric.changeType === "increase" ? <TrendingUp className="h-3 w-3" /> : 
                   metric.changeType === "decrease" ? <TrendingDown className="h-3 w-3" /> : 
                   <BarChart3 className="h-3 w-3" />}
                  <span>{metric.change > 0 ? '+' : ''}{metric.change}{metric.unit} from target</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.min(100, Math.round((metric.value / metric.target) * 100))}%</span>
                  </div>
                  <Progress value={Math.min(100, (metric.value / metric.target) * 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name or ID..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Risk: {riskFilter === "all" ? "All" : riskFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setRiskFilter("all")}>All Risk Levels</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRiskFilter("low")}>Low Risk</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRiskFilter("medium")}>Medium Risk</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRiskFilter("high")}>High Risk</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trend: {trendFilter === "all" ? "All" : trendFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTrendFilter("all")}>All Trends</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTrendFilter("improving")}>Improving</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTrendFilter("stable")}>Stable</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTrendFilter("declining")}>Declining</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredStudents.length} students</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Performance
              </CardTitle>
              <CardDescription>Individual student performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredStudents.map(student => (
                <div key={student.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getRiskColor(student.riskLevel)}>
                        <span className="flex items-center gap-1">
                          {getRiskIcon(student.riskLevel)}
                          {student.riskLevel} risk
                        </span>
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewStudentDetails(student.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateReport(student.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Generate Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-3">
                    <div>
                      <div className={`text-lg font-bold ${getGradeColor(student.overallGrade)}`}>
                        {student.overallGrade}%
                      </div>
                      <div className="text-xs text-gray-600">Grade</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </div>
                      <div className="text-xs text-gray-600">Attendance</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {student.assignmentCompletion}%
                      </div>
                      <div className="text-xs text-gray-600">Assignments</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-3 w-3" />
                      Last active {formatTimeAgo(student.lastActive)}
                    </span>
                    <span className={`flex items-center gap-1 ${getTrendColor(student.trend)}`}>
                      {getTrendIcon(student.trend)}
                      {student.trend}
                    </span>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No students match your filters</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Performance
              </CardTitle>
              <CardDescription>Course-level metrics and student engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-600">{course.code} • {course.studentCount} students</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 ${getTrendColor(course.trend)}`}>
                        {getTrendIcon(course.trend)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCourseAnalytics(course.id)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Average Grade</span>
                        <span className={`font-medium ${getGradeColor(course.averageGrade)}`}>
                          {course.averageGrade}%
                        </span>
                      </div>
                      <Progress value={course.averageGrade} className={`h-2 ${getGradeBgColor(course.averageGrade)}`} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-medium text-purple-600">{course.completionRate}%</span>
                      </div>
                      <Progress value={course.completionRate} className="h-2 bg-purple-100" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Satisfaction</span>
                        <span className="font-medium text-yellow-600">{course.satisfaction}/5</span>
                      </div>
                      <Progress value={(course.satisfaction / 5) * 100} className="h-2 bg-yellow-100" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights & Actions</CardTitle>
            <CardDescription>Key insights and recommended actions based on performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Focus Areas</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Assignment completion rates need improvement</li>
                  <li>• Physics course shows declining performance</li>
                  <li>• 3 students require immediate intervention</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">Positive Trends</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Overall class average improved by 2.3%</li>
                  <li>• Attendance rates continue to rise</li>
                  <li>• 60% of students show improving trends</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-orange-50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold">Recommended Actions</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Schedule interventions for at-risk students</li>
                  <li>• Review Physics course curriculum</li>
                  <li>• Implement assignment completion incentives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}