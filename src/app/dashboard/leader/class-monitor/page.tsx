"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Filter, 
  Download, 
  Send, 
  Eye, 
  EyeOff, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
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
  studentId: string;
  status: "present" | "absent" | "late" | "excused";
  lastActive: string;
  grade: number;
  attendance: number;
  participation: number;
  courses: string[];
}

interface ClassActivity {
  id: string;
  studentId: string;
  studentName: string;
  type: "login" | "assignment" | "quiz" | "participation" | "absence";
  description: string;
  timestamp: string;
  course: string;
}

interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
}

const dummyStudents: Student[] = [
  {
    id: "s1",
    fullName: "Alice Johnson",
    email: "alice.johnson@university.edu",
    studentId: "STU001",
    status: "present",
    lastActive: "2025-01-15T10:30:00Z",
    grade: 92,
    attendance: 95,
    participation: 88,
    courses: ["CS101", "MATH201", "PHY301"]
  },
  {
    id: "s2",
    fullName: "Bob Smith",
    email: "bob.smith@university.edu",
    studentId: "STU002",
    status: "late",
    lastActive: "2025-01-15T09:45:00Z",
    grade: 78,
    attendance: 82,
    participation: 65,
    courses: ["CS101", "ENG101"]
  },
  {
    id: "s3",
    fullName: "Carol Davis",
    email: "carol.davis@university.edu",
    studentId: "STU003",
    status: "absent",
    lastActive: "2025-01-14T16:20:00Z",
    grade: 85,
    attendance: 88,
    participation: 92,
    courses: ["CS101", "MATH201", "BIO101"]
  },
  {
    id: "s4",
    fullName: "David Wilson",
    email: "david.wilson@university.edu",
    studentId: "STU004",
    status: "present",
    lastActive: "2025-01-15T11:15:00Z",
    grade: 96,
    attendance: 100,
    participation: 95,
    courses: ["CS101", "PHY301"]
  },
  {
    id: "s5",
    fullName: "Eva Brown",
    email: "eva.brown@university.edu",
    studentId: "STU005",
    status: "excused",
    lastActive: "2025-01-13T14:00:00Z",
    grade: 88,
    attendance: 90,
    participation: 85,
    courses: ["CS101", "MATH201", "ENG101"]
  }
];

const dummyActivities: ClassActivity[] = [
  {
    id: "a1",
    studentId: "s1",
    studentName: "Alice Johnson",
    type: "assignment",
    description: "Submitted Project Proposal",
    timestamp: "2025-01-15T10:25:00Z",
    course: "CS101"
  },
  {
    id: "a2",
    studentId: "s2",
    studentName: "Bob Smith",
    type: "login",
    description: "Logged into course portal",
    timestamp: "2025-01-15T09:45:00Z",
    course: "CS101"
  },
  {
    id: "a3",
    studentId: "s4",
    studentName: "David Wilson",
    type: "quiz",
    description: "Completed Week 3 Quiz - Score: 98%",
    timestamp: "2025-01-15T11:10:00Z",
    course: "CS101"
  },
  {
    id: "a4",
    studentId: "s3",
    studentName: "Carol Davis",
    type: "absence",
    description: "Marked absent for today's class",
    timestamp: "2025-01-15T08:00:00Z",
    course: "CS101"
  },
  {
    id: "a5",
    studentId: "s1",
    studentName: "Alice Johnson",
    type: "participation",
    description: "Active in class discussion",
    timestamp: "2025-01-15T10:30:00Z",
    course: "CS101"
  }
];

const dummyAttendance: AttendanceSummary[] = [
  { date: "2025-01-15", present: 3, absent: 1, late: 1, excused: 1, total: 6 },
  { date: "2025-01-14", present: 4, absent: 1, late: 0, excused: 1, total: 6 },
  { date: "2025-01-13", present: 5, absent: 0, late: 1, excused: 0, total: 6 },
  { date: "2025-01-12", present: 4, absent: 1, late: 0, excused: 1, total: 6 },
  { date: "2025-01-11", present: 3, absent: 2, late: 1, excused: 0, total: 6 }
];

export default function ClassMonitorPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<ClassActivity[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Simulate API call
    setTimeout(() => {
      setStudents(dummyStudents);
      setActivities(dummyActivities);
      setAttendance(dummyAttendance);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Student["status"]) => {
    switch (status) {
      case "present": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "absent": return <XCircle className="h-4 w-4 text-red-600" />;
      case "late": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "excused": return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Student["status"]) => {
    const baseClasses = "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "present": return <span className={`${baseClasses} bg-green-100 text-green-800`}>Present</span>;
      case "absent": return <span className={`${baseClasses} bg-red-100 text-red-800`}>Absent</span>;
      case "late": return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Late</span>;
      case "excused": return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Excused</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  const getActivityIcon = (type: ClassActivity["type"]) => {
    switch (type) {
      case "login": return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "assignment": return <BookOpen className="h-4 w-4 text-green-500" />;
      case "quiz": return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      case "participation": return <Users className="h-4 w-4 text-orange-500" />;
      case "absence": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
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

  const overallStats = {
    totalStudents: students.length,
    present: students.filter(s => s.status === "present").length,
    absent: students.filter(s => s.status === "absent").length,
    late: students.filter(s => s.status === "late").length,
    averageGrade: students.reduce((acc, s) => acc + s.grade, 0) / students.length,
    averageAttendance: students.reduce((acc, s) => acc + s.attendance, 0) / students.length
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
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Class Monitor</h1>
            <p className="text-gray-600 mt-1">Real-time monitoring of student activity and attendance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
              Send Announcement
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
              <p className="text-xs text-gray-600">Active in class</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.present}</div>
              <p className="text-xs text-gray-600">
                {((overallStats.present / overallStats.totalStudents) * 100).toFixed(1)}% attendance
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
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageAttendance.toFixed(1)}%</div>
              <p className="text-xs text-gray-600">Overall attendance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>Current class status and student information</CardDescription>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Students</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("present")}>Present</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("absent")}>Absent</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("late")}>Late</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("excused")}>Excused</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(student.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">{student.fullName}</p>
                          {getStatusBadge(student.status)}
                        </div>
                        <p className="text-sm text-gray-600">{student.studentId}</p>
                        <p className="text-xs text-gray-500">
                          Last active: {formatTimeAgo(student.lastActive)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{student.grade}%</p>
                        <p className="text-xs text-gray-600">Grade</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Flag Concern</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No students found matching your criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Live feed of student interactions and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{activity.studentName}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.course}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No recent activity to display.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Last 5 class sessions attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {attendance.map((day, index) => (
                <div key={day.date} className="text-center">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-green-600">Present</span>
                      <span className="font-medium">{day.present}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-600">Absent</span>
                      <span className="font-medium">{day.absent}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-yellow-600">Late</span>
                      <span className="font-medium">{day.late}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-blue-600">Excused</span>
                      <span className="font-medium">{day.excused}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      {((day.present / day.total) * 100).toFixed(0)}% Present
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Attention Needed:</strong> 2 students have been absent for more than 3 consecutive classes. 
            Consider reaching out to provide support.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}