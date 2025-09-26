"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/leader/DashboardLayout";

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
        description: "A modern introduction to programming using JavaScript, including exercises and projects.",
        isTakeawayAvailable: false,
    },
    {
        id: "b3",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        category: "Programming",
        coverUrl: "https://covers.openlibrary.org/b/id/9254920-L.jpg",
        availableCopies: 5,
        description:
            "Tips and best practices to become a better and more effective software developer with pragmatic thinking and techniques.",
        isTakeawayAvailable: true,
    },
    {
        id: "b4",
        title: "You Don't Know JS Yet",
        author: "Kyle Simpson",
        category: "Programming",
        coverUrl: "https://images-na.ssl-images-amazon.com/images/I/81kqrwS1nNL.jpg",
        availableCopies: 2,
        description:
            "An in-depth series diving into the core mechanisms of the JavaScript language for advanced understanding.",
        isTakeawayAvailable: true,
    },
    {
        id: "b5",
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Programming",
        coverUrl: "https://covers.openlibrary.org/b/id/8677454-L.jpg",
        availableCopies: 1,
        description:
            "Comprehensive book covering fundamental algorithms, data structures, and their analysis for computer science students.",
        isTakeawayAvailable: false,
    },
    {
        id: "b6",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
        availableCopies: 2,
        description:
            "A classic fantasy novel about the adventurous journey of Bilbo Baggins in Middle-earth.",
        isTakeawayAvailable: true,
    },
    {
        id: "b7",
        title: "1984",
        author: "George Orwell",
        category: "Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/8221256-L.jpg",
        availableCopies: 1,
        description:
            "Dystopian social science fiction novel exploring themes of surveillance, totalitarianism, and censorship.",
        isTakeawayAvailable: true,
    },
    {
        id: "b8",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
        availableCopies: 4,
        description:
            "A Pulitzer Prize-winning novel exploring racial injustice and moral growth in the American South.",
        isTakeawayAvailable: true,
    },
    {
        id: "b9",
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        category: "Non-Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/8375131-L.jpg",
        availableCopies: 3,
        description:
            "Explores the history of humankind, from ancient ancestors to modern societies and future prospects.",
        isTakeawayAvailable: false,
    },
    {
        id: "b10",
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        category: "Non-Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/8374910-L.jpg",
        availableCopies: 5,
        description:
            "A groundbreaking exploration of human decision-making, cognitive biases, and dual-process thinking.",
        isTakeawayAvailable: true,
    },
    {
        id: "b11",
        title: "Educated",
        author: "Tara Westover",
        category: "Biography",
        coverUrl: "https://covers.openlibrary.org/b/id/8259256-L.jpg",
        availableCopies: 2,
        description:
            "A memoir about a woman who grew up in a strict and abusive household in rural Idaho but eventually escaped through education.",
        isTakeawayAvailable: true,
    },
    {
        id: "b12",
        title: "Becoming",
        author: "Michelle Obama",
        category: "Biography",
        coverUrl: "https://covers.openlibrary.org/b/id/8761596-L.jpg",
        availableCopies: 1,
        description:
            "The memoir of the former First Lady of the United States, chronicling her life from childhood to the White House.",
        isTakeawayAvailable: false,
    },
    {
        id: "b13",
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        coverUrl: "https://covers.openlibrary.org/b/id/8375630-L.jpg",
        availableCopies: 3,
        description:
            "An accessible overview of cosmology, explaining complex concepts about the universe's origins and nature.",
        isTakeawayAvailable: true,
    },
    {
        id: "b14",
        title: "The Selfish Gene",
        author: "Richard Dawkins",
        category: "Science",
        coverUrl: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
        availableCopies: 4,
        description:
            "Explores evolutionary biology and the gene-centered view of evolution in a groundbreaking way.",
        isTakeawayAvailable: true,
    },
    {
        id: "b15",
        title: "The Art of War",
        author: "Sun Tzu",
        category: "Philosophy",
        coverUrl: "https://covers.openlibrary.org/b/id/7994916-L.jpg",
        availableCopies: 6,
        description:
            "Ancient Chinese military treatise offering timeless wisdom on strategy, tactics, and leadership.",
        isTakeawayAvailable: true,
    },
    {
        id: "b16",
        title: "Meditations",
        author: "Marcus Aurelius",
        category: "Philosophy",
        coverUrl: "https://covers.openlibrary.org/b/id/8233615-L.jpg",
        availableCopies: 2,
        description:
            "A series of personal writings by the Roman Emperor offering stoic philosophy and practical guidance.",
        isTakeawayAvailable: false,
    },
    {
        id: "b17",
        title: "Thinking in Systems",
        author: "Donella Meadows",
        category: "Science",
        coverUrl: "https://covers.openlibrary.org/b/id/8785683-L.jpg",
        availableCopies: 3,
        description:
            "An introduction to systems thinking and complex problem solving for real-world challenges.",
        isTakeawayAvailable: true,
    },
    {
        id: "b18",
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        category: "Programming",
        coverUrl: "https://covers.openlibrary.org/b/id/8235110-L.jpg",
        availableCopies: 1,
        description:
            "Focuses on the elegant and effective features of JavaScript, encouraging best practices.",
        isTakeawayAvailable: false,
    },
    {
        id: "b19",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        category: "Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/8231250-L.jpg",
        availableCopies: 2,
        description:
            "A coming-of-age novel focusing on teenage angst and alienation in post-WWII America.",
        isTakeawayAvailable: true,
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

const BOOKS_PER_PAGE = 6;

export default function LibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    // Fixed user object with required properties for DashboardLayout
    const user = {
        fullName: "Student User",
        role: "student",
        profilePicture: undefined,
        creditLeft: 15,
        isBanned: false,
    };

    useEffect(() => {
        // Simulate API loading delay
        setTimeout(() => {
            setBooks(dummyBooks);
            setLoading(false);
        }, 700);
    }, []);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(books.map((b) => b.category)));
        return ["All", ...cats];
    }, [books]);

    const filteredBooks = useMemo(() => {
        if (selectedCategory === "All") return books;
        return books.filter((b) => b.category === selectedCategory);
    }, [books, selectedCategory]);

    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
    const paginatedBooks = filteredBooks.slice(
        (currentPage - 1) * BOOKS_PER_PAGE,
        currentPage * BOOKS_PER_PAGE
    );

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    if (loading) {
        return (
            <DashboardLayout loading={true} user={user}>
                <p className="text-center mt-20 text-gray-600 text-lg">Loading books...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={user}>
            <section className="max-w-6xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6 text-indigo-900">Library Catalog</h1>

                {/* User Credit & Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
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

                {/* Category Filter */}
                <div className="mb-6 flex items-center gap-3">
                    <label htmlFor="category" className="font-semibold text-indigo-900">
                        Filter by Category:
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {paginatedBooks.length === 0 ? (
                        <p className="col-span-full text-center text-gray-600 italic">
                            No books found in this category.
                        </p>
                    ) : (
                        paginatedBooks.map(
                            ({
                                id,
                                title,
                                author,
                                coverUrl,
                                availableCopies,
                                description,
                                isTakeawayAvailable,
                            }) => (
                                <div
                                    key={id}
                                    className="border rounded shadow-sm p-4 flex flex-col bg-white hover:shadow-md transition"
                                >
                                    <img
                                        src={coverUrl}
                                        alt={`Cover of ${title}`}
                                        className="w-full h-48 object-cover rounded mb-4"
                                        loading="lazy"
                                    />
                                    <Link
                                        href={`/dashboard/student/library/book/${id}`}
                                        className="text-xl font-semibold text-indigo-900 mb-1 hover:underline"
                                        aria-label={`View details for ${title}`}
                                    >
                                        {title}
                                    </Link>
                                    <p className="text-sm italic text-gray-600 mb-2">by {author}</p>
                                    <p className="text-sm mb-2 line-clamp-3">{description}</p>
                                    <p className="text-sm font-medium mb-1">
                                        Available Copies:{" "}
                                        <span className={availableCopies > 0 ? "text-green-600" : "text-red-600"}>
                                            {availableCopies}
                                        </span>
                                    </p>
                                    <p
                                        className={`text-sm font-semibold ${isTakeawayAvailable ? "text-green-700" : "text-red-700"
                                            }`}
                                    >
                                        {isTakeawayAvailable ? "Available for Takeaway" : "Not Available for Takeaway"}
                                    </p>
                                </div>
                            )
                        )
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                        className={`px-4 py-2 rounded border ${currentPage === 1
                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                            }`}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-4 py-2 rounded border ${pageNum === currentPage
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "border-gray-300 text-gray-600 hover:bg-indigo-50"
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                        className={`px-4 py-2 rounded border ${currentPage === totalPages
                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
}
