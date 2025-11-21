"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiUser, 
  FiArrowRight,
  FiGithub,
  FiTwitter,
  FiPhone
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = () => {
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
        // Ignore invalid localStorage data
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please enter both email and password.", { 
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.", {
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - replace with your actual API endpoint
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email.toLowerCase().trim(), 
          password: formData.password,
          rememberMe 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      // Store the user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }

      if (!data.user?.activated) {
        toast.error("Your account is not activated yet. Please check your email for activation instructions.", { 
          duration: 5000,
          position: "top-center"
        });
        router.push("/auth/activation-pending");
        return;
      }

      toast.success(`Welcome back, ${data.user.fullName || data.user.email.split('@')[0]}!`, { 
        duration: 3000,
        position: "top-center"
      });
      
      // Add a small delay to show the success message
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Something went wrong. Please try again later.";
      toast.error(message, { 
        duration: 4000,
        position: "top-center"
      });
    } finally {
      setLoading(false);
    }
  }

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const remember = localStorage.getItem("rememberMe");
    
    if (remember && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleDemoLogin = (role: string) => {
    const demoAccounts = {
      student: { email: "student@mail.com", password: "1234" },
      teacher: { email: "teacher@mail.com", password: "1234" },
      admin: { email: "admin@mail.com", password: "1234" },
      parent: { email: "parent@mail.com", password: "1234" },
      employee: { email: "employee@mail.com", password: "1234" }
    };

    const account = demoAccounts[role as keyof typeof demoAccounts];
    setFormData(account);
    toast.info(`Demo ${role} credentials loaded. Click login to continue.`, {
      duration: 4000,
      position: "top-center"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side - Brand/Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiUser className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold">University Portal</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Welcome Back to Your Learning Journey
            </h2>
            
            <p className="text-blue-100 text-lg leading-relaxed">
              Access your courses, connect with peers, and continue your educational path with our comprehensive learning platform.
            </p>

            {/* Features List */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-blue-100">Access all your courses and materials</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-blue-100">Connect with instructors and peers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-blue-100">Track your academic progress</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            {/* Demo Accounts */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3 text-center">Quick demo access:</p>
              <div className="flex gap-2 justify-center">
                {['student', 'teacher', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role)}
                    className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors capitalize"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a 
                    href="/auth/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="text-lg" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-500 text-sm">or continue with</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button 
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                disabled={loading}
              >
                <FiGithub className="text-lg" />
              </button>
              <button 
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                disabled={loading}
              >
                <FiTwitter className="text-lg" />
              </button>
              <button 
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                disabled={loading}
              >
                <FiPhone className="text-lg" />
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <a 
                  href="/auth/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Create account
                </a>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                🔒 Your login information is encrypted and secure
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}