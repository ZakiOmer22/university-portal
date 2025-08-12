"use client";

import Link from "next/link";
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
    },
];

const graduatePrograms = [
    {
        id: "masters-in-computer-science",
        name: "Masters in Computer Science",
        years: 2,
        icon: Code,
        desc: "Deep dive into AI, ML, and advanced computing",
        dean: "Dr. Alan Turing",
        currentBatch: "Batch 2025",
        studentCount: 60,
        graduatedCount: 25,
    },
    {
        id: "mba",
        name: "MBA",
        years: 2,
        icon: Briefcase,
        desc: "Strategic management and global business insights",
        dean: "Dr. Rachel Adams",
        currentBatch: "Batch 2025",
        studentCount: 90,
        graduatedCount: 40,
    },
    {
        id: "masters-in-public-health",
        name: "Masters in Public Health",
        years: 2,
        icon: Heart,
        desc: "Advanced healthcare systems and epidemiology",
        dean: "Dr. William Harris",
        currentBatch: "Batch 2025",
        studentCount: 50,
        graduatedCount: 20,
    },
];

function DepartmentCard({ dept }: { dept: any }) {
    return (
        <Link
            href={`/dashboard/admin/students`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 border flex flex-col"
        >
            <img
                src={`https://source.unsplash.com/400x200/?${encodeURIComponent(dept.name)}`}
                alt={dept.name}
                className="rounded-md object-cover h-40 w-full mb-4"
            />
            <div className="flex items-center gap-2 mb-2">
                <dept.icon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{dept.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{dept.desc}</p>
            <div className="text-xs text-gray-700 space-y-1">
                <p>
                    <strong>Dean:</strong> {dept.dean}
                </p>
                <p>
                    <strong>Current Batch:</strong> {dept.currentBatch}
                </p>
                <p>
                    <strong>Students:</strong> {dept.studentCount}
                </p>
                <p>
                    <strong>Graduated:</strong> {dept.graduatedCount}
                </p>
            </div>
        </Link>
    );
}

export default function DepartmentsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Undergraduate Departments</h1>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {programs.map((dept) => (
                    <DepartmentCard key={dept.id} dept={dept} />
                ))}
            </div>

            <h1 className="text-2xl font-bold mb-4">Graduate Departments</h1>
            <div className="grid md:grid-cols-3 gap-6">
                {graduatePrograms.map((dept) => (
                    <DepartmentCard key={dept.id} dept={dept} />
                ))}
            </div>
        </div>
    );
}
