"use client";

import React, { ReactNode } from "react";
import ProfileHeader from "@/components/leader/ProfileHeader";
import QuickLinks from "@/components/leader/QuickLinks";
import DashboardSkeleton from "@/components/leader/DashboardSkeleton";
import AuthGuard from "@/components/AuthGuard";  // import AuthGuard

interface DashboardLayoutProps {
    user: { fullName: string; role: string; profilePicture?: string } | null;
    loading: boolean;
    children: ReactNode;
}

export default function DashboardLayout({ user, loading, children }: DashboardLayoutProps) {
    return (
        <AuthGuard allowedRoles={["LEADER"]}>
            <div className="min-h-screen bg-gray-50">
                {/* Container */}
                <div className="max-w-7xl mx-auto p-6">
                    
                    {/* Header */}
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Class Leader Dashboard</h1>
                    </header>

                    {loading ? (
                        <DashboardSkeleton />
                    ) : (
                        <>
                            {/* Profile Section */}
                            {/* <section className="mb-6">
                                <ProfileHeader user={user} />
                            </section> */}

                            {/* Quick Links Section */}
                            <section className="mb-8">
                                <QuickLinks userRole={user?.role} />
                            </section>

                            {/* Main Content */}
                            <section>
                                <div className="bg-white shadow-md rounded-lg p-6">
                                    {children}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
