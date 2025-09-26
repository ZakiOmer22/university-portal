"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/leader/DashboardLayout";

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
        description:
            "Join our team as a Software Developer Intern and get hands-on experience with web and mobile app development using modern technologies.",
        eligibility: "Open to all",
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
        description:
            "Work closely with the design team to implement responsive and accessible user interfaces using React and Tailwind CSS.",
        eligibility: "Bachelor's in CS or related",
        applyUrl: "https://innovatex.example.com/jobs/frontend",
    },
    // Add all other careers similarly, with applyUrl
    // ...
];

const ITEMS_PER_PAGE = 5;

export default function CareerPage() {
    const [jobs, setJobs] = useState<CareerOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<"All" | CareerOpportunity["type"]>("All");

    useEffect(() => {
        setTimeout(() => {
            setJobs(dummyCareerOpportunities);
            setLoading(false);
        }, 900);
    }, []);

    const filteredJobs = filterType === "All" ? jobs : jobs.filter((j) => j.type === filterType);
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const pagedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <DashboardLayout loading={loading} user={null}>
            <section className="max-w-5xl mx-auto bg-white rounded shadow p-8 mt-8">
                <h1 className="text-3xl font-bold mb-6 text-indigo-900">Career Opportunities</h1>

                {/* Filter */}
                <div className="mb-6 flex items-center gap-4">
                    <label htmlFor="filterType" className="font-semibold text-indigo-900">
                        Filter by Job Type:
                    </label>
                    <select
                        id="filterType"
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value as any);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="All">All</option>
                        <option value="Internship">Internship</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                </div>

                {/* Job List */}
                {pagedJobs.length === 0 ? (
                    <p className="text-gray-600 italic">No career opportunities found.</p>
                ) : (
                    <ul className="space-y-6">
                        {pagedJobs.map((job) => (
                            <li
                                key={job.id}
                                className="border border-gray-300 rounded p-4 hover:shadow transition-shadow"
                            >
                                <h2 className="text-xl font-semibold text-indigo-900">{job.title}</h2>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Company:</span> {job.company}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Location:</span> {job.location}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Type:</span> {job.type}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">Deadline:</span>{" "}
                                    {new Date(job.deadline).toLocaleDateString()}
                                </p>
                                <Link
                                    href={`/dashboard/student/career/${job.id}`}
                                    className="inline-block mt-3 text-indigo-600 hover:underline font-semibold"
                                >
                                    View Details &rarr;
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={`px-4 py-2 rounded border ${currentPage === 1
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                }`}
                        >
                            Prev
                        </button>
                        <span className="font-semibold text-indigo-900">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={`px-4 py-2 rounded border ${currentPage === totalPages
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
