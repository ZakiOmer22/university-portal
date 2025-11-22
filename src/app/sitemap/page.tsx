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
  FiFileText,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiExternalLink,
  FiDownload,
  FiGlobe
} from "react-icons/fi";
import type { IconType } from "react-icons";
interface SiteMapSection {
  title: string;
  icon: IconType;
  description: string;
  color: string;
  seoPriority: number;
  items: {
    title: string;
    path: string;
    description?: string;
    seoPriority?: number;
    lastModified?: string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    roles?: string[];
  }[];
}

export default function SitemapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["home", "academics", "admissions"])
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
      title: "Home & Main Pages",
      icon: FiHome,
      description: "Essential university information and landing pages",
      color: "from-blue-500 to-cyan-500",
      seoPriority: 1.0,
      items: [
        { 
          title: "University Homepage", 
          path: "/", 
          description: "Main university website entrance with latest news and announcements",
          seoPriority: 1.0,
          changeFrequency: "daily"
        },
        { 
          title: "About Our University", 
          path: "/about", 
          description: "History, mission, vision, and leadership information",
          seoPriority: 0.9,
          changeFrequency: "monthly"
        },
        { 
          title: "University Contact Information", 
          path: "/resources/contact", 
          description: "Phone numbers, email addresses, and department contacts",
          seoPriority: 0.8,
          changeFrequency: "yearly"
        },
        { 
          title: "Campus Map & Directions", 
          path: "/resources/map", 
          description: "Interactive campus map with building locations and directions",
          seoPriority: 0.7,
          changeFrequency: "yearly"
        },
      ]
    },
    {
      title: "Academic Programs",
      icon: FiBook,
      description: "Undergraduate, graduate, and online degree programs",
      color: "from-purple-500 to-pink-500",
      seoPriority: 0.9,
      items: [
        { 
          title: "Undergraduate Degrees", 
          path: "/academics/undergraduate", 
          description: "Bachelor's degree programs and requirements",
          seoPriority: 0.9,
          changeFrequency: "monthly"
        },
        { 
          title: "Graduate Programs", 
          path: "/academics/graduate", 
          description: "Master's, PhD, and doctoral programs",
          seoPriority: 0.9,
          changeFrequency: "monthly"
        },
        { 
          title: "Online Learning", 
          path: "/academics/online", 
          description: "Distance education and online course offerings",
          seoPriority: 0.8,
          changeFrequency: "monthly"
        },
        { 
          title: "Academic Calendar", 
          path: "/academics/calendar", 
          description: "Important dates, deadlines, and semester schedules",
          seoPriority: 0.7,
          changeFrequency: "monthly"
        },
      ]
    },
    {
      title: "Degree Programs",
      icon: FiBarChart2,
      description: "Specific majors and degree offerings",
      color: "from-indigo-500 to-purple-500",
      seoPriority: 0.8,
      items: [
        { title: "Computer Science Degree", path: "/programs/computer-science", seoPriority: 0.8 },
        { title: "Business Administration Program", path: "/programs/business-administration", seoPriority: 0.8 },
        { title: "Accounting Major", path: "/programs/accounting", seoPriority: 0.7 },
        { title: "Nursing Program", path: "/programs/nursing", seoPriority: 0.8 },
        { title: "Civil Engineering Degree", path: "/programs/civil-engineering", seoPriority: 0.7 },
        { title: "Education Programs", path: "/programs/education", seoPriority: 0.7 },
        { title: "Data Science Major", path: "/programs/data-science", seoPriority: 0.8 },
        { title: "Information Technology", path: "/programs/information-technology", seoPriority: 0.7 },
        { title: "Graphic Design Program", path: "/programs/graphic-design", seoPriority: 0.6 },
        { title: "Environmental Science", path: "/programs/environmental-science", seoPriority: 0.7 },
      ]
    },
    {
      title: "University Departments",
      icon: FiUsers,
      description: "Academic departments and research centers",
      color: "from-orange-500 to-red-500",
      seoPriority: 0.7,
      items: [
        { 
          title: "Computer Science Department", 
          path: "/departments/cs", 
          description: "Faculty, research, and computer science programs",
          seoPriority: 0.8 
        },
        { 
          title: "Business School", 
          path: "/departments/business", 
          description: "Business programs and faculty information",
          seoPriority: 0.8 
        },
        { 
          title: "Engineering Department", 
          path: "/departments/engineering", 
          description: "Engineering programs and research facilities",
          seoPriority: 0.7 
        },
        { 
          title: "Humanities Division", 
          path: "/departments/humanities", 
          description: "Arts, literature, and humanities programs",
          seoPriority: 0.6 
        },
        { 
          title: "Science Departments", 
          path: "/departments/sciences", 
          description: "Natural and physical sciences programs",
          seoPriority: 0.7 
        },
      ]
    },
    {
      title: "Admissions Process",
      icon: FiFileText,
      description: "Application and enrollment information",
      color: "from-teal-500 to-green-500",
      seoPriority: 0.9,
      items: [
        { 
          title: "Apply to University", 
          path: "/admissions/apply", 
          description: "Online application portal and requirements",
          seoPriority: 0.9 
        },
        { 
          title: "Scholarships & Financial Aid", 
          path: "/admissions/scholarships", 
          description: "Financial assistance and scholarship opportunities",
          seoPriority: 0.8 
        },
        { 
          title: "Tuition & Fees", 
          path: "/admissions/tuition", 
          description: "Cost of attendance and payment information",
          seoPriority: 0.8 
        },
        { 
          title: "Schedule Campus Visit", 
          path: "/admissions/visit", 
          description: "Tour campus and meet with admissions",
          seoPriority: 0.7 
        },
      ]
    },
    {
      title: "Student Resources",
      icon: FiSettings,
      description: "Campus services and support systems",
      color: "from-gray-500 to-slate-500",
      seoPriority: 0.6,
      items: [
        { 
          title: "University Library", 
          path: "/resources/library", 
          description: "Digital resources, databases, and research help",
          seoPriority: 0.7 
        },
        { 
          title: "IT Support Services", 
          path: "/resources/it-support", 
          description: "Technical assistance and computer services",
          seoPriority: 0.6 
        },
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
  const highPriorityPages = sitemapData.reduce((acc, section) => 
    acc + section.items.filter(item => (item.seoPriority || 0.5) >= 0.8).length, 0
  );

  const downloadSitemap = () => {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData.flatMap(section => 
  section.items.map(item => `  <url>
    <loc>https://university-portal-system.com${item.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${item.changeFrequency || 'monthly'}</changefreq>
    <priority>${item.seoPriority || 0.5}</priority>
  </url>`
).join('\n')).join('\n')}
</urlset>`;

    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiGlobe className="text-3xl text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              University Sitemap
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6">
            Complete navigation guide for search engines and users. Optimized for SEO and user experience.
          </p>
          
          {/* SEO Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sitemapData.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Content Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalPages}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Indexable Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{highPriorityPages}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">High Priority Pages</div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadSitemap}
            className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <FiDownload />
            Download XML Sitemap
          </button>
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
              placeholder="Search academic programs, departments, or resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 shadow-lg"
            />
          </div>
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
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {section.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                          {section.items.length} pages • SEO Priority: {section.seoPriority} • {section.description}
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
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                      </h3>
                                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                                        Priority: {item.seoPriority || 0.5}
                                      </span>
                                    </div>
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

        {/* SEO Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">SEO Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 dark:text-slate-400">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Sitemap Location</h3>
              <p className="text-sm">https://university-portal-system.com/sitemap.xml</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Robots.txt</h3>
              <p className="text-sm">https://university-portal-system.com/robots.txt</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Indexing Status</h3>
              <p className="text-sm">{totalPages} pages available for search engine indexing</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Last Updated</h3>
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}