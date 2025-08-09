"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Search, ChevronDown, ChevronUp, X } from "lucide-react";

const PAGE_SIZE = 15;

type Message = {
    id: string;
    studentName: string;
    email: string;
    content: string;
    date: string; // ISO string date
};

function generateDummyMessages(count: number): Message[] {
    const firstNames = [
        "Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia",
        "Kevin", "Laura", "Mike", "Nina", "Oscar", "Pam", "Quinn", "Rachel", "Steve", "Tina"
    ];
    const lastNames = [
        "Johnson", "Smith", "Lee", "White", "Brown", "Davis", "Wilson", "Moore", "Taylor", "Anderson"
    ];

    const messages: Message[] = [];
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 4) % lastNames.length];
        const studentName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const content = `Hello, this is message #${i + 1} from ${studentName}. Just checking in about the course and assignments. Please let me know if there's anything I need to do. Thanks!`;
        const date = new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1,
            Math.floor(Math.random() * 24),
            Math.floor(Math.random() * 60)
        ).toISOString();

        messages.push({ id: `msg${i + 1}`, studentName, email, content, date });
    }
    return messages;
}

export default function MessagesPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<keyof Message | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API fetch delay
        const timeoutId = setTimeout(() => {
            const data = generateDummyMessages(50); // generate 50 dummy messages
            setMessages(data);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timeoutId);
    }, []);

    // Filter messages by search term (name or email)
    const filteredMessages = useMemo(() => {
        if (!searchTerm.trim()) return messages;
        const lower = searchTerm.toLowerCase();
        return messages.filter(
            (msg) =>
                msg.studentName.toLowerCase().includes(lower) ||
                msg.email.toLowerCase().includes(lower)
        );
    }, [messages, searchTerm]);

    // Sorting logic with correct typing for Date conversion
    const sortedMessages = useMemo(() => {
        if (!sortKey) return filteredMessages;

        return [...filteredMessages].sort((a, b) => {
            let aVal: string | Date = a[sortKey];
            let bVal: string | Date = b[sortKey];

            if (sortKey === "date") {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredMessages, sortKey, sortDirection]);

    const pageCount = Math.ceil(sortedMessages.length / PAGE_SIZE);

    const paginatedMessages = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return sortedMessages.slice(start, start + PAGE_SIZE);
    }, [sortedMessages, currentPage]);

    function onSort(key: keyof Message) {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDirection("asc");
        } else if (sortDirection === "asc") {
            setSortDirection("desc");
        } else {
            setSortKey(null);
            setSortDirection("asc");
        }
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    return (
        <DashboardLayout >
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <MessageSquare size={32} />
                    Messages from Students
                </h1>

                {/* Search input */}
                <div className="relative max-w-md mb-6">
                    <input
                        type="search"
                        placeholder="Search by student name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        aria-label="Search messages"
                    />
                    <Search
                        size={20}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                </div>

                {/* Error */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Loading Skeleton */}
                {loading ? (
                    <table className="w-full table-auto border-collapse border border-gray-300 rounded-md">
                        <thead>
                            <tr>
                                {["Student", "Email", "Preview", "Date", "Actions"].map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`border border-gray-300 p-3 bg-gray-100 rounded-t-md text-left font-semibold text-indigo-900`}
                                    >
                                        <Skeleton className="h-5 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(PAGE_SIZE)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(5)].map((_, j) => (
                                        <td key={j} className="border border-gray-300 p-3">
                                            <Skeleton className="h-5 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : filteredMessages.length === 0 ? (
                    <p className="italic text-center text-gray-600 py-12">No messages found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
                            <table
                                className="min-w-full table-fixed border-collapse border border-gray-300"
                                style={{ tableLayout: "fixed" }}
                            >
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        {[
                                            { key: "studentName", label: "Student" },
                                            { key: "email", label: "Email" },
                                            { key: "content", label: "Preview" },
                                            { key: "date", label: "Date" },
                                        ].map(({ key, label }) => (
                                            <th
                                                key={key}
                                                onClick={() => onSort(key as keyof Message)}
                                                className="cursor-pointer select-none border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap"
                                                title={`Sort by ${label}`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <span>{label}</span>
                                                    {sortKey === key ? (
                                                        sortDirection === "asc" ? (
                                                            <ChevronUp size={16} />
                                                        ) : (
                                                            <ChevronDown size={16} />
                                                        )
                                                    ) : null}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedMessages.map(({ id, studentName, email, content, date }) => (
                                        <tr
                                            key={id}
                                            className="hover:bg-indigo-50 transition cursor-pointer"
                                            onClick={() => setSelectedMessage({ id, studentName, email, content, date })}
                                        >
                                            <td className="border border-gray-300 p-3 truncate" title={studentName}>
                                                {studentName}
                                            </td>
                                            <td className="border border-gray-300 p-3 truncate" title={email}>
                                                {email}
                                            </td>
                                            <td className="border border-gray-300 p-3 truncate" title={content}>
                                                {content.length > 40 ? content.slice(0, 40) + "..." : content}
                                            </td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">
                                                {new Date(date).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-300 p-3 whitespace-nowrap">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMessage({ id, studentName, email, content, date });
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                                    aria-label={`View full message from ${studentName}`}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === 1
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                    } transition`}
                                aria-label="Previous page"
                            >
                                Previous
                            </button>

                            <span className="font-semibold text-gray-700 whitespace-nowrap">
                                Page {currentPage} of {pageCount}
                            </span>

                            <button
                                onClick={nextPage}
                                disabled={currentPage === pageCount}
                                className={`px-5 py-2 rounded-md border font-semibold ${currentPage === pageCount
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                    } transition`}
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* Message Modal */}
                {selectedMessage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"
                        onClick={() => setSelectedMessage(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div
                            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                            <h2 id="modal-title" className="text-xl font-semibold mb-4">
                                Message from {selectedMessage.studentName}
                            </h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                            <p className="mt-4 text-sm text-gray-500">
                                Sent on {new Date(selectedMessage.date).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {/* Back to dashboard button */}
                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded shadow-md transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
}
