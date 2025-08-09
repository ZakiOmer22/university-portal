"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Student {
    id: string;
    name: string;
    grade?: string;
}

interface ParentProfileData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    profilePicture?: string;
    linkedStudents: Student[];
    role?: string;
    badges?: string[];
}

export default function ParentProfile() {
    const router = useRouter();

    const [profile, setProfile] = useState<ParentProfileData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<ParentProfileData | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "profile" | "students" | "emergency" | "connections" | "status" | "audit"
    >("profile");
    const [loading, setLoading] = useState(true);

    const bannerImage =
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                router.push("/auth/login");
                return;
            }
            try {
                const userData = JSON.parse(storedUser);
                const loadedProfile: ParentProfileData = {
                    fullName: userData.fullName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    address: userData.address || "",
                    emergencyContactName: userData.emergencyContactName || "",
                    emergencyContactPhone: userData.emergencyContactPhone || "",
                    profilePicture: userData.profilePicture || "/default-avatar.png",
                    linkedStudents: userData.linkedStudents || [],
                    role: userData.role || "User",
                    badges: userData.badges || ["Member"],
                };
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

    const onChange = (field: keyof ParentProfileData, value: string) => {
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
        }
    };

    const cancelEdit = () => {
        setForm(profile);
        setEditMode(false);
        setUploadPreview(null);
    };

    if (loading) {
        // Skeleton loader
        return (
            <main className="max-w-7xl mx-auto p-4 md:p-12 min-h-[80vh]">
                <div className="h-40 rounded-md bg-gradient-to-br from-indigo-100 to-indigo-200 animate-pulse"></div>
                <div className="flex flex-col md:flex-row mt-[-64px] gap-6">
                    <div className="w-32 h-32 rounded-full bg-indigo-200 animate-pulse"></div>
                    <div className="flex-1 space-y-4 py-8">
                        <div className="h-8 bg-indigo-200 rounded w-1/2 animate-pulse"></div>
                        <div className="h-6 bg-indigo-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-6 bg-indigo-200 rounded w-1/4 animate-pulse"></div>
                    </div>
                </div>
            </main>
        );
    }

    if (!profile || !form) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200">
            {/* Banner */}
            <section
                aria-label="Profile banner"
                className="relative h-40 sm:h-48 md:h-60 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/90 to-indigo-900/50"></div>
            </section>

            {/* Profile Info & Badges */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-0 -mt-20 md:-mt-24 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap w-full md:w-auto justify-center md:justify-start">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex-shrink-0">
                        <Image
                            src={uploadPreview || profile.profilePicture || "/default-avatar.png"}
                            alt="Profile picture"
                            fill
                            className="object-cover"
                            sizes="160px"
                            unoptimized
                        />
                        {editMode && (
                            <label
                                htmlFor="upload-profile"
                                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-700 text-white px-3 py-1 rounded-full text-xs sm:text-sm cursor-pointer hover:bg-indigo-600 shadow"
                                aria-label="Change profile picture"
                            >
                                Change Picture
                                <input
                                    id="upload-profile"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={onProfilePicChange}
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex flex-col text-center md:text-left max-w-xs sm:max-w-sm mt-[-50px]">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg leading-tight truncate">
                            {profile.fullName}
                        </h1>
                        <p className="text-white mt-1 drop-shadow-md truncate">{profile.email}</p>
                        <p className="text-white mt-1 drop-shadow-md truncate">{profile.phone}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center w-full md:w-auto max-w-xs sm:max-w-md">
                    <Badge className="flex items-center gap-1 bg-indigo-700 text-white shadow-lg whitespace-nowrap text-sm sm:text-base">
                        {/* icon svg can go here */}
                        {profile.role || "User"}
                    </Badge>

                    {profile.badges?.map((badge) => (
                        <Badge
                            key={badge}
                            variant="secondary"
                            className="bg-indigo-200 text-indigo-900 font-semibold shadow text-xs sm:text-sm whitespace-nowrap"
                        >
                            {badge}
                        </Badge>
                    ))}
                </div>
            </section>

            {/* Tabs */}
            <nav
                className="max-w-7xl mx-auto px-2 sm:px-6 md:px-0 flex overflow-x-auto border-b border-indigo-300 bg-indigo-50"
                role="tablist"
            >
                {[
                    { id: "profile", label: "Profile Info" },
                    { id: "students", label: "Linked Students" },
                    { id: "emergency", label: "Emergency Contact" },
                    { id: "connections", label: "Connections" },
                    { id: "status", label: "Account Status" },
                    { id: "audit", label: "Audit Log" },
                ].map(({ id, label }) => (
                    <button
                        key={id}
                        className={`flex-shrink-0 px-5 py-3 font-semibold transition-colors whitespace-nowrap ${activeTab === id
                                ? "border-b-4 border-indigo-700 text-indigo-900 bg-indigo-100"
                                : "text-indigo-600 hover:text-indigo-800"
                            }`}
                        onClick={() => setActiveTab(id as any)}
                        aria-selected={activeTab === id}
                        role="tab"
                        tabIndex={activeTab === id ? 0 : -1}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {/* Tab Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-0 bg-white rounded-b-lg shadow-md min-h-[60vh] py-8">
                {activeTab === "profile" && (
                    <div
                        role="tabpanel"
                        aria-label="Profile Information"
                        className="space-y-6 max-w-3xl mx-auto"
                    >
                        <Field
                            label="Full Name"
                            editMode={editMode}
                            value={form.fullName}
                            onChange={(v) => onChange("fullName", v)}
                        />
                        <Field
                            label="Email"
                            editMode={editMode}
                            type="email"
                            value={form.email}
                            onChange={(v) => onChange("email", v)}
                        />
                        <Field
                            label="Phone"
                            editMode={editMode}
                            value={form.phone}
                            onChange={(v) => onChange("phone", v)}
                        />
                        <Field
                            label="Address"
                            editMode={editMode}
                            multiline
                            value={form.address}
                            onChange={(v) => onChange("address", v)}
                        />
                    </div>
                )}

                {activeTab === "students" && (
                    <div
                        role="tabpanel"
                        aria-label="Linked Students"
                        className="space-y-4 max-w-4xl mx-auto"
                    >
                        {profile.linkedStudents.length === 0 ? (
                            <p className="italic text-gray-500 text-center">No linked students.</p>
                        ) : (
                            profile.linkedStudents.map((student) => (
                                <Card
                                    key={student.id}
                                    className="p-4 hover:shadow-lg transition-shadow rounded-lg border border-indigo-200 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-lg font-semibold text-indigo-800">{student.name}</p>
                                        {student.grade && (
                                            <p className="text-sm text-gray-600">{student.grade}</p>
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            alert(`View ${student.name}'s details (TODO)`)
                                        }
                                    >
                                        View
                                    </Button>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "emergency" && (
                    <div
                        role="tabpanel"
                        aria-label="Emergency Contact"
                        className="space-y-6 max-w-lg mx-auto"
                    >
                        <Field
                            label="Emergency Contact Name"
                            editMode={editMode}
                            value={form.emergencyContactName}
                            onChange={(v) => onChange("emergencyContactName", v)}
                        />
                        <Field
                            label="Emergency Contact Phone"
                            editMode={editMode}
                            value={form.emergencyContactPhone}
                            onChange={(v) => onChange("emergencyContactPhone", v)}
                        />
                    </div>
                )}

                {activeTab === "connections" && (
                    <div
                        role="tabpanel"
                        aria-label="Connections"
                        className="max-w-4xl mx-auto text-center text-gray-700"
                    >
                        <p className="italic">Connections functionality will be implemented soon.</p>
                    </div>
                )}

                {activeTab === "status" && (
                    <div
                        role="tabpanel"
                        aria-label="Account Status"
                        className="max-w-4xl mx-auto text-center text-gray-700"
                    >
                        <p className="italic">Account status and activity info will be shown here.</p>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div
                        role="tabpanel"
                        aria-label="Audit Log"
                        className="max-w-6xl mx-auto overflow-x-auto"
                    >
                        <AuditLogTable />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-10 flex justify-end gap-4 max-w-3xl mx-auto flex-wrap">
                    {editMode ? (
                        <>
                            <Button variant="outline" onClick={cancelEdit}>
                                Cancel
                            </Button>
                            <Button onClick={saveChanges}>Save Changes</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                    )}
                </div>
            </section>
        </main>
    );
}

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    editMode: boolean;
    type?: "text" | "email" | "tel";
    multiline?: boolean;
}

function Field({
    label,
    value,
    onChange,
    editMode,
    type = "text",
    multiline = false,
}: FieldProps) {
    if (editMode) {
        if (multiline) {
            return (
                <div>
                    <label className="block font-medium mb-1 text-indigo-900">{label}</label>
                    <Textarea
                        rows={3}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="border border-indigo-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            );
        }
        return (
            <div>
                <label className="block font-medium mb-1 text-indigo-900">{label}</label>
                <Input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="border border-indigo-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        );
    }

    return (
        <div>
            <p className="text-gray-700 font-semibold">{label}</p>
            <p className="mt-1 text-gray-900 truncate">{value || "-"}</p>
        </div>
    );
}

function AuditLogTable() {
    // Placeholder data - replace with real audit logs later
    const logs = [
        { id: 1, date: "2025-08-01 12:45", action: "Logged in", ip: "192.168.1.100" },
        { id: 2, date: "2025-08-02 09:20", action: "Updated profile picture", ip: "192.168.1.100" },
        { id: 3, date: "2025-08-03 18:30", action: "Changed password", ip: "192.168.1.100" },
    ];

    return (
        <table className="min-w-full table-auto border-collapse border border-indigo-300 rounded-lg">
            <thead className="bg-indigo-100 text-indigo-800 font-semibold">
                <tr>
                    <th className="border border-indigo-300 px-4 py-2 text-left">Date & Time</th>
                    <th className="border border-indigo-300 px-4 py-2 text-left">Action</th>
                    <th className="border border-indigo-300 px-4 py-2 text-left">IP Address</th>
                </tr>
            </thead>
            <tbody>
                {logs.map(({ id, date, action, ip }) => (
                    <tr
                        key={id}
                        className="odd:bg-white even:bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-default"
                    >
                        <td className="border border-indigo-300 px-4 py-2">{date}</td>
                        <td className="border border-indigo-300 px-4 py-2">{action}</td>
                        <td className="border border-indigo-300 px-4 py-2">{ip}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
