"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const tabs = [
    "Instructions",
    "Read More",
    "Admin Response",
    "Account Status",
    "Upload Documents",
    "Contact Support",
] as const;
type Tab = typeof tabs[number];

export default function ActivationPending() {
    const [activeTab, setActiveTab] = useState<Tab>("Instructions");
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [loadingTab, setLoadingTab] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [activationDate, setActivationDate] = useState<string>("");

    // Mock registration date (replace with real data from API/backend)
    const registeredAt = new Date().toISOString();

    const adminResponse =
        "Your documents are under review. Please expect a response within 24 hours.";
    const accountStatus = "Pending Activation — Awaiting admin approval";

    
    // Format date when component mounts
    useEffect(() => {
        const date = new Date(registeredAt);
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        setActivationDate(formattedDate);

        // Page skeleton delay
        const timer = setTimeout(() => setPageLoading(false), 3400);
        return () => clearTimeout(timer);
    }, []);

    function onTabChange(tab: Tab) {
        if (tab === activeTab) return;
        setLoadingTab(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoadingTab(false);
        }, 1500);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        setUploadMessage(null);
        if (!e.target.files?.length) return;
        await new Promise((r) => setTimeout(r, 1500));
        setUploadMessage("Documents uploaded successfully. Admin will review shortly.");
    }

    // 🌟 Entire Page Skeleton Loader
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-indigo-50 animate-pulse">
                {/* Top Illustration Skeleton */}
                <div className="w-full h-72 md:h-96 bg-indigo-200"></div>

                <main className="max-w-6xl mx-auto px-6 py-20 flex gap-10">
                    <div className="w-64 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-10 w-full bg-indigo-200 rounded"></div>
                        ))}
                    </div>
                    <div className="flex-1 space-y-6">
                        <div className="h-10 bg-indigo-200 rounded w-2/3"></div>
                        <div className="h-6 bg-indigo-200 rounded w-1/3"></div>
                        <div className="h-48 bg-indigo-200 rounded"></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-indigo-50 relative">
            <br />
            <br />
            <br />

            {/* Top Illustration */}
            <div className="relative w-full h-72 md:h-96 bg-indigo-50 overflow-visible mb-20">
                <Image
                    src="/activation-pending-illustration.svg"
                    alt="Account Activation Pending Illustration"
                    fill
                    className="object-contain"
                    priority
                    quality={100}
                />
            </div>

            <main className="max-w-6xl mx-auto px-6 flex gap-10">
                {/* Vertical Tabs (Left) */}
                <nav
                    aria-label="Activation Tabs"
                    className="flex flex-col gap-3 w-64 border-r border-indigo-200 pr-4"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => onTabChange(tab)}
                            className={`py-3 px-4 text-lg font-semibold rounded-md transition-colors text-left ${activeTab === tab && !loadingTab
                                    ? "bg-indigo-100 border-l-4 border-indigo-700 text-indigo-900"
                                    : "text-indigo-600 hover:bg-indigo-50 border-l-4 border-transparent"
                                }`}
                            disabled={loadingTab}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Tab Content (Right) */}
                <section className="flex-1 min-h-[400px]">
                    <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">
                        Account Activation Pending
                    </h1>
                    <time dateTime={registeredAt} className="text-indigo-600 font-medium text-lg">
                        Registered on: {activationDate}
                    </time>
                    <p className="mt-4 text-indigo-700 text-lg max-w-2xl leading-relaxed">
                        Your account has been created but is currently inactive. Follow the steps below or contact support to complete your activation.
                    </p>

                    <div className="mt-8">
                        {loadingTab ? (
                            <div className="animate-pulse space-y-6">
                                <div className="h-6 bg-indigo-200 rounded w-2/3"></div>
                                <div className="h-48 bg-indigo-200 rounded"></div>
                            </div>
                        ) : (
                            <>
                                {activeTab === "Instructions" && (
                                    <div className="space-y-6 mt-4">
                                        <p>Please check your email inbox (and spam folder) for an activation link. Activation may take up to 24 hours depending on admin processing time.</p>
                                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md max-w-3xl">
                                            <iframe
                                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                                title="Account Activation Instructions"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Read More" && (
                                    <p className="mt-4">
                                        The activation process ensures your account is verified and approved by university administration. It may involve document verification or further information requests.
                                    </p>
                                )}

                                {activeTab === "Admin Response" && <p className="mt-4">{adminResponse}</p>}

                                {activeTab === "Account Status" && (
                                    <p className="mt-4 font-semibold text-indigo-900">{accountStatus}</p>
                                )}

                                {activeTab === "Upload Documents" && (
                                    <div className="mt-4">
                                        <p className="mb-4">Upload necessary documents (PDF, JPG, PNG) to verify your identity:</p>
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleUpload}
                                            className="block border border-indigo-300 rounded-md p-2 cursor-pointer"
                                        />
                                        {uploadMessage && (
                                            <p className="mt-4 text-green-600 font-medium">{uploadMessage}</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === "Contact Support" && (
                                    <div className="mt-4 space-y-4">
                                        <p>If you need help, contact support:</p>
                                        <a href="mailto:support@uoh.edu.so" className="text-indigo-700 font-semibold hover:underline">
                                            support@uoh.edu.so
                                        </a>
                                        <p>Phone: +252 63 1234567</p>
                                        <p>Office Hours: 9am - 5pm (Sunday to Thursday)</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
