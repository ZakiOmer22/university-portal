"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Clock, User } from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  profilePicture?: string;
  grade: number;
  attendancePercent: number;
  pendingAssignments: number;
}

const dummyStudents: Student[] = [
  { id: "s1", fullName: "Alice Johnson", grade: 98, attendancePercent: 100, pendingAssignments: 0 },
  { id: "s2", fullName: "Bob Smith", grade: 95, attendancePercent: 92, pendingAssignments: 1 },
  { id: "s3", fullName: "Charlie Lee", grade: 94, attendancePercent: 85, pendingAssignments: 2 },
  { id: "s4", fullName: "Diana Ross", grade: 89, attendancePercent: 90, pendingAssignments: 0 },
  { id: "s5", fullName: "Ethan Hunt", grade: 87, attendancePercent: 80, pendingAssignments: 3 },
];

export default function LeaderAllStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // you were previously using a hard-coded user; preserve that behavior
  const user = { fullName: "Leader User", role: "LEADER" };

  useEffect(() => {
    setTimeout(() => {
      try {
        setStudents(dummyStudents);
        setLoading(false);
      } catch {
        setError("Failed to load student data.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Non-invasive action handlers (placeholders)
  const handleView = (id: string) => {
    // keep this simple and synchronous per your current conventions
    alert(`View profile for student ${id}`);
  };

  const handleMessage = (id: string) => {
    alert(`Open message composer for student ${id}`);
  };

  const handleMarkPresent = (id: string) => {
    // small optimistic UI update (local only) so you can see action effect
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, attendancePercent: Math.min(100, s.attendancePercent + 1) } : s
      )
    );
    alert(`Marked ${id} present (local only)`);
  };

  return (
    <DashboardLayout user={user} loading={loading}>
      <section className="p-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-indigo-900">All Students</h2>
          <input
            type="text"
            placeholder="Search students..."
            className="border rounded-lg p-2 w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="flex items-start gap-2">
            <XCircle className="h-5 w-5 mt-0.5" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Student Table / Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition flex flex-col">
                <div className="flex items-center gap-4 mb-3">
                  {student.profilePicture ? (
                    <img
                      src={student.profilePicture}
                      alt={student.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <p className="font-semibold text-indigo-900">{student.fullName}</p>
                    <p className="text-sm text-gray-500">Grade: {student.grade}%</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Attendance</p>
                  <Badge
                    className={`${
                      student.attendancePercent >= 90
                        ? "bg-green-100 text-green-800"
                        : student.attendancePercent >= 75
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.attendancePercent}%
                  </Badge>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-600">Pending Assignments</p>
                  <Badge
                    className={`${
                      student.pendingAssignments === 0
                        ? "bg-green-100 text-green-800"
                        : student.pendingAssignments <= 2
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.pendingAssignments}
                  </Badge>
                </div>

                {/* --- ACTIONS (non-invasive, added at the bottom) --- */}
                <div className="mt-auto flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleView(student.id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
                    aria-label={`View ${student.fullName}`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleMessage(student.id)}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition text-sm"
                    aria-label={`Message ${student.fullName}`}
                  >
                    Message
                  </button>
                  <button
                    onClick={() => handleMarkPresent(student.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    aria-label={`Mark ${student.fullName} present`}
                  >
                    Mark Present
                  </button>
                </div>
                {/* --- end actions --- */}
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
