"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/parent/DashboardLayout";
import { CalendarDays, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AcademicEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    studentId: string;
}

interface Child {
    id: string;
    name: string;
}

const dummyChildren: Child[] = [
    { id: "student-uuid-1", name: "Ayaan Omer" },
    { id: "student-uuid-2", name: "Layla Omer" },
];

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function AcademicSchedulePage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [events, setEvents] = useState<AcademicEvent[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedChildId, setSelectedChildId] = useState<string>(dummyChildren[0].id);

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

        import("@/data/dummyData.json")
            .then((module) => {
                const data = module.default;
                const childEvents: AcademicEvent[] = data.academicSchedules?.filter(
                    (event: AcademicEvent) => event.studentId === selectedChildId
                ) || [];
                setEvents(childEvents);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load dummy data:", err);
                setError("Unable to load academic schedule. Please try again later.");
                setEvents([]);
                setLoading(false);
            });
    }, [selectedChildId]);

    const selectedChild = dummyChildren.find((c) => c.id === selectedChildId);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <BookOpen className="w-7 h-7 text-indigo-700" />
                        <h1 className="text-2xl font-bold text-indigo-900">Academic Schedule</h1>
                    </div>
                    <Button variant="outline">Download Full Calendar</Button>
                </div>

                <p className="mb-4 text-indigo-800 font-medium">
                    View the upcoming academic milestones, exams, breaks, and major events throughout the school year.
                </p>

                <div className="mb-6">
                    <label htmlFor="child-select" className="block font-semibold mb-2">
                        Select Child:
                    </label>
                    <select
                        id="child-select"
                        value={selectedChildId}
                        onChange={(e) => setSelectedChildId(e.target.value)}
                        className="p-2 border rounded border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {dummyChildren.map((child) => (
                            <option key={child.id} value={child.id}>
                                {child.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedChild && (
                    <p className="mb-6 text-indigo-700 font-semibold">
                        Viewing schedule for <span className="text-indigo-900">{selectedChild.name}</span>
                    </p>
                )}

                {error && (
                    <p className="mb-4 text-red-600 font-semibold" role="alert">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-indigo-700 font-semibold">Loading academic schedule...</p>
                ) : events.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {events.map((event) => (
                            <Card key={event.id} className="border border-indigo-300">
                                <CardHeader>
                                    <CardTitle className="text-indigo-800 flex items-center gap-2">
                                        <CalendarDays className="w-5 h-5 text-indigo-700" />
                                        {event.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-2">{event.description}</p>
                                    <div className="flex gap-4 text-sm text-indigo-700">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="w-4 h-4" />
                                            {formatDate(event.date)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {event.time}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No academic events available for this child.</p>
                )}
            </section>
        </DashboardLayout>
    );
}
