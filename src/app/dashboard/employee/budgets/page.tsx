"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface BudgetItem {
    id: string;
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    status: "On Track" | "Overspent" | "Warning";
}

const budgetData: BudgetItem[] = [
    {
        id: "1",
        category: "Library",
        allocated: 5000,
        spent: 4200,
        remaining: 800,
        status: "On Track",
    },
    {
        id: "2",
        category: "Sports",
        allocated: 3000,
        spent: 3500,
        remaining: -500,
        status: "Overspent",
    },
    {
        id: "3",
        category: "Laboratory",
        allocated: 8000,
        spent: 7200,
        remaining: 800,
        status: "Warning",
    },
];

export default function BudgetPage() {
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const filteredBudget = useMemo(() => {
        return budgetData.filter((item) =>
            statusFilter === "All" ? true : item.status === statusFilter
        );
    }, [statusFilter]);

    const totalOnTrack = budgetData.filter((b) => b.status === "On Track").length;
    const totalOverspent = budgetData.filter((b) => b.status === "Overspent").length;
    const totalWarning = budgetData.filter((b) => b.status === "Warning").length;

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold">Budget Overview</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-5 flex items-center gap-4">
                    <TrendingUp className="text-green-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">On Track</p>
                        <p className="text-2xl font-bold">{totalOnTrack}</p>
                    </div>
                </div>
                <div className="border-2 border-red-500 bg-red-50 rounded-lg p-5 flex items-center gap-4">
                    <TrendingDown className="text-red-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Overspent</p>
                        <p className="text-2xl font-bold">{totalOverspent}</p>
                    </div>
                </div>
                <div className="border-2 border-yellow-500 bg-yellow-50 rounded-lg p-5 flex items-center gap-4">
                    <AlertTriangle className="text-yellow-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Warning</p>
                        <p className="text-2xl font-bold">{totalWarning}</p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div>
                <label className="block mb-2 font-medium">Filter by Status</label>
                <select
                    className="p-2 border rounded"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All</option>
                    <option>On Track</option>
                    <option>Overspent</option>
                    <option>Warning</option>
                </select>
            </div>

            {/* Budget Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Allocated</th>
                            <th className="px-4 py-3 text-left">Spent</th>
                            <th className="px-4 py-3 text-left">Remaining</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBudget.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-500">
                                    No budget data found.
                                </td>
                            </tr>
                        ) : (
                            filteredBudget.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{item.category}</td>
                                    <td className="px-4 py-3">${item.allocated.toFixed(2)}</td>
                                    <td className="px-4 py-3">${item.spent.toFixed(2)}</td>
                                    <td
                                        className={`px-4 py-3 ${item.remaining < 0 ? "text-red-600" : "text-gray-800"
                                            }`}
                                    >
                                        ${item.remaining.toFixed(2)}
                                    </td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${item.status === "On Track"
                                                ? "text-green-600"
                                                : item.status === "Overspent"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                            }`}
                                    >
                                        {item.status}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
