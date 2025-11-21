"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
    FileText, 
    Mail, 
    Phone, 
    Clock, 
    Upload, 
    CheckCircle, 
    AlertCircle, 
    HelpCircle,
    UserCheck,
    Shield,
    Loader2
} from "lucide-react";

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
    const [uploading, setUploading] = useState(false);

    // Mock registration date (replace with real data from API/backend)
    const registeredAt = new Date().toISOString();

    const adminResponse =
        "Your documents are under review. Our administration team is currently verifying your submitted information. Please expect a response within 24-48 hours during business days.";
    const accountStatus = "Pending Activation — Awaiting admin approval";

    const getTabIcon = (tab: Tab) => {
        switch (tab) {
            case "Instructions":
                return <HelpCircle size={20} />;
            case "Read More":
                return <FileText size={20} />;
            case "Admin Response":
                return <Shield size={20} />;
            case "Account Status":
                return <UserCheck size={20} />;
            case "Upload Documents":
                return <Upload size={20} />;
            case "Contact Support":
                return <Mail size={20} />;
            default:
                return <FileText size={20} />;
        }
    };

    // Format date when component mounts
    useEffect(() => {
        const date = new Date(registeredAt);
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
        setActivationDate(formattedDate);

        // Page skeleton delay
        const timer = setTimeout(() => setPageLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    function onTabChange(tab: Tab) {
        if (tab === activeTab) return;
        setLoadingTab(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoadingTab(false);
        }, 500);
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        setUploadMessage(null);
        if (!e.target.files?.length) return;
        
        setUploading(true);
        await new Promise((r) => setTimeout(r, 2000));
        setUploading(false);
        setUploadMessage("Documents uploaded successfully! Our team will review them shortly.");
    }

    // 🌟 Entire Page Skeleton Loader
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-pulse">
                {/* Top Section Skeleton */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-20 pb-32">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="h-8 bg-blue-500 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-blue-500 rounded w-1/4 mb-8"></div>
                        <div className="h-48 bg-blue-500 rounded-xl"></div>
                    </div>
                </div>

                <main className="max-w-6xl mx-auto px-6 -mt-20 flex gap-8">
                    {/* Tabs Skeleton */}
                    <div className="w-80 space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-16 w-full bg-white rounded-2xl shadow-sm"></div>
                        ))}
                    </div>
                    
                    {/* Content Skeleton */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            <div className="h-48 bg-gray-200 rounded-xl mt-6"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-20 pb-32 text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <h1 className="text-4xl font-bold">Account Activation Pending</h1>
                    </div>
                    <p className="text-blue-100 text-lg mb-8">
                        Your account is being reviewed by our administration team
                    </p>
                    
                    {/* Status Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500 rounded-xl">
                                <AlertCircle size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Under Review</h3>
                                <p className="text-blue-100">Registered on {activationDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 -mt-20 flex flex-col lg:flex-row gap-8 mb-12">
                {/* Vertical Tabs */}
                <nav className="w-full lg:w-80 space-y-3">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab && !loadingTab;
                        return (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`w-full flex items-center gap-4 p-4 text-left rounded-2xl transition-all duration-300 border-2 ${
                                    isActive
                                        ? "bg-white border-indigo-500 shadow-lg shadow-indigo-500/25 text-indigo-700"
                                        : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md text-gray-600 hover:text-gray-900"
                                }`}
                                disabled={loadingTab}
                            >
                                <div className={`p-2 rounded-lg transition-colors ${
                                    isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {getTabIcon(tab)}
                                </div>
                                <span className="font-semibold text-sm">{tab}</span>
                                
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Content Area */}
                <section className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    {loadingTab ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 size={32} className="text-indigo-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Instructions Tab */}
                            {activeTab === "Instructions" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <HelpCircle size={24} className="text-indigo-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Activation Instructions</h2>
                                    </div>
                                    
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <span className="text-white text-sm font-bold">1</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Check Your Email</h4>
                                                    <p className="text-gray-700">Look for an activation link in your inbox (including spam folder)</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <span className="text-white text-sm font-bold">2</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Wait for Review</h4>
                                                    <p className="text-gray-700">Activation may take up to 24 hours depending on admin processing time</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <span className="text-white text-sm font-bold">3</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Complete Verification</h4>
                                                    <p className="text-gray-700">You may need to upload additional documents for verification</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Video Guide */}
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">Video Guide</h4>
                                        <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                                            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <FileText size={24} className="text-white" />
                                                    </div>
                                                    <p className="text-gray-600 font-medium">Activation Guide Video</p>
                                                    <p className="text-gray-500 text-sm">Coming Soon</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Read More Tab */}
                            {activeTab === "Read More" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText size={24} className="text-indigo-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">About Activation Process</h2>
                                    </div>
                                    
                                    <div className="space-y-4 text-gray-700 leading-relaxed">
                                        <p>
                                            The activation process ensures your account is properly verified and approved by university administration. 
                                            This security measure protects both students and the institution.
                                        </p>
                                        
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-semibold text-gray-900 mb-2">What to Expect:</h4>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                    <span>Document verification (ID, enrollment proof)</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                    <span>Academic record validation</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                    <span>System access configuration</span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        <p>
                                            The process typically takes 1-2 business days. You&apos;ll receive email notifications at each step, 
                                            and your account will be fully activated once all verifications are complete.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Admin Response Tab */}
                            {activeTab === "Admin Response" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Shield size={24} className="text-indigo-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Admin Response</h2>
                                    </div>
                                    
                                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                                                <CheckCircle size={24} className="text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-900 mb-2">Review in Progress</h4>
                                                <p className="text-green-800 leading-relaxed">{adminResponse}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} />
                                        <span>Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            )}

                            {/* Account Status Tab */}
                            {activeTab === "Account Status" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <UserCheck size={24} className="text-indigo-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Account Status</h2>
                                    </div>
                                    
                                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-orange-100 rounded-lg">
                                                <AlertCircle size={24} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-orange-900 text-lg">{accountStatus}</h4>
                                                <p className="text-orange-800 mt-1">Your account registration is complete and pending administrative approval</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="text-2xl font-bold text-gray-900">1</div>
                                            <div className="text-sm text-gray-600">Step Completed</div>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="text-2xl font-bold text-blue-900">2</div>
                                            <div className="text-sm text-blue-600">In Progress</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="text-2xl font-bold text-gray-900">3</div>
                                            <div className="text-sm text-gray-600">Pending</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Upload Documents Tab */}
                            {activeTab === "Upload Documents" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Upload size={24} className="text-indigo-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                                    </div>
                                    
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                        <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
                                        <div className="space-y-3 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-blue-500" />
                                                <span>Government-issued ID (Passport, National ID)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-blue-500" />
                                                <span>Proof of enrollment or admission letter</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-blue-500" />
                                                <span>Recent passport-sized photograph</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload size={24} className="text-indigo-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Upload Files</h4>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Drag and drop files here or click to browse<br />
                                            Supported formats: PDF, JPG, PNG (Max: 10MB each)
                                        </p>
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleUpload}
                                            className="hidden"
                                            id="document-upload"
                                        />
                                        <label
                                            htmlFor="document-upload"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                                        >
                                            {uploading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Upload size={16} />
                                            )}
                                            {uploading ? "Uploading..." : "Choose Files"}
                                        </label>
                                    </div>

                                    {uploadMessage && (
                                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle size={16} />
                                                <span className="font-medium">{uploadMessage}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contact Support Tab */}
                            {activeTab === "Contact Support" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Mail size={24} className="text-indigo-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Mail size={20} className="text-indigo-600" />
                                                <h4 className="font-semibold text-gray-900">Email Support</h4>
                                            </div>
                                            <a 
                                                href="mailto:support@uoh.edu.so" 
                                                className="text-indigo-600 hover:text-indigo-700 font-medium block mb-1"
                                            >
                                                support@uoh.edu.so
                                            </a>
                                            <p className="text-gray-600 text-sm">Typically responds within 2 hours</p>
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Phone size={20} className="text-indigo-600" />
                                                <h4 className="font-semibold text-gray-900">Phone Support</h4>
                                            </div>
                                            <a 
                                                href="tel:+252631234567" 
                                                className="text-indigo-600 hover:text-indigo-700 font-medium block mb-1"
                                            >
                                                +252 63 123 4567
                                            </a>
                                            <p className="text-gray-600 text-sm">Available during office hours</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                        <h4 className="font-semibold text-gray-900 mb-3">Office Hours</h4>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex justify-between">
                                                <span>Sunday - Thursday:</span>
                                                <span className="font-medium">9:00 AM - 5:00 PM</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Friday - Saturday:</span>
                                                <span className="font-medium">Closed</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium mb-2">When contacting support, please have ready:</p>
                                        <ul className="space-y-1 list-disc list-inside">
                                            <li>Your full name and student ID</li>
                                            <li>Email address used for registration</li>
                                            <li>Description of the issue you&apos;re facing</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}