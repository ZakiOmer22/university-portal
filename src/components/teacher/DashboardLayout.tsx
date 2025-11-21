"use client";

import React, { useState, useEffect, useRef } from "react";
import QuickLinks from "@/components/teacher/QuickLinks";
import AuthGuard from "@/components/AuthGuard";
import ProfileHeader from "./ProfileHeader";
import StatsOverview from "./StatsOverview";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <AuthGuard allowedRoles={["teacher"]}>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
                {/* Enhanced Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
                    <div className="flex justify-between items-center p-4">
                        <div className="flex items-center gap-4">
                            {/* Animated Logo */}
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                    <span className="text-white font-bold text-lg">T</span>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 animate-pulse"></div>
                            </div>
                            
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                    Teacher Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online • Ready to teach
                                </p>
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className={`hidden md:flex items-center gap-4 transition-all duration-300 ${isSearchFocused ? 'w-96' : 'w-80'}`}>
                            <div className={`relative flex-1 transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                                <input
                                    type="text"
                                    placeholder="Search students, courses, assignments..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100/80 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </div>
                            </div>
                        </div>

                    </div>
                </header>

                <div className="flex flex-1">
                    {/* Enhanced Sidebar for desktop */}
                    <aside className="hidden md:flex flex-col w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 shadow-xl">
                        <div className="p-6 border-b border-gray-200/60">
                            <h2 className="text-lg font-semibold text-gray-900 bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Navigation Menu
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <QuickLinks />
                        </div>
                        
                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-gray-200/60 bg-gradient-to-t from-gray-50/50 to-white/30">
                            <div className="text-center">
                                <div className="text-xs text-gray-500 mb-2">Teaching Session</div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Active: 3h 24m</span>
                                    <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-xs">
                                        End Day
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main content area */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Stats Overview */}
                        <div className="px-6 pt-6">
                            <StatsOverview />
                        </div>

                        {/* Main content */}
                        <main className={`flex-1 min-h-0 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'blur-sm scale-95' : ''}`}>
                            <div className="p-6">
                                {children}
                            </div>
                        </main>
                    </div>

                    {/* Enhanced Mobile Sidebar */}
                    {isSidebarOpen && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex z-50 md:hidden animate-in fade-in duration-300">
                            <aside
                                ref={sidebarRef}
                                className="flex flex-col w-80 bg-white/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-left duration-300"
                            >
                                {/* Mobile Sidebar Header */}
                                <div className="flex justify-between items-center p-6 border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/80">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold">T</span>
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                                    </div>
                                    <button
                                        onClick={toggleSidebar}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg focus:outline-none transition-all duration-200 hover:scale-110"
                                        aria-label="Close sidebar"
                                    >
                                        ✖
                                    </button>
                                </div>
                                
                                {/* QuickLinks in Mobile */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <QuickLinks />
                                </div>
                                
                                {/* Mobile Sidebar Footer */}
                                <div className="p-4 border-t border-gray-200/60 bg-gradient-to-t from-gray-50/50 to-white/30">
                                    <div className="text-center text-sm text-gray-600">
                                        Swipe to close →
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </AuthGuard>
    );
}