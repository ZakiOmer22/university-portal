import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Providers from "@/components/Providers";
import Footer from "@/components/ui/Footer";
import { Toaster } from "@/components/ui/sonner";
import Preloader from "@/components/ui/Preloader";

export const metadata = { title: "University Portal" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Preloader />
          <Navbar />
          <Toaster />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
