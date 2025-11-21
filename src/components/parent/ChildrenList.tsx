import Link from "next/link";
import { User, GraduationCap, TrendingUp, ArrowRight } from "lucide-react";

interface ChildData {
  id: string;
  name: string;
  grade: string;
  gpa: number;
  avatar?: string;
  attendance?: number;
}

export default function ChildrenList({ children }: { children: ChildData[] }) {
  const getPerformanceColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600 bg-green-50 border-green-200";
    if (gpa >= 3.0) return "text-blue-600 bg-blue-50 border-blue-200";
    if (gpa >= 2.0) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getAttendanceColor = (attendance?: number) => {
    if (!attendance) return "text-gray-600";
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 80) return "text-blue-600";
    if (attendance >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Children&apos;s Progress</h3>
            <p className="text-gray-600 text-sm">Monitor academic performance and attendance</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {children.length} child{children.length !== 1 ? 'ren' : ''}
        </div>
      </div>

      {children.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No children data available</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="relative">
                    {child.avatar ? (
                      <img
                        src={child.avatar}
                        alt={child.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Child Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {child.name}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {child.grade}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      {/* GPA */}
                      <div className="flex items-center gap-1">
                        <GraduationCap size={14} className="text-gray-400" />
                        <span className="font-medium text-gray-700">GPA:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getPerformanceColor(child.gpa)}`}>
                          {child.gpa.toFixed(1)}
                        </span>
                      </div>

                      {/* Attendance */}
                      {child.attendance && (
                        <div className="flex items-center gap-1">
                          <TrendingUp size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-700">Attendance:</span>
                          <span className={`font-semibold ${getAttendanceColor(child.attendance)}`}>
                            {child.attendance}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <Link
                  href={`/dashboard/parent/child/${child.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 group-hover:shadow-sm"
                >
                  <span className="font-medium text-sm">View Details</span>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Footer */}
      {children.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {children.reduce((acc, child) => acc + child.gpa, 0) / children.length}
              </div>
              <div className="text-xs text-gray-600">Avg GPA</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {children.filter(child => child.gpa >= 3.0).length}
              </div>
              <div className="text-xs text-gray-600">Good Standing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {children.reduce((acc, child) => acc + (child.attendance || 0), 0) / children.length}%
              </div>
              <div className="text-xs text-gray-600">Avg Attendance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}