"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function ViewReportPage() {
    const params = useParams();
    const reportId = params?.id || "Unknown";

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/admin/reports"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                    <ArrowLeft size={18} /> Back
                </Link>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3">
                <FileText size={32} className="text-indigo-600" />
                <h1 className="text-2xl font-bold">View Report — {reportId}</h1>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 mb-4">
                    This is a preview of the report content. In a real app, this would
                    display charts, tables, or PDF previews fetched from the server.
                </p>
                <div className="border border-gray-300 rounded p-4 h-96 flex items-center justify-center text-gray-400">
                    📄 Report Content Placeholder
                </div>
            </div>
        </div>
    );
}
