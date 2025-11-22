"use client";

import React, { ReactNode, useState, useEffect } from "react";
import ProfileHeader from "@/components/leader/ProfileHeader";
import QuickLinks from "@/components/leader/QuickLinks";
import DashboardSkeleton from "@/components/leader/DashboardSkeleton";
import AuthGuard from "@/components/AuthGuard";

interface DashboardLayoutProps {
  user: { fullName: string; role: string; profilePicture?: string } | null;
  loading: boolean;
  children: ReactNode;
}

export default function DashboardLayout({ user, loading, children }: DashboardLayoutProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsNavigating(false);
    }
  }, [loading]);

  const handleLinkClick = () => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 300);
  };

  return (
    <AuthGuard allowedRoles={["LEADER"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
        {/* Main Layout Container */}
        <div className="flex min-h-screen">
          {/* Quick Links Sidebar - Full height on desktop */}
          <div className="hidden lg:block h-screen sticky top-0" onClick={handleLinkClick}>
            <QuickLinks userRole={user?.role} />
          </div>

          {/* Main Content Area - Takes full available space */}
          <div className="flex-1 w-full min-w-0">
            <div className="p-4 lg:p-6 w-full">
              {/* Mobile spacing for hamburger menu */}
              <div className="lg:hidden h-4"></div>
              
              {/* Header Section */}
              <div className="mb-6 lg:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent break-words">
                      Class Leader Portal
                    </h1>
                    <p className="text-gray-600 text-base lg:text-lg mt-1">Leadership command center</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 lg:px-4 py-2 shadow-lg border border-gray-100">
                      <div className="text-xs lg:text-sm text-gray-600">Semester</div>
                      <div className="font-semibold text-gray-900 text-sm lg:text-base">Fall 2024</div>
                    </div>
                  </div>
                </div>
              </div>

              {loading && !isNavigating ? (
                <DashboardSkeleton />
              ) : (
                <div className="space-y-6 lg:space-y-8">
                  {/* Profile Section */}
                  <div className="transform transition-all duration-300">
                    <ProfileHeader user={user} />
                  </div>

                  {/* Main Content Area */}
                  <div className="transform transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-white/20 p-4 lg:p-8 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 break-words">Leadership Overview</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Last updated: Just now
                        </div>
                      </div>
                      <div className="w-full">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Quick Links */}
        <div className="lg:hidden">
          <QuickLinks userRole={user?.role} />
        </div>
      </div>
    </AuthGuard>
  );
}