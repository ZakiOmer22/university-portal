"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Book, 
    Archive, 
    CheckCircle, 
    AlertCircle, 
    ChevronDown, 
    ChevronUp,
    Search,
    Filter,
    Download,
    ArrowLeft,
    Clock,
    AlertTriangle,
    MoreVertical,
    Eye,
    Calendar
} from "lucide-react";

type LibraryResource = {
    id: string;
    title: string;
    author: string;
    type: "Book" | "Journal" | "DVD" | "Other";
    status: "Available" | "Borrowed" | "Overdue";
    dueDate?: string;
    isbn?: string;
    publicationYear?: number;
    category: string;
};

const dummyResources: LibraryResource[] = [
    {
        id: "r1",
        title: "Introduction to Algorithms",
        author: "Cormen, Leiserson, Rivest",
        type: "Book",
        status: "Available",
        isbn: "978-0262033848",
        publicationYear: 2009,
        category: "Computer Science"
    },
    {
        id: "r2",
        title: "Advanced Chemistry Journal",
        author: "Smith, John",
        type: "Journal",
        status: "Borrowed",
        dueDate: "2025-08-15",
        publicationYear: 2024,
        category: "Chemistry"
    },
    {
        id: "r3",
        title: "Physics DVD Collection - Modern Concepts",
        author: "N/A",
        type: "DVD",
        status: "Overdue",
        dueDate: "2025-07-20",
        category: "Physics"
    },
    {
        id: "r4",
        title: "Modern Art History",
        author: "Alice Brown",
        type: "Book",
        status: "Available",
        isbn: "978-0500204231",
        publicationYear: 2020,
        category: "Art"
    },
    {
        id: "r5",
        title: "Mathematics Research Papers",
        author: "Various Authors",
        type: "Journal",
        status: "Available",
        publicationYear: 2023,
        category: "Mathematics"
    },
    {
        id: "r6",
        title: "Biology Laboratory Manual",
        author: "Dr. Wilson Chen",
        type: "Book",
        status: "Borrowed",
        dueDate: "2025-08-10",
        isbn: "978-0123456789",
        publicationYear: 2022,
        category: "Biology"
    },
    {
        id: "r7",
        title: "Historical Documentaries Collection",
        author: "History Channel",
        type: "DVD",
        status: "Overdue",
        dueDate: "2025-07-15",
        category: "History"
    },
    {
        id: "r8",
        title: "Literary Classics Compilation",
        author: "Various Authors",
        type: "Other",
        status: "Available",
        category: "Literature"
    },
];

const PAGE_SIZE = 10;

type SortKey = "title" | "author" | "type" | "status" | "dueDate" | "category" | "publicationYear" | null;
type SortDirection = "asc" | "desc";

function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

function getStatusIcon(status: LibraryResource["status"]) {
    switch (status) {
        case "Available":
            return <CheckCircle className="h-4 w-4" />;
        case "Borrowed":
            return <Clock className="h-4 w-4" />;
        case "Overdue":
            return <AlertTriangle className="h-4 w-4" />;
    }
}

function getStatusColor(status: LibraryResource["status"]) {
    switch (status) {
        case "Available":
            return "bg-green-100 text-green-800 border-green-200";
        case "Borrowed":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "Overdue":
            return "bg-red-100 text-red-800 border-red-200";
    }
}

function getTypeColor(type: LibraryResource["type"]) {
    switch (type) {
        case "Book":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "Journal":
            return "bg-orange-100 text-orange-800 border-orange-200";
        case "DVD":
            return "bg-cyan-100 text-cyan-800 border-cyan-200";
        case "Other":
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
}

export default function LibraryResourcePage() {
    const [resources, setResources] = useState<LibraryResource[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & search
    const [filterType, setFilterType] = useState<string>("All");
    const [filterCategory, setFilterCategory] = useState<string>("All");
    const [filterStatus, setFilterStatus] = useState<string>("All");
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
        }, 800);
    }, []);

    const filteredResources = useMemo(() => {
        let filtered = resources;

        if (filterType !== "All") {
            filtered = filtered.filter((r) => r.type === filterType);
        }

        if (filterCategory !== "All") {
            filtered = filtered.filter((r) => r.category === filterCategory);
        }

        if (filterStatus !== "All") {
            filtered = filtered.filter((r) => r.status === filterStatus);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.title.toLowerCase().includes(term) || 
                    r.author.toLowerCase().includes(term) ||
                    r.category.toLowerCase().includes(term) ||
                    (r.isbn && r.isbn.toLowerCase().includes(term))
            );
        }

        if (sortKey) {
            filtered = [...filtered].sort((a, b) => {
                let comp = 0;
                if (sortKey === "title") comp = a.title.localeCompare(b.title);
                else if (sortKey === "author") comp = a.author.localeCompare(b.author);
                else if (sortKey === "type") comp = a.type.localeCompare(b.type);
                else if (sortKey === "status") comp = a.status.localeCompare(b.status);
                else if (sortKey === "category") comp = a.category.localeCompare(b.category);
                else if (sortKey === "publicationYear") {
                    const yearA = a.publicationYear || 0;
                    const yearB = b.publicationYear || 0;
                    comp = yearA - yearB;
                }
                else if (sortKey === "dueDate") {
                    const dA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                    const dB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                    comp = dA - dB;
                }
                return sortDir === "asc" ? comp : -comp;
            });
        }

        return filtered;
    }, [resources, filterType, filterCategory, filterStatus, searchTerm, sortKey, sortDir]);

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

    // Extract unique categories and types for filters
    const categories = useMemo(() => {
        const cats = new Set(resources.map(r => r.category));
        return ["All Categories", ...Array.from(cats).sort()];
    }, [resources]);

    const types = useMemo(() => {
        const typeSet = new Set(resources.map(r => r.type));
        return ["All Types", ...Array.from(typeSet).sort()];
    }, [resources]);

    const statuses = useMemo(() => {
        const statusSet = new Set(resources.map(r => r.status));
        return ["All Status", ...Array.from(statusSet).sort()];
    }, [resources]);

    return (
        <DashboardLayout>
            <section className="p-6 w-full mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Book className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Library Resources</h1>
                        </div>
                        <p className="text-gray-600">
                            Manage and track library materials, availability, and borrowing status
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button 
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Total Resources</p>
                                    <p className="text-3xl font-bold text-indigo-900">{totalResources}</p>
                                </div>
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <Archive className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Available</p>
                                    <p className="text-3xl font-bold text-green-900">{availableCount}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Borrowed</p>
                                    <p className="text-3xl font-bold text-blue-900">{borrowedCount}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600 mb-1">Overdue</p>
                                    <p className="text-3xl font-bold text-red-900">{overdueCount}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 mb-1">Categories</p>
                                    <p className="text-3xl font-bold text-purple-900">
                                        {new Set(resources.map(r => r.category)).size}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Book className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Section */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <select
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                                        value={filterType}
                                        onChange={(e) => {
                                            setFilterType(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                                    value={filterCategory}
                                    onChange={(e) => {
                                        setFilterCategory(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px]"
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search by title, author, category, or ISBN..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resources Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading library resources...</p>
                            </div>
                        ) : filteredResources.length === 0 ? (
                            <div className="text-center py-12">
                                <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    {searchTerm || filterType !== "All Types" || filterCategory !== "All Categories" || filterStatus !== "All Status"
                                        ? "No resources match your current filters." 
                                        : "No library resources available."
                                    }
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-gray-50/50">
                                                {[
                                                    { key: "title", label: "Resource Details", width: "w-2/5" },
                                                    { key: "author", label: "Author", width: "w-1/6" },
                                                    { key: "type", label: "Type", width: "w-1/8" },
                                                    { key: "category", label: "Category", width: "w-1/8" },
                                                    { key: "status", label: "Status", width: "w-1/8" },
                                                    { key: "dueDate", label: "Due Date", width: "w-1/8" },
                                                    { key: "actions", label: "", width: "w-1/12" },
                                                ].map(({ key, label, width }) => (
                                                    <th
                                                        key={key}
                                                        onClick={() => key !== "actions" && toggleSort(key as SortKey)}
                                                        className={`p-4 text-left text-sm font-semibold text-gray-900 ${width} ${
                                                            key !== "actions" 
                                                                ? "cursor-pointer hover:bg-gray-100 transition-colors" 
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {label}
                                                            {key !== "actions" && sortKey === key && (
                                                                sortDir === "asc" ? 
                                                                <ChevronUp className="h-4 w-4" /> : 
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {paginatedResources.map((resource) => (
                                                <tr 
                                                    key={resource.id} 
                                                    className="hover:bg-gray-50 transition-colors group"
                                                >
                                                    <td className="p-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{resource.title}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {resource.isbn && (
                                                                    <span className="text-sm text-gray-500">ISBN: {resource.isbn}</span>
                                                                )}
                                                                {resource.publicationYear && (
                                                                    <span className="text-sm text-gray-500">• {resource.publicationYear}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{resource.author}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`${getTypeColor(resource.type)}`}
                                                        >
                                                            {resource.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-gray-600">{resource.category}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge 
                                                            variant="outline"
                                                            className={`flex items-center gap-1 w-fit ${getStatusColor(resource.status)}`}
                                                        >
                                                            {getStatusIcon(resource.status)}
                                                            {resource.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            {resource.dueDate ? (
                                                                <>
                                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                                    <span className={`font-medium ${
                                                                        resource.status === "Overdue" ? "text-red-600" : "text-gray-600"
                                                                    }`}>
                                                                        {formatDate(resource.dueDate)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pageCount > 1 && (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t bg-gray-50/50">
                                        <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                                            Showing {((currentPage - 1) * PAGE_SIZE) + 1} to {Math.min(currentPage * PAGE_SIZE, filteredResources.length)} of {filteredResources.length} resources
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={currentPage === pageNum ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    );
                                                })}
                                                {pageCount > 5 && <span className="px-2 text-gray-500">...</span>}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={nextPage}
                                                disabled={currentPage === pageCount}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </section>
        </DashboardLayout>
    );
}