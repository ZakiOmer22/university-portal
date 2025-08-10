"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

type AuthGuardProps = {
    children: ReactNode;
    allowedRoles?: string[]; // optional list of roles allowed
    redirectPath?: string; // optional path to redirect unauthorized users
};

export default function AuthGuard({
    children,
    allowedRoles,
    redirectPath = "/auth/login",
}: AuthGuardProps) {
    const router = useRouter();
    const [checkingUser, setCheckingUser] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const userJson = localStorage.getItem("user");

        if (!userJson) {
            toast.error("Please login first.");
            router.replace(redirectPath);
            return;
        }

        try {
            const user = JSON.parse(userJson);

            if (!user.activated && user.activated !== undefined) {
                toast.error("Account is not activated yet.");
                router.replace("/auth/activation-pending");
                return;
            }

            setUserRole(user.role || null);

            if (allowedRoles && !allowedRoles.includes(user.role)) {
                setAccessDenied(true);
                toast.error("Access denied. You do not have permission to view this page.");
                return;
            }

            toast.success(`Welcome back, ${user.fullName || user.email}!`);
        } catch {
            toast.error("Failed to load user data. Please login again.");
            router.replace(redirectPath);
            return;
        } finally {
            setCheckingUser(false);
        }
    }, [router, allowedRoles, redirectPath]);

    if (checkingUser) {
        return (
            <>
                <Toaster richColors />
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-lg text-gray-600">Checking your session...</p>
                </div>
            </>
        );
    }

    if (accessDenied) {
        // Map roles to dashboards:
        const dashboardRoutes: Record<string, string> = {
            admin: "/dashboard/admin",
            teacher: "/dashboard/teacher",
            student: "/dashboard/student",
            parent: "/dashboard/parent",
            employee: "/dashboard/employee",
        };

        const redirectTo = userRole && dashboardRoutes[userRole] ? dashboardRoutes[userRole] : "/";

        return (
            <>
                <Toaster richColors />
                <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
                    <div className="max-w-xl">
                        <h1 className="text-9xl font-extrabold text-red-600 select-none mb-8">403</h1>

                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Sorry, you do not have permission to view this page.
                        </p>

                        {/* SVG illustration */}
                        <svg
                            className="mx-auto mb-8 w-64 h-64 text-red-200"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3m0 4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
                            />
                        </svg>

                        <button
                            onClick={() => router.replace(redirectTo)}
                            className="inline-block px-8 py-3 rounded-md bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition"
                        >
                            Go to Your Dashboard
                        </button>
                    </div>
                </main>
            </>
        );
    }

    return <>{children}</>;
}
