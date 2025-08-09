"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconAward, IconBook, IconUsers, IconClipboardList, IconFileText, IconHelpCircle, IconCalendarEvent, IconMail } from "@tabler/icons-react";

export default function ScholarshipsPage() {
    const scholarships = [
        {
            title: "Merit-Based Scholarship",
            description: "Awarded to students with outstanding academic achievements.",
            amount: "Up to 100% tuition coverage",
            icon: <IconAward className="w-8 h-8 text-yellow-500" />,
        },
        {
            title: "Need-Based Scholarship",
            description: "For students from low-income families who demonstrate financial need.",
            amount: "Up to 75% tuition coverage",
            icon: <IconUsers className="w-8 h-8 text-green-500" />,
        },
        {
            title: "International Student Grant",
            description: "For exceptional students applying from outside the country.",
            amount: "$2,000 annual grant",
            icon: <IconBook className="w-8 h-8 text-blue-500" />,
        },
    ];

    const requirements = [
        "Completed scholarship application form",
        "Academic transcripts (last 3 years)",
        "Recommendation letter from a teacher",
        "Personal statement or essay",
        "Proof of financial need (if applicable)",
        "Copy of national ID or passport",
    ];

    const deadlines = [
        { date: "March 15", event: "Application Opens" },
        { date: "June 30", event: "Application Deadline" },
        { date: "July 15", event: "Shortlisted Candidates Announced" },
        { date: "August 1", event: "Interviews Begin" },
        { date: "August 20", event: "Winners Announced" },
    ];

    const faqs = [
        { q: "Can I apply for more than one scholarship?", a: "Yes, but you may only be awarded one at a time." },
        { q: "Do scholarships cover living expenses?", a: "Some scholarships include a stipend for accommodation and meals." },
        { q: "When will I be notified if I win?", a: "Decisions are sent via email within 4 weeks after the application deadline." },
    ];

    const successStories = [
        {
            name: "Amina Yusuf",
            program: "Bachelor of Medicine",
            quote: "This scholarship changed my life — it gave me the chance to pursue my dream career without financial stress.",
            img: "/images/students/amina.jpg",
        },
        {
            name: "Mohamed Ali",
            program: "Computer Science",
            quote: "Thanks to the scholarship, I could focus entirely on my studies and graduate top of my class.",
            img: "/images/students/mohamed.jpg",
        },
    ];

    return (
        <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 space-y-16">
            {/* HERO */}
            <section
                className="relative h-64 rounded-xl overflow-hidden flex items-center justify-center text-white"
                style={{ backgroundImage: "url('/images/scholarship-hero.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative text-center z-10 space-y-2">
                    <h1 className="text-4xl font-bold">Scholarships & Grants</h1>
                    <p className="max-w-xl mx-auto text-gray-200">Empowering students to achieve their dreams through financial support.</p>
                </div>
            </section>

            {/* AVAILABLE SCHOLARSHIPS */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Available Scholarships</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {scholarships.map((item, idx) => (
                        <Card key={idx} className="border hover:shadow-lg transition">
                            <CardHeader className="flex items-center gap-4">
                                {item.icon}
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="mt-4 font-semibold text-blue-600">{item.amount}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* REQUIREMENTS */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Application Requirements</h2>
                <ul className="list-disc pl-6 space-y-2 bg-gray-50 p-6 rounded-lg border">
                    {requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                    ))}
                </ul>
            </section>

            {/* DEADLINES TIMELINE */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Important Dates</h2>
                <div className="space-y-4">
                    {deadlines.map((d, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <IconCalendarEvent className="w-6 h-6 text-blue-500" />
                            <p className="font-medium">{d.date} — <span className="text-gray-600">{d.event}</span></p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SUCCESS STORIES */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Success Stories</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {successStories.map((s, idx) => (
                        <Card key={idx}>
                            <img src={s.img} alt={s.name} className="w-full h-48 object-cover rounded-t-lg" />
                            <CardContent>
                                <h3 className="font-semibold text-lg">{s.name}</h3>
                                <p className="text-sm text-gray-500">{s.program}</p>
                                <p className="mt-3 italic">"{s.quote}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section>
                <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="p-4 border rounded-lg hover:shadow-sm">
                            <p className="font-semibold">{faq.q}</p>
                            <p className="text-gray-600 mt-1">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTACT */}
            <section className="bg-blue-50 p-6 rounded-lg border">
                <h2 className="text-2xl font-semibold mb-4">Scholarship Office</h2>
                <p className="mb-2">📍 Main Administration Building, Room 204</p>
                <p className="mb-2">📞 +252 63 123 4567</p>
                <p className="mb-2 flex items-center gap-2"><IconMail className="w-5 h-5 text-blue-500" /> scholarships@uoh.edu.so</p>
            </section>

            {/* CTA */}
            <section className="text-center bg-blue-600 text-white p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Apply for a Scholarship Today</h2>
                <p className="mb-6">Don’t let finances stop your dreams — start your application now.</p>
                <a href="/admissions/apply" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition">Apply Now</a>
            </section>
        </main>
    );
}
