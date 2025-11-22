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
  Mail,
  Download,
  MoreHorizontal,
  User,
  Clock,
  Eye,
  MessageCircle,
  Archive,
  Trash2,
  Reply,
  Forward,
  Star,
  StarOff,
  XCircle,
  MailOpen,
  Calendar,
  BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  starred: boolean;
  labels: string[];
  priority: "low" | "normal" | "high";
  type: "student" | "colleague" | "system";
}

const dummyMessages: Message[] = [
  { 
    id: "m1", 
    from: "Alice Johnson", 
    fromEmail: "alice.johnson@university.edu",
    subject: "Question about Assignment 3", 
    content: "Hi, I'm having trouble understanding the requirements for Assignment 3. Could you please clarify the submission guidelines?",
    date: "2025-01-28T14:30:00Z", 
    read: false, 
    starred: true,
    labels: ["assignment", "urgent"],
    priority: "high",
    type: "student"
  },
  { 
    id: "m2", 
    from: "Bob Smith", 
    fromEmail: "bob.smith@university.edu",
    subject: "Requesting Meeting", 
    content: "I'd like to schedule a meeting to discuss my research project progress. Are you available this week?",
    date: "2025-01-28T13:45:00Z", 
    read: true, 
    starred: false,
    labels: ["meeting"],
    priority: "normal",
    type: "student"
  },
  { 
    id: "m3", 
    from: "Charlie Lee", 
    fromEmail: "charlie.lee@university.edu",
    subject: "Feedback on Project Proposal", 
    content: "Thank you for your feedback on my project proposal. I've made the requested changes and would appreciate another review.",
    date: "2025-01-28T12:15:00Z", 
    read: false, 
    starred: false,
    labels: ["feedback", "project"],
    priority: "normal",
    type: "student"
  },
  { 
    id: "m4", 
    from: "Diana Ross", 
    fromEmail: "diana.ross@university.edu",
    subject: "Attendance Issue", 
    content: "I wanted to inform you that I'll be absent from class next week due to a family emergency.",
    date: "2025-01-28T11:30:00Z", 
    read: true, 
    starred: false,
    labels: ["attendance"],
    priority: "low",
    type: "student"
  },
  { 
    id: "m5", 
    from: "Dr. Michael Chen", 
    fromEmail: "michael.chen@university.edu",
    subject: "Department Meeting Reminder", 
    content: "Reminder: Department meeting this Friday at 2 PM in the main conference room.",
    date: "2025-01-27T16:20:00Z", 
    read: true, 
    starred: true,
    labels: ["meeting", "department"],
    priority: "normal",
    type: "colleague"
  },
  { 
    id: "m6", 
    from: "System Notification", 
    fromEmail: "noreply@university.edu",
    subject: "Grade Submission Deadline", 
    content: "This is a reminder that grade submissions for CS101 are due by February 15th.",
    date: "2025-01-27T14:45:00Z", 
    read: false, 
    starred: false,
    labels: ["system", "deadline"],
    priority: "high",
    type: "system"
  },
];

export default function LeaderMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      try {
        setMessages(dummyMessages);
        setLoading(false);
      } catch {
        setError("Failed to load messages.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.from.toLowerCase().includes(search.toLowerCase()) ||
                         message.subject.toLowerCase().includes(search.toLowerCase()) ||
                         message.content.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "unread" && !message.read) ||
                         (statusFilter === "read" && message.read);
    const matchesType = typeFilter === "all" || message.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || message.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getPriorityIcon = (priority: Message["priority"]) => {
    switch (priority) {
      case "high": return <Mail className="h-4 w-4 text-red-600" />;
      case "normal": return <Mail className="h-4 w-4 text-blue-600" />;
      case "low": return <Mail className="h-4 w-4 text-gray-600" />;
      default: return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Message["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "normal": return "bg-blue-100 text-blue-800 border-blue-200";
      case "low": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: Message["type"]) => {
    switch (type) {
      case "student": return "bg-green-100 text-green-800";
      case "colleague": return "bg-purple-100 text-purple-800";
      case "system": return "bg-orange-100 text-orange-800";
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

  const handleViewMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
    alert(`Open message: ${messageId}`);
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const handleMarkAsUnread = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: false } : msg
      )
    );
  };

  const handleArchiveMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    alert(`Archived message: ${messageId}`);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    alert(`Deleted message: ${messageId}`);
  };

  const handleReply = (messageId: string) => {
    alert(`Reply to message: ${messageId}`);
  };

  const handleForward = (messageId: string) => {
    alert(`Forward message: ${messageId}`);
  };

  const messageStats = {
    totalMessages: messages.length,
    unreadMessages: messages.filter(m => !m.read).length,
    starredMessages: messages.filter(m => m.starred).length,
    highPriority: messages.filter(m => m.priority === "high").length,
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
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Manage your communications with students and colleagues</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4" />
              Compose
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageStats.totalMessages}</div>
              <p className="text-xs text-gray-600">In your inbox</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <MailOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageStats.unreadMessages}</div>
              <p className="text-xs text-gray-600">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Starred</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageStats.starredMessages}</div>
              <p className="text-xs text-gray-600">Important messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Mail className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageStats.highPriority}</div>
              <p className="text-xs text-gray-600">Urgent messages</p>
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
                    placeholder="Search messages by sender, subject, or content..."
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
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Messages</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("unread")}>Unread</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("read")}>Read</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Type: {typeFilter === "all" ? "All" : typeFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("student")}>Students</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("colleague")}>Colleagues</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("system")}>System</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Priority: {priorityFilter === "all" ? "All" : priorityFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All Priorities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("normal")}>Normal</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredMessages.length} messages</span>
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

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map(message => (
            <Card 
              key={message.id} 
              className={`hover:shadow-lg transition-shadow duration-200 ${
                !message.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg mt-1">
                      {message.from.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{message.from}</h3>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500 truncate">{message.fromEmail}</span>
                        {!message.read && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            Unread
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{message.subject}</h4>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {message.content}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className={getPriorityColor(message.priority)}>
                          <span className="flex items-center gap-1">
                            {getPriorityIcon(message.priority)}
                            {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                          </span>
                        </Badge>
                        
                        <Badge variant="outline" className={getTypeColor(message.type)}>
                          {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                        </Badge>

                        {message.labels.map(label => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}

                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTimeAgo(message.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStar(message.id)}
                    >
                      {message.starred ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewMessage(message.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReply(message.id)}>
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleForward(message.id)}>
                          <Forward className="h-4 w-4 mr-2" />
                          Forward
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {message.read ? (
                          <DropdownMenuItem onClick={() => handleMarkAsUnread(message.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Mark as Unread
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(message.id)}>
                            <MailOpen className="h-4 w-4 mr-2" />
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleArchiveMessage(message.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMessage(message.id)}
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
                    onClick={() => handleReply(message.id)}
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleForward(message.id)}
                  >
                    <Forward className="h-4 w-4 mr-1" />
                    Forward
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewMessage(message.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? `No messages found for "${search}"` : "No messages match your filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setPriorityFilter("all");
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