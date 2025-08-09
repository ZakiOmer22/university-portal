"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add actual form submission logic (API call, email, etc.)
        setSubmitted(true);
    };

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative h-[320px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-6 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Contact Us
                    </h1>
                    <p className="mt-4 text-lg md:text-xl">
                        We’re here to help. Reach out with any questions or concerns.
                    </p>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                    <p className="text-gray-700 mb-6 max-w-md">
                        University of Hargeisa<br />
                        Jigjiga Road, Hargeisa, Somaliland<br />
                        Phone: +252 63 1234567<br />
                        Email:{" "}
                        <a href="mailto:info@uoh.edu.so" className="text-blue-600 hover:underline">
                            info@uoh.edu.so
                        </a>
                    </p>
                    <h3 className="text-2xl font-semibold mb-3">Office Hours</h3>
                    <p className="text-gray-700 max-w-md">
                        Monday - Friday: 8:00 AM - 5:00 PM<br />
                        Saturday & Sunday: Closed
                    </p>
                </div>

                {/* Contact Form */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>

                    {submitted ? (
                        <div className="p-8 bg-green-100 text-green-800 rounded-lg shadow">
                            Thank you for reaching out! We will get back to you shortly.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
                            <Input
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                            />
                            <Input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                required
                            />
                            <Input
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={(e) => handleChange("subject", e.target.value)}
                                required
                            />
                            <Textarea
                                placeholder="Your Message"
                                rows={5}
                                value={formData.message}
                                onChange={(e) => handleChange("message", e.target.value)}
                                required
                            />
                            <Button type="submit" size="lg" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-14 text-center text-white rounded-b-xl mt-12">
                <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Call our 24/7 support hotline for urgent inquiries.
                </p>
                <a href="tel:+252631234567" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Call Now
                    </Button>
                </a>
            </section>
        </main>
    );
}
