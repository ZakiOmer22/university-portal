"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyRound, ShieldCheck, Smartphone, Mail } from "lucide-react";

interface AccountSettingsData {
    username: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    oldPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    twoFactor: {
        authenticator: boolean;
        sms: boolean;
        email: boolean;
    };
}

export default function AccountSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<AccountSettingsData | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/auth/login");
            return;
        }

        // Simulate network delay for skeleton loading
        setTimeout(() => {
            try {
                const userData = JSON.parse(storedUser);
                const loadedProfile: AccountSettingsData = {
                    username: userData.username || "",
                    email: userData.email || "",
                    name: userData.name || "",
                    phone: userData.phone || "",
                    address: userData.address || "",
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                    twoFactor: {
                        authenticator: false,
                        sms: false,
                        email: false,
                    },
                };
                setForm(loadedProfile);
            } catch (e) {
                console.error("Failed to parse user", e);
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        }, 1200);
    }, [router]);

    const onChange = (field: keyof AccountSettingsData, value: any) => {
        if (!form) return;
        setForm({ ...form, [field]: value });
    };

    const on2FAChange = (method: keyof AccountSettingsData["twoFactor"], value: boolean) => {
        if (!form) return;
        setForm({ ...form, twoFactor: { ...form.twoFactor, [method]: value } });
    };

    const saveChanges = () => {
        if (!form) return;
        if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        alert("Settings saved successfully!");
        setEditMode(false);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200">
                <section className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
                    <Skeleton className="h-8 w-48" />
                    {/* Profile Info Skeleton */}
                    <Card className="p-6 space-y-6 bg-white shadow-lg">
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                ))}
                            </div>
                        </div>
                    </Card>
                    {/* Password Skeleton */}
                    <Card className="p-6 bg-white shadow-lg space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </Card>
                    {/* 2FA Skeleton */}
                    <Card className="p-6 bg-white shadow-lg space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-6 w-12 rounded-full" />
                            </div>
                        ))}
                    </Card>
                </section>
            </main>
        );
    }

    if (!form) {
        return <div className="flex justify-center items-center h-screen text-gray-500">No profile data.</div>;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200">
            <section className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
                <h1 className="text-4xl font-extrabold text-indigo-900 drop-shadow-lg">Account Settings</h1>

                {/* Profile Info */}
                <Card className="p-6 space-y-6 bg-white shadow-lg">
                    <h2 className="text-2xl font-bold text-indigo-900">Profile Information</h2>
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="https://source.unsplash.com/random/200x200?face" />
                            <AvatarFallback>{form.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold">Username</label>
                                <Input value={form.username} disabled />
                            </div>
                            <div>
                                <label className="block font-semibold">Email</label>
                                <Input value={form.email} disabled />
                            </div>
                            <div>
                                <label className="block font-semibold">Full Name</label>
                                <Input
                                    value={form.name}
                                    disabled={!editMode}
                                    onChange={(e) => onChange("name", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Phone</label>
                                <Input
                                    value={form.phone}
                                    disabled={!editMode}
                                    onChange={(e) => onChange("phone", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-semibold">Address</label>
                                <Input
                                    value={form.address}
                                    disabled={!editMode}
                                    onChange={(e) => onChange("address", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Password Change */}
                <Card className="p-6 bg-white shadow-lg space-y-4">
                    <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-indigo-600" /> Change Password
                    </h2>
                    <Input
                        type="password"
                        placeholder="Current Password"
                        disabled={!editMode}
                        value={form.oldPassword}
                        onChange={(e) => onChange("oldPassword", e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="New Password"
                        disabled={!editMode}
                        value={form.newPassword}
                        onChange={(e) => onChange("newPassword", e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm New Password"
                        disabled={!editMode}
                        value={form.confirmNewPassword}
                        onChange={(e) => onChange("confirmNewPassword", e.target.value)}
                    />
                </Card>

                {/* Two-Factor Authentication */}
                <Card className="p-6 bg-white shadow-lg space-y-6">
                    <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-indigo-600" /> Two-Factor Authentication
                    </h2>

                    {/* Authenticator App */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="font-semibold">Authenticator App</p>
                                <p className="text-sm text-gray-500">Use apps like Google Authenticator for codes.</p>
                            </div>
                        </div>
                        <Switch
                            checked={form.twoFactor.authenticator}
                            onCheckedChange={(v) => on2FAChange("authenticator", v)}
                            disabled={!editMode}
                        />
                    </div>

                    {/* SMS Verification */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="font-semibold">SMS Verification</p>
                                <p className="text-sm text-gray-500">Get codes via text message.</p>
                            </div>
                        </div>
                        <Switch
                            checked={form.twoFactor.sms}
                            onCheckedChange={(v) => on2FAChange("sms", v)}
                            disabled={!editMode}
                        />
                    </div>

                    {/* Email Verification */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="font-semibold">Email Verification</p>
                                <p className="text-sm text-gray-500">Receive codes via email.</p>
                            </div>
                        </div>
                        <Switch
                            checked={form.twoFactor.email}
                            onCheckedChange={(v) => on2FAChange("email", v)}
                            disabled={!editMode}
                        />
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    {editMode ? (
                        <>
                            <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                            <Button onClick={saveChanges}>Save Changes</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMode(true)}>Edit Settings</Button>
                    )}
                </div>
            </section>
        </main>
    );
}
