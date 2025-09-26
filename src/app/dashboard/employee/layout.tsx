// app/dashboard/employee/layout.tsx
import AdminAuthGuard from "@/components/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthGuard allowedRoles={["EMPLOYEE"]}>
            <div >
                {/* No navbar, no footer */}
                <main className="flex-grow p-1">{children}</main>
            </div>
        </AdminAuthGuard>
    );
}
