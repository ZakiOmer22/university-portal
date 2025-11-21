"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, BookOpen, Users, CreditCard, Ban, ChevronLeft, ChevronRight, BookMarked, Clock } from "lucide-react";

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
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        category: "Programming",
        coverUrl: "https://covers.openlibrary.org/b/id/7895556-L.jpg",
        availableCopies: 3,
        description: "A handbook of agile software craftsmanship teaching principles and best practices to write clean, readable, and maintainable code.",
        isTakeawayAvailable: true,
    },
    {
        id: "b2",
        title: "Eloquent JavaScript, 3rd Edition",
        author: "Marijn Haverbeke",
        category: "Programming",
        coverUrl: "https://eloquentjavascript.net/img/cover.jpg",
        availableCopies: 0,
        description: "A modern introduction to programming using JavaScript, including exercises and projects for beginners to advanced developers.",
        isTakeawayAvailable: false,
    },
    // ... include all your other books from the original array
];

const BOOKS_PER_PAGE = 9;

function AvailabilityBadge({ available, copies }: { available: boolean; copies: number }) {
    if (copies === 0) {
        return (
            <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                <Ban size={14} />
                Out of Stock
            </Badge>
        );
    }
    if (!available) {
        return (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1">
                <Clock size={14} />
                Reading Room Only
            </Badge>
        );
    }
    return (
        <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
            <BookMarked size={14} />
            Available
        </Badge>
    );
}

function BookCard({ book }: { book: Book }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
            <div className="relative mb-4">
                <img
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-60 object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                />
                <div className="absolute top-3 right-3">
                    <AvailabilityBadge available={book.isTakeawayAvailable} copies={book.availableCopies} />
                </div>
            </div>

            <div className="space-y-3">
                <Link
                    href={`/dashboard/student/library/book/${book.id}`}
                    className="block group-hover:text-indigo-600 transition-colors duration-200"
                >
                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-indigo-600">
                        {book.title}
                    </h3>
                </Link>

                <p className="text-gray-600 text-sm italic">by {book.author}</p>

                <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    {book.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        {book.category}
                    </Badge>
                    <div className="text-sm text-gray-600">
                        <span className={book.availableCopies > 0 ? "text-green-600 font-semibold" : "text-red-600"}>
                            {book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [user, setUser] = useState<{ fullName: string; role: string; profilePicture?: string; creditLeft: number; isBanned: boolean } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser({
                ...userData,
                creditLeft: userData.creditLeft || 15,
                isBanned: userData.isBanned || false
            });
        }

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
        let filtered = books;
        
        if (selectedCategory !== "All") {
            filtered = filtered.filter((b) => b.category === selectedCategory);
        }
        
        if (searchQuery) {
            filtered = filtered.filter((b) =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        return filtered;
    }, [books, selectedCategory, searchQuery]);

    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
    const paginatedBooks = filteredBooks.slice(
        (currentPage - 1) * BOOKS_PER_PAGE,
        currentPage * BOOKS_PER_PAGE
    );

    function goToPage(page: number) {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }

    // Statistics
    const totalBooks = books.length;
    const availableBooks = books.filter(b => b.availableCopies > 0).length;
    const programmingBooks = books.filter(b => b.category === "Programming").length;

    if (loading) {
        return (
            <DashboardLayout loading={true} user={user}>
                <div className="max-w-6xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-64" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-2xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-96 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={user}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>
                        <p className="text-gray-600 mt-2">Discover and borrow from our extensive collection of books</p>
                    </div>
                    {user && (
                        <div className="flex flex-wrap gap-3">
                            <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                                <CreditCard size={14} />
                                {user.creditLeft} Credits Left
                            </Badge>
                            <Badge className={user.isBanned ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"}>
                                {user.isBanned ? "Borrowing Suspended" : "Active Reader"}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <BookOpen className="w-6 h-6 text-indigo-200" />
                            <div className="text-indigo-200 text-sm font-medium">Total Books</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{totalBooks}</div>
                        <div className="text-indigo-200 text-sm">Library Collection</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <BookMarked className="w-6 h-6 text-green-200" />
                            <div className="text-green-200 text-sm font-medium">Available</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{availableBooks}</div>
                        <div className="text-green-200 text-sm">Ready to Borrow</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <Users className="w-6 h-6 text-blue-200" />
                            <div className="text-blue-200 text-sm font-medium">Programming</div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{programmingBooks}</div>
                        <div className="text-blue-200 text-sm">Tech Books</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search books by title, author, or description..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between">
                    <div className="text-gray-600">
                        Showing {((currentPage - 1) * BOOKS_PER_PAGE) + 1} to {Math.min(currentPage * BOOKS_PER_PAGE, filteredBooks.length)} of {filteredBooks.length} books
                    </div>
                    {searchQuery && (
                        <div className="text-sm text-gray-500">
                            Search results for: &quot;<span className="font-semibold">{searchQuery}</span> &quot;
                        </div>
                    )}
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Books Found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {searchQuery 
                                ? "No books match your search criteria. Try different keywords or browse all categories."
                                : "No books available in this category at the moment."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                currentPage === 1
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                            }`}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            currentPage === pageNum
                                                ? "bg-indigo-600 text-white border border-indigo-600"
                                                : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                currentPage === totalPages
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                            }`}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}