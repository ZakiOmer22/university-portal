"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    IconMapPin,
    IconClock,
    IconUsers,
    IconCamera,
    IconBuilding,
    IconBus,
    IconPhone,
    IconMail
} from "@tabler/icons-react";

export default function CampusVisitPage() {
    const visitActivities = [
        {
            icon: <IconBuilding className="w-6 h-6 text-blue-500" />,
            title: "Guided Campus Tour",
            desc: "Explore classrooms, labs, and student lounges."
        },
        {
            icon: <IconUsers className="w-6 h-6 text-green-500" />,
            title: "Meet Faculty & Students",
            desc: "Get first-hand insights about campus life."
        },
        {
            icon: <IconCamera className="w-6 h-6 text-yellow-500" />,
            title: "Photo Spots",
            desc: "Capture memories at our iconic landmarks."
        },
        {
            icon: <IconBus className="w-6 h-6 text-purple-500" />,
            title: "Transport Assistance",
            desc: "Free shuttle buses from main city points."
        }
    ];

    const testimonials = [
        {
            name: "Fatima Ahmed",
            quote:
                "The campus was beautiful and welcoming — I could really picture myself studying here."
        },
        {
            name: "Omar Hussein",
            quote:
                "Meeting current students gave me a real sense of the friendly and supportive atmosphere."
        }
    ];

    const faqs = [
        {
            q: "Do I need to register for a campus visit?",
            a: "Yes, please book your visit in advance to secure your spot."
        },
        {
            q: "Can I bring family members?",
            a: "Absolutely! We welcome family and friends."
        },
        {
            q: "Is parking available?",
            a: "Yes, visitor parking is free near the main gate."
        }
    ];

    return (
        <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 space-y-16">
            {/* HERO */}
            <section
                className="relative h-64 rounded-xl overflow-hidden flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1580584128403-7e0cdfbb6797?q=80&w=1600&auto=format&fit=crop')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                {/* Softer overlay */}
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative text-center z-10">
                    <h1 className="text-4xl font-bold">Plan Your Campus Visit</h1>
                    <p className="mt-2 text-gray-200 max-w-xl mx-auto">
                        Experience our vibrant campus community and facilities in person.
                    </p>
                </div>
            </section>

            {/* VISIT DETAILS */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Tour Schedule & Booking</h2>
                <Card className="border">
                    <CardHeader>
                        <CardTitle>Upcoming Tours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <IconClock className="text-blue-500 w-5 h-5" />
                                <span>Every Monday, Wednesday, and Friday at 10:00 AM</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <IconClock className="text-blue-500 w-5 h-5" />
                                <span>Special Weekend Tour: Last Saturday of each month</span>
                            </li>
                        </ul>
                        <a
                            href="/admissions/campus-visit/book"
                            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Book Your Visit
                        </a>
                    </CardContent>
                </Card>
            </section>

            {/* WHAT TO EXPECT */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">What to Expect</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {visitActivities.map((a, idx) => (
                        <Card key={idx} className="border hover:shadow-md transition">
                            <CardHeader className="flex items-center gap-4">
                                {a.icon}
                                <CardTitle>{a.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{a.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CAMPUS MAP */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Campus Map</h2>
                <div className="rounded-xl overflow-hidden border shadow">
                    <img
                        src="https://images.unsplash.com/photo-1609931051801-30d6fe6e66d6?q=80&w=1600&auto=format&fit=crop"
                        alt="Campus Map"
                        className="w-full object-cover"
                    />
                </div>
                <p className="text-gray-500 mt-2">
                    A detailed map will be provided upon arrival.
                </p>
            </section>

            {/* TESTIMONIALS */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">What Visitors Say</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {testimonials.map((t, idx) => (
                        <Card key={idx} className="border">
                            <CardContent className="p-6">
                                <p className="italic">"{t.quote}"</p>
                                <p className="mt-4 font-semibold">— {t.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="p-4 border rounded-lg hover:shadow-sm"
                        >
                            <p className="font-semibold">{faq.q}</p>
                            <p className="text-gray-600 mt-1">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTACT */}
            <section className="bg-blue-50 p-6 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-4">Visitor’s Office</h2>
                <p className="mb-2 flex items-center gap-2">
                    <IconMapPin className="w-5 h-5 text-blue-500" /> Main Administration
                    Building, Room 101
                </p>
                <p className="mb-2 flex items-center gap-2">
                    <IconPhone className="w-5 h-5 text-blue-500" /> +252 63 987 6543
                </p>
                <p className="mb-2 flex items-center gap-2">
                    <IconMail className="w-5 h-5 text-blue-500" /> visit@uoh.edu.so
                </p>
            </section>
        </main>
    );
}
