"use client";

import React, { useState } from "react";
import {
    Code,
    Briefcase,
    Heart,
    GraduationCap,
    Users,
    Calculator,
    Server,
    Paintbrush,
    Globe,
    Cpu,
} from "lucide-react";

const programs = [
    { id: "computer-science", name: "Computer Science", icon: Code, color: "blue" },
    { id: "business-administration", name: "Business Administration", icon: Briefcase, color: "red" },
    { id: "nursing", name: "Nursing", icon: Heart, color: "pink" },
    { id: "civil-engineering", name: "Civil Engineering", icon: GraduationCap, color: "yellow" },
    { id: "education", name: "Education", icon: Users, color: "green" },
    { id: "accounting", name: "Accounting", icon: Calculator, color: "indigo" },
    { id: "information-technology", name: "Information Technology", icon: Server, color: "cyan" },
    { id: "graphic-design", name: "Graphic Design", icon: Paintbrush, color: "purple" },
    { id: "environmental-science", name: "Environmental Science", icon: Globe, color: "emerald" },
    { id: "mechanical-engineering", name: "Mechanical Engineering", icon: Cpu, color: "orange" },
];

// Sample schedule data
const schedules: Record<
    string,
    {
        day: string;
        start: number; // hour in 24h format, e.g., 9 means 9am
        end: number; // hour in 24h format
        course: string;
        room: string;
        instructor: string;
    }[]
> = {
    "computer-science": [
        { day: "Monday", start: 9, end: 10.5, course: "Data Structures", room: "CS101", instructor: "Dr. Alice Johnson" },
        { day: "Wednesday", start: 11, end: 12.5, course: "Operating Systems", room: "CS201", instructor: "Dr. Bob Smith" },
        { day: "Friday", start: 13, end: 14.5, course: "Algorithms", room: "CS301", instructor: "Dr. Alice Johnson" },
    ],
    "business-administration": [
        { day: "Tuesday", start: 10, end: 11.5, course: "Marketing 101", room: "BA101", instructor: "Dr. Mark Thompson" },
        { day: "Thursday", start: 14, end: 15.5, course: "Finance Principles", room: "BA202", instructor: "Dr. Sarah Lee" },
    ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = Array.from({ length: 10 }, (_, i) => 8 + i); // 8am to 17pm (8..17)

function getColorClasses(color: string) {
    return {
        bg: `bg-${color}-100`,
        border: `border-${color}-400`,
        text: `text-${color}-700`,
    };
}

export default function ClassSchedulePage() {
    const [selectedProgramId, setSelectedProgramId] = useState(programs[0].id);
    const program = programs.find((p) => p.id === selectedProgramId)!;
    const schedule = schedules[selectedProgramId] || [];

    // Group schedule by day for quick access
    const scheduleByDay = days.reduce((acc, day) => {
        acc[day] = schedule.filter((cls) => cls.day === day);
        return acc;
    }, {} as Record<string, typeof schedule>);

    const colorClasses = getColorClasses(program.color);

    return (
        <main className="max-w-7xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-8">Class Schedule</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar - Programs */}
                <aside className="md:w-1/4 space-y-4">
                    {programs.map(({ id, name, icon: Icon, color }) => {
                        const isSelected = id === selectedProgramId;
                        const classes = getColorClasses(color);
                        return (
                            <button
                                key={id}
                                onClick={() => setSelectedProgramId(id)}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition
                ${isSelected ? `${classes.bg} ${classes.border} shadow-lg` : "border-gray-300 bg-white hover:shadow-md"}
                `}
                            >
                                <Icon className={`w-6 h-6 ${isSelected ? classes.text : "text-gray-400"}`} />
                                <span className={`font-semibold ${isSelected ? classes.text : "text-gray-700"}`}>{name}</span>
                            </button>
                        );
                    })}
                </aside>

                {/* Schedule Grid */}
                <section className="md:flex-1">
                    <h2 className={`text-2xl font-semibold mb-6 ${colorClasses.text}`}>
                        {program.name} Schedule
                    </h2>

                    <div className="overflow-auto border rounded-lg">
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="border-r border-gray-300 p-2 w-20 sticky left-0 bg-gray-100 z-10">Time</th>
                                    {days.map((day) => (
                                        <th key={day} className="border-r border-gray-300 p-2 text-center">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {timeSlots.map((hour, idx) => (
                                    <tr key={hour} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="border-r border-gray-300 p-2 sticky left-0 bg-white z-10 text-sm font-mono">
                                            {hour}:00 - {hour + 1}:00
                                        </td>

                                        {days.map((day) => {
                                            // Find class that overlaps this time slot
                                            const classAtThisTime = scheduleByDay[day].find(
                                                (cls) => hour >= Math.floor(cls.start) && hour < Math.ceil(cls.end)
                                            );

                                            if (classAtThisTime) {
                                                const blockHeight = (classAtThisTime.end - classAtThisTime.start) * 2.5; // multiply for row span effect

                                                return (
                                                    <td
                                                        key={day}
                                                        className={`relative p-1`}
                                                        style={{ verticalAlign: "top", height: blockHeight * 48 }} // 48px per row approx
                                                    >
                                                        <div
                                                            className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-lg p-3 shadow-md text-sm`}
                                                            style={{ height: "100%" }}
                                                        >
                                                            <div className="font-bold">{classAtThisTime.course}</div>
                                                            <div className="italic text-xs">{classAtThisTime.room}</div>
                                                            <div className="text-xs mt-1">{classAtThisTime.instructor}</div>
                                                        </div>
                                                    </td>
                                                );
                                            }

                                            return <td key={day} className="border-r border-gray-300"></td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}
