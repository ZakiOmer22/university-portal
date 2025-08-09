"use client";

import React, { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ReportPDF from "./ReportPDF";

interface Report {
    id: string;
    title: string;
    date: string;
    status: string;
    downloadLink: string | null;
}

interface DownloadReportButtonProps {
    reports: Report[];
    studentName: string;
}

export default function DownloadReportButton({ reports, studentName }: DownloadReportButtonProps) {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowPreview(true)}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded shadow font-semibold transition"
                aria-label="Preview and download reports as PDF"
            >
                Preview Reports PDF
            </button>

            {showPreview && (
                <div
                    aria-modal="true"
                    role="dialog"
                    className="fixed inset-0 bg-black bg-opacity-60 flex flex-col p-4 md:p-12"
                    style={{ zIndex: 9999 }}
                >
                    <div className="bg-white rounded-lg flex flex-col flex-1 overflow-hidden shadow-lg">
                        <header className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-indigo-900">Reports Preview - {studentName}</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                aria-label="Close PDF preview"
                                className="text-gray-600 hover:text-gray-900 font-bold text-2xl"
                            >
                                &times;
                            </button>
                        </header>

                        <div className="flex-1 overflow-auto">
                            <PDFViewer style={{ width: "100%", height: "100%" }}>
                                <ReportPDF reports={reports} studentName={studentName} />
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
