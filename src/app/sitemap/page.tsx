"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiHome, 
  FiUser, 
  FiBook, 
  FiUsers, 
  FiSettings, 
  FiBarChart2, 
  FiDollarSign,
  FiFileText,
  FiMapPin,
  FiMail,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiExternalLink
} from "react-icons/fi";
import type { IconType } from "react-icons";
interface SiteMapSection {
  title: string;
  icon: IconType;
  description: string;
  color: string;
  items: {
    title: string;
    path: string;
    description?: string;
    badge?: string;
    roles?: string[];
  }[];
}

export default function SitemapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["home", "auth", "academics"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sitemapData: SiteMapSection[] = [
    {
      title: "Home & Main",
      icon: FiHome,
      description: "Main pages and general information",
      color: "from-blue-500 to-cyan-500",
      items: [
        { title: "Home", path: "/", description: "University homepage and overview" },
        { title: "About University", path: "/about", description: "About our institution" },
        { title: "Contact", path: "/resources/contact", description: "Contact information and support" },
        { title: "Campus Map", path: "/resources/map", description: "University campus layout" },
      ]
    },
    {
      title: "Authentication",
      icon: FiUser,
      description: "User account management",
      color: "from-green-500 to-emerald-500",
      items: [
        { title: "Login", path: "/auth/login", description: "Sign in to your account" },
        { title: "Register", path: "/auth/register", description: "Create new account" },
        { title: "Activation Pending", path: "/auth/activation-pending", description: "Account activation status" },
      ]
    },
    {
      title: "Academics",
      icon: FiBook,
      description: "Academic programs and information",
      color: "from-purple-500 to-pink-500",
      items: [
        { title: "Undergraduate Programs", path: "/academics/undergraduate", description: "Bachelor's degree programs" },
        { title: "Graduate Programs", path: "/academics/graduate", description: "Master's and PhD programs" },
        { title: "Online Programs", path: "/academics/online", description: "Distance learning options" },
        { title: "Academic Calendar", path: "/academics/calendar", description: "Important dates and schedules" },
      ]
    },
    {
      title: "Departments",
      icon: FiUsers,
      description: "University departments and faculties",
      color: "from-orange-500 to-red-500",
      items: [
        { title: "Computer Science", path: "/departments/cs", description: "CS department information" },
        { title: "Business", path: "/departments/business", description: "Business school" },
        { title: "Engineering", path: "/departments/engineering", description: "Engineering programs" },
        { title: "Humanities", path: "/departments/humanities", description: "Arts and humanities" },
        { title: "Sciences", path: "/departments/sciences", description: "Science departments" },
      ]
    },
    {
      title: "Programs",
      icon: FiBarChart2,
      description: "Specific degree programs",
      color: "from-indigo-500 to-purple-500",
      items: [
        { title: "Computer Science", path: "/programs/computer-science" },
        { title: "Business Administration", path: "/programs/business-administration" },
        { title: "Accounting", path: "/programs/accounting" },
        { title: "Nursing", path: "/programs/nursing" },
        { title: "Civil Engineering", path: "/programs/civil-engineering" },
        { title: "Education", path: "/programs/education" },
        { title: "Data Science", path: "/programs/data-science" },
        { title: "Information Technology", path: "/programs/information-technology" },
        { title: "Graphic Design", path: "/programs/graphic-design" },
        { title: "Environmental Science", path: "/programs/environmental-science" },
        { title: "Mechanical Engineering", path: "/programs/mechanical-engineering" },
        { title: "Marketing", path: "/programs/marketing" },
        { title: "Psychology", path: "/programs/psychology" },
        { title: "Philosophy", path: "/programs/philosophy" },
        { title: "Physics", path: "/programs/physics" },
        { title: "Architecture", path: "/programs/architecture" },
        { title: "Law", path: "/programs/law" },
        { title: "Social Work", path: "/programs/social-work" },
      ]
    },
    {
      title: "Admissions",
      icon: FiFileText,
      description: "Admission process and requirements",
      color: "from-teal-500 to-green-500",
      items: [
        { title: "Apply Now", path: "/admissions/apply", description: "Start your application" },
        { title: "Scholarships", path: "/admissions/scholarships", description: "Financial aid opportunities" },
        { title: "Tuition & Fees", path: "/admissions/tuition", description: "Cost information" },
        { title: "Campus Visit", path: "/admissions/visit", description: "Schedule a campus tour" },
      ]
    },
    {
      title: "Student Life",
      icon: FiUsers,
      description: "Campus life and activities",
      color: "from-pink-500 to-rose-500",
      items: [
        { title: "Clubs & Organizations", path: "/student-life/clubs", description: "Student clubs and groups" },
        { title: "Career Services", path: "/student-life/careers", description: "Career development" },
        { title: "Health Services", path: "/student-life/health", description: "Health and wellness" },
        { title: "Housing", path: "/student-life/housing", description: "Accommodation options" },
      ]
    },
    {
      title: "Resources",
      icon: FiSettings,
      description: "University resources and services",
      color: "from-gray-500 to-slate-500",
      items: [
        { title: "Library", path: "/resources/library", description: "Digital and physical library" },
        { title: "IT Support", path: "/resources/it-support", description: "Technical assistance" },
        { title: "Contact", path: "/resources/contact", description: "Get in touch" },
        { title: "Campus Map", path: "/resources/map", description: "Navigate campus" },
      ]
    },
    {
      title: "Dashboard - Student",
      icon: FiUser,
      description: "Student portal features",
      color: "from-blue-600 to-indigo-600",
      items: [
        { title: "Student Dashboard", path: "/dashboard/student", description: "Main student portal", roles: ["STUDENT"] },
        { title: "Course Registration", path: "/dashboard/student/course-registration", roles: ["STUDENT"] },
        { title: "Grades & Transcript", path: "/dashboard/student/grades", roles: ["STUDENT"] },
        { title: "Attendance", path: "/dashboard/student/attendance", roles: ["STUDENT"] },
        { title: "Assignments", path: "/dashboard/student/assignments", roles: ["STUDENT"] },
        { title: "Schedule", path: "/dashboard/student/schedule", roles: ["STUDENT"] },
        { title: "Library", path: "/dashboard/student/library", roles: ["STUDENT"] },
        { title: "Fees & Payments", path: "/dashboard/student/fees", roles: ["STUDENT"] },
        { title: "Analytics", path: "/dashboard/student/analytics", roles: ["STUDENT"] },
      ]
    },
    {
      title: "Dashboard - Teacher",
      icon: FiUsers,
      description: "Faculty portal features",
      color: "from-green-600 to-emerald-600",
      items: [
        { title: "Teacher Dashboard", path: "/dashboard/teacher", description: "Main faculty portal", roles: ["TEACHER"] },
        { title: "Courses", path: "/dashboard/teacher/courses", roles: ["TEACHER"] },
        { title: "Attendance", path: "/dashboard/teacher/attendance", roles: ["TEACHER"] },
        { title: "Grades", path: "/dashboard/teacher/grades", roles: ["TEACHER"] },
        { title: "Assignments", path: "/dashboard/teacher/assignments", roles: ["TEACHER"] },
        { title: "Students", path: "/dashboard/teacher/students", roles: ["TEACHER"] },
        { title: "Schedule", path: "/dashboard/teacher/schedule", roles: ["TEACHER"] },
        { title: "Resources", path: "/dashboard/teacher/resources", roles: ["TEACHER"] },
      ]
    },
    {
      title: "Dashboard - Parent",
      icon: FiUsers,
      description: "Parent portal features",
      color: "from-purple-600 to-pink-600",
      items: [
        { title: "Parent Dashboard", path: "/dashboard/parent", description: "Main parent portal", roles: ["PARENT"] },
        { title: "Child Progress", path: "/dashboard/parent/child", roles: ["PARENT"] },
        { title: "Attendance", path: "/dashboard/parent/attendance", roles: ["PARENT"] },
        { title: "Grades", path: "/dashboard/parent/grades", roles: ["PARENT"] },
        { title: "Messages", path: "/dashboard/parent/messages", roles: ["PARENT"] },
        { title: "Fees", path: "/dashboard/parent/fees", roles: ["PARENT"] },
      ]
    },
    {
      title: "Dashboard - Admin",
      icon: FiSettings,
      description: "Administrative features",
      color: "from-red-600 to-orange-600",
      items: [
        { title: "Admin Dashboard", path: "/dashboard/admin", description: "Main admin portal", roles: ["ADMIN"] },
        { title: "User Management", path: "/dashboard/admin/users", roles: ["ADMIN"] },
        { title: "Course Management", path: "/dashboard/admin/courses", roles: ["ADMIN"] },
        { title: "Program Management", path: "/dashboard/admin/programs", roles: ["ADMIN"] },
        { title: "Department Management", path: "/dashboard/admin/departments", roles: ["ADMIN"] },
        { title: "Attendance Reports", path: "/dashboard/admin/attendance", roles: ["ADMIN"] },
        { title: "Financial Management", path: "/dashboard/admin/payments", roles: ["ADMIN"] },
        { title: "System Settings", path: "/dashboard/admin/settings", roles: ["ADMIN"] },
      ]
    },
    {
      title: "Dashboard - Employee",
      icon: FiUser,
      description: "Staff portal features",
      color: "from-cyan-600 to-blue-600",
      items: [
        { title: "Employee Dashboard", path: "/dashboard/employee", description: "Main employee portal", roles: ["EMPLOYEE"] },
        { title: "Various Management", path: "/dashboard/employee", roles: ["EMPLOYEE"] },
      ]
    },
    {
      title: "Dashboard - Leader",
      icon: FiBarChart2,
      description: "Class leader features",
      color: "from-amber-600 to-orange-600",
      items: [
        { title: "Leader Dashboard", path: "/dashboard/leader", description: "Main class leader portal", roles: ["LEADER"] },
        { title: "Student Management", path: "/dashboard/leader/students", roles: ["LEADER"] },
        { title: "Attendance", path: "/dashboard/leader/attendance", roles: ["LEADER"] },
        { title: "Reports", path: "/dashboard/leader/reports", roles: ["LEADER"] },
      ]
    },
    {
      title: "Account Management",
      icon: FiUser,
      description: "Personal account settings",
      color: "from-gray-600 to-slate-600",
      items: [
        { title: "Profile", path: "/account/profile", description: "View and edit profile" },
        { title: "Settings", path: "/account/settings", description: "Account preferences" },
      ]
    },
  ];

  const filteredSitemap = sitemapData.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const totalPages = sitemapData.reduce((acc, section) => acc + section.items.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            University Portal Sitemap
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Explore all the pages and features available in our university portal. 
            Find exactly what you&apos;re looking for with our comprehensive site navigation.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{sitemapData.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalPages}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">6</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">User Roles</div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              placeholder="Search pages, features, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 shadow-lg"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 text-center">
              Found {filteredSitemap.reduce((acc, section) => acc + section.items.length, 0)} results
            </p>
          )}
        </motion.div>

        {/* Sitemap Sections */}
        <div className="max-w-6xl mx-auto space-y-6">
          <AnimatePresence>
            {filteredSitemap.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} shadow-lg`}>
                        <section.icon className="text-white text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {section.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                          {section.items.length} pages • {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {expandedSections.has(section.title) ? 'Hide' : 'Show'}
                      </span>
                      {expandedSections.has(section.title) ? (
                        <FiChevronDown className="text-slate-400 text-xl" />
                      ) : (
                        <FiChevronRight className="text-slate-400 text-xl" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {expandedSections.has(section.title) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {section.items.map((item, itemIndex) => (
                            <motion.div
                              key={item.path}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: itemIndex * 0.05 }}
                            >
                              <Link
                                href={item.path}
                                className="block p-4 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {item.title}
                                    </h3>
                                    {item.description && (
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                        {item.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                        {item.path}
                                      </span>
                                      <FiExternalLink className="text-slate-400 text-xs" />
                                    </div>
                                  </div>
                                </div>
                                {item.roles && (
                                  <div className="flex flex-wrap gap-1 mt-3">
                                    {item.roles.map(role => (
                                      <span
                                        key={role}
                                        className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                      >
                                        {role}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          <p className="text-slate-600 dark:text-slate-400">
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/resources/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}