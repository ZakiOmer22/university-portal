"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/leader/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
  submissions: number;
  totalStudents: number;
}

const dummyAssignments: Assignment[] = [
  { id: "a1", title: "Math Homework 5", course: "MATH201", dueDate: "2025-08-18", status: "completed", submissions: 28, totalStudents: 30 },
  { id: "a2", title: "Project Proposal", course: "CS101", dueDate: "2025-08-20", status: "pending", submissions: 15, totalStudents: 30 },
  { id: "a3", title: "Midterm Exam", course: "CS101", dueDate: "2025-08-25", status: "pending", submissions: 0, totalStudents: 30 },
  { id: "a4", title: "Physics Lab Report", course: "PHY101", dueDate: "2025-08-22", status: "overdue", submissions: 10, totalStudents: 30 },
];

export default function LeaderAssignmentsPage() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = { fullName: "Leader User", role: "LEADER" };

  useEffect(() => {
    setTimeout(() => {
      try {
        setAssignments(dummyAssignments);
        setLoading(false);
      } catch {
        setError("Failed to load assignments.");
        setLoading(false);
      }
    }, 1200);
  }, []);

  const handleAction = (assignment: Assignment) => {
    alert(`You clicked action for: ${assignment.title}`);
    // This could be expanded for "View Submissions", "Send Reminder", etc.
  };

  return (
    <DashboardLayout user={user} loading={loading}>
      <section className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-900">All Assignments</h2>

        {error && (
          <Alert variant="destructive" className="flex items-start gap-2">
            <XCircle className="h-5 w-5 mt-0.5" />
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
        ) : assignments.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((a) => (
              <div key={a.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-indigo-900">{a.title}</p>
                  <p className="text-sm text-gray-500 mb-1">Course: {a.course}</p>
                  <p className="text-sm text-gray-500 mb-1">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    Submissions: {a.submissions}/{a.totalStudents}
                  </p>
                  <Badge
                    className={`${
                      a.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : a.status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleAction(a)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    View / Action
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
