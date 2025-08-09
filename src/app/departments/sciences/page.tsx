"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconAtom,
    IconFlask,
    IconMicroscope,
    IconLeaf,
    IconUsers,
} from "@tabler/icons-react";

export default function SciencePage() {
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
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">Department of Science</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">
                        Advancing knowledge through rigorous research and innovative discovery.
                    </p>
                </div>
            </section>

            {/* Dean's Message */}
            <section className="py-16 max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Message from the Dean</h2>
                <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 shadow-md">
                    <Image
                        src="https://randomuser.me/api/portraits/men/55.jpg"
                        alt="Dean of Science"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                        unoptimized
                    />
                    <CardContent className="space-y-4">
                        <h3 className="text-2xl font-semibold">Dr. Yusuf Aden</h3>
                        <p className="text-gray-600">
                            Welcome to the Department of Science, where curiosity meets precision. Our mission is to cultivate a deep understanding of the natural world through innovative teaching and cutting-edge research.
                        </p>
                        <p className="text-gray-600">
                            We provide our students with access to state-of-the-art laboratories and foster collaboration with leading scientific communities worldwide.
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
                            <IconAtom size={40} className="text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BSc Physics</h3>
                            <p className="text-gray-600">
                                Explore the fundamental forces and properties of matter, energy, space, and time.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconFlask size={40} className="text-green-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BSc Chemistry</h3>
                            <p className="text-gray-600">
                                Study the composition, structure, properties, and changes of matter.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconMicroscope size={40} className="text-purple-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BSc Biology</h3>
                            <p className="text-gray-600">
                                Delve into the study of living organisms and life processes.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconLeaf size={40} className="text-yellow-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BSc Environmental Science</h3>
                            <p className="text-gray-600">
                                Understand environmental systems and sustainable solutions to global challenges.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Sub-Departments */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Sub-Departments</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">Physics</h3>
                            <p className="text-gray-600">
                                Research and education in theoretical and applied physics.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">Chemistry</h3>
                            <p className="text-gray-600">
                                Cutting-edge chemical analysis and experimental techniques.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">Biology & Environmental Science</h3>
                            <p className="text-gray-600">
                                Integrative studies of life sciences and ecosystem management.
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
                            <IconMicroscope size={40} className="mx-auto text-purple-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Advanced Labs</h3>
                            <p className="text-gray-600">
                                Access to modern research and teaching laboratories.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconUsers size={40} className="mx-auto text-pink-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Research Collaborations</h3>
                            <p className="text-gray-600">
                                Partnerships with global science institutions and organizations.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconLeaf size={40} className="mx-auto text-yellow-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Sustainability Initiatives</h3>
                            <p className="text-gray-600">
                                Projects focused on environmental protection and renewable energy.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Join the Frontier of Scientific Discovery</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Apply now to the Department of Science at the University of Hargeisa and become a part of the future.
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
