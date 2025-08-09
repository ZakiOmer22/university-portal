"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconUsers,
    IconBook,
    IconGlobe,
    IconPlayBasketball,
    IconMusic,
    IconPalette,
    IconBulb,
} from "@tabler/icons-react";

const featuredClubs = [
    {
        name: "Tech Innovators Club",
        description:
            "A hub for students passionate about technology, coding, and innovation. Hackathons, workshops, and networking events await!",
        img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Drama & Theater Society",
        description:
            "Express your creativity on stage! Participate in plays, improv, and behind-the-scenes production roles.",
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Environmental Action Group",
        description:
            "Join hands to make a difference! Community clean-ups, awareness campaigns, and sustainability projects.",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    },
];

const clubCategories = [
    {
        icon: <IconBook size={36} className="text-blue-600" />,
        title: "Academic & Professional",
        description:
            "Clubs focused on academic enrichment, career development, and skill-building.",
    },
    {
        icon: <IconGlobe size={36} className="text-green-600" />,
        title: "Cultural & Diversity",
        description:
            "Celebrate and explore cultures, heritage, and diversity through events and discussions.",
    },
    {
        icon: <IconPlayBasketball size={36} className="text-red-600" />,
        title: "Sports & Fitness",
        description:
            "Sports teams, fitness groups, and outdoor enthusiasts come together to stay active and compete.",
    },
    {
        icon: <IconMusic size={36} className="text-purple-600" />,
        title: "Arts & Music",
        description:
            "Creative outlets including music, painting, photography, and performance arts.",
    },
    {
        icon: <IconBulb size={36} className="text-yellow-600" />,
        title: "Innovation & Entrepreneurship",
        description:
            "Clubs that foster startups, business ideas, and innovation-driven projects.",
    },
];

export default function ClubsPage() {
    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative h-[350px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Student Clubs & Organizations
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
                        Engage, connect, and grow by joining one of our diverse student groups.
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Discover Your Community on Campus
                </h2>
                <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                    Whether you're passionate about technology, arts, culture, sports, or
                    social activism, our clubs provide a platform to build skills,
                    friendships, and unforgettable memories.
                </p>
            </section>

            {/* Featured Clubs */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">Featured Clubs</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {featuredClubs.map(({ name, description, img }) => (
                            <Card
                                key={name}
                                className="bg-card text-card-foreground flex flex-col gap-6 border overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
                            >
                                <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <Image
                                        src={img}
                                        alt={name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <CardContent className="p-6 pt-4">
                                    <h3 className="text-xl font-semibold mb-3">{name}</h3>
                                    <p className="text-gray-600">{description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Club Categories */}
            <section className="py-16 max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-10 text-center">Explore by Category</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    {clubCategories.map(({ icon, title, description }) => (
                        <Card
                            key={title}
                            className="p-6 text-center shadow-md hover:shadow-lg transition"
                        >
                            <div className="mb-4">{icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-gray-600">{description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-14 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Start Your Club Journey Today</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Interested in joining a club or starting your own? Connect with the Student Affairs Office to get
                    involved.
                </p>
                <a href="/student-life/join-club" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Get Involved
                    </Button>
                </a>
            </section>
        </main>
    );
}
