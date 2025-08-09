"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { CalendarDays } from "lucide-react";

type Lesson = {
    id: string;
    date: string; // ISO date: "YYYY-MM-DD"
    time: string; // "HH:mm"
    subject: string;
    room: string;
    status: "Scheduled" | "Completed" | "Cancelled";
};

// Dummy schedule data similar to payroll dummy data
const dummyLessons: Lesson[] = [
    { id: "1", date: "2025-08-09", time: "09:00", subject: "Mathematics", room: "Room 101", status: "Scheduled" },
    { id: "2", date: "2025-08-09", time: "11:00", subject: "Physics", room: "Room 202", status: "Completed" },
    { id: "3", date: "2025-08-10", time: "10:00", subject: "Chemistry", room: "Lab 3", status: "Scheduled" },
    { id: "4", date: "2025-08-11", time: "13:00", subject: "Biology", room: "Room 105", status: "Cancelled" },
    { id: "5", date: "2025-08-12", time: "08:00", subject: "History", room: "Room 204", status: "Scheduled" },
    { id: "6", date: "2025-08-13", time: "15:00", subject: "English", room: "Room 301", status: "Scheduled" },
];

export default function SchedulePage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLessons(dummyLessons);
            setLoading(false);
        }, 600);
    }, []);

    const todayDate = new Date().toISOString().split("T")[0];

    // Today's classes
    const todaysClasses = useMemo(() => lessons.filter((l) => l.date === todayDate), [lessons, todayDate]);

    // Weekly lessons: get current week (Mon-Sun)
    const weekLessons = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay() || 7; // Sunday=7 for ISO
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + 1);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return lessons.filter((l) => {
            const lessonDate = new Date(l.date);
            return lessonDate >= monday && lessonDate <= sunday;
        });
    }, [lessons]);

    // Summary stats for the cards (similar to payroll's totalPaid, etc)
    const totalClassesThisWeek = weekLessons.length;
    const totalToday = todaysClasses.length;
    const completedClassesThisWeek = weekLessons.filter((l) => l.status === "Completed").length;
    const cancelledClassesThisWeek = weekLessons.filter((l) => l.status === "Cancelled").length;

    return (
        <DashboardLayout>
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <CalendarDays size={32} /> Schedule Overview
                </h1>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-indigo-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-indigo-800">Today's Classes</h2>
                        <p className="text-3xl font-bold text-indigo-900">{totalToday}</p>
                    </div>
                    <div className="bg-green-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-green-700">Classes This Week</h2>
                        <p className="text-3xl font-bold text-green-900">{totalClassesThisWeek}</p>
                    </div>
                    <div className="bg-yellow-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-yellow-700">Completed</h2>
                        <p className="text-3xl font-bold text-yellow-900">{completedClassesThisWeek}</p>
                    </div>
                    <div className="bg-red-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-red-700">Cancelled</h2>
                        <p className="text-3xl font-bold text-red-900">{cancelledClassesThisWeek}</p>
                    </div>
                </div>

                {/* Today's Classes Card */}
                <div className="bg-white rounded shadow border border-gray-300 p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Today's Classes ({todayDate})</h2>
                    {loading ? (
                        <p className="text-center text-gray-500 py-6">Loading classes...</p>
                    ) : todaysClasses.length === 0 ? (
                        <p className="text-gray-600">No classes scheduled for today.</p>
                    ) : (
                        <ul className="space-y-4">
                            {todaysClasses.map(({ id, time, subject, room, status }) => (
                                <li
                                    key={id}
                                    className={`border p-4 rounded flex justify-between items-center ${status === "Cancelled" ? "bg-red-50 border-red-300" : "bg-indigo-50 border-indigo-300"
                                        }`}
                                >
                                    <div>
                                        <p className="font-semibold text-indigo-900">{subject}</p>
                                        <p className="text-gray-700">
                                            Time: {time} | Room: {room}
                                        </p>
                                    </div>
                                    <div
                                        className={`font-semibold px-3 py-1 rounded text-sm ${status === "Completed"
                                                ? "bg-green-200 text-green-800"
                                                : status === "Cancelled"
                                                    ? "bg-red-200 text-red-800"
                                                    : "bg-yellow-200 text-yellow-800"
                                            }`}
                                    >
                                        {status}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Weekly Lessons Table */}
                <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                    <table className="min-w-full table-fixed border-collapse border border-gray-300">
                        <thead className="bg-indigo-100 sticky top-0 z-10">
                            <tr>
                                <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                    Date
                                </th>
                                <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                    Time
                                </th>
                                <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                    Subject
                                </th>
                                <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                    Room
                                </th>
                                <th className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {weekLessons.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-6 text-gray-600">
                                        No lessons scheduled this week.
                                    </td>
                                </tr>
                            ) : (
                                weekLessons.map(({ id, date, time, subject, room, status }) => (
                                    <tr
                                        key={id}
                                        className={`hover:bg-indigo-50 transition ${status === "Cancelled" ? "bg-red-50" : ""
                                            }`}
                                    >
                                        <td className="border border-gray-300 p-3 whitespace-nowrap">
                                            {new Date(date).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 p-3 whitespace-nowrap">{time}</td>
                                        <td className="border border-gray-300 p-3">{subject}</td>
                                        <td className="border border-gray-300 p-3">{room}</td>
                                        <td
                                            className={`border border-gray-300 p-3 text-center font-semibold ${status === "Completed"
                                                    ? "text-green-700"
                                                    : status === "Cancelled"
                                                        ? "text-red-700"
                                                        : "text-yellow-700"
                                                }`}
                                        >
                                            {status}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </DashboardLayout>
    );
}
