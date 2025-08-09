"use client";
import Link from "next/link";
import { Home, BookOpen, Users, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-white dark:bg-gray-900 p-4">
      <nav className="space-y-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Home className="w-5 h-5" /> <span>Dashboard</span>
        </Link>
        <Link href="/courses" className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" /> <span>Courses</span>
        </Link>
        <Link href="/students" className="flex items-center space-x-2">
          <Users className="w-5 h-5" /> <span>Students</span>
        </Link>
        <Link href="/settings" className="flex items-center space-x-2">
          <Settings className="w-5 h-5" /> <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
