"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, MapPin, Calendar, Clock, Users, ExternalLink, Briefcase, AlertCircle } from "lucide-react";

interface CareerOpportunity {
    id: string;
    title: string;
    company: string;
    location: string;
    type: "Internship" | "Full-time" | "Part-time";
    postedDate: string;
    deadline: string;
    description: string;
    eligibility: string;
    applyUrl: string;
}

const dummyCareerOpportunities: CareerOpportunity[] = [
    {
        id: "c1",
        title: "Software Developer Intern",
        company: "Tech Solutions Ltd.",
        location: "Hargeisa",
        type: "Internship",
        postedDate: "2025-08-01T09:00:00Z",
        deadline: "2025-09-01T23:59:59Z",
        description: "Join our team as a Software Developer Intern and get hands-on experience with web and mobile app development using modern technologies including React, Node.js, Python, and cloud platforms. You'll work alongside experienced developers on real projects, participate in code reviews, and contribute to our product development lifecycle.\n\nKey Responsibilities:\n• Develop and maintain web applications using modern frameworks\n• Collaborate with design and product teams\n• Write clean, maintainable code and participate in code reviews\n• Learn and apply best practices in software development\n• Troubleshoot and debug applications",
        eligibility: "Open to all current students and recent graduates in Computer Science or related fields. Basic knowledge of programming concepts and web technologies required.",
        applyUrl: "https://techsolutions.example.com/apply",
    },
    {
        id: "c2",
        title: "Junior Frontend Developer",
        company: "InnovateX",
        location: "Hargeisa",
        type: "Full-time",
        postedDate: "2025-07-20T10:30:00Z",
        deadline: "2025-08-25T23:59:59Z",
        description: "Work closely with the design team to implement responsive and accessible user interfaces using React and Tailwind CSS. Collaborate with backend developers and participate in code reviews.",
        eligibility: "Bachelor's in Computer Science or related field with 1+ years of experience",
        applyUrl: "https://innovatex.example.com/jobs/frontend",
    },
];

function JobTypeBadge({ type }: { type: CareerOpportunity["type"] }) {
    const config = {
        "Internship": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
        "Full-time": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
        "Part-time": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" }
    };

    const { bg, text, border } = config[type];
    return (
        <Badge className={`${bg} ${text} ${border} font-medium px-3 py-1.5`}>
            {type}
        </Badge>
    );
}

function DaysRemaining({ deadline }: { deadline: string }) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return (
            <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                <AlertCircle size={14} />
                Expired
            </Badge>
        );
    } else if (diffDays === 0) {
        return (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
                <Clock size={14} />
                Ends Today
            </Badge>
        );
    } else if (diffDays <= 7) {
        return (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
                <Clock size={14} />
                {diffDays} days left
            </Badge>
        );
    } else {
        return (
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1">
                <Calendar size={14} />
                {diffDays} days left
            </Badge>
        );
    }
}

export default function CareerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const careerId = params["id"];

    const [career, setCareer] = useState<CareerOpportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        if (!careerId) {
            router.push("/dashboard/student/career");
            return;
        }
        setTimeout(() => {
            const found = dummyCareerOpportunities.find((c) => c.id === careerId) || null;
            setCareer(found);
            setLoading(false);
        }, 700);
    }, [careerId, router]);

    if (loading) {
        return (
            <DashboardLayout loading={true} user={user}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading career opportunity...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!career) {
        return (
            <DashboardLayout loading={false} user={user}>
                <section className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center border border-gray-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Opportunity Not Found</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            The career opportunity you&apos;re looking for doesn&apos;t exist or may have been removed.
                        </p>
                        <Link
                            href="/dashboard/student/career"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 font-medium"
                        >
                            <ArrowLeft size={18} />
                            Back to Opportunities
                        </Link>
                    </div>
                </section>
            </DashboardLayout>
        );
    }

    const isExpired = new Date(career.deadline) < new Date();

    return (
        <DashboardLayout loading={false} user={user}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/dashboard/student/career"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Opportunities
                    </Link>
                    {career && (
                        <div className="flex items-center gap-3">
                            <JobTypeBadge type={career.type} />
                            <DaysRemaining deadline={career.deadline} />
                        </div>
                    )}
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            {career.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Building2 size={20} />
                                <span className="font-semibold">{career.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={20} />
                                <span>{career.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 space-y-8">
                        {/* Key Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Job Type</div>
                                        <div className="font-semibold text-gray-900">{career.type}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Posted Date</div>
                                        <div className="font-semibold text-gray-900">
                                            {new Date(career.postedDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Application Deadline</div>
                                        <div className="font-semibold text-gray-900">
                                            {new Date(career.deadline).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Eligibility</div>
                                        <div className="font-semibold text-gray-900">{career.eligibility}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Briefcase className="w-6 h-6 text-indigo-600" />
                                Job Description
                            </h2>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-6 border border-gray-200">
                                {career.description}
                            </div>
                        </section>

                        {/* Eligibility */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Users className="w-6 h-6 text-indigo-600" />
                                Eligibility Requirements
                            </h2>
                            <div className="text-gray-700 leading-relaxed bg-blue-50 rounded-xl p-6 border border-blue-200">
                                {career.eligibility}
                            </div>
                        </section>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <Link
                                href="/dashboard/student/career"
                                className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                            >
                                <ArrowLeft size={18} />
                                Back to Opportunities
                            </Link>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                {isExpired ? (
                                    <div className="text-center">
                                        <Badge className="bg-red-100 text-red-700 border-red-200 mb-2">
                                            Application Closed
                                        </Badge>
                                        <p className="text-sm text-gray-600">This opportunity has expired</p>
                                    </div>
                                ) : (
                                    <a
                                        href={career.applyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <ExternalLink size={18} />
                                        Apply Now
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                {!isExpired && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <AlertCircle size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">Application Tips</h3>
                                <p className="text-blue-700 text-sm">
                                    Make sure to tailor your resume to this position and write a compelling cover letter. 
                                    Highlight relevant skills and experiences that match the job requirements. 
                                    Double-check all application materials before submitting.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}