"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/Footer";
import GradientBanner from "./GradientBanner";
import { Toaster } from "@/components/ui/sonner";
import Preloader from "@/components/ui/Preloader";
import FooterPoweredBy from "@/components/FooterPoweredBy";

// Import layouts
import AdminLayout from "@/components/admin/DashboardLayout";
import EmployeeLayout from "@/components/employee/DashboardLayout";
import HRLayout from "@/components/hr/DashboardLayout";
import FinanceLayout from "@/components/finance/DashboardLayout";
import ExaminationLayout from "@/components/examination/DashboardLayout";

interface Props {
  children: React.ReactNode;
}

export default function ClientLayoutSwitcher({ children }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerOpen, setBannerOpen] = useState(true);

  const closeBanner = () => setBannerOpen(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setRole(user.role?.toUpperCase() || null);
      } catch {
        setRole(null);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <Preloader />;

  // Layout mapping
  const layouts: Record<string, React.FC<{ children: React.ReactNode }>> = {
    ADMIN: AdminLayout,
    EMPLOYEE: EmployeeLayout,
    HR: HRLayout,
    FINANCE: FinanceLayout,
    EXAMINATION: ExaminationLayout,
  };

  // Use specific layout if exists
  if (role && layouts[role]) {
    const Layout = layouts[role];
    return <Layout>{children}</Layout>;
  }

  // Default layout for other roles
  return (
    <>
      <GradientBanner onClose={closeBanner} />
      <Toaster richColors />
      <Navbar bannerOpen={bannerOpen} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FooterPoweredBy />
    </>
  );
}
