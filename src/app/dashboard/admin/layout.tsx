// app/dashboard/admin/layout.tsx
import AdminAuthGuard from "@/components/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthGuard allowedRoles={["admin"]}>
            <div >
                {/* No navbar, no footer */}
                <main className="flex-grow p-1">{children}</main>
            </div>
        </AdminAuthGuard>
    );
}
