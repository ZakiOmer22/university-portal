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

export default function Navbar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

  return (
    <nav ref={navRef} className="bg-indigo-900/95 sticky top-0 z-50 shadow-lg w-full" role="navigation" aria-label="Primary">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icon.png" alt="University Logo" width={50} height={50} />
          <span className="font-bold text-2xl tracking-wide text-white">University Portal</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-semibold text-white">
          {menuItems.map((item, idx) => (
            <li
              key={item.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="py-2 px-3 hover:text-indigo-300 transition flex items-center gap-1"
                aria-expanded={openIndex === idx}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {item.title}
                <svg
                  className={`w-4 h-4 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul
                className={`absolute left-0 top-full mt-2 w-56 bg-indigo-800 rounded-md shadow-lg transition-opacity duration-200 ${openIndex === idx ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
              >
                {item.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-white hover:bg-indigo-700"
                      onClick={() => setOpenIndex(null)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* User Section */}
        <div className="hidden md:flex items-center gap-6 relative" ref={profileRef}>
          {user ? (
            <>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 text-white focus:outline-none"
              >
                <div className="flex flex-col text-right">
                  <span className="font-semibold capitalize">{firstName}</span>
                  <span className="text-xs text-indigo-300">{user.role}</span>
                </div>
                <Image
                  src={user.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  width={42}
                  height={42}
                  className="rounded-full border border-white shadow"
                />
              </button>
              {profileDropdownOpen && (
                <ul className="absolute right-0 top-full mt-2 w-56 bg-indigo-800 rounded-md shadow-lg py-2 text-white z-50">
                  <li>
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 hover:bg-indigo-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/settings"
                      className="block px-4 py-2 hover:bg-indigo-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-indigo-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="border-t border-indigo-700 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-700"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-5 py-2 rounded bg-white text-indigo-700 font-semibold hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 rounded border border-white font-semibold hover:bg-indigo-800"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? (
            // X icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-900/95 border-t border-indigo-700">
          <ul className="flex flex-col p-4 space-y-4 text-white text-sm font-semibold">
            {menuItems.map((item) => (
              <li key={item.title}>
                <details>
                  <summary className="cursor-pointer select-none py-2 px-3 rounded hover:bg-indigo-800">
                    {item.title}
                  </summary>
                  <ul className="pl-6 mt-2 space-y-1">
                    {item.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block py-1 px-3 rounded hover:bg-indigo-800"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}

            {/* Mobile User Section */}
            <li className="border-t border-indigo-700 pt-4">
              {user ? (
                <div className="space-y-2">
                  <p className="px-3 font-semibold">Hello, {firstName}</p>
                  <Link
                    href="/profile"
                    className="block py-1 px-3 rounded hover:bg-indigo-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/account/settings"
                    className="block py-1 px-3 rounded hover:bg-indigo-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block py-1 px-3 rounded hover:bg-indigo-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-1 px-3 rounded hover:bg-indigo-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link
                    href="/auth/login"
                    className="block py-2 px-3 rounded bg-white text-indigo-700 font-semibold hover:bg-gray-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block py-2 px-3 rounded border border-white font-semibold hover:bg-indigo-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
