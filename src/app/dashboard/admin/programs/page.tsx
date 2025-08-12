"use client";

import { useRouter } from "next/navigation";
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
    BookOpen,
    UserCheck,
    Home,
    Briefcase as BriefcaseBusiness,
} from "lucide-react";

const programs = [
    {
        id: "computer-science",
        name: "Computer Science",
        years: 4,
        icon: Code,
        desc: "Advanced software & systems education",
    },
    {
        id: "business-administration",
        name: "Business Administration",
        years: 4,
        icon: Briefcase,
        desc: "Leadership, marketing & management",
    },
    {
        id: "nursing",
        name: "Nursing",
        years: 4,
        icon: Heart,
        desc: "Hands-on clinical & healthcare knowledge",
    },
    {
        id: "civil-engineering",
        name: "Civil Engineering",
        years: 5,
        icon: GraduationCap,
        desc: "Design and infrastructure systems",
    },
    {
        id: "education",
        name: "Education",
        years: 4,
        icon: Users,
        desc: "Teaching methodologies & psychology",
    },
    {
        id: "accounting",
        name: "Accounting",
        years: 4,
        icon: Calculator,
        desc: "Finance, auditing, and taxation",
    },
    {
        id: "information-technology",
        name: "Information Technology",
        years: 4,
        icon: Server,
        desc: "Networking, security & IT management",
    },
    {
        id: "graphic-design",
        name: "Graphic Design",
        years: 4,
        icon: Paintbrush,
        desc: "Visual communication & digital arts",
    },
    {
        id: "environmental-science",
        name: "Environmental Science",
        years: 4,
        icon: Globe,
        desc: "Sustainability and ecological studies",
    },
    {
        id: "mechanical-engineering",
        name: "Mechanical Engineering",
        years: 5,
        icon: Cpu,
        desc: "Machines, mechanics & design",
    },
    {
        id: "psychology",
        name: "Psychology",
        years: 4,
        icon: Users,
        desc: "Human behavior and mental processes",
    },
    {
        id: "data-science",
        name: "Data Science",
        years: 4,
        icon: BookOpen,
        desc: "Big data analysis & AI applications",
    },
    {
        id: "marketing",
        name: "Marketing",
        years: 4,
        icon: Briefcase,
        desc: "Market research and digital marketing strategies",
    },
    {
        id: "philosophy",
        name: "Philosophy",
        years: 4,
        icon: UserCheck,
        desc: "Critical thinking and ethical reasoning",
    },
    {
        id: "physics",
        name: "Physics",
        years: 4,
        icon: Cpu,
        desc: "Fundamental principles of the universe",
    },
    {
        id: "architecture",
        name: "Architecture",
        years: 5,
        icon: Home,
        desc: "Design and construction of buildings",
    },
    {
        id: "law",
        name: "Law",
        years: 4,
        icon: BriefcaseBusiness,
        desc: "Legal systems and civil rights",
    },
    {
        id: "social-work",
        name: "Social Work",
        years: 4,
        icon: Users,
        desc: "Community engagement and support systems",
    },
];

const graduatePrograms = [
    {
        id: "masters-in-computer-science",
        name: "Masters in Computer Science",
        years: 2,
        icon: Code,
        desc: "Deep dive into AI, ML, and advanced computing",
    },
    {
        id: "mba",
        name: "MBA",
        years: 2,
        icon: Briefcase,
        desc: "Strategic management and global business insights",
    },
    {
        id: "masters-in-public-health",
        name: "Masters in Public Health",
        years: 2,
        icon: Heart,
        desc: "Advanced healthcare systems and epidemiology",
    },
    {
        id: "masters-in-civil-engineering",
        name: "Masters in Civil Engineering",
        years: 2,
        icon: GraduationCap,
        desc: "Infrastructure development and sustainability",
    },
    {
        id: "phd-in-psychology",
        name: "PhD in Psychology",
        years: 4,
        icon: Users,
        desc: "Research on human behavior and cognition",
    },
    {
        id: "masters-in-data-science",
        name: "Masters in Data Science",
        years: 2,
        icon: BookOpen,
        desc: "Big data analytics and AI-driven decision making",
    },
];

export default function ProgramsPage() {
    const router = useRouter();

    function handleClick(programId: string) {
        router.push(`/dashboard/admin/programs/${programId}`);
    }

    function renderProgramCard(program: typeof programs[0]) {
        const IconComponent = program.icon;
        return (
            <div
                key={program.id}
                onClick={() => handleClick(program.id)}
                tabIndex={0}
                role="button"
                aria-pressed="false"
                className="cursor-pointer bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            >
                <div className="flex items-center space-x-4 mb-3">
                    <div className="text-indigo-600">
                        <IconComponent size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-indigo-900">{program.name}</h3>
                </div>
                <p className="text-gray-700 mb-3 line-clamp-3">{program.desc}</p>
                <div className="inline-block rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1">
                    {program.years} year{program.years > 1 ? "s" : ""}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 mx-auto max-w-7xl">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 border-b-4 border-indigo-600 pb-2">
                Undergraduate Programs
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12">
                {programs.map(renderProgramCard)}
            </div>

            <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 border-b-4 border-indigo-600 pb-2">
                Graduate Programs
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {graduatePrograms.map(renderProgramCard)}
            </div>
        </div>
    );
}
