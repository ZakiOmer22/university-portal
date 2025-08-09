"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconCpu, IconCode, IconServer, IconUsers } from "@tabler/icons-react";

export default function ComputerSciencePage() {
    return (
        <main className="bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-[400px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Department of Computer Science & IT
                    </h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">
                        Shaping the future through technology, innovation, and research.
                    </p>
                </div>
            </section>

            {/* Dean's Message */}
            <section className="py-16 max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">
                    Message from the Dean
                </h2>
                <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 shadow-md">
                    <Image
                        src="https://randomuser.me/api/portraits/men/45.jpg"
                        alt="Dean of Computer Science"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                    />
                    <CardContent className="space-y-4">
                        <h3 className="text-2xl font-semibold">Dr. Ahmed Yusuf</h3>
                        <p className="text-gray-600">
                            Welcome to the Department of Computer Science & IT. We are
                            committed to preparing the next generation of innovators,
                            engineers, and problem solvers who will lead the digital
                            transformation of our world.
                        </p>
                        <p className="text-gray-600">
                            Our programs combine theory with practical experience, ensuring
                            graduates are ready for the challenges of the rapidly evolving tech
                            industry.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Programs Offered */}
            <section className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Our Programs
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconCode size={40} className="text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                BSc Computer Science
                            </h3>
                            <p className="text-gray-600">
                                Focuses on software development, algorithms, artificial
                                intelligence, and cutting-edge computing technologies.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconServer size={40} className="text-green-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                BSc Information Technology
                            </h3>
                            <p className="text-gray-600">
                                Prepares students for careers in networking, system
                                administration, cloud computing, and IT project management.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Department Highlights
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 text-center shadow-md">
                            <IconCpu size={40} className="mx-auto text-purple-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Advanced Labs</h3>
                            <p className="text-gray-600">
                                Equipped with the latest technology for hands-on learning and
                                research.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconUsers size={40} className="mx-auto text-pink-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                Industry Partnerships
                            </h3>
                            <p className="text-gray-600">
                                Collaborations with tech companies for internships and
                                real-world projects.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconCode size={40} className="mx-auto text-yellow-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                Research Opportunities
                            </h3>
                            <p className="text-gray-600">
                                Encouraging innovation through funded student and faculty
                                research projects.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Join the Future of Tech?
                </h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Apply today to the Department of Computer Science & IT at the
                    University of Hargeisa and be part of an innovative community.
                </p>
                <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                    Apply Now
                </Button>
            </section>
        </main>
    );
}
