"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell, ChevronDown, Command as CommandIcon } from "lucide-react";

interface User {
    fullName?: string;
    role?: string;
    profilePicture?: string;
}

interface AdminHeaderProps {
    user?: User | null;
    onSidebarToggle?: () => void;
    onSwitchToFrontend?: () => void;
    onOpenCommandDialog?: () => void;
}

export default function AdminHeader({
    user,
    onSidebarToggle,
    onSwitchToFrontend,
    onOpenCommandDialog,
}: AdminHeaderProps) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click (this stays)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const firstName = user?.fullName?.split(" ")[0] || "Guest";

    return (
        <header className="flex items-center justify-between bg-indigo-700 px-4 sm:px-6 py-3 text-white shadow-md sticky top-0 z-50">
            {/* Hamburger on far left */}
            <button
                onClick={onSidebarToggle}
                className="p-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white md:hidden"
                aria-label="Toggle sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Command input as a button centered */}
            <div className="flex-grow flex justify-center">
                <button
                    onClick={onOpenCommandDialog}
                    aria-label="Open command palette"
                    className="w-full max-w-xl bg-indigo-600 hover:bg-indigo-500 rounded-md px-4 py-2 text-white text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    <CommandIcon size={18} />
                    <span className="text-indigo-200 truncate">Type a command or search...</span>
                </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
                {/* Notifications dropdown */}
                <div className="relative" ref={notificationsRef}>
                    <button
                        onClick={() => setNotificationsOpen((open) => !open)}
                        className="p-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Toggle notifications"
                        aria-expanded={notificationsOpen}
                    >
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-indigo-800 rounded-md shadow-lg py-2 text-white text-sm z-50">
                            <p className="px-4 py-2 border-b border-indigo-700 font-semibold">Notifications</p>
                            <div className="max-h-48 overflow-y-auto">
                                <p className="px-4 py-2 hover:bg-indigo-700 cursor-pointer">No new notifications</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileDropdownOpen((open) => !open)}
                        className="flex items-center gap-2 rounded hover:bg-indigo-600 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-haspopup="true"
                        aria-expanded={profileDropdownOpen}
                        aria-label="User profile menu"
                    >
                        <Avatar>
                            {user?.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt={user.fullName || "User"} />
                            ) : (
                                <AvatarFallback>{user?.fullName?.[0] || "U"}</AvatarFallback>
                            )}
                        </Avatar>
                        <div className="hidden sm:flex flex-col leading-tight text-right">
                            <span className="font-semibold">{firstName}</span>
                            <span className="text-xs text-indigo-200">{user?.role || "Unknown"}</span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`${profileDropdownOpen ? "rotate-180" : ""} transition-transform`}
                        />
                    </button>

                    {profileDropdownOpen && (
                        <ul
                            className="absolute right-0 mt-2 w-48 bg-indigo-800 rounded-md shadow-lg py-2 text-white text-sm z-50"
                            role="menu"
                            aria-label="Profile options"
                        >
                            <li>
                                <a
                                    href="/account/profile"
                                    className="block px-4 py-2 hover:bg-indigo-700"
                                    role="menuitem"
                                    onClick={() => setProfileDropdownOpen(false)}
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/account/settings"
                                    className="block px-4 py-2 hover:bg-indigo-700"
                                    role="menuitem"
                                    onClick={() => setProfileDropdownOpen(false)}
                                >
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/dashboard"
                                    className="block px-4 py-2 hover:bg-indigo-700"
                                    role="menuitem"
                                    onClick={() => setProfileDropdownOpen(false)}
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li className="border-t border-indigo-700 mt-2">
                                <button
                                    onClick={() => {
                                        setProfileDropdownOpen(false);
                                        localStorage.removeItem("user");
                                        window.location.href = "/";
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-indigo-700"
                                    role="menuitem"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </header>
    );
}
