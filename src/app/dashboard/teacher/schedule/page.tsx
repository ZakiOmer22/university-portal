"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { 
    CalendarDays, 
    Clock,
    MapPin,
    BookOpen,
    Users,
    CheckCircle2,
    XCircle,
    PlayCircle,
    MoreVertical,
    Filter,
    Download,
    Plus,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Bell,
    Video,
    Upload
} from "lucide-react";

type Lesson = {
    id: string;
    date: string;
    time: string;
    endTime: string;
    subject: string;
    course: string;
    room: string;
    building: string;
    status: "scheduled" | "in-progress" | "completed" | "cancelled";
    students: number;
    type: "lecture" | "lab" | "seminar" | "office-hours";
    description?: string;
    materials?: string[];
};

const dummyLessons: Lesson[] = [
    { 
        id: "1", 
        date: "2024-03-11", 
        time: "09:00", 
        endTime: "10:30",
        subject: "Advanced Composition", 
        course: "ENG201",
        room: "Room 101", 
        building: "Humanities Building",
        status: "completed", 
        students: 24,
        type: "lecture",
        description: "Research paper structure and thesis development",
        materials: ["research_guidelines.pdf", "sample_papers.zip"]
    },
    { 
        id: "2", 
        date: "2024-03-11", 
        time: "11:00", 
        endTime: "12:30",
        subject: "Modern American Literature", 
        course: "LIT405",
        room: "Room 202", 
        building: "Literature Hall",
        status: "scheduled", 
        students: 18,
        type: "seminar",
        description: "Fitzgerald and the Jazz Age - discussion session"
    },
    { 
        id: "3", 
        date: "2024-03-12", 
        time: "10:00", 
        endTime: "11:30",
        subject: "Creative Writing Workshop", 
        course: "WRI301",
        room: "Creative Lab", 
        building: "Arts Center",
        status: "scheduled", 
        students: 16,
        type: "lab",
        description: "Character development and dialogue writing exercises"
    },
    { 
        id: "4", 
        date: "2024-03-12", 
        time: "14:00", 
        endTime: "15:00",
        subject: "Office Hours", 
        course: "All Courses",
        room: "Office 305", 
        building: "Faculty Building",
        status: "scheduled", 
        students: 0,
        type: "office-hours",
        description: "Student consultations and project guidance"
    },
    { 
        id: "5", 
        date: "2024-03-13", 
        time: "08:00", 
        endTime: "09:30",
        subject: "Professional Communication", 
        course: "COM202",
        room: "Room 204", 
        building: "Business School",
        status: "scheduled", 
        students: 28,
        type: "lecture",
        description: "Business presentation skills and public speaking"
    },
    { 
        id: "6", 
        date: "2024-03-14", 
        time: "13:00", 
        endTime: "14:30",
        subject: "Advanced Composition", 
        course: "ENG201",
        room: "Computer Lab 2", 
        building: "Technology Center",
        status: "scheduled", 
        students: 24,
        type: "lab",
        description: "Digital writing tools and online research methods",
        materials: ["software_guide.pdf"]
    },
    { 
        id: "7", 
        date: "2024-03-15", 
        time: "15:00", 
        endTime: "16:30",
        subject: "Modern American Literature", 
        course: "LIT405",
        room: "Room 202", 
        building: "Literature Hall",
        status: "scheduled", 
        students: 18,
        type: "lecture",
        description: "Postmodern literature and contemporary authors"
    },
];

export default function SchedulePage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedView, setSelectedView] = useState<"day" | "week" | "month">("week");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLessons(dummyLessons);
            setLoading(false);
        }, 1000);
    }, []);

    const todayDate = new Date().toISOString().split("T")[0];

    // Today's classes
    const todaysClasses = useMemo(() => 
        lessons.filter((l) => l.date === todayDate), 
        [lessons, todayDate]
    );

    // Weekly lessons
    const weekLessons = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay() || 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + 1);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return lessons.filter((l) => {
            const lessonDate = new Date(l.date);
            return lessonDate >= monday && lessonDate <= sunday;
        });
    }, [lessons]);

    // Filtered lessons based on current view and filters
    const filteredLessons = useMemo(() => {
        let filtered = selectedView === "day" ? todaysClasses : weekLessons;
        
        if (statusFilter !== "all") {
            filtered = filtered.filter(lesson => lesson.status === statusFilter);
        }
        
        if (typeFilter !== "all") {
            filtered = filtered.filter(lesson => lesson.type === typeFilter);
        }
        
        return filtered;
    }, [selectedView, todaysClasses, weekLessons, statusFilter, typeFilter]);

    // Summary stats
    const totalClassesThisWeek = weekLessons.length;
    const totalToday = todaysClasses.length;
    const completedClassesThisWeek = weekLessons.filter((l) => l.status === "completed").length;
    const upcomingClasses = weekLessons.filter((l) => l.status === "scheduled" || l.status === "in-progress").length;

    function getStatusIcon(status: Lesson["status"]) {
        switch (status) {
            case "completed": return <CheckCircle2 className="w-4 h-4" />;
            case "in-progress": return <PlayCircle className="w-4 h-4" />;
            case "cancelled": return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    }

    function getStatusBadge(status: Lesson["status"]) {
        const colors = {
            scheduled: "bg-blue-100 text-blue-800 border-blue-200",
            "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
            completed: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
                {getStatusIcon(status)}
                {status.replace("-", " ")}
            </span>
        );
    }

    function getTypeBadge(type: Lesson["type"]) {
        const colors = {
            lecture: "bg-purple-100 text-purple-800 border-purple-200",
            lab: "bg-cyan-100 text-cyan-800 border-cyan-200",
            seminar: "bg-orange-100 text-orange-800 border-orange-200",
            "office-hours": "bg-gray-100 text-gray-800 border-gray-200",
        };
        const icons = {
            lecture: <BookOpen className="w-3 h-3" />,
            lab: <Video className="w-3 h-3" />,
            seminar: <Users className="w-3 h-3" />,
            "office-hours": <Clock className="w-3 h-3" />,
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[type]}`}>
                {icons[type]}
                {type.replace("-", " ")}
            </span>
        );
    }

    function getNextClass() {
        const now = new Date();
        const upcoming = lessons
            .filter(l => new Date(l.date + 'T' + l.time) > now && l.status === "scheduled")
            .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
        
        return upcoming[0];
    }

    const nextClass = getNextClass();

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Teaching Schedule
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {totalToday} classes today • {upcomingClasses} upcoming this week
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200">
                                <Plus className="w-4 h-4" />
                                Add Event
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Today&apos;s Classes</p>
                                    <p className="text-2xl font-bold">{totalToday}</p>
                                </div>
                                <CalendarDays className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">This Week</p>
                                    <p className="text-2xl font-bold">{totalClassesThisWeek}</p>
                                </div>
                                <BookOpen className="w-8 h-8 text-green-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm">Completed</p>
                                    <p className="text-2xl font-bold">{completedClassesThisWeek}</p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-amber-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Upcoming</p>
                                    <p className="text-2xl font-bold">{upcomingClasses}</p>
                                </div>
                                <Clock className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                    </div>

                    {/* Next Class Alert */}
                    {nextClass && (
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Bell className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Next Class Starting Soon</h3>
                                        <p className="text-indigo-100">
                                            {nextClass.subject} at {nextClass.time} in {nextClass.room}
                                        </p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors duration-200 font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    )}

                    {/* View Controls and Filters */}
                    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div className="flex gap-2">
                                {[
                                    { id: "day", label: "Day View" },
                                    { id: "week", label: "Week View" },
                                    { id: "month", label: "Month View" }
                                ].map(({ id, label }) => (
                                    <button
                                        key={id}
                                        onClick={() => setSelectedView(id as "day" | "week" | "month")}
                                        className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                                            selectedView === id
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="all">All Types</option>
                                    <option value="lecture">Lecture</option>
                                    <option value="lab">Lab</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="office-hours">Office Hours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Content */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Today's Schedule */}
                        <div className="xl:col-span-2">
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {selectedView === "day" ? "Today's Schedule" : "Weekly Schedule"}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>{filteredLessons.length} classes</span>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="space-y-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                                                <Skeleton className="w-16 h-16 rounded-xl" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-5 w-3/4" />
                                                    <Skeleton className="h-4 w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : filteredLessons.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes scheduled</h3>
                                        <p className="text-gray-600">Try adjusting your filters or view settings</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredLessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                                                            lesson.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                            lesson.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                                                            lesson.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                            'bg-blue-100 text-blue-600'
                                                        }`}>
                                                            <span className="font-bold text-lg">{lesson.time}</span>
                                                            <span className="text-xs">{lesson.endTime}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    {lesson.subject}
                                                                </h3>
                                                                {getStatusBadge(lesson.status)}
                                                                {getTypeBadge(lesson.type)}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                                <div className="flex items-center gap-1">
                                                                    <BookOpen className="w-4 h-4" />
                                                                    {lesson.course}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    {lesson.room}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="w-4 h-4" />
                                                                    {lesson.students} students
                                                                </div>
                                                            </div>
                                                            {lesson.description && (
                                                                <p className="text-gray-600 text-sm">
                                                                    {lesson.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                        <MoreVertical className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>

                                                {lesson.materials && lesson.materials.length > 0 && (
                                                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                                        <Upload className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {lesson.materials.length} material(s) available
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Events Sidebar */}
                        <div className="space-y-6">
                            {/* Today's Summary */}
                            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-blue-700 font-medium">Total Classes</span>
                                        <span className="font-bold text-blue-900">{totalToday}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-green-700 font-medium">Completed</span>
                                        <span className="font-bold text-green-900">
                                            {todaysClasses.filter(l => l.status === 'completed').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                        <span className="text-amber-700 font-medium">Remaining</span>
                                        <span className="font-bold text-amber-900">
                                            {todaysClasses.filter(l => l.status === 'scheduled').length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-4 text-indigo-100">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <div className="font-semibold">Upload Lecture Materials</div>
                                        <div className="text-indigo-200 text-sm">Share resources with students</div>
                                    </button>
                                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <div className="font-semibold">Schedule Make-up Class</div>
                                        <div className="text-indigo-200 text-sm">Arrange for missed sessions</div>
                                    </button>
                                    <button className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <div className="font-semibold">View Attendance</div>
                                        <div className="text-indigo-200 text-sm">Check today&apos;s student presence</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Skeleton component for loading state
function Skeleton({ className }: { className: string }) {
    return (
        <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
    );
}