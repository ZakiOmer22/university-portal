"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import {
    FaHome,
    FaUsers,
    FaEnvelope,
    FaFileAlt,
    FaClipboardList,
    FaCalendarAlt,
    FaFileSignature,
    FaFolderOpen,
    FaBullhorn,
    FaLifeRing,
} from "react-icons/fa";

interface QuickLink {
    href: string;
    label: string;
    icon: JSX.Element;
    activeBg: string;
    inactiveBorder: string;
    inactiveText: string;
    focusRing: string;
}

interface QuickLinksProps {
    compact?: boolean; // Optional prop for compact mode
}

export default function QuickLinks({ compact }: QuickLinksProps) {
    const pathname = usePathname();

    const links: QuickLink[] = [
        {
            href: "/dashboard/employee",
            label: "Home",
            icon: <FaHome />,
            activeBg: "bg-green-700 text-white",
            inactiveBorder: "border-green-700",
            inactiveText: "text-green-700",
            focusRing: "focus:ring-green-700",
        },
        {
            href: "/dashboard/employee/profile",
            label: "My Profile",
            icon: <FaUsers />,
            activeBg: "bg-teal-700 text-white",
            inactiveBorder: "border-teal-700",
            inactiveText: "text-teal-700",
            focusRing: "focus:ring-teal-700",
        },
        {
            href: "/dashboard/employee/student-inquiries",
            label: "Student Inquiries",
            icon: <FaEnvelope />,
            activeBg: "bg-blue-700 text-white",
            inactiveBorder: "border-blue-700",
            inactiveText: "text-blue-700",
            focusRing: "focus:ring-blue-700",
        },
        {
            href: "/dashboard/employee/student-documents",
            label: "Student Documents",
            icon: <FaFolderOpen />,
            activeBg: "bg-indigo-700 text-white",
            inactiveBorder: "border-indigo-700",
            inactiveText: "text-indigo-700",
            focusRing: "focus:ring-indigo-700",
        },
        {
            href: "/dashboard/employee/appointments",
            label: "Appointments",
            icon: <FaCalendarAlt />,
            activeBg: "bg-yellow-700 text-white",
            inactiveBorder: "border-yellow-700",
            inactiveText: "text-yellow-700",
            focusRing: "focus:ring-yellow-700",
        },
        {
            href: "/dashboard/employee/advising-notes",
            label: "Advising Notes",
            icon: <FaFileAlt />,
            activeBg: "bg-purple-700 text-white",
            inactiveBorder: "border-purple-700",
            inactiveText: "text-purple-700",
            focusRing: "focus:ring-purple-700",
        },
        {
            href: "/dashboard/employee/tasks",
            label: "My Tasks",
            icon: <FaClipboardList />,
            activeBg: "bg-green-600 text-white",
            inactiveBorder: "border-green-600",
            inactiveText: "text-green-600",
            focusRing: "focus:ring-green-600",
        },
        {
            href: "/dashboard/employee/attendance",
            label: "Attendance / Time Logs",
            icon: <FaCalendarAlt />,
            activeBg: "bg-teal-600 text-white",
            inactiveBorder: "border-teal-600",
            inactiveText: "text-teal-600",
            focusRing: "focus:ring-teal-600",
        },
        {
            href: "/dashboard/employee/reports",
            label: "Daily Reports",
            icon: <FaFileSignature />,
            activeBg: "bg-orange-600 text-white",
            inactiveBorder: "border-orange-600",
            inactiveText: "text-orange-600",
            focusRing: "focus:ring-orange-600",
        },
        {
            href: "/dashboard/employee/support-tickets",
            label: "Support Tickets",
            icon: <FaLifeRing />,
            activeBg: "bg-cyan-600 text-white",
            inactiveBorder: "border-cyan-600",
            inactiveText: "text-cyan-600",
            focusRing: "focus:ring-cyan-600",
        },
        {
            href: "/dashboard/employee/announcements",
            label: "Office Announcements",
            icon: <FaBullhorn />,
            activeBg: "bg-red-600 text-white",
            inactiveBorder: "border-red-600",
            inactiveText: "text-red-600",
            focusRing: "focus:ring-red-600",
        },
    ];

    return (
        <nav aria-label="Employee dashboard quick links" className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            {links.map(({ href, label, icon, activeBg, inactiveBorder, inactiveText, focusRing }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2 rounded border text-sm transition
                            ${isActive
                                ? `${activeBg}`
                                : `${inactiveBorder} ${inactiveText} bg-transparent`}
                            focus:outline-none focus:ring-2 focus:ring-offset-1 ${focusRing}
                        `}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {icon}
                        {!compact && <span>{label}</span>} {/* Show label only if not compact */}
                    </Link>
                );
            })}
        </nav>
    );
}
