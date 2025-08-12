"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

interface ComplianceRecord {
    id: string;
    policyName: string;
    department: string;
    lastAudit: string;
    status: "Compliant" | "Partial" | "Non-Compliant";
}

const complianceData: ComplianceRecord[] = [
    { id: "1", policyName: "Data Protection Policy", department: "IT", lastAudit: "2025-07-01", status: "Compliant" },
    { id: "2", policyName: "Fire Safety Protocol", department: "Facilities", lastAudit: "2025-06-15", status: "Partial" },
    { id: "3", policyName: "Financial Reporting Standards", department: "Accounts", lastAudit: "2025-05-20", status: "Non-Compliant" },
    { id: "4", policyName: "Cybersecurity Guidelines", department: "IT", lastAudit: "2025-07-05", status: "Compliant" },
    { id: "5", policyName: "Environmental Regulations", department: "Operations", lastAudit: "2025-04-10", status: "Partial" },
];

export default function CompliancePage() {
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const filteredCompliance = useMemo(() => {
        return complianceData.filter((c) => (statusFilter === "All" ? true : c.status === statusFilter));
    }, [statusFilter]);

    const totalCompliant = complianceData.filter(c => c.status === "Compliant").length;
    const totalPartial = complianceData.filter(c => c.status === "Partial").length;
    const totalNonCompliant = complianceData.filter(c => c.status === "Non-Compliant").length;

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold">Compliance</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-5 flex items-center gap-4">
                    <ShieldCheck className="text-green-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Compliant</p>
                        <p className="text-2xl font-bold">{totalCompliant}</p>
                    </div>
                </div>
                <div className="border-2 border-yellow-500 bg-yellow-50 rounded-lg p-5 flex items-center gap-4">
                    <AlertTriangle className="text-yellow-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Partial</p>
                        <p className="text-2xl font-bold">{totalPartial}</p>
                    </div>
                </div>
                <div className="border-2 border-red-500 bg-red-50 rounded-lg p-5 flex items-center gap-4">
                    <XCircle className="text-red-600" size={40} />
                    <div>
                        <p className="text-gray-600 font-medium">Non-Compliant</p>
                        <p className="text-2xl font-bold">{totalNonCompliant}</p>
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
                    <option>Compliant</option>
                    <option>Partial</option>
                    <option>Non-Compliant</option>
                </select>
            </div>

            {/* Compliance Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Policy Name</th>
                            <th className="px-4 py-3 text-left">Department</th>
                            <th className="px-4 py-3 text-left">Last Audit</th>
                            <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompliance.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No compliance records found.
                                </td>
                            </tr>
                        ) : (
                            filteredCompliance.map((c, idx) => (
                                <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{c.policyName}</td>
                                    <td className="px-4 py-3">{c.department}</td>
                                    <td className="px-4 py-3">{new Date(c.lastAudit).toLocaleDateString()}</td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${c.status === "Compliant"
                                                ? "text-green-600"
                                                : c.status === "Partial"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {c.status}
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
