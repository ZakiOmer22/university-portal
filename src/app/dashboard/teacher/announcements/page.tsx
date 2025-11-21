"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { useRouter } from "next/navigation";
import { 
    Bell, 
    Edit2, 
    Trash2, 
    Eye, 
    Plus,
    Search,
    Filter,
    Calendar,
    Users,
    Send,
    Clock,
    AlertCircle,
    CheckCircle2,
    MoreVertical,
    Download,
    Share2,
    Pin,
    BookOpen,
    Target
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string;
    priority: "normal" | "high" | "urgent";
    status: "draft" | "published" | "archived";
    audience: string[];
    courses: string[];
    attachments?: string[];
    views: number;
    author: string;
};

const PAGE_SIZE = 8;

export default function AnnouncementsPage() {
    const router = useRouter();

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [audienceFilter, setAudienceFilter] = useState<string>("all");

    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formPriority, setFormPriority] = useState<"normal" | "high" | "urgent">("normal");
    const [formAudience, setFormAudience] = useState<string[]>(["all"]);
    const [formCourses, setFormCourses] = useState<string[]>(["all"]);
    const [editId, setEditId] = useState<string | null>(null);
    const [formError, setFormError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const courses = ["Advanced Composition", "Modern Literature", "Creative Writing", "Professional Communication"];
    const audiences = ["All Students", "Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAnnouncements([
                {
                    id: "1",
                    title: "Midterm Exam Schedule Update",
                    content: "Due to unforeseen circumstances, the midterm exam schedule has been adjusted. All exams will now take place one week later than originally planned. Please check the updated schedule on the course portal and make necessary arrangements.\n\nKey changes:\n• Advanced Composition: Moved to October 25th\n• Modern Literature: Moved to October 26th\n• Creative Writing: Moved to October 27th\n\nContact your course instructor if you have scheduling conflicts.",
                    date: "2024-03-10T14:30:00Z",
                    priority: "high",
                    status: "published",
                    audience: ["All Students"],
                    courses: ["Advanced Composition", "Modern Literature", "Creative Writing"],
                    attachments: ["midterm_schedule.pdf"],
                    views: 142,
                    author: "Dr. Sarah Chen"
                },
                {
                    id: "2",
                    title: "Campus WiFi Maintenance This Weekend",
                    content: "The campus IT department will be performing essential WiFi upgrades from Friday 10:00 PM to Sunday 6:00 AM. During this period, expect intermittent connectivity issues across all campus buildings.\n\nAlternative study spaces with reliable internet:\n• Main Library (Ground Floor)\n• Student Union Building\n• Engineering Building Computer Lab\n\nWe apologize for any inconvenience and appreciate your understanding.",
                    date: "2024-03-08T09:15:00Z",
                    priority: "normal",
                    status: "published",
                    audience: ["All Students"],
                    courses: ["All Courses"],
                    views: 89,
                    author: "Dr. Sarah Chen"
                },
                {
                    id: "3",
                    title: "New Research Paper Submission Guidelines",
                    content: "Effective immediately, all research papers must follow the updated formatting guidelines. Key changes include:\n• Double-spacing throughout\n• 12pt Times New Roman font\n• Updated citation format (APA 7th Edition)\n• Digital submission via portal only\n\nTemplate files and detailed guidelines are available in the course resources section. Papers not following these guidelines will be returned without grading.",
                    date: "2024-03-05T16:45:00Z",
                    priority: "high",
                    status: "published",
                    audience: ["Junior", "Senior"],
                    courses: ["Advanced Composition", "Professional Communication"],
                    attachments: ["formatting_guide.docx", "citation_examples.pdf"],
                    views: 203,
                    author: "Dr. Sarah Chen"
                },
                {
                    id: "4",
                    title: "Office Hours Rescheduled",
                    content: "My office hours for this week have been rescheduled due to a faculty meeting. The new schedule is:\n• Wednesday: 1:00 PM - 3:00 PM\n• Thursday: 10:00 AM - 12:00 PM\n• Friday: 2:00 PM - 4:00 PM\n\nPlease use the scheduling portal to book appointments. Walk-ins are also welcome during these hours.",
                    date: "2024-03-04T11:20:00Z",
                    priority: "normal",
                    status: "published",
                    audience: ["All Students"],
                    courses: ["Advanced Composition", "Creative Writing"],
                    views: 67,
                    author: "Dr. Sarah Chen"
                },
                {
                    id: "5",
                    title: "Upcoming Guest Lecture Series",
                    content: "We're excited to announce a series of guest lectures from industry professionals starting next month. Topics include digital publishing, technical writing, and creative nonfiction.\n\nFirst session: 'The Future of Digital Media' by Jane Smith (Editor, Tech Publications)\nDate: April 5th, 3:00 PM\nLocation: Auditorium B\n\nAttendance is optional but highly recommended for writing students.",
                    date: "2024-03-01T13:00:00Z",
                    priority: "normal",
                    status: "draft",
                    audience: ["Sophomore", "Junior", "Senior"],
                    courses: ["Creative Writing", "Professional Communication"],
                    views: 0,
                    author: "Dr. Sarah Chen"
                }
            ]);
            setLoading(false);
        }, 1200);
    }, []);

    const filteredAnnouncements = useMemo(() => {
        let filtered = announcements;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (a) =>
                    a.title.toLowerCase().includes(term) || 
                    a.content.toLowerCase().includes(term) ||
                    a.courses.some(course => course.toLowerCase().includes(term))
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(a => a.status === statusFilter);
        }

        if (priorityFilter !== "all") {
            filtered = filtered.filter(a => a.priority === priorityFilter);
        }

        if (audienceFilter !== "all") {
            filtered = filtered.filter(a => a.audience.includes(audienceFilter) || a.audience.includes("All Students"));
        }

        return filtered;
    }, [announcements, searchTerm, statusFilter, priorityFilter, audienceFilter]);

    const pageCount = Math.ceil(filteredAnnouncements.length / PAGE_SIZE);
    const paginatedAnnouncements = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredAnnouncements.slice(start, start + PAGE_SIZE);
    }, [filteredAnnouncements, currentPage]);

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    function resetForm() {
        setFormTitle("");
        setFormContent("");
        setFormPriority("normal");
        setFormAudience(["all"]);
        setFormCourses(["all"]);
        setEditId(null);
        setFormError("");
        setShowForm(false);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formTitle.trim() || !formContent.trim()) {
            setFormError("Title and Content are required.");
            return;
        }

        if (editId) {
            setAnnouncements((prev) =>
                prev.map((a) =>
                    a.id === editId ? { 
                        ...a, 
                        title: formTitle, 
                        content: formContent,
                        priority: formPriority,
                        audience: formAudience,
                        courses: formCourses,
                        date: new Date().toISOString()
                    } : a
                )
            );
        } else {
            const newAnnouncement: Announcement = {
                id: Date.now().toString(),
                title: formTitle,
                content: formContent,
                date: new Date().toISOString(),
                priority: formPriority,
                status: "published",
                audience: formAudience,
                courses: formCourses,
                views: 0,
                author: "Dr. Sarah Chen"
            };
            setAnnouncements((prev) => [newAnnouncement, ...prev]);
        }

        resetForm();
    }

    function handleEdit(announcement: Announcement) {
        setFormTitle(announcement.title);
        setFormContent(announcement.content);
        setFormPriority(announcement.priority);
        setFormAudience(announcement.audience);
        setFormCourses(announcement.courses);
        setEditId(announcement.id);
        setFormError("");
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this announcement? This action cannot be undone.")) {
            setAnnouncements((prev) => prev.filter((a) => a.id !== id));
            if (editId === id) resetForm();
        }
    }

    function getPriorityIcon(priority: Announcement["priority"]) {
        switch (priority) {
            case "urgent": return <AlertCircle className="w-4 h-4" />;
            case "high": return <Target className="w-4 h-4" />;
            default: return <Bell className="w-4 h-4" />;
        }
    }

    function getPriorityBadge(priority: Announcement["priority"]) {
        const colors = {
            urgent: "bg-red-100 text-red-800 border-red-200",
            high: "bg-orange-100 text-orange-800 border-orange-200",
            normal: "bg-blue-100 text-blue-800 border-blue-200"
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[priority]}`}>
                {getPriorityIcon(priority)}
                {priority}
            </span>
        );
    }

    function getStatusBadge(status: Announcement["status"]) {
        const colors = {
            published: "bg-green-100 text-green-800 border-green-200",
            draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
            archived: "bg-gray-100 text-gray-800 border-gray-200"
        };
        const icons = {
            published: <CheckCircle2 className="w-3 h-3" />,
            draft: <Clock className="w-3 h-3" />,
            archived: <Eye className="w-3 h-3" />
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
                {icons[status]}
                {status}
            </span>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Announcements
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {announcements.filter(a => a.status === 'published').length} published • {announcements.filter(a => a.status === 'draft').length} drafts
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button 
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                New Announcement
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Announcements</p>
                                    <p className="text-2xl font-bold">{announcements.length}</p>
                                </div>
                                <Bell className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Published</p>
                                    <p className="text-2xl font-bold">{announcements.filter(a => a.status === 'published').length}</p>
                                </div>
                                <Send className="w-8 h-8 text-green-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm">Total Views</p>
                                    <p className="text-2xl font-bold">{announcements.reduce((sum, a) => sum + a.views, 0)}</p>
                                </div>
                                <Eye className="w-8 h-8 text-amber-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Urgent</p>
                                    <p className="text-2xl font-bold">{announcements.filter(a => a.priority === 'urgent').length}</p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                    </div>

                    {/* Announcement Form */}
                    {(showForm || editId) && (
                        <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editId ? "Edit Announcement" : "Create New Announcement"}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Enter announcement title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            value={formPriority}
                                            onChange={(e) => setFormPriority(e.target.value as "normal" | "high" | "urgent")}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content *
                                    </label>
                                    <textarea
                                        value={formContent}
                                        onChange={(e) => setFormContent(e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Write your announcement details here... You can include formatting, links, and important dates."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Target Audience
                                        </label>
                                        <select
                                            multiple
                                            value={formAudience}
                                            onChange={(e) => setFormAudience(Array.from(e.target.selectedOptions, option => option.value))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            {audiences.map(audience => (
                                                <option key={audience} value={audience}>{audience}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Related Courses
                                        </label>
                                        <select
                                            multiple
                                            value={formCourses}
                                            onChange={(e) => setFormCourses(Array.from(e.target.selectedOptions, option => option.value))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="all">All Courses</option>
                                            {courses.map(course => (
                                                <option key={course} value={course}>{course}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {formError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                        {formError}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
                                    >
                                        <Send className="w-4 h-4" />
                                        {editId ? "Update Announcement" : "Publish Announcement"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search announcements, courses, or content..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                            <select
                                value={priorityFilter}
                                onChange={(e) => {
                                    setPriorityFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Priority</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {/* Announcements List */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : paginatedAnnouncements.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
                                <p className="text-gray-600">Try adjusting your search or create a new announcement</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {paginatedAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                    announcement.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                                                    announcement.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {getPriorityIcon(announcement.priority)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                            {announcement.title}
                                                        </h3>
                                                        {getPriorityBadge(announcement.priority)}
                                                        {getStatusBadge(announcement.status)}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(announcement.date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {announcement.views} views
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen className="w-4 h-4" />
                                                            {announcement.courses.join(", ")}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 line-clamp-2">
                                                        {announcement.content}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(announcement)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(announcement.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Audience and Attachments */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {announcement.audience.join(", ")}
                                                </span>
                                            </div>
                                            {announcement.attachments && announcement.attachments.length > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Pin className="w-4 h-4" />
                                                    {announcement.attachments.length} attachment(s)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pageCount > 1 && (
                            <div className="flex justify-between items-center p-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === pageCount}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}