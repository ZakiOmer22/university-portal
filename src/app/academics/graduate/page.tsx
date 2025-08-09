"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    BookOpen,
    Calendar,
    Users,
    Code,
    Server,
    Cpu,
    Briefcase,
    Heart,
    Globe,
    Calculator,
    Paintbrush,
    UserCheck,
    Home,
    BriefcaseBusiness,
    Phone,
    Mail,
    MapPin,
    Users as UsersIcon,
} from "lucide-react";
import { motion } from "framer-motion";

type ButtonVariant = "default" | "link" | "outline" | "destructive" | "secondary" | "ghost" | "solid";
const graduatePrograms = [
    { name: "Masters in Computer Science", years: 2, icon: <Code />, desc: "Deep dive into AI, ML, and advanced computing" },
    { name: "MBA", years: 2, icon: <Briefcase />, desc: "Strategic management and global business insights" },
    { name: "Masters in Public Health", years: 2, icon: <Heart />, desc: "Advanced healthcare systems and epidemiology" },
    { name: "Masters in Civil Engineering", years: 2, icon: <GraduationCap />, desc: "Infrastructure development and sustainability" },
    { name: "PhD in Psychology", years: 4, icon: <Users />, desc: "Research on human behavior and cognition" },
    { name: "Masters in Data Science", years: 2, icon: <BookOpen />, desc: "Big data analytics and AI-driven decision making" },
];

const graduateFaculty = [
    {
        name: "Dr. Samir Abdi",
        title: "Chair, Computer Science Dept.",
        desc: "Specialist in deep learning and computer vision.",
    },
    {
        name: "Prof. Zainab Farah",
        title: "Director, Business School",
        desc: "Expert in international trade and economics.",
    },
    {
        name: "Dr. Idris Yusuf",
        title: "Senior Researcher, Public Health",
        desc: "Focus on global health policy and infectious diseases.",
    },
];

const researchCenters = [
    {
        title: "AI & Machine Learning Lab",
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        desc: "Leading innovations in artificial intelligence and machine learning research.",
    },
    {
        title: "Sustainable Engineering Center",
        img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
        desc: "Developing eco-friendly infrastructure and sustainable building technologies.",
    },
    {
        title: "Global Health Institute",
        img: "https://images.unsplash.com/photo-1505842465776-3f4a8e1f9c9e?auto=format&fit=crop&w=800&q=80",
        desc: "Advancing public health policies and interventions worldwide.",
    },
];

const alumniNetwork = [
    {
        name: "John Doe",
        title: "Software Engineer at Google",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Sarah Lee",
        title: "Marketing Manager at Nike",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Michael Chen",
        title: "Research Scientist at MIT",
        img: "https://randomuser.me/api/portraits/men/85.jpg",
    },
    {
        name: "Emily Clark",
        title: "Civil Engineer at Bechtel",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
];

const admissionRequirements = [
    {
        img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
        rules: [
            "Bachelor's degree from an accredited institution.",
            "Minimum undergraduate GPA: 3.0 / 4.0.",
            "Official transcripts from all previously attended institutions.",
        ],
    },
    {
        img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=400&q=80",
        rules: [
            "Two or more letters of recommendation from academic or professional references.",
            "Statement of Purpose outlining your research interests and career goals.",
            "Relevant work or research experience strongly recommended.",
            "GRE scores (if applicable by program).",
        ],
    },
    {
        img: "https://images.unsplash.com/photo-1522205408450-add114ad53fe?auto=format&fit=crop&w=400&q=80",
        rules: [
            "English proficiency test scores for non-native speakers (IELTS 6.5 or TOEFL 90+).",
            "Resume or CV detailing education, work, and research experience.",
            "Application fee payment.",
            "Interview may be required for some programs.",
        ],
    },
];

const faqs = [
    {
        question: "What is the application deadline for graduate programs?",
        answer: "Fall applications are due by July 1, and spring applications by November 1 annually.",
    },
    {
        question: "Are assistantships available?",
        answer: "Yes, many programs offer teaching and research assistantships with tuition waivers and stipends.",
    },
    {
        question: "Can international students apply?",
        answer: "Absolutely, we welcome international applicants and provide support for visas and relocation.",
    },
];

const testimonials = [
    {
        name: "Sami A.",
        text: "Graduate studies here expanded my skills and network tremendously.",
    },
    {
        name: "Zainab F.",
        text: "The research labs are world-class and faculty are highly supportive.",
    },
    {
        name: "Idris Y.",
        text: "Collaborative environment fostered innovative health research.",
    },
    {
        name: "Ayaan M.",
        text: "The mentorship I received was crucial in launching my career.",
    },
    {
        name: "Fatima A.",
        text: "Flexible course options allowed me to balance work and study.",
    },
    {
        name: "Mohamed K.",
        text: "The university's connections helped me secure a great job.",
    },
    {
        name: "Leila H.",
        text: "I appreciated the research funding and facilities.",
    },
    {
        name: "Abdi S.",
        text: "Faculty were approachable and invested in student success.",
    },
    {
        name: "Nura D.",
        text: "The interdisciplinary approach broadened my perspective.",
    },
    {
        name: "Hassan J.",
        text: "Excellent preparation for doctoral studies and beyond.",
    },
];

const graduateScholarships = [
    {
        title: "Merit-Based Scholarships",
        desc: "Awarded to outstanding students based on academic excellence and research achievements.",
    },
    {
        title: "Need-Based Grants",
        desc: "Financial support provided to students demonstrating economic need.",
    },
    {
        title: "Research Assistantships",
        desc: "Positions offering tuition waivers and stipends while assisting faculty research.",
    },
];

const upcomingEvents = [
    {
        title: "Graduate Research Symposium",
        date: "Sep 15, 2025",
        desc: "Showcase your research and network with faculty and industry leaders.",
    },
    {
        title: "Application Deadline Info Session",
        date: "Oct 1, 2025",
        desc: "Live Q&A to guide prospective students through the application process.",
    },
    {
        title: "Career Development Workshop",
        date: "Nov 10, 2025",
        desc: "Enhance your job search skills and interview techniques.",
    },
];

export default function GraduateProgramsPage() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [formSubmitted, setFormSubmitted] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormSubmitted(true);
    }

    return (
        <main className="bg-white min-h-screen pt-24 px-6 md:px-20 pb-20 max-w-7xl mx-auto space-y-32 select-text">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-5xl md:text-6xl font-extrabold text-indigo-900 tracking-wide"
                >
                    Explore Our Graduate Programs
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg max-w-3xl mx-auto text-indigo-900/90"
                >
                    Take your academic career to the next level with advanced graduate studies, research, and professional growth.
                </motion.p>
                <Button
                    className="mt-6 px-10 py-5 text-xl font-extrabold rounded-full shadow-2xl bg-gradient-to-r from-indigo-600 to-indigo-400 text-white hover:scale-105 hover:shadow-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 transition transform duration-300"
                    variant="default"
                >
                    Apply Now
                </Button>
            </section>

            {/* Graduate Programs Grid */}
            <section>
                <h2 className="text-4xl font-semibold mb-12 text-center text-indigo-900 tracking-tight">Graduate Programs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {graduatePrograms.map((prog, i) => (
                        <Card
                            key={i}
                            className="flex flex-col hover:shadow-2xl hover:scale-[1.05] transition-transform duration-300 cursor-pointer select-text"
                            tabIndex={0}
                            role="button"
                            aria-label={`View curriculum for ${prog.name}`}
                        >
                            <CardHeader className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 rounded-full text-indigo-700">{prog.icon}</div>
                                <CardTitle className="text-xl">{prog.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-grow">
                                <p className="text-indigo-900/90 mb-4 flex-grow">{prog.desc}</p>
                                <p className="text-indigo-600 font-semibold mb-4">Duration: {prog.years} years</p>
                                <Button
                                    variant="outline"
                                    className="mt-auto w-full hover:bg-indigo-50 text-indigo-700 border-indigo-400 hover:border-indigo-600 transition-colors duration-300"
                                >
                                    View Curriculum
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Faculty Highlights */}
            <section>
                <h2 className="text-4xl font-semibold mb-10 text-center text-indigo-900 tracking-tight">Faculty Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {graduateFaculty.map(({ name, title, desc }, i) => (
                        <Card key={i} className="hover:shadow-xl transition-shadow duration-300 select-text">
                            <CardContent>
                                <h3 className="text-xl font-bold text-indigo-900 mb-2">{name}</h3>
                                <p className="text-indigo-700 font-medium mb-2">{title}</p>
                                <p className="text-indigo-900/90">{desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Research Centers */}
            <section>
                <h2 className="text-4xl font-semibold mb-10 text-center text-indigo-900 tracking-tight">Research Centers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {researchCenters.map(({ title, img, desc }, i) => (
                        <div key={i} className="rounded-xl overflow-hidden shadow-lg select-text">
                            <img src={img} alt={title} className="aspect-video object-cover w-full" />
                            <div className="p-6 bg-white">
                                <h3 className="text-2xl font-bold mb-2 text-indigo-900">{title}</h3>
                                <p className="text-indigo-900/90">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Alumni Network */}
            <section>
                <h2 className="text-4xl font-semibold mb-10 text-center text-indigo-900 tracking-tight">Alumni Network</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {alumniNetwork.map(({ name, title, img }, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center cursor-default select-text hover:shadow-2xl transition-shadow duration-300"
                        >
                            <img
                                src={img}
                                alt={name}
                                className="w-24 h-24 rounded-full mb-4 object-cover"
                                loading="lazy"
                            />
                            <h3 className="text-xl font-bold text-indigo-900 mb-1">{name}</h3>
                            <p className="text-indigo-700 text-center">{title}</p>
                        </div>
                    ))}
                </div>
            </section>
            {/* Admission Requirements */}
            <section>
                <h2 className="text-4xl font-semibold mb-10 text-center text-indigo-900 tracking-tight">Admission Requirements</h2>
                <div className="space-y-16 max-w-6xl mx-auto">
                    {admissionRequirements.map(({ img, rules }, i) => (
                        <div
                            key={i}
                            className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Admission requirement image ${i + 1}`}
                                className="rounded-xl shadow-lg w-full md:w-1/2 aspect-video object-cover"
                            />
                            <ul className="text-indigo-900 text-lg max-w-xl space-y-5 list-disc list-inside leading-relaxed">
                                {rules.map((rule, idx) => (
                                    <li key={idx} className="marker:text-indigo-600">
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Graduate Scholarships */}
            <section className="bg-indigo-50 p-12 rounded-3xl shadow-md max-w-4xl mx-auto space-y-6 select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-6 text-center tracking-tight">Graduate Scholarships</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {graduateScholarships.map(({ title, desc }, i) => (
                        <Card
                            key={i}
                            className="hover:shadow-lg transition-shadow duration-300"
                            tabIndex={0}
                            aria-label={`Scholarship: ${title}`}
                        >
                            <CardContent>
                                <h3 className="text-xl font-bold text-indigo-900 mb-2">{title}</h3>
                                <p className="text-indigo-900/90">{desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Upcoming Events */}
            <section>
                <h2 className="text-4xl font-semibold mb-10 text-center text-indigo-900 tracking-tight">Upcoming Events</h2>
                <div className="max-w-4xl mx-auto space-y-8">
                    {upcomingEvents.map(({ title, date, desc }, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-xl border border-indigo-300 shadow-sm hover:shadow-md transition-shadow duration-300 select-text"
                        >
                            <h3 className="text-2xl font-semibold text-indigo-900 mb-2">{title}</h3>
                            <p className="text-indigo-700 font-medium mb-2">{date}</p>
                            <p className="text-indigo-900/90">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto space-y-8 select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-6 text-center tracking-tight">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map(({ question, answer }, i) => (
                        <details
                            key={i}
                            className="p-5 border border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors duration-300"
                        >
                            <summary className="font-semibold text-indigo-800 text-lg">{question}</summary>
                            <p className="mt-2 text-indigo-900/90">{answer}</p>
                        </details>
                    ))}
                </div>
            </section>
            {/* Contact Section */}
            <section className="bg-indigo-100 rounded-3xl p-12 max-w-3xl mx-auto text-center space-y-8 select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 tracking-tight">Get in Touch</h2>
                <p className="text-indigo-900/80 text-lg max-w-xl mx-auto">
                    Have questions? Reach out to our admissions team via the form below. We&apos;re here to help you every step of the way!
                </p>

                {formSubmitted ? (
                    <p className="text-green-700 font-semibold text-center text-xl">
                        Thank you for contacting us! We will get back to you shortly.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                        <div>
                            <label htmlFor="name" className="block mb-2 font-semibold text-indigo-900">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full rounded-lg border border-indigo-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 font-semibold text-indigo-900">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="w-full rounded-lg border border-indigo-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block mb-2 font-semibold text-indigo-900">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Write your message here..."
                                className="w-full rounded-lg border border-indigo-300 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-full shadow-lg transition transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500"
                        >
                            Send Message
                        </button>
                    </form>
                )}

                {/* Icons/buttons below the form */}
                <div className="mt-12 flex justify-center gap-10 text-indigo-700 select-none">
                    <a
                        href="tel:+1234567890"
                        aria-label="Call Admissions"
                        className="flex flex-col items-center hover:text-indigo-900 transition-colors duration-300"
                    >
                        <Phone size={40} className="mb-1" />
                        Phone
                    </a>

                    <a
                        href="mailto:admissions@university.edu"
                        aria-label="Email Admissions"
                        className="flex flex-col items-center hover:text-indigo-900 transition-colors duration-300"
                    >
                        <Mail size={40} className="mb-1" />
                        Email
                    </a>

                    <a
                        href="https://maps.google.com?q=University+Campus"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Campus Location"
                        className="flex flex-col items-center hover:text-indigo-900 transition-colors duration-300"
                    >
                        <MapPin size={40} className="mb-1" />
                        Location
                    </a>

                    <a
                        href="https://www.university.edu/socials"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Follow us on Social Media"
                        className="flex flex-col items-center hover:text-indigo-900 transition-colors duration-300"
                    >
                        <UsersIcon size={40} className="mb-1" />
                        Socials
                    </a>
                </div>
            </section>

            {/* Final CTA */}
            <section className="text-center space-y-6 select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 tracking-tight">Ready to Take the Next Step?</h2>
                <p className="text-indigo-900/90 text-lg max-w-xl mx-auto">
                    Apply online or contact our admissions team today to start your graduate journey.
                </p>
                <Button
                    className="px-12 py-5 mt-4 text-xl font-extrabold rounded-full shadow-2xl bg-gradient-to-r from-indigo-600 to-indigo-400 text-white hover:scale-105 hover:shadow-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 transition transform duration-300"
                    variant="default"
                >
                    Start Application
                </Button>
            </section>
        </main>
    );
}
