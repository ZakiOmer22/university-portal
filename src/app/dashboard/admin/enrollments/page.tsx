"use client";

import React, { useState, useMemo } from "react";

interface Program {
    id: string;
    name: string;
}

interface College {
    id: string;
    name: string;
}

interface Enrollment {
    id: string;
    studentName: string;
    regNo: string;
    programId: string;
    collegeId: string;
    email: string;
}

const programs: Program[] = [
    { id: "computer-science", name: "Computer Science" },
    { id: "business-administration", name: "Business Administration" },
    { id: "nursing", name: "Nursing" },
    { id: "civil-engineering", name: "Civil Engineering" },
];

const colleges: College[] = [
    { id: "science-college", name: "Science College" },
    { id: "business-college", name: "Business College" },
    { id: "health-college", name: "Health College" },
    { id: "engineering-college", name: "Engineering College" },
];

// Sample enrollments (expand as needed)
const enrollments: Enrollment[] = [
    { id: "1", studentName: "John Doe", regNo: "CS2025001", programId: "computer-science", collegeId: "science-college", email: "john@example.com" },
    { id: "2", studentName: "Jane Smith", regNo: "BA2025001", programId: "business-administration", collegeId: "business-college", email: "jane@example.com" },
    { id: "3", studentName: "Sam Wilson", regNo: "NUR2025001", programId: "nursing", collegeId: "health-college", email: "sam@example.com" },
    { id: "4", studentName: "Alice Johnson", regNo: "CS2025002", programId: "computer-science", collegeId: "science-college", email: "alice@example.com" },
    { id: "5", studentName: "Mark Thompson", regNo: "ENG2025001", programId: "civil-engineering", collegeId: "engineering-college", email: "mark@example.com" },
    // Add more for testing pagination
];

const PAGE_SIZE = 10;

export default function EnrollmentsPage() {
    const [selectedProgram, setSelectedProgram] = useState<string>("all");
    const [selectedCollege, setSelectedCollege] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const filteredEnrollments = useMemo(() => {
        return enrollments.filter((e) => {
            const programMatch = selectedProgram === "all" || e.programId === selectedProgram;
            const collegeMatch = selectedCollege === "all" || e.collegeId === selectedCollege;
            return programMatch && collegeMatch;
        });
    }, [selectedProgram, selectedCollege]);

    const totalPages = Math.ceil(filteredEnrollments.length / PAGE_SIZE);
    const currentEnrollments = filteredEnrollments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProgram(e.target.value);
        setCurrentPage(1);
    };

    const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCollege(e.target.value);
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen print:bg-white">
            {/* Header */}
            <div className="text-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold uppercase tracking-wide text-gray-900">
                    Enrollment Listing
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Generated on: {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
                <select
                    className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedProgram}
                    onChange={handleProgramChange}
                    aria-label="Select Program"
                >
                    <option value="all">All Programs</option>
                    {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select
                    className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCollege}
                    onChange={handleCollegeChange}
                    aria-label="Select College"
                >
                    <option value="all">All Colleges</option>
                    {colleges.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                #
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                Reg No
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                Student Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                Program
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                College
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                Email
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentEnrollments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-gray-500 font-medium"
                                >
                                    No enrollments found.
                                </td>
                            </tr>
                        ) : (
                            currentEnrollments.map((enrollment, idx) => (
                                <tr
                                    key={enrollment.id}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {enrollment.regNo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {enrollment.studentName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {programs.find((p) => p.id === enrollment.programId)?.name || ""}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {colleges.find((c) => c.id === enrollment.collegeId)?.name || ""}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {enrollment.email}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-3 py-1 rounded border ${pageNum === currentPage
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-xs border-t pt-4 print:border-t-0">
                Powered by{" "}
                <img
                    src="/favicon.ico"
                    alt="favicon"
                    className="inline-block w-4 h-4 mr-1 align-middle"
                />
                eALIF
            </div>

            {/* Print Button */}
            <div className="mt-4 flex justify-end print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    Print
                </button>
            </div>
        </div>
    );
}
