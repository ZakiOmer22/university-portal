"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconSettings,      // gear icon for Engineering
    IconBolt,          // lightning bolt icon for Electrical Engineering
    IconTools,         // for highlights
    IconUsers,
} from "@tabler/icons-react";

export default function EngineeringPage() {
    return (
        <main className="bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-[400px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">Department of Engineering</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">
                        Innovating infrastructure and technology to build the future.
                    </p>
                </div>
            </section>

            {/* Dean's Message */}
            <section className="py-16 max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Message from the Dean</h2>
                <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 shadow-md">
                    <Image
                        src="https://randomuser.me/api/portraits/men/50.jpg"
                        alt="Dean of Engineering"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                        unoptimized
                    />
                    <CardContent className="space-y-4">
                        <h3 className="text-2xl font-semibold">Dr. Ahmed Yusuf</h3>
                        <p className="text-gray-600">
                            Welcome to the Engineering Department. We prepare students to
                            become leaders in designing, constructing, and managing critical
                            infrastructure and advanced technologies.
                        </p>
                        <p className="text-gray-600">
                            Our programs blend theoretical knowledge with practical
                            experience, empowering graduates to solve real-world challenges.
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
                            <IconSettings size={40} className="text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Mechanical Engineering</h3>
                            <p className="text-gray-600">
                                Specializing in the design, analysis, and manufacturing of mechanical systems.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconBolt size={40} className="text-green-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Electrical Engineering</h3>
                            <p className="text-gray-600">
                                Focused on electrical circuits, power systems, and communication technologies.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Department Highlights</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 text-center shadow-md">
                            <IconTools size={40} className="mx-auto text-purple-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Advanced Labs</h3>
                            <p className="text-gray-600">
                                State-of-the-art labs equipped for hands-on experimentation and research.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconUsers size={40} className="mx-auto text-pink-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Industry Partnerships</h3>
                            <p className="text-gray-600">
                                Collaborations with leading companies for internships and projects.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconSettings size={40} className="mx-auto text-yellow-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Innovative Curriculum</h3>
                            <p className="text-gray-600">
                                Curriculum designed to integrate emerging technologies and practical skills.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Build the Future?</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Apply now to the Department of Engineering at University of Hargeisa and
                    start shaping the world.
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
