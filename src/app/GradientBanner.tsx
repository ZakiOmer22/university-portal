"use client";

import { X } from "lucide-react";

export default function GradientBanner({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="w-full px-6 py-4 text-center text-white font-bold text-lg md:text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg flex items-center justify-center relative sticky top-0 z-50"
            role="banner"
        >
            <span className="flex-1 select-none">
                🚀 University Portal Launched! Made by Zaki, Powered By eALIF Team
            </span>
            <button
                aria-label="Close banner"
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none"
            >
                <X size={24} />
            </button>
        </div>
    );
}
