import React, { ReactNode } from "react";
import ProfileHeader from "@/components/student/ProfileHeader";
import QuickLinks from "@/components/student/QuickLinks";
import DashboardSkeleton from "@/components/student/DashboardSkeleton";

interface DashboardLayoutProps {
    user: { fullName: string; role: string; profilePicture?: string } | null;
    loading: boolean;
    children: ReactNode;
}

export default function DashboardLayout({ user, loading, children }: DashboardLayoutProps) {
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>

            {loading ? (
                <DashboardSkeleton />
            ) : (
                <>
                    <ProfileHeader user={user} />

                    <div className="mt-4">
                        <QuickLinks />
                    </div>

                    <div className="mt-8">
                        {children /* This is where the page-specific content goes */}
                    </div>
                </>
            )}
        </div>
    );
}