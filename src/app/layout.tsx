// src/app/layout.tsx

import "./globals.css";
import Navbar from "@/components/ui/navbar";
import GradientBanner from "./GradientBanner";
import Providers from "@/components/Providers";
import Footer from "@/components/ui/Footer";
import { Toaster } from "@/components/ui/sonner";
import Preloader from "@/components/ui/Preloader";
import ClientRootContent from "./ClientRootContent";

export const metadata = {
  title: "University Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // This is now a server component (no "use client")

  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientRootContent>{children}</ClientRootContent>
        </Providers>
      </body>
    </html>
  );
}
