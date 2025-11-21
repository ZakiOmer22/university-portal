"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/student/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, BookOpen, User, Clock, BookMarked, CreditCard, AlertCircle, CheckCircle2, Ban, Calendar } from "lucide-react";

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
        description: "A handbook of agile software craftsmanship teaching principles and best practices to write clean, readable, and maintainable code. This essential guide covers topics from meaningful names and functions to error handling and boundary considerations, making it a must-read for every serious software developer.",
        isTakeawayAvailable: true,
    },
    {
        id: "b2",
        title: "Eloquent JavaScript, 3rd Edition",
        author: "Marijn Haverbeke",
        category: "Programming",
        coverUrl: "https://eloquentjavascript.net/img/cover.jpg",
        availableCopies: 0,
        description: "A modern introduction to programming using JavaScript, including exercises and projects for beginners to advanced developers. This comprehensive guide takes you from basic programming concepts to advanced topics like asynchronous programming and web development.",
        isTakeawayAvailable: false,
    },
    {
        id: "b20",
        title: "Deep Work: Rules for Focused Success in a Distracted World",
        author: "Cal Newport",
        category: "Non-Fiction",
        coverUrl: "https://covers.openlibrary.org/b/id/8374874-L.jpg",
        availableCopies: 5,
        description: "A guide to focused success in a distracted world by cultivating deep, meaningful work habits. Learn how to develop the superpower of deep focus in an increasingly distracted world and produce better results in less time.",
        isTakeawayAvailable: true,
    },
];

function AvailabilityBadge({ available, copies }: { available: boolean; copies: number }) {
    if (copies === 0) {
        return (
            <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-2 font-medium px-3 py-1.5">
                <Ban size={16} />
                Out of Stock
            </Badge>
        );
    }
    if (!available) {
        return (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-2 font-medium px-3 py-1.5">
                <Clock size={16} />
                Reading Room Only
            </Badge>
        );
    }
    return (
        <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-2 font-medium px-3 py-1.5">
            <BookMarked size={16} />
            Available for Borrowing
        </Badge>
    );
}

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = params["id"];

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [borrowStatus, setBorrowStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
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

        if (!bookId) {
            router.push("/dashboard/student/library");
            return;
        }

        setTimeout(() => {
            const found = dummyBooks.find((b) => b.id === bookId) || null;
            setBook(found);
            setLoading(false);
        }, 700);
    }, [bookId, router]);

    function handleBorrow() {
        if (!book || !user) return;

        if (user.isBanned) {
            setBorrowStatus({ 
                type: 'error', 
                message: "Your account is currently suspended from borrowing books. Please contact the library administration." 
            });
            return;
        }
        if (user.creditLeft <= 0) {
            setBorrowStatus({ 
                type: 'error', 
                message: "You have exhausted your borrowing credits. Return some books to borrow new ones." 
            });
            return;
        }
        if (book.availableCopies <= 0) {
            setBorrowStatus({ 
                type: 'error', 
                message: "All copies are currently checked out. Please check back later or place a hold." 
            });
            return;
        }
        if (!book.isTakeawayAvailable) {
            setBorrowStatus({ 
                type: 'error', 
                message: "This book is only available for reading in the library premises." 
            });
            return;
        }

        // Simulate successful borrow
        setBorrowStatus({ 
            type: 'success', 
            message: "Success! You have borrowed this book. Please collect it from the library within 24 hours." 
        });
    }

    const canBorrow = book && user && 
                     !user.isBanned && 
                     user.creditLeft > 0 && 
                     book.availableCopies > 0 && 
                     book.isTakeawayAvailable;

    if (loading) {
        return (
            <DashboardLayout loading={true} user={user}>
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-3/4" />
                    <div className="flex flex-col lg:flex-row gap-8">
                        <Skeleton className="w-full lg:w-1/3 h-96 rounded-2xl" />
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-12 w-32" />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!book) {
        return (
            <DashboardLayout loading={false} user={user}>
                <section className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center border border-gray-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-800">Book Not Found</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            The book you&apos;re looking for doesn&apos;t exist or may have been removed from our catalog.
                        </p>
                        <Link
                            href="/dashboard/student/library"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200 font-medium"
                        >
                            <ArrowLeft size={18} />
                            Back to Library
                        </Link>
                    </div>
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout loading={false} user={user}>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/dashboard/student/library"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Library
                    </Link>
                    <AvailabilityBadge available={book.isTakeawayAvailable} copies={book.availableCopies} />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Book Cover */}
                        <div className="lg:w-2/5 p-8 bg-gray-50 border-r border-gray-200">
                            <img
                                src={book.coverUrl}
                                alt={`Cover of ${book.title}`}
                                className="w-full h-auto max-w-sm mx-auto rounded-2xl shadow-lg object-cover"
                                loading="lazy"
                            />
                        </div>

                        {/* Book Details */}
                        <div className="lg:w-3/5 p-8">
                            <div className="space-y-6">
                                {/* Title and Author */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                        {book.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                                        <User size={20} />
                                        <span className="text-lg italic">by {book.author}</span>
                                    </div>
                                </div>

                                {/* Category and Availability */}
                                <div className="flex flex-wrap gap-4">
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                        {book.category}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <BookMarked size={16} />
                                        <span className={book.availableCopies > 0 ? "text-green-600 font-semibold" : "text-red-600"}>
                                            {book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'} available
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <BookOpen size={20} className="text-indigo-600" />
                                        Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {book.description}
                                    </p>
                                </div>

                                {/* User Status */}
                                {user && (
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-4">Your Borrowing Status</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Credits Available</div>
                                                    <div className="font-semibold text-gray-900">{user.creditLeft}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {user.isBanned ? (
                                                    <Ban className="w-5 h-5 text-red-500" />
                                                ) : (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                )}
                                                <div>
                                                    <div className="text-sm text-gray-500">Account Status</div>
                                                    <div className={`font-semibold ${user.isBanned ? 'text-red-600' : 'text-green-600'}`}>
                                                        {user.isBanned ? 'Borrowing Suspended' : 'Active'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Borrow Action */}
                                <div className="space-y-4">
                                    <button
                                        onClick={handleBorrow}
                                        disabled={!canBorrow}
                                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                                            canBorrow
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {canBorrow ? 'Borrow This Book' : 'Cannot Borrow Currently'}
                                    </button>

                                    {/* Status Message */}
                                    {borrowStatus.type && (
                                        <div className={`p-4 rounded-xl border ${
                                            borrowStatus.type === 'success' 
                                                ? 'bg-green-50 border-green-200 text-green-700'
                                                : 'bg-red-50 border-red-200 text-red-700'
                                        }`}>
                                            <div className="flex items-center gap-2">
                                                {borrowStatus.type === 'success' ? (
                                                    <CheckCircle2 size={20} />
                                                ) : (
                                                    <AlertCircle size={20} />
                                                )}
                                                <span className="font-medium">{borrowStatus.message}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Help Text */}
                                    <div className="text-sm text-gray-600 text-center">
                                        {!book.isTakeawayAvailable && (
                                            <p className="flex items-center justify-center gap-2">
                                                <Clock size={16} />
                                                This book is only available for reading in the library
                                            </p>
                                        )}
                                        {book.availableCopies === 0 && (
                                            <p>All copies are currently checked out. Check back later for availability.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Borrowing Information</h3>
                            <p className="text-blue-700 text-sm">
                                Books can be borrowed for up to 14 days. Late returns will affect your borrowing credits. 
                                Each book requires 1 credit. You can borrow multiple books simultaneously if you have sufficient credits.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}