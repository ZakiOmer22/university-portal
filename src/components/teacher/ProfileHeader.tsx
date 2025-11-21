"use client";

import { useState, useRef, useEffect } from "react";
import { FaBell, FaCog, FaSignOutAlt, FaUser, FaChevronDown } from "react-icons/fa";

export default function ProfileHeader() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(true);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications = [
        { id: 1, text: "New assignment submitted", time: "5 min ago", unread: true },
        { id: 2, text: "Meeting in 15 minutes", time: "1 hour ago", unread: true },
        { id: 3, text: "Grade review requested", time: "2 hours ago", unread: false },
    ];

    return (
        <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <div className="relative">
                <button 
                    className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group relative"
                    onClick={() => setHasNotifications(false)}
                >
                    <FaBell className="text-gray-600 group-hover:text-indigo-600 transition-colors duration-200" />
                    {hasNotifications && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    )}
                    {hasNotifications && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 p-2 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200/60 group"
                >
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold">JD</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="hidden sm:block text-left">
                        <div className="font-semibold text-gray-900 text-sm">John Doe</div>
                        <div className="text-xs text-gray-500">Professor</div>
                    </div>
                    
                    <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/60 py-2 animate-in fade-in duration-200 z-50">
                        {/* Profile Summary */}
                        <div className="px-4 py-3 border-b border-gray-200/60">
                            <div className="font-semibold text-gray-900">John Doe</div>
                            <div className="text-sm text-gray-500">john.doe@university.edu</div>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Pro Plan</span>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                                <FaUser className="text-gray-400" />
                                My Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                                <FaCog className="text-gray-400" />
                                Settings
                            </button>
                        </div>

                        {/* Notifications Preview */}
                        <div className="px-4 py-2 border-t border-gray-200/60">
                            <div className="text-xs font-semibold text-gray-500 mb-2">RECENT NOTIFICATIONS</div>
                            <div className="space-y-2">
                                {notifications.slice(0, 2).map(notification => (
                                    <div key={notification.id} className={`text-xs p-2 rounded-lg ${notification.unread ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                        <div className="font-medium text-gray-900">{notification.text}</div>
                                        <div className="text-gray-500">{notification.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Logout */}
                        <div className="pt-2 border-t border-gray-200/60">
                            <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200">
                                <FaSignOutAlt />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}