"use client";

import React from "react";

export default function CourseMaterialPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-gray-700">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-48 h-48 mb-8 text-blue-400"
                fill="none"
                viewBox="0 0 64 64"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M32 2C15 2 2 15 2 32s13 30 30 30 30-13 30-30S49 2 32 2z" />
                <path d="M20 24h24M20 32h24M20 40h24" strokeLinecap="round" />
                <rect x="16" y="16" width="32" height="32" rx="4" ry="4" strokeLinejoin="round" />
            </svg>

            <h1 className="text-4xl font-bold mb-4">Course Materials</h1>
            <p className="text-lg max-w-md text-center">
                This feature isn't available yet. We're working hard to bring you
                course materials soon.
            </p>
        </main>
    );
}
