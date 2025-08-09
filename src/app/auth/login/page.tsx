"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in (and activated)
  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        if (user?.activated) {
          router.replace("/dashboard");
        } else {
          router.replace("/auth/activation-pending");
        }
      }
    } catch {
      // Fail silently, no user or bad JSON
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.", { duration: 2000 });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.error || "Invalid email or password.", { duration: 2500 });
        return;
      }

      if (!data.user?.activated) {
        toast.error(
          "Your account is not activated yet. Please activate your account.",
          { duration: 4000 }
        );
        // Save user anyway to allow access to activation page if needed
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/auth/activation-pending");
        return;
      }

      // Success: save user and token (if any) to localStorage to remember login
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

      toast.success(`Welcome back, ${data.user.fullName || data.user.email}!`, {
        duration: 2000,
      });

      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong. Please try again later.", { duration: 2500 });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-6">Login to continue to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="flex items-center gap-3 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <FiMail className="text-gray-500 text-xl" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 outline-none text-gray-700"
              required
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-3 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500 relative">
            <FiLock className="text-gray-500 text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-gray-700"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}