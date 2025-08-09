"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconHeartPause,
    IconStethoscope,
    IconDental,
    IconUserCheck,
} from "@tabler/icons-react";

const healthServices = [
    {
        title: "Primary Care Clinic",
        description:
            "Accessible, high-quality medical services for students including routine checkups, illness treatment, and health screenings.",
        img: "https://images.unsplash.com/photo-1580281657526-9e40e6d1840b?auto=format&fit=crop&w=600&q=80",
        icon: <IconStethoscope size={28} className="text-red-600" />,
    },
    {
        title: "Mental Health Support",
        description:
            "Confidential counseling services, workshops, and resources to support emotional well-being and stress management.",
        img: "https://images.unsplash.com/photo-1554774853-2093f6b1ca0d?auto=format&fit=crop&w=600&q=80",
        icon: <IconDental size={28} className="text-purple-600" />,
    },
    {
        title: "Health Education",
        description:
            "Programs and campaigns focused on nutrition, sexual health, substance abuse prevention, and wellness awareness.",
        img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
        icon: <IconHeartPause size={28} className="text-green-600" />,
    },
    {
        title: "Vaccination & Immunization",
        description:
            "Routine immunizations and seasonal vaccination clinics to keep the campus community safe and healthy.",
        img: "https://images.unsplash.com/photo-1582719478147-59c74ab8a56a?auto=format&fit=crop&w=600&q=80",
        icon: <IconUserCheck size={28} className="text-blue-600" />,
    },
];

export default function HealthPage() {
    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative h-[350px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Health & Wellness
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
                        Supporting your physical, mental, and emotional well-being throughout your university journey.
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Comprehensive Health Services for Students</h2>
                <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                    Our health center provides a wide range of medical, counseling, and educational resources to help you thrive both inside and outside the classroom.
                </p>
            </section>

            {/* Services */}
            <section className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">Our Services</h2>
                    <div className="grid md:grid-cols-4 gap-10">
                        {healthServices.map(({ title, description, img, icon }) => (
                            <Card
                                key={title}
                                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
                            >
                                <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <Image src={img} alt={title} fill className="object-cover" unoptimized />
                                </div>
                                <CardContent className="p-6 pt-4">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        {icon}
                                        {title}
                                    </h3>
                                    <p className="text-gray-600">{description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-red-600 py-14 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Need Support? We're Here For You</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Reach out to the Student Health & Wellness Center for appointments, emergencies, or confidential counseling.
                </p>
                <a href="/student-life/health/contact" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Contact Health Services
                    </Button>
                </a>
            </section>
        </main>
    );
}
