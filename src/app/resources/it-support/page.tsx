"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconDeviceLaptop,
    IconHeadset,
    IconShieldCheck,
    IconTools,
    IconPlugConnected,
    IconPhone,
    IconBug,
    IconUserCheck,
} from "@tabler/icons-react";

export default function ITSupportPage() {
    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative h-[350px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-6 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        IT Support Services
                    </h1>
                    <p className="mt-4 text-lg md:text-xl">
                        Reliable technical support for students, faculty, and staff.
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Welcome to IT Support</h2>
                <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                    Our IT Support team is dedicated to ensuring smooth technology
                    experiences across campus. From troubleshooting hardware issues to
                    securing your accounts, we’re here to help 24/7.
                </p>
            </section>

            {/* Support Services Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
                {/* Hardware Support */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&q=80"
                            alt="Hardware Support"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconDeviceLaptop size={28} className="text-blue-600" />
                            Hardware Support
                        </h3>
                        <p className="text-gray-600">
                            Assistance with laptops, desktops, printers, and campus hardware
                            troubleshooting and repairs.
                        </p>
                    </CardContent>
                </Card>

                {/* Help Desk & Remote Support */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80"
                            alt="Help Desk"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconHeadset size={28} className="text-green-600" />
                            Help Desk & Remote Support
                        </h3>
                        <p className="text-gray-600">
                            Get expert help via phone, chat, or remote desktop assistance for software or network issues.
                        </p>
                    </CardContent>
                </Card>

                {/* Cybersecurity & Account Safety */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                            alt="Cybersecurity"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconShieldCheck size={28} className="text-purple-600" />
                            Cybersecurity & Account Safety
                        </h3>
                        <p className="text-gray-600">
                            Protect your accounts and devices with our security tools, updates,
                            and phishing awareness training.
                        </p>
                    </CardContent>
                </Card>

                {/* Software Installation & Updates */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
                            alt="Software Installation"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconTools size={28} className="text-pink-600" />
                            Software Installation & Updates
                        </h3>
                        <p className="text-gray-600">
                            Support for installing university-licensed software and keeping systems up to date.
                        </p>
                    </CardContent>
                </Card>

                {/* Network Connectivity & VPN */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                            alt="Network Connectivity"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconPlugConnected size={28} className="text-yellow-600" />
                            Network Connectivity & VPN
                        </h3>
                        <p className="text-gray-600">
                            Guidance on connecting to campus Wi-Fi, configuring VPN access, and troubleshooting connectivity.
                        </p>
                    </CardContent>
                </Card>

                {/* IT Policies & User Guides */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                            alt="IT Policies"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconUserCheck size={28} className="text-indigo-600" />
                            IT Policies & User Guides
                        </h3>
                        <p className="text-gray-600">
                            Learn about acceptable use policies, data privacy, and find detailed user manuals.
                        </p>
                    </CardContent>
                </Card>

                {/* Troubleshooting & Bug Reporting */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                            alt="Troubleshooting"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconBug size={28} className="text-red-600" />
                            Troubleshooting & Bug Reporting
                        </h3>
                        <p className="text-gray-600">
                            Report issues, glitches, or bugs in campus systems and get timely assistance.
                        </p>
                    </CardContent>
                </Card>

                {/* Contact IT Support */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl col-span-full">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                            alt="Contact IT Support"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4 text-center">
                        <h3 className="text-2xl font-semibold mb-4 flex justify-center items-center gap-3 text-indigo-700">
                            <IconPhone size={36} /> Contact IT Support
                        </h3>
                        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                            Need immediate help? Reach out via phone, email, or visit our
                            help desk on campus during business hours.
                        </p>
                        <p className="mb-4">
                            <strong>Phone:</strong> +1 (555) 987-6543
                        </p>
                        <p className="mb-4">
                            <strong>Email:</strong> <a href="mailto:itsupport@university.edu" className="text-blue-600 hover:underline">itsupport@university.edu</a>
                        </p>
                        <p>
                            <strong>Help Desk Location:</strong> Main Campus Building, Room 101
                        </p>
                        <p className="mt-2 text-gray-600 italic">
                            Hours: Mon - Fri, 8:00 AM - 6:00 PM
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-14 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                    Need IT Support? We're Here to Help!
                </h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Don’t hesitate to contact our IT Support team for any technical issues or questions.
                </p>
                <a href="/resources/it-support/contact" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Contact Support
                    </Button>
                </a>
            </section>
        </main>
    );
}
