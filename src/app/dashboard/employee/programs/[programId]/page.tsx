"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Program {
    id: string;
    name: string;
    years: number;
    desc: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    curriculum: string[][];
}

// Combine all programs (undergrad + grad) with curriculum
const allPrograms: Program[] = [
    {
        id: "computer-science",
        name: "Computer Science",
        years: 4,
        icon: Code,
        desc: "Advanced software & systems education",
        curriculum: [
            ["Intro to Programming", "Discrete Math", "Data Structures", "Computer Org", "Calculus I", "English Composition"],
            ["Algorithms", "Operating Systems", "Databases", "Software Engineering", "Calculus II", "Communication Skills"],
            ["AI & Machine Learning", "Networks", "Web Development", "Mobile Development", "Probability & Stats", "Ethics in CS"],
            ["Capstone Project", "Cloud Computing", "Security", "Parallel Computing", "Advanced Topics", "Internship"],
        ],
    },
    {
        id: "business-administration",
        name: "Business Administration",
        years: 4,
        icon: Briefcase,
        desc: "Leadership, marketing & management",
        curriculum: [
            ["Principles of Management", "Accounting", "Marketing", "Business Law", "Organizational Behavior", "Economics"],
            ["Business Strategy", "Finance", "Operations Management", "Leadership", "Business Ethics", "Capstone"],
            ["International Business", "Entrepreneurship", "Negotiations", "Supply Chain", "Digital Marketing", "Electives"],
            ["Thesis", "Advanced Finance", "Organizational Development", "Project Management", "Leadership Seminar", "Internship"],
        ],
    },
    {
        id: "nursing",
        name: "Nursing",
        years: 4,
        icon: Heart,
        desc: "Hands-on clinical & healthcare knowledge",
        curriculum: [
            ["Anatomy", "Physiology", "Pharmacology", "Microbiology", "Nursing Fundamentals", "English Composition"],
            ["Medical-Surgical Nursing", "Pediatrics", "Psychiatric Nursing", "Community Health Nursing", "Nutrition", "Communication Skills"],
            ["Obstetrics", "Leadership in Nursing", "Research Methods", "Pathophysiology", "Ethics in Nursing", "Internship"],
            ["Capstone Project", "Healthcare Policy", "Advanced Clinical Practice", "Public Health", "Informatics", "Electives"],
        ],
    },
    {
        id: "civil-engineering",
        name: "Civil Engineering",
        years: 5,
        icon: GraduationCap,
        desc: "Design and infrastructure systems",
        curriculum: [
            ["Statics", "Dynamics", "Material Science", "Surveying", "Calculus", "Physics"],
            ["Structural Analysis", "Geotechnical Engineering", "Fluid Mechanics", "Transportation Engineering", "Environmental Engineering", "Thermodynamics"],
            ["Concrete & Steel Design", "Construction Management", "Hydrology", "Project Planning", "Soil Mechanics", "Electives"],
            ["Capstone Design", "Sustainability", "Advanced Structures", "Research Methods", "Internship", "Professional Ethics"],
            ["Advanced Topics", "Thesis", "Seminar", "Electives", "Industry Project", "Electives"],
        ],
    },
    {
        id: "education",
        name: "Education",
        years: 4,
        icon: Users,
        desc: "Teaching methodologies & psychology",
        curriculum: [
            ["Foundations of Education", "Child Development", "Learning Theories", "Curriculum Design", "Educational Psychology", "Assessment Methods"],
            ["Classroom Management", "Special Education", "Technology in Education", "Literacy Development", "Second Language Acquisition", "Electives"],
            ["Educational Research", "Policy and Administration", "Cultural Diversity", "Instructional Strategies", "Internship", "Electives"],
            ["Capstone Project", "Advanced Topics", "Assessment Practices", "Professional Development", "Electives", "Thesis"],
        ],
    },
    {
        id: "accounting",
        name: "Accounting",
        years: 4,
        icon: Calculator,
        desc: "Finance, auditing, and taxation",
        curriculum: [
            ["Financial Accounting", "Managerial Accounting", "Business Law", "Taxation I", "Microeconomics", "Mathematics for Business"],
            ["Auditing", "Taxation II", "Cost Accounting", "Accounting Information Systems", "Macroeconomics", "Business Ethics"],
            ["Corporate Finance", "International Accounting", "Accounting Research", "Business Statistics", "Electives", "Internship"],
            ["Advanced Accounting", "Accounting Seminar", "Professional Standards", "Electives", "Thesis", "Capstone"],
        ],
    },
    {
        id: "information-technology",
        name: "Information Technology",
        years: 4,
        icon: Server,
        desc: "Networking, security & IT management",
        curriculum: [
            ["Computer Networks", "Operating Systems", "Programming Fundamentals", "Database Systems", "Information Security", "English Composition"],
            ["Systems Analysis", "Web Development", "Cloud Computing", "Network Security", "Project Management", "Communication Skills"],
            ["Mobile Computing", "Cybersecurity", "Data Management", "IT Governance", "Electives", "Internship"],
            ["Advanced Topics", "IT Strategy", "Capstone Project", "Emerging Technologies", "Electives", "Professional Development"],
        ],
    },
    {
        id: "graphic-design",
        name: "Graphic Design",
        years: 4,
        icon: Paintbrush,
        desc: "Visual communication & digital arts",
        curriculum: [
            ["Design Principles", "Drawing and Illustration", "Typography", "Color Theory", "Digital Imaging", "History of Art"],
            ["Web Design", "Photography", "Motion Graphics", "Packaging Design", "User Experience", "Electives"],
            ["Branding", "Advertising Design", "Interactive Media", "Portfolio Development", "Internship", "Electives"],
            ["Advanced Design", "Professional Practice", "Capstone Project", "Electives", "Thesis", "Exhibition"],
        ],
    },
    {
        id: "environmental-science",
        name: "Environmental Science",
        years: 4,
        icon: Globe,
        desc: "Sustainability and ecological studies",
        curriculum: [
            ["Ecology", "Environmental Chemistry", "Geology", "Statistics", "Biology", "Environmental Policy"],
            ["Environmental Monitoring", "Soil Science", "Water Resources", "Climate Change", "GIS", "Electives"],
            ["Sustainable Development", "Environmental Impact Assessment", "Conservation Biology", "Research Methods", "Internship", "Electives"],
            ["Capstone Project", "Advanced Topics", "Environmental Ethics", "Professional Development", "Thesis", "Seminar"],
        ],
    },
    {
        id: "mechanical-engineering",
        name: "Mechanical Engineering",
        years: 5,
        icon: Cpu,
        desc: "Machines, mechanics & design",
        curriculum: [
            ["Statics", "Dynamics", "Thermodynamics", "Materials Science", "Calculus", "Physics"],
            ["Fluid Mechanics", "Machine Design", "Manufacturing Processes", "Heat Transfer", "Electrical Circuits", "Materials Lab"],
            ["Control Systems", "Mechanical Vibrations", "Energy Systems", "Computer-Aided Design", "Internship", "Electives"],
            ["Capstone Design", "Robotics", "Advanced Thermodynamics", "Project Management", "Professional Ethics", "Electives"],
            ["Thesis", "Seminar", "Industry Project", "Electives", "Advanced Topics", "Research"],
        ],
    },
    {
        id: "psychology",
        name: "Psychology",
        years: 4,
        icon: Users,
        desc: "Human behavior and mental processes",
        curriculum: [
            ["Cognitive Psychology", "Social Psychology", "Personality Theories", "Abnormal Psychology", "Psychological Testing", "Internship"],
            ["Clinical Psychology", "Health Psychology", "Neuropsychology", "Counseling Techniques", "Research Thesis", "Electives"],
        ],
    },
    {
        id: "data-science",
        name: "Data Science",
        years: 4,
        icon: BookOpen,
        desc: "Big data analysis & AI applications",
        curriculum: [
            ["Intro to Data Science", "Statistics I", "Programming for Data Science", "Linear Algebra", "Data Visualization", "English Composition"],
            ["Probability", "Machine Learning", "Databases", "Data Mining", "Big Data Technologies", "Communication Skills"],
            ["Deep Learning", "Natural Language Processing", "Cloud Computing", "Data Ethics", "Electives", "Internship"],
            ["Capstone Project", "Advanced Analytics", "Research Methods", "Professional Development", "Electives", "Thesis"],
        ],
    },
    {
        id: "marketing",
        name: "Marketing",
        years: 4,
        icon: Briefcase,
        desc: "Market research and digital marketing strategies",
        curriculum: [
            ["Principles of Marketing", "Consumer Behavior", "Business Communication", "Statistics", "Economics", "English Composition"],
            ["Market Research", "Digital Marketing", "Advertising", "Brand Management", "Sales Management", "Communication Skills"],
            ["International Marketing", "Marketing Analytics", "E-commerce", "Product Development", "Internship", "Electives"],
            ["Marketing Strategy", "Capstone Project", "Ethics in Marketing", "Professional Development", "Electives", "Thesis"],
        ],
    },
    {
        id: "philosophy",
        name: "Philosophy",
        years: 4,
        icon: UserCheck,
        desc: "Critical thinking and ethical reasoning",
        curriculum: [
            ["Introduction to Philosophy", "Logic", "Ethics", "History of Philosophy", "Critical Thinking", "Writing Skills"],
            ["Metaphysics", "Epistemology", "Philosophy of Mind", "Philosophy of Science", "Political Philosophy", "Electives"],
            ["Philosophy of Religion", "Philosophy of Language", "Aesthetics", "Contemporary Philosophy", "Research Methods", "Internship"],
            ["Capstone Seminar", "Advanced Ethics", "Philosophy Thesis", "Professional Development", "Electives", "Seminar"],
        ],
    },
    {
        id: "physics",
        name: "Physics",
        years: 4,
        icon: Cpu,
        desc: "Fundamental principles of the universe",
        curriculum: [
            ["Classical Mechanics", "Calculus I", "Physics Lab I", "Electricity & Magnetism", "Linear Algebra", "English Composition"],
            ["Quantum Mechanics", "Thermodynamics", "Physics Lab II", "Mathematical Methods", "Optics", "Communication Skills"],
            ["Nuclear Physics", "Solid State Physics", "Computational Physics", "Electives", "Internship", "Research Methods"],
            ["Advanced Physics Topics", "Capstone Project", "Thesis", "Professional Development", "Electives", "Seminar"],
        ],
    },
    {
        id: "architecture",
        name: "Architecture",
        years: 5,
        icon: Home,
        desc: "Design and construction of buildings",
        curriculum: [
            ["Design Fundamentals", "Architectural Drawing", "History of Architecture", "Materials & Methods", "Physics for Architecture", "English Composition"],
            ["Structural Systems", "Building Technology", "Environmental Systems", "CAD & Modelling", "Construction Management", "Communication Skills"],
            ["Urban Planning", "Sustainable Design", "Advanced CAD", "Professional Practice", "Internship", "Electives"],
            ["Thesis Preparation", "Capstone Project", "Architectural Criticism", "Research Methods", "Electives", "Seminar"],
            ["Advanced Studio", "Industry Project", "Professional Development", "Electives", "Portfolio", "Exhibition"],
        ],
    },
    {
        id: "law",
        name: "Law",
        years: 4,
        icon: BriefcaseBusiness,
        desc: "Legal systems and civil rights",
        curriculum: [
            ["Introduction to Law", "Constitutional Law", "Legal Writing", "Contracts", "Torts", "Legal Research"],
            ["Criminal Law", "Property Law", "Civil Procedure", "Evidence", "Ethics & Professional Responsibility", "Communication Skills"],
            ["Family Law", "Business Law", "International Law", "Administrative Law", "Internship", "Electives"],
            ["Capstone Project", "Legal Clinics", "Advanced Legal Studies", "Thesis", "Electives", "Professional Development"],
        ],
    },
    {
        id: "social-work",
        name: "Social Work",
        years: 4,
        icon: Users,
        desc: "Community engagement and support systems",
        curriculum: [
            ["Introduction to Social Work", "Human Behavior", "Social Policy", "Research Methods", "Psychology", "English Composition"],
            ["Community Practice", "Social Welfare Policy", "Case Management", "Cultural Competency", "Communication Skills", "Electives"],
            ["Mental Health", "Substance Abuse", "Child & Family Welfare", "Internship", "Ethics", "Electives"],
            ["Capstone Project", "Advanced Topics", "Professional Development", "Thesis", "Electives", "Seminar"],
        ],
    },

    // Graduate programs with curricula
    {
        id: "masters-in-computer-science",
        name: "Masters in Computer Science",
        years: 2,
        icon: Code,
        desc: "Deep dive into AI, ML, and advanced computing",
        curriculum: [
            ["Advanced Algorithms", "Machine Learning", "Distributed Systems", "Research Methods", "Electives", "Thesis Proposal"],
            ["Deep Learning", "Data Mining", "Cloud Computing", "AI Ethics", "Electives", "Thesis Defense"],
        ],
    },
    {
        id: "mba",
        name: "MBA",
        years: 2,
        icon: Briefcase,
        desc: "Strategic management and global business insights",
        curriculum: [
            ["Managerial Economics", "Accounting for Managers", "Organizational Behavior", "Marketing Management", "Operations Management", "Leadership"],
            ["Business Strategy", "Finance", "Entrepreneurship", "Business Ethics", "International Business", "Capstone Project"],
        ],
    },
    {
        id: "masters-in-public-health",
        name: "Masters in Public Health",
        years: 2,
        icon: Heart,
        desc: "Advanced healthcare systems and epidemiology",
        curriculum: [
            ["Epidemiology", "Biostatistics", "Health Policy", "Environmental Health", "Research Methods", "Electives"],
            ["Global Health", "Health Promotion", "Program Planning & Evaluation", "Ethics in Public Health", "Thesis", "Internship"],
        ],
    },
    {
        id: "masters-in-civil-engineering",
        name: "Masters in Civil Engineering",
        years: 2,
        icon: GraduationCap,
        desc: "Infrastructure development and sustainability",
        curriculum: [
            ["Advanced Structural Analysis", "Geotechnical Engineering", "Transportation Engineering", "Sustainable Infrastructure", "Project Management", "Research Methods"],
            ["Thesis Research", "Advanced Materials", "Environmental Engineering", "Electives", "Internship", "Professional Ethics"],
        ],
    },
    {
        id: "phd-in-psychology",
        name: "PhD in Psychology",
        years: 4,
        icon: Users,
        desc: "Research on human behavior and cognition",
        curriculum: [
            ["Advanced Research Methods", "Psychological Theory", "Statistics & Data Analysis", "Qualitative Methods", "Teaching Practicum", "Comprehensive Exams"],
            ["Dissertation Research", "Seminars", "Professional Development", "Electives", "Defense", "Publication"],
        ],
    },
    {
        id: "masters-in-data-science",
        name: "Masters in Data Science",
        years: 2,
        icon: BookOpen,
        desc: "Big data analytics and AI-driven decision making",
        curriculum: [
            ["Advanced Statistics", "Machine Learning", "Data Engineering", "Big Data Systems", "Research Methods", "Electives"],
            ["Thesis Project", "AI Applications", "Cloud Analytics", "Electives", "Internship", "Professional Development"],
        ],
    },
];
export default function ProgramDetailsPage() {
    const pathname = usePathname();
    const router = useRouter();
    const id = pathname?.split("/").pop() ?? "";

    const [program, setProgram] = useState<Program | null>(null);

    useEffect(() => {
        const found = allPrograms.find((p) => p.id === id);
        setProgram(found ?? null);
    }, [id]);

    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <p className="text-gray-600 text-lg">Program not found.</p>
            </div>
        );
    }

    const IconComponent = program.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8 max-w-5xl mx-auto rounded-lg shadow-lg">
            <button
                onClick={() => router.back()}
                className="mb-6 text-indigo-700 hover:text-indigo-900 font-semibold flex items-center space-x-2"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M15 18l-6-6 6-6"></path>
                </svg>
                <span>Back to Programs</span>
            </button>

            <header className="flex items-center space-x-4 mb-6">
                <IconComponent  className="text-indigo-600" />
                <h1 className="text-4xl font-extrabold text-indigo-900">{program.name}</h1>
            </header>

            <p className="text-lg text-gray-700 mb-8">{program.desc}</p>

            <section>
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">Curriculum Overview</h2>
                <div className="space-y-6">
                    {program.curriculum.map((courses, yearIndex) => (
                        <div
                            key={yearIndex}
                            className="bg-white p-5 rounded-xl shadow border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Year {yearIndex + 1}</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-gray-800">
                                {courses.map((course, idx) => (
                                    <li
                                        key={idx}
                                        className="bg-indigo-50 text-indigo-900 px-3 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
                                        title={course}
                                        tabIndex={0}
                                        role="link"
                                        onClick={() => router.push(`/dashboard/admin/programs/${program.id}/courses/${encodeURIComponent(course.toLowerCase().replace(/\s+/g, "-"))}`)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                router.push(`/dashboard/admin/programs/${program.id}/courses/${encodeURIComponent(course.toLowerCase().replace(/\s+/g, "-"))}`);
                                            }
                                        }}
                                    >
                                        {course}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
