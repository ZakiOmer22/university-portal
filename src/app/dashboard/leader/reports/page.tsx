"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaFileAlt } from "react-icons/fa";

interface Report {
  id: string;
  studentName: string;
  course: string;
  grade: number;
  attendance: number; // percentage
  status: "good" | "warning" | "critical";
}

const dummyReports: Report[] = [
  { id: "r1", studentName: "Alice Johnson", course: "CS101", grade: 92, attendance: 95, status: "good" },
  { id: "r2", studentName: "Bob Smith", course: "MATH201", grade: 78, attendance: 82, status: "warning" },
  { id: "r3", studentName: "Charlie Brown", course: "PHY101", grade: 65, attendance: 70, status: "critical" },
  { id: "r4", studentName: "Dana White", course: "CS101", grade: 88, attendance: 90, status: "good" },
];

export default function LeaderReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  const user = { fullName: "Leader User", role: "LEADER" };

  useEffect(() => {
    setTimeout(() => {
      try {
        setReports(dummyReports);
        setLoading(false);
      } catch {
        setError("Failed to load reports.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    }
  };

  return (
    <DashboardLayout user={user} loading={loading}>
      <section className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-red-900 flex items-center gap-2">
          <FaFileAlt className="text-lg" /> Reports
        </h2>

        {error && (
          <Alert variant="destructive" className="flex items-start gap-2">
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="bg-white border border-red-200 rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-1">
                  <p className="font-semibold text-red-900">{r.studentName}</p>
                  <p className="text-sm text-gray-600">Course: {r.course}</p>
                  <p className="text-sm text-gray-600">Grade: {r.grade}%</p>
                  <p className="text-sm text-gray-600">Attendance: {r.attendance}%</p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center gap-2">
                  {getStatusBadge(r.status)}
                  <button
                    className="px-3 py-1 bg-red-900 text-white rounded hover:bg-red-800 transition"
                    onClick={() => alert(`Viewing detailed report for ${r.studentName}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
