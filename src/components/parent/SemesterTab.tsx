import React from "react";
import { CalendarDays, MapPin, User, BookOpen } from "lucide-react"; // Icons

interface Class {
  code: string;
  title: string;
  instructor: string;
  schedule?: string;
  credits?: number;
  location?: string;
}

interface SemesterTabProps {
  classes: Class[];
}

export default function SemesterTab({ classes }: SemesterTabProps) {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-indigo-900 mb-6">
        Current Semester Classes
      </h3>

      {classes.length === 0 ? (
        <p className="text-gray-700 italic">No classes enrolled this semester.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classes.map(({ code, title, instructor, schedule, credits, location }) => (
            <div
              key={code}
              className="p-5 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm hover:shadow-md transition cursor-default"
              tabIndex={0}
              aria-label={`Class ${title} (${code})`}
            >
              <h4 className="font-semibold text-indigo-800 text-lg">{title}</h4>
              <p className="text-indigo-600 font-medium text-sm">{code}</p>

              <div className="mt-3 space-y-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-indigo-500" />
                  <span><strong>Instructor:</strong> {instructor}</span>
                </p>

                {schedule && (
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-indigo-500" />
                    <span><strong>Schedule:</strong> {schedule}</span>
                  </p>
                )}

                {location && (
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-500" />
                    <span><strong>Location:</strong> {location}</span>
                  </p>
                )}

                {credits !== undefined && (
                  <p className="flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-500" />
                    <span><strong>Credits:</strong> {credits}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
