"use client";

import { ReactNode, useState } from "react";
import Navbar from "@/components/ui/navbar";
import GradientBanner from "./GradientBanner";
import { Toaster } from "@/components/ui/sonner";
import Preloader from "@/components/ui/Preloader";
import Footer from "@/components/ui/Footer";

export default function ClientRootContent({ children }: { children: ReactNode }) {
    const [bannerOpen, setBannerOpen] = useState(true);

    const closeBanner = () => setBannerOpen(false);

    return (
        <>
            <Preloader />
            {bannerOpen && <GradientBanner onClose={closeBanner} />}
            <Navbar bannerOpen={bannerOpen} />
            <Toaster />
            {children}
            <Footer />
        </>
    );
}
