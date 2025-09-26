"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Clock, Bell } from "lucide-react";

interface StatCard {
    id: string;
    label: string;
    value: number | string;
    color: "indigo" | "blue" | "green" | "yellow";
}

interface Task {
    id: string;
    title: string;
    status: "pending" | "completed" | "overdue";
}

interface Student {
    id: string;
    fullName: string;
    grade: number;
}

interface Announcement {
    id: string;
    title: string;
    date: string;
    message?: string;
}

const dummyStats: StatCard[] = [
    { id: "1", label: "Total Students", value: 1200, color: "indigo" },
    { id: "2", label: "Pending Approvals", value: 23, color: "blue" },
    { id: "3", label: "Attendance Today", value: "92%", color: "green" },
    { id: "4", label: "Reports Reviewed", value: 15, color: "yellow" },
];

const dummyTasks: Task[] = [
    { id: "t1", title: "Approve Assignment 101", status: "pending" },
    { id: "t2", title: "Review Project Proposal", status: "overdue" },
    { id: "t3", title: "Confirm Attendance Reports", status: "completed" },
];

const dummyTopStudents: Student[] = [
    { id: "s1", fullName: "Alice Johnson", grade: 98 },
    { id: "s2", fullName: "Bob Smith", grade: 95 },
    { id: "s3", fullName: "Charlie Lee", grade: 94 },
];

const dummyAnnouncements: Announcement[] = [
    { id: "a1", title: "New Library Hours", date: "2025-09-25", message: "Library now open until 10 PM." },
    { id: "a2", title: "Midterm Schedule Announced", date: "2025-09-24" },
    { id: "a3", title: "Campus Closed", date: "2025-09-22", message: "Maintenance work on Friday." },
];

export default function LeaderHomePage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<StatCard[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [topStudents, setTopStudents] = useState<Student[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        else setUser({ fullName: "Leader User", role: "LEADER" });

        setTimeout(() => {
            setStats(dummyStats);
            setTasks(dummyTasks);
            setTopStudents(dummyTopStudents);
            setAnnouncements(dummyAnnouncements);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <DashboardLayout user={user} loading={loading}>
            <section className="p-6 space-y-8">
                {/* Leader Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
                        : stats.map((stat) => (
                            <div
                                key={stat.id}
                                className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition`}
                            >
                                <p className={`text-${stat.color}-700 font-medium`}>{stat.label}</p>
                                <p className={`text-2xl font-bold text-${stat.color}-900 mt-2`}>{stat.value}</p>
                            </div>
                        ))}
                </div>

                {/* Quick Tasks / Approvals */}
                <section>
                    <h2 className="text-xl font-semibold text-indigo-900 mb-3">Pending Tasks</h2>
                    {loading ? (
                        <Skeleton className="h-32 w-full rounded-lg" />
                    ) : (
                        <ul className="space-y-3">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className={`border rounded-lg p-3 ${task.status === "completed"
                                            ? "border-green-400 bg-green-50"
                                            : task.status === "overdue"
                                                ? "border-red-400 bg-red-50"
                                                : "border-yellow-400 bg-yellow-50"
                                        }`}
                                >
                                    <p className="font-semibold">{task.title}</p>
                                    <Badge
                                        className={`mt-1 ${task.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : task.status === "overdue"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Top Students */}
                <section>
                    <h2 className="text-xl font-semibold text-indigo-900 mb-3">Top Performing Students</h2>
                    {loading ? (
                        <Skeleton className="h-32 w-full rounded-lg" />
                    ) : (
                        <ul className="space-y-3">
                            {topStudents.map((s) => (
                                <li key={s.id} className="border rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition">
                                    <span>{s.fullName}</span>
                                    <span className="font-bold text-indigo-700">{s.grade}%</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Recent Announcements */}
                <section>
                    <h2 className="text-xl font-semibold text-indigo-900 mb-3">Recent Announcements</h2>
                    {loading ? (
                        <Skeleton className="h-32 w-full rounded-lg" />
                    ) : (
                        <ul className="space-y-3">
                            {announcements.map((n) => (
                                <li
                                    key={n.id}
                                    className="border rounded-lg p-3 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 transition"
                                >
                                    <p className="font-semibold">{n.title}</p>
                                    <p className="text-gray-500 text-sm">{new Date(n.date).toLocaleDateString()}</p>
                                    {n.message && <p className="text-gray-700">{n.message}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </section>
        </DashboardLayout>
    );
}
