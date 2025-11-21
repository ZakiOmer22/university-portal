import React from "react";
import { FileText, TrendingUp, Activity, AlertTriangle, Download, Eye } from "lucide-react";

interface ReportItem {
    id: string;
    title: string;
    type: "attendance" | "performance" | "health" | "disciplinary";
    date: string;
    status: "new" | "viewed" | "downloaded";
    hasUpdates?: boolean;
}

interface ReportsPanelProps {
    reports?: ReportItem[];
    onViewReport?: (id: string) => void;
    onDownloadReport?: (id: string) => void;
}

export default function ReportsPanel({ 
    reports = defaultReports, 
    onViewReport,
    onDownloadReport 
}: ReportsPanelProps) {
    const getReportConfig = (type: ReportItem["type"]) => {
        switch (type) {
            case "attendance":
                return {
                    icon: <TrendingUp size={18} className="text-blue-500" />,
                    color: "bg-blue-50 text-blue-700 border-blue-200",
                    label: "Attendance"
                };
            case "performance":
                return {
                    icon: <Activity size={18} className="text-green-500" />,
                    color: "bg-green-50 text-green-700 border-green-200",
                    label: "Performance"
                };
            case "health":
                return {
                    icon: <FileText size={18} className="text-orange-500" />,
                    color: "bg-orange-50 text-orange-700 border-orange-200",
                    label: "Health"
                };
            case "disciplinary":
                return {
                    icon: <AlertTriangle size={18} className="text-red-500" />,
                    color: "bg-red-50 text-red-700 border-red-200",
                    label: "Disciplinary"
                };
        }
    };

    const getStatusBadge = (status: ReportItem["status"]) => {
        switch (status) {
            case "new":
                return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">New</span>;
            case "viewed":
                return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Viewed</span>;
            case "downloaded":
                return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Downloaded</span>;
        }
    };

    const newReportsCount = reports.filter(r => r.status === "new").length;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Reports Panel</h3>
                        <p className="text-gray-600 text-sm">Latest academic and health reports</p>
                    </div>
                </div>
                {newReportsCount > 0 && (
                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                        {newReportsCount} new
                    </span>
                )}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {reports.slice(0, 4).map((report) => {
                    const config = getReportConfig(report.type);
                    
                    return (
                        <div
                            key={report.id}
                            className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 bg-white group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                                        {config.icon}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900 text-sm">
                                                {report.title}
                                            </h4>
                                            {report.hasUpdates && (
                                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span>{config.label}</span>
                                            <span>•</span>
                                            <span>{new Date(report.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {getStatusBadge(report.status)}
                                    
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onViewReport?.(report.id)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Report"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDownloadReport?.(report.id)}
                                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Download Report"
                                        >
                                            <Download size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View All Button */}
            {reports.length > 4 && (
                <button className="w-full mt-4 py-3 text-center text-indigo-600 hover:text-indigo-700 font-medium text-sm border border-dashed border-gray-300 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    View All Reports ({reports.length})
                </button>
            )}
        </div>
    );
}

// Default reports data
const defaultReports: ReportItem[] = [
    {
        id: "1",
        title: "Monthly Attendance Summary",
        type: "attendance",
        date: new Date().toISOString(),
        status: "new",
        hasUpdates: true
    },
    {
        id: "2",
        title: "Mid-Term Performance Report",
        type: "performance",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "viewed"
    },
    {
        id: "3",
        title: "Annual Health Checkup",
        type: "health",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: "downloaded"
    },
    {
        id: "4",
        title: "Behavioral Assessment",
        type: "disciplinary",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "new"
    }
];