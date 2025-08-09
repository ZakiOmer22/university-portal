"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Laptop,
    Video,
    Clock,
    Users,
    CheckCircle,
    BookOpen,
    Mail,
    Phone,
} from "lucide-react";
import { motion } from "framer-motion";

const courses = [
    {
        title: "Full-Stack Web Development",
        duration: "12 weeks",
        icon: Laptop,
        desc: "Learn frontend & backend technologies with hands-on projects.",
    },
    {
        title: "Data Science & Analytics",
        duration: "10 weeks",
        icon: BookOpen,
        desc: "Master data analysis, visualization, and machine learning.",
    },
    {
        title: "Cybersecurity Fundamentals",
        duration: "8 weeks",
        icon: Users,
        desc: "Understand key security concepts and hands-on threat defense.",
    },
    {
        title: "UI/UX Design",
        duration: "6 weeks",
        icon: Video,
        desc: "Design beautiful, user-friendly interfaces and experiences.",
    },
    {
        title: "Cloud Computing",
        duration: "10 weeks",
        icon: Clock,
        desc: "Get practical skills with AWS, Azure, and cloud services.",
    },
    {
        title: "Mobile App Development",
        duration: "12 weeks",
        icon: Laptop,
        desc: "Build native and cross-platform apps with Flutter and React Native.",
    },
];

const benefits = [
    {
        title: "Learn Anywhere, Anytime",
        desc: "Access your courses 24/7 from any device with internet.",
        icon: Laptop,
    },
    {
        title: "Expert Instructors",
        desc: "Learn from industry professionals with real-world experience.",
        icon: Users,
    },
    {
        title: "Flexible Scheduling",
        desc: "Choose your own pace and balance learning with your life.",
        icon: Clock,
    },
    {
        title: "Certification",
        desc: "Receive certificates to showcase your new skills.",
        icon: CheckCircle,
    },
];

const steps = [
    {
        title: "Browse Courses",
        desc: "Explore our diverse catalog of online courses designed for all skill levels.",
    },
    {
        title: "Enroll Easily",
        desc: "Sign up quickly with our streamlined registration and payment process.",
    },
    {
        title: "Start Learning",
        desc: "Access interactive lessons, videos, quizzes, and projects at your own pace.",
    },
    {
        title: "Get Certified",
        desc: "Complete courses and earn certifications to advance your career.",
    },
];

const testimonials = [
    {
        name: "Amina W.",
        text: "The online learning platform gave me the flexibility to study while working full-time. Highly recommend!",
    },
    {
        name: "Jibril H.",
        text: "The instructors were knowledgeable and supportive, and the projects really helped me build a portfolio.",
    },
    {
        name: "Fatuma S.",
        text: "I earned a certification in cybersecurity and landed a great job thanks to these courses!",
    },
    {
        name: "Mohamed A.",
        text: "User-friendly platform and engaging content — online learning done right.",
    },
    {
        name: "Layla S.",
        text: "The courses are well-structured and easy to follow. The community support is great too.",
    },
    {
        name: "Hassan K.",
        text: "I highly recommend this platform for anyone looking to advance their tech skills remotely.",
    },
];

const faqs = [
    {
        question: "How do I enroll in a course?",
        answer:
            "Browse our course catalog, select your preferred course, and click the 'Enroll Now' button to start the registration process.",
    },
    {
        question: "Are courses self-paced?",
        answer:
            "Yes! Our courses allow you to learn at your own pace with 24/7 access to materials.",
    },
    {
        question: "Do I get a certificate?",
        answer:
            "Absolutely. Upon completion of each course, you will receive a verified certificate.",
    },
    {
        question: "What kind of support is available?",
        answer:
            "Our expert instructors and support team are available to assist you throughout your learning journey.",
    },
];
const partners = [
    {
        name: "Coursera",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Coursera_logo.svg",
    },
    {
        name: "edX",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/EdX_logo.svg",
    },
    {
        name: "Udemy",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Udemy_logo.svg",
    },
    {
        name: "LinkedIn Learning",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/LinkedIn_Learning_logo.svg",
    },
];


export default function OnlineLearningPage() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 1500));
            setSuccess(true);
            setFormData({ name: "", email: "", message: "" });
        } catch {
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 px-6 md:px-16 lg:px-24 pt-24 pb-20 w-full max-w-full select-text space-y-32">
            {/* Hero Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 w-full max-w-full">
                <div className="space-y-6 max-w-3xl">
                    <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 leading-tight">
                        Learn Online at Your Own Pace
                    </h1>
                    <p className="text-indigo-900/90 text-lg leading-relaxed">
                        Our online learning platform offers flexible, expert-led courses to boost your skills anytime, anywhere.
                    </p>
                    <Button
                        variant="default"
                        className="bg-gradient-to-r from-indigo-600 to-indigo-400 px-12 py-4 rounded-full text-white font-extrabold hover:scale-105 transition-transform duration-300 shadow-lg"
                    >
                        Get Started
                    </Button>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                    alt="Online learning"
                    className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
                />
            </section>

            {/* Courses Grid (No Scroll) */}
            <section className="w-full">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-8 text-left max-w-full">
                    Featured Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {courses.map(({ title, duration, icon: Icon, desc }, i) => (
                        <motion.div
                            key={i}
                            className="bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300 flex flex-col p-6"
                            whileHover={{ scale: 1.05 }}
                            tabIndex={0}
                            role="button"
                            aria-label={`Enroll in ${title} course`}
                        >
                            <div className="mb-4 flex items-center justify-center text-indigo-600">
                                <Icon size={36} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-indigo-900">{title}</h3>
                            <p className="text-indigo-700 flex-grow">{desc}</p>
                            <p className="text-indigo-600 font-semibold mt-4">Duration: {duration}</p>
                            <Button
                                variant="outline"
                                className="mt-6 w-full border-indigo-400 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-600 transition"
                            >
                                Enroll Now
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Benefits Timeline */}
            <section className="max-w-4xl mx-auto space-y-20">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-12 text-center">
                    Why Choose Online Learning?
                </h2>
                <div className="relative before:absolute before:top-10 before:bottom-10 before:left-8 before:w-1 before:bg-indigo-300 mx-10">
                    {benefits.map(({ title, desc, icon: Icon }, i) => (
                        <div key={i} className="flex items-start gap-6 relative mb-14 last:mb-0">
                            <div className="flex-shrink-0 bg-indigo-600 text-white rounded-full p-4 shadow-lg z-10 flex items-center justify-center">
                                <Icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-indigo-900 font-semibold text-xl mb-2">{title}</h3>
                                <p className="text-indigo-700 max-w-xl">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works Steps */}
            <section className="max-w-6xl mx-auto space-y-12 px-6">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-8 text-center">
                    How It Works
                </h2>
                <div className="flex flex-wrap justify-center items-start gap-10 max-w-full px-6">
                    {steps.map(({ title, desc }, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center text-center min-w-[200px] max-w-xs relative bg-white rounded-lg shadow-md p-6"
                        >
                            <div className="flex items-center justify-center rounded-full w-14 h-14 bg-indigo-600 text-white font-bold text-xl mb-4">
                                {i + 1}
                            </div>
                            <h3 className="text-indigo-900 font-semibold mb-2">{title}</h3>
                            <p className="text-indigo-700">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="max-w-6xl mx-auto px-6">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-12 text-center">
                    What Our Learners Say
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
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

            {/* FAQ Section */}
            <section className="max-w-5xl mx-auto px-6 space-y-8">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-6 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    {faqs.map(({ question, answer }, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-indigo-900 font-semibold mb-2">{question}</h3>
                            <p className="text-indigo-700">{answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Partners / Accreditation Section */}
            <section className="max-w-5xl mx-auto px-6 space-y-8">
                <h2 className="text-4xl font-semibold text-indigo-900 mb-6 text-center">
                    Our Trusted Partners
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-12">
                    {partners.map(({ name, logo }, i) => (
                        <div key={i} className="flex flex-col items-center space-y-2 max-w-[140px]">
                            <img
                                src={logo}
                                alt={name}
                                className="h-16 object-contain"
                                loading="lazy"
                                decoding="async"
                            />
                            <span className="text-indigo-700 font-medium">{name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="max-w-6xl mx-auto bg-indigo-700 rounded-3xl shadow-lg p-12 grid grid-cols-1 md:grid-cols-2 gap-10 text-white">
                <div>
                    <h2 className="text-4xl font-semibold mb-6">Get in Touch</h2>
                    <p className="text-indigo-100/90 mb-8 max-w-lg">
                        Have questions about our online courses? Send us a message or reach out via email or phone.
                    </p>

                    <div className="flex flex-col space-y-6 max-w-md">
                        <div className="flex items-center gap-4 text-indigo-200 hover:text-white transition cursor-pointer select-text">
                            <Mail size={28} />
                            <a href="mailto:online@university.edu" className="underline">
                                online@university.edu
                            </a>
                        </div>
                        <div className="flex items-center gap-4 text-indigo-200 hover:text-white transition cursor-pointer select-text">
                            <Phone size={28} />
                            <a href="tel:+1234567890" className="underline">
                                +1 234 567 890
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 text-indigo-900 bg-white rounded-xl p-8 shadow-lg"
                >
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="font-semibold">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="font-semibold">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="message" className="font-semibold">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            placeholder="Write your message here"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="p-3 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 font-semibold bg-indigo-600 hover:bg-indigo-700 transition rounded-lg shadow-md"
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                    {success && (
                        <p className="text-center text-green-600 font-semibold mt-3">
                            Thank you! Your message has been sent.
                        </p>
                    )}
                </form>
            </section>

            {/* Final CTA Banner */}
            <section className="bg-indigo-600 text-white rounded-xl shadow-lg py-16 px-8 text-center max-w-5xl mx-auto">
                <h2 className="text-4xl font-extrabold mb-4">Ready to Upgrade Your Skills?</h2>
                <p className="text-lg max-w-2xl mx-auto mb-8">
                    Join thousands of learners who are growing their careers with our online courses.
                </p>
                <Button
                    variant="default"
                    className="bg-gradient-to-r from-indigo-400 to-indigo-600 px-16 py-5 rounded-full font-extrabold text-white shadow-xl hover:scale-105 transition-transform duration-300"
                >
                    Browse Courses
                </Button>
            </section>
        </main>
    );
}
