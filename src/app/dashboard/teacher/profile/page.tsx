"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock, 
    Edit3, 
    Download,
    Share2,
    Award,
    BookOpen,
    Users,
    Calendar,
    GraduationCap,
    Building,
    IdCard,
    Camera,
    CheckCircle2
} from "lucide-react";

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
    joinDate: string;
    coursesTeaching: number;
    totalStudents: number;
    specialization: string[];
    education: {
        degree: string;
        institution: string;
        year: string;
    }[];
}

// Mock data that would come from your API
const mockTeacherData = {
    employeeId: "EMP123456",
    department: "Computer Science and Engineering",
    phone: "+252 61 987 6543",
    officeRoom: "Building B, Room 305",
    officeHours: "Mon, Wed, Fri 10:00 AM - 12:00 PM\nTue, Thu 2:00 PM - 4:00 PM",
    academicTitle: "Associate Professor",
    bio: "Specializing in AI and Machine Learning with over 12 years of teaching experience. Published over 30 research papers in international journals and leads multiple student projects in emerging technologies. Research focuses on natural language processing and computer vision applications in healthcare.",
    joinDate: "2018-08-15",
    coursesTeaching: 4,
    totalStudents: 86,
    specialization: ["Artificial Intelligence", "Machine Learning", "Natural Language Processing", "Computer Vision"],
    education: [
        {
            degree: "PhD in Computer Science",
            institution: "Massachusetts Institute of Technology",
            year: "2015"
        },
        {
            degree: "MSc in Artificial Intelligence",
            institution: "Stanford University",
            year: "2010"
        },
        {
            degree: "BSc in Computer Engineering",
            institution: "University of Hargeisa",
            year: "2008"
        }
    ]
};

function TeacherIDCard({ teacher }: { teacher: Teacher }) {
    const [isFlipped, setIsFlipped] = useState(false);

    // Function to format the name for ID card (first name only)
    const getDisplayName = () => {
        const firstName = teacher.fullName.split(' ')[0];
        return teacher.academicTitle ? `${teacher.academicTitle} ${firstName}` : firstName;
    };

    return (
        <div className="relative w-96 h-64 perspective-1000">
            <div 
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                }`}
            >
                {/* Front of ID Card */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-2xl border-2 border-white/20">
                    {/* University Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white/90 text-sm">UNIVERSITY OF HARGEISA</h3>
                                <p className="text-white/70 text-xs">Faculty of Engineering</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/80 text-xs">Employee ID</p>
                            <p className="font-mono font-bold text-white">{teacher.employeeId}</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-4 items-start">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 border-4 border-white/30 rounded-xl overflow-hidden bg-white/10">
                                <img
                                    src={teacher.profilePicture || "/avatars/default-avatar.png"}
                                    alt={`${teacher.fullName} profile`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Teacher Info */}
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-lg leading-tight mb-1">
                                {getDisplayName()}
                            </h2>
                            <p className="text-white/80 text-sm mb-2 leading-tight">
                                {teacher.department}
                            </p>
                            <div className="space-y-1 text-xs">
                                <p className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {teacher.email}
                                </p>
                                {teacher.officeRoom && (
                                    <p className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {teacher.officeRoom}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-4 left-6 right-6">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-white/70">Faculty ID Card</span>
                            <span className="text-white/70">Valid until: 12/2026</span>
                        </div>
                    </div>

                    {/* Flip Hint */}
                    <button
                        onClick={() => setIsFlipped(true)}
                        className="absolute top-4 right-4 p-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                        title="View back side"
                    >
                        <IdCard className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Back of ID Card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-2xl border-2 border-white/20">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-white/90 text-sm mb-2">CONTACT INFORMATION</h3>
                        <div className="w-16 h-1 bg-indigo-400 mx-auto rounded-full"></div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                            <Mail className="w-4 h-4 text-indigo-300" />
                            <span className="text-white/90">{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                            <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                                <Phone className="w-4 h-4 text-indigo-300" />
                                <span className="text-white/90">{teacher.phone}</span>
                            </div>
                        )}
                        {teacher.officeRoom && (
                            <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                                <MapPin className="w-4 h-4 text-indigo-300" />
                                <span className="text-white/90">{teacher.officeRoom}</span>
                            </div>
                        )}
                    </div>

                    {/* Office Hours */}
                    {teacher.officeHours && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-white/80 text-xs mb-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                OFFICE HOURS
                            </h4>
                            <div className="text-xs text-white/70 bg-white/5 rounded-lg p-2">
                                {teacher.officeHours.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Flip Back */}
                    <button
                        onClick={() => setIsFlipped(false)}
                        className="absolute top-4 right-4 p-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                        title="View front side"
                    >
                        <IdCard className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TeacherProfilePage() {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "education" | "contact">("overview");

    useEffect(() => {
        // Simulate API call to get teacher profile data
        const fetchTeacherProfile = async () => {
            try {
                // In real app, this would be an API call like:
                // const response = await fetch('/api/teacher/profile');
                // const profileData = await response.json();
                
                setTimeout(() => {
                    // Get basic user info from AuthGuard context (in real app)
                    // For now, we'll simulate getting the authenticated user
                    const authenticatedUser = {
                        fullName: "Mohamed Abdi", // This would come from AuthGuard
                        role: "teacher" as const,
                        email: "mohamed.abdi@university.edu", // This would come from AuthGuard
                        profilePicture: "/avatars/mohamed-abdi.png"
                    };

                    // Combine authenticated user data with profile data
                    const completeTeacherData: Teacher = {
                        ...authenticatedUser,
                        ...mockTeacherData
                    };

                    setTeacher(completeTeacherData);
                    setLoading(false);
                }, 1500);
            } catch (err) {
                setError("Failed to load teacher profile. Please try again.");
                setLoading(false);
            }
        };

        fetchTeacherProfile();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Skeleton className="h-96 rounded-2xl" />
                        <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">
                                Faculty Profile
                            </h1>
                            <p className="text-gray-600 mt-2">Manage your professional information and identity</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Share2 className="w-4 h-4" />
                                Share Profile
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200">
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="flex items-start gap-2">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {teacher ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - ID Card and Quick Stats */}
                            <div className="space-y-6">
                                {/* ID Card */}
                                <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Faculty ID Card</h2>
                                        <div className="flex gap-1">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                <Camera className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <TeacherIDCard teacher={teacher} />
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                                    <h3 className="font-semibold text-indigo-100 mb-4">Teaching Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-5 h-5 text-indigo-200" />
                                                <span className="text-indigo-100">Active Courses</span>
                                            </div>
                                            <span className="font-bold text-lg">{teacher.coursesTeaching}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Users className="w-5 h-5 text-indigo-200" />
                                                <span className="text-indigo-100">Total Students</span>
                                            </div>
                                            <span className="font-bold text-lg">{teacher.totalStudents}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-indigo-200" />
                                                <span className="text-indigo-100">Years Teaching</span>
                                            </div>
                                            <span className="font-bold text-lg">
                                                {new Date().getFullYear() - new Date(teacher.joinDate).getFullYear()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Profile Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Profile Header */}
                                <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                    <div className="flex items-start gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden border-4 border-white shadow-lg">
                                                <img
                                                    src={teacher.profilePicture || "/avatars/default-avatar.png"}
                                                    alt={`${teacher.fullName} profile`}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900">
                                                        {teacher.academicTitle ? `${teacher.academicTitle} ` : ''}{teacher.fullName}
                                                    </h2>
                                                    <p className="text-lg text-indigo-600 font-medium">{teacher.department}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                                    Active
                                                </span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Tabs */}
                                <div className="flex space-x-1 bg-gray-100/80 rounded-2xl p-1 w-fit">
                                    {[
                                        { id: "overview", label: "Overview", icon: Award },
                                        { id: "education", label: "Education", icon: GraduationCap },
                                        { id: "contact", label: "Contact", icon: Building }
                                    ].map(({ id, label, icon: Icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => setActiveTab(id as "overview" | "education" | "contact")}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${activeTab === id
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
                                    {activeTab === "overview" && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialization</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {teacher.specialization.map((spec, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200"
                                                        >
                                                            {spec}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                        <Award className="w-5 h-5 text-indigo-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Employee ID</p>
                                                            <p className="font-semibold text-gray-900">{teacher.employeeId}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                        <Calendar className="w-5 h-5 text-indigo-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Join Date</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {new Date(teacher.joinDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "education" && (
                                        <div className="space-y-4">
                                            {teacher.education.map((edu, index) => (
                                                <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors duration-200">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <GraduationCap className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                                        <p className="text-gray-600">{edu.institution}</p>
                                                        <p className="text-sm text-gray-500">Graduated {edu.year}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === "contact" && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                                    <Mail className="w-5 h-5 text-indigo-600" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Email</p>
                                                        <p className="font-semibold text-gray-900">{teacher.email}</p>
                                                    </div>
                                                </div>
                                                {teacher.phone && (
                                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                                        <Phone className="w-5 h-5 text-indigo-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Phone</p>
                                                            <p className="font-semibold text-gray-900">{teacher.phone}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {teacher.officeRoom && (
                                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                                        <MapPin className="w-5 h-5 text-indigo-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Office</p>
                                                            <p className="font-semibold text-gray-900">{teacher.officeRoom}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {teacher.officeHours && (
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                        <Clock className="w-5 h-5 text-indigo-600" />
                                                        Office Hours
                                                    </h4>
                                                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                                        {teacher.officeHours.split('\n').map((line, index) => (
                                                            <p key={index} className="text-indigo-800 font-medium">
                                                                {line}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Found</h3>
                            <p className="text-gray-600">Unable to load teacher profile information.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3D Card Styles */}
            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </DashboardLayout>
    );
}