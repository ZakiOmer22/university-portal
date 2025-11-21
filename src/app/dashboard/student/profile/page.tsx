"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, User, BookOpen, GraduationCap, IdCard } from "lucide-react";

interface Student {
    id: string;
    fullName: string;
    profilePicture?: string;
    email: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    studentId: string;
    department: string;
    program: string;
    enrollmentDate: string;
    academicYear: string;
    gpa?: number;
}

const dummyStudent: Student = {
    id: "stu-123",
    fullName: "John Doe",
    profilePicture: undefined,
    email: "john.doe@student.university.edu",
    phone: "+252 61 123 4567",
    address: "123 University Ave, Hargeisa, Somaliland",
    dateOfBirth: "2000-05-15",
    studentId: "STU2024001",
    department: "Computer Science",
    program: "Bachelor of Science in Computer Science",
    enrollmentDate: "2023-09-01",
    academicYear: "Second Year",
    gpa: 3.75,
};

function StudentIDCard({ student }: { student: Student }) {
    return (
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full"></div>
            </div>
            
            {/* University Logo */}
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <img
                    src="/favicon.ico"
                    alt="University Logo"
                    className="w-10 h-10"
                    loading="lazy"
                />
            </div>

            {/* Student Photo */}
            <div className="absolute top-4 right-4 border-4 border-white/80 rounded-2xl overflow-hidden w-20 h-20 shadow-lg">
                <img
                    src={student.profilePicture || "/avatars/default-avatar.png"}
                    alt={`${student.fullName} profile`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="mt-20 space-y-3 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold leading-tight break-words">
                        {student.fullName}
                    </h2>
                    <p className="text-blue-100 text-sm font-medium mt-1 break-words">
                        {student.program}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <IdCard className="w-4 h-4 text-blue-200" />
                        <span className="text-blue-100">ID: {student.studentId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-blue-200" />
                        <span className="text-blue-100">{student.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-200" />
                        <span className="text-blue-100">{student.academicYear}</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-white/20">
                    <p className="text-xs text-blue-200 font-medium">University of Hargeisa</p>
                </div>
            </div>
        </div>
    );
}

export default function StudentProfilePage() {
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<Student | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string } | null>(null);

    useEffect(() => {
        const loadStudentData = () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    // Use the actual user data from localStorage
                    setStudent({
                        ...dummyStudent,
                        fullName: parsedUser.fullName || dummyStudent.fullName,
                        profilePicture: parsedUser.profilePicture || dummyStudent.profilePicture,
                        email: parsedUser.email || dummyStudent.email,
                        studentId: parsedUser.studentId || dummyStudent.studentId,
                    });
                } else {
                    // Fallback to dummy data
                    setUser({
                        fullName: dummyStudent.fullName,
                        role: "student",
                        profilePicture: dummyStudent.profilePicture,
                    });
                    setStudent(dummyStudent);
                }
                setLoading(false);
            } catch (err) {
                setError("Failed to load student profile data.");
                setLoading(false);
            }
        };

        // Simulate API call delay
        setTimeout(loadStudentData, 1200);
    }, []);

    return (
        <DashboardLayout user={user} loading={loading}>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                        <p className="text-gray-600 mt-1">View and manage your academic information</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-sm py-1 px-3">
                        Student Account
                    </Badge>
                </div>

                {error && (
                    <Alert variant="destructive" className="flex items-start gap-2 border-red-200 bg-red-50">
                        <AlertTitle className="text-red-800">Error</AlertTitle>
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-8 w-64" />
                            <div className="space-y-4">
                                {[...Array(8)].map((_, i) => (
                                    <Skeleton key={i} className="h-6 w-full" />
                                ))}
                            </div>
                        </div>
                        <Skeleton className="h-80 rounded-2xl" />
                    </div>
                ) : student ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Student Information */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Personal Information Card */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Personal Information
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="text-gray-900 font-semibold">{student.fullName}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Student ID</label>
                                        <p className="text-gray-900 font-semibold">{student.studentId}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                        <p className="text-gray-900 font-semibold">
                                            {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "Not specified"}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Academic Year</label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <p className="text-gray-900 font-semibold">{student.academicYear}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Academic Information Card */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                    Academic Information
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Department</label>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-purple-500" />
                                            <p className="text-gray-900 font-semibold">{student.department}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Program</label>
                                        <p className="text-gray-900 font-semibold">{student.program}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                                        <p className="text-gray-900 font-semibold">
                                            {new Date(student.enrollmentDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    
                                    {student.gpa && (
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Current GPA</label>
                                            <div className="flex items-center gap-2">
                                                <div className={`px-2 py-1 rounded-md text-sm font-bold ${
                                                    student.gpa >= 3.5 ? "bg-green-100 text-green-800" :
                                                    student.gpa >= 3.0 ? "bg-blue-100 text-blue-800" :
                                                    student.gpa >= 2.5 ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}>
                                                    {student.gpa.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Contact Information Card */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                    <Mail className="w-5 h-5 text-green-600" />
                                    Contact Information
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-green-500" />
                                            <p className="text-green-600 font-semibold">{student.email}</p>
                                        </div>
                                    </div>
                                    
                                    {student.phone && (
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-blue-500" />
                                                <p className="text-gray-900 font-semibold">{student.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {student.address && (
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-sm font-medium text-gray-500">Address</label>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                                                <p className="text-gray-900 font-semibold">{student.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column - ID Card & Quick Actions */}
                        <div className="space-y-6">
                            <StudentIDCard student={student} />
                            
                            {/* Quick Actions Card */}
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                                        <div className="font-medium text-gray-900">Update Profile</div>
                                        <div className="text-sm text-gray-600">Edit your personal information</div>
                                    </button>
                                    
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                                        <div className="font-medium text-gray-900">Change Password</div>
                                        <div className="text-sm text-gray-600">Update your security settings</div>
                                    </button>
                                    
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                                        <div className="font-medium text-gray-900">Download ID Card</div>
                                        <div className="text-sm text-gray-600">Get a printable version</div>
                                    </button>

                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200">
                                        <div className="font-medium text-gray-900">Academic Transcript</div>
                                        <div className="text-sm text-gray-600">View your grades and records</div>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Student Information</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Student profile information is not available. Please contact administration.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}