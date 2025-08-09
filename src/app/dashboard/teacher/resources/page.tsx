"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Book, Archive, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

type LibraryResource = {
    id: string;
    title: string;
    author: string;
    type: "Book" | "Journal" | "DVD" | "Other";
    status: "Available" | "Borrowed" | "Overdue";
    dueDate?: string; // ISO string, if borrowed or overdue
};

const dummyResources: LibraryResource[] = [
    {
        id: "r1",
        title: "Introduction to Algorithms",
        author: "Cormen, Leiserson, Rivest",
        type: "Book",
        status: "Available",
    },
    {
        id: "r2",
        title: "Advanced Chemistry",
        author: "Smith, John",
        type: "Journal",
        status: "Borrowed",
        dueDate: "2025-08-15",
    },
    {
        id: "r3",
        title: "Physics DVD Collection",
        author: "N/A",
        type: "DVD",
        status: "Overdue",
        dueDate: "2025-07-20",
    },
    {
        id: "r4",
        title: "Modern Art History",
        author: "Alice Brown",
        type: "Book",
        status: "Available",
    },
    // add more as needed
];

const PAGE_SIZE = 8;

type SortKey = "title" | "author" | "type" | "status" | "dueDate" | null;
type SortDirection = "asc" | "desc";

function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
}

export default function LibraryResourcePage() {
    const [resources, setResources] = useState<LibraryResource[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & search
    const [filterType, setFilterType] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");

    // Sorting & pagination
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDir, setSortDir] = useState<SortDirection>("asc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setResources(dummyResources);
            setLoading(false);
        }, 600);
    }, []);

    const filteredResources = useMemo(() => {
        let filtered = resources;

        if (filterType !== "All") {
            filtered = filtered.filter((r) => r.type === filterType);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.title.toLowerCase().includes(term) || r.author.toLowerCase().includes(term)
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "title") comp = a.title.localeCompare(b.title);
                else if (sortKey === "author") comp = a.author.localeCompare(b.author);
                else if (sortKey === "type") comp = a.type.localeCompare(b.type);
                else if (sortKey === "status") comp = a.status.localeCompare(b.status);
                else if (sortKey === "dueDate") {
                    const dA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                    const dB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                    comp = dA - dB;
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [resources, filterType, searchTerm, sortKey, sortDir]);

    const pageCount = Math.ceil(filteredResources.length / PAGE_SIZE);

    const paginatedResources = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredResources.slice(start, start + PAGE_SIZE);
    }, [filteredResources, currentPage]);

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    // Summary stats for cards
    const totalResources = resources.length;
    const availableCount = resources.filter((r) => r.status === "Available").length;
    const borrowedCount = resources.filter((r) => r.status === "Borrowed").length;
    const overdueCount = resources.filter((r) => r.status === "Overdue").length;

    return (
        <DashboardLayout>
            <section className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <Book size={32} /> Library Resources
                </h1>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div className="bg-indigo-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-indigo-800">Total Resources</h2>
                        <p className="text-3xl font-bold text-indigo-900">{totalResources}</p>
                    </div>
                    <div className="bg-green-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-green-700">Available</h2>
                        <p className="text-3xl font-bold text-green-900">{availableCount}</p>
                    </div>
                    <div className="bg-yellow-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-yellow-800">Borrowed</h2>
                        <p className="text-3xl font-bold text-yellow-900">{borrowedCount}</p>
                    </div>
                    <div className="bg-red-100 rounded p-6 text-center shadow">
                        <h2 className="text-lg font-semibold text-red-700">Overdue</h2>
                        <p className="text-3xl font-bold text-red-900">{overdueCount}</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="mb-6 flex flex-wrap items-center gap-4 justify-between max-w-6xl mx-auto">
                    <select
                        className="border border-gray-300 rounded px-4 py-2"
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Types</option>
                        <option value="Book">Book</option>
                        <option value="Journal">Journal</option>
                        <option value="DVD">DVD</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        type="search"
                        placeholder="Search by title or author..."
                        className="border border-gray-300 rounded px-4 py-2 flex-grow min-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Table */}
                {loading ? (
                    <p className="text-center py-12 text-gray-600">Loading resources...</p>
                ) : filteredResources.length === 0 ? (
                    <p className="text-center py-12 text-gray-600">No resources found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm max-w-6xl mx-auto">
                            <table className="min-w-full table-fixed border-collapse border border-gray-300">
                                <thead className="bg-indigo-100 sticky top-0 z-10">
                                    <tr>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("title")}
                                        >
                                            Title
                                            {sortKey === "title" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("author")}
                                        >
                                            Author
                                            {sortKey === "author" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-left text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("type")}
                                        >
                                            Type
                                            {sortKey === "type" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("status")}
                                        >
                                            Status
                                            {sortKey === "status" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-3 text-center text-indigo-900 font-semibold whitespace-nowrap cursor-pointer select-none"
                                            onClick={() => toggleSort("dueDate")}
                                        >
                                            Due Date
                                            {sortKey === "dueDate" &&
                                                (sortDir === "asc" ? (
                                                    <ChevronUp className="inline ml-1" size={16} />
                                                ) : (
                                                    <ChevronDown className="inline ml-1" size={16} />
                                                ))}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedResources.map(
                                        ({ id, title, author, type, status, dueDate }) => (
                                            <tr key={id} className="hover:bg-indigo-50 transition">
                                                <td className="border border-gray-300 p-3 whitespace-nowrap">{title}</td>
                                                <td className="border border-gray-300 p-3 whitespace-nowrap">{author}</td>
                                                <td className="border border-gray-300 p-3 whitespace-nowrap">{type}</td>
                                                <td
                                                    className={`border border-gray-300 p-3 text-center font-semibold ${status === "Available"
                                                            ? "text-green-700"
                                                            : status === "Borrowed"
                                                                ? "text-yellow-700"
                                                                : "text-red-700"
                                                        }`}
                                                >
                                                    {status}
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center">
                                                    {formatDate(dueDate)}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-6 mt-6 flex-wrap max-w-6xl mx-auto">
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

                {/* Back Button */}
                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={() => history.back()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded shadow-md transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </section>
        </DashboardLayout>
    );
}
