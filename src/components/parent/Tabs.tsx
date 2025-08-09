import React from "react";

type Tab = "Account" | "Current Semester" | "Exams" | "Transcript" | "Reports";

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabs: Tab[] = [
  "Account",
  "Current Semester",
  "Exams",
  "Transcript",
  "Reports",
];

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <nav
      className="flex flex-wrap gap-3 bg-white border rounded-lg px-4 py-3 shadow-sm mt-6"
      role="tablist"
      aria-label="Child details tabs"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md font-medium transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1
              ${
                isActive
                  ? "border-2 border-indigo-600 text-indigo-900 shadow-sm"
                  : "border border-transparent text-gray-700 hover:border-indigo-400 hover:text-indigo-700"
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
}
