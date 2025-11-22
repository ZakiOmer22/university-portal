"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Mail,
  Download,
  MoreHorizontal,
  User,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  BarChart3,
  UserCheck,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  grade: number;
  attendancePercent: number;
  pendingAssignments: number;
  completedAssignments: number;
  courses: string[];
  lastActive: string;
  status: "active" | "inactive" | "at-risk";
  performance: "excellent" | "good" | "needs-improvement";
  studentId: string;
  joinDate: string;
}

const dummyStudents: Student[] = [
  {
    id: "s1",
    fullName: "Alice Johnson",
    email: "alice.johnson@university.edu",
    studentId: "STU001",
    grade: 98,
    attendancePercent: 100,
    pendingAssignments: 0,
    completedAssignments: 12,
    courses: ["CS101", "MATH201", "PHY301"],
    lastActive: "2025-01-28T14:30:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "excellent"
  },
  {
    id: "s2",
    fullName: "Bob Smith",
    email: "bob.smith@university.edu",
    studentId: "STU002",
    grade: 95,
    attendancePercent: 92,
    pendingAssignments: 1,
    completedAssignments: 10,
    courses: ["CS101", "ENG101"],
    lastActive: "2025-01-28T13:45:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "excellent"
  },
  {
    id: "s3",
    fullName: "Charlie Lee",
    email: "charlie.lee@university.edu",
    studentId: "STU003",
    grade: 94,
    attendancePercent: 85,
    pendingAssignments: 2,
    completedAssignments: 8,
    courses: ["CS101", "MATH201", "BIO101"],
    lastActive: "2025-01-28T12:15:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "good"
  },
  {
    id: "s4",
    fullName: "Diana Ross",
    email: "diana.ross@university.edu",
    studentId: "STU004",
    grade: 89,
    attendancePercent: 90,
    pendingAssignments: 0,
    completedAssignments: 11,
    courses: ["CS101", "PHY301"],
    lastActive: "2025-01-28T11:30:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "good"
  },
  {
    id: "s5",
    fullName: "Ethan Hunt",
    email: "ethan.hunt@university.edu",
    studentId: "STU005",
    grade: 87,
    attendancePercent: 80,
    pendingAssignments: 3,
    completedAssignments: 7,
    courses: ["CS101", "MATH201", "ENG101"],
    lastActive: "2025-01-27T16:20:00Z",
    joinDate: "2024-09-01",
    status: "at-risk",
    performance: "needs-improvement"
  },
  {
    id: "s6",
    fullName: "Fiona Gallagher",
    email: "fiona.gallagher@university.edu",
    studentId: "STU006",
    grade: 82,
    attendancePercent: 78,
    pendingAssignments: 4,
    completedAssignments: 6,
    courses: ["CS101", "BIO101"],
    lastActive: "2025-01-27T14:45:00Z",
    joinDate: "2024-09-01",
    status: "at-risk",
    performance: "needs-improvement"
  },
  {
    id: "s7",
    fullName: "George Miller",
    email: "george.miller@university.edu",
    studentId: "STU007",
    grade: 91,
    attendancePercent: 95,
    pendingAssignments: 1,
    completedAssignments: 9,
    courses: ["CS101", "MATH201", "PHY301"],
    lastActive: "2025-01-28T10:15:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "good"
  },
  {
    id: "s8",
    fullName: "Hannah Chen",
    email: "hannah.chen@university.edu",
    studentId: "STU008",
    grade: 96,
    attendancePercent: 98,
    pendingAssignments: 0,
    completedAssignments: 13,
    courses: ["CS101", "ENG101"],
    lastActive: "2025-01-28T15:20:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "excellent"
  },
  {
    id: "s9",
    fullName: "Ian Cooper",
    email: "ian.cooper@university.edu",
    studentId: "STU009",
    grade: 84,
    attendancePercent: 82,
    pendingAssignments: 2,
    completedAssignments: 8,
    courses: ["CS101", "MATH201"],
    lastActive: "2025-01-27T17:30:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "good"
  },
  {
    id: "s10",
    fullName: "Julia Park",
    email: "julia.park@university.edu",
    studentId: "STU010",
    grade: 79,
    attendancePercent: 75,
    pendingAssignments: 5,
    completedAssignments: 5,
    courses: ["CS101", "BIO101", "ENG101"],
    lastActive: "2025-01-26T09:45:00Z",
    joinDate: "2024-09-01",
    status: "at-risk",
    performance: "needs-improvement"
  },
  {
    id: "s11",
    fullName: "Kevin Zhang",
    email: "kevin.zhang@university.edu",
    studentId: "STU011",
    grade: 88,
    attendancePercent: 88,
    pendingAssignments: 1,
    completedAssignments: 10,
    courses: ["CS101", "PHY301"],
    lastActive: "2025-01-28T08:30:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "good"
  },
  {
    id: "s12",
    fullName: "Lisa Thompson",
    email: "lisa.thompson@university.edu",
    studentId: "STU012",
    grade: 93,
    attendancePercent: 96,
    pendingAssignments: 0,
    completedAssignments: 11,
    courses: ["CS101", "MATH201", "ENG101"],
    lastActive: "2025-01-28T16:45:00Z",
    joinDate: "2024-09-01",
    status: "active",
    performance: "excellent"
  }
];

export default function LeaderAllStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [performanceFilter, setPerformanceFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      setStudents(dummyStudents);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(search.toLowerCase()) ||
                         student.email.toLowerCase().includes(search.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesPerformance = performanceFilter === "all" || student.performance === performanceFilter;
    
    return matchesSearch && matchesStatus && matchesPerformance;
  });

  const getStatusIcon = (status: Student["status"]) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "inactive": return <Clock className="h-4 w-4 text-gray-600" />;
      case "at-risk": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "at-risk": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPerformanceColor = (performance: Student["performance"]) => {
    switch (performance) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "needs-improvement": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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

  const handleViewProfile = (studentId: string) => {
    alert(`View profile for student ${studentId}`);
  };

  const handleSendMessage = (studentId: string) => {
    alert(`Open message composer for student ${studentId}`);
  };

  const handleMarkPresent = (studentId: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId ? { ...s, attendancePercent: Math.min(100, s.attendancePercent + 1) } : s
      )
    );
    alert(`Marked ${studentId} present (local only)`);
  };

  const handleExportStudent = (studentId: string) => {
    alert(`Export data for student ${studentId}`);
  };

  const overallStats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "active").length,
    atRiskStudents: students.filter(s => s.status === "at-risk").length,
    averageGrade: students.reduce((acc, s) => acc + s.grade, 0) / students.length,
    averageAttendance: students.reduce((acc, s) => acc + s.attendancePercent, 0) / students.length,
    totalPending: students.reduce((acc, s) => acc + s.pendingAssignments, 0)
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
            <p className="text-gray-600 mt-1">Manage and monitor student performance and engagement</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4" />
              Message All
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
              <p className="text-xs text-gray-600">Enrolled in class</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.activeStudents}</div>
              <p className="text-xs text-gray-600">
                {((overallStats.activeStudents / overallStats.totalStudents) * 100).toFixed(1)}% of class
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageGrade.toFixed(1)}%</div>
              <p className="text-xs text-gray-600">Class performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.atRiskStudents}</div>
              <p className="text-xs text-gray-600">Need attention</p>
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
                    placeholder="Search students by name, email, or ID..."
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
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("at-risk")}>At Risk</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Performance: {performanceFilter === "all" ? "All" : performanceFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setPerformanceFilter("all")}>All Performance</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPerformanceFilter("excellent")}>Excellent</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPerformanceFilter("good")}>Good</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPerformanceFilter("needs-improvement")}>Needs Improvement</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredStudents.length} students</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {student.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{student.fullName}</CardTitle>
                      <CardDescription className="text-sm">{student.studentId}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProfile(student.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendMessage(student.id)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMarkPresent(student.id)}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Mark Present
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportStudent(student.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className={getStatusColor(student.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(student.status)}
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </Badge>
                  <Badge variant="outline" className={getPerformanceColor(student.performance)}>
                    {student.performance.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="text-sm">
                  <p className="text-gray-600 truncate">{student.email}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-xl font-bold ${getGradeColor(student.grade)}`}>
                      {student.grade}%
                    </div>
                    <div className="text-xs text-gray-600">Grade</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${getAttendanceColor(student.attendancePercent)}`}>
                      {student.attendancePercent}%
                    </div>
                    <div className="text-xs text-gray-600">Attendance</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${
                      student.pendingAssignments === 0 ? 'text-green-600' : 
                      student.pendingAssignments <= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {student.pendingAssignments}
                    </div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Assignment Progress</span>
                    <span className="font-medium">
                      {student.completedAssignments}/{student.completedAssignments + student.pendingAssignments}
                    </span>
                  </div>
                  <Progress 
                    value={
                      (student.completedAssignments / (student.completedAssignments + student.pendingAssignments)) * 100
                    } 
                    className={
                      student.pendingAssignments === 0 ? "bg-green-600" :
                      student.pendingAssignments <= 2 ? "bg-yellow-600" : "bg-red-600"
                    }
                  />
                </div>

                {/* Courses */}
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Enrolled Courses</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {student.courses.slice(0, 3).map(course => (
                      <Badge key={course} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                    {student.courses.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.courses.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Active */}
                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last active
                  </span>
                  <span>{formatTimeAgo(student.lastActive)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSendMessage(student.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewProfile(student.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? `No students found for "${search}"` : "No students match your filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPerformanceFilter("all");
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