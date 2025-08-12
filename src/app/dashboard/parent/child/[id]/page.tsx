"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/parent/Sidebar"; // You may replace this with the below inline Sidebar if needed
import Tabs from "@/components/parent/Tabs";
import AccountTab from "@/components/parent/AccountTab";
import SemesterTab from "@/components/parent/SemesterTab";
import ExamsTab from "@/components/parent/ExamsTab";
import TranscriptTab from "@/components/parent/TranscriptTab";
import ReportsTab from "@/components/parent/ReportsTab";
import { cn } from "@/lib/utils"; // Assume your utility for conditional classes
import { Menu, X } from "lucide-react";

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

const dummyChildren: PageStudent[] = [
    {
        id: "1",
        fullName: "Ayaan Omer",
        profilePicture: "/images/ayaan.jpg",
        role: "Student",
        accountDetails: {
            email: "ayaan@example.com",
            phone: "123-456-7890",
            department: "Science",
            currentSemester: "Semester 3",
            advisor: "Dr. Smith",
        },
        classes: [
            {
                code: "SCI101",
                title: "Biology",
                instructor: "Prof. Jane",
                credits: 3,
            },
            {
                code: "MAT101",
                title: "Algebra",
                instructor: "Mr. John",
                credits: 4,
            },
        ],
        exams: [
            {
                id: "e1",
                courseCode: "SCI101",
                courseTitle: "Biology",
                date: "2025-08-15",
                time: "10:00 AM",
                location: "Room 101",
                status: "Scheduled",
            },
            {
                id: "e2",
                courseCode: "MAT101",
                courseTitle: "Algebra",
                date: "2025-08-20",
                time: "1:00 PM",
                location: "Room 102",
                status: "Scheduled",
            },
        ],
        transcript: [
            {
                courseCode: "ENG101",
                courseTitle: "English Literature",
                semester: "Fall",
                year: 2024,
                grade: "A",
                credits: 3,
            },
        ],
        reports: [
            {
                id: "r1",
                title: "Progress Report Fall 2024",
                description: "Good performance overall.",
            },
        ],
    },
    {
        id: "2",
        fullName: "Layla Omer",
        profilePicture: "/images/layla.jpg",
        role: "Student",
        accountDetails: {
            email: "layla@example.com",
            phone: "987-654-3210",
            department: "Arts",
            currentSemester: "Semester 2",
            advisor: "Dr. Jones",
        },
        classes: [
            {
                code: "ART101",
                title: "Painting",
                instructor: "Ms. Lee",
                credits: 2,
            },
        ],
        exams: [
            {
                id: "e3",
                courseCode: "ART101",
                courseTitle: "Painting",
                date: "2025-08-18",
                time: "11:00 AM",
                location: "Art Studio",
                status: "Scheduled",
            },
        ],
        transcript: [
            {
                courseCode: "HIS101",
                courseTitle: "History",
                semester: "Spring",
                year: 2025,
                grade: "B+",
                credits: 3,
            },
        ],
        reports: [
            {
                id: "r2",
                title: "Midterm Report Spring 2025",
                description: "Needs improvement in attendance.",
            },
        ],
    },
];


// Tab types
type Tab = "Account" | "Current Semester" | "Exams" | "Transcript" | "Reports";

export default function ChildDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<Tab>("Account");
    const [student, setStudent] = useState<PageStudent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchStudent = async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const foundStudent =
                dummyChildren.find((c) => c.id === id) || dummyChildren[0] || null;

            if (!foundStudent) {
                setError("No student data found.");
                setStudent(null);
            } else {
                setStudent(foundStudent);
            }
            setLoading(false);
            setSidebarOpen(false);
        };

        fetchStudent();
    }, [id]);

    const handleChildChange = (newId: string) => {
        router.push(`/dashboard/parent/child/${newId}`);
        setActiveTab("Account");
    };

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
            currentSemester:
                parseInt(student.accountDetails.currentSemester.replace(/\D/g, "")) || 0,
        };
    }

    const renderTabContent = () => {
        if (!student) return null;
        switch (activeTab) {
            case "Account":
                return <AccountTab student={transformStudentForAccountTab(student)} />;
            case "Current Semester":
                return <SemesterTab classes={student.classes} />;
            case "Exams":
                return <ExamsTab exams={student.exams} />;
            case "Transcript":
                return <TranscriptTab transcript={student.transcript} />;
            case "Reports":
                return <ReportsTab reports={student.reports} studentId={student.id} />;
            default:
                return null;
        }
    };

    // Sidebar content (unchanged)
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-indigo-900 text-white w-64 shadow-lg">
            <div className="flex items-center space-x-3 px-6 py-5 border-b border-indigo-700">
                {student && (
                    <>
                        <img
                            src={student.profilePicture}
                            alt={`${student.fullName} profile`}
                            className="w-12 h-12 rounded-full object-cover"
                            loading="lazy"
                        />
                        <div>
                            <h2 className="font-semibold text-lg">{student.fullName}</h2>
                            <p className="text-sm opacity-70">{student.role}</p>
                        </div>
                    </>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
                {dummyChildren.map((child) => {
                    const isActive = child.id === student?.id;
                    return (
                        <button
                            key={child.id}
                            onClick={() => handleChildChange(child.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                                isActive
                                    ? "bg-blue-700 font-semibold"
                                    : "hover:bg-blue-800 hover:bg-opacity-50"
                            )}
                        >
                            <img
                                src={child.profilePicture}
                                alt={`${child.fullName} profile`}
                                className="w-8 h-8 rounded-full object-cover"
                                loading="lazy"
                            />
                            <span>{child.fullName.split(" ")[0]}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 w-full">
            {/* Mobile header with hamburger */}
            <header className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
                <button
                    aria-label="Open sidebar"
                    onClick={() => setSidebarOpen(true)}
                    className="text-blue-900 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-blue-900">Child Details</h1>
                <div className="w-6" /> {/* Spacer */}
            </header>

            {/* Sidebar overlay for mobile */}
            <div
                className={cn(
                    "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity",
                    sidebarOpen
                        ? "opacity-100 visible pointer-events-auto"
                        : "opacity-0 invisible pointer-events-none"
                )}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full bg-gradient-to-b from-blue-900 to-indigo-900 text-white w-64 shadow-lg z-50 transform md:static md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Close button for mobile */}
                <div className="md:hidden flex justify-end p-3 border-b border-indigo-700">
                    <button
                        aria-label="Close sidebar"
                        onClick={() => setSidebarOpen(false)}
                        className="text-white hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-white rounded"
                    >
                        <X size={24} />
                    </button>
                </div>
                <SidebarContent />
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col bg-white overflow-hidden">
                {loading ? (
                    <div className="animate-pulse space-y-6 w-full max-w-full mx-auto p-6">
                        <div className="h-10 bg-gray-300 rounded w-48" />
                        <div className="h-72 bg-gray-300 rounded" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center flex-1 text-red-600 p-6">
                        <p className="text-xl font-semibold">{error}</p>
                    </div>
                ) : student ? (
                    <>
                        {/* Tabs */}
                        <nav
                            role="tablist"
                            aria-label="Student details tabs"
                            className="flex overflow-x-auto space-x-4 border-b border-gray-300"
                        >
                            {(
                                [
                                    "Account",
                                    "Current Semester",
                                    "Exams",
                                    "Transcript",
                                    "Reports",
                                ] as Tab[]
                            ).map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-controls={`tab-panel-${tab.replace(/\s+/g, "")}`}
                                        id={`tab-${tab.replace(/\s+/g, "")}`}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "whitespace-nowrap px-5 py-3 font-semibold rounded-t-lg transition-all duration-200",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-transparent text-blue-800 hover:text-blue-600 hover:bg-blue-100"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Tab panel */}
                        <section
                            id={`tab-panel-${activeTab.replace(/\s+/g, "")}`}
                            role="tabpanel"
                            aria-labelledby={`tab-${activeTab.replace(/\s+/g, "")}`}
                            tabIndex={0}
                            className="flex-1 p-6 overflow-auto bg-white"
                        >
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