"use client";

import { Button } from "@/components/ui/button";

export default function CampusMapPage() {
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
                        Campus Map & Directions
                    </h1>
                    <p className="mt-4 text-lg md:text-xl">
                        Navigate our beautiful campus easily with our interactive map.
                    </p>
                </div>
            </section>

            {/* Map Embed Section */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-8 text-center">
                    Explore the Campus
                </h2>
                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                    {/* Replace iframe src with actual map URL */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.123456789!2d45.123456!3d9.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNQ!5e0!3m2!1sen!2som!4v1234567890"
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        title="University of Hargeisa Campus Map"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>

            {/* Location Info Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
                <div>
                    <h3 className="text-2xl font-semibold mb-4">Campus Address</h3>
                    <p className="text-gray-700 leading-relaxed max-w-lg">
                        University of Hargeisa<br />
                        Jigjiga Road, Hargeisa, Somaliland<br />
                        P.O. Box 1234
                    </p>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
                    <p className="text-gray-700 max-w-lg leading-relaxed">
                        Phone: +252 63 1234567<br />
                        Email: <a href="mailto:info@uoh.edu.so" className="text-blue-600 hover:underline">info@uoh.edu.so</a><br />
                        Office Hours: Mon - Fri, 8:00 AM - 5:00 PM
                    </p>
                </div>
            </section>

            {/* Directions Section */}
            <section className="bg-white max-w-7xl mx-auto px-6 py-12 rounded-xl shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-center">How to Get Here</h2>
                <ul className="max-w-4xl mx-auto space-y-4 text-gray-700 list-disc list-inside">
                    <li>
                        <strong>By Car:</strong> Easily accessible via Jigjiga Road with ample parking on campus.
                    </li>
                    <li>
                        <strong>By Public Transport:</strong> Numerous city buses and taxis stop near the main entrance.
                    </li>
                    <li>
                        <strong>On Foot:</strong> Campus is centrally located within Hargeisa, walkable from major landmarks.
                    </li>
                    <li>
                        <strong>Accessibility:</strong> The campus is wheelchair accessible with ramps and elevators.
                    </li>
                </ul>
            </section>

            {/* Call to Action */}
            <section className="bg-blue-600 py-14 text-center text-white mt-12">
                <h2 className="text-3xl font-bold mb-4">Plan Your Visit Today</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Have questions or need special assistance? Contact our campus services office for help.
                </p>
                <a href="/admissions/visit" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Schedule a Campus Visit
                    </Button>
                </a>
            </section>
        </main>
    );
}
