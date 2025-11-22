"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Megaphone,
  Eye,
  Share2,
  Download,
  Plus,
  MoreHorizontal,
  Bell,
  BellOff,
  FileText
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  date: string;
  category: "General" | "Academic" | "Events" | "Urgent";
  content: string;
  priority: "low" | "medium" | "high";
  isRead?: boolean;
  author: string;
  attachments?: number;
}

const dummyAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Campus Reopening Dates Announced",
    date: "2025-08-01T09:00:00Z",
    category: "General",
    content: "The University of Hargeisa will reopen for the Fall semester starting September 1st. Students are advised to complete registration by August 25th. All students must ensure they have completed their vaccination requirements before returning to campus.",
    priority: "high",
    author: "University Administration",
    attachments: 2
  },
  {
    id: "a2",
    title: "Midterm Exams Schedule Released",
    date: "2025-09-15T12:00:00Z",
    category: "Academic",
    content: "The midterm exams will take place from October 10th to October 20th. Please check your respective department notice boards for detailed schedules. Exam halls will be assigned based on your course registration.",
    priority: "high",
    author: "Examination Office",
    attachments: 1
  },
  {
    id: "a3",
    title: "Health Awareness Week",
    date: "2025-08-20T08:00:00Z",
    category: "Events",
    content: "Join us for Health Awareness Week starting August 25th, with workshops and seminars on nutrition, mental health, and fitness at the Student Center. Free health checkups will be available throughout the week.",
    priority: "medium",
    author: "Student Health Services",
    attachments: 0
  },
  {
    id: "a4",
    title: "Library Extended Hours",
    date: "2025-09-05T14:00:00Z",
    category: "General",
    content: "The university library will extend its opening hours during exam weeks from 8 AM to 10 PM to support students' study needs. Additional study spaces have been arranged in the adjacent buildings.",
    priority: "medium",
    author: "Library Management",
    attachments: 0
  },
  {
    id: "a5",
    title: "URGENT: Campus Network Maintenance",
    date: "2025-08-22T16:00:00Z",
    category: "Urgent",
    content: "Emergency network maintenance will occur tonight from 10 PM to 2 AM. All campus internet services will be unavailable during this period. Plan your online activities accordingly.",
    priority: "high",
    author: "IT Department",
    attachments: 0,
    isRead: false
  },
  {
    id: "a6",
    title: "Cultural Festival Scheduled",
    date: "2025-09-25T16:00:00Z",
    category: "Events",
    content: "The annual Cultural Festival will be held on October 5th. All students are invited to participate and celebrate diverse traditions and arts. Registration for performances and stalls is now open.",
    priority: "low",
    author: "Cultural Committee",
    attachments: 1
  },
  {
    id: "a7",
    title: "New Student Portal Features",
    date: "2025-08-10T11:00:00Z",
    category: "General",
    content: "We have launched new features in the student portal including improved course registration and real-time academic progress tracking. Training sessions will be held next week.",
    priority: "medium",
    author: "IT Department",
    attachments: 3
  },
  {
    id: "a8",
    title: "Guest Lecture Series",
    date: "2025-09-12T09:00:00Z",
    category: "Academic",
    content: "Renowned experts will present lectures on various topics in technology and health sciences throughout September. Check schedules online and register early as seats are limited.",
    priority: "medium",
    author: "Academic Affairs",
    attachments: 2
  },
  {
    id: "a9",
    title: "Sports Day Announcement",
    date: "2025-09-20T10:00:00Z",
    category: "Events",
    content: "Sports Day will take place on October 15th at the University Sports Complex. Teams are forming now, join your favorite sport! Registration closes September 30th.",
    priority: "low",
    author: "Sports Department",
    attachments: 1
  },
  {
    id: "a10",
    title: "Scholarship Application Deadline Extended",
    date: "2025-08-28T15:00:00Z",
    category: "Academic",
    content: "Due to high demand, the scholarship application deadline has been extended to September 20th. Additional funding has been allocated for deserving students.",
    priority: "high",
    author: "Financial Aid Office",
    attachments: 1
  }
];

const ITEMS_PER_PAGE = 6;

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<"All" | Announcement["category"]>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      setAnnouncements(dummyAnnouncements);
      setLoading(false);
    }, 1200);
  }, []);

  // Filtered, searched, and sorted data
  const filtered = announcements
    .filter(announcement => 
      selectedCategory === "All" || announcement.category === selectedCategory
    )
    .filter(announcement =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getCategoryIcon = (category: Announcement["category"]) => {
    switch (category) {
      case "General": return <Megaphone className="h-4 w-4" />;
      case "Academic": return <BookOpen className="h-4 w-4" />;
      case "Events": return <Calendar className="h-4 w-4" />;
      case "Urgent": return <Bell className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: Announcement["category"]) => {
    switch (category) {
      case "General": return "bg-blue-100 text-blue-800";
      case "Academic": return "bg-purple-100 text-purple-800";
      case "Events": return "bg-green-100 text-green-800";
      case "Urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const announcementDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - announcementDate.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return announcementDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const markAsRead = (id: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id ? { ...announcement, isRead: true } : announcement
      )
    );
  };

  const unreadCount = announcements.filter(a => !a.isRead).length;

  // Create Announcement Form Component
  const CreateAnnouncementForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create New Announcement</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </Button>
        </CardTitle>
        <CardDescription>Create a new announcement for your class</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input placeholder="Enter announcement title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="General">General</option>
                <option value="Academic">Academic</option>
                <option value="Events">Events</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="priority" value="low" className="mr-2" />
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Low
                </span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="priority" value="medium" className="mr-2" defaultChecked />
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Medium
                </span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="priority" value="high" className="mr-2" />
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  High
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              placeholder="Enter announcement content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag and drop files here or click to browse</p>
              <Button variant="outline" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Publish Announcement
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          
          <div className="flex gap-4">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
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
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-1">Stay updated with the latest news and important updates</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </Button>
        </div>

        {/* Create Announcement Form */}
        {showCreateForm && <CreateAnnouncementForm />}

        {/* Stats and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.length}</div>
              <p className="text-xs text-gray-600">Active posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-gray-600">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <Bell className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {announcements.filter(a => a.priority === "high").length}
              </div>
              <p className="text-xs text-gray-600">High priority</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {announcements.filter(a => {
                  const date = new Date(a.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-xs text-gray-600">Recent announcements</p>
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
                    placeholder="Search announcements..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {selectedCategory}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedCategory("All")}>All Categories</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("General")}>General</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("Academic")}>Academic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("Events")}>Events</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("Urgent")}>Urgent</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filtered.length} results</span>
                <span>•</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Announcements Grid */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Megaphone className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? `No results found for "${searchTerm}"` : "No announcements match your filters"}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paged.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className={`relative overflow-hidden hover:shadow-lg transition-all duration-200 ${
                    !announcement.isRead ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={getCategoryColor(announcement.category)}>
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(announcement.category)}
                            {announcement.category}
                          </span>
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        {!announcement.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => markAsRead(announcement.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Mark as {announcement.isRead ? 'Unread' : 'Read'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight">
                      <Link 
                        href={`/dashboard/leader/announcements/${announcement.id}`}
                        className="hover:text-blue-600 transition-colors"
                        onClick={() => markAsRead(announcement.id)}
                      >
                        {announcement.title}
                      </Link>
                    </CardTitle>
                    
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {announcement.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(announcement.date)}
                      </span>
                      {(announcement.attachments && announcement.attachments > 0) && (
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {announcement.attachments} file{announcement.attachments !== 1 ? 's' : ''}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3 mb-4">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link 
                        href={`/dashboard/leader/announcements/${announcement.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        onClick={() => markAsRead(announcement.id)}
                      >
                        Read full announcement
                        <span>→</span>
                      </Link>
                      {!announcement.isRead && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          New
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-10 h-10 p-0"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}