"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    ChartOptions
} from "chart.js";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
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

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
);

const programs = [
    {
        id: "computer-science",
        name: "Computer Science",
        years: 4,
        icon: Code,
        desc: "Advanced software & systems education",
        dean: "Dr. Alice Johnson",
        currentBatch: "Batch 2025",
        studentCount: 320,
        graduatedCount: 120,
        present: 280,
        absent: 40,
        colorClass: "border-blue-600 bg-blue-50",
    },
    {
        id: "business-administration",
        name: "Business Administration",
        years: 4,
        icon: Briefcase,
        desc: "Leadership, marketing & management",
        dean: "Dr. Mark Thompson",
        currentBatch: "Batch 2025",
        studentCount: 280,
        graduatedCount: 95,
        present: 260,
        absent: 20,
        colorClass: "border-red-600 bg-red-50",
    },
    {
        id: "nursing",
        name: "Nursing",
        years: 4,
        icon: Heart,
        desc: "Hands-on clinical & healthcare knowledge",
        dean: "Dr. Sarah Blake",
        currentBatch: "Batch 2025",
        studentCount: 150,
        graduatedCount: 70,
        present: 135,
        absent: 15,
        colorClass: "border-pink-600 bg-pink-50",
    },
    {
        id: "civil-engineering",
        name: "Civil Engineering",
        years: 5,
        icon: GraduationCap,
        desc: "Design and infrastructure systems",
        dean: "Dr. John Carter",
        currentBatch: "Batch 2026",
        studentCount: 200,
        graduatedCount: 80,
        present: 180,
        absent: 20,
        colorClass: "border-yellow-600 bg-yellow-50",
    },
    {
        id: "education",
        name: "Education",
        years: 4,
        icon: Users,
        desc: "Teaching methodologies & psychology",
        dean: "Dr. Mary Collins",
        currentBatch: "Batch 2025",
        studentCount: 180,
        graduatedCount: 60,
        present: 160,
        absent: 20,
        colorClass: "border-green-600 bg-green-50",
    },
    {
        id: "accounting",
        name: "Accounting",
        years: 4,
        icon: Calculator,
        desc: "Finance, auditing, and taxation",
        dean: "Dr. Peter Maxwell",
        currentBatch: "Batch 2025",
        studentCount: 210,
        graduatedCount: 90,
        present: 190,
        absent: 20,
        colorClass: "border-indigo-600 bg-indigo-50",
    },
    {
        id: "information-technology",
        name: "Information Technology",
        years: 4,
        icon: Server,
        desc: "Networking, security & IT management",
        dean: "Dr. Julia Ramirez",
        currentBatch: "Batch 2025",
        studentCount: 240,
        graduatedCount: 100,
        present: 220,
        absent: 20,
        colorClass: "border-cyan-600 bg-cyan-50",
    },
    {
        id: "graphic-design",
        name: "Graphic Design",
        years: 4,
        icon: Paintbrush,
        desc: "Visual communication & digital arts",
        dean: "Dr. Emma Wright",
        currentBatch: "Batch 2025",
        studentCount: 160,
        graduatedCount: 70,
        present: 145,
        absent: 15,
        colorClass: "border-purple-600 bg-purple-50",
    },
    {
        id: "environmental-science",
        name: "Environmental Science",
        years: 4,
        icon: Globe,
        desc: "Sustainability and ecological studies",
        dean: "Dr. Michael Green",
        currentBatch: "Batch 2025",
        studentCount: 130,
        graduatedCount: 50,
        present: 120,
        absent: 10,
        colorClass: "border-emerald-600 bg-emerald-50",
    },
    {
        id: "mechanical-engineering",
        name: "Mechanical Engineering",
        years: 5,
        icon: Cpu,
        desc: "Machines, mechanics & design",
        dean: "Dr. Samuel Ford",
        currentBatch: "Batch 2026",
        studentCount: 220,
        graduatedCount: 85,
        present: 200,
        absent: 20,
        colorClass: "border-orange-600 bg-orange-50",
    },
];

const totalStudents = programs.reduce((acc, p) => acc + p.studentCount, 0);
const totalPresent = programs.reduce((acc, p) => acc + p.present, 0);
const totalAbsent = programs.reduce((acc, p) => acc + p.absent, 0);
const totalGraduated = programs.reduce((acc, p) => acc + p.graduatedCount, 0);

const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
        {
            data: [totalPresent, totalAbsent],
            backgroundColor: ["#2563eb", "#dc2626"],
            borderWidth: 0,
        },
    ],
};

const doughnutData = {
    labels: ["Graduated", "Currently Enrolled"],
    datasets: [
        {
            data: [totalGraduated, totalStudents - totalGraduated],
            backgroundColor: ["#059669", "#f59e0b"],
            borderWidth: 0,
        },
    ],
};

const barData = {
    labels: ['Label 1', 'Label 2', 'Label 3'],
    datasets: [
        {
            label: 'Attendance',
            data: [12, 19, 3], // Sample data values
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
};

// Chart options
const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as 'top', // Set position to a valid type
        },
        title: {
            display: true,
            text: 'Attendance Chart', // Title of the chart
        },
    },
    scales: {
        y: {
            beginAtZero: true, // Start y-axis at zero
        },
    },
};


export default function AttendanceDashboard() {
    return (
        <>
            <Head>
                <title>Attendance Dashboard | Admin Panel</title>
                <meta
                    name="description"
                    content="Admin attendance dashboard showing overall and department-wise student attendance statistics."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Attendance Dashboard</h1>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Overall Attendance (Pie)
                        </h2>
                        <div className="w-full h-48">
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Graduates vs Enrolled (Doughnut)
                        </h2>
                        <div className="w-full h-48">
                            <Doughnut
                                data={doughnutData}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Attendance by Program (Bar)
                        </h2>
                        <div className="w-full h-48">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {programs.map((program) => {
                        const Icon = program.icon;
                        return (
                            <Link
                                key={program.id}
                                href={`/dashboard/admin/attendance/${program.id}`}
                                className={`border-2 ${program.colorClass} rounded-lg p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between`}
                            >
                                <div className="flex items-center gap-3 mb-3 text-current">
                                    <Icon className="w-7 h-7" />
                                    <h3 className="text-lg font-semibold">{program.name}</h3>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{program.desc}</p>
                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Dean:</strong> {program.dean}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Current Batch:</strong> {program.currentBatch}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Total Students:</strong> {program.studentCount}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Present:</strong> {program.present}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Absent:</strong> {program.absent}
                                </p>
                            </Link>
                        );
                    })}
                </section>
            </main>
        </>
    );
}
