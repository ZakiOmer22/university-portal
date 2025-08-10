"use client";

import React, { useState, useEffect, useRef } from "react";
import QuickLinks from "@/components/teacher/QuickLinks";
import AuthGuard from "@/components/AuthGuard"; // <-- import the guard

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            <div className="flex flex-col min-h-screen">
                <header className="flex justify-between items-center p-4 bg-white shadow">
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 text-gray-600 focus:outline-none"
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? "✖" : "☰"}
                    </button>
                </header>

                <div className="flex flex-1">
                    {/* Sidebar for desktop */}
                    <aside
                        className={`hidden md:flex flex-col gap-6 min-h-0 overflow-auto w-72 bg-white border-r border-gray-200 p-4`}
                    >
                        <QuickLinks />
                    </aside>

                    {/* Main content */}
                    <main className={`flex-1 min-h-0 overflow-auto p-4 ${isSidebarOpen ? "blur-sm" : ""}`}>
                        {children}
                    </main>

                    {/* Sidebar for mobile */}
                    {isSidebarOpen && (
                        <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-lg flex justify-end z-50">
                            <aside
                                ref={sidebarRef}
                                className="flex flex-col gap-6 min-h-0 overflow-auto w-64 bg-white border-l border-gray-200 p-4 rounded-lg shadow-lg"
                            >
                                <QuickLinks />
                                <button
                                    onClick={toggleSidebar}
                                    className="self-end p-2 text-gray-600 focus:outline-none"
                                    aria-label="Close sidebar"
                                >
                                    ✖
                                </button>
                            </aside>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
