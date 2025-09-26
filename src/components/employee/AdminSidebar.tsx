"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  CalendarCheck,
  ClipboardList,
  Bell,
  BarChart2,
  FileSearch,
  Settings,
  BookOpen,
  FileText,
  LifeBuoy,
} from "lucide-react";

interface EmployeeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeSidebar({ isOpen, onClose }: EmployeeSidebarProps) {
  const pathname = usePathname();

  // Employee-specific buttons with all relevant links
  const navGroups = [
    {
      title: "General",
      items: [
        { name: "Dashboard", href: "/dashboard/employee", icon: Home },
        { name: "My Profile", href: "/dashboard/employee/profile", icon: Users },
        { name: "Notifications", href: "/dashboard/employee/notifications", icon: Bell },
        { name: "Settings", href: "/dashboard/employee/settings", icon: Settings },
      ],
    },
    {
      title: "Tasks & Attendance",
      items: [
        { name: "My Tasks", href: "/dashboard/employee/tasks", icon: ClipboardList },
        { name: "Attendance / Time Logs", href: "/dashboard/employee/attendance", icon: CalendarCheck },
        { name: "Daily Reports", href: "/dashboard/employee/reports", icon: BarChart2 },
        { name: "Activity Logs", href: "/dashboard/employee/logs", icon: FileSearch },
        { name: "Appointments", href: "/dashboard/employee/appointments", icon: CalendarCheck },
        { name: "Advising Notes", href: "/dashboard/employee/advising-notes", icon: FileText },
      ],
    },
    {
      title: "Student Support",
      items: [
        { name: "Student Assistance", href: "/dashboard/employee/student-assistance", icon: Users },
        { name: "Student Documents", href: "/dashboard/employee/student-documents", icon: BookOpen },
        { name: "Library Help", href: "/dashboard/employee/library", icon: BookOpen },
        { name: "Tech Support Requests", href: "/dashboard/employee/support", icon: LifeBuoy },
        { name: "Office Announcements", href: "/dashboard/employee/announcements", icon: Bell },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-gradient-to-b from-green-900 to-teal-900 text-white w-64 shadow-lg z-50 transform md:static md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-teal-700 text-2xl font-extrabold tracking-wide">
          Employee Menu
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Nav menu */}
        <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-8 last:mb-0 flex-shrink-0">
              <h3 className="px-4 py-2 uppercase text-xs font-bold tracking-wider text-teal-300 select-none">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map(({ name, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={name}
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200",
                        isActive
                          ? "bg-green-700 text-white font-semibold"
                          : "text-green-300 hover:bg-green-800 hover:text-white"
                      )}
                      onClick={onClose} // closes mobile sidebar
                    >
                      <Icon className="w-5 h-5" />
                      <span>{name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Optional footer at bottom */}
        <div className="p-4 border-t border-teal-700 text-sm text-teal-200">
          &copy; University Portal
        </div>
      </aside>
    </>
  );
}
