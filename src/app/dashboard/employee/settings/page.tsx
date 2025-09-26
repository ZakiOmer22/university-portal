"use client";

import { useState, useEffect, useRef } from "react";

interface SystemSettings {
    siteName: string;
    contactEmail: string;
    maintenanceMode: boolean;
    allowUserRegistration: boolean;
    logoUrl: string;
    timezone: string;
    language: string;
    themeMode: "light" | "dark" | "system";
}

const TIMEZONES = [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Africa/Nairobi",
    "Australia/Sydney",
];

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "so", label: "Somali" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
];

export default function SystemSettingsPage() {
    const defaultSettings: SystemSettings = {
        siteName: "University Portal",
        contactEmail: "contact@university.edu",
        maintenanceMode: false,
        allowUserRegistration: true,
        logoUrl: "https://example.com/logo.png",
        timezone: "UTC",
        language: "en",
        themeMode: "system",
    };

    const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validation state
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Input change handler
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value, type } = e.target;

        // Check if target is an input element to safely access checked
        const checked = (e.target as HTMLInputElement).checked;

        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (validationErrors[name]) {
            setValidationErrors((v) => ({ ...v, [name]: "" }));
        }
    }

    // Validate form inputs
    function validate(): boolean {
        let errors: Record<string, string> = {};

        if (!settings.siteName.trim()) {
            errors.siteName = "Site name is required.";
        }
        if (!settings.contactEmail.trim()) {
            errors.contactEmail = "Contact email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)) {
            errors.contactEmail = "Invalid email address.";
        }
        if (settings.logoUrl && !/^https?:\/\/.+/.test(settings.logoUrl)) {
            errors.logoUrl = "Logo URL must be a valid URL.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }

    // Save settings handler
    async function saveSettings() {
        if (!validate()) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Replace with your actual API call
            await new Promise((res) => setTimeout(res, 1200));

            setSuccess("Settings saved successfully!");
        } catch (err) {
            setError("Failed to save settings.");
        } finally {
            setLoading(false);
        }
    }

    // Reset to default confirmation modal handlers
    function confirmReset() {
        setShowResetConfirm(true);
    }
    function cancelReset() {
        setShowResetConfirm(false);
    }
    function resetToDefaults() {
        setSettings(defaultSettings);
        setShowResetConfirm(false);
        setSuccess("Settings reset to default values.");
    }

    // Export settings JSON
    function exportSettings() {
        const dataStr = JSON.stringify(settings, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "system-settings.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import settings JSON file
    function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const imported = JSON.parse(reader.result as string);
                // Simple validation for keys
                if (
                    typeof imported.siteName === "string" &&
                    typeof imported.contactEmail === "string"
                ) {
                    setSettings(imported);
                    setSuccess("Settings imported successfully!");
                    setError(null);
                } else {
                    setError("Invalid settings JSON file.");
                }
            } catch {
                setError("Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);

        // Reset input so user can import the same file again if needed
        e.target.value = "";
    }

    // Drag & drop logo upload
    function handleLogoDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (e.dataTransfer.files.length === 0) return;

        const file = e.dataTransfer.files[0];
        if (!file.type.startsWith("image/")) {
            setError("Only image files allowed for logo.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSettings((prev) => ({ ...prev, logoUrl: reader.result as string }));
            setError(null);
        };
        reader.readAsDataURL(file);
    }
    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-4xl font-extrabold mb-8 text-indigo-900">System Settings</h1>

            {/* Notification */}
            {error && (
                <div className="mb-6 p-3 bg-red-100 text-red-700 rounded shadow">{error}</div>
            )}
            {success && (
                <div className="mb-6 p-3 bg-green-100 text-green-700 rounded shadow">{success}</div>
            )}

            {/* Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    saveSettings();
                }}
                noValidate
                className="space-y-8"
            >
                {/* General Settings Card */}
                <section className="p-6 border rounded-lg shadow-sm bg-gray-50">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-800">General</h2>

                    <div className="mb-5">
                        <label htmlFor="siteName" className="block font-semibold mb-1">
                            Site Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="siteName"
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${validationErrors.siteName
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-indigo-400"
                                }`}
                            placeholder="Enter site name"
                        />
                        {validationErrors.siteName && (
                            <p className="text-red-600 mt-1">{validationErrors.siteName}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="contactEmail" className="block font-semibold mb-1">
                            Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            value={settings.contactEmail}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${validationErrors.contactEmail
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-indigo-400"
                                }`}
                            placeholder="Enter contact email"
                        />
                        {validationErrors.contactEmail && (
                            <p className="text-red-600 mt-1">{validationErrors.contactEmail}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="timezone" className="block font-semibold mb-1">
                            Timezone
                        </label>
                        <select
                            id="timezone"
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {TIMEZONES.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="language" className="block font-semibold mb-1">
                            Language
                        </label>
                        <select
                            id="language"
                            name="language"
                            value={settings.language}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {LANGUAGES.map(({ code, label }) => (
                                <option key={code} value={code}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p className="block font-semibold mb-1">Theme Mode</p>
                        <div className="flex space-x-4">
                            {(["light", "dark", "system"] as SystemSettings["themeMode"][]).map(
                                (mode) => (
                                    <label
                                        key={mode}
                                        className={`cursor-pointer px-4 py-2 rounded border ${settings.themeMode === mode
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "border-gray-300 hover:border-indigo-500"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="themeMode"
                                            value={mode}
                                            checked={settings.themeMode === mode}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* Logo Upload Card */}
                <section
                    className="p-6 border rounded-lg shadow-sm bg-gray-50"
                    onDrop={handleLogoDrop}
                    onDragOver={handleDragOver}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Site Logo</h2>

                    <div className="mb-3">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                    setSettings((prev) => ({ ...prev, logoUrl: reader.result as string }));
                                    setError(null);
                                };
                                reader.readAsDataURL(file);
                                e.target.value = "";
                            }}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            Upload Logo
                        </button>
                    </div>

                    {settings.logoUrl && (
                        <div className="border p-3 rounded flex items-center space-x-4">
                            <img
                                src={settings.logoUrl}
                                alt="Logo Preview"
                                className="h-20 object-contain rounded"
                            />
                            <button
                                type="button"
                                onClick={() => setSettings((prev) => ({ ...prev, logoUrl: "" }))}
                                className="text-red-600 hover:underline"
                            >
                                Remove Logo
                            </button>
                        </div>
                    )}

                    <p className="mt-2 text-gray-600 text-sm italic">
                        Drag & drop an image file here to upload
                    </p>
                </section>

                {/* Toggles Card */}
                <section className="p-6 border rounded-lg shadow-sm bg-gray-50">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Features</h2>

                    <div className="flex items-center space-x-3 mb-4">
                        <input
                            type="checkbox"
                            id="maintenanceMode"
                            name="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onChange={handleChange}
                            className="h-5 w-5"
                        />
                        <label htmlFor="maintenanceMode" className="font-semibold cursor-pointer">
                            Enable Maintenance Mode
                        </label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="allowUserRegistration"
                            name="allowUserRegistration"
                            checked={settings.allowUserRegistration}
                            onChange={handleChange}
                            className="h-5 w-5"
                        />
                        <label
                            htmlFor="allowUserRegistration"
                            className="font-semibold cursor-pointer"
                        >
                            Allow User Registration
                        </label>
                    </div>
                </section>

                {/* Actions */}
                <section className="flex flex-wrap gap-4 mt-6 justify-end">
                    <button
                        type="button"
                        onClick={confirmReset}
                        className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Reset to Defaults
                    </button>

                    <button
                        type="button"
                        onClick={exportSettings}
                        className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Export Settings (JSON)
                    </button>

                    <label
                        htmlFor="importSettingsFile"
                        className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Import Settings (JSON)
                    </label>
                    <input
                        id="importSettingsFile"
                        type="file"
                        accept="application/json"
                        onChange={handleImportFile}
                        className="hidden"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded text-white font-semibold ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 mx-auto text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                ></path>
                            </svg>
                        ) : (
                            "Save Settings"
                        )}
                    </button>
                </section>
            </form>

            {/* Reset confirmation modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-red-700">
                            Confirm Reset
                        </h3>
                        <p className="mb-6">
                            Are you sure you want to reset all settings to their default values? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelReset}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetToDefaults}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
