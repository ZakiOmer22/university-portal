"use client";

import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const programs = [
    { name: "Computer Science", years: 4, icon: <Code />, desc: "Advanced software & systems education" },
    { name: "Business Administration", years: 4, icon: <Briefcase />, desc: "Leadership, marketing & management" },
    { name: "Nursing", years: 4, icon: <Heart />, desc: "Hands-on clinical & healthcare knowledge" },
    { name: "Civil Engineering", years: 5, icon: <GraduationCap />, desc: "Design and infrastructure systems" },
    { name: "Education", years: 4, icon: <Users />, desc: "Teaching methodologies & psychology" },
    { name: "Accounting", years: 4, icon: <Calculator />, desc: "Finance, auditing, and taxation" },
    { name: "Information Technology", years: 4, icon: <Server />, desc: "Networking, security & IT management" },
    { name: "Graphic Design", years: 4, icon: <Paintbrush />, desc: "Visual communication & digital arts" },
    { name: "Environmental Science", years: 4, icon: <Globe />, desc: "Sustainability and ecological studies" },
    { name: "Mechanical Engineering", years: 5, icon: <Cpu />, desc: "Machines, mechanics & design" },
    { name: "Psychology", years: 4, icon: <Users />, desc: "Human behavior and mental processes" },
    { name: "Data Science", years: 4, icon: <BookOpen />, desc: "Big data analysis & AI applications" },
    { name: "Marketing", years: 4, icon: <Briefcase />, desc: "Market research and digital marketing strategies" },
    { name: "Philosophy", years: 4, icon: <UserCheck />, desc: "Critical thinking and ethical reasoning" },
    { name: "Physics", years: 4, icon: <Cpu />, desc: "Fundamental principles of the universe" },
    { name: "Architecture", years: 5, icon: <Home />, desc: "Design and construction of buildings" },
    { name: "Law", years: 4, icon: <BriefcaseBusiness />, desc: "Legal systems and civil rights" },
    { name: "Social Work", years: 4, icon: <Users />, desc: "Community engagement and support systems" },
];

const faqs = [
    {
        question: "How do I apply for a program?",
        answer: "You can apply online via our application portal or visit the admissions office for assistance.",
    },
    {
        question: "What are the tuition fees?",
        answer: "Tuition varies by program. Please check the detailed program brochure or contact admissions.",
    },
    {
        question: "Are there scholarships available?",
        answer: "Yes, we offer merit and need-based scholarships. Visit our scholarships page for eligibility and application info.",
    },
];

const testimonials = [
    {
        name: "Hodan A.",
        text: "Studying CS here changed my life. I landed a Google internship in my third year!",
    },
    {
        name: "Ahmed M.",
        text: "The faculty is top-notch and the industry partnerships opened many doors for me.",
    },
    {
        name: "Fatima S.",
        text: "I loved the hands-on learning environment and support from professors.",
    },
];

const facultyHighlights = [
    {
        name: "Dr. Amina Hassan",
        title: "Professor of Computer Science",
        desc: "Expert in AI and Machine Learning with 15+ years experience.",
    },
    {
        name: "Prof. Omar Ali",
        title: "Head of Business Department",
        desc: "Specializes in entrepreneurship and market analytics.",
    },
    {
        name: "Dr. Leila Yusuf",
        title: "Lead Nursing Instructor",
        desc: "Healthcare professional with extensive clinical experience.",
    },
];

const campusLife = [
    {
        title: "Modern Dormitories",
        img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
        desc: "Safe, comfortable living with 24/7 security.",
    },
    {
        title: "State-of-the-Art Library",
        img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
        desc: "Access to extensive academic resources and study spaces.",
    },
    {
        title: "Sports Facilities",
        img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
        desc: "Gym, fields, and courts for fitness and competitions.",
    },
    {
        title: "Cultural Events",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        desc: "Regular events celebrating diverse cultures and ideas.",
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

const careerServices = [
    "Internship placement assistance",
    "Resume and interview workshops",
    "Career fairs with top companies",
    "Alumni mentorship programs",
];

export default function UndergraduateProgramsPage() {
    const slugify = (text: string) =>
        text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "");

    // Form state for "Get in Touch"
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // For demo, just mark submitted - in real app, handle API call here
        setFormSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
    };

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
                    Explore Our Undergraduate Programs
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg max-w-3xl mx-auto text-indigo-900/90"
                >
                    Discover diverse academic paths designed to empower your future. We offer accredited, dynamic, and industry-aligned undergraduate programs tailored to your ambitions.
                </motion.p>
                <Button
                    className="mt-6 px-10 py-5 text-xl font-extrabold rounded-full shadow-2xl bg-gradient-to-r from-indigo-600 to-indigo-400 text-white hover:scale-105 hover:shadow-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 transition transform duration-300"
                    variant="default"
                >
                    Apply Now
                </Button>
            </section>

            {/* Programs Grid */}
            <section>
                <h2 className="text-4xl font-semibold mb-12 text-center text-indigo-900 tracking-tight">
                    Programs Offered
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {programs.map((prog, i) => (
                        <Link
                            href={`/programs/${slugify(prog.name)}`}
                            key={i}
                            tabIndex={0}
                            aria-label={`View curriculum for ${prog.name}`}
                            className="flex flex-col border rounded-xl p-6 shadow-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer bg-white"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-indigo-100 rounded-full text-indigo-700 text-2xl">{prog.icon}</div>
                                <h3 className="text-xl font-semibold text-indigo-900">{prog.name}</h3>
                            </div>
                            <p className="text-indigo-900/90 mb-6 flex-grow">{prog.desc}</p>
                            <p className="text-indigo-600 font-semibold mb-6">Duration: {prog.years} years</p>
                            <button
                                className="w-full py-3 rounded-lg border border-indigo-400 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
                                type="button"
                            >
                                View Curriculum
                            </button>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-indigo-700 p-12 rounded-3xl shadow-lg text-white">
                <h2 className="text-4xl font-semibold mb-10 text-center tracking-tight">Why Choose Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
                    {[
                        { title: "Accredited Programs", icon: <GraduationCap className="mx-auto mb-3 text-white" /> },
                        { title: "Industry Collaboration", icon: <Users className="mx-auto mb-3 text-white" /> },
                        { title: "Global Opportunities", icon: <Calendar className="mx-auto mb-3 text-white" /> },
                        { title: "Modern Facilities", icon: <BookOpen className="mx-auto mb-3 text-white" /> },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="p-8 bg-indigo-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-default select-text"
                        >
                            {item.icon}
                            <p className="font-semibold text-lg">{item.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Faculty Highlights with horizontal scroll and avatars */}
            <section>
                <h2 className="text-4xl font-semibold mb-10 text-center text-indigo-900 tracking-tight">Faculty Highlights</h2>
                <div className="flex overflow-x-auto space-x-6 px-4 py-6 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
                    {facultyHighlights.map(({ name, title, desc }, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.3 }}
                            className="min-w-[300px] bg-white rounded-xl shadow-lg p-6 flex flex-col items-center select-text"
                        >
                            <img
                                src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${30 + i}.jpg`}
                                alt={name}
                                className="w-24 h-24 rounded-full mb-4 object-cover shadow-md"
                                loading="lazy"
                            />
                            <h3 className="text-xl font-bold text-indigo-900 mb-1">{name}</h3>
                            <p className="text-indigo-700 font-medium mb-2">{title}</p>
                            <p className="text-indigo-900/90 text-center">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Campus Life with images */}
            <section className="bg-indigo-50 p-12 rounded-3xl shadow-md max-w-6xl mx-auto space-y-6 select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-8 text-center tracking-tight">Campus Life</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {campusLife.map(({ title, img, desc }, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row cursor-default"
                        >
                            <img
                                src={img}
                                alt={title}
                                className="w-full md:w-1/2 h-[180px] object-cover"
                                loading="lazy"
                            />
                            <div className="p-6 flex flex-col justify-center">
                                <h3 className="text-2xl font-semibold text-indigo-900 mb-2">{title}</h3>
                                <p className="text-indigo-900/90">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Alumni Network - grid with avatars and info */}
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

            {/* Career Services */}
            <section>
                <h2 className="text-4xl font-semibold mb-8 text-center text-indigo-900 tracking-tight">Career Services</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {careerServices.map((service, i) => (
                        <div
                            key={i}
                            className="p-6 bg-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 select-text"
                        >
                            <BookOpen className="mb-3 text-indigo-700" size={28} />
                            <p className="text-indigo-900 font-semibold">{service}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Admission Requirements with more spacing */}
            <section className="space-y-24 max-w-6xl mx-auto select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-12 tracking-tight text-center">Admission Requirements</h2>
                {[
                    {
                        title: "Academic Performance",
                        img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
                        content: ["Minimum High School GPA: 2.5 / 4.0", "Strong academic records preferred."],
                    },
                    {
                        title: "Language Proficiency",
                        img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
                        content: ["English Proficiency (IELTS 5.5 or equivalent)", "Language tests required for non-native speakers."],
                    },
                    {
                        title: "Identity Verification",
                        img: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=800&q=80",
                        content: ["Valid National ID or Passport", "Proof of citizenship and identity required."],
                    },
                    {
                        title: "Application Documentation",
                        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
                        content: ["Completed Application Form", "Academic Recommendation Letter."],
                    },
                ].map(({ title, img, content }, i) => (
                    <div
                        key={i}
                        className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                        <img
                            src={img}
                            alt={title}
                            className="w-full md:w-1/2 rounded-xl shadow-lg object-cover h-60"
                            loading="lazy"
                        />
                        <div className="md:w-1/2 space-y-6">
                            <h3 className="text-3xl font-semibold text-indigo-900">{title}</h3>
                            <ul className="list-disc list-inside text-indigo-900 text-lg space-y-3">
                                {content.map((line, idx) => (
                                    <li key={idx}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
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

            {/* Testimonials */}
            <section className="max-w-5xl mx-auto bg-indigo-50 p-12 rounded-3xl shadow-md space-y-14 select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-10 text-center tracking-tight">What Our Students Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map(({ name, text }, i) => (
                        <blockquote
                            key={i}
                            className="bg-white rounded-xl p-8 shadow-lg italic text-indigo-900 relative"
                            aria-label={`Testimonial from ${name}`}
                        >
                            <p className="mb-8">“{text}”</p>
                            <footer className="font-bold text-indigo-700 text-right">— {name}</footer>
                        </blockquote>
                    ))}
                </div>
            </section>

            {/* Contact Section with form restored */}
            <section className="max-w-3xl mx-auto bg-indigo-50 rounded-3xl p-12 shadow-md select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 tracking-tight mb-8 text-center">Get in Touch</h2>
                <p className="text-indigo-900/80 text-lg max-w-xl mx-auto mb-8 text-center">
                    Have questions? Reach out to our admissions team via the form below. We're here to help you every step of the way!
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
                        <Users size={40} className="mb-1" />
                        Socials
                    </a>
                </div>
            </section>

            {/* Final CTA */}
            <section className="text-center space-y-6 select-text">
                <h2 className="text-4xl font-semibold text-indigo-900 tracking-tight">Ready to Start Your Journey?</h2>
                <p className="text-indigo-900/90 text-lg max-w-xl mx-auto">
                    Apply online or reach out to our admissions team today to begin shaping your future.
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
