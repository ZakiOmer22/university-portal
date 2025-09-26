"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem("user");

    if (!userJson) {
      toast.error("Please login first.");
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userJson);

      if (!user.activated && user.activated !== undefined) {
        toast.error("Account is not activated yet.");
        router.replace("/auth/activation-pending");
        return;
      }

      toast.success(`Welcome back, ${user.fullName || user.email}!`);

      // Normalize role to uppercase (to match your enum)
      const role = (user.role || "").toUpperCase();

      // Leaders still redirect to their own dashboard
      switch (role) {
        case "ADMIN":
          router.replace("/dashboard/admin");
          break;
        case "TEACHER":
          router.replace("/dashboard/teacher");
          break;
        case "STUDENT":
          router.replace("/dashboard/student");
          break;
        case "LEADER": // ✅ leader student with extra dashboard
          router.replace("/dashboard/leader");
          break;
        case "PARENT":
          router.replace("/dashboard/parent");
          break;
        case "EMPLOYEE":
          router.replace("/dashboard/employee");
          break;
        case "FINANCE":
          router.replace("/dashboard/finance");
          break;
        case "REGISTRAR":
          router.replace("/dashboard/registrar");
          break;
        case "EXAMINATION":
          router.replace("/dashboard/examination");
          break;
        case "HR":
          router.replace("/dashboard/hr");
          break;
        case "GRADUATED":
          router.replace("/dashboard/graduated");
          break;
        default:
          toast.error("Unknown user role. Please login again.");
          router.replace("/auth/login");
          break;
      }
    } catch {
      toast.error("Failed to load user data. Please login again.");
      router.replace("/auth/login");
    } finally {
      setCheckingUser(false);
    }
  }, [router]);

  if (checkingUser) {
    return (
      <>
        <Toaster richColors />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">Checking your session...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster richColors />
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </>
  );
}
