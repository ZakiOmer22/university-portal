import React from "react";
import { User, BookOpen, FileText, ClipboardList, BarChart3 } from "lucide-react";

type Tab = "Account" | "Current Semester" | "Exams" | "Transcript" | "Reports";

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "Account", label: "Account", icon: <User size={18} /> },
  { id: "Current Semester", label: "Semester", icon: <BookOpen size={18} /> },
  { id: "Exams", label: "Exams", icon: <ClipboardList size={18} /> },
  { id: "Transcript", label: "Transcript", icon: <FileText size={18} /> },
  { id: "Reports", label: "Reports", icon: <BarChart3 size={18} /> },
];

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 mt-6">
      <nav
        className="flex flex-wrap gap-1"
        role="tablist"
        aria-label="Student details navigation"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }
              `}
            >
              <div className={`transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
                {tab.icon}
              </div>
              <span className="whitespace-nowrap">{tab.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}