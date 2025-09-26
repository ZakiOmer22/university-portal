"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";

interface ScheduleItem {
    id: string;
    day: string; // Monday, Tuesday, etc.
    start: string; // "HH:mm"
    end: string;
    courseCode: string;
    courseName: string;
    teacher: string;
    room: string;
    semesterNumber: number;
}

// Dummy data for one semester
const dummySchedule: ScheduleItem[] = [
    {
        id: "1",
        day: "Monday",
        start: "08:00",
        end: "09:30",
        courseCode: "CS101",
        courseName: "Intro to CS",
        teacher: "Dr. Smith",
        room: "A101",
        semesterNumber: 1,
    },
    {
        id: "2",
        day: "Monday",
        start: "10:00",
        end: "11:30",
        courseCode: "MA101",
        courseName: "Calculus I",
        teacher: "Prof. Lee",
        room: "B203",
        semesterNumber: 1,
    },
    {
        id: "3",
        day: "Tuesday",
        start: "08:00",
        end: "09:30",
        courseCode: "CS201",
        courseName: "Data Structures",
        teacher: "Dr. Kim",
        room: "C301",
        semesterNumber: 1,
    },
    {
        id: "4",
        day: "Wednesday",
        start: "10:00",
        end: "11:30",
        courseCode: "PH101",
        courseName: "Physics I",
        teacher: "Dr. Carter",
        room: "D110",
        semesterNumber: 1,
    },
    {
        id: "5",
        day: "Thursday",
        start: "09:00",
        end: "10:30",
        courseCode: "CS301",
        courseName: "Algorithms",
        teacher: "Dr. Smith",
        room: "A101",
        semesterNumber: 1,
    },
    {
        id: "6",
        day: "Friday",
        start: "11:00",
        end: "12:30",
        courseCode: "MA201",
        courseName: "Linear Algebra",
        teacher: "Prof. Lee",
        room: "B203",
        semesterNumber: 1,
    },
];

// Helper: get day name of today in English Monday..Friday
function getTodayDayName() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    return days[today.getDay()];
}

// Helper: convert "HH:mm" to minutes since midnight for easy comparison
function timeToMinutes(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

export default function StudentSchedulePage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        setTimeout(() => setLoading(false), 900);
    }, []);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const today = getTodayDayName();

    // Filter schedule only for semester 1 (since only one semester is considered)
    const schedule = dummySchedule.filter((s) => s.semesterNumber === 1);

    // For days other than today: show only the next upcoming course (by start time)
    function getNextCourseForDay(day: string) {
        const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        const todayCourses = schedule.filter((s) => s.day === day);
        // Find the course with start time >= nowMinutes, or earliest if none
        const upcoming = todayCourses.filter((c) => timeToMinutes(c.start) >= nowMinutes);
        if (upcoming.length > 0) {
            // sort by start time ascending
            upcoming.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
            return upcoming[0];
        } else if (todayCourses.length > 0) {
            // If none upcoming today, show earliest next day course
            todayCourses.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
            return todayCourses[0];
        }
        return null;
    }

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="bg-white p-6 rounded-lg shadow space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900">Weekly Schedule (Semester 1)</h1>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {days.map((day) => {
                            const isToday = day === today;
                            const dayCourses = schedule.filter((s) => s.day === day);

                            return (
                                <div
                                    key={day}
                                    className={`border rounded-lg p-4 shadow-sm ${isToday ? "bg-indigo-100 border-indigo-500" : "bg-gray-50 border-gray-300"
                                        }`}
                                >
                                    <h3 className={`font-semibold text-lg mb-3 ${isToday ? "text-indigo-900" : "text-gray-700"}`}>
                                        {day} {isToday && "(Today)"}
                                    </h3>

                                    {isToday ? (
                                        dayCourses.length > 0 ? (
                                            dayCourses.map((course) => (
                                                <div
                                                    key={course.id}
                                                    className="bg-white p-3 rounded mb-3 shadow-sm hover:shadow-md transition"
                                                >
                                                    <p className="font-bold text-indigo-900">
                                                        {course.courseCode} - {course.courseName}
                                                    </p>
                                                    <p className="text-gray-700 text-sm">
                                                        {course.start} - {course.end} | {course.teacher} | Room: {course.room}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No classes today.</p>
                                        )
                                    ) : (
                                        (() => {
                                            const nextCourse = getNextCourseForDay(day);
                                            if (!nextCourse) return <p className="text-gray-500 italic">No scheduled classes</p>;

                                            return (
                                                <div className="bg-white p-3 rounded shadow-sm">
                                                    <p className="font-semibold text-indigo-800">
                                                        {nextCourse.courseCode} - {nextCourse.courseName}
                                                    </p>
                                                    <p className="text-gray-700 text-sm">
                                                        {nextCourse.start} - {nextCourse.end} | {nextCourse.teacher} | Room: {nextCourse.room}
                                                    </p>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
