"use client";

import { useState, useMemo } from "react";
import { LogIn, Edit3, Trash2, PlusCircle } from "lucide-react";

interface Activity {
    id: string;
    user: string;
    action: "Login" | "Update" | "Delete" | "Create";
    description: string;
    date: string;
}

const sampleActivities: Activity[] = [
    {
        id: "1",
        user: "John Doe",
        action: "Login",
        description: "Logged into the system",
        date: "2025-08-10 09:15 AM",
    },
    {
        id: "2",
        user: "Jane Smith",
        action: "Update",
        description: "Updated student profile for Alex Brown",
        date: "2025-08-10 10:05 AM",
    },
    {
        id: "3",
        user: "Admin",
        action: "Delete",
        description: "Removed old course materials",
        date: "2025-08-09 04:20 PM",
    },
    {
        id: "4",
        user: "Mark Lee",
        action: "Create",
        description: "Created new budget category for Sports",
        date: "2025-08-09 01:50 PM",
    },
];

export default function ActivityLogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("All");

    const filteredActivities = useMemo(() => {
        return sampleActivities.filter((activity) => {
            const matchesSearch =
                activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                actionFilter === "All" ? true : activity.action === actionFilter;

            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, actionFilter]);

    const getActionIcon = (action: string) => {
        switch (action) {
            case "Login":
                return <LogIn className="text-blue-500" size={20} />;
            case "Update":
                return <Edit3 className="text-yellow-500" size={20} />;
            case "Delete":
                return <Trash2 className="text-red-500" size={20} />;
            case "Create":
                return <PlusCircle className="text-green-500" size={20} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold">Activity Log</h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search by user or description..."
                    className="p-2 border rounded w-full sm:w-1/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="p-2 border rounded w-full sm:w-1/4"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                >
                    <option value="All">All Actions</option>
                    <option value="Login">Login</option>
                    <option value="Update">Update</option>
                    <option value="Delete">Delete</option>
                    <option value="Create">Create</option>
                </select>
            </div>

            {/* Activity Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Action</th>
                            <th className="px-4 py-3 text-left">Description</th>
                            <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActivities.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No activities found.
                                </td>
                            </tr>
                        ) : (
                            filteredActivities.map((activity, idx) => (
                                <tr
                                    key={activity.id}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium">{activity.user}</td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        {getActionIcon(activity.action)}
                                        {activity.action}
                                    </td>
                                    <td className="px-4 py-3">{activity.description}</td>
                                    <td className="px-4 py-3 text-gray-500">{activity.date}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
