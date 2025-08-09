"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
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
    fullName: "Dr. Mohamed Abdi",
    role: "teacher",
    profilePicture: "/avatars/mohamed-abdi.png",
    employeeId: "EMP123456",
    department: "Computer Science and Engineering",
    email: "mohamed.abdi@university.edu",
    phone: "+252 61 987 6543",
    officeRoom: "Building B, Room 305",
    officeHours: "Mon, Wed, Fri 10:00 AM - 12:00 PM",
    academicTitle: "Dr.",
    bio: "Dr. Mohamed Abdi is a senior lecturer specializing in AI and Machine Learning. He has published over 30 research papers and leads multiple student projects in emerging technologies."
};

function TeacherIDCard({ teacher }: { teacher: Teacher }) {
    return (
        <div
            className="max-w-sm border rounded-lg shadow-lg p-8 relative bg-gradient-to-br from-indigo-700 to-indigo-500 text-white font-sans"
            style={{ width: "450px", minHeight: "320px" }} // Increased width and height for better display
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
            <div className="absolute top-4 right-4 border-4 border-white rounded-full overflow-hidden w-28 h-28">
                <img
                    src={teacher.profilePicture || "/avatars/default-avatar.png"}
                    alt={`${teacher.fullName} profile`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            {/* Text Content */}
            <div className="mt-20">
                <h2 className="text-3xl font-bold leading-tight break-words">
                    {teacher.academicTitle ? `${teacher.academicTitle} ` : ""}
                    {teacher.fullName}
                </h2>
                <p className="text-lg italic mb-4 break-words max-w-full">
                    {teacher.department || "Department info not available"}
                </p>

                <p className="text-md break-words max-w-full mb-2">
                    <strong>ID:</strong> {teacher.employeeId || "N/A"}
                </p>
                {teacher.officeRoom && (
                    <p className="text-md break-words max-w-full mb-2">
                        <strong>Office:</strong> {teacher.officeRoom}
                    </p>
                )}
                {teacher.officeHours && (
                    <p className="text-md break-words max-w-full">
                        <strong>Office Hours:</strong> {teacher.officeHours}
                    </p>
                )}
                <p className="text-xs mt-8 italic max-w-full">University of Hargeisa</p>
            </div>
        </div>
    );
}

export default function TeacherProfilePage() {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading from localStorage or fallback to dummy
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role !== "teacher") {
                    setError("Logged in user is not a teacher.");
                    setTeacher(null);
                    setLoading(false);
                    return;
                }
                setTeacher({
                    fullName: parsedUser.fullName || dummyTeacher.fullName,
                    role: "teacher",
                    profilePicture: parsedUser.profilePicture || dummyTeacher.profilePicture,
                    employeeId: parsedUser.employeeId || dummyTeacher.employeeId,
                    department: parsedUser.department || dummyTeacher.department,
                    email: parsedUser.email || dummyTeacher.email,
                    phone: parsedUser.phone || dummyTeacher.phone,
                    officeRoom: parsedUser.officeRoom || dummyTeacher.officeRoom,
                    officeHours: parsedUser.officeHours || dummyTeacher.officeHours,
                    academicTitle: parsedUser.academicTitle || dummyTeacher.academicTitle,
                    bio: parsedUser.bio || dummyTeacher.bio,
                });
            } catch {
                setError("Failed to parse user info.");
                setTeacher(null);
            }
        } else {
            // fallback dummy data
            setTeacher(dummyTeacher);
        }
        setLoading(false);
    }, []);

    return (
        <DashboardLayout
        >
            <section className="bg-white p-8 rounded-lg shadow max-w-6xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-indigo-900 mb-8">Teacher Profile</h1>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <Skeleton className="h-48 w-80 mx-auto" />
                ) : teacher ? (
                    <div className="flex flex-col md:flex-row gap-16">
                        {/* Left: Info List */}
                        <div className="flex-1 text-gray-700 space-y-5 text-lg">
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
                    !loading && (
                        <p className="text-center text-gray-600 italic">No teacher information available.</p>
                    )
                )}
            </section>
        </DashboardLayout>
    );
}
