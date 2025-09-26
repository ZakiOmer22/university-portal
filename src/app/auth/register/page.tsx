"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiImage, FiUsers } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT"); // ✅ match enum
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", name.trim());
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append("role", role);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const res = await fetch(`${window.location.origin}/api/auth/register`, {
        method: "POST",
        body: formData, // ✅ no headers
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { message: "Server did not return JSON" };
      }

      if (!res.ok) {
        toast.error(data.message || "Registration failed!");
        setLoading(false);
        return;
      }

      toast.success("Registration submitted! Awaiting admin approval.");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Register now. All accounts will be manually approved by the admin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-3 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <FiUser className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <FiMail className="text-gray-500 text-xl" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 border rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <FiLock className="text-gray-500 text-xl" />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-2">
              <FiUsers /> Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent</option>
              <option value="TEACHER">Teacher</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
              <option value="FINANCE">Finance</option>
              <option value="REGISTRAR">Registrar</option>
              <option value="EXAMINATION">Examination</option>
              <option value="HR">HR</option>
              <option value="GRADUATED">Graduated</option>
              <option value="LEADER">Class Leader</option> {/* ✅ FIX */}
            </select>
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Profile Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <FiImage />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover border"
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button className="w-full border flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-gray-100 transition">
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>
          <button className="w-full border flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-gray-100 transition">
            <FaGithub className="text-xl" />
            Continue with GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
