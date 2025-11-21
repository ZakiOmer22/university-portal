import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaNewspaper,
  FaGooglePlay,
  FaAppStore,
  FaWindows,
  FaApple,
  FaDownload
} from "react-icons/fa";
import { SiMacos } from "react-icons/si";
import { useState } from "react";

export default function Footer() {
  const [showDownloadPanel, setShowDownloadPanel] = useState(false);

  const downloadLinks = [
    {
      platform: "Android",
      icon: FaGooglePlay,
      color: "text-green-400",
      bgColor: "bg-green-500",
      url: "#"
    },
    {
      platform: "iOS",
      icon: FaAppStore,
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      url: "#"
    },
    {
      platform: "Windows",
      icon: FaWindows,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      url: "#"
    },
    {
      platform: "macOS",
      icon: SiMacos,
      color: "text-gray-300",
      bgColor: "bg-gray-600",
      url: "#"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Floating Download Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Download Panel */}
          {showDownloadPanel && (
            <div className="absolute bottom-16 right-0 w-72 bg-slate-800/95 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-5">
              <div className="text-center mb-3">
                <h3 className="font-bold text-white text-lg">Download Our App</h3>
                <p className="text-gray-300 text-sm">Access campus anywhere</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {downloadLinks.map(({ platform, icon: Icon, color, bgColor, url }) => (
                  <a
                    key={platform}
                    href={url}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className={`p-2 rounded-lg ${bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white text-sm" />
                    </div>
                    <span className="text-white text-sm font-medium">{platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Main Download Button */}
          <button
            onClick={() => setShowDownloadPanel(!showDownloadPanel)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
          >
            <FaDownload className="text-xl text-white group-hover:animate-bounce" />
          </button>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[size:40px_40px]"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                University of Hargeisa
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">
              Committed to academic excellence and community service in Somaliland and beyond. 
              Shaping future leaders through innovative education and research.
            </p>
            
            {/* Download Badge in About Section */}
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <FaDownload className="text-purple-400" />
                <span className="text-white font-semibold">Get Our App</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {downloadLinks.slice(0, 2).map(({ platform, icon: Icon, color, url }) => (
                  <a
                    key={platform}
                    href={url}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition-colors"
                  >
                    <Icon className={color} />
                    <span>{platform}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { icon: FaFacebook, color: "hover:text-blue-400", label: "Facebook" },
                { icon: FaTwitter, color: "hover:text-cyan-400", label: "Twitter" },
                { icon: FaLinkedin, color: "hover:text-blue-500", label: "LinkedIn" },
                { icon: FaInstagram, color: "hover:text-pink-400", label: "Instagram" }
              ].map(({ icon: Icon, color, label }, index) => (
                <a 
                  key={label}
                  href="#" 
                  className={`group p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 hover:bg-white/10 ${color}`}
                  aria-label={label}
                >
                  <Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <FaCalendarAlt className="text-lg text-white" />
              </div>
              <h3 className="font-bold text-lg text-white">Quick Links</h3>
            </div>
            <ul className="space-y-3">
              {[
                { href: "/academics/undergraduate", label: "Undergraduate Programs" },
                { href: "/academics/graduate", label: "Graduate Programs" },
                { href: "/admissions/apply", label: "Admissions" },
                { href: "/student-life/clubs", label: "Student Life" },
                { href: "/resources/library", label: "Library" }
              ].map(({ href, label }) => (
                <li key={href}>
                  <a 
                    href={href} 
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* News & Events */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
                <FaNewspaper className="text-lg text-white" />
              </div>
              <h3 className="font-bold text-lg text-white">News & Events</h3>
            </div>
            <ul className="space-y-3">
              {[
                { href: "/blog", label: "Latest News" },
                { href: "/events", label: "Upcoming Events" },
                { href: "/research", label: "Research Highlights" },
                { href: "/achievements", label: "Achievements" },
                { href: "/alumni", label: "Alumni Network" }
              ].map(({ href, label }) => (
                <li key={href}>
                  <a 
                    href={href} 
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                <FaMapMarkerAlt className="text-lg text-white" />
              </div>
              <h3 className="font-bold text-lg text-white">Contact Us</h3>
            </div>
            <address className="not-italic space-y-3 text-sm">
              {[
                { icon: FaMapMarkerAlt, text: "University of Hargeisa", color: "text-red-400" },
                { icon: FaMapMarkerAlt, text: "Hargeisa, Somaliland", color: "text-red-400" },
                { icon: FaEnvelope, text: "info@uoh.edu.so", color: "text-blue-400" },
                { icon: FaPhone, text: "+252 63 1234567", color: "text-green-400" }
              ].map(({ icon: Icon, text, color }, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300 group">
                  <Icon className={`text-base ${color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className="group-hover:text-white transition-colors duration-300">{text}</span>
                </div>
              ))}
            </address>
            
            {/* Newsletter Signup - Enhanced with Download */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-300 mb-2">Stay Updated</p>
              <div className="flex gap-2 mb-3">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-colors"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium">
                  Join
                </button>
              </div>
              {/* Mini Download Links */}
              <div className="flex justify-center gap-3 pt-2 border-t border-white/10">
                {downloadLinks.slice(2, 4).map(({ platform, icon: Icon, color, url }) => (
                  <a
                    key={platform}
                    href={url}
                    className={`p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors ${color}`}
                    title={`Download for ${platform}`}
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Download Links */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-400">
              &copy; {new Date().getFullYear()} University of Hargeisa. All rights reserved.
            </div>
            
            {/* Platform Downloads in Bottom Bar */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Download:</span>
              <div className="flex gap-3">
                {downloadLinks.map(({ platform, icon: Icon, color, url }) => (
                  <a
                    key={platform}
                    href={url}
                    className={`p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors ${color}`}
                    title={`Download for ${platform}`}
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="/sitemap" className="hover:text-white transition-colors duration-300">Sitemap</a>
            </div>
          </div>
          
          {/* System Status */}
          <div className="flex items-center justify-center gap-2 text-gray-400 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span><a href="/service" className="hover:text-white transition-colors duration-300">System Status: Operational</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}