"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
    KeyRound, 
    ShieldCheck, 
    Smartphone, 
    Mail, 
    User, 
    Phone, 
    MapPin,
    Save,
    X,
    Edit3,
    Bell,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

interface AccountSettingsData {
    username: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    twoFactor: {
        authenticator: boolean;
        sms: boolean;
        email: boolean;
    };
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    profilePicture?: string;
}

export default function AccountSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<AccountSettingsData | null>(null);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/auth/login");
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            
            // Get actual user data from localStorage or use sensible defaults
            const loadedProfile: AccountSettingsData = {
                username: userData.username || userData.fullName?.toLowerCase().replace(/\s+/g, '_') || "user",
                email: userData.email || "",
                name: userData.fullName || userData.name || "",
                phone: userData.phone || "",
                address: userData.address || "",
                profilePicture: userData.profilePicture,
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
                twoFactor: {
                    authenticator: userData.twoFactor?.authenticator || false,
                    sms: userData.twoFactor?.sms || true,
                    email: userData.twoFactor?.email || false,
                },
                notifications: {
                    email: userData.notifications?.email ?? true,
                    push: userData.notifications?.push ?? false,
                    sms: userData.notifications?.sms ?? true,
                },
            };
            
            setForm(loadedProfile);
        } catch (e) {
            console.error("Failed to parse user data", e);
            toast.error("Failed to load user data");
            router.push("/auth/login");
        } finally {
            setLoading(false);
        }
    };

    const onChange = <K extends keyof AccountSettingsData>(field: K, value: AccountSettingsData[K]) => {
        if (!form) return;
        setForm({ ...form, [field]: value });
    };

    const on2FAChange = (method: keyof AccountSettingsData["twoFactor"], value: boolean) => {
        if (!form) return;
        setForm({ 
            ...form, 
            twoFactor: { ...form.twoFactor, [method]: value } 
        });
    };

    const onNotificationChange = (method: keyof AccountSettingsData["notifications"], value: boolean) => {
        if (!form) return;
        setForm({ 
            ...form, 
            notifications: { ...form.notifications, [method]: value } 
        });
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = (): boolean => {
        if (!form) return false;

        // Basic validation for required fields
        if (!form.name.trim()) {
            toast.error("Full name is required");
            return false;
        }

        if (!form.email.trim()) {
            toast.error("Email is required");
            return false;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Password validation if changing password
        if (form.newPassword || form.confirmNewPassword || form.oldPassword) {
            if (!form.oldPassword) {
                toast.error("Current password is required to change password");
                return false;
            }

            if (!form.newPassword) {
                toast.error("New password is required");
                return false;
            }

            if (form.newPassword.length < 8) {
                toast.error("Password must be at least 8 characters long");
                return false;
            }

            if (form.newPassword !== form.confirmNewPassword) {
                toast.error("New passwords do not match");
                return false;
            }
        }

        return true;
    };

    const saveChanges = async () => {
        if (!form || !validateForm()) return;
        
        setSaving(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get current user data
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                toast.error("User session expired");
                router.push("/auth/login");
                return;
            }

            const currentUser = JSON.parse(storedUser);
            
            // Update user data
            const updatedUser = {
                ...currentUser,
                fullName: form.name,
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                twoFactor: form.twoFactor,
                notifications: form.notifications,
                // Only update password if it was changed
                ...(form.newPassword && { 
                    password: form.newPassword, // In real app, this would be hashed
                    passwordLastChanged: new Date().toISOString()
                })
            };
            
            // Save to localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Save settings separately for persistence
            const userSettings = {
                twoFactor: form.twoFactor,
                notifications: form.notifications,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(`user_settings_${currentUser.userId || currentUser.id}`, JSON.stringify(userSettings));
            
            toast.success("Settings saved successfully!");
            setEditMode(false);
            
            // Reset password fields
            setForm(prev => prev ? {
                ...prev,
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            } : null);
            
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setEditMode(false);
        loadUserData(); // Reload original data
    };

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && form) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const profilePicture = e.target?.result as string;
                setForm({ ...form, profilePicture });
                
                // Update in localStorage as well
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    userData.profilePicture = profilePicture;
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="container mx-auto p-6 space-y-8">
                    <Skeleton className="h-8 w-64" />
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <Skeleton className="h-10" />
                            <Skeleton className="h-10" />
                            <Skeleton className="h-10" />
                        </TabsList>
                        
                        <TabsContent value="profile" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-48" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-20 w-20 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <Skeleton key={i} className="h-10 w-full" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        );
    }

    if (!form) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p>No profile data found.</p>
                    <Button 
                        onClick={() => router.push("/auth/login")}
                        className="mt-4"
                    >
                        Return to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto p-4 md:p-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Account Settings
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Manage your account settings and preferences
                        </p>
                    </div>
                    
                    {!editMode ? (
                        <Button 
                            onClick={() => setEditMode(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Settings
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={cancelEdit}
                                className="border-slate-300 dark:border-slate-600"
                                disabled={saving}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button 
                                onClick={saveChanges}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Main Content with Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifications
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal information and how others see you on the platform.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-700 shadow-lg">
                                            <AvatarImage 
                                                src={form.profilePicture || "/default-avatar.png"} 
                                                alt={form.name}
                                            />
                                            <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                                                {form.name?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {editMode && (
                                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleProfilePictureChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                            {form.name || "No name set"}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {form.email || "No email set"}
                                        </p>
                                        <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                            @{form.username}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={form.name}
                                                disabled={!editMode}
                                                onChange={(e) => onChange("name", e.target.value)}
                                                className="pl-10"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Username
                                        </label>
                                        <Input
                                            value={form.username}
                                            disabled
                                            className="bg-slate-50 dark:bg-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="email"
                                                value={form.email}
                                                disabled={!editMode}
                                                onChange={(e) => onChange("email", e.target.value)}
                                                className="pl-10"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="tel"
                                                value={form.phone}
                                                disabled={!editMode}
                                                onChange={(e) => onChange("phone", e.target.value)}
                                                className="pl-10"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={form.address}
                                                disabled={!editMode}
                                                onChange={(e) => onChange("address", e.target.value)}
                                                className="pl-10"
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        {/* Password Change */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <KeyRound className="w-5 h-5 text-blue-600" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            type={showPasswords.old ? "text" : "password"}
                                            placeholder="Enter current password"
                                            disabled={!editMode}
                                            value={form.oldPassword}
                                            onChange={(e) => onChange("oldPassword", e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => togglePasswordVisibility("old")}
                                            disabled={!editMode}
                                        >
                                            {showPasswords.old ? (
                                                <EyeOff className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            type={showPasswords.new ? "text" : "password"}
                                            placeholder="Enter new password"
                                            disabled={!editMode}
                                            value={form.newPassword}
                                            onChange={(e) => onChange("newPassword", e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => togglePasswordVisibility("new")}
                                            disabled={!editMode}
                                        >
                                            {showPasswords.new ? (
                                                <EyeOff className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            )}
                                        </Button>
                                    </div>
                                    {form.newPassword && (
                                        <p className={`text-xs ${
                                            form.newPassword.length >= 8 
                                                ? 'text-green-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {form.newPassword.length >= 8 
                                                ? '✓ Password strength: Good' 
                                                : 'Password must be at least 8 characters'
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            disabled={!editMode}
                                            value={form.confirmNewPassword}
                                            onChange={(e) => onChange("confirmNewPassword", e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => togglePasswordVisibility("confirm")}
                                            disabled={!editMode}
                                        >
                                            {showPasswords.confirm ? (
                                                <EyeOff className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            )}
                                        </Button>
                                    </div>
                                    {form.confirmNewPassword && form.newPassword && (
                                        <p className={`text-xs ${
                                            form.newPassword === form.confirmNewPassword 
                                                ? 'text-green-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {form.newPassword === form.confirmNewPassword 
                                                ? '✓ Passwords match' 
                                                : '✗ Passwords do not match'
                                            }
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Two-Factor Authentication */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    Two-Factor Authentication
                                </CardTitle>
                                <CardDescription>
                                    Add an extra layer of security to your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Authenticator App */}
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                Authenticator App
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Use apps like Google Authenticator for codes
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={form.twoFactor.authenticator}
                                        onCheckedChange={(v) => on2FAChange("authenticator", v)}
                                        disabled={!editMode}
                                    />
                                </div>

                                {/* SMS Verification */}
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                SMS Verification
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Get codes via text message
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={form.twoFactor.sms}
                                        onCheckedChange={(v) => on2FAChange("sms", v)}
                                        disabled={!editMode}
                                    />
                                </div>

                                {/* Email Verification */}
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                Email Verification
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Receive codes via email
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={form.twoFactor.email}
                                        onCheckedChange={(v) => on2FAChange("email", v)}
                                        disabled={!editMode}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>
                                    Choose how you want to be notified about important updates.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                            <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                Email Notifications
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Receive updates via email
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={form.notifications.email}
                                        onCheckedChange={(v) => onNotificationChange("email", v)}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                Push Notifications
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Receive browser push notifications
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={form.notifications.push}
                                        onCheckedChange={(v) => onNotificationChange("push", v)}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                SMS Notifications
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Receive text message alerts
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={form.notifications.sms}
                                        onCheckedChange={(v) => onNotificationChange("sms", v)}
                                        disabled={!editMode}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}