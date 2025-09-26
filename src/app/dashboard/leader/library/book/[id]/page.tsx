"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/leader/DashboardLayout";
import Link from "next/link";

interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    coverUrl: string;
    availableCopies: number;
    description: string;
    isTakeawayAvailable: boolean;
}

// Dummy book data
const dummyBooks: Book[] = [
    {
        id: "b1",
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        coverUrl: "https://covers.openlibrary.org/b/id/7895556-L.jpg",
        availableCopies: 3,
        description:
            "A handbook of agile software craftsmanship teaching principles and best practices to write clean, readable, and maintainable code.",
        isTakeawayAvailable: true,
    },
    {
        id: "b2",
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        category: "Programming",
        coverUrl: "https://eloquentjavascript.net/img/cover.jpg",
        availableCopies: 0,
        description:
            "A modern introduction to programming using JavaScript, including exercises and projects.",
        isTakeawayAvailable: false,
    },
    {
        id: "b20",
        title: "Deep Work",
        author: "Cal Newport",
        category: "Non-Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/8374874-L.jpg",
        availableCopies: 5,
        description:
            "A guide to focused success in a distracted world by cultivating deep, meaningful work habits.",
        isTakeawayAvailable: true,
    },
];

// Fixed user object matching DashboardLayout's expected type
const user = {
    fullName: "Student User",
    role: "student",
    profilePicture: undefined, // optional, can be a string URL
    creditLeft: 15,
    isBanned: false,
};

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params["id"];

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [borrowStatus, setBorrowStatus] = useState<string | null>(null);

    useEffect(() => {
        if (!bookId) {
            router.push("/dashboard/student/library");
            return;
        }

        // Simulate fetch delay
        setTimeout(() => {
            const found = dummyBooks.find((b) => b.id === bookId) || null;
            setBook(found);
            setLoading(false);
        }, 700);
    }, [bookId, router]);

    function handleBorrow() {
        if (!book) return;
        if (user.isBanned) {
            setBorrowStatus("Your account is banned from borrowing books.");
            return;
        }
        if (user.creditLeft <= 0) {
            setBorrowStatus("You do not have enough credit left to borrow this book.");
            return;
        }
        if (book.availableCopies <= 0) {
            setBorrowStatus("Sorry, no copies are available for borrowing right now.");
            return;
        }

        // Simulate successful borrow:
        setBorrowStatus("Success! You have borrowed this book.");
        // In real app: deduct credit, decrease available copies, etc.
    }

    if (loading) {
        return (
            <DashboardLayout loading={true} user={user}>
                <p className="text-center mt-20 text-gray-600 text-lg">Loading book details...</p>
            </DashboardLayout>
        );
    }

    if (!book) {
        return (
            <DashboardLayout loading={false} user={user}>
                <section className="max-w-xl mx-auto my-20 p-8 bg-white rounded shadow text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">Book Not Found</h2>
                    <p className="mb-6">The requested book does not exist or is unavailable.</p>
                    <Link
                        href="/dashboard/student/library"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow"
                    >
                        Back to Library
                    </Link>
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={user}>
            <section className="max-w-4xl mx-auto bg-white rounded shadow p-8 my-12 font-serif print:font-sans print:p-6 print:my-4">
                {/* Header */}
                <h1 className="text-4xl font-bold mb-6 text-indigo-900">{book.title}</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Book Cover */}
                    <img
                        src={book.coverUrl}
                        alt={`Cover of ${book.title}`}
                        className="w-full md:w-1/3 object-cover rounded shadow"
                        loading="lazy"
                    />

                    {/* Book Details */}
                    <div className="flex-1">
                        <p className="mb-2 text-lg italic text-gray-700">by {book.author}</p>
                        <p className="mb-4 font-semibold text-indigo-700">Category: {book.category}</p>
                        <p className="mb-4">{book.description}</p>

                        <p className="mb-2">
                            <strong>Available Copies:</strong>{" "}
                            <span className={book.availableCopies > 0 ? "text-green-600" : "text-red-600"}>
                                {book.availableCopies}
                            </span>
                        </p>

                        <p className="mb-6 font-semibold text-sm">
                            {book.isTakeawayAvailable ? "Available for Takeaway" : "Not Available for Takeaway"}
                        </p>

                        {/* User Info */}
                        <div className="mb-6 flex gap-4 flex-wrap">
                            <div className="px-4 py-2 rounded bg-green-100 text-green-800 font-semibold w-max">
                                Credit Left: {user.creditLeft}
                            </div>
                            <div
                                className={`px-4 py-2 rounded w-max font-semibold ${user.isBanned ? "bg-red-200 text-red-900" : "bg-green-200 text-green-900"
                                    }`}
                            >
                                Account Status: {user.isBanned ? "Banned from borrowing" : "Active"}
                            </div>
                        </div>

                        {/* Borrow Button */}
                        <button
                            onClick={handleBorrow}
                            disabled={book.availableCopies <= 0 || user.isBanned || user.creditLeft <= 0}
                            className={`px-6 py-3 rounded shadow font-semibold text-white ${book.availableCopies <= 0 || user.isBanned || user.creditLeft <= 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            aria-label="Borrow this book"
                        >
                            Borrow Book
                        </button>

                        {/* Borrow Status Message */}
                        {borrowStatus && (
                            <p className="mt-4 font-semibold text-center text-red-600">{borrowStatus}</p>
                        )}

                        {/* Back Link */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/dashboard/student/library"
                                className="inline-block bg-gray-300 text-gray-900 px-6 py-2 rounded shadow hover:bg-gray-400"
                            >
                                Back to Library
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}
