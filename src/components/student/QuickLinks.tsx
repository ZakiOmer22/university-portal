"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX, useState } from "react";
import Image from "next/image";
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
  FaFileInvoiceDollar,
  FaBookOpen,
  FaBullhorn,
  FaBriefcase,
  FaUserCheck,
  FaRocket,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaStar,
  FaGraduationCap,
  FaComments,
  FaHeadset,
} from "react-icons/fa";

interface QuickLink {
  href: string;
  label: string;
  icon: JSX.Element;
  activeBg: string;
  inactiveBg: string;
  category: "academic" | "resources" | "communication" | "support" | "premium";
  description: string;
  badge?: string;
}

export default function QuickLinks() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links: QuickLink[] = [
    {
      href: "/dashboard",
      label: "Dashboard Home",
      icon: <FaRocket className="text-xl lg:text-lg" />,
      activeBg: "from-purple-600 to-indigo-700",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "premium",
      description: "Your academic overview",
      badge: "NEW"
    },
    {
      href: "/dashboard/student/courses",
      label: "My Courses",
      icon: <FaBook className="text-xl lg:text-lg" />,
      activeBg: "from-blue-600 to-cyan-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "Manage your courses",
    },
    {
      href: "/dashboard/student/course-registration",
      label: "Course Registration",
      icon: <FaPenNib className="text-xl lg:text-lg" />,
      activeBg: "from-emerald-600 to-teal-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "Register for new courses",
    },
    {
      href: "/dashboard/student/course-retake",
      label: "Course Retake",
      icon: <FaRedoAlt className="text-xl lg:text-lg" />,
      activeBg: "from-orange-600 to-amber-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "Retake previous courses",
    },
    {
      href: "/dashboard/student/schedule",
      label: "Class Schedule",
      icon: <FaCalendarAlt className="text-xl lg:text-lg" />,
      activeBg: "from-green-600 to-lime-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "View your timetable",
    },
    {
      href: "/dashboard/student/messages",
      label: "Messages",
      icon: <FaEnvelope className="text-xl lg:text-lg" />,
      activeBg: "from-yellow-600 to-orange-500",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "communication",
      description: "Communicate with faculty",
      badge: "3"
    },
    {
      href: "/dashboard/student/assignments",
      label: "Assignments",
      icon: <FaClipboardList className="text-xl lg:text-lg" />,
      activeBg: "from-purple-600 to-pink-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "Submit and track work",
      badge: "2"
    },
    {
      href: "/dashboard/student/grades",
      label: "Grades & Results",
      icon: <FaFileAlt className="text-xl lg:text-lg" />,
      activeBg: "from-pink-600 to-rose-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "Check your performance",
    },
    {
      href: "/dashboard/student/analytics",
      label: "Progress Analytics",
      icon: <FaChartLine className="text-xl lg:text-lg" />,
      activeBg: "from-red-600 to-pink-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "Detailed insights",
    },
    {
      href: "/dashboard/student/support",
      label: "Student Support",
      icon: <FaShieldAlt className="text-xl lg:text-lg" />,
      activeBg: "from-cyan-600 to-blue-500",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "support",
      description: "Get help and guidance",
    },
    {
      href: "/dashboard/student/profile",
      label: "My Profile",
      icon: <FaUserGraduate className="text-xl lg:text-lg" />,
      activeBg: "from-rose-600 to-pink-500",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "premium",
      description: "Manage your account",
    },
    {
      href: "/dashboard/student/transcript",
      label: "Academic Transcript",
      icon: <FaFileSignature className="text-xl lg:text-lg" />,
      activeBg: "from-indigo-700 to-purple-700",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "resources",
      description: "Official documents",
    },
    {
      href: "/dashboard/student/exam-report",
      label: "Exam Reports",
      icon: <FaFileInvoice className="text-xl lg:text-lg" />,
      activeBg: "from-teal-700 to-emerald-700",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "resources",
      description: "Exam performance",
    },
    {
      href: "/dashboard/student/fees",
      label: "Fees & Payments",
      icon: <FaFileInvoiceDollar className="text-xl lg:text-lg" />,
      activeBg: "from-amber-600 to-yellow-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "resources",
      description: "Financial management",
    },
    {
      href: "/dashboard/student/library",
      label: "Digital Library",
      icon: <FaBookOpen className="text-xl lg:text-lg" />,
      activeBg: "from-indigo-800 to-purple-800",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "resources",
      description: "Learning resources",
    },
    {
      href: "/dashboard/student/announcements",
      label: "Announcements",
      icon: <FaBullhorn className="text-xl lg:text-lg" />,
      activeBg: "from-red-700 to-orange-700",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "communication",
      description: "Latest updates",
    },
    {
      href: "/dashboard/student/career",
      label: "Career Services",
      icon: <FaBriefcase className="text-xl lg:text-lg" />,
      activeBg: "from-teal-800 to-emerald-800",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "support",
      description: "Career guidance",
    },
    {
      href: "/dashboard/student/attendance",
      label: "Attendance Tracker",
      icon: <FaUserCheck className="text-xl lg:text-lg" />,
      activeBg: "from-lime-600 to-green-600",
      inactiveBg: "bg-white/90 backdrop-blur-sm border border-gray-200/60",
      category: "academic",
      description: "Attendance records",
    },
  ];

  const categories = {
    premium: { name: "Premium", icon: <FaStar className="text-[10px]" />, color: "from-purple-500 to-pink-500" },
    academic: { name: "Academic", icon: <FaGraduationCap className="text-[10px]" />, color: "from-blue-500 to-cyan-500" },
    resources: { name: "Resources", icon: <FaBookOpen className="text-[10px]" />, color: "from-emerald-500 to-teal-500" },
    communication: { name: "Communication", icon: <FaComments className="text-[10px]" />, color: "from-amber-500 to-orange-500" },
    support: { name: "Support", icon: <FaHeadset className="text-[10px]" />, color: "from-cyan-500 to-blue-500" },
  };

  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);

  // Mobile menu toggle
  const MobileToggle = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="lg:hidden fixed top-20 left-4 z-50 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <FaBars className="text-gray-600 text-lg" />
    </button>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={`hidden lg:block h-screen bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-200/50 transition-all duration-500 ${
      isCollapsed ? 'w-20' : 'w-80'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b border-gray-200/50 ${isCollapsed ? 'text-center' : ''}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/icon.png"
                alt="School Logo"
                width={40}
                height={40}
                className="rounded-lg object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quick Access
              </h2>
              <p className="text-gray-600 text-xs">All tools in one place</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative w-8 h-8">
              <Image
                src="/icon.png"
                alt="School Logo"
                width={32}
                height={32}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-4 bg-white border border-gray-300 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          {isCollapsed ? <FaChevronRight className="text-gray-600 text-sm" /> : <FaChevronLeft className="text-gray-600 text-sm" />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto pb-6">
        <div className="space-y-6 px-3 pt-4">
          {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
            <div key={category} className="space-y-2">
              {!isCollapsed && (
                <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${categories[category as keyof typeof categories].color} text-white text-xs font-semibold`}>
                  <div className="flex items-center gap-1">
                    {categories[category as keyof typeof categories].icon}
                    <span>{categories[category as keyof typeof categories].name}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                {categoryLinks.map(({ href, label, icon, activeBg, inactiveBg, description, badge }) => {
                  const isActive = pathname === href;
                  
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${activeBg} shadow-md text-white` 
                          : `${inactiveBg} hover:shadow-sm text-gray-700 hover:translate-x-1`
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? label : ''}
                    >
                      <div className={`relative ${isCollapsed ? '' : 'flex-shrink-0'}`}>
                        <div className={`p-1.5 rounded-md transition-colors ${
                          isActive ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-gray-100'
                        }`}>
                          {icon}
                        </div>
                        
                        {badge && (
                          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                            isActive 
                              ? 'bg-white/30 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {badge}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-xs truncate ${
                              isActive ? 'text-white' : 'group-hover:text-gray-900'
                            }`}>
                              {label}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate ${
                            isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                          }`}>
                            {description}
                          </p>
                        </div>
                      )}

                      {isActive && (
                        <div className={`absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping ${isCollapsed ? 'right-1' : ''}`}></div>
                      )}

                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                          {label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!isCollapsed && (
          <div className="mt-6 mx-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white text-center">
            <div className="text-xs font-semibold mb-1">Quick Stats</div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div>
                <div className="font-bold">{links.length}</div>
                <div className="text-indigo-100">Tools</div>
              </div>
              <div>
                <div className="font-bold">5</div>
                <div className="text-indigo-100">Categories</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-200/50 transform transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/icon.png"
                alt="School Logo"
                width={40}
                height={40}
                className="rounded-lg object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quick Access
              </h2>
              <p className="text-gray-600 text-xs">All tools in one place</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute right-4 top-4 bg-white border border-gray-300 rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaChevronLeft className="text-gray-600 text-sm" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="h-[calc(100vh-72px)] overflow-y-auto pb-6">
          <div className="space-y-6 px-3 pt-4">
            {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
              <div key={category} className="space-y-2">
                <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${categories[category as keyof typeof categories].color} text-white text-xs font-semibold`}>
                  <div className="flex items-center gap-1">
                    {categories[category as keyof typeof categories].icon}
                    <span>{categories[category as keyof typeof categories].name}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {categoryLinks.map(({ href, label, icon, activeBg, inactiveBg, description, badge }) => {
                    const isActive = pathname === href;
                    
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`group relative flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? `bg-gradient-to-r ${activeBg} shadow-md text-white` 
                            : `${inactiveBg} hover:shadow-sm text-gray-700`
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className={`p-1.5 rounded-md transition-colors ${
                            isActive ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-gray-100'
                          }`}>
                            {icon}
                          </div>
                          
                          {badge && (
                            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                              isActive 
                                ? 'bg-white/30 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {badge}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-xs truncate ${
                              isActive ? 'text-white' : 'group-hover:text-gray-900'
                            }`}>
                              {label}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate ${
                            isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                          }`}>
                            {description}
                          </p>
                        </div>

                        {isActive && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 mx-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white text-center">
            <div className="text-xs font-semibold mb-1">Quick Stats</div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div>
                <div className="font-bold">{links.length}</div>
                <div className="text-indigo-100">Tools</div>
              </div>
              <div>
                <div className="font-bold">5</div>
                <div className="text-indigo-100">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <MobileToggle />
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}