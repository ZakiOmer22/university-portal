"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/parent/Sidebar";
import Header from "@/components/parent/Header";
import Tabs from "@/components/parent/Tabs";
import AccountTab from "@/components/parent/AccountTab";
import SemesterTab from "@/components/parent/SemesterTab";
import ExamsTab from "@/components/parent/ExamsTab";
import TranscriptTab from "@/components/parent/TranscriptTab";
import ReportsTab from "@/components/parent/ReportsTab";

// Your PageStudent type (unchanged)
type PageStudent = {
    id: string;
    fullName: string;
    profilePicture: string;
    role: string;
    accountDetails: {
        email: string;
        phone: string;
        department: string;
        currentSemester: string;
        advisor: string;
    };
    classes: {
        code: string;
        title: string;
        instructor: string;
        credits: number;
    }[];
    exams: {
        id: string;
        courseCode: string;
        courseTitle: string;
        date: string;
        time: string;
        location: string;
        status: "Completed" | "Scheduled" | "Missed";
        grade?: string;
    }[];
    transcript: {
        courseCode: string;
        courseTitle: string;
        semester: string;
        year: number;
        grade: string;
        credits: number;
    }[];
    reports: {
        id: string;
        title: string;
        description?: string;
    }[];
};

// Dummy data placeholder — fill your actual data here
const dummyChildren: PageStudent[] = [
    // ... your dummyChildren data ...
];

// Define the Student type expected by Header
type Student = {
    firstName: string;
    lastName: string;
    department: string;
    faculty: string;
    email: string;
    profilePicture: string;
    role: string;
    enrollmentNumber: string;   // <-- must be here
};

// Transform function to convert PageStudent to Student
function transformStudentForAccountTab(student: PageStudent) {
    const [firstName = "", lastName = ""] = student.fullName.split(" ");
    return {
        firstName,
        lastName,
        email: student.accountDetails.email,
        phone: student.accountDetails.phone,
        dob: undefined,
        enrollmentNumber: `ENR-${student.id.padStart(6, "0")}`,
        department: student.accountDetails.department,
        faculty: "N/A",
        currentSemester: parseInt(student.accountDetails.currentSemester.replace(/\D/g, "")) || 0,
    };
}


type Tab = "Account" | "Current Semester" | "Exams" | "Transcript" | "Reports";

export default function ChildDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<Tab>("Account");
    const [student, setStudent] = useState<PageStudent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchStudent = async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const found = dummyChildren.find((c) => c.id === id) || dummyChildren[0];
            setStudent(found);
            setLoading(false);
        };
        fetchStudent();
    }, [id]);

    const handleChildChange = (newId: string) => {
        router.push(`/dashboard/parent/child/${newId}`);
    };

    const renderTabContent = () => {
        if (!student) return null;
        switch (activeTab) {
            case "Account":
                // You might need a similar transform for AccountTab if required
                return <AccountTab student={transformStudentForAccountTab(student)} />;
            case "Current Semester":
                return <SemesterTab classes={student.classes} />;
            case "Exams":
                return <ExamsTab exams={student.exams} />;
            case "Transcript":
                return <TranscriptTab transcript={student.transcript} />;
            case "Reports":
                return <ReportsTab reports={student.reports} studentId={student.id} />;
        }
    };

    // Transform for AccountTab (kept from your original)
    function transformPageStudentToStudent(student: PageStudent): Student {
        const [firstName = "", lastName = ""] = student.fullName.split(" ");
        return {
            firstName,
            lastName,
            department: student.accountDetails.department,
            faculty: "N/A", // replace with real faculty if you have it
            email: student.accountDetails.email,
            profilePicture: student.profilePicture,
            role: student.role,
            enrollmentNumber: `ENR-${student.id.padStart(6, "0")}`,  // <-- add this line!
        };
    }
    return (
        <div className="w-full min-h-screen flex bg-gray-50">
            <Sidebar
                childrenList={dummyChildren.map((c) => ({
                    id: c.id,
                    firstName: c.fullName.split(" ")[0],
                    lastName: c.fullName.split(" ")[1],
                    profilePicture: c.profilePicture,
                    enrollmentNumber: `ENR-${c.id.padStart(4, "0")}`,
                }))}
                activeChildId={student?.id}
                onChildChange={handleChildChange}
            />
            <main className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
                {loading ? (
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-gray-300 rounded w-48"></div>
                        <div className="h-72 bg-gray-300 rounded"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-red-600">
                        <svg
                            className="w-20 h-20 mb-4 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M21 12c0-4.97-4.03-9-9-9S3 7.03 3 12a8.96 8.96 0 001.34 4.79l-1.3 1.3a1 1 0 101.41 1.41l1.29-1.3A8.96 8.96 0 0012 21c4.97 0 9-4.03 9-9z"
                            />
                        </svg>
                        <p className="text-xl font-semibold">{error}</p>
                    </div>
                ) : student ? (
                    <>
                        {/* Pass transformed student to Header */}
                        {/* <Header student={transformPageStudentToStudent(student)} /> */}
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        <section className="mt-6 flex-1 overflow-auto" aria-live="polite" aria-atomic="true">
                            {renderTabContent()}
                        </section>
                    </>
                ) : (
                    <p className="text-center text-red-600 mt-10">Student data not found.</p>
                )}
            </main>
        </div>
    );
}
