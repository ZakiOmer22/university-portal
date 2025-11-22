"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
  Archive,
  Trash2,
  Clock,
  AlertTriangle,
  Info,
  User,
  BookOpen,
  Calendar,
  BarChart3,
  Mail,
  MessageCircle,
  Users,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  type: "academic" | "attendance" | "behavior" | "system" | "deadline";
  priority: "low" | "medium" | "high" | "critical";
  status: "unread" | "read" | "archived" | "resolved";
  studentName?: string;
  studentId?: string;
  course?: string;
  dueDate?: string;
  trigger: "auto" | "manual";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  actionRequired: boolean;
  relatedEntities?: string[];
}

const dummyAlerts: AlertItem[] = [
  { 
    id: "a1", 
    title: "Failing Grade Alert", 
    description: "Student has scored below 60% in the last two assignments and is at risk of failing the course.",
    type: "academic", 
    priority: "high",
    status: "unread",
    studentName: "Ethan Hunt",
    studentId: "STU005",
    course: "CS101 - Introduction to Computer Science",
    trigger: "auto",
    createdBy: "System",
    createdAt: "2025-01-28T14:30:00Z",
    updatedAt: "2025-01-28T14:30:00Z",
    actionRequired: true,
    relatedEntities: ["assignment-3", "assignment-4"]
  },
  { 
    id: "a2", 
    title: "Low Attendance Warning", 
    description: "Student attendance has dropped below 75% this semester. Intervention may be required.",
    type: "attendance", 
    priority: "medium",
    status: "unread",
    studentName: "Fiona Gallagher",
    studentId: "STU006",
    course: "MATH201 - Advanced Mathematics",
    trigger: "auto",
    createdBy: "System",
    createdAt: "2025-01-28T13:45:00Z",
    updatedAt: "2025-01-28T13:45:00Z",
    actionRequired: true,
    relatedEntities: ["attendance-record"]
  },
  { 
    id: "a3", 
    title: "Assignment Submission Deadline", 
    description: "Reminder: Project proposal submissions are due in 24 hours. 3 students haven't submitted yet.",
    type: "deadline", 
    priority: "medium",
    status: "read",
    course: "CS202 - Data Structures",
    dueDate: "2025-01-29T23:59:00Z",
    trigger: "auto",
    createdBy: "System",
    createdAt: "2025-01-28T12:15:00Z",
    updatedAt: "2025-01-28T12:15:00Z",
    actionRequired: false,
    relatedEntities: ["project-proposal", "student-list"]
  },
  { 
    id: "a4", 
    title: "System Maintenance Scheduled", 
    description: "Planned system maintenance this weekend. The platform will be unavailable for 2 hours.",
    type: "system", 
    priority: "low",
    status: "read",
    trigger: "manual",
    createdBy: "IT Department",
    createdAt: "2025-01-28T11:30:00Z",
    updatedAt: "2025-01-28T11:30:00Z",
    actionRequired: false
  },
  { 
    id: "a5", 
    title: "Multiple Late Submissions", 
    description: "Student has submitted 3 assignments late in the past two weeks. Consider discussing time management.",
    type: "behavior", 
    priority: "medium",
    status: "unread",
    studentName: "George Miller",
    studentId: "STU007",
    course: "PHY101 - Physics Fundamentals",
    trigger: "auto",
    createdBy: "System",
    createdAt: "2025-01-27T16:20:00Z",
    updatedAt: "2025-01-27T16:20:00Z",
    actionRequired: true,
    relatedEntities: ["assignment-5", "assignment-6", "assignment-7"]
  },
  { 
    id: "a6", 
    title: "Critical Grade Drop", 
    description: "Student's grade has dropped by more than 15% since the midterm exam. Immediate intervention recommended.",
    type: "academic", 
    priority: "critical",
    status: "unread",
    studentName: "Ian Cooper",
    studentId: "STU009",
    course: "CS101 - Introduction to Computer Science",
    trigger: "auto",
    createdBy: "System",
    createdAt: "2025-01-27T14:45:00Z",
    updatedAt: "2025-01-27T14:45:00Z",
    actionRequired: true,
    relatedEntities: ["midterm-exam", "assignment-8"]
  },
  { 
    id: "a7", 
    title: "Course Enrollment Reminder", 
    description: "Reminder to finalize course enrollments for next semester by end of week.",
    type: "deadline", 
    priority: "medium",
    status: "archived",
    trigger: "manual",
    createdBy: "Registrar Office",
    createdAt: "2025-01-26T10:15:00Z",
    updatedAt: "2025-01-27T09:30:00Z",
    actionRequired: false
  },
  { 
    id: "a8", 
    title: "Academic Probation Risk", 
    description: "Student is at risk of academic probation if current performance trends continue.",
    type: "academic", 
    priority: "high",
    status: "resolved",
    studentName: "Julia Park",
    studentId: "STU010",
    course: "BIO101 - Biology Fundamentals",
    trigger: "auto",
    createdBy: "System",
    createdAt: "2025-01-25T09:30:00Z",
    updatedAt: "2025-01-26T14:20:00Z",
    actionRequired: false,
    relatedEntities: ["grade-report", "attendance-record"]
  },
];

export default function LeaderAlertsPage() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      try {
        setAlerts(dummyAlerts);
        setLoading(false);
      } catch {
        setError("Failed to load alerts.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(search.toLowerCase()) ||
                         alert.description.toLowerCase().includes(search.toLowerCase()) ||
                         (alert.studentName && alert.studentName.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const getPriorityIcon = (priority: AlertItem["priority"]) => {
    switch (priority) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "medium": return <Info className="h-4 w-4 text-yellow-600" />;
      case "low": return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: AlertItem["priority"]) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: AlertItem["type"]) => {
    switch (type) {
      case "academic": return <BookOpen className="h-4 w-4" />;
      case "attendance": return <User className="h-4 w-4" />;
      case "behavior": return <AlertTriangle className="h-4 w-4" />;
      case "system": return <BarChart3 className="h-4 w-4" />;
      case "deadline": return <Calendar className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: AlertItem["type"]) => {
    switch (type) {
      case "academic": return "bg-purple-100 text-purple-800";
      case "attendance": return "bg-green-100 text-green-800";
      case "behavior": return "bg-orange-100 text-orange-800";
      case "system": return "bg-gray-100 text-gray-800";
      case "deadline": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: AlertItem["status"]) => {
    switch (status) {
      case "unread": return "bg-blue-100 text-blue-800";
      case "read": return "bg-gray-100 text-gray-800";
      case "archived": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: "read", updatedAt: new Date().toISOString() } : alert
      )
    );
  };

  const handleMarkAsUnread = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: "unread", updatedAt: new Date().toISOString() } : alert
      )
    );
  };

  const handleArchiveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: "archived", updatedAt: new Date().toISOString() } : alert
      )
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: "resolved", updatedAt: new Date().toISOString() } : alert
      )
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleViewDetails = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    // alert(`Viewing details for: ${alert?.title}`);
  };

  const handleContactStudent = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    // alert(`Opening message composer for: ${alert?.studentName}`);
  };

  const handleViewStudentProfile = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    // alert(`Opening student profile for: ${alert?.studentName}`);
  };

  const alertStats = {
    totalAlerts: alerts.length,
    unreadAlerts: alerts.filter(a => a.status === "unread").length,
    criticalAlerts: alerts.filter(a => a.priority === "critical").length,
    actionRequired: alerts.filter(a => a.actionRequired).length,
    academicAlerts: alerts.filter(a => a.type === "academic").length,
    resolvedAlerts: alerts.filter(a => a.status === "resolved").length,
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
          
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600 mt-1">Monitor student performance, deadlines, and system notifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <BellOff className="h-4 w-4" />
              Mute All
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Bell className="h-4 w-4" />
              Create Alert
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Bell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertStats.totalAlerts}</div>
              <p className="text-xs text-gray-600">Active notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertStats.unreadAlerts}</div>
              <p className="text-xs text-gray-600">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertStats.criticalAlerts}</div>
              <p className="text-xs text-gray-600">High priority</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Action Required</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertStats.actionRequired}</div>
              <p className="text-xs text-gray-600">Need intervention</p>
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
                    placeholder="Search alerts by title, description, or student..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Type: {typeFilter === "all" ? "All" : typeFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("academic")}>Academic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("attendance")}>Attendance</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("behavior")}>Behavior</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("deadline")}>Deadline</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("system")}>System</DropdownMenuItem>
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
                    <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All Priorities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("critical")}>Critical</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("unread")}>Unread</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("read")}>Read</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("archived")}>Archived</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredAlerts.length} alerts</span>
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

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <Card 
              key={alert.id} 
              className={`hover:shadow-lg transition-shadow duration-200 ${
                alert.status === "unread" ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              } ${alert.priority === "critical" ? 'border-red-200' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      alert.priority === "critical" ? 'bg-red-100' :
                      alert.priority === "high" ? 'bg-orange-100' :
                      alert.priority === "medium" ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {getPriorityIcon(alert.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <Badge variant="secondary" className={getPriorityColor(alert.priority)}>
                          <span className="flex items-center gap-1">
                            {getPriorityIcon(alert.priority)}
                            {alert.priority}
                          </span>
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(alert.type)}>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(alert.type)}
                            {alert.type}
                          </span>
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {alert.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        {alert.studentName && (
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {alert.studentName} ({alert.studentId})
                          </span>
                        )}
                        {alert.course && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {alert.course}
                          </span>
                        )}
                        {alert.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(alert.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTimeAgo(alert.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          Created by: {alert.createdBy}
                        </span>
                      </div>

                      {alert.relatedEntities && alert.relatedEntities.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Related:</span>
                          <div className="flex flex-wrap gap-1">
                            {alert.relatedEntities.slice(0, 3).map(entity => (
                              <Badge key={entity} variant="outline" className="text-xs">
                                {entity}
                              </Badge>
                            ))}
                            {alert.relatedEntities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{alert.relatedEntities.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {alert.actionRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Action Required
                      </Badge>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(alert.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        {alert.studentName && (
                          <>
                            <DropdownMenuItem onClick={() => handleContactStudent(alert.id)}>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewStudentProfile(alert.id)}>
                              <User className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        {alert.status === "unread" ? (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(alert.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Read
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleMarkAsUnread(alert.id)}>
                            <Bell className="h-4 w-4 mr-2" />
                            Mark as Unread
                          </DropdownMenuItem>
                        )}
                        
                        {alert.status !== "resolved" && (
                          <DropdownMenuItem onClick={() => handleResolveAlert(alert.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark Resolved
                          </DropdownMenuItem>
                        )}
                        
                        {alert.status !== "archived" && (
                          <DropdownMenuItem onClick={() => handleArchiveAlert(alert.id)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(alert.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {alert.studentName && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleContactStudent(alert.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  )}
                  
                  {alert.status === "unread" ? (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Mark Read
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleMarkAsUnread(alert.id)}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Mark Unread
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? `No alerts found for "${search}"` : "No alerts match your filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setPriorityFilter("all");
                  setStatusFilter("all");
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