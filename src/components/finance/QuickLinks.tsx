"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import {
    FaHome,
    FaBook,
    FaEnvelope,
    FaFileAlt,
    FaUserCheck,
    FaClipboardList,
    FaFileInvoiceDollar,
    FaBullhorn,
    FaCalendarAlt,
    FaChartLine,
    FaFileSignature,
    FaUserGraduate,
    FaBriefcase,
    FaBookOpen,
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

    const links = [
        {
            href: "/dashboard",
            label: "Home",
            icon: <FaHome />,
            activeBg: "bg-indigo-600 text-white",
            inactiveBorder: "border-indigo-600",
            inactiveText: "text-indigo-600",
            focusRing: "focus:ring-indigo-600",
        },
        {
            href: "/dashboard/teacher/courses",
            label: "My Courses",
            icon: <FaBook />,
            activeBg: "bg-blue-600 text-white",
            inactiveBorder: "border-blue-600",
            inactiveText: "text-blue-600",
            focusRing: "focus:ring-blue-600",
        },
        {
            href: "/dashboard/teacher/messages",
            label: "Student Messages",
            icon: <FaEnvelope />,
            activeBg: "bg-yellow-600 text-white",
            inactiveBorder: "border-yellow-600",
            inactiveText: "text-yellow-600",
            focusRing: "focus:ring-yellow-600",
        },
        {
            href: "/dashboard/teacher/exam-records",
            label: "Exam Records Submission",
            icon: <FaFileAlt />,
            activeBg: "bg-purple-600 text-white",
            inactiveBorder: "border-purple-600",
            inactiveText: "text-purple-600",
            focusRing: "focus:ring-purple-600",
        },
        {
            href: "/dashboard/teacher/attendance",
            label: "Student Attendance",
            icon: <FaUserCheck />,
            activeBg: "bg-green-700 text-white",
            inactiveBorder: "border-green-700",
            inactiveText: "text-green-700",
            focusRing: "focus:ring-green-700",
        },
        {
            href: "/dashboard/teacher/submissions",
            label: "Student Submissions",
            icon: <FaClipboardList />,
            activeBg: "bg-teal-600 text-white",
            inactiveBorder: "border-teal-600",
            inactiveText: "text-teal-600",
            focusRing: "focus:ring-teal-600",
        },
        {
            href: "/dashboard/teacher/payments",
            label: "Payment Verification",
            icon: <FaFileInvoiceDollar />,
            activeBg: "bg-yellow-700 text-white",
            inactiveBorder: "border-yellow-700",
            inactiveText: "text-yellow-700",
            focusRing: "focus:ring-yellow-700",
        },
        {
            href: "/dashboard/teacher/announcements",
            label: "Announcements",
            icon: <FaBullhorn />,
            activeBg: "bg-red-700 text-white",
            inactiveBorder: "border-red-700",
            inactiveText: "text-red-700",
            focusRing: "focus:ring-red-700",
        },
        {
            href: "/dashboard/teacher/schedule",
            label: "Schedule",
            icon: <FaCalendarAlt />,
            activeBg: "bg-green-600 text-white",
            inactiveBorder: "border-green-600",
            inactiveText: "text-green-600",
            focusRing: "focus:ring-green-600",
        },
        {
            href: "/dashboard/teacher/grades",
            label: "Gradebook",
            icon: <FaChartLine />,
            activeBg: "bg-red-600 text-white",
            inactiveBorder: "border-red-600",
            inactiveText: "text-red-600",
            focusRing: "focus:ring-red-600",
        },
        {
            href: "/dashboard/teacher/leave-requests",
            label: "Leave Requests",
            icon: <FaFileSignature />,
            activeBg: "bg-indigo-700 text-white",
            inactiveBorder: "border-indigo-700",
            inactiveText: "text-indigo-700",
            focusRing: "focus:ring-indigo-700",
        },
        {
            href: "/dashboard/teacher/counseling",
            label: "Student Counseling",
            icon: <FaUserGraduate />,
            activeBg: "bg-pink-600 text-white",
            inactiveBorder: "border-pink-600",
            inactiveText: "text-pink-600",
            focusRing: "focus:ring-pink-600",
        },
        {
            href: "/dashboard/teacher/classroom",
            label: "Classroom Management",
            icon: <FaBriefcase />,
            activeBg: "bg-teal-700 text-white",
            inactiveBorder: "border-teal-700",
            inactiveText: "text-teal-700",
            focusRing: "focus:ring-teal-700",
        },
        {
            href: "/dashboard/teacher/resources",
            label: "Library Resources",
            icon: <FaBookOpen />,
            activeBg: "bg-indigo-800 text-white",
            inactiveBorder: "border-indigo-800",
            inactiveText: "text-indigo-800",
            focusRing: "focus:ring-indigo-800",
        },
        {
            href: "/dashboard/teacher/exams",
            label: "Exams Management",
            icon: <FaClipboardList />,
            activeBg: "bg-purple-700 text-white",
            inactiveBorder: "border-purple-700",
            inactiveText: "text-purple-700",
            focusRing: "focus:ring-purple-700",
        },
        {
            href: "/dashboard/teacher/support",
            label: "Support",
            icon: <FaLifeRing />,
            activeBg: "bg-cyan-600 text-white",
            inactiveBorder: "border-cyan-600",
            inactiveText: "text-cyan-600",
            focusRing: "focus:ring-cyan-600",
        },
        {
            href: "/dashboard/teacher/profile",
            label: "Profile",
            icon: <FaUserGraduate />,
            activeBg: "bg-pink-600 text-white",
            inactiveBorder: "border-pink-600",
            inactiveText: "text-pink-600",
            focusRing: "focus:ring-pink-600",
        },
    ];

   return (
        <nav aria-label="Student dashboard quick links" className="flex flex-col gap-2">
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