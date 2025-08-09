"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconBriefcase,
    IconUsers,
    IconCalendarEvent,
    IconFileText,
    IconMessageCircle,
    IconNetwork,
    IconPuzzle,
    IconWand,
    IconSchool,
    IconApps,
} from "@tabler/icons-react";

export default function CareerServicesPage() {
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
                <div className="relative text-center z-10 px-6 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Career Services
                    </h1>
                    <p className="mt-4 text-lg md:text-xl">
                        Empowering your professional journey with expert advice, opportunities, and connections.
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Your Career Growth Starts Here</h2>
                <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                    From personalized counseling to real-world job experiences, our Career Services office is your partner for success beyond graduation.
                </p>
            </section>

            {/* Three Core Sections */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
                {/* Career Counseling & Advising */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1551836022-429d16e654ad?auto=format&fit=crop&w=600&q=80"
                            alt="Career Counseling"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconUsers size={28} className="text-blue-600" />
                            Career Counseling & Advising
                        </h3>
                        <p className="text-gray-600">
                            Receive one-on-one coaching, resume and cover letter reviews, and personalized career planning from expert advisors.
                        </p>
                    </CardContent>
                </Card>

                {/* Internships & Job Placements */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"
                            alt="Internships and Job Placements"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconBriefcase size={28} className="text-green-600" />
                            Internships & Job Placements
                        </h3>
                        <p className="text-gray-600">
                            Connect with local and national employers through our internship programs and job placement services.
                        </p>
                    </CardContent>
                </Card>

                {/* Workshops & Events */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80"
                            alt="Workshops and Events"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconCalendarEvent size={28} className="text-purple-600" />
                            Workshops & Events
                        </h3>
                        <p className="text-gray-600">
                            Attend career fairs, networking events, and skill-building workshops designed to prepare you for the workforce.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Additional Sections */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
                {/* Resume & Cover Letter Help */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
                            alt="Resume Help"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconFileText size={28} className="text-teal-600" />
                            Resume & Cover Letter Help
                        </h3>
                        <p className="text-gray-600">
                            Get expert feedback and tips on crafting effective resumes and cover letters that stand out to employers.
                        </p>
                    </CardContent>
                </Card>

                {/* Interview Preparation */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80"
                            alt="Interview Preparation"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconMessageCircle size={28} className="text-orange-600" />
                            Interview Preparation
                        </h3>
                        <p className="text-gray-600">
                            Practice interviews, communication skills workshops, and tips to confidently ace your next interview.
                        </p>
                    </CardContent>
                </Card>

                {/* Alumni Networking */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=600&q=80"
                            alt="Alumni Networking"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconNetwork size={28} className="text-indigo-600" />
                            Alumni Networking
                        </h3>
                        <p className="text-gray-600">
                            Connect with graduates who can offer mentorship, job leads, and career advice.
                        </p>
                    </CardContent>
                </Card>

                {/* Career Assessments & Personality Tests */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=600&q=80"
                            alt="Career Assessments"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconPuzzle size={28} className="text-fuchsia-600" />
                            Career Assessments & Personality Tests
                        </h3>
                        <p className="text-gray-600">
                            Discover your strengths and ideal career paths through comprehensive assessments.
                        </p>
                    </CardContent>
                </Card>

                {/* Employer Relations */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
                            alt="Employer Relations"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconWand size={28} className="text-red-600" />
                            Employer Relations
                        </h3>
                        <p className="text-gray-600">
                            Building strong partnerships with employers to create internship and job opportunities for students.
                        </p>
                    </CardContent>
                </Card>

                {/* Graduate School Advising */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
                            alt="Graduate School Advising"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconSchool size={28} className="text-yellow-600" />
                            Graduate School Advising
                        </h3>
                        <p className="text-gray-600">
                            Guidance on selecting and applying to graduate programs that align with your career goals.
                        </p>
                    </CardContent>
                </Card>

                {/* Online Career Resources */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <div className="relative h-48 rounded-t-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
                            alt="Online Career Resources"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardContent className="p-6 pt-4">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconApps size={28} className="text-cyan-600" />
                            Online Career Resources
                        </h3>
                        <p className="text-gray-600">
                            Access job boards, career planning tools, and e-learning materials anytime, anywhere.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Call to Action */}
            <section className="bg-indigo-700 py-14 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Career?</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Schedule an appointment or explore current opportunities with our Career Services office today.
                </p>
                <a href="/student-life/careers/contact" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Get Started
                    </Button>
                </a>
            </section>
        </main>
    );
}
