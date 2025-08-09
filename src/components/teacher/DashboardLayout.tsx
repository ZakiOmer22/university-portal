import React, { ReactNode } from "react";
import QuickLinks from "@/components/teacher/QuickLinks";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6 max-w-12xl min-h-screen flex flex-col">
            {/* Title spanning full width on top */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            </header>

            {/* Content: Sidebar + Main */}
            <div
                className="
                    flex flex-col
                    md:flex-row
                    flex-1 gap-8 min-h-0
                "
            >
                {/* Sidebar */}
                <aside
                    className="
                        w-full
                        md:w-72
                        flex flex-col gap-6 min-h-0
                        overflow-auto
                    "
                >
                    <QuickLinks />
                </aside>

                {/* Main content */}
                <main
                    className="
                        flex-1
                        min-h-0
                        overflow-auto
                    "
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
