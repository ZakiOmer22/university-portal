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

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number; // Add size prop
}
interface Program {
    id: string;
    name: string;
    years: number;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    desc: string;
    colorClass: string; // border and bg color class like roles
    coursesCount?: number;
}

const programs: Program[] = [
    {
        id: "computer-science",
        name: "Computer Science",
        years: 4,
        icon: Code,
        desc: "Advanced software & systems education",
        colorClass: "border-indigo-600 bg-indigo-100",
        coursesCount: 24,
    },
    {
        id: "business-administration",
        name: "Business Administration",
        years: 4,
        icon: Briefcase,
        desc: "Leadership, marketing & management",
        colorClass: "border-red-500 bg-red-100",
        coursesCount: 20,
    },
    {
        id: "nursing",
        name: "Nursing",
        years: 4,
        icon: Heart,
        desc: "Hands-on clinical & healthcare knowledge",
        colorClass: "border-pink-500 bg-pink-100",
        coursesCount: 22,
    },
    {
        id: "civil-engineering",
        name: "Civil Engineering",
        years: 5,
        icon: GraduationCap,
        desc: "Design and infrastructure systems",
        colorClass: "border-yellow-500 bg-yellow-100",
        coursesCount: 26,
    },
    {
        id: "education",
        name: "Education",
        years: 4,
        icon: Users,
        desc: "Teaching methodologies & psychology",
        colorClass: "border-green-500 bg-green-100",
        coursesCount: 18,
    },
    {
        id: "accounting",
        name: "Accounting",
        years: 4,
        icon: Calculator,
        desc: "Finance, auditing, and taxation",
        colorClass: "border-purple-600 bg-purple-100",
        coursesCount: 19,
    },
    {
        id: "information-technology",
        name: "Information Technology",
        years: 4,
        icon: Server,
        desc: "Networking, security & IT management",
        colorClass: "border-teal-500 bg-teal-100",
        coursesCount: 23,
    },
    {
        id: "graphic-design",
        name: "Graphic Design",
        years: 4,
        icon: Paintbrush,
        desc: "Visual communication & digital arts",
        colorClass: "border-pink-400 bg-pink-100",
        coursesCount: 17,
    },
    {
        id: "environmental-science",
        name: "Environmental Science",
        years: 4,
        icon: Globe,
        desc: "Sustainability and ecological studies",
        colorClass: "border-cyan-500 bg-cyan-100",
        coursesCount: 21,
    },
    {
        id: "mechanical-engineering",
        name: "Mechanical Engineering",
        years: 5,
        icon: Cpu,
        desc: "Machines, mechanics & design",
        colorClass: "border-orange-500 bg-orange-100",
        coursesCount: 25,
    },
    {
        id: "psychology",
        name: "Psychology",
        years: 4,
        icon: Users,
        desc: "Human behavior and mental processes",
        colorClass: "border-blue-500 bg-blue-100",
        coursesCount: 20,
    },
    {
        id: "data-science",
        name: "Data Science",
        years: 4,
        icon: BookOpen,
        desc: "Big data analysis & AI applications",
        colorClass: "border-indigo-400 bg-indigo-100",
        coursesCount: 22,
    },
];

export default function ProgramsPage() {
    const router = useRouter();

    function handleClick(id: string) {
        router.push(`/dashboard/admin/programs/${id}`);
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 border-b-4 border-indigo-600 pb-2">
                Academic Programs
            </h1>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {programs.map(({ id, name, years, icon: Icon, desc, colorClass, coursesCount }) => (
                    <div
                        key={id}
                        className={`${colorClass} border-2 rounded-lg p-6 shadow-sm hover:shadow-lg transition cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-400`}
                        onClick={() => handleClick(id)}
                        tabIndex={0}
                        role="button"
                        aria-pressed="false"
                        aria-label={`View details of ${name} program`}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleClick(id);
                            }
                        }}
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            {/* size = {{ width: 28, height: 28 }} */}
                            <Icon className="text-indigo-900"  />
                            <h3 className="text-xl font-semibold text-indigo-900">{name}</h3>
                        </div>

                        <p className="text-indigo-900 mb-3 font-medium">{desc}</p>

                        <ul className="text-indigo-800 text-sm list-disc list-inside space-y-1 mb-4">
                            <li>{years} year{years > 1 ? "s" : ""} duration</li>
                            <li>{coursesCount ?? "N/A"} courses</li>
                        </ul>

                        <div className="text-indigo-900 font-semibold underline text-sm">
                            View Details &rarr;
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
