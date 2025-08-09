"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Teacher {
    fullName: string;
    role: "teacher";
    profilePicture?: string;
    employeeId: string;
    department: string;
    email: string;
    phone?: string;
    officeRoom?: string;
    officeHours?: string;
    academicTitle?: string;
    bio?: string;
}

const dummyTeacher: Teacher = {
    fullName: "Dr. Sarah Williams",
    role: "teacher",
    profilePicture: "/avatars/sarah-williams.jpg",
    employeeId: "EMP-TH56789",
    department: "Physics Department",
    email: "sarah.williams@university.edu",
    phone: "+252 61 987 6543",
    officeRoom: "Room 212, Science Building",
    officeHours: "Tue/Thu 10am - 12pm",
    academicTitle: "Dr.",
    bio: "Enthusiastic physics lecturer specializing in quantum mechanics.",
};

function TeacherIDCard({ teacher }: { teacher: Teacher }) {
    return (
        <div
            className="max-w-sm border rounded-lg shadow-lg p-6 relative bg-gradient-to-br from-indigo-600 to-indigo-400 text-white font-sans"
            style={{ width: "360px", minHeight: "280px" }}
        >
            {/* University Logo */}
            <div className="absolute top-4 left-4">
                <img
                    src="/favicon.ico"
                    alt="University Logo"
                    style={{ width: 56, height: 56 }}
                    loading="lazy"
                />
            </div>

            {/* Teacher Photo */}
            <div className="absolute top-4 right-4 border-4 border-white rounded-full overflow-hidden w-24 h-24">
                <img
                    src={teacher.profilePicture || "/avatars/default-avatar.png"}
                    alt={`${teacher.fullName} profile`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            {/* Text Content */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold leading-tight break-words">
                    {teacher.academicTitle ? `${teacher.academicTitle} ` : ""}
                    {teacher.fullName}
                </h2>
                <p className="text-sm italic mb-3 break-words max-w-full">
                    {teacher.department || "Department info not available"}
                </p>

                <p className="text-sm break-words max-w-full">
                    <strong>ID:</strong> {teacher.employeeId || "N/A"}
                </p>
                {teacher.officeRoom && (
                    <p className="text-sm break-words max-w-full">
                        <strong>Office:</strong> {teacher.officeRoom}
                    </p>
                )}
                {teacher.officeHours && (
                    <p className="text-sm break-words max-w-full">
                        <strong>Office Hours:</strong> {teacher.officeHours}
                    </p>
                )}
                <p className="text-xs mt-6 italic max-w-full">University of Hargeisa</p>
            </div>
        </div>
    );
}

export default function TeacherProfilePage() {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate getting teacher from localStorage or API
        const storedTeacher = localStorage.getItem("teacher");
        if (storedTeacher) {
            try {
                const parsedTeacher = JSON.parse(storedTeacher);
                setTeacher({
                    ...dummyTeacher,
                    fullName: parsedTeacher.fullName || dummyTeacher.fullName,
                    profilePicture: parsedTeacher.profilePicture || dummyTeacher.profilePicture,
                    email: parsedTeacher.email || dummyTeacher.email,
                    employeeId: parsedTeacher.employeeId || dummyTeacher.employeeId,
                    department: parsedTeacher.department || dummyTeacher.department,
                    phone: parsedTeacher.phone || dummyTeacher.phone,
                    officeRoom: parsedTeacher.officeRoom || dummyTeacher.officeRoom,
                    officeHours: parsedTeacher.officeHours || dummyTeacher.officeHours,
                    academicTitle: parsedTeacher.academicTitle || dummyTeacher.academicTitle,
                    bio: parsedTeacher.bio || dummyTeacher.bio,
                });
            } catch {
                setError("Failed to parse teacher info.");
            }
        } else {
            setTeacher(dummyTeacher);
        }
        setLoading(false);
    }, []);

    return (
        <DashboardLayout
            user={
                teacher
                    ? { fullName: teacher.fullName, role: teacher.role, profilePicture: teacher.profilePicture }
                    : null
            }
            loading={loading}
        >
            <section className="bg-white p-8 rounded-lg shadow max-w-5xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-indigo-900 mb-6">Teacher Profile</h1>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <Skeleton className="h-48 w-80 mx-auto" />
                ) : teacher ? (
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Left: Info List */}
                        <div className="flex-1 text-gray-700 space-y-3">
                            <p>
                                <strong>Name:</strong>{" "}
                                {teacher.academicTitle ? `${teacher.academicTitle} ` : ""}
                                {teacher.fullName}
                            </p>
                            <p>
                                <strong>Employee ID:</strong> {teacher.employeeId}
                            </p>
                            <p>
                                <strong>Department:</strong> {teacher.department}
                            </p>
                            <p>
                                <strong>Email:</strong> {teacher.email}
                            </p>
                            {teacher.phone && (
                                <p>
                                    <strong>Phone:</strong> {teacher.phone}
                                </p>
                            )}
                            {teacher.officeRoom && (
                                <p>
                                    <strong>Office Room:</strong> {teacher.officeRoom}
                                </p>
                            )}
                            {teacher.officeHours && (
                                <p>
                                    <strong>Office Hours:</strong> {teacher.officeHours}
                                </p>
                            )}
                            {teacher.bio && (
                                <p>
                                    <strong>Bio:</strong> {teacher.bio}
                                </p>
                            )}
                        </div>

                        {/* Right: ID Card */}
                        <TeacherIDCard teacher={teacher} />
                    </div>
                ) : (
                    <p className="text-center text-gray-600 italic">No teacher information available.</p>
                )}
            </section>
        </DashboardLayout>
    );
}
