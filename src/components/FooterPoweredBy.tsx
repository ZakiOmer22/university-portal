"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FooterPoweredBy() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <footer className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 select-none max-w-7xl mx-auto">
                {/* Left Section - Brand */}
                <div 
                    className="flex items-center gap-3 group cursor-pointer transition-all duration-500"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Animated Logo Container */}
                    <div className={`relative transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100'}`}>
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-indigo-500 rounded-full blur-md transition-all duration-500 ${isHovered ? 'opacity-50' : 'opacity-0'}`}></div>
                        
                        {/* Logo */}
                        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg border border-white/10">
                            <Image 
                                src="/favicon.ico" 
                                alt="Ealfi Team Logo" 
                                width={28} 
                                height={28} 
                                className={`transition-all duration-500 ${isHovered ? 'brightness-125' : 'brightness-100'}`}
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col">
                        <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Powered by eALIF Team
                        </span>
                        <span className="text-xs text-gray-400 font-medium transition-all duration-500 group-hover:text-indigo-300">
                            Innovation & Excellence
                        </span>
                    </div>
                </div>

                {/* Right Section - Links & Info */}
                <div className="flex items-center gap-6 text-sm">
                    {/* Quick Links */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link 
                            href="/about" 
                            className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 font-medium"
                        >
                            About Us
                        </Link>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <Link 
                            href="/contact" 
                            className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 font-medium"
                        >
                            Contact
                        </Link>
                        <div className="w-px h-4 bg-gray-600"></div>
                        <Link 
                            href="/privacy" 
                            className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 font-medium"
                        >
                            Privacy
                        </Link>
                    </div>

                    {/* Version Info */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400 font-mono">v2.1.0</span>
                    </div>
                </div>
            </div>

            {/* Bottom Border Animation */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            </div>

            {/* Style for shimmer animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }
            `}</style>
        </footer>
    );
}