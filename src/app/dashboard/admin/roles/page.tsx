"use client";

import { useEffect, useState } from "react";

interface Role {
    name: string;
    label: string;
    colorClass: string;
    permissions: string[];
}

const sampleRoles: Role[] = [
    {
        name: "superadmin",
        label: "Super Administrator",
        colorClass: "border-purple-600 bg-purple-100",
        permissions: [
            "manage all users",
            "manage all roles",
            "access system settings",
            "view audit logs",
            "deploy updates",
        ],
    },
    {
        name: "admin",
        label: "Administrator",
        colorClass: "border-red-500 bg-red-100",
        permissions: [
            "manage users",
            "manage roles",
            "view reports",
            "approve registrations",
            "reset passwords",
        ],
    },
    {
        name: "department_head",
        label: "Department Head",
        colorClass: "border-yellow-500 bg-yellow-100",
        permissions: [
            "approve course offerings",
            "manage department courses",
            "view department reports",
            "manage department faculty",
        ],
    },
    {
        name: "teacher",
        label: "Teacher",
        colorClass: "border-blue-500 bg-blue-100",
        permissions: [
            "manage courses",
            "grade students",
            "create assignments",
            "view student progress",
            "manage course materials",
        ],
    },
    {
        name: "student",
        label: "Student",
        colorClass: "border-green-500 bg-green-100",
        permissions: [
            "view courses",
            "submit assignments",
            "view grades",
            "enroll in courses",
            "participate in discussions",
        ],
    },
    {
        name: "library_staff",
        label: "Library Staff",
        colorClass: "border-teal-500 bg-teal-100",
        permissions: [
            "manage book inventory",
            "issue books",
            "manage fines",
            "assist users",
        ],
    },
    {
        name: "finance_officer",
        label: "Finance Officer",
        colorClass: "border-indigo-500 bg-indigo-100",
        permissions: [
            "manage student payments",
            "generate financial reports",
            "process refunds",
            "approve budgets",
        ],
    },
    {
        name: "registrar",
        label: "Registrar",
        colorClass: "border-pink-500 bg-pink-100",
        permissions: [
            "manage enrollments",
            "maintain student records",
            "generate transcripts",
            "schedule exams",
        ],
    },
    {
        name: "alumni_coordinator",
        label: "Alumni Coordinator",
        colorClass: "border-orange-500 bg-orange-100",
        permissions: [
            "manage alumni records",
            "organize events",
            "send newsletters",
            "coordinate donations",
        ],
    },
];

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API loading delay
        setTimeout(() => {
            setRoles(sampleRoles);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) return <p className="text-gray-600">Loading roles...</p>;
    if (!roles.length) return <p className="text-gray-600">No roles found.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {roles.map(({ name, label, colorClass, permissions }) => (
                <div
                    key={name}
                    className={`border-2 ${colorClass} rounded-lg p-5 shadow-sm hover:shadow-lg transition cursor-pointer`}
                >
                    <h3 className="text-xl font-semibold mb-2">{label}</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {permissions.map((perm) => (
                            <li key={perm}>{perm}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
