import React from "react";
import { Calendar, Clock, MapPin, BookOpen, CheckCircle, Clock as ClockIcon, XCircle } from "lucide-react";

interface Exam {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  location: string;
  time: string;
  status: "Scheduled" | "Completed" | "Missed";
  grade?: string;
}

interface ExamsTabProps {
  exams: Exam[];
}

export default function ExamsTab({ exams }: ExamsTabProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Scheduled":
        return {
          class: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <ClockIcon className="w-4 h-4" />,
          text: "Upcoming"
        };
      case "Completed":
        return {
          class: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Completed"
        };
      case "Missed":
        return {
          class: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          text: "Missed"
        };
      default:
        return {
          class: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <ClockIcon className="w-4 h-4" />,
          text: status
        };
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade || grade === "-") return "text-gray-500";
    if (["A", "A-", "A+"].includes(grade)) return "text-green-600";
    if (["B", "B+", "B-"].includes(grade)) return "text-blue-600";
    if (["C", "C+", "C-"].includes(grade)) return "text-yellow-600";
    return "text-red-600";
  };

  const upcomingExams = exams.filter(exam => exam.status === "Scheduled");
  const completedExams = exams.filter(exam => exam.status === "Completed");

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingExams.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <ClockIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedExams.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Exams Overview</h3>
              <p className="text-gray-600 text-sm">All scheduled and completed examinations</p>
            </div>
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Exams Found</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              No exam data available for the current academic period.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.map((exam) => {
                  const statusConfig = getStatusConfig(exam.status);
                  const isUpcoming = exam.status === "Scheduled";
                  const examDate = new Date(exam.date);
                  const isToday = examDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <tr key={exam.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {exam.courseTitle}
                          </span>
                          <span className="text-sm text-gray-500">{exam.courseCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar size={14} className="text-gray-400" />
                            <span className={isToday ? "font-semibold text-orange-600" : ""}>
                              {examDate.toLocaleDateString()}
                              {isToday && " (Today)"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={14} className="text-gray-400" />
                            <span>{exam.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{exam.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.class}`}>
                          {statusConfig.icon}
                          {statusConfig.text}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${getGradeColor(exam.grade)}`}>
                          {exam.grade || (isUpcoming ? "-" : "Pending")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}