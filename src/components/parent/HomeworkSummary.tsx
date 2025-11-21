import React from "react";
import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle, User } from "lucide-react";

interface Homework {
    id: string;
    title: string;
    dueDate: Date;
    status: "completed" | "pending" | "overdue";
    childName: string;
    subject?: string;
    priority?: "high" | "medium" | "low";
}

interface HomeworkSummaryProps {
    assignments: Homework[];
}

export default function HomeworkSummary({ assignments }: HomeworkSummaryProps) {
    const getStatusConfig = (status: Homework["status"]) => {
        switch (status) {
            case "completed":
                return {
                    class: "bg-green-50 text-green-700 border-green-200",
                    icon: <CheckCircle size={14} />,
                    text: "Completed"
                };
            case "pending":
                return {
                    class: "bg-blue-50 text-blue-700 border-blue-200",
                    icon: <Clock size={14} />,
                    text: "Pending"
                };
            case "overdue":
                return {
                    class: "bg-red-50 text-red-700 border-red-200",
                    icon: <AlertCircle size={14} />,
                    text: "Overdue"
                };
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case "high":
                return "border-l-red-400";
            case "medium":
                return "border-l-yellow-400";
            case "low":
                return "border-l-green-400";
            default:
                return "border-l-gray-400";
        }
    };

    const isDueSoon = (dueDate: Date) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2 && diffDays > 0;
    };

    const isOverdue = (dueDate: Date) => {
        return new Date(dueDate) < new Date();
    };

    const pendingAssignments = assignments.filter(a => a.status === "pending");
    const completedAssignments = assignments.filter(a => a.status === "completed");
    const overdueAssignments = assignments.filter(a => a.status === "overdue");

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Homework & Assignments</h3>
                        <p className="text-gray-600 text-sm">Track upcoming and completed work</p>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {assignments.length} total
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">{completedAssignments.length}</div>
                    <div className="text-xs text-green-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-700">{pendingAssignments.length}</div>
                    <div className="text-xs text-blue-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-700">{overdueAssignments.length}</div>
                    <div className="text-xs text-red-600">Overdue</div>
                </div>
            </div>

            {/* Assignments List */}
            {assignments.length === 0 ? (
                <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No homework assignments</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {assignments.map((assignment) => {
                        const statusConfig = getStatusConfig(assignment.status);
                        const dueSoon = isDueSoon(assignment.dueDate);
                        const overdue = isOverdue(assignment.dueDate) && assignment.status !== "completed";
                        
                        return (
                            <div
                                key={assignment.id}
                                className={`p-4 rounded-xl border-l-4 ${getPriorityColor(assignment.priority)} border border-gray-200 hover:shadow-md transition-all duration-200 ${
                                    overdue ? "bg-red-50 border-red-200" : "bg-gray-50"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-900 truncate">
                                                {assignment.title}
                                            </h4>
                                            {dueSoon && assignment.status === "pending" && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200">
                                                    <Clock size={10} />
                                                    Due Soon
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>{assignment.childName}</span>
                                            </div>
                                            {assignment.subject && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-gray-500">{assignment.subject}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 ml-4">
                                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.class}`}>
                                            {statusConfig.icon}
                                            {statusConfig.text}
                                        </div>
                                        {assignment.priority && assignment.priority !== "low" && (
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                assignment.priority === "high" 
                                                    ? "bg-red-100 text-red-700" 
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}