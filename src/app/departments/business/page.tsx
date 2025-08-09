"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconBuildingBank,    // building icon for business
    IconCurrencyDollar,  // finance
    IconPresentationAnalytics, // marketing analytics
    IconBriefcase,       // management
    IconUsers
} from "@tabler/icons-react";

export default function BusinessPage() {
    return (
        <main className="bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-[400px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">Department of Business</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">
                        Empowering future leaders in business, finance, and management.
                    </p>
                </div>
            </section>

            {/* Dean's Message */}
            <section className="py-16 max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Message from the Dean</h2>
                <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 shadow-md">
                    <Image
                        src="https://randomuser.me/api/portraits/women/65.jpg"
                        alt="Dean of Business"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                        unoptimized
                    />
                    <CardContent className="space-y-4">
                        <h3 className="text-2xl font-semibold">Dr. Fatima Ali</h3>
                        <p className="text-gray-600">
                            Welcome to the Business Department. We focus on nurturing entrepreneurial
                            spirit, strategic thinking, and ethical leadership.
                        </p>
                        <p className="text-gray-600">
                            Our diverse programs prepare students to excel in a competitive global marketplace.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Programs Offered */}
            <section className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Our Programs</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconBuildingBank size={40} className="text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BBA - Business Administration</h3>
                            <p className="text-gray-600">
                                Covers management, operations, organizational behavior, and leadership skills.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconCurrencyDollar size={40} className="text-green-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BSc Finance</h3>
                            <p className="text-gray-600">
                                Focuses on financial management, investment, banking, and corporate finance.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconPresentationAnalytics size={40} className="text-purple-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BSc Marketing</h3>
                            <p className="text-gray-600">
                                Emphasizes market research, digital marketing, consumer behavior, and branding.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconBriefcase size={40} className="text-yellow-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BSc Human Resource Management</h3>
                            <p className="text-gray-600">
                                Prepares students to manage recruitment, employee relations, and organizational development.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Colleges/Branches */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Business Divisions</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">College of Accounting</h3>
                            <p className="text-gray-600">
                                Specializes in financial accounting, auditing, and taxation with real-world case studies.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">College of Marketing</h3>
                            <p className="text-gray-600">
                                Focus on advertising, brand management, market research, and consumer analytics.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">College of Finance & Banking</h3>
                            <p className="text-gray-600">
                                In-depth studies in investment strategies, banking operations, and risk management.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Department Highlights</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 text-center shadow-md">
                            <IconBriefcase size={40} className="mx-auto text-purple-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Entrepreneurship Center</h3>
                            <p className="text-gray-600">
                                Supporting startups and business incubators with mentorship and funding.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconUsers size={40} className="mx-auto text-pink-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Internship Programs</h3>
                            <p className="text-gray-600">
                                Partnerships with leading companies for hands-on business experience.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconCurrencyDollar size={40} className="mx-auto text-yellow-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Financial Labs</h3>
                            <p className="text-gray-600">
                                Practical training with financial tools, stock market simulations, and analytics.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Launch Your Business Career</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Apply now to the Department of Business at the University of Hargeisa and
                    become a future leader in business and finance.
                </p>
                <a href="/admissions/apply" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Apply Now
                    </Button>
                </a>
            </section>
        </main>
    );
}
