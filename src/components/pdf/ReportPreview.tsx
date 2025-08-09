"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ReportDocument from "./ReportDocument";

interface ReportPreviewProps {
    report: {
        id: string;
        title: string;
        date: string;
        status: string;
        downloadLink?: string | null;
    };
}

export default function ReportPreview({ report }: ReportPreviewProps) {
    return (
        <PDFViewer style={{ width: "100%", height: "70vh" }}>
            <ReportDocument report={report} />
        </PDFViewer>
    );
}