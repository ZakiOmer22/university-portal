"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FileUpload from "@/components/custom/file-upload";
import { CollegeSelector } from "@/components/custom/college-selector";
import {
    IconInfoCircle,
    IconUser,
    IconCertificate,
    IconCreditCard,
} from "@tabler/icons-react";

type FormData = {
    name?: string;
    email?: string;
    phone?: string;
    nid?: string;
    school?: string;
    examId?: string;
    transcript?: File | null;
    certificates?: File | null;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    college?: string;
    motivation?: string;
    paymentRef?: string;
    paymentReceipt?: File | null;
    termsAccepted?: boolean;
};

export default function MultiStepForm() {
    // Toggle to show form or "Applications Closed"
    const isApplicationOpen = true;

    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        transcript: null,
        certificates: null,
        paymentReceipt: null,
    });

    const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const steps = [
        {
            title: "Personal Info",
            icon: <IconUser size={18} />,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Full Name"
                        value={formData.name ?? ""}
                        onChange={(e) => updateField("name", e.target.value)}
                    />
                    <Input
                        placeholder="Email Address"
                        value={formData.email ?? ""}
                        onChange={(e) => updateField("email", e.target.value)}
                    />
                    <Input
                        placeholder="Phone Number"
                        value={formData.phone ?? ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                    />
                    <Input
                        placeholder="National ID Number"
                        value={formData.nid ?? ""}
                        onChange={(e) => updateField("nid", e.target.value)}
                    />
                </div>
            ),
        },
        {
            title: "Academic Info",
            icon: <IconCertificate size={18} />,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="High School Name"
                        value={formData.school ?? ""}
                        onChange={(e) => updateField("school", e.target.value)}
                    />
                    <Input
                        placeholder="High School Exam ID"
                        value={formData.examId ?? ""}
                        onChange={(e) => updateField("examId", e.target.value)}
                    />

                    <div>
                        <FileUpload
                            label="Upload Transcript"
                            accept=".pdf,.jpg,.png,.doc,.docx"
                            onChange={(file) => updateField("transcript", file)}
                        />
                        <p className="mt-1 text-sm text-gray-600">
                            {formData.transcript ? (
                                <span className="font-medium text-green-700">Uploaded: {formData.transcript.name}</span>
                            ) : (
                                "No transcript uploaded yet"
                            )}
                        </p>
                    </div>

                    <div>
                        <FileUpload
                            label="Upload Other Certificates"
                            accept=".pdf,.jpg,.png,.doc,.docx"
                            onChange={(file) => updateField("certificates", file)}
                        />
                        <p className="mt-1 text-sm text-gray-600">
                            {formData.certificates ? (
                                <span className="font-medium text-green-700">Uploaded: {formData.certificates.name}</span>
                            ) : (
                                "No certificates uploaded yet"
                            )}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Parent / Guardian Info",
            icon: <IconUser size={18} />,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Parent/Guardian Name"
                        value={formData.parentName ?? ""}
                        onChange={(e) => updateField("parentName", e.target.value)}
                    />
                    <Input
                        placeholder="Parent Phone Number"
                        value={formData.parentPhone ?? ""}
                        onChange={(e) => updateField("parentPhone", e.target.value)}
                    />
                    <Input
                        placeholder="Parent Email (optional)"
                        value={formData.parentEmail ?? ""}
                        onChange={(e) => updateField("parentEmail", e.target.value)}
                    />
                </div>
            ),
        },
        {
            title: "Program Selection",
            icon: <IconInfoCircle size={18} />,
            content: (
                <div className="space-y-4">
                    <CollegeSelector onSelect={(c) => updateField("college", c)} value={formData.college} />
                    <Textarea
                        placeholder="Why do you want to apply for this program?"
                        value={formData.motivation ?? ""}
                        onChange={(e) => updateField("motivation", e.target.value)}
                    />
                </div>
            ),
        },
        {
            title: "Payment & Submit",
            icon: <IconCreditCard size={18} />,
            content: (
                <div className="space-y-4">
                    <Input
                        placeholder="Payment Reference Number"
                        value={formData.paymentRef ?? ""}
                        onChange={(e) => updateField("paymentRef", e.target.value)}
                    />
                    <div>
                        <FileUpload
                            label="Upload Payment Receipt"
                            accept=".pdf,.jpg,.png"
                            onChange={(file) => updateField("paymentReceipt", file)}
                        />
                        <p className="mt-1 text-sm text-gray-600">
                            {formData.paymentReceipt ? (
                                <span className="font-medium text-green-700">Uploaded: {formData.paymentReceipt.name}</span>
                            ) : (
                                "No payment receipt uploaded yet"
                            )}
                        </p>
                    </div>
                    <div className="text-sm">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={!!formData.termsAccepted}
                                onChange={(e) => updateField("termsAccepted", e.target.checked)}
                                className="mr-2"
                            />
                            <span>
                                I agree to the{" "}
                                <a
                                    href="/terms-and-conditions.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    terms and conditions
                                </a>
                                .
                            </span>
                        </label>
                    </div>
                </div>
            ),
        },
    ];

    function next() {
        setStep((s) => Math.min(s + 1, steps.length));
    }
    function prev() {
        setStep((s) => Math.max(s - 1, 1));
    }

    function handleSubmit() {
        alert("Submitted (demo). See console for formData.");
        console.log("formData", formData);
    }

    if (!isApplicationOpen) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Applications Closed</h1>
                <p className="text-lg text-gray-700">We are not accepting applications at this time. Please check back later.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">University Application Form</h1>

            <Progress value={(step / steps.length) * 100} className="mb-6" />

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        {steps[step - 1].icon} {steps[step - 1].title}
                    </div>

                    {steps[step - 1].content}

                    <div className="flex justify-between pt-6">
                        {step > 1 && (
                            <Button onClick={prev} variant="outline">
                                Back
                            </Button>
                        )}
                        {step < steps.length ? (
                            <Button onClick={next}>Next</Button>
                        ) : (
                            <Button onClick={handleSubmit}>Submit Application</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
