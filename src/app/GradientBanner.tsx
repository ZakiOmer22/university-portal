"use client";

import { X, Rocket, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function GradientBanner({ onClose }: { onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        
        // Auto progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 0.5;
            });
        }, 50);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`w-full px-4 py-4 md:px-8 md:py-5 text-white font-bold text-sm md:text-base relative overflow-hidden transition-all duration-500 ease-out ${
                isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : '-translate-y-full opacity-0'
            }`}
            role="banner"
            aria-live="polite"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glass Morphism Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90 backdrop-blur-md border-b border-white/10"></div>
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px] animate-grid-move"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
                {/* Left Side - Icon and Badge */}
                <div className="flex items-center gap-3">
                    <div className={`relative transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                        <div className="absolute inset-0 bg-white/20 rounded-xl blur-md"></div>
                        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2">
                            <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
                    </div>
                    
                    {/* Live Badge */}
                    <div className="flex items-center gap-1 bg-green-500/20 border border-green-400/30 rounded-full px-2 py-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-green-200">LIVE</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center gap-3 md:gap-4 select-none px-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent font-extrabold tracking-wide">
                                University Portal
                            </span>
                            <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                            <span className="text-white/90 font-semibold">Now Live</span>
                        </div>
                        <div className="text-xs md:text-sm text-white/70 font-medium mt-1">
                            Developed by <span className="text-amber-300 font-semibold">Zaki</span> • Powered by <span className="text-cyan-300 font-semibold">eALIF Team</span>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    aria-label="Close announcement banner"
                    onClick={handleClose}
                    className="flex-shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 group"
                >
                    <X 
                        size={18} 
                        className="text-white transition-transform duration-300 group-hover:rotate-90" 
                    />
                </button>
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10">
                <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes grid-move {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(32px, 32px);
                    }
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0;
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                        opacity: 1;
                    }
                    80% {
                        opacity: 0;
                    }
                }
                .animate-grid-move {
                    animation: grid-move 20s linear infinite;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}