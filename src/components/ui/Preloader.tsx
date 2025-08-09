"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 6000);
        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
            {/* Spinner wrapper */}
            <div className="relative flex items-center justify-center">
                {/* Bigger spinner */}
                <div className="animate-spin rounded-full h-28 w-28 border-t-4 border-blue-500 border-solid"></div>

                {/* Logo in the center */}
                <div className="absolute">
                    <Image
                        src="/logo.png" // 🔹 Replace with your actual logo path in public/
                        alt="University Logo"
                        width={60}
                        height={60}
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Text */}
            <p className="mt-6 text-lg font-semibold text-gray-700">
                Loading University Portal...
            </p>
        </div>
    );
}
