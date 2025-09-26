"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/employee/AdminHeader";
import AdminSidebar from "@/components/employee/AdminSidebar";
import { CommandDialog } from "@/components/employee/CommandDialog";
import FooterPoweredBy from "../FooterPoweredBy";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area */}
            <div className={`flex flex-col flex-1 min-h-screen overflow-hidden ${sidebarOpen ? 'blur-sm' : ''}`}>
                {/* Header: sticky at top */}
                <AdminHeader
                    user={user}
                    onSidebarToggle={() => setSidebarOpen((open) => !open)}
                    onOpenCommandDialog={() => setCommandOpen(true)}
                    onSwitchToFrontend={() => (window.location.href = "/")}
                />

                {/* Main scrollable content */}
                <main className="flex-grow overflow-auto p-6">
                    {children}
                </main>

                {/* Footer at bottom */}
                <FooterPoweredBy />
            </div>

            {/* Command dialog modal */}
            <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} />
        </div>
    );
}