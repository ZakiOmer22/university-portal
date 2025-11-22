"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Share2,
  User,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Plus,
  Download,
  FileText,
  MessageCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Meeting {
  id: string;
  title: string;
  description: string;
  type: "one-on-one" | "group" | "department" | "parent-teacher" | "planning";
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  location: string;
  participants: {
    id: string;
    name: string;
    role: "student" | "parent" | "teacher" | "admin";
    email: string;
    status: "confirmed" | "tentative" | "declined";
  }[];
  organizer: string;
  agenda: string[];
  notes?: string;
  recordingUrl?: string;
  materials: string[];
  createdAt: string;
  updatedAt: string;
}

const dummyMeetings: Meeting[] = [
  { 
    id: "m1", 
    title: "Weekly Progress Review - Alice Johnson", 
    description: "Review student progress and discuss upcoming assignments and challenges.",
    type: "one-on-one", 
    status: "scheduled",
    date: "2025-02-01",
    startTime: "14:00",
    endTime: "14:45",
    duration: 45,
    location: "Room 302",
    participants: [
      { id: "p1", name: "Alice Johnson", role: "student", email: "alice.johnson@university.edu", status: "confirmed" },
      { id: "p2", name: "Dr. Smith", role: "teacher", email: "smith@university.edu", status: "confirmed" }
    ],
    organizer: "Dr. Smith",
    agenda: ["Review recent assignments", "Discuss project progress", "Address any concerns"],
    materials: ["progress-report.pdf", "assignment-feedback.docx"],
    createdAt: "2025-01-28T14:30:00Z",
    updatedAt: "2025-01-29T10:15:00Z"
  },
  { 
    id: "m2", 
    title: "CS101 Teaching Team Sync", 
    description: "Weekly coordination meeting for CS101 teaching assistants and instructors.",
    type: "group", 
    status: "scheduled",
    date: "2025-02-02",
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    location: "Virtual - Zoom",
    participants: [
      { id: "p3", name: "Dr. Smith", role: "teacher", email: "smith@university.edu", status: "confirmed" },
      { id: "p4", name: "Prof. Chen", role: "teacher", email: "chen@university.edu", status: "confirmed" },
      { id: "p5", name: "TA Bob Wilson", role: "teacher", email: "bob.wilson@university.edu", status: "tentative" }
    ],
    organizer: "Dr. Smith",
    agenda: ["Review upcoming assignments", "Coordinate office hours", "Discuss student performance"],
    materials: ["course-schedule.pdf", "ta-assignments.xlsx"],
    createdAt: "2025-01-27T13:45:00Z",
    updatedAt: "2025-01-28T16:20:00Z"
  },
  { 
    id: "m3", 
    title: "Department Faculty Meeting", 
    description: "Monthly department meeting to discuss curriculum updates and administrative matters.",
    type: "department", 
    status: "completed",
    date: "2025-01-25",
    startTime: "15:00",
    endTime: "16:30",
    duration: 90,
    location: "Main Conference Room",
    participants: [
      { id: "p6", name: "Dr. Smith", role: "teacher", email: "smith@university.edu", status: "confirmed" },
      { id: "p7", name: "Dr. Wilson", role: "teacher", email: "wilson@university.edu", status: "confirmed" },
      { id: "p8", name: "Prof. Garcia", role: "teacher", email: "garcia@university.edu", status: "confirmed" }
    ],
    organizer: "Department Chair",
    agenda: ["Curriculum review", "Budget planning", "Faculty updates"],
    notes: "Discussed new course proposals and approved budget for next semester.",
    recordingUrl: "https://university.edu/recordings/m3",
    materials: ["curriculum-proposal.pdf", "budget-report.xlsx"],
    createdAt: "2025-01-20T12:15:00Z",
    updatedAt: "2025-01-25T16:30:00Z"
  },
  { 
    id: "m4", 
    title: "Parent-Teacher Conference - Ethan Hunt", 
    description: "Discuss student performance and address parent concerns.",
    type: "parent-teacher", 
    status: "scheduled",
    date: "2025-02-03",
    startTime: "16:00",
    endTime: "16:30",
    duration: 30,
    location: "Virtual - Google Meet",
    participants: [
      { id: "p9", name: "Ethan Hunt", role: "student", email: "ethan.hunt@university.edu", status: "confirmed" },
      { id: "p10", name: "Mr. & Mrs. Hunt", role: "parent", email: "hunt.parents@email.com", status: "confirmed" },
      { id: "p11", name: "Dr. Smith", role: "teacher", email: "smith@university.edu", status: "confirmed" }
    ],
    organizer: "Dr. Smith",
    agenda: ["Review academic progress", "Discuss attendance", "Address concerns"],
    materials: ["grade-report.pdf", "attendance-record.pdf"],
    createdAt: "2025-01-26T11:30:00Z",
    updatedAt: "2025-01-28T14:45:00Z"
  },
  { 
    id: "m5", 
    title: "Course Planning Session - Spring 2025", 
    description: "Plan curriculum and assignments for the upcoming Spring semester.",
    type: "planning", 
    status: "in-progress",
    date: "2025-01-29",
    startTime: "13:00",
    endTime: "15:00",
    duration: 120,
    location: "Curriculum Office",
    participants: [
      { id: "p12", name: "Dr. Smith", role: "teacher", email: "smith@university.edu", status: "confirmed" },
      { id: "p13", name: "Prof. Thompson", role: "teacher", email: "thompson@university.edu", status: "confirmed" }
    ],
    organizer: "Dr. Smith",
    agenda: ["Review course objectives", "Plan assignment schedule", "Coordinate resources"],
    materials: ["syllabus-template.docx", "resource-list.pdf"],
    createdAt: "2025-01-24T16:20:00Z",
    updatedAt: "2025-01-29T13:00:00Z"
  },
  { 
    id: "m6", 
    title: "Student Support Team Meeting", 
    description: "Coordinate support for students requiring additional academic assistance.",
    type: "group", 
    status: "cancelled",
    date: "2025-01-30",
    startTime: "11:00",
    endTime: "12:00",
    duration: 60,
    location: "Student Support Center",
    participants: [
      { id: "p14", name: "Dr. Smith", role: "teacher", email: "smith@university.edu", status: "declined" },
      { id: "p15", name: "Counselor Davis", role: "admin", email: "davis@university.edu", status: "declined" }
    ],
    organizer: "Counselor Davis",
    agenda: ["Review at-risk students", "Plan intervention strategies", "Coordinate resources"],
    materials: ["support-plan.pdf"],
    createdAt: "2025-01-23T14:45:00Z",
    updatedAt: "2025-01-28T09:30:00Z"
  },
];

export default function LeaderMeetingsPage() {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      try {
        setMeetings(dummyMeetings);
        setLoading(false);
      } catch {
        setError("Failed to load meetings.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(search.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(search.toLowerCase()) ||
                         meeting.participants.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || meeting.type === typeFilter;
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: Meeting["status"]) => {
    switch (status) {
      case "scheduled": return <Clock className="h-4 w-4 text-blue-600" />;
      case "in-progress": return <Clock className="h-4 w-4 text-orange-600" />;
      case "completed": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress": return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: Meeting["type"]) => {
    switch (type) {
      case "one-on-one": return <User className="h-4 w-4" />;
      case "group": return <Users className="h-4 w-4" />;
      case "department": return <Users className="h-4 w-4" />;
      case "parent-teacher": return <User className="h-4 w-4" />;
      case "planning": return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Meeting["type"]) => {
    switch (type) {
      case "one-on-one": return "bg-purple-100 text-purple-800";
      case "group": return "bg-indigo-100 text-indigo-800";
      case "department": return "bg-blue-100 text-blue-800";
      case "parent-teacher": return "bg-green-100 text-green-800";
      case "planning": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLocationIcon = (location: string) => {
    return location.toLowerCase().includes("virtual") ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isUpcomingMeeting = (meeting: Meeting) => {
    const now = new Date();
    const meetingDateTime = new Date(`${meeting.date}T${meeting.startTime}`);
    return meetingDateTime > now && meeting.status === "scheduled";
  };

  const handleJoinMeeting = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    alert(`Joining meeting: ${meeting?.title}`);
  };

  const handleEditMeeting = (meetingId: string) => {
    alert(`Editing meeting: ${meetingId}`);
  };

  const handleCancelMeeting = (meetingId: string) => {
    setMeetings(prev =>
      prev.map(meeting =>
        meeting.id === meetingId ? { ...meeting, status: "cancelled" } : meeting
      )
    );
    alert(`Cancelled meeting: ${meetingId}`);
  };

  const handleRescheduleMeeting = (meetingId: string) => {
    alert(`Rescheduling meeting: ${meetingId}`);
  };

  const handleShareMeeting = (meetingId: string) => {
    alert(`Sharing meeting: ${meetingId}`);
  };

  const handleDownloadMaterials = (meetingId: string) => {
    alert(`Downloading materials for meeting: ${meetingId}`);
  };

  const handleViewRecording = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (meeting?.recordingUrl) {
      window.open(meeting.recordingUrl, '_blank');
    } else {
      alert("No recording available for this meeting.");
    }
  };

  const handleSendReminder = (meetingId: string) => {
    alert(`Sending reminders for meeting: ${meetingId}`);
  };

  const meetingStats = {
    totalMeetings: meetings.length,
    upcomingMeetings: meetings.filter(m => isUpcomingMeeting(m)).length,
    completedMeetings: meetings.filter(m => m.status === "completed").length,
    oneOnOneMeetings: meetings.filter(m => m.type === "one-on-one").length,
    totalParticipants: meetings.reduce((acc, m) => acc + m.participants.length, 0),
    hoursScheduled: meetings.reduce((acc, m) => acc + m.duration, 0) / 60,
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
            <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600 mt-1">Schedule and manage meetings with students, parents, and colleagues</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Calendar
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meetingStats.totalMeetings}</div>
              <p className="text-xs text-gray-600">All meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meetingStats.upcomingMeetings}</div>
              <p className="text-xs text-gray-600">Scheduled meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">One-on-One</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meetingStats.oneOnOneMeetings}</div>
              <p className="text-xs text-gray-600">Individual meetings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meetingStats.hoursScheduled.toFixed(1)}</div>
              <p className="text-xs text-gray-600">Meeting time scheduled</p>
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
                    placeholder="Search meetings by title, description, or participants..."
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
                    <DropdownMenuItem onClick={() => setTypeFilter("one-on-one")}>One-on-One</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("group")}>Group</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("department")}>Department</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("parent-teacher")}>Parent-Teacher</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("planning")}>Planning</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>Scheduled</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredMeetings.length} meetings</span>
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

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeetings.map(meeting => (
            <Card key={meeting.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      meeting.status === "scheduled" ? 'bg-blue-100' :
                      meeting.status === "in-progress" ? 'bg-orange-100' :
                      meeting.status === "completed" ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getStatusIcon(meeting.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{meeting.title}</CardTitle>
                      <CardDescription className="text-sm">{meeting.organizer}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleJoinMeeting(meeting.id)}>
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditMeeting(meeting.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShareMeeting(meeting.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {meeting.status === "scheduled" && (
                        <>
                          <DropdownMenuItem onClick={() => handleSendReminder(meeting.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRescheduleMeeting(meeting.id)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCancelMeeting(meeting.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </>
                      )}
                      {meeting.status === "completed" && meeting.recordingUrl && (
                        <DropdownMenuItem onClick={() => handleViewRecording(meeting.id)}>
                          <Video className="h-4 w-4 mr-2" />
                          View Recording
                        </DropdownMenuItem>
                      )}
                      {meeting.materials.length > 0 && (
                        <DropdownMenuItem onClick={() => handleDownloadMaterials(meeting.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Materials
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleCancelMeeting(meeting.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge variant="secondary" className={getStatusColor(meeting.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(meeting.status)}
                      {meeting.status.replace('-', ' ')}
                    </span>
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(meeting.type)}>
                    <span className="flex items-center gap-1">
                      {getTypeIcon(meeting.type)}
                      {meeting.type.replace('-', ' ')}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {meeting.description}
                </p>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(meeting.date)}
                    </div>
                    <div className="text-xs text-gray-600">Date</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </div>
                    <div className="text-xs text-gray-600">Time ({meeting.duration} min)</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    {getLocationIcon(meeting.location)}
                    Location:
                  </span>
                  <span className="font-medium">{meeting.location}</span>
                </div>

                {/* Participants */}
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                    <Users className="h-4 w-4" />
                    <span>Participants ({meeting.participants.length})</span>
                  </div>
                  <div className="space-y-1">
                    {meeting.participants.slice(0, 3).map(participant => (
                      <div key={participant.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            participant.status === "confirmed" ? "bg-green-500" :
                            participant.status === "tentative" ? "bg-yellow-500" : "bg-red-500"
                          }`} />
                          <span className="font-medium">{participant.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {participant.role}
                          </Badge>
                        </div>
                        <span className="text-gray-500 capitalize">{participant.status}</span>
                      </div>
                    ))}
                    {meeting.participants.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{meeting.participants.length - 3} more participants
                      </div>
                    )}
                  </div>
                </div>

                {/* Agenda Preview */}
                {meeting.agenda.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                      <FileText className="h-4 w-4" />
                      <span>Agenda</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {meeting.agenda.slice(0, 2).map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                      {meeting.agenda.length > 2 && (
                        <li className="text-gray-500">
                          +{meeting.agenda.length - 2} more items
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Materials */}
                {meeting.materials.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                      <FileText className="h-4 w-4" />
                      <span>Materials ({meeting.materials.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {meeting.materials.slice(0, 2).map((material, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                      {meeting.materials.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{meeting.materials.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2 pt-4">
                {meeting.status === "scheduled" && (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleJoinMeeting(meeting.id)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                )}
                {meeting.status === "completed" && meeting.recordingUrl && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewRecording(meeting.id)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Recording
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEditMeeting(meeting.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleShareMeeting(meeting.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredMeetings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meetings Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? `No meetings found for "${search}"` : "No meetings match your filters"}
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule First Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}