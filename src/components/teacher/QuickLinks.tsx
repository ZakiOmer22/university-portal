"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";
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
    FaChevronDown,
    FaChevronRight,
    FaCompress,
    FaExpand,
} from "react-icons/fa";

interface QuickLink {
    href: string;
    label: string;
    icon: JSX.Element;
    category?: string;
    color: string;
}

interface QuickLinksProps {
    compact?: boolean;
}

export default function QuickLinks({ compact }: QuickLinksProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Teaching", "Administration", "Communication"]));

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const categories = {
        "Teaching": [
            {
                href: "/dashboard/teacher/courses",
                label: "My Courses",
                icon: <FaBook className="text-lg" />,
                color: "from-blue-500 to-cyan-500"
            },
            {
                href: "/dashboard/teacher/classroom",
                label: "Classroom Management",
                icon: <FaBriefcase className="text-lg" />,
                color: "from-teal-500 to-cyan-500"
            },
            {
                href: "/dashboard/teacher/exams",
                label: "Exams Management",
                icon: <FaClipboardList className="text-lg" />,
                color: "from-purple-500 to-pink-500"
            },
            {
                href: "/dashboard/teacher/resources",
                label: "Library Resources",
                icon: <FaBookOpen className="text-lg" />,
                color: "from-indigo-500 to-purple-500"
            }
        ],
        "Student Management": [
            {
                href: "/dashboard/teacher/attendance",
                label: "Student Attendance",
                icon: <FaUserCheck className="text-lg" />,
                color: "from-emerald-500 to-green-500"
            },
            {
                href: "/dashboard/teacher/submissions",
                label: "Student Submissions",
                icon: <FaClipboardList className="text-lg" />,
                color: "from-teal-500 to-blue-500"
            },
            {
                href: "/dashboard/teacher/grades",
                label: "Gradebook",
                icon: <FaChartLine className="text-lg" />,
                color: "from-rose-500 to-red-500"
            },
            {
                href: "/dashboard/teacher/counseling",
                label: "Student Counseling",
                icon: <FaUserGraduate className="text-lg" />,
                color: "from-pink-500 to-rose-500"
            }
        ],
        "Administration": [
            {
                href: "/dashboard/teacher/exam-records",
                label: "Exam Records Submission",
                icon: <FaFileAlt className="text-lg" />,
                color: "from-purple-500 to-indigo-500"
            },
            {
                href: "/dashboard/teacher/payments",
                label: "Payment Verification",
                icon: <FaFileInvoiceDollar className="text-lg" />,
                color: "from-amber-500 to-orange-500"
            },
            {
                href: "/dashboard/teacher/leave-requests",
                label: "Leave Requests",
                icon: <FaFileSignature className="text-lg" />,
                color: "from-indigo-500 to-blue-500"
            },
            {
                href: "/dashboard/teacher/schedule",
                label: "Schedule",
                icon: <FaCalendarAlt className="text-lg" />,
                color: "from-green-500 to-emerald-500"
            }
        ],
        "Communication": [
            {
                href: "/dashboard/teacher/messages",
                label: "Student Messages",
                icon: <FaEnvelope className="text-lg" />,
                color: "from-amber-500 to-yellow-500"
            },
            {
                href: "/dashboard/teacher/announcements",
                label: "Announcements",
                icon: <FaBullhorn className="text-lg" />,
                color: "from-red-500 to-pink-500"
            }
        ],
        "General": [
            {
                href: "/dashboard",
                label: "Home",
                icon: <FaHome className="text-lg" />,
                color: "from-indigo-500 to-purple-500"
            },
            {
                href: "/dashboard/teacher/support",
                label: "Support",
                icon: <FaLifeRing className="text-lg" />,
                color: "from-cyan-500 to-blue-500"
            },
            {
                href: "/dashboard/teacher/profile",
                label: "Profile",
                icon: <FaUserGraduate className="text-lg" />,
                color: "from-pink-500 to-purple-500"
            }
        ]
    };

    const allLinks = Object.values(categories).flat();

    return (
        <div className="flex flex-col h-full">
            {/* Header with Collapse Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
                <h3 className="text-lg font-semibold text-gray-900 bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                    Navigation
                </h3>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-700"
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    {isCollapsed ? <FaExpand className="text-sm" /> : <FaCompress className="text-sm" />}
                </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {isCollapsed ? (
                    // Compact Icon-Only View
                    <div className="flex flex-col gap-2">
                        {allLinks.map(({ href, label, icon, color }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`relative p-3 rounded-xl transition-all duration-200 group
                                        ${isActive 
                                            ? `bg-gradient-to-br ${color} text-white shadow-lg transform scale-105` 
                                            : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                                        }`}
                                    title={label}
                                >
                                    <div className="flex justify-center">
                                        {icon}
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                        {label}
                                    </div>
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full border-2 border-current"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    // Expanded Categorized View
                    <div className="space-y-4">
                        {Object.entries(categories).map(([category, links]) => {
                            const isExpanded = expandedCategories.has(category);
                            const hasActiveLink = links.some(link => pathname === link.href);

                            return (
                                <div key={category} className="space-y-2">
                                    {/* Category Header */}
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 group
                                            ${hasActiveLink 
                                                ? 'bg-indigo-50 border border-indigo-200' 
                                                : 'bg-gray-100/80 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className={`font-semibold text-sm ${
                                            hasActiveLink ? 'text-indigo-700' : 'text-gray-700'
                                        }`}>
                                            {category}
                                        </span>
                                        <div className={`transform transition-transform duration-200 ${
                                            isExpanded ? 'rotate-0' : '-rotate-90'
                                        }`}>
                                            <FaChevronDown className="text-xs text-gray-500" />
                                        </div>
                                    </button>

                                    {/* Category Links */}
                                    {isExpanded && (
                                        <div className="space-y-1 ml-2">
                                            {links.map(({ href, label, icon, color }) => {
                                                const isActive = pathname === href;
                                                return (
                                                    <Link
                                                        key={href}
                                                        href={href}
                                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative
                                                            ${isActive 
                                                                ? `bg-gradient-to-r ${color} text-white shadow-md transform scale-[1.02]` 
                                                                : 'text-gray-700 hover:bg-white hover:shadow-sm hover:border hover:border-gray-200'
                                                            }`}
                                                    >
                                                        {/* Icon with gradient background when active */}
                                                        <div className={`p-2 rounded-lg transition-all duration-200 ${
                                                            isActive 
                                                                ? 'bg-white/20 text-white' 
                                                                : `bg-gradient-to-br ${color} text-white`
                                                        }`}>
                                                            {icon}
                                                        </div>
                                                        
                                                        <span className="font-medium text-sm flex-1">
                                                            {label}
                                                        </span>

                                                        {/* Active indicator */}
                                                        {isActive && (
                                                            <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                                                        )}

                                                        {/* Hover arrow */}
                                                        {!isActive && (
                                                            <FaChevronRight className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Actions Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-200/60 bg-gradient-to-t from-gray-50/50 to-white/30">
                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 mb-2">QUICK ACTIONS</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 text-xs font-medium">
                                New Announcement
                            </button>
                            <button className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors duration-200 text-xs font-medium">
                                Grade Submissions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}