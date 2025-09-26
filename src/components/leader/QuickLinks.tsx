"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaHome,
    FaBook,
    FaCalendarAlt,
    FaEnvelope,
    FaClipboardList,
    FaChartLine,
    FaUserGraduate,
    FaPenNib,
    FaRedoAlt,
    FaFileAlt,
    FaLifeRing,
    FaFileSignature,
    FaFileInvoice,
    FaExclamationCircle,
    FaFileInvoiceDollar,
    FaBookOpen,
    FaBullhorn,
    FaBriefcase,
    FaUserCheck,
} from "react-icons/fa";

export default function QuickLinks({ userRole }: { userRole?: string }) {
    const pathname = usePathname();

    // STUDENT LINKS
    const studentLinks = [
        { href: "/dashboard", label: "Home", icon: <FaHome className="text-lg" />, activeBg: "bg-indigo-600 text-white", inactiveBg: "border border-indigo-600 text-indigo-600" },
        { href: "/dashboard/leader/courses", label: "My Courses", icon: <FaBook className="text-lg" />, activeBg: "bg-blue-600 text-white", inactiveBg: "border border-blue-600 text-blue-600" },
        { href: "/dashboard/leader/course-registration", label: "Course Registration", icon: <FaPenNib className="text-lg" />, activeBg: "bg-teal-600 text-white", inactiveBg: "border border-teal-600 text-teal-600" },
        { href: "/dashboard/leader/course-retake", label: "Course Retake", icon: <FaRedoAlt className="text-lg" />, activeBg: "bg-orange-600 text-white", inactiveBg: "border border-orange-600 text-orange-600" },
        { href: "/dashboard/leader/schedule", label: "Schedule", icon: <FaCalendarAlt className="text-lg" />, activeBg: "bg-green-600 text-white", inactiveBg: "border border-green-600 text-green-600" },
        { href: "/dashboard/leader/messages", label: "Messages", icon: <FaEnvelope className="text-lg" />, activeBg: "bg-yellow-600 text-white", inactiveBg: "border border-yellow-600 text-yellow-600" },
        { href: "/dashboard/leader/assignments", label: "Assignments", icon: <FaClipboardList className="text-lg" />, activeBg: "bg-purple-600 text-white", inactiveBg: "border border-purple-600 text-purple-600" },
        { href: "/dashboard/leader/grades", label: "Grades Review", icon: <FaFileAlt className="text-lg" />, activeBg: "bg-fuchsia-600 text-white", inactiveBg: "border border-fuchsia-600 text-fuchsia-600" },
        { href: "/dashboard/leader/analytics", label: "Progress", icon: <FaChartLine className="text-lg" />, activeBg: "bg-red-600 text-white", inactiveBg: "border border-red-600 text-red-600" },
        { href: "/dashboard/leader/support", label: "Support", icon: <FaLifeRing className="text-lg" />, activeBg: "bg-cyan-600 text-white", inactiveBg: "border border-cyan-600 text-cyan-600" },
        { href: "/dashboard/leader/profile", label: "Profile", icon: <FaUserGraduate className="text-lg" />, activeBg: "bg-pink-600 text-white", inactiveBg: "border border-pink-600 text-pink-600" },
        { href: "/dashboard/leader/transcript", label: "Transcript", icon: <FaFileSignature className="text-lg" />, activeBg: "bg-indigo-700 text-white", inactiveBg: "border border-indigo-700 text-indigo-700" },
        { href: "/dashboard/leader/exam-report", label: "Exam Report", icon: <FaFileInvoice className="text-lg" />, activeBg: "bg-teal-700 text-white", inactiveBg: "border border-teal-700 text-teal-700" },
        { href: "/dashboard/leader/fees", label: "Fees & Payments", icon: <FaFileInvoiceDollar className="text-lg" />, activeBg: "bg-yellow-700 text-white", inactiveBg: "border border-yellow-700 text-yellow-700" },
        { href: "/dashboard/leader/library", label: "Library", icon: <FaBookOpen className="text-lg" />, activeBg: "bg-indigo-800 text-white", inactiveBg: "border border-indigo-800 text-indigo-800" },
        { href: "/dashboard/leader/announcements", label: "Announcements", icon: <FaBullhorn className="text-lg" />, activeBg: "bg-red-700 text-white", inactiveBg: "border border-red-700 text-red-700" },
        { href: "/dashboard/leader/career", label: "Career Services", icon: <FaBriefcase className="text-lg" />, activeBg: "bg-teal-800 text-white", inactiveBg: "border border-teal-800 text-teal-800" },
        { href: "/dashboard/leader/attendance", label: "Attendance", icon: <FaUserCheck className="text-lg" />, activeBg: "bg-green-700 text-white", inactiveBg: "border border-green-700 text-green-700" },
    ];

    // LEADER LINKS
    const leaderLinks = [
        { href: "/dashboard/leader/home", label: "Leader Home", icon: <FaHome className="text-lg" />, activeBg: "bg-indigo-900 text-white", inactiveBg: "border border-indigo-900 text-indigo-900" },
        { href: "/dashboard/leader/students", label: "All Students", icon: <FaUserGraduate className="text-lg" />, activeBg: "bg-blue-900 text-white", inactiveBg: "border border-blue-900 text-blue-900" },
        { href: "/dashboard/leader/le_assignments", label: "Leader Assignments", icon: <FaClipboardList className="text-lg" />, activeBg: "bg-purple-900 text-white", inactiveBg: "border border-purple-900 text-purple-900" },
        { href: "/dashboard/leader/reports", label: "Reports", icon: <FaFileAlt className="text-lg" />, activeBg: "bg-red-900 text-white", inactiveBg: "border border-red-900 text-red-900" },
        { href: "/dashboard/leader/le_attendance", label: "Monitor Attendance", icon: <FaCalendarAlt className="text-lg" />, activeBg: "bg-green-900 text-white", inactiveBg: "border border-green-900 text-green-900" },
        { href: "/dashboard/leader/le_messages", label: "Leader Messages", icon: <FaEnvelope className="text-lg" />, activeBg: "bg-yellow-900 text-white", inactiveBg: "border border-yellow-900 text-yellow-900" },
    ];

    return (
        <div className="space-y-6">
            {/* STUDENT LINKS BOX */}
            <nav aria-label="Student dashboard quick links" className="bg-white shadow-md rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-4">Student Quick Links</h3>
                <div className="flex flex-wrap gap-3">
                    {studentLinks.map(({ href, label, icon, activeBg, inactiveBg }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-2 px-4 py-2 rounded transition
                                    ${isActive ? activeBg : `${inactiveBg} bg-transparent`}
                                    focus:outline-none focus:ring-2 focus:ring-offset-1
                                    ${isActive ? "focus:ring-white" : `focus:ring-${inactiveBg.split(" ")[1]}`}
                                `}
                                aria-current={isActive ? "page" : undefined}
                                tabIndex={0}
                            >
                                {icon}
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* LEADER LINKS BOX (only for leaders) */}
            {userRole === "LEADER" && (
                <nav aria-label="Leader dashboard quick links" className="bg-white shadow-md rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-4">Leader Quick Links</h3>
                    <div className="flex flex-wrap gap-3">
                        {leaderLinks.map(({ href, label, icon, activeBg, inactiveBg }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded transition
                                        ${isActive ? activeBg : `${inactiveBg} bg-transparent`}
                                        focus:outline-none focus:ring-2 focus:ring-offset-1
                                        ${isActive ? "focus:ring-white" : `focus:ring-${inactiveBg.split(" ")[1]}`}
                                    `}
                                    aria-current={isActive ? "page" : undefined}
                                    tabIndex={0}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
