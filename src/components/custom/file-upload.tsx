"use client";

import React from "react";

export type FileUploadProps = {
    label?: string;
    accept?: string;
    onChange: (file: File | null) => void;
};

export default function FileUpload({ label, accept, onChange }: FileUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onChange(file);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-6 rounded-2xl shadow-md text-center">
            {label && <label className="block mb-3 text-lg font-semibold">{label}</label>}

            <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="cursor-pointer rounded border border-gray-300 p-3 w-full text-gray-700 dark:text-gray-300 dark:bg-zinc-800"
            />
        </div>
    );
}
