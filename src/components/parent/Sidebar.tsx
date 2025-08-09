import React from "react";

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  enrollmentNumber: string;
}

interface SidebarProps {
  childrenList: Child[];
  activeChildId?: string;
  onChildChange: (id: string) => void;
}

export default function Sidebar({
  childrenList,
  activeChildId,
  onChildChange,
}: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow p-6 flex flex-col items-center sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-indigo-900 tracking-wide">
        Children
      </h2>
      <div className="flex flex-col gap-4 w-full">
        {childrenList.map((child) => {
          const isActive = child.id === activeChildId;
          return (
            <button
              key={child.id}
              onClick={() => onChildChange(child.id)}
              aria-pressed={isActive}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg shadow-sm transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
                ${isActive
                  ? "border-2 border-indigo-600 text-indigo-900 font-semibold shadow"
                  : "border border-transparent text-gray-800 hover:bg-indigo-50 hover:shadow focus-visible:bg-indigo-100"
                }
              `}
            >
              <img
                src={child.profilePicture || ""}
                alt={`${child.firstName} ${child.lastName}`}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${child.firstName}+${child.lastName}&background=4f46e5&color=fff&size=128`;
                }}
              />
              <div className="flex flex-col text-left">
                <span className="capitalize text-lg">
                  {child.firstName} {child.lastName}
                </span>
                <small className="text-indigo-700 font-semibold">
                  Enrollment: {child.enrollmentNumber}
                </small>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
