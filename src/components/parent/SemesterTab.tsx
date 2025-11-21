import React from "react";
import { CalendarDays, MapPin, User, BookOpen, Clock, Building } from "lucide-react";

interface Class {
  code: string;
  title: string;
  instructor: string;
  schedule?: string;
  credits?: number;
  location?: string;
  room?: string;
  time?: string;
  days?: string[];
  currentGrade?: string;
}

interface SemesterTabProps {
  classes: Class[];
  semester?: string;
}

export default function SemesterTab({ classes, semester = "Fall 2024" }: SemesterTabProps) {
  const getGradeColor = (grade?: string) => {
    if (!grade) return "text-gray-500";
    if (["A", "A-", "A+"].includes(grade)) return "text-green-600";
    if (["B", "B+", "B-"].includes(grade)) return "text-blue-600";
    if (["C", "C+", "C-"].includes(grade)) return "text-yellow-600";
    return "text-red-600";
  };

  const totalCredits = classes.reduce((sum, cls) => sum + (cls.credits || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Current Semester</h2>
            <p className="text-indigo-100 text-lg">{semester}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{classes.length}</div>
            <div className="text-indigo-100">Classes</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-200" />
            <span>{totalCredits} Total Credits</span>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Enrolled</h3>
          <p className="text-gray-500">No classes found for the current semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem.code}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Class Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors truncate">
                    {classItem.title}
                  </h3>
                  <p className="text-indigo-600 font-medium text-sm">{classItem.code}</p>
                </div>
                
                {classItem.currentGrade && (
                  <div className={`text-right ${getGradeColor(classItem.currentGrade)}`}>
                    <div className="text-2xl font-bold">{classItem.currentGrade}</div>
                    <div className="text-xs font-medium">Current Grade</div>
                  </div>
                )}
              </div>

              {/* Class Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <User size={16} className="text-indigo-500 flex-shrink-0" />
                  <span className="font-medium">Instructor:</span>
                  <span className="text-gray-600">{classItem.instructor}</span>
                </div>

                {classItem.schedule && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <CalendarDays size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="font-medium">Schedule:</span>
                    <span className="text-gray-600">{classItem.schedule}</span>
                  </div>
                )}

                {classItem.time && classItem.days && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Clock size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="font-medium">Time:</span>
                    <span className="text-gray-600">
                      {classItem.days.join(", ")} • {classItem.time}
                    </span>
                  </div>
                )}

                {classItem.location && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="font-medium">Location:</span>
                    <span className="text-gray-600">{classItem.location}</span>
                  </div>
                )}

                {classItem.room && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Building size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="font-medium">Room:</span>
                    <span className="text-gray-600">{classItem.room}</span>
                  </div>
                )}

                {classItem.credits !== undefined && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <BookOpen size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className="font-medium">Credits:</span>
                    <span className="text-gray-600">{classItem.credits}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button className="flex-1 py-2 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  View Syllabus
                </button>
                <button className="flex-1 py-2 text-center text-sm text-gray-600 hover:text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Assignments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}