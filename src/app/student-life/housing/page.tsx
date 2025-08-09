"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconIroning, IconHomeHeart } from "@tabler/icons-react";

const housingOptions = [
    {
        title: "On-Campus Dormitories",
        description:
            "Modern, secure, and comfortable dorms located at the heart of campus with easy access to all facilities. Single and shared rooms available with 24/7 security and high-speed internet.",
        img: "https://images.unsplash.com/photo-1560185127-0862a82e692b?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Off-Campus Apartments",
        description:
            "Fully furnished apartments within walking distance of campus. Ideal for students seeking more independence and privacy while staying close to university resources.",
        img: "https://images.unsplash.com/photo-1501183638714-5e0c67d58f3d?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Family Housing",
        description:
            "Designed for students with families, featuring spacious units with additional amenities and child-friendly environments.",
        img: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
    },
];

const diningOptions = [
    {
        title: "Campus Cafeterias",
        description:
            "Multiple cafeterias across campus offering a variety of healthy, affordable meals, including vegetarian, vegan, and halal options.",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Food Courts & Coffee Shops",
        description:
            "Popular spots for socializing and quick bites with a wide selection of cuisines and specialty drinks.",
        img: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Meal Plans",
        description:
            "Flexible meal plans tailored to your needs, making it easy to budget and enjoy campus dining without hassle.",
        img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    },
];

export default function HousingPage() {
    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative h-[350px] flex items-center justify-center text-white"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60" />
                <div className="relative text-center z-10 px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Housing & Dining
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl">
                        Comfortable living and delicious dining options to make your campus life enjoyable.
                    </p>
                </div>
            </section>

            {/* Introduction */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Find Your Home Away From Home</h2>
                <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
                    We offer a variety of housing options tailored to your lifestyle, plus diverse dining choices that cater to every palate. Whether you prefer on-campus convenience or off-campus independence, we have something for you.
                </p>
            </section>

            {/* Housing Options */}
            <section className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">Housing Options</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {housingOptions.map(({ title, description, img }) => (
                            <Card
                                key={title}
                                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
                            >
                                <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <Image src={img} alt={title} fill className="object-cover" unoptimized />
                                </div>
                                <CardContent className="p-6 pt-4">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <IconHomeHeart size={24} className="text-indigo-600" />
                                        {title}
                                    </h3>
                                    <p className="text-gray-600">{description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dining Options */}
            <section className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-12 text-center">Dining Options</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {diningOptions.map(({ title, description, img }) => (
                            <Card
                                key={title}
                                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
                            >
                                <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <Image src={img} alt={title} fill className="object-cover" unoptimized />
                                </div>
                                <CardContent className="p-6 pt-4">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        <IconIroning size={24} className="text-indigo-600" />
                                        {title}
                                    </h3>
                                    <p className="text-gray-600">{description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-indigo-600 py-14 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Make Yourself at Home?</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Contact our Housing Office to learn more about availability, pricing, and meal plans tailored just for you.
                </p>
                <a href="/student-life/housing/contact" className="inline-block">
                    <Button
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
                        type="button"
                    >
                        Contact Housing Office
                    </Button>
                </a>
            </section>
        </main>
    );
}
