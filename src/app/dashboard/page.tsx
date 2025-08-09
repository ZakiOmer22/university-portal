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

      // Optional: check if user isActivated or approved here
      if (!user.activated && user.activated !== undefined) {
        toast.error("Account is not activated yet.");
        router.replace("/auth/activation-pending");
        return;
      }

      toast.success(`Welcome back, ${user.fullName || user.email}!`);

      switch (user.role) {
        case "admin":
          router.replace("/dashboard/admin");
          break;
        case "teacher":
          router.replace("/dashboard/teacher");
          break;
        case "student":
          router.replace("/dashboard/student");
          break;
        case "parent":
          router.replace("/dashboard/parent");
          break;
        case "employee":
          router.replace("/dashboard/employee");
          break;
        default:
          toast.error("Unknown user role. Please login again.");
          router.replace("/auth/login");
          break;
      }
    } catch (error) {
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
