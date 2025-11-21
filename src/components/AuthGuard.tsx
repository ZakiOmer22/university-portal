"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Toaster, toast } from "sonner";

type AuthGuardProps = {
    children: ReactNode;
    allowedRoles?: string[];
    redirectPath?: string;
};

interface UserData {
    fullName?: string;
    email?: string;
    role?: string;
    activated?: boolean;
}

export default function AuthGuard({
    children,
    allowedRoles,
    redirectPath = "/auth/login",
}: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [checkingUser, setCheckingUser] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [user, setUser] = useState<UserData | null>(null);

    // Check if current page is home page
    const isHomePage = pathname === "/";

    useEffect(() => {
        const userJson = localStorage.getItem("user");

        // If no user and not on home page, redirect to login
        if (!userJson && !isHomePage) {
            toast.error("Please login first.");
            router.replace(redirectPath);
            return;
        }

        // If no user but on home page, allow access
        if (!userJson && isHomePage) {
            setCheckingUser(false);
            return;
        }

        try {
            const userData: UserData = JSON.parse(userJson!);
            setUser(userData);

            if (userData.activated === false) {
                toast.error("Account is not activated yet.");
                router.replace("/auth/activation-pending");
                return;
            }

            const normalizedRole = (userData.role || "").toUpperCase();
            setUserRole(normalizedRole);

            // Only check role permissions if not on home page and allowedRoles are specified
            if (!isHomePage && allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(normalizedRole)) {
                setAccessDenied(true);
                toast.error("Access denied. You do not have permission to view this page.");
                return;
            }

            // Only show welcome message if not on home page and we have user data
            if (!isHomePage && userData) {
                const userName = userData.fullName || userData.email || "User";
                toast.success(`Welcome back, ${userName}!`);
            }
        } catch (error) {
            console.error("AuthGuard error:", error);
            if (!isHomePage) {
                toast.error("Failed to load user data. Please login again.");
                router.replace(redirectPath);
                return;
            }
        } finally {
            setCheckingUser(false);
        }
    }, [router, allowedRoles, redirectPath, isHomePage]);

    if (checkingUser) {
        return (
            <>
                <Toaster richColors />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Checking your session...</p>
                    </div>
                </div>
            </>
        );
    }

    // Allow access to home page regardless of authentication
    if (isHomePage) {
        return <>{children}</>;
    }

    if (accessDenied) {
        const dashboardRoutes: Record<string, string> = {
            ADMIN: "/dashboard/admin",
            TEACHER: "/dashboard/teacher",
            STUDENT: "/dashboard/student",
            LEADER: "/dashboard/leader",
            PARENT: "/dashboard/parent",
            EMPLOYEE: "/dashboard/employee",
            FINANCE: "/dashboard/finance",
            REGISTRAR: "/dashboard/registrar",
            EXAMINATION: "/dashboard/examination",
            HR: "/dashboard/hr",
            GRADUATED: "/dashboard/graduated",
        };

        const redirectTo = userRole && dashboardRoutes[userRole] ? dashboardRoutes[userRole] : "/";

        return (
            <>
                <Toaster richColors />
                <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-6 text-center">
                    <div className="max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg 
                                    className="w-12 h-12 text-red-500" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
                                    />
                                </svg>
                            </div>
                            <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                            <p className="text-gray-600 mb-6">
                                Sorry, you don&apos;t have permission to access this page.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.replace(redirectTo)}
                                    className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Go to Your Dashboard
                                </button>
                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return <>{children}</>;
}