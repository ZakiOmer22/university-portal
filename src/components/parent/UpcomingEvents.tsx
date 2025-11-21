import React from "react";
import { Calendar, Clock, AlertTriangle, MoreVertical, MapPin, Users } from "lucide-react";

interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    type: "meeting" | "deadline" | "alert" | "exam" | "holiday";
    location?: string;
    participants?: string[];
    priority?: "high" | "medium" | "low";
}

interface UpcomingEventsProps {
    events: Event[];
    onEventClick?: (event: Event) => void;
}

export default function UpcomingEvents({ events, onEventClick }: UpcomingEventsProps) {
    const getEventConfig = (type: Event["type"]) => {
        switch (type) {
            case "meeting":
                return {
                    icon: <Users size={18} className="text-blue-500" />,
                    color: "bg-blue-50 border-blue-200",
                    label: "Meeting"
                };
            case "deadline":
                return {
                    icon: <Clock size={18} className="text-orange-500" />,
                    color: "bg-orange-50 border-orange-200",
                    label: "Deadline"
                };
            case "alert":
                return {
                    icon: <AlertTriangle size={18} className="text-red-500" />,
                    color: "bg-red-50 border-red-200",
                    label: "Alert"
                };
            case "exam":
                return {
                    icon: <Calendar size={18} className="text-purple-500" />,
                    color: "bg-purple-50 border-purple-200",
                    label: "Exam"
                };
            case "holiday":
                return {
                    icon: <Calendar size={18} className="text-green-500" />,
                    color: "bg-green-50 border-green-200",
                    label: "Holiday"
                };
        }
    };

    const getPriorityBadge = (priority?: Event["priority"]) => {
        if (!priority) return null;
        
        switch (priority) {
            case "high":
                return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">High Priority</span>;
            case "medium":
                return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">Medium</span>;
            case "low":
                return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Low</span>;
        }
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isUpcoming = (date: Date) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.toDateString() === tomorrow.toDateString();
    };

    const upcomingEvents = events
        .filter(event => event.date >= new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
                        <p className="text-gray-600 text-sm">Important dates and deadlines</p>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Events List */}
            {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No upcoming events</p>
                    <p className="text-sm text-gray-500 mt-1">You&apos;re all caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {upcomingEvents.map((event) => {
                        const config = getEventConfig(event.type);
                        const today = isToday(event.date);
                        const upcoming = isUpcoming(event.date);
                        
                        return (
                            <div
                                key={event.id}
                                onClick={() => onEventClick?.(event)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                                    today 
                                        ? "border-orange-300 bg-orange-50" 
                                        : config.color
                                } ${onEventClick ? 'hover:scale-105' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="p-2 rounded-lg bg-white group-hover:bg-gray-50 transition-colors mt-1">
                                            {config.icon}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    {event.title}
                                                </h4>
                                                {getPriorityBadge(event.priority)}
                                                {today && (
                                                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                                        Today
                                                    </span>
                                                )}
                                                {upcoming && !today && (
                                                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                                        Tomorrow
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                                                {event.description}
                                            </p>
                                            
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    <span>
                                                        {event.date.toLocaleDateString()} • 
                                                        {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </div>
                                                
                                                {event.location && (
                                                    <>
                                                        <span>•</span>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin size={12} />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    </>
                                                )}
                                                
                                                <span>•</span>
                                                <span className="font-medium text-gray-600">{config.label}</span>
                                            </div>

                                            {event.participants && event.participants.length > 0 && (
                                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                    <Users size={12} />
                                                    <span>{event.participants.join(", ")}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View All Button */}
            {events.length > 5 && (
                <button className="w-full mt-4 py-3 text-center text-indigo-600 hover:text-indigo-700 font-medium text-sm border border-dashed border-gray-300 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    View All Events ({events.length})
                </button>
            )}
        </div>
    );
}