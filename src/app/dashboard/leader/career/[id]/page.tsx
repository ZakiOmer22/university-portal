"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import Link from "next/link";

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
    // add others ...
];

export default function CareerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const careerId = params["id"];

    const [career, setCareer] = useState<CareerOpportunity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            <DashboardLayout loading user={null}>
                <p className="text-center mt-20 text-gray-600 text-lg">Loading career details...</p>
            </DashboardLayout>
        );
    }

    if (!career) {
        return (
            <DashboardLayout loading={false} user={null}>
                <section className="max-w-xl mx-auto my-20 p-8 bg-white rounded shadow text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">Career Not Found</h2>
                    <p className="mb-6">The career opportunity you requested does not exist or is unavailable.</p>
                    <Link
                        href="/dashboard/student/career"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
                    >
                        Back to Career Opportunities
                    </Link>
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={null}>
            <section className="max-w-4xl mx-auto bg-white rounded shadow p-10 my-12 font-serif print:font-sans print:p-6 print:my-4">
                <h1 className="text-3xl font-bold mb-6 text-indigo-900">{career.title}</h1>

                <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-gray-800">
                    <dt className="font-semibold">Company:</dt>
                    <dd>{career.company}</dd>

                    <dt className="font-semibold">Location:</dt>
                    <dd>{career.location}</dd>

                    <dt className="font-semibold">Type:</dt>
                    <dd>{career.type}</dd>

                    <dt className="font-semibold">Posted Date:</dt>
                    <dd>{new Date(career.postedDate).toLocaleDateString()}</dd>

                    <dt className="font-semibold">Application Deadline:</dt>
                    <dd>{new Date(career.deadline).toLocaleDateString()}</dd>

                    <dt className="font-semibold">Eligibility:</dt>
                    <dd>{career.eligibility}</dd>
                </dl>

                <section className="mt-8 text-gray-900">
                    <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
                    <p>{career.description}</p>
                </section>

                {/* Apply Now Button */}
                <div className="mt-8 text-center print:hidden">
                    <a
                        href={career.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700"
                        aria-label="Apply Now"
                    >
                        Apply Now
                    </a>
                </div>

                <div className="mt-6 text-center print:hidden">
                    <Link
                        href="/dashboard/student/career"
                        className="inline-block bg-gray-300 text-gray-900 px-6 py-2 rounded shadow hover:bg-gray-400"
                    >
                        Back to Career Opportunities
                    </Link>
                </div>
            </section>
        </DashboardLayout>
    );
}
