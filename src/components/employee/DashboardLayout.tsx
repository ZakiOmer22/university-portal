"use client";

import { useState, useEffect } from "react";
import EmployeeSidebar from "./AdminSidebar";
import AdminHeader from "@/components/employee/AdminHeader"; // can rename to EmployeeHeader if needed
import { CommandDialog } from "@/components/employee/CommandDialog";
import FooterPoweredBy from "../FooterPoweredBy";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <EmployeeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
        <AdminHeader
          user={user}
          onSidebarToggle={() => setSidebarOpen((open) => !open)}
          onOpenCommandDialog={() => setCommandOpen(true)}
          onSwitchToFrontend={() => (window.location.href = "/")}
        />

        <main className="flex-1 overflow-auto p-6">
          {children} {/* This is where your page content goes */}
        </main>

        <FooterPoweredBy />
      </div>

      {/* Command dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
