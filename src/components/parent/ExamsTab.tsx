import React from "react";

interface Exam {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string; // ISO string
  location: string;
  time: string; // e.g. "9:00 AM - 12:00 PM"
  status: "Scheduled" | "Completed" | "Missed";
  grade?: string;
}

interface ExamsTabProps {
  exams: Exam[];
}

export default function ExamsTab({ exams }: ExamsTabProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Missed":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "";
    }
  };

  return (
    <section className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <h3 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
        Exams Overview
      </h3>

      {/* Empty State */}
      {exams.length === 0 ? (
        <p className="text-gray-700 italic text-center py-6">
          No exams scheduled or recorded.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
            <thead className="bg-indigo-100 text-indigo-900 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold border-b border-indigo-200">
                  Course
                </th>
                <th className="px-4 py-3 font-semibold border-b border-indigo-200">
                  Date
                </th>
                <th className="px-4 py-3 font-semibold border-b border-indigo-200">
                  Time
                </th>
                <th className="px-4 py-3 font-semibold border-b border-indigo-200">
                  Location
                </th>
                <th className="px-4 py-3 font-semibold border-b border-indigo-200">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold border-b border-indigo-200">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {exams.map(
                ({ id, courseCode, courseTitle, date, time, location, status, grade }) => (
                  <tr
                    key={id}
                    className="hover:bg-indigo-50 transition duration-150"
                  >
                    <td className="px-4 py-3 font-medium">
                      {courseTitle}{" "}
                      <span className="text-sm text-gray-500">
                        ({courseCode})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{time}</td>
                    <td className="px-4 py-3">{location}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {grade || "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
