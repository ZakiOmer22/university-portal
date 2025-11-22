"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 16000);
        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col items-center justify-center z-[9999]">
            {/* Wave Animation */}
            <div className="relative flex items-center justify-center mb-8">
                {/* Wave circles */}
                <div className="absolute border-4 border-blue-300 rounded-full animate-ping h-20 w-20"></div>
                <div className="absolute border-4 border-blue-400 rounded-full animate-ping h-28 w-28" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute border-4 border-blue-500 rounded-full animate-ping h-36 w-36" style={{animationDelay: '1s'}}></div>
                
                {/* Logo in the center */}
                <div className="relative z-10 bg-white p-4 rounded-full shadow-lg">
                    <Image
                        src="/icon.png"
                        alt="University Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Text with typing animation */}
            <div className="mt-6 text-lg font-semibold text-gray-700 border-r-2 border-blue-500 pr-1 animate-typing">
                Loading University Portal...
            </div>

            {/* Powered by text */}
            <p className="absolute bottom-8 text-sm text-gray-600">
                Powered by <span className="font-semibold text-blue-600">eALIF TEAM</span>
            </p>

            {/* Custom animation styles */}
            <style jsx>{`
                @keyframes typing {
                    from { width: 0; }
                    to { width: 100%; }
                }
                .animate-typing {
                    overflow: hidden;
                    white-space: nowrap;
                    animation: typing 3s steps(40, end) infinite;
                }
            `}</style>
        </div>
    );
}