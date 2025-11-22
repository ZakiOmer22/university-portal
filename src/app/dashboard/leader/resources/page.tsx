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
  Download,
  MoreHorizontal,
  FileText,
  Video,
  BookOpen,
  Link,
  Users,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  BookmarkCheck,
  Folder,
  FolderOpen,
  Upload,
  Plus,
  BarChart3,
  FileQuestion,
  GraduationCap,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "link" | "presentation" | "quiz";
  category: "course-material" | "assignment" | "lecture" | "reference" | "template";
  fileSize?: string;
  duration?: string;
  url?: string;
  uploadDate: string;
  lastAccessed?: string;
  uploader: string;
  downloadCount: number;
  viewCount: number;
  tags: string[];
  isBookmarked: boolean;
  access: "public" | "private" | "restricted";
}

const dummyResources: Resource[] = [
  { 
    id: "r1", 
    title: "CS101 Course Syllabus", 
    description: "Complete course syllabus for Introduction to Computer Science including schedule, grading policy, and learning objectives.",
    type: "document", 
    category: "course-material",
    fileSize: "2.4 MB",
    uploadDate: "2025-01-28T14:30:00Z",
    lastAccessed: "2025-01-29T10:15:00Z",
    uploader: "Dr. Smith",
    downloadCount: 45,
    viewCount: 128,
    tags: ["syllabus", "cs101", "requirements"],
    isBookmarked: true,
    access: "public"
  },
  { 
    id: "r2", 
    title: "Data Structures Lecture Slides", 
    description: "Comprehensive slides covering arrays, linked lists, stacks, and queues with code examples.",
    type: "presentation", 
    category: "lecture",
    fileSize: "8.7 MB",
    uploadDate: "2025-01-27T13:45:00Z",
    lastAccessed: "2025-01-28T16:20:00Z",
    uploader: "Prof. Chen",
    downloadCount: 32,
    viewCount: 89,
    tags: ["data-structures", "lecture", "slides"],
    isBookmarked: false,
    access: "public"
  },
  { 
    id: "r3", 
    title: "Programming Assignment Template", 
    description: "Standard template for all programming assignments including submission guidelines and formatting requirements.",
    type: "document", 
    category: "template",
    fileSize: "1.2 MB",
    uploadDate: "2025-01-26T12:15:00Z",
    uploader: "Dr. Wilson",
    downloadCount: 67,
    viewCount: 156,
    tags: ["template", "assignment", "programming"],
    isBookmarked: true,
    access: "public"
  },
  { 
    id: "r4", 
    title: "Algorithm Complexity Tutorial", 
    description: "Video tutorial explaining Big O notation and algorithm analysis with practical examples.",
    type: "video", 
    category: "lecture",
    duration: "25:34",
    uploadDate: "2025-01-25T11:30:00Z",
    lastAccessed: "2025-01-28T14:45:00Z",
    uploader: "Prof. Garcia",
    downloadCount: 28,
    viewCount: 142,
    tags: ["algorithms", "complexity", "tutorial"],
    isBookmarked: false,
    access: "public"
  },
  { 
    id: "r5", 
    title: "Midterm Study Guide", 
    description: "Comprehensive study guide for the upcoming midterm exam covering all topics from weeks 1-6.",
    type: "document", 
    category: "reference",
    fileSize: "3.1 MB",
    uploadDate: "2025-01-24T16:20:00Z",
    uploader: "Dr. Smith",
    downloadCount: 89,
    viewCount: 234,
    tags: ["study-guide", "midterm", "exam"],
    isBookmarked: true,
    access: "public"
  },
  { 
    id: "r6", 
    title: "Python Programming Reference", 
    description: "Quick reference guide for Python syntax and common programming patterns.",
    type: "link", 
    category: "reference",
    url: "https://docs.python.org/3/",
    uploadDate: "2025-01-23T14:45:00Z",
    uploader: "Prof. Thompson",
    downloadCount: 0,
    viewCount: 56,
    tags: ["python", "reference", "programming"],
    isBookmarked: false,
    access: "public"
  },
  { 
    id: "r7", 
    title: "Practice Quiz - Week 3", 
    description: "Self-assessment quiz covering object-oriented programming concepts and implementation.",
    type: "quiz", 
    category: "assignment",
    uploadDate: "2025-01-22T10:15:00Z",
    uploader: "Dr. Wilson",
    downloadCount: 23,
    viewCount: 78,
    tags: ["quiz", "practice", "week3"],
    isBookmarked: false,
    access: "restricted"
  },
  { 
    id: "r8", 
    title: "Faculty Meeting Notes", 
    description: "Summary of key decisions and action items from the latest faculty department meeting.",
    type: "document", 
    category: "reference",
    fileSize: "1.8 MB",
    uploadDate: "2025-01-21T09:30:00Z",
    uploader: "Department Chair",
    downloadCount: 12,
    viewCount: 34,
    tags: ["meeting", "faculty", "notes"],
    isBookmarked: false,
    access: "private"
  },
];

export default function LeaderResourcesPage() {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setTimeout(() => {
      try {
        setResources(dummyResources);
        setLoading(false);
      } catch {
        setError("Failed to load resources.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) ||
                         resource.description.toLowerCase().includes(search.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter;
    const matchesAccess = accessFilter === "all" || resource.access === accessFilter;
    
    return matchesSearch && matchesType && matchesCategory && matchesAccess;
  });

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "document": return <FileText className="h-5 w-5 text-blue-600" />;
      case "video": return <Video className="h-5 w-5 text-red-600" />;
      case "link": return <Link className="h-5 w-5 text-green-600" />;
      case "presentation": return <FileText className="h-5 w-5 text-orange-600" />;
      case "quiz": return <FileQuestion className="h-5 w-5 text-purple-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "document": return "bg-blue-100 text-blue-800";
      case "video": return "bg-red-100 text-red-800";
      case "link": return "bg-green-100 text-green-800";
      case "presentation": return "bg-orange-100 text-orange-800";
      case "quiz": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: Resource["category"]) => {
    switch (category) {
      case "course-material": return <BookOpen className="h-4 w-4" />;
      case "assignment": return <FileText className="h-4 w-4" />;
      case "lecture": return <Video className="h-4 w-4" />;
      case "reference": return <Folder className="h-4 w-4" />;
      case "template": return <FileText className="h-4 w-4" />;
      default: return <Folder className="h-4 w-4" />;
    }
  };

  const getAccessColor = (access: Resource["access"]) => {
    switch (access) {
      case "public": return "bg-green-100 text-green-800 border-green-200";
      case "private": return "bg-red-100 text-red-800 border-red-200";
      case "restricted": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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

  const handleDownloadResource = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId 
          ? { ...resource, downloadCount: resource.downloadCount + 1 }
          : resource
      )
    );
    alert(`Downloading resource: ${resourceId}`);
  };

  const handleViewResource = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId 
          ? { ...resource, viewCount: resource.viewCount + 1, lastAccessed: new Date().toISOString() }
          : resource
      )
    );
    alert(`Viewing resource: ${resourceId}`);
  };

  const handleToggleBookmark = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId 
          ? { ...resource, isBookmarked: !resource.isBookmarked }
          : resource
      )
    );
  };

  const handleShareResource = (resourceId: string) => {
    alert(`Sharing resource: ${resourceId}`);
  };

  const handleEditResource = (resourceId: string) => {
    alert(`Editing resource: ${resourceId}`);
  };

  const handleDeleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(resource => resource.id !== resourceId));
    alert(`Deleted resource: ${resourceId}`);
  };

  const resourceStats = {
    totalResources: resources.length,
    totalDownloads: resources.reduce((acc, r) => acc + r.downloadCount, 0),
    totalViews: resources.reduce((acc, r) => acc + r.viewCount, 0),
    bookmarkedResources: resources.filter(r => r.isBookmarked).length,
    documentCount: resources.filter(r => r.type === "document").length,
    videoCount: resources.filter(r => r.type === "video").length,
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
            <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
            <p className="text-gray-600 mt-1">Manage and share educational materials, documents, and learning resources</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export List
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4" />
              Upload New
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceStats.totalResources}</div>
              <p className="text-xs text-gray-600">Available resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceStats.totalDownloads}</div>
              <p className="text-xs text-gray-600">Resource downloads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
              <BookmarkCheck className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceStats.bookmarkedResources}</div>
              <p className="text-xs text-gray-600">Saved resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourceStats.documentCount}</div>
              <p className="text-xs text-gray-600">PDFs & Documents</p>
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
                    placeholder="Search resources by title, description, or tags..."
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
                    <DropdownMenuItem onClick={() => setTypeFilter("document")}>Documents</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("video")}>Videos</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("presentation")}>Presentations</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("quiz")}>Quizzes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("link")}>Links</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      Category: {categoryFilter === "all" ? "All" : categoryFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("course-material")}>Course Material</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("assignment")}>Assignments</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("lecture")}>Lectures</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("reference")}>References</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("template")}>Templates</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Access: {accessFilter === "all" ? "All" : accessFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setAccessFilter("all")}>All Access</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAccessFilter("public")}>Public</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAccessFilter("restricted")}>Restricted</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAccessFilter("private")}>Private</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{filteredResources.length} resources</span>
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

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        {getCategoryIcon(resource.category)}
                        {resource.category.replace('-', ' ')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleBookmark(resource.id)}
                    >
                      {resource.isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Bookmark className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewResource(resource.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadResource(resource.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareResource(resource.id)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditResource(resource.id)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteResource(resource.id)}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge variant="secondary" className={getTypeColor(resource.type)}>
                    {resource.type}
                  </Badge>
                  <Badge variant="outline" className={getAccessColor(resource.access)}>
                    {resource.access}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {resource.description}
                </p>

                {/* Resource Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">
                      {resource.fileSize || resource.duration || "External Link"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {resource.fileSize ? "File Size" : resource.duration ? "Duration" : "Type"}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{resource.uploader}</div>
                    <div className="text-xs text-gray-600">Uploaded by</div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {resource.downloadCount}
                    </div>
                    <div className="text-xs text-gray-600">Downloads</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {resource.viewCount}
                    </div>
                    <div className="text-xs text-gray-600">Views</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${
                      resource.lastAccessed ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {resource.lastAccessed ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-600">Accessed</div>
                  </div>
                </div>

                {/* Tags */}
                {resource.tags.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Uploaded
                  </span>
                  <span>{formatTimeAgo(resource.uploadDate)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewResource(resource.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDownloadResource(resource.id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Found</h3>
              <p className="text-gray-600 mb-4">
                {search ? `No resources found for "${search}"` : "No resources match your filters"}
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                    setCategoryFilter("all");
                    setAccessFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}