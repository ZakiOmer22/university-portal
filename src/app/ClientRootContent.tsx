"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/Footer";
import GradientBanner from "./GradientBanner";
import { Toaster } from "@/components/ui/sonner";
import Preloader from "@/components/ui/Preloader";
import AdminLayout from "@/components/admin/DashboardLayout";
import FooterPoweredBy from "@/components/FooterPoweredBy";

export default function ClientLayoutSwitcher({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [bannerOpen, setBannerOpen] = useState(true);

    const closeBanner = () => setBannerOpen(false);

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                setRole(user.role || null);
            } catch {
                setRole(null);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <Preloader />;
    }

    if (role === "admin") {
        return <AdminLayout>{children}</AdminLayout>;
    }

    // Default layout for non-admin users
    return (
        <>
            <GradientBanner onClose={closeBanner} />
            <Navbar bannerOpen={bannerOpen} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <FooterPoweredBy/>
            <Toaster richColors />
        </>
    );
}
