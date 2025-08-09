"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";

const ReportPreview = dynamic(() => import("@/components/pdf/ReportPreview"), { ssr: false });

const dummyChildren = [
  {
    id: "1",
    fullName: "Amina Mohamed",
    reports: [
      {
        id: "rpt1",
        type: "Exam Report",
        title: "Midterm Exam Report",
        date: "2025-04-15",
        status: "Available",
        downloadLink: "/reports/amina-midterm-2025.pdf",
        description: "Detailed analysis of midterm exams including grades and statistics.",
      },
      {
        id: "rpt2",
        type: "Attendance Report",
        title: "Attendance Summary",
        date: "2025-06-01",
        status: "Available",
        downloadLink: "/reports/amina-attendance-2025.pdf",
        description: "Summary of attendance records for the semester.",
      },
      {
        id: "rpt3",
        type: "Behavior Report",
        title: "Behavior Evaluation",
        date: "2025-06-15",
        status: "Pending",
        downloadLink: null,
        description: "Behavioral report will be available after teacher review.",
      },
    ],
  },
  {
    id: "2",
    fullName: "Mohamed Abdi",
    reports: [
      {
        id: "rpt4",
        type: "Exam Report",
        title: "Final Exam Report",
        date: "2025-05-30",
        status: "Available",
        downloadLink: "/reports/mohamed-final-2025.pdf",
        description: "Final exams report with detailed grading breakdown.",
      },
      {
        id: "rpt5",
        type: "Transcript",
        title: "Official Transcript",
        date: "2025-06-20",
        status: "Available",
        downloadLink: "/reports/mohamed-transcript-2025.pdf",
        description: "Official academic transcript for the current year.",
      },
    ],
  },
];

const reportTypes = [
  "All",
  "Exam Report",
  "Attendance Report",
  "Behavior Report",
  "Transcript",
];

export default function ReportsPage() {
  // States
  const [selectedChildId, setSelectedChildId] = useState(dummyChildren[0].id);
  const [selectedReportType, setSelectedReportType] = useState("All");
  const [selectedReportId, setSelectedReportId] = useState(dummyChildren[0].reports[0].id);
  const [showPreview, setShowPreview] = useState(false);

  const selectedChild = useMemo(() => dummyChildren.find((c) => c.id === selectedChildId) ?? null, [
    selectedChildId,
  ]);

  // Filter reports by selected type or show all
  const filteredReports = useMemo(() => {
    if (!selectedChild) return [];
    if (selectedReportType === "All") return selectedChild.reports;
    return selectedChild.reports.filter((r) => r.type === selectedReportType);
  }, [selectedChild, selectedReportType]);

  // Keep selected reportId valid when filtered reports change
  React.useEffect(() => {
    if (!filteredReports.length) {
      setSelectedReportId("");
      return;
    }
    if (!filteredReports.find((r) => r.id === selectedReportId)) {
      setSelectedReportId(filteredReports[0].id);
    }
  }, [filteredReports, selectedReportId]);

  const selectedReport = useMemo(() => {
    if (!selectedChild) return null;
    return selectedChild.reports.find((r) => r.id === selectedReportId) ?? null;
  }, [selectedChild, selectedReportId]);

  // Handlers
  const onChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChildId = e.target.value;
    setSelectedChildId(newChildId);
    setSelectedReportType("All");
    const firstReport = dummyChildren.find((c) => c.id === newChildId)?.reports[0];
    setSelectedReportId(firstReport?.id ?? "");
  };

  const onReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReportType(e.target.value);
  };

  const onReportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReportId(e.target.value);
  };

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  const handleDownload = () => {
    if (selectedReport?.downloadLink) {
      window.open(selectedReport.downloadLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow mt-12">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-12 text-center">
        Student Reports Dashboard
      </h1>

      {/* Select Child */}
      <section className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <label htmlFor="childSelect" className="font-semibold text-gray-700 text-lg w-36">
          Select Child:
        </label>
        <select
          id="childSelect"
          value={selectedChildId}
          onChange={onChildChange}
          className="flex-grow border border-indigo-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Select child to view reports"
        >
          {dummyChildren.map((child) => (
            <option key={child.id} value={child.id}>
              {child.fullName}
            </option>
          ))}
        </select>
      </section>

      {/* Select Report Type */}
      <section className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <label htmlFor="reportTypeSelect" className="font-semibold text-gray-700 text-lg w-36">
          Select Report Type:
        </label>
        <select
          id="reportTypeSelect"
          value={selectedReportType}
          onChange={onReportTypeChange}
          className="flex-grow border border-indigo-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Select report type"
        >
          {reportTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </section>

      {/* Select Report */}
      <section className="mb-10 flex flex-col md:flex-row md:items-center gap-4">
        <label htmlFor="reportSelect" className="font-semibold text-gray-700 text-lg w-36">
          Select Report:
        </label>
        <select
          id="reportSelect"
          value={selectedReportId}
          onChange={onReportChange}
          className="flex-grow border border-indigo-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Select report for the selected child"
          disabled={!selectedChild || filteredReports.length === 0}
        >
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <option key={report.id} value={report.id} disabled={report.status !== "Available"}>
                {report.title} {report.status !== "Available" ? "(Unavailable)" : ""}
              </option>
            ))
          ) : (
            <option disabled>No reports available</option>
          )}
        </select>
      </section>

      {/* Report Card */}
      {selectedChild && selectedReport && (
        <section className="border border-indigo-300 rounded-lg p-6 bg-indigo-50 mb-8 shadow-sm">
          <h2 className="text-3xl font-bold text-indigo-900 mb-2">
            {selectedChild.fullName} — {selectedReport.title}
          </h2>
          <p className="text-gray-700 mb-1">
            <strong>Date:</strong> {new Date(selectedReport.date).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${selectedReport.status === "Available" ? "text-green-600" : "text-yellow-600"
                }`}
            >
              {selectedReport.status}
            </span>
          </p>
          <p className="text-gray-800">{selectedReport.description}</p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={openPreview}
              disabled={selectedReport.status !== "Available"}
              className={`px-6 py-2 rounded-md font-semibold transition ${selectedReport.status === "Available"
                  ? "bg-indigo-700 text-white hover:bg-indigo-800"
                  : "bg-indigo-300 text-indigo-600 cursor-not-allowed"
                }`}
              aria-disabled={selectedReport.status !== "Available"}
            >
              Preview Report
            </button>
          </div>
        </section>
      )}

      {/* Preview Modal */}
      {showPreview && selectedReport && selectedChild && (
        <div
          aria-modal="true"
          role="dialog"
          aria-labelledby="previewTitle"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-6"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center border-b border-indigo-200 p-5">
              <h3 id="previewTitle" className="text-xl font-bold text-indigo-900">
                {selectedChild.fullName} — {selectedReport.title} Preview
              </h3>
              <button
                onClick={closePreview}
                aria-label="Close preview modal"
                className="text-indigo-600 hover:text-indigo-900 text-2xl font-bold"
              >
                &times;
              </button>
            </header>

            <main className="flex-1 overflow-auto p-5">
              <ReportPreview report={selectedReport} />
            </main>

            <footer className="flex justify-end gap-4 border-t border-indigo-200 p-5">
              <button
                onClick={closePreview}
                className="px-6 py-2 rounded border border-indigo-700 font-semibold text-indigo-700 hover:bg-indigo-100 transition"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
