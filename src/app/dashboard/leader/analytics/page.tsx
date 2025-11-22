"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  BookOpen,
  Calendar,
  Target,
  Award,
  Clock,
  BarChart3,
  Download,
  Filter,
  Eye,
  Users,
  Star,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface CourseProgress {
  id: string;
  code: string;
  name: string;
  creditHours: number;
  semester: number;
  instructor: string;
  status: "in-progress" | "completed" | "upcoming";
  grades: {
    final: number;
    midterm: number;
    assignment: number;
    project: number;
    quiz: number;
  };
  attendance: number;
  completion: number;
  nextDeadline?: string;
}

const dummyCourses: CourseProgress[] = [
  {
    id: "course-uuid-1",
    code: "CS101",
    name: "Computer Science 101",
    creditHours: 3,
    semester: 1,
    instructor: "Dr. Sarah Johnson",
    status: "completed",
    grades: { final: 90, midterm: 88, assignment: 95, project: 92, quiz: 89 },
    attendance: 96,
    completion: 100
  },
  {
    id: "course-uuid-2",
    code: "MATH201",
    name: "Advanced Mathematics",
    creditHours: 4,
    semester: 1,
    instructor: "Prof. Michael Chen",
    status: "completed",
    grades: { final: 85, midterm: 80, assignment: 90, project: 87, quiz: 82 },
    attendance: 92,
    completion: 100
  },
  {
    id: "course-uuid-3",
    code: "ENG102",
    name: "English Literature",
    creditHours: 2,
    semester: 2,
    instructor: "Dr. Emily Wilson",
    status: "in-progress",
    grades: { final: 78, midterm: 75, assignment: 80, project: 79, quiz: 76 },
    attendance: 88,
    completion: 65,
    nextDeadline: "2025-03-15"
  },
  {
    id: "course-uuid-4",
    code: "HIST210",
    name: "World History",
    creditHours: 3,
    semester: 2,
    instructor: "Prof. Robert Brown",
    status: "in-progress",
    grades: { final: 85, midterm: 83, assignment: 88, project: 84, quiz: 86 },
    attendance: 94,
    completion: 70,
    nextDeadline: "2025-03-20"
  },
  {
    id: "course-uuid-5",
    code: "PHY301",
    name: "Physics Laboratory",
    creditHours: 2,
    semester: 2,
    instructor: "Dr. Lisa Zhang",
    status: "in-progress",
    grades: { final: 0, midterm: 82, assignment: 85, project: 0, quiz: 88 },
    attendance: 90,
    completion: 45,
    nextDeadline: "2025-02-28"
  },
  {
    id: "course-uuid-6",
    code: "CS301",
    name: "Data Structures",
    creditHours: 4,
    semester: 3,
    instructor: "Prof. David Kim",
    status: "upcoming",
    grades: { final: 0, midterm: 0, assignment: 0, project: 0, quiz: 0 },
    attendance: 0,
    completion: 0
  }
];

function gradeToGPA(grade: number) {
  if (grade >= 90) return 4.0;
  if (grade >= 80) return 3.0;
  if (grade >= 70) return 2.0;
  if (grade >= 60) return 1.0;
  return 0;
}

function getGradeColor(grade: number) {
  if (grade >= 90) return "text-green-600";
  if (grade >= 80) return "text-blue-600";
  if (grade >= 70) return "text-yellow-600";
  return "text-red-600";
}

function getStatusColor(status: CourseProgress["status"]) {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "in-progress": return "bg-blue-100 text-blue-800";
    case "upcoming": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getStatusIcon(status: CourseProgress["status"]) {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-4 w-4" />;
    case "in-progress": return <Clock className="h-4 w-4" />;
    case "upcoming": return <Calendar className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
}

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      setCourses(dummyCourses);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester;
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSemester && matchesStatus;
  });

  const completedCourses = courses.filter(c => c.status === "completed");
  const inProgressCourses = courses.filter(c => c.status === "in-progress");

  // Calculate overall statistics
  const totalCredits = completedCourses.reduce((sum, c) => sum + c.creditHours, 0);
  const totalGradePoints = completedCourses.reduce((sum, c) => {
    const avgGrade = Object.values(c.grades).reduce((a, b) => a + b, 0) / Object.values(c.grades).filter(g => g > 0).length;
    return sum + gradeToGPA(avgGrade) * c.creditHours;
  }, 0);
  const gpa = totalCredits ? totalGradePoints / totalCredits : 0;

  const overallAverage = completedCourses.length > 0
    ? completedCourses.reduce((sum, c) => {
      const avgGrade = Object.values(c.grades).reduce((a, b) => a + b, 0) / Object.values(c.grades).filter(g => g > 0).length;
      return sum + avgGrade;
    }, 0) / completedCourses.length
    : 0;

  const overallAttendance = inProgressCourses.length > 0
    ? inProgressCourses.reduce((sum, c) => sum + c.attendance, 0) / inProgressCourses.length
    : 0;

  const semesters = Array.from(new Set(courses.map(c => c.semester))).sort((a, b) => a - b);

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
            <h1 className="text-3xl font-bold text-gray-900">Academic Progress</h1>
            <p className="text-gray-600 mt-1">Track your course performance and achievements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                  <Award className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{gpa.toFixed(2)}</div>
                  <p className="text-xs text-gray-600">
                    {completedCourses.length} completed courses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{overallAverage.toFixed(1)}%</div>
                  <p className="text-xs text-gray-600">Overall performance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{overallAttendance.toFixed(1)}%</div>
                  <p className="text-xs text-gray-600">Current semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalCredits}</div>
                  <p className="text-xs text-gray-600">Completed hours</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Current semester completion status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inProgressCourses.map(course => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{course.code}</span>
                          <span>{course.completion}%</span>
                        </div>
                        <Progress value={course.completion} className={
                          course.completion >= 80 ? "bg-green-600" :
                            course.completion >= 60 ? "bg-yellow-600" : "bg-red-600"
                        } />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Grade distribution across courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedCourses.slice(0, 4).map(course => {
                      const avgGrade = Object.values(course.grades).reduce((a, b) => a + b, 0) / Object.values(course.grades).filter(g => g > 0).length;
                      return (
                        <div key={course.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${avgGrade >= 90 ? 'bg-green-500' :
                                avgGrade >= 80 ? 'bg-blue-500' :
                                  avgGrade >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                            <span className="text-sm font-medium">{course.code}</span>
                          </div>
                          <span className={`font-bold ${getGradeColor(avgGrade)}`}>
                            {avgGrade.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest academic accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Honor Roll</p>
                      <p className="text-sm text-gray-600">Semester 1, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Perfect Attendance</p>
                      <p className="text-sm text-gray-600">CS101 Course</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Project Excellence</p>
                      <p className="text-sm text-gray-600">MATH201 Project</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-600" />
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value === "all" ? "all" : Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Semesters</option>
                        {semesters.map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{filteredCourses.length} courses</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map(course => {
                const avgGrade = Object.values(course.grades).reduce((a, b) => a + b, 0) / Object.values(course.grades).filter(g => g > 0).length;

                return (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{course.code} - {course.name}</CardTitle>
                          <CardDescription className="mt-1">{course.instructor}</CardDescription>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(course.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(course.status)}
                            {course.status.replace('-', ' ')}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Course Info */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-gray-900">{course.creditHours}</div>
                          <div className="text-xs text-gray-600">Credits</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">Sem {course.semester}</div>
                          <div className="text-xs text-gray-600">Semester</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${getGradeColor(avgGrade)}`}>
                            {avgGrade > 0 ? avgGrade.toFixed(1) + '%' : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-600">Average</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {course.status === "in-progress" && (
                        <div>
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span>Course Completion</span>
                            <span>{course.completion}%</span>
                          </div>
                          <Progress value={course.completion} className={
                            course.completion >= 80 ? "bg-green-600" :
                              course.completion >= 60 ? "bg-yellow-600" : "bg-red-600"
                          } />
                        </div>
                      )}

                      {/* Grades Breakdown */}
                      {course.status !== "upcoming" && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Grade Breakdown</div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {Object.entries(course.grades).map(([type, grade]) => (
                              grade > 0 && (
                                <div key={type} className="text-center">
                                  <div className={`text-sm font-bold ${getGradeColor(grade)}`}>
                                    {grade}%
                                  </div>
                                  <div className="text-xs text-gray-600 capitalize">
                                    {type}
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next Deadline */}
                      {course.nextDeadline && (
                        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                          <span>Next Deadline</span>
                          <span>{new Date(course.nextDeadline).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button className="w-full" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
                  <p className="text-gray-600">
                    No courses match your current filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                  <CardDescription>Grade distribution across assessment types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['final', 'midterm', 'assignment', 'project', 'quiz'].map(type => {
                      // Type guard to ensure we're using valid grade types
                      const gradeType = type as 'final' | 'midterm' | 'assignment' | 'project' | 'quiz';

                      const relevantCourses = completedCourses.filter(c =>
                        c.grades && c.grades[gradeType] > 0
                      );

                      const average = relevantCourses.length > 0
                        ? relevantCourses.reduce((sum, c) => sum + (c.grades?.[gradeType] || 0), 0) / relevantCourses.length
                        : 0;

                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize text-sm text-gray-700">{type}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${average >= 90 ? 'bg-green-500' :
                                    average >= 80 ? 'bg-blue-500' :
                                      average >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                style={{ width: `${Math.min(average, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${average >= 90 ? 'text-green-600' :
                                average >= 80 ? 'text-blue-600' :
                                  average >= 70 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                              {average.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Semester Comparison</CardTitle>
                  <CardDescription>Performance across different semesters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {semesters.map(semester => {
                      const semesterCourses = courses.filter(c => c.semester === semester && c.status === "completed");
                      const semesterAverage = semesterCourses.length > 0
                        ? semesterCourses.reduce((sum, c) => {
                          const avgGrade = Object.values(c.grades).reduce((a, b) => a + b, 0) / Object.values(c.grades).filter(g => g > 0).length;
                          return sum + avgGrade;
                        }, 0) / semesterCourses.length
                        : 0;

                      return (
                        <div key={semester} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Semester {semester}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${semesterAverage >= 90 ? 'bg-green-500' :
                                    semesterAverage >= 80 ? 'bg-blue-500' :
                                      semesterAverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                style={{ width: `${semesterAverage}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${getGradeColor(semesterAverage)}`}>
                              {semesterAverage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Recommendations</CardTitle>
                <CardDescription>Areas for improvement and strengths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-900">Strong Performance</p>
                      <p className="text-sm text-green-700">Excellent results in Computer Science courses. Consider advanced topics.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-900">Attendance Improvement</p>
                      <p className="text-sm text-yellow-700">Focus on consistent attendance in English Literature for better performance.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900">Upcoming Challenges</p>
                      <p className="text-sm text-blue-700">Prepare for Data Structures in Semester 3 - consider pre-study materials.</p>
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