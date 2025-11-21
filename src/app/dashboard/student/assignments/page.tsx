"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, CheckCircle2, XCircle, FileText, Calendar, BookOpen, Filter, Search, ArrowRight } from "lucide-react";

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    courseId: string;
    courseCode: string;
    courseName: string;
    status: "pending" | "completed" | "overdue";
    description?: string;
    points?: number;
    submittedDate?: string;
    priority?: "high" | "medium" | "low";
}

const dummyAssignments: Assignment[] = [
    {
        id: "a1",
        title: "Project Proposal",
        dueDate: "2025-08-20",
        courseId: "course-uuid-1",
        courseCode: "CS101",
        courseName: "Computer Science 101",
        status: "pending",
        description: "Submit a 2-page proposal outlining your final project idea and implementation plan.",
        points: 100,
        priority: "high"
    },
    {
        id: "a2",
        title: "Final Exam",
        dueDate: "2025-09-15",
        courseId: "course-uuid-1",
        courseCode: "CS101",
        courseName: "Computer Science 101",
        status: "pending",
        description: "Comprehensive final examination covering all course materials from weeks 1-12.",
        points: 200,
        priority: "high"
    },
    {
        id: "a3",
        title: "Homework 5 - Linear Algebra",
        dueDate: "2025-08-18",
        courseId: "course-uuid-2",
        courseCode: "MATH201",
        courseName: "Advanced Mathematics",
        status: "completed",
        description: "Practice problems on matrix operations and linear transformations.",
        points: 50,
        submittedDate: "2025-08-17",
        priority: "medium"
    },
    {
        id: "a4",
        title: "Midterm Exam",
        dueDate: "2025-08-25",
        courseId: "course-uuid-2",
        courseCode: "MATH201",
        courseName: "Advanced Mathematics",
        status: "pending",
        description: "Midterm examination covering chapters 1-5 of the textbook.",
        points: 150,
        priority: "high"
    },
    {
        id: "a5",
        title: "Research Paper Draft",
        dueDate: "2025-08-30",
        courseId: "course-uuid-3",
        courseCode: "ENG201",
        courseName: "Academic Writing",
        status: "pending",
        description: "First draft of your research paper on a topic of your choice.",
        points: 75,
        priority: "medium"
    },
    {
        id: "a6",
        title: "Lab Report 3",
        dueDate: "2025-08-15",
        courseId: "course-uuid-4",
        courseCode: "PHY101",
        courseName: "Physics I",
        status: "overdue",
        description: "Laboratory report on Newton's Laws of Motion experiment.",
        points: 80,
        priority: "high"
    },
];

function StatusBadge({ status }: { status: Assignment["status"] }) {
    switch (status) {
        case "pending":
            return (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                    <Clock size={14} />
                    Pending
                </Badge>
            );
        case "completed":
            return (
                <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Completed
                </Badge>
            );
        case "overdue":
            return (
                <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                    <XCircle size={14} />
                    Overdue
                </Badge>
            );
    }
}

function PriorityBadge({ priority }: { priority: Assignment["priority"] }) {
    switch (priority) {
        case "high":
            return <Badge className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>;
        case "medium":
            return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium Priority</Badge>;
        case "low":
            return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low Priority</Badge>;
        default:
            return null;
    }
}

export default function AssignmentsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        setLoading(true);
        setError(null);

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

    // Filter assignments based on status and search
    const filteredAssignments = assignments.filter(assignment => {
        const matchesFilter = filter === "all" || assignment.status === filter;
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const pendingCount = assignments.filter(a => a.status === "pending").length;
    const completedCount = assignments.filter(a => a.status === "completed").length;
    const overdueCount = assignments.filter(a => a.status === "overdue").length;
    const totalPoints = assignments.reduce((sum, a) => sum + (a.points || 0), 0);

    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                        <p className="text-gray-600 mt-1">Manage and track your academic assignments</p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-sm py-1 px-3">
                        {assignments.length} Total
                    </Badge>
                </div>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2 border-red-200 bg-red-50">
                        <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                        <div>
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Summary Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <Clock className="w-6 h-6 text-amber-200" />
                                <div className="text-amber-200 text-sm font-medium">Pending</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{pendingCount}</div>
                            <div className="text-amber-200 text-sm">Awaiting Submission</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-200" />
                                <div className="text-green-200 text-sm font-medium">Completed</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{completedCount}</div>
                            <div className="text-green-200 text-sm">Submitted</div>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <XCircle className="w-6 h-6 text-red-200" />
                                <div className="text-red-200 text-sm font-medium">Overdue</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{overdueCount}</div>
                            <div className="text-red-200 text-sm">Past Due</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <FileText className="w-6 h-6 text-blue-200" />
                                <div className="text-blue-200 text-sm font-medium">Total Points</div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{totalPoints}</div>
                            <div className="text-blue-200 text-sm">Available</div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search assignments by title, course, or code..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as "all" | "pending" | "completed" | "overdue")}
                                >
                                    <option value="all">All Assignments</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredAssignments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {searchTerm || filter !== "all" 
                                ? "No assignments match your search criteria. Try adjusting your filters."
                                : "No assignments are currently available."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredAssignments.map((assignment) => {
                            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                            const isUrgent = daysUntilDue <= 2 && assignment.status === "pending";

                            return (
                                <div
                                    key={assignment.id}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${
                                        assignment.status === "overdue"
                                            ? "border-red-200 bg-red-50/50"
                                            : assignment.status === "completed"
                                            ? "border-green-200 bg-green-50/50"
                                            : isUrgent
                                            ? "border-amber-200 bg-amber-50/50"
                                            : "border-amber-100"
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        {/* Assignment Information */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`bg-gradient-to-r ${
                                                            assignment.status === "completed" ? "from-green-500 to-emerald-600" :
                                                            assignment.status === "overdue" ? "from-red-500 to-pink-600" :
                                                            "from-amber-500 to-orange-600"
                                                        } w-3 h-8 rounded-full`}></div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {assignment.title}
                                                            </h3>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                                    {assignment.courseCode}
                                                                </Badge>
                                                                <span className="text-sm text-gray-500">{assignment.courseName}</span>
                                                                {assignment.priority && <PriorityBadge priority={assignment.priority} />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {assignment.description && (
                                                        <p className="text-gray-600 mt-2">{assignment.description}</p>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                                {assignment.status === "pending" && (
                                                                    <span className={`ml-2 font-medium ${
                                                                        daysUntilDue < 0 
                                                                            ? "text-red-600"
                                                                            : daysUntilDue <= 2
                                                                            ? "text-amber-600"
                                                                            : "text-green-600"
                                                                    }`}>
                                                                        ({daysUntilDue < 0 ? Math.abs(daysUntilDue) + " days ago" : daysUntilDue + " days left"})
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {assignment.points && (
                                                            <div className="flex items-center gap-1">
                                                                <FileText className="w-4 h-4" />
                                                                <span>{assignment.points} points</span>
                                                            </div>
                                                        )}
                                                        {assignment.submittedDate && (
                                                            <div className="flex items-center gap-1 text-green-600">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                <span>Submitted {new Date(assignment.submittedDate).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Section */}
                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 items-start lg:items-end justify-between lg:justify-start">
                                            <StatusBadge status={assignment.status} />
                                            <Link
                                                href={`/dashboard/student/assignments/${assignment.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium"
                                            >
                                                View Details
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}