"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconBooks,
    IconBuildingArch,
    IconApps,
    IconHelpCircle,
    IconCalendarEvent,
    IconId,
    IconArchive,
    IconClock,
    IconPhone,
} from "@tabler/icons-react";

export default function LibraryPage() {
    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative h-[350px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-6 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        University Library
                    </h1>
                    <p className="mt-4 text-lg md:text-xl">
                        Your gateway to knowledge, research, and learning resources.
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Welcome to the Library</h2>
                <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                    Our library offers an extensive collection of books, journals, digital resources,
                    and dedicated spaces designed to support your academic and research needs.
                    Explore, learn, and discover in a collaborative and resource-rich environment.
                </p>
            </section>

            {/* Services Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
                {/* Collections & Resources */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
                            alt="Collections and Resources"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconBooks size={28} className="text-blue-600" />
                            Collections & Resources
                        </h3>
                        <p className="text-gray-600">
                            Access thousands of print books, academic journals, research papers,
                            and multimedia resources across all disciplines.
                        </p>
                    </CardContent>
                </Card>

                {/* Study Spaces */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80"
                            alt="Study Spaces"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconBuildingArch size={28} className="text-green-600" />
                            Study Spaces
                        </h3>
                        <p className="text-gray-600">
                            Quiet study rooms, collaborative zones, and computer labs designed for all learning styles.
                        </p>
                    </CardContent>
                </Card>

                {/* Digital Library & E-books */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                            alt="Digital Library"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconApps size={28} className="text-purple-600" />
                            Digital Library & E-books
                        </h3>
                        <p className="text-gray-600">
                            Explore a vast collection of e-books, online databases, and journals accessible anytime, anywhere.
                        </p>
                    </CardContent>
                </Card>

                {/* Research Assistance */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1581092795363-f8581c3d1bff?auto=format&fit=crop&w=600&q=80"
                            alt="Research Assistance"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconHelpCircle size={28} className="text-teal-600" />
                            Research Assistance
                        </h3>
                        <p className="text-gray-600">
                            Work with librarians and subject experts to find resources, refine your research questions, and cite sources.
                        </p>
                    </CardContent>
                </Card>

                {/* Workshops & Events */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
                            alt="Workshops and Events"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconCalendarEvent size={28} className="text-orange-600" />
                            Workshops & Events
                        </h3>
                        <p className="text-gray-600">
                            Attend training sessions on research tools, citation software, and academic writing hosted regularly.
                        </p>
                    </CardContent>
                </Card>

                {/* Membership & Borrowing */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                            alt="Membership and Borrowing"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconId size={28} className="text-yellow-600" />
                            Membership & Borrowing
                        </h3>
                        <p className="text-gray-600">
                            Learn about library cards, borrowing policies, interlibrary loans, and renewals.
                        </p>
                    </CardContent>
                </Card>

                {/* Special Collections & Archives */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                            alt="Special Collections and Archives"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconArchive size={28} className="text-pink-600" />
                            Special Collections & Archives
                        </h3>
                        <p className="text-gray-600">
                            Explore rare books, manuscripts, university archives, and historical documents.
                        </p>
                    </CardContent>
                </Card>

                {/* Library Hours & Contact Info */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
                            alt="Library Hours"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconClock size={28} className="text-indigo-600" />
                            Library Hours & Contact Info
                        </h3>
                        <p className="text-gray-600">
                            Find out our opening hours, holiday schedules, and how to contact library staff for assistance.
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-indigo-600">
                            <IconPhone size={20} />
                            <span>+1 (555) 123-4567</span>
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-14 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                    Get Your Library Card Today
                </h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Register now to access all our resources, borrow materials, and enjoy exclusive library services.
                </p>
                <a href="/resources/library/register" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Register Now
                    </Button>
                </a>
            </section>
        </main>
    );
}
