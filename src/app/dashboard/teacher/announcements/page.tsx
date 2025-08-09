"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/teacher/DashboardLayout";
import { useRouter } from "next/navigation";
import { Bell, Edit2, Trash2, Eye } from "lucide-react";

type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string;
};

const PAGE_SIZE = 5;

export default function AnnouncementsPage() {
    const router = useRouter();

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAnnouncements([
                {
                    id: "1",
                    title: "Semester starts on September 1",
                    content: "Make sure to prepare your course materials and welcome students.",
                    date: "2025-08-01",
                },
                {
                    id: "2",
                    title: "Campus WiFi upgrade",
                    content: "The campus WiFi will be upgraded from Aug 15 to Aug 20. Expect intermittent outages.",
                    date: "2025-08-10",
                },
                {
                    id: "3",
                    title: "New grading policy",
                    content: "The grading policy has been updated. Please review the new standards.",
                    date: "2025-08-12",
                },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const filteredAnnouncements = useMemo(() => {
        if (!searchTerm.trim()) return announcements;
        const term = searchTerm.toLowerCase();
        return announcements.filter(
            (a) =>
                a.title.toLowerCase().includes(term) || a.content.toLowerCase().includes(term)
        );
    }, [announcements, searchTerm]);

    const pageCount = Math.ceil(filteredAnnouncements.length / PAGE_SIZE);

    const paginatedAnnouncements = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredAnnouncements.slice(start, start + PAGE_SIZE);
    }, [filteredAnnouncements, currentPage]);

    function prevPage() {
        setCurrentPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setCurrentPage((p) => Math.min(pageCount, p + 1));
    }

    function resetForm() {
        setFormTitle("");
        setFormContent("");
        setEditId(null);
        setFormError("");
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formTitle.trim() || !formContent.trim()) {
            setFormError("Title and Content are required.");
            return;
        }

        if (editId) {
            setAnnouncements((prev) =>
                prev.map((a) =>
                    a.id === editId ? { ...a, title: formTitle, content: formContent } : a
                )
            );
        } else {
            const newAnnouncement: Announcement = {
                id: Date.now().toString(),
                title: formTitle,
                content: formContent,
                date: new Date().toISOString().split("T")[0],
            };
            setAnnouncements((prev) => [newAnnouncement, ...prev]);
        }

        resetForm();
    }

    function handleEdit(id: string) {
        const ann = announcements.find((a) => a.id === id);
        if (!ann) return;
        setFormTitle(ann.title);
        setFormContent(ann.content);
        setEditId(id);
        setFormError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this announcement?")) {
            setAnnouncements((prev) => prev.filter((a) => a.id !== id));
            if (editId === id) resetForm();
        }
    }

    return (
        <DashboardLayout>
            <section className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-700">
                    <Bell size={32} /> Announcements
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mb-8 bg-indigo-50 p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Announcement" : "Add New Announcement"}</h2>

                    <div className="mb-4">
                        <label htmlFor="title" className="block font-semibold mb-1">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block font-semibold mb-1">Content</label>
                        <textarea
                            id="content"
                            value={formContent}
                            onChange={(e) => setFormContent(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {formError && (
                        <p className="text-red-600 mb-4 font-semibold">{formError}</p>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded font-semibold transition"
                        >
                            {editId ? "Save Changes" : "Add Announcement"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded font-semibold transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* Search */}
                <div className="mb-6 flex justify-between items-center">
                    <input
                        type="search"
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* List */}
                {loading ? (
                    <p className="text-center text-gray-600 py-12">Loading announcements...</p>
                ) : paginatedAnnouncements.length === 0 ? (
                    <p className="text-center text-gray-600 py-12">No announcements found.</p>
                ) : (
                    <div className="space-y-6">
                        {paginatedAnnouncements.map(({ id, title, content, date }) => (
                            <article key={id} className="border border-gray-300 rounded p-4 shadow-sm bg-white hover:shadow-md transition">
                                <header className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-indigo-700">{title}</h3>
                                    <time className="text-gray-500 text-sm">{new Date(date).toLocaleDateString()}</time>
                                </header>
                                <p className="text-gray-700 whitespace-pre-wrap mb-4">{content}</p>
                                <div className="flex gap-4 justify-end">
                                    {/* <button
                                        onClick={() => router.push(`/dashboard/teacher/announcements/${id}`)}
                                        title="View"
                                        className="text-green-600 hover:text-green-800 flex items-center gap-1"
                                    >
                                        <Eye size={16} /> View
                                    </button> */}
                                    <button
                                        onClick={() => handleEdit(id)}
                                        title="Edit"
                                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(id)}
                                        title="Delete"
                                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="flex justify-center items-center gap-6 mt-8">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`px-5 py-2 rounded-md border font-semibold ${currentPage === 1
                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                                } transition`}
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
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </DashboardLayout>
    );
}
