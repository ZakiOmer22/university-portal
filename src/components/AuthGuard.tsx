"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

type AuthGuardProps = {
    children: ReactNode;
    allowedRoles?: string[];
    redirectPath?: string;
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

            const normalizedRole = (user.role || "").toUpperCase();
            setUserRole(normalizedRole);

            if (
                allowedRoles &&
                !allowedRoles.map(r => r.toUpperCase()).includes(normalizedRole)
            ) {
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
                <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
                    <div className="max-w-xl">
                        <h1 className="text-9xl font-extrabold text-red-600 select-none mb-8">403</h1>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Sorry, you do not have permission to view this page.
                        </p>

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
