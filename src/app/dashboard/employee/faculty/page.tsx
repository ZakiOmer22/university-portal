"use client"; // mark the page as client

import React, { useState, useEffect } from "react";

interface FacultyMember {
    id: string;
    name: string;
    department: string;
    email: string;
}

const faculty: FacultyMember[] = [
    { id: "1", name: "Dr. Alice Johnson", department: "Computer Science", email: "alice.johnson@example.com" },
    { id: "2", name: "Dr. Mark Thompson", department: "Business Administration", email: "mark.thompson@example.com" },
    { id: "3", name: "Dr. Sarah Blake", department: "Nursing", email: "sarah.blake@example.com" },
    { id: "4", name: "Dr. John Carter", department: "Civil Engineering", email: "john.carter@example.com" },
    { id: "5", name: "Dr. Mary Collins", department: "Education", email: "mary.collins@example.com" },
    { id: "6", name: "Dr. Peter Maxwell", department: "Accounting", email: "peter.maxwell@example.com" },
    { id: "7", name: "Dr. Julia Ramirez", department: "Information Technology", email: "julia.ramirez@example.com" },
    { id: "8", name: "Dr. Emma Wright", department: "Graphic Design", email: "emma.wright@example.com" },
    { id: "9", name: "Dr. Michael Green", department: "Environmental Science", email: "michael.green@example.com" },
    { id: "10", name: "Dr. Samuel Ford", department: "Mechanical Engineering", email: "samuel.ford@example.com" },
    { id: "11", name: "Dr. Alan Turing", department: "Computer Science", email: "alan.turing@example.com" },
    { id: "12", name: "Dr. Rachel Adams", department: "Business Administration", email: "rachel.adams@example.com" },
    { id: "13", name: "Dr. William Harris", department: "Public Health", email: "william.harris@example.com" },
    { id: "14", name: "Dr. Sophia Martinez", department: "Education", email: "sophia.martinez@example.com" },
    { id: "15", name: "Dr. Daniel Lee", department: "Civil Engineering", email: "daniel.lee@example.com" },
    { id: "16", name: "Dr. Grace Kim", department: "Nursing", email: "grace.kim@example.com" },
    { id: "17", name: "Dr. James Patel", department: "Accounting", email: "james.patel@example.com" },
    { id: "18", name: "Dr. Olivia Nguyen", department: "Information Technology", email: "olivia.nguyen@example.com" },
    { id: "19", name: "Dr. Ethan Wright", department: "Mechanical Engineering", email: "ethan.wright@example.com" },
    { id: "20", name: "Dr. Ava Johnson", department: "Graphic Design", email: "ava.johnson@example.com" },
];

interface SearchParams {
    department?: string;
}

interface PageProps {
    searchParams?: Promise<SearchParams | undefined>; // Adjusting to match expected type
}

export default function FacultyListPage({ searchParams }: PageProps) {
    const [department, setDepartment] = useState<string | undefined>(undefined);

    useEffect(() => {
        // read from URL query param on client
        const params = new URLSearchParams(window.location.search);
        const dep = params.get("department") || undefined;
        setDepartment(dep);
    }, []);

    const filteredFaculty = department
        ? faculty.filter(f => f.department.toLowerCase() === department.toLowerCase())
        : faculty;

    return (
        <div className="p-8 bg-gray-50 min-h-screen print:bg-white">
            <div className="text-center mb-8 border-b pb-4">
                <h1 className="text-2xl font-bold uppercase">Faculty Listing</h1>
                {department && (
                    <p className="text-gray-600">{department.replace("-", " ")}</p>
                )}
                <p className="text-sm text-gray-500">
                    Generated on: {new Date().toLocaleDateString()}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm bg-white shadow-md print:shadow-none">
                    <thead className="bg-gray-100 print:bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFaculty.map((f, idx) => (
                            <tr key={f.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{f.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{f.department}</td>
                                <td className="border border-gray-300 px-4 py-2">{f.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-center text-gray-500 text-xs border-t pt-4 print:border-t-0">
                Powered by{" "}
                <img
                    src="/favicon.ico"
                    alt="favicon"
                    className="inline-block w-4 h-4 mr-1 align-middle"
                />
                eALIF
            </div>

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