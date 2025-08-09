"use client";

import Link from "next/link";

export default function Custom404() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
            <div className="max-w-xl">
                {/* Big error code */}
                <h1 className="text-9xl font-extrabold text-indigo-600 select-none mb-8">404</h1>

                {/* Friendly message */}
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>

                {/* Illustration */}
                <svg
                    className="mx-auto mb-8 w-64 h-64 text-indigo-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
                    />
                </svg>

                {/* Home button */}
                <Link
                    href="/"
                    className="inline-block px-8 py-3 rounded-md bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition"
                >
                    Go Back Home
                </Link>
            </div>
        </main>
    );
}
