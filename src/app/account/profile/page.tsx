/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState, useEffect, useRef, type ComponentType, type SVGProps } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
// The library ships without types; import it while suppressing TS error.
// For a cleaner solution, add a dedicated declaration file e.g. src/types/dom-to-image-more.d.ts
// with: declare module 'dom-to-image-more' { const domtoimage: any; export default domtoimage; }
import html2canvas from 'html2canvas';
// @ts-expect-error
import domtoimage from 'dom-to-image-more';
import {
    User, Mail, Phone, MapPin, Users, Shield, Clock,
    Download, Edit, Camera, QrCode, BookOpen, GraduationCap,
    Calendar, IdCard, School, Award, BookText, Building,
    CreditCard, BarChart3, Settings, ShieldCheck
} from "lucide-react";
import { toPng } from 'html-to-image';

interface Student {
    id: string;
    name: string;
    grade?: string;
    studentId: string;
    program: string;
}

interface Course {
    id: string;
    name: string;
    code: string;
    semester: string;
}

interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    profilePicture?: string;
    role: "student" | "parent" | "teacher" | "admin";
    userId: string;
    joinDate: string;
    lastLogin: string;
    studentId?: string;
    program?: string;
    semester?: number;
    creditLeft?: number;
    linkedStudents?: Student[];
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    department?: string;
    courses?: Course[];
    employeeId?: string;
    adminLevel?: "super" | "academic" | "financial";
    permissions?: string[];
    badges?: string[];
}

export default function ProfilePage() {
    const router = useRouter();
    const idCardRef = useRef<HTMLDivElement>(null);

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<ProfileData | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "profile" | "academic" | "emergency" | "idcard" | "status" | "settings"
    >("profile");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<ProfileData | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                router.push("/auth/login");
                return;
            }
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);

                const loadedProfile = generateProfileData(userData);
                setProfile(loadedProfile);
                setForm(loadedProfile);
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        }
    }, [router]);

    function generateProfileData(userData: Partial<ProfileData>): ProfileData {
        const baseProfile: ProfileData = {
            fullName: userData.fullName || "User Name",
            email: userData.email || "user@university.edu",
            phone: userData.phone || "+252 63 123 4567",
            address: userData.address || "Hargeisa, Somaliland",
            profilePicture: userData.profilePicture || "/default-avatar.png",
            role: userData.role || "student",
            userId: userData.userId || "USR-2024-001",
            joinDate: userData.joinDate || "2024-01-15",
            lastLogin: userData.lastLogin || new Date().toISOString(),
            badges: userData.badges || ["Active Member"]
        };

        switch (baseProfile.role) {
            case "student":
                return {
                    ...baseProfile,
                    studentId: userData.studentId || "STU-2024-001",
                    program: userData.program || "Computer Science",
                    semester: userData.semester || 3,
                    creditLeft: userData.creditLeft || 12,
                    badges: [...(baseProfile.badges || []), "Current Student"]
                };

            case "parent":
                return {
                    ...baseProfile,
                    linkedStudents: userData.linkedStudents || [
                        {
                            id: "s1",
                            name: "Ahmed Mohamed",
                            grade: "Grade 10",
                            studentId: "STU-2024-001",
                            program: "Science Program"
                        },
                        {
                            id: "s2",
                            name: "Aisha Mohamed",
                            grade: "Grade 8",
                            studentId: "STU-2024-002",
                            program: "Arts Program"
                        }
                    ],
                    emergencyContactName: userData.emergencyContactName || "Mohamed Ali",
                    emergencyContactPhone: userData.emergencyContactPhone || "+252 63 987 6543",
                    badges: [...(baseProfile.badges || []), "Verified Parent"]
                };

            case "teacher":
                return {
                    ...baseProfile,
                    department: userData.department || "Computer Science Department",
                    employeeId: userData.employeeId || "EMP-TCH-001",
                    courses: userData.courses || [
                        { id: "c1", name: "Introduction to Programming", code: "CS101", semester: "Fall 2024" },
                        { id: "c2", name: "Data Structures", code: "CS201", semester: "Spring 2024" }
                    ],
                    badges: [...(baseProfile.badges || []), "Faculty Member"]
                };

            case "admin":
                return {
                    ...baseProfile,
                    adminLevel: userData.adminLevel || "academic",
                    permissions: userData.permissions || ["user_management", "academic_records"],
                    employeeId: userData.employeeId || "EMP-ADM-001",
                    badges: [...(baseProfile.badges || []), "Administrator"]
                };

            default:
                return baseProfile;
        }
    }

    const onChange = (field: keyof ProfileData, value: string) => {
        if (!form) return;
        setForm({ ...form, [field]: value });
    };

    const onProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const saveChanges = () => {
        if (form) {
            setProfile(form);
            setEditMode(false);
            setUploadPreview(null);
            localStorage.setItem("user", JSON.stringify(form));
        }
    };

    const cancelEdit = () => {
        setForm(profile);
        setEditMode(false);
        setUploadPreview(null);
    };

    const downloadIDCard = async () => {
        if (idCardRef.current === null) {
            return;
        }

        try {
            const canvas = await html2canvas(idCardRef.current, {
                backgroundColor: '#0f172a',
                scale: 2, // Higher resolution
                useCORS: true, // Enable CORS for images
                allowTaint: false, // Don't allow tainted canvas
                logging: false, // Disable console logging
                foreignObjectRendering: false, // Avoid foreign object issues
                imageTimeout: 15000, // 15 second timeout for images
            });

            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `${profile?.fullName.replace(/\s+/g, '_')}_ID_Card.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error downloading ID card:', err);
            alert('Error downloading ID card. Please try again.');
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "student": return "from-blue-500 to-blue-600";
            case "parent": return "from-green-500 to-green-600";
            case "teacher": return "from-purple-500 to-purple-600";
            case "admin": return "from-red-500 to-red-600";
            default: return "from-gray-500 to-gray-600";
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "student": return <GraduationCap size={20} />;
            case "parent": return <Users size={20} />;
            case "teacher": return <BookText size={20} />;
            case "admin": return <Settings size={20} />;
            default: return <User size={20} />;
        }
    };

    if (loading) {
        return (
            <DashboardLayout user={user} loading={true}>
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <Skeleton className="w-32 h-32 rounded-full" />
                        <div className="space-y-4 flex-1">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!profile || !form) {
        return (
            <DashboardLayout user={user} loading={false}>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
            <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                {/* Modern Header */}
                <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white/20 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                                <Image
                                    src={uploadPreview || profile.profilePicture || "/default-avatar.png"}
                                    alt="Profile picture"
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>
                            {editMode && (
                                <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera size={24} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={onProfilePicChange}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {profile.fullName}
                                    </h1>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <Badge className={`bg-white/20 text-white border-0 backdrop-blur-sm flex items-center gap-2 px-3 py-1.5`}>
                                            {getRoleIcon(profile.role)}
                                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                        </Badge>
                                        {profile.badges?.map((badge) => (
                                            <Badge key={badge} variant="secondary" className="bg-white/10 text-white border-0 backdrop-blur-sm">
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {!editMode ? (
                                        <Button
                                            onClick={() => setEditMode(true)}
                                            className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg border-0"
                                        >
                                            <Edit size={16} className="mr-2" />
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={cancelEdit} className="border-white/20 text-white hover:bg-white/10">
                                                Cancel
                                            </Button>
                                            <Button onClick={saveChanges} className="bg-white text-slate-900 hover:bg-slate-100">
                                                Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <Mail size={16} />
                                    <span className="truncate">{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <Phone size={16} />
                                    <span>{profile.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <MapPin size={16} />
                                    <span className="truncate">{profile.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabs and Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <Card className="lg:col-span-1 p-6 rounded-2xl shadow-sm">
                        <div className="space-y-2">
                            {getTabsForRole(profile.role).map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === id
                                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Main Content */}
                    <Card className="lg:col-span-3 p-6 md:p-8 rounded-2xl shadow-sm">
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <User className="text-indigo-600" />
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field
                                        label="Full Name"
                                        icon={User}
                                        editMode={editMode}
                                        value={form.fullName}
                                        onChange={(v) => onChange("fullName", v)}
                                    />
                                    <Field
                                        label="Email"
                                        icon={Mail}
                                        editMode={editMode}
                                        type="email"
                                        value={form.email}
                                        onChange={(v) => onChange("email", v)}
                                    />
                                    <Field
                                        label="Phone"
                                        icon={Phone}
                                        editMode={editMode}
                                        value={form.phone}
                                        onChange={(v) => onChange("phone", v)}
                                    />
                                    <Field
                                        label="Address"
                                        icon={MapPin}
                                        editMode={editMode}
                                        multiline
                                        value={form.address}
                                        onChange={(v) => onChange("address", v)}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "academic" && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <BookOpen className="text-indigo-600" />
                                    {getAcademicTitle(profile.role)}
                                </h2>
                                {renderAcademicContent(profile)}
                            </div>
                        )}

                        {activeTab === "emergency" && (
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Shield className="text-indigo-600" />
                                    Emergency Contact
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field
                                        label="Emergency Contact Name"
                                        editMode={editMode}
                                        value={form.emergencyContactName || ""}
                                        onChange={(v) => onChange("emergencyContactName", v)}
                                    />
                                    <Field
                                        label="Emergency Contact Phone"
                                        editMode={editMode}
                                        value={form.emergencyContactPhone || ""}
                                        onChange={(v) => onChange("emergencyContactPhone", v)}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "idcard" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <IdCard className="text-indigo-600" />
                                        Virtual ID Card
                                    </h2>
                                    <Button onClick={downloadIDCard} className="bg-indigo-600 hover:bg-indigo-700">
                                        <Download size={16} className="mr-2" />
                                        Download ID Card
                                    </Button>
                                </div>
                                <div ref={idCardRef}>
                                    <VirtualIDCard profile={profile} />
                                </div>
                            </div>
                        )}

                        {activeTab === "status" && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Award className="text-indigo-600" />
                                    Account Status
                                </h2>
                                {renderStatusContent(profile)}
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Settings className="text-indigo-600" />
                                    Account Settings
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-6 border border-gray-200 hover:border-indigo-200 transition-colors">
                                        <h3 className="font-semibold text-gray-900 mb-2">Privacy Settings</h3>
                                        <p className="text-gray-600 text-sm mb-4">Manage your privacy preferences and data sharing settings.</p>
                                        <Button variant="outline" size="sm">Configure</Button>
                                    </Card>
                                    <Card className="p-6 border border-gray-200 hover:border-indigo-200 transition-colors">
                                        <h3 className="font-semibold text-gray-900 mb-2">Notification Preferences</h3>
                                        <p className="text-gray-600 text-sm mb-4">Control how and when you receive notifications.</p>
                                        <Button variant="outline" size="sm">Configure</Button>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
    );
}

// Enhanced Virtual ID Card Component
function VirtualIDCard({ profile }: { profile: ProfileData }) {
    const getRoleDisplay = (role: string) => {
        switch (role) {
            case "student": return "Student";
            case "parent": return "Parent";
            case "teacher": return "Faculty Member";
            case "admin": return "Administrator";
            default: return "Member";
        }
    };

    const getIDNumber = (profile: ProfileData) => {
        switch (profile.role) {
            case "student": return profile.studentId;
            case "teacher": return profile.employeeId;
            case "admin": return profile.employeeId;
            case "parent": return profile.userId;
            default: return profile.userId;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "student": return "from-blue-500 to-blue-600";
            case "parent": return "from-green-500 to-green-600";
            case "teacher": return "from-purple-500 to-purple-600";
            case "admin": return "from-red-500 to-red-600";
            default: return "from-gray-500 to-gray-600";
        }
    };

    return (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-2xl max-w-md mx-auto border-0">
            {/* University Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <School size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">University of Hargeisa</h3>
                        <p className="text-white/60 text-xs">Official Identification Card</p>
                    </div>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                    <ShieldCheck size={24} className="text-white" />
                </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                <div className="w-16 h-16 rounded-xl border-2 border-white/20 overflow-hidden bg-white/10">
                    <Image
                        src={profile.profilePicture || "/default-avatar.png"}
                        alt="Profile"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1 truncate">{profile.fullName}</h2>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(profile.role)}`}>
                        {getRoleDisplay(profile.role)}
                    </div>
                </div>
            </div>

            {/* ID Details */}
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">ID Number</span>
                    <span className="font-mono font-semibold">{getIDNumber(profile)}</span>
                </div>

                {profile.role === "student" && profile.program && (
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Program</span>
                        <span className="font-semibold">{profile.program}</span>
                    </div>
                )}

                {profile.role === "teacher" && profile.department && (
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Department</span>
                        <span className="font-semibold">{profile.department}</span>
                    </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Valid Until</span>
                    <span className="font-semibold">Dec 2025</span>
                </div>
            </div>

            {/* QR Code and Footer */}
            <div className="mt-6 flex items-center justify-between">
                <div className="bg-white/10 p-2 rounded-lg">
                    <QrCode size={60} className="text-white" />
                </div>
                <div className="text-right">
                    <p className="text-white/40 text-xs">Issued Date</p>
                    <p className="text-white/60 text-sm font-medium">{new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </Card>
    );
}

// Field Component
interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    editMode: boolean;
    type?: "text" | "email" | "tel";
    multiline?: boolean;
    icon?: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
}

function Field({ label, value, onChange, editMode, type = "text", multiline = false, icon: Icon }: FieldProps) {
    if (editMode) {
        if (multiline) {
            return (
                <div className="space-y-2">
                    <label className="block font-medium text-gray-900 flex items-center gap-2">
                        {Icon && <Icon size={18} className="text-indigo-600" />}
                        {label}
                    </label>
                    <Textarea
                        rows={3}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            );
        }
        return (
            <div className="space-y-2">
                <label className="block font-medium text-gray-900 flex items-center gap-2">
                    {Icon && <Icon size={18} className="text-indigo-600" />}
                    {label}
                </label>
                <Input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
        );
    }

    return (
        <div className="p-4 rounded-xl border border-gray-200 hover:border-indigo-200 transition-colors bg-gray-50/50">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-indigo-600" />
                    </div>
                )}
                <div className="flex-1">
                    <p className="text-gray-600 font-medium text-sm">{label}</p>
                    <p className="mt-1 text-gray-900 font-medium">{value || "-"}</p>
                </div>
            </div>
        </div>
    );
}

// Helper Functions
function getTabsForRole(role: string) {
    const baseTabs = [
        { id: "profile" as const, label: "Profile Info", icon: User },
        { id: "idcard" as const, label: "Virtual ID Card", icon: IdCard },
        { id: "status" as const, label: "Account Status", icon: Award },
        { id: "settings" as const, label: "Settings", icon: Settings },
    ];

    switch (role) {
        case "student":
            return [
                { id: "profile" as const, label: "Profile Info", icon: User },
                { id: "academic" as const, label: "Academic Info", icon: BookOpen },
                { id: "emergency" as const, label: "Emergency Contact", icon: Shield },
                { id: "idcard" as const, label: "Virtual ID Card", icon: IdCard },
                { id: "status" as const, label: "Account Status", icon: Award },
            ];
        case "parent":
            return [
                { id: "profile" as const, label: "Profile Info", icon: User },
                { id: "academic" as const, label: "Linked Students", icon: Users },
                { id: "emergency" as const, label: "Emergency Contact", icon: Shield },
                { id: "idcard" as const, label: "Virtual ID Card", icon: IdCard },
                { id: "status" as const, label: "Account Status", icon: Award },
            ];
        case "teacher":
            return [
                { id: "profile" as const, label: "Profile Info", icon: User },
                { id: "academic" as const, label: "Teaching Info", icon: BookText },
                { id: "idcard" as const, label: "Virtual ID Card", icon: IdCard },
                { id: "status" as const, label: "Account Status", icon: Award },
                { id: "settings" as const, label: "Settings", icon: Settings },
            ];
        case "admin":
            return [
                { id: "profile" as const, label: "Profile Info", icon: User },
                { id: "academic" as const, label: "Admin Panel", icon: Settings },
                { id: "idcard" as const, label: "Virtual ID Card", icon: IdCard },
                { id: "status" as const, label: "Account Status", icon: Award },
                { id: "settings" as const, label: "Settings", icon: Settings },
            ];
        default:
            return baseTabs;
    }
}

function getAcademicTitle(role: string) {
    switch (role) {
        case "student": return "Academic Information";
        case "parent": return "Linked Students";
        case "teacher": return "Teaching Information";
        case "admin": return "Administration Panel";
        default: return "Academic Information";
    }
}

function renderAcademicContent(profile: ProfileData) {
    switch (profile.role) {
        case "student":
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border border-blue-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <CreditCard className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Student ID</h3>
                                <p className="text-blue-600 font-mono">{profile.studentId}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-green-200 hover:border-green-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <BookOpen className="text-green-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Program</h3>
                                <p className="text-green-600">{profile.program}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-purple-200 hover:border-purple-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <BarChart3 className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Semester</h3>
                                <p className="text-purple-600">Semester {profile.semester}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-orange-200 hover:border-orange-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Award className="text-orange-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Credits Left</h3>
                                <p className="text-orange-600">{profile.creditLeft} credits</p>
                            </div>
                        </div>
                    </Card>
                </div>
            );

        case "parent":
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.linkedStudents?.map((student) => (
                        <Card key={student.id} className="p-6 hover:shadow-lg transition-all duration-200 border border-green-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                                    <p className="text-gray-600">{student.grade}</p>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    {student.studentId}
                                </Badge>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={16} />
                                    <span>{student.program}</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full mt-4" size="sm">
                                View Academic Progress
                            </Button>
                        </Card>
                    ))}
                </div>
            );

        case "teacher":
            return (
                <div className="space-y-6">
                    <Card className="p-6 border border-purple-200 hover:border-purple-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Building className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Department</h3>
                                <p className="text-purple-600">{profile.department}</p>
                            </div>
                        </div>
                    </Card>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Courses</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.courses?.map((course) => (
                                <Card key={course.id} className="p-4 border border-gray-200 hover:border-purple-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900">{course.name}</h4>
                                        <Badge variant="secondary">{course.code}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">{course.semester}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case "admin":
            return (
                <div className="space-y-6">
                    <Card className="p-6 border border-red-200 hover:border-red-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Settings className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Admin Level</h3>
                                <p className="text-red-600 capitalize">{profile.adminLevel} Administrator</p>
                            </div>
                        </div>
                    </Card>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.permissions?.map((permission) => (
                                <Badge key={permission} variant="secondary" className="bg-gray-100 text-gray-700">
                                    {permission.replace('_', ' ')}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            );

        default:
            return <p className="text-gray-600">No academic information available.</p>;
    }
}

function renderStatusContent(profile: ProfileData) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-green-200 hover:border-green-300 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="text-green-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Account Status</h3>
                        <p className="text-green-600 font-medium">Active</p>
                    </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">Your account is in good standing with full access to all features.</p>
            </Card>

            <Card className="p-6 border border-blue-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Member Since</h3>
                        <p className="text-blue-600 font-medium">{new Date(profile.joinDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">Thank you for being part of our educational community.</p>
            </Card>

            <Card className="p-6 border border-purple-200 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Clock className="text-purple-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Last Login</h3>
                        <p className="text-purple-600 font-medium">{new Date(profile.lastLogin).toLocaleString()}</p>
                    </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">Your most recent access to the system.</p>
            </Card>

            <Card className="p-6 border border-orange-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">User ID</h3>
                        <p className="text-orange-600 font-mono">{profile.userId}</p>
                    </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">Your unique identifier in the system.</p>
            </Card>
        </div>
    );
}