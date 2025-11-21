import React from "react";
import { Users, Plus, Settings } from "lucide-react";

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  enrollmentNumber: string;
  grade?: string;
  status?: "active" | "inactive";
}

interface SidebarProps {
  childrenList: Child[];
  activeChildId?: string;
  onChildChange: (id: string) => void;
  onAddChild?: () => void;
  onManageChildren?: () => void;
}

export default function Sidebar({
  childrenList,
  activeChildId,
  onChildChange,
  onAddChild,
  onManageChildren,
}: SidebarProps) {
  const activeChildren = childrenList.filter(child => child.status !== "inactive");
  const inactiveChildren = childrenList.filter(child => child.status === "inactive");

  return (
    <aside className="w-full md:w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col h-fit sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Users className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Children</h2>
          <p className="text-gray-600 text-sm">Manage and switch between profiles</p>
        </div>
      </div>

      {/* Active Children */}
      <div className="space-y-3 mb-6">
        {activeChildren.map((child) => {
          const isActive = child.id === activeChildId;
          
          return (
            <button
              key={child.id}
              onClick={() => onChildChange(child.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group ${
                isActive
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-25 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={child.profilePicture || `https://ui-avatars.com/api/?name=${child.firstName}+${child.lastName}&background=4f46e5&color=fff&size=128`}
                    alt={`${child.firstName} ${child.lastName}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {child.firstName} {child.lastName}
                    </h3>
                    {isActive && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="truncate">ID: {child.enrollmentNumber}</p>
                    {child.grade && (
                      <p className="text-indigo-600 font-medium">{child.grade}</p>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Inactive Children (Collapsible) */}
      {inactiveChildren.length > 0 && (
        <div className="mb-6">
          <details className="group">
            <summary className="flex items-center gap-2 text-sm text-gray-500 font-medium cursor-pointer list-none">
              <span>Inactive Children ({inactiveChildren.length})</span>
              <div className="w-2 h-2 border-r border-b border-gray-400 transform rotate-45 group-open:rotate-[-135deg] transition-transform" />
            </summary>
            
            <div className="mt-3 space-y-2">
              {inactiveChildren.map((child) => (
                <div
                  key={child.id}
                  className="p-3 rounded-lg bg-gray-100 text-gray-500 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={child.profilePicture || `https://ui-avatars.com/api/?name=${child.firstName}+${child.lastName}&background=6b7280&color=fff&size=64`}
                      alt={`${child.firstName} ${child.lastName}`}
                      className="w-8 h-8 rounded-full object-cover opacity-75"
                    />
                    <div>
                      <p className="font-medium">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs">Inactive</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <button
          onClick={onAddChild}
          className="w-full flex items-center gap-3 p-3 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          <Plus size={18} />
          <span>Add New Child</span>
        </button>
        
        <button
          onClick={onManageChildren}
          className="w-full flex items-center gap-3 p-3 text-gray-600 hover:text-gray-700 font-medium bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Settings size={18} />
          <span>Manage Children</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{activeChildren.length}</div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{childrenList.length}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </aside>
  );
}