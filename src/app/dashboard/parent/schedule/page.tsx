"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { CalendarDays, Clock, BookOpen, Download, Filter, Calendar, User, Bell, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AcademicEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    studentId: string;
    type: "exam" | "holiday" | "event" | "meeting" | "deadline";
    location?: string;
    importance: "high" | "medium" | "low";
}

interface Child {
    id: string;
    name: string;
    grade: string;
}

const dummyChildren: Child[] = [
    { id: "student-uuid-1", name: "Ayaan Omer", grade: "Grade 5" },
    { id: "student-uuid-2", name: "Layla Omer", grade: "Grade 3" },
];

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatShortDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function getEventTypeColor(type: AcademicEvent["type"]) {
    switch (type) {
        case "exam":
            return "bg-red-100 text-red-800 border-red-200";
        case "holiday":
            return "bg-green-100 text-green-800 border-green-200";
        case "event":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "meeting":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "deadline":
            return "bg-orange-100 text-orange-800 border-orange-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
}

function getImportanceBadge(importance: AcademicEvent["importance"]) {
    switch (importance) {
        case "high":
            return <Badge variant="destructive" className="flex items-center gap-1">High Priority</Badge>;
        case "medium":
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">Medium Priority</Badge>;
        case "low":
            return <Badge variant="secondary" className="flex items-center gap-1">Low Priority</Badge>;
    }
}

function isUpcomingEvent(dateStr: string) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return eventDate >= today && eventDate <= nextWeek;
}

function isToday(dateStr: string) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
}

export default function AcademicSchedulePage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [events, setEvents] = useState<AcademicEvent[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedChildId, setSelectedChildId] = useState<string>(dummyChildren[0].id);
    const [filterType, setFilterType] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (!selectedChildId) return;

        setLoading(true);
        setError(null);

        // Simulate API call with timeout
        setTimeout(() => {
            try {
                const mockEvents: AcademicEvent[] = [
                    {
                        id: "1",
                        title: "Mathematics Final Exam",
                        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        time: "9:00 AM - 11:00 AM",
                        description: "End of semester mathematics examination covering all topics from this term.",
                        studentId: "student-uuid-1",
                        type: "exam",
                        location: "Room 201",
                        importance: "high"
                    },
                    {
                        id: "2",
                        title: "Science Fair Project Deadline",
                        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        time: "3:00 PM",
                        description: "Final submission deadline for the annual science fair projects.",
                        studentId: "student-uuid-1",
                        type: "deadline",
                        importance: "high"
                    },
                    {
                        id: "3",
                        title: "Spring Break",
                        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        time: "All Day",
                        description: "Spring break holiday - no classes for one week.",
                        studentId: "student-uuid-1",
                        type: "holiday",
                        importance: "medium"
                    },
                    {
                        id: "4",
                        title: "Parent-Teacher Conference",
                        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        time: "2:00 PM - 4:00 PM",
                        description: "Quarterly parent-teacher conference to discuss student progress.",
                        studentId: "student-uuid-1",
                        type: "meeting",
                        location: "Main Hall",
                        importance: "high"
                    },
                    {
                        id: "5",
                        title: "Art Exhibition",
                        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        time: "6:00 PM - 8:00 PM",
                        description: "Annual student art exhibition showcasing creative works.",
                        studentId: "student-uuid-1",
                        type: "event",
                        location: "Art Room",
                        importance: "medium"
                    },
                    {
                        id: "6",
                        title: "Reading Assessment",
                        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        time: "10:00 AM - 11:30 AM",
                        description: "Quarterly reading comprehension assessment for all students.",
                        studentId: "student-uuid-2",
                        type: "exam",
                        location: "Library",
                        importance: "medium"
                    }
                ];

                const childEvents = mockEvents.filter(event => event.studentId === selectedChildId);
                setEvents(childEvents);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load academic schedule:", err);
                setError("Unable to load academic schedule. Please try again later.");
                setEvents([]);
                setLoading(false);
            }
        }, 1000);
    }, [selectedChildId]);

    const filteredEvents = events.filter(event => 
        filterType === "all" || event.type === filterType
    );

    const upcomingEvents = filteredEvents.filter(event => isUpcomingEvent(event.date));
    const todayEvents = filteredEvents.filter(event => isToday(event.date));

    const selectedChild = dummyChildren.find((c) => c.id === selectedChildId);

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Academic Schedule
                        </h1>
                        <p className="text-gray-600 mt-2">Track important dates, exams, and school events for your children</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <Download size={16} />
                            Export Calendar
                        </Button>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-64">
                                    <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                                        <SelectTrigger className="bg-white border-gray-300">
                                            <div className="flex items-center gap-2">
                                                <User size={16} />
                                                <SelectValue placeholder="Select Child" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dummyChildren.map((child) => (
                                                <SelectItem key={child.id} value={child.id}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{child.name}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                            {child.grade}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="w-full sm:w-48">
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="bg-white border-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Filter size={16} />
                                                <SelectValue placeholder="Filter by type" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Events</SelectItem>
                                            <SelectItem value="exam">Exams</SelectItem>
                                            <SelectItem value="holiday">Holidays</SelectItem>
                                            <SelectItem value="event">Events</SelectItem>
                                            <SelectItem value="meeting">Meetings</SelectItem>
                                            <SelectItem value="deadline">Deadlines</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        onClick={() => setViewMode("grid")}
                                        className="flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Grid
                                    </Button>
                                    <Button 
                                        variant={viewMode === "calendar" ? "default" : "outline"}
                                        onClick={() => setViewMode("calendar")}
                                        className="flex items-center gap-2"
                                    >
                                        <Calendar size={16} />
                                        Calendar
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        {selectedChild && (
                            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={14} className="text-indigo-600" />
                                    <span className="font-semibold text-indigo-900">{selectedChild.name}</span>
                                    <span className="text-indigo-600">•</span>
                                    <span className="text-indigo-700">{selectedChild.grade}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                {!loading && events.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 text-sm font-medium">Total Events</p>
                                    <p className="text-2xl font-bold text-blue-900">{events.length}</p>
                                </div>
                                <CalendarDays className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 text-sm font-medium">Upcoming (7 days)</p>
                                    <p className="text-2xl font-bold text-green-900">{upcomingEvents.length}</p>
                                </div>
                                <Bell className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-600 text-sm font-medium">Today</p>
                                    <p className="text-2xl font-bold text-orange-900">{todayEvents.length}</p>
                                </div>
                                <Clock className="w-8 h-8 text-orange-400" />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <Bell className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Schedule</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Events Grid */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-2xl" />
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredEvents.map((event) => (
                            <Card 
                                key={event.id} 
                                className={`border-l-4 ${
                                    event.importance === "high" ? "border-l-red-500" :
                                    event.importance === "medium" ? "border-l-yellow-500" : "border-l-blue-500"
                                } hover:shadow-lg transition-all duration-300 hover:scale-105`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg text-gray-900 flex items-start gap-2">
                                            <CalendarDays className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                                            <span>{event.title}</span>
                                        </CardTitle>
                                        <Badge className={`${getEventTypeColor(event.type)} text-xs`}>
                                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                        </Badge>
                                    </div>
                                    {getImportanceBadge(event.importance)}
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-700">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>

                                    {event.location && (
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    )}

                                    {isToday(event.date) && (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                            Happening Today
                                        </Badge>
                                    )}
                                    {isUpcomingEvent(event.date) && !isToday(event.date) && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                                            Upcoming
                                        </Badge>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {filterType === "all" 
                                ? "No academic events scheduled for this child."
                                : `No ${filterType} events found for the selected filters.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}