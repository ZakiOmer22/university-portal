"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Calendar, Clock, Briefcase, Users, Filter, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

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
        description: "Join our team as a Software Developer Intern and get hands-on experience with web and mobile app development using modern technologies including React, Node.js, and cloud platforms.",
        eligibility: "Open to all current students and recent graduates",
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
    {
        id: "c3",
        title: "Data Science Intern",
        company: "Data Analytics Pro",
        location: "Remote",
        type: "Internship",
        postedDate: "2025-08-05T14:00:00Z",
        deadline: "2025-09-15T23:59:59Z",
        description: "Assist in data collection, cleaning, and analysis. Work with Python, SQL, and machine learning libraries to derive insights from large datasets.",
        eligibility: "Students in Computer Science, Statistics, or related fields",
        applyUrl: "https://dataanalytics.example.com/internships",
    },
    {
        id: "c4",
        title: "Marketing Coordinator",
        company: "Growth Marketing Agency",
        location: "Hargeisa",
        type: "Part-time",
        postedDate: "2025-07-28T11:00:00Z",
        deadline: "2025-08-30T23:59:59Z",
        description: "Support marketing campaigns, manage social media channels, and assist with content creation and analytics reporting.",
        eligibility: "Marketing or Business students, excellent communication skills",
        applyUrl: "https://growthmarketing.example.com/careers",
    },
    {
        id: "c5",
        title: "Backend Engineer",
        company: "Cloud Systems Inc.",
        location: "Remote",
        type: "Full-time",
        postedDate: "2025-08-10T08:00:00Z",
        deadline: "2025-09-10T23:59:59Z",
        description: "Design and develop scalable backend systems using Node.js and cloud infrastructure. Implement APIs and work with database optimization.",
        eligibility: "3+ years of backend development experience, degree in CS preferred",
        applyUrl: "https://cloudsystems.example.com/backend-positions",
    },
];

const ITEMS_PER_PAGE = 6;

function JobTypeBadge({ type }: { type: CareerOpportunity["type"] }) {
    const config = {
        "Internship": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
        "Full-time": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
        "Part-time": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" }
    };

    const { bg, text, border } = config[type];
    return (
        <Badge className={`${bg} ${text} ${border} font-medium`}>
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
        return <Badge className="bg-red-100 text-red-700 border-red-200">Expired</Badge>;
    } else if (diffDays === 0) {
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Today</Badge>;
    } else if (diffDays <= 7) {
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">{diffDays} days left</Badge>;
    } else {
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{diffDays} days left</Badge>;
    }
}

export default function CareerPage() {
    const [jobs, setJobs] = useState<CareerOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<"All" | CareerOpportunity["type"]>("All");
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setTimeout(() => {
            setJobs(dummyCareerOpportunities);
            setLoading(false);
        }, 900);
    }, []);

    const filteredJobs = filterType === "All" ? jobs : jobs.filter((j) => j.type === filterType);
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const pagedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Statistics
    const totalJobs = jobs.length;
    const internshipCount = jobs.filter(j => j.type === "Internship").length;
    const fullTimeCount = jobs.filter(j => j.type === "Full-time").length;
    const partTimeCount = jobs.filter(j => j.type === "Part-time").length;

    return (
        <DashboardLayout loading={loading} user={user}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
                        <p className="text-gray-600 mt-2">Discover internships and job opportunities for your career growth</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {totalJobs} Opportunities
                    </Badge>
                </div>

                {/* Stats Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Briefcase className="w-6 h-6 text-indigo-200" />
                                <div className="text-indigo-200 text-sm font-medium">Total Jobs</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalJobs}</div>
                            <div className="text-indigo-200 text-sm">Available Positions</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Users className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Internships</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{internshipCount}</div>
                            <div className="text-blue-200 text-sm">Learning Opportunities</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Building2 className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Full-time</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{fullTimeCount}</div>
                            <div className="text-green-200 text-sm">Career Positions</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-purple-200" />
                                <div className="text-purple-200 text-sm font-medium">Part-time</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{partTimeCount}</div>
                            <div className="text-purple-200 text-sm">Flexible Work</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <label className="font-medium text-gray-700">Filter by Job Type:</label>
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value as "All" | CareerOpportunity["type"]);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Job Types</option>
                                <option value="Internship">Internship</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {filteredJobs.length} opportunities
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Job List */}
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                                <Skeleton className="h-8 w-48 mb-3" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4 mb-4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : pagedJobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Opportunities Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {filterType !== "All" 
                                ? `No ${filterType.toLowerCase()} opportunities available at the moment.`
                                : "No career opportunities available right now. Check back later!"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pagedJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <JobTypeBadge type={job.type} />
                                    <DaysRemaining deadline={job.deadline} />
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                                    {job.title}
                                </h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Building2 size={16} className="text-gray-400" />
                                        <span className="font-medium">{job.company}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>Apply by: {new Date(job.deadline).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {job.description}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={`/dashboard/student/career/${job.id}`}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
                                    >
                                        View Details
                                        <ChevronRight size={16} />
                                    </Link>
                                    <a
                                        href={job.applyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                    >
                                        Apply Now
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length} opportunities
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border transition-all duration-200 ${
                                        currentPage === 1
                                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                            : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                    currentPage === pageNum
                                                        ? "bg-indigo-600 text-white border border-indigo-600"
                                                        : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border transition-all duration-200 ${
                                        currentPage === totalPages
                                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                            : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                    }`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}