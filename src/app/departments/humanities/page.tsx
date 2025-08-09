"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconBook,
    IconHistory,
    IconLanguage,
    IconUsers,
} from "@tabler/icons-react";

export default function HumanitiesPage() {
    return (
        <main className="bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-[400px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">Department of Humanities</h1>
                    <p className="mt-4 text-lg max-w-2xl mx-auto">
                        Exploring culture, history, languages, and the human experience.
                    </p>
                </div>
            </section>

            {/* Dean's Message */}
            <section className="py-16 max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Message from the Dean</h2>
                <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 shadow-md">
                    <Image
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Dean of Humanities"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                        unoptimized
                    />
                    <CardContent className="space-y-4">
                        <h3 className="text-2xl font-semibold">Dr. Hawa Mohamed</h3>
                        <p className="text-gray-600">
                            Welcome to the Humanities Department. We cherish the study of human culture,
                            creativity, and thought across time and place.
                        </p>
                        <p className="text-gray-600">
                            Our programs foster critical thinking, empathy, and a deep understanding
                            of our shared human heritage.
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
                            <IconBook size={40} className="text-blue-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BA Literature & Languages</h3>
                            <p className="text-gray-600">
                                Study classical and modern literature, linguistics, and language acquisition.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconHistory size={40} className="text-green-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BA History & Culture</h3>
                            <p className="text-gray-600">
                                Explore historical events, cultural evolution, and societal impacts over time.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconLanguage size={40} className="text-purple-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BA Philosophy & Ethics</h3>
                            <p className="text-gray-600">
                                Engage with philosophical thought, logic, and moral questions shaping societies.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <IconUsers size={40} className="text-yellow-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">BA Cultural Studies</h3>
                            <p className="text-gray-600">
                                Analyze contemporary cultural practices, media, and identity formation.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Humanities Sub-Departments */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Sub-Departments</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">Literature & Languages</h3>
                            <p className="text-gray-600">
                                Language studies, literature analysis, and translation studies.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">Philosophy & Ethics</h3>
                            <p className="text-gray-600">
                                Philosophical traditions, ethics, and critical theory.
                            </p>
                        </Card>
                        <Card className="p-6 shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">History & Culture</h3>
                            <p className="text-gray-600">
                                World history, regional studies, and cultural heritage preservation.
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
                            <IconUsers size={40} className="mx-auto text-purple-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Guest Lectures</h3>
                            <p className="text-gray-600">
                                Regular talks by leading scholars, authors, and cultural leaders.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconBook size={40} className="mx-auto text-pink-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Research Projects</h3>
                            <p className="text-gray-600">
                                Opportunities to participate in interdisciplinary humanities research.
                            </p>
                        </Card>
                        <Card className="p-6 text-center shadow-md">
                            <IconHistory size={40} className="mx-auto text-yellow-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Cultural Events</h3>
                            <p className="text-gray-600">
                                Annual festivals, exhibitions, and cultural exchange programs.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Discover the Human Story</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Join the Department of Humanities at the University of Hargeisa and deepen your understanding of culture and society.
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
