import React from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description?: string;
  link?: string;
}

interface ReportsTabProps {
  reports: Report[];
  studentId: string;
}

export default function ReportsTab({ reports, studentId }: ReportsTabProps) {
  const router = useRouter();

  const openReportPage = () => {
    router.push(`/dashboard/parent/child/${studentId}/reports`);
  };

  return (
    <section className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
      {/* Header without logo */}
      <div className="mb-4 border-b pb-4">
        <h3 className="text-2xl font-bold text-indigo-900 tracking-wide">
          University Reports
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          View detailed academic and performance reports.
        </p>
      </div>

      {reports.length === 0 ? (
        <p className="text-gray-700 italic">No reports available for this student.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:shadow-md transition"
              >
                <FileText className="text-indigo-600 mt-1" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-indigo-800">{report.title}</h4>
                  {report.description && (
                    <p className="text-gray-700 text-sm mt-1">{report.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={openReportPage}
            className="mt-4 self-start bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-2 rounded shadow transition"
            aria-label="View detailed reports"
          >
            View All Reports
          </button>
        </>
      )}
    </section>
  );
}
