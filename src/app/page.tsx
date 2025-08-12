"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Departments from "@/components/home/Departments";
import Programs from "@/components/home/Programs";
import Blog from "@/components/home/Blog";
import Achievements from "@/components/home/Achievements";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import Events from "@/components/home/Events";
import CallToAction from "@/components/home/CallToAction";
import Partners from "@/components/home/Partners";
import PartnersSay from "@/components/home/PartnersSay";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Run only on client after hydration
    const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (user?.activated) {
          router.replace("/dashboard");
        } else {
          router.replace("/auth/activation-pending");
        }
      } catch {
        // Invalid JSON, clear and stay on home
        localStorage.removeItem("user");
      }
    }
  }, [router]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Hero />
        <About />
        <Partners />
        <Departments />
        <Programs />
        <PartnersSay />
        <Features />
        <Achievements />
        <Testimonials />
        <Events />
        <Blog />
        <CallToAction />
      </main>
    </div>
  );
}
