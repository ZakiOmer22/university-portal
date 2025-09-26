"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    Users,
    Database,
    BookOpen,
    ClipboardList,
    UserCheck,
    CreditCard,
    CalendarCheck,
    Settings,
    BarChart2,
    FileSearch,
    Book,
    UserPlus,
    LogOut,
    ShieldCheck,
    Server,
    BookOpenCheck,
    Folder,
    Clipboard,
    Calendar,
    Bell,
    Layers,
    MessageCircle 
} from "lucide-react";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    // Updated navGroups with more buttons
    const navGroups = [
        {
            title: "General",
            items: [
                { name: "Dashboard", href: "/dashboard/admin", icon: Home },
                { name: "Users", href: "/dashboard/admin/users", icon: Users },
                { name: "Roles & Permissions", href: "/dashboard/admin/roles", icon: ShieldCheck },
                { name: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
                { name: "Server Status", href: "/dashboard/admin/server", icon: Server },
                { name: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
            ],
        },
        {
            title: "Academics",
            items: [
                { name: "Programs", href: "/dashboard/admin/programs", icon: BookOpen },
                { name: "Departments", href: "/dashboard/admin/departments", icon: Database },
                { name: "Courses", href: "/dashboard/admin/courses", icon: ClipboardList },
                { name: "Students", href: "/dashboard/admin/students", icon: UserCheck },
                { name: "Faculty", href: "/dashboard/admin/faculty", icon: UserPlus },
                { name: "Enrollments", href: "/dashboard/admin/enrollments", icon: BookOpenCheck },
                { name: "Attendance", href: "/dashboard/admin/attendance", icon: CalendarCheck },
                { name: "Class Schedules", href: "/dashboard/admin/schedules", icon: Calendar },
                { name: "Course Materials", href: "/dashboard/admin/materials", icon: Clipboard },
            ],
        },
        {
            title: "Finance",
            items: [
                { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
                { name: "Invoices", href: "/dashboard/admin/invoices", icon: Folder },
                { name: "Budgets", href: "/dashboard/admin/budgets", icon: Layers },
            ],
        },
        {
            title: "Logs & Reports",
            items: [
                { name: "Activity Logs", href: "/dashboard/admin/logs", icon: FileSearch },
                { name: "Audit Trail", href: "/dashboard/admin/audit-trail", icon: Book },
                { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart2 },
                { name: "Compliance", href: "/dashboard/admin/compliance", icon: ShieldCheck },
            ],
        },
        {
            title: "Utility",
            items: [
                { name: "Backup", href: "/dashboard/admin/backup", icon: Database },
                { name: "System Health", href: "/dashboard/admin/health", icon: Server },
            ],
        },
        {
            title: "Support",
            items: [
                { name: "Support Tickets", href: "/dashboard/admin/support-tickets", icon: MessageCircle }, // using lucide-react icon
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

            <aside
                className={cn(
                    "fixed top-0 left-0 bg-gradient-to-b from-blue-900 to-indigo-900 text-white w-64 shadow-lg z-50 transform md:static md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-700 text-2xl font-extrabold tracking-wide">
                    Admin Menu
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                {/* Nav menu - full height with scroll */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    {navGroups.map((group) => (
                        <div
                            key={group.title}
                            // Added more bottom margin between groups (mb-8 instead of mb-6)
                            className="mb-8 last:mb-0"
                        >
                            <h3 className="px-4 py-2 uppercase text-xs font-bold tracking-wider text-indigo-300 select-none">
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
                                                    ? "bg-blue-700 text-white font-semibold"
                                                    : "text-blue-300 hover:bg-blue-800 hover:text-white"
                                            )}
                                            onClick={onClose} // Close sidebar when an item is clicked
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
            </aside>
        </>
    );
}
