import React from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, Eye, Calendar, Filter, TrendingUp, BarChart3, AlertTriangle, Stethoscope } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description?: string;
  type: "academic" | "attendance" | "health" | "disciplinary" | "financial";
  date: string;
  fileSize?: string;
  status: "new" | "viewed" | "downloaded";
  childName?: string;
}

interface ReportsTabProps {
  reports: Report[];
  studentId: string;
  studentName?: string;
}

export default function ReportsTab({ reports, studentId, studentName }: ReportsTabProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<string>("all");

  const openReportPage = () => {
    router.push(`/dashboard/parent/child/${studentId}/reports`);
  };

  const getReportConfig = (type: Report["type"]) => {
    switch (type) {
      case "academic":
        return {
          icon: <BarChart3 size={20} className="text-blue-500" />,
          color: "bg-blue-50 text-blue-700 border-blue-200",
          label: "Academic"
        };
      case "attendance":
        return {
          icon: <TrendingUp size={20} className="text-green-500" />,
          color: "bg-green-50 text-green-700 border-green-200",
          label: "Attendance"
        };
      case "health":
        return {
          icon: <Stethoscope size={20} className="text-orange-500" />,
          color: "bg-orange-50 text-orange-700 border-orange-200",
          label: "Health"
        };
      case "disciplinary":
        return {
          icon: <AlertTriangle size={20} className="text-red-500" />,
          color: "bg-red-50 text-red-700 border-red-200",
          label: "Disciplinary"
        };
      case "financial":
        return {
          icon: <FileText size={20} className="text-purple-500" />,
          color: "bg-purple-50 text-purple-700 border-purple-200",
          label: "Financial"
        };
    }
  };

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "new":
        return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">New</span>;
      case "viewed":
        return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Viewed</span>;
      case "downloaded":
        return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Downloaded</span>;
    }
  };

  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(report => report.type === filter);

  const reportStats = {
    total: reports.length,
    new: reports.filter(r => r.status === "new").length,
    academic: reports.filter(r => r.type === "academic").length,
    downloaded: reports.filter(r => r.status === "downloaded").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Student Reports</h2>
            <p className="text-indigo-100">
              {studentName ? `Reports for ${studentName}` : "Academic and performance reports"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{reportStats.total}</div>
            <div className="text-indigo-100">Total Reports</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{reportStats.academic}</div>
          <div className="text-sm text-gray-600">Academic</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{reportStats.new}</div>
          <div className="text-sm text-gray-600">New</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{reportStats.downloaded}</div>
          <div className="text-sm text-gray-600">Downloaded</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-600">{reportStats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">All Reports</h3>
            <p className="text-gray-600 text-sm">Detailed academic and performance reports</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="academic">Academic</option>
              <option value="attendance">Attendance</option>
              <option value="health">Health</option>
              <option value="disciplinary">Disciplinary</option>
              <option value="financial">Financial</option>
            </select>
            
            <button
              onClick={openReportPage}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              <Eye size={16} />
              View All
            </button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              {filter === "all" 
                ? "No reports available for this student."
                : `No ${filter} reports found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const config = getReportConfig(report.type);
              
              return (
                <div
                  key={report.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                    {config.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {report.title}
                      </h4>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    {report.description && (
                      <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                      {report.fileSize && (
                        <>
                          <span>•</span>
                          <span>{report.fileSize}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Report"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download Report"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}