"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, PlusCircle } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string; // "active" | "pending" | others
    phone?: string;
    address?: string;
    createdAt?: string; // ISO string
    updatedAt?: string; // ISO string
}

const PAGE_SIZE = 10;

function AddUserForm({
    onCancel,
    onSuccess,
    initialData,
}: {
    onCancel: () => void;
    onSuccess: (user: User) => void;
    initialData?: Partial<User>;
}) {
    const [fullName, setFullName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [role, setRole] = useState(initialData?.role || "user");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [address, setAddress] = useState(initialData?.address || "");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isEdit = Boolean(initialData?.id);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!fullName.trim() || !email.trim() || !role.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const url = "/api/admin/users";
            const method = isEdit ? "PUT" : "POST";
            const body = isEdit
                ? JSON.stringify({
                    id: initialData?.id,
                    fullName,
                    email,
                    role,
                    phone,
                    address,
                })
                : JSON.stringify({ fullName, email, role, phone, address });

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                setError(err?.error || "Failed to save user.");
                setLoading(false);
                return;
            }

            const savedUser: User = await res.json();
            onSuccess(savedUser);
        } catch (err: any) {
            setError("Network error.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                >
                    Full Name *
                </label>
                <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={loading}
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email Address *
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role *
                </label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={loading}
                >
                    <option value="user">User</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                </label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                </label>
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={loading}
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // For approval modal
    const [approvingUser, setApprovingUser] = useState<User | null>(null);
    const [approvalLoading, setApprovalLoading] = useState(false);
    const [approvalError, setApprovalError] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch users on mount & refresh after CRUD
    async function fetchUsers() {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error(`Failed to fetch users (status: ${res.status})`);
            const data: User[] = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    const paginatedUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const pendingUsers = users.filter((u) => u.status === "pending").length;

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    }

    function handleAddUser() {
        setIsAdding(true);
    }

    function handleEditUser(user: User) {
        setEditingUser(user);
    }

    async function handleDeleteUser(userId: string) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                alert(err?.error || "Failed to delete user.");
                setLoading(false);
                return;
            }

            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            alert("Network error.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Open approval modal with user info
    function handleApproveUser(user: User) {
        setApprovingUser(user);
        setApprovalError(null);
    }

    // Confirm approval API call
    async function confirmApproveUser() {
        if (!approvingUser) return;
        setApprovalLoading(true);
        setApprovalError(null);

        try {
            const res = await fetch(`/api/admin/users/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: approvingUser.id }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to approve user (status: ${res.status})`);
            }

            // Update local users state: mark approved user as active
            setUsers((prev) =>
                prev.map((u) => (u.id === approvingUser.id ? { ...u, status: "active" } : u))
            );
            setApprovingUser(null);
        } catch (err: any) {
            setApprovalError(err.message || "Unknown error");
        } finally {
            setApprovalLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-full overflow-x-auto">
            {/* Loading & Error */}
            {loading && <p className="text-center text-lg py-10">Loading users...</p>}
            {error && <p className="text-center text-red-600 py-10">Error: {error}</p>}

            {!loading && !error && (
                <>
                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                            <p className="text-4xl font-bold text-indigo-600">{totalUsers}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-2">Active Users</h2>
                            <p className="text-4xl font-bold text-green-600">{activeUsers}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-2">Pending Approvals</h2>
                            <p className="text-4xl font-bold text-yellow-600">{pendingUsers}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <button
                            onClick={handleAddUser}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            <PlusCircle size={20} /> Add User
                        </button>
                        <div className="text-gray-700">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-indigo-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                                {paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : user.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {user.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                aria-label={`Edit ${user.name}`}
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                                aria-label={`Delete ${user.name}`}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            {user.status === "pending" && (
                                                <button
                                                    onClick={() => handleApproveUser(user)}
                                                    className="text-green-600 hover:text-green-900"
                                                    aria-label={`Approve ${user.name}`}
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700 gap-4">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <div>
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    {/* Approval Modal */}
                    {approvingUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                            <div className="bg-white rounded p-6 w-full max-w-lg shadow-lg max-h-[80vh] overflow-y-auto">
                                <h2 className="text-2xl font-semibold mb-4 text-center">Approve User</h2>

                                <div className="mb-4 space-y-2">
                                    <UserDetail label="Name" value={approvingUser.name} />
                                    <UserDetail label="Email" value={approvingUser.email} />
                                    <UserDetail label="Role" value={approvingUser.role} />
                                    <UserDetail label="Status" value={approvingUser.status.toUpperCase()} />
                                    {approvingUser.phone && <UserDetail label="Phone" value={approvingUser.phone} />}
                                    {approvingUser.address && <UserDetail label="Address" value={approvingUser.address} />}
                                    {approvingUser.createdAt && (
                                        <UserDetail
                                            label="Created At"
                                            value={new Date(approvingUser.createdAt).toLocaleString()}
                                        />
                                    )}
                                    {approvingUser.updatedAt && (
                                        <UserDetail
                                            label="Updated At"
                                            value={new Date(approvingUser.updatedAt).toLocaleString()}
                                        />
                                    )}
                                </div>

                                {approvalError && <p className="text-center text-red-600 mb-4">{approvalError}</p>}

                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setApprovingUser(null)}
                                        disabled={approvalLoading}
                                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmApproveUser}
                                        disabled={approvalLoading}
                                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                                    >
                                        {approvalLoading ? "Approving..." : "Confirm Approve"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add/Edit Modal */}
                    {(isAdding || editingUser) && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                            <div className="bg-white rounded p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
                                <h2 className="text-xl font-semibold mb-4">{isAdding ? "Add User" : "Edit User"}</h2>

                                <AddUserForm
                                    initialData={
                                        editingUser
                                            ? {
                                                id: editingUser.id,
                                                name: editingUser.name,
                                                email: editingUser.email,
                                                role: editingUser.role,
                                                phone: editingUser.phone,
                                                address: editingUser.address,
                                            }
                                            : undefined
                                    }
                                    onCancel={() => {
                                        setIsAdding(false);
                                        setEditingUser(null);
                                    }}
                                    onSuccess={(user) => {
                                        if (isAdding) {
                                            setUsers((prev) => [user, ...prev]);
                                            setIsAdding(false);
                                        } else if (editingUser) {
                                            setUsers((prev) =>
                                                prev.map((u) => (u.id === user.id ? user : u))
                                            );
                                            setEditingUser(null);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function UserDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-gray-200 py-1">
            <span className="font-semibold text-gray-700">{label}:</span>
            <span className="text-gray-900">{value}</span>
        </div>
    );
}
