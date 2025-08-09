"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaHome,
    FaMoneyCheckAlt,
    FaCalendarAlt,
    FaEnvelope,
    FaUserCheck,
    FaChartBar,
    FaGraduationCap
} from "react-icons/fa";

export default function QuickLinks() {
    const pathname = usePathname();

    const links = [
        {
            href: "/dashboard",
            label: "Home",
            icon: <FaHome className="text-lg" />,
            activeBg: "bg-gray-600 text-white",
            inactiveBg: "border border-gray-600 text-gray-600"
        },
        {
            href: "/dashboard/parent/fees",
            label: "Fees & Payments",
            icon: <FaMoneyCheckAlt className="text-lg" />,
            activeBg: "bg-indigo-600 text-white",
            inactiveBg: "border border-indigo-600 text-indigo-600"
        },
        {
            href: "/dashboard/parent/schedule",
            label: "Academic Schedule",
            icon: <FaCalendarAlt className="text-lg" />,
            activeBg: "bg-blue-600 text-white",
            inactiveBg: "border border-blue-600 text-blue-600"
        },
        {
            href: "/dashboard/parent/messages",
            label: "Teacher Messages",
            icon: <FaEnvelope className="text-lg" />,
            activeBg: "bg-green-600 text-white",
            inactiveBg: "border border-green-600 text-green-600"
        },
        {
            href: "/dashboard/parent/attendance",
            label: "Attendance Record",
            icon: <FaUserCheck className="text-lg" />,
            activeBg: "bg-yellow-500 text-white",
            inactiveBg: "border border-yellow-500 text-yellow-600"
        },
        {
            href: "/dashboard/parent/progress",
            label: "Progress Report",
            icon: <FaChartBar className="text-lg" />,
            activeBg: "bg-purple-600 text-white",
            inactiveBg: "border border-purple-600 text-purple-600"
        },
        {
            href: "/dashboard/parent/grades",
            label: "Grades Overview",
            icon: <FaGraduationCap className="text-lg" />,
            activeBg: "bg-red-600 text-white",
            inactiveBg: "border border-red-600 text-red-600"
        }
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-wrap gap-3">
                {links.map(({ href, label, icon, activeBg, inactiveBg }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2 px-4 py-2 rounded transition ${isActive ? activeBg : `${inactiveBg} bg-transparent`
                                }`}
                        >
                            {icon}
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
