"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const menuItems = [
  {
    title: "Academics",
    links: [
      { label: "Undergraduate Programs", href: "/academics/undergraduate" },
      { label: "Graduate Programs", href: "/academics/graduate" },
      { label: "Online Learning", href: "/academics/online" },
      { label: "Academic Calendar", href: "/academics/calendar" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { label: "Apply Now", href: "/admissions/apply" },
      { label: "Tuition & Fees", href: "/admissions/tuition" },
      { label: "Scholarships", href: "/admissions/scholarships" },
      { label: "Campus Visits", href: "/admissions/visit" },
    ],
  },
  {
    title: "Departments",
    links: [
      { label: "Computer Science", href: "/departments/cs" },
      { label: "Engineering", href: "/departments/engineering" },
      { label: "Business", href: "/departments/business" },
      { label: "Humanities", href: "/departments/humanities" },
      { label: "Sciences", href: "/departments/sciences" },
    ],
  },
  {
    title: "Student Life",
    links: [
      { label: "Clubs & Organizations", href: "/student-life/clubs" },
      { label: "Housing & Dining", href: "/student-life/housing" },
      { label: "Health & Wellness", href: "/student-life/health" },
      { label: "Career Services", href: "/student-life/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Library", href: "/resources/library" },
      { label: "IT Support", href: "/resources/it-support" },
      { label: "Campus Map", href: "/resources/map" },
      { label: "Contact Us", href: "/resources/contact" },
    ],
  },
];

export default function Navbar({ bannerOpen }: { bannerOpen: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenIndex(null);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (idx: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenIndex(idx);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setOpenIndex(null), 200);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setProfileDropdownOpen(false);
    window.location.href = "/";
  };

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "";

  const navbarTopClass = bannerOpen ? "top-[0px]" : "top-0";

  return (
    <nav
      ref={navRef}
      className={`bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800/95 backdrop-blur-lg sticky z-40 shadow-2xl w-full transition-all duration-500 ${
        scrolled ? "shadow-2xl py-2" : "shadow-lg py-3"
      } ${navbarTopClass}`}
      role="navigation"
      aria-label="Primary"
    >
      <div className="w-full px-4 lg:px-8 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            <Image 
              src="/icon.png" 
              alt="University Logo" 
              width={50} 
              height={50} 
              className="relative transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl lg:text-2xl tracking-wide text-white drop-shadow-lg">
              University Portal
            </span>
            <span className="text-xs text-indigo-200 opacity-80 font-medium">
              Excellence in Education
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-1 text-sm font-semibold text-white">
          {menuItems.map((item, idx) => (
            <li
              key={item.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="py-3 px-4 hover:text-indigo-300 transition-all duration-300 flex items-center gap-2 rounded-lg hover:bg-white/10 group"
                aria-expanded={openIndex === idx}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="relative">
                  {item.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-300 group-hover:w-full transition-all duration-300"></span>
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${openIndex === idx ? "rotate-180 text-indigo-300" : "text-indigo-200"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute left-0 top-full mt-1 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 transition-all duration-300 transform origin-top ${
                  openIndex === idx ? "opacity-100 visible scale-100 translate-y-0" : "opacity-0 invisible scale-95 -translate-y-2"
                }`}
              >
                <div className="p-2">
                  {item.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 text-gray-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:translate-x-1 hover:text-indigo-700 font-medium"
                      onClick={() => setOpenIndex(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop User Section */}
        <div className="hidden lg:flex items-center gap-4 relative" ref={profileRef}>
          {user ? (
            <>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 text-white focus:outline-none group"
              >
                <div className="flex flex-col text-right">
                  <span className="font-semibold capitalize text-sm group-hover:text-indigo-300 transition-colors">
                    {firstName}
                  </span>
                  <span className="text-xs text-indigo-300 bg-indigo-800/50 px-2 py-0.5 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-sm group-hover:blur transition-all duration-300"></div>
                  <Image
                    src={user.profilePicture || "/default-avatar.png"}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="relative rounded-full border-2 border-white/30 shadow-lg group-hover:border-indigo-300 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 py-2 text-gray-800 z-50 transform origin-top-right transition-all duration-300">
                  <div className="p-2">
                    <div className="px-4 py-3 border-b border-gray-200/50">
                      <p className="font-semibold text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    </div>
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:translate-x-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/account/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:translate-x-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span>Account Settings</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:translate-x-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <span>Dashboard</span>
                    </Link>
                    <div className="border-t border-gray-200/50 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 rounded-lg transition-all duration-200 text-red-600 hover:translate-x-1"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-6 py-2.5 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-gray-50 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2.5 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-3 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <div className="relative w-6 h-6">
            <span className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
            <span className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`absolute top-1/2 left-0 w-6 h-0.5 bg-white transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-gradient-to-b from-indigo-900 to-purple-900/95 backdrop-blur-lg border-t border-white/10 transition-all duration-500 overflow-hidden ${
        mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="p-6 space-y-6">
          {menuItems.map((item) => (
            <div key={item.title} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
              <details className="group">
                <summary className="cursor-pointer select-none py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-between text-white font-semibold text-lg">
                  {item.title}
                  <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pl-4 mt-3 space-y-2">
                  {item.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-2.5 px-4 rounded-lg hover:bg-white/10 text-indigo-100 transition-all duration-300 hover:translate-x-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          ))}

          {/* Mobile User Section */}
          <div className="border-t border-white/10 pt-6">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl">
                  <Image
                    src={user.profilePicture || "/default-avatar.png"}
                    alt="Profile"
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-white/30"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">{user.fullName}</p>
                    <p className="text-indigo-200 text-sm capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/account/profile"
                    className="flex items-center gap-2 py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white text-center justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white text-center justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-3 px-4 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 transition-all duration-300 text-red-200 justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className="py-3 px-4 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-gray-100 transition-all duration-300 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="py-3 px-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-indigo-700 transition-all duration-300 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}