"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiImage, 
  FiUsers, 
  FiEye, 
  FiEyeOff,
  FiCheck,
  FiX,
  FiArrowRight,
  FiPhone,
  FiBook,
  FiBriefcase
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaUniversity } from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: string;
  studentId?: string;
  employeeId?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "STUDENT",
    studentId: "",
    employeeId: ""
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const roles = [
    { value: "STUDENT", label: "Student", icon: FiBook, description: "Enrolled student" },
    { value: "PARENT", label: "Parent", icon: FiUsers, description: "Parent/Guardian" },
    { value: "TEACHER", label: "Teacher", icon: FiUser, description: "Faculty member" },
    { value: "EMPLOYEE", label: "Employee", icon: FiBriefcase, description: "Staff member" },
    { value: "ADMIN", label: "Administrator", icon: FaUniversity, description: "System administrator" },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate password strength
    if (field === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getErrorMessage = (e: unknown): string => {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
      return (e as { message: string }).message;
    }
    return String(e) || "Something went wrong. Please try again.";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      toast.success("Profile image selected");
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep1 = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.password) {
      toast.error("Please create a password");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (passwordStrength < 40) {
      toast.error("Please choose a stronger password");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  async function handleSubmit() {
    setLoading(true);

    const submitData = new FormData();
    submitData.append("fullName", formData.name.trim());
    submitData.append("email", formData.email.trim().toLowerCase());
    submitData.append("password", formData.password);
    submitData.append("role", formData.role);
    submitData.append("phone", formData.phone);
    
    if (formData.studentId) submitData.append("studentId", formData.studentId);
    if (formData.employeeId) submitData.append("employeeId", formData.employeeId);
    if (profileImage) submitData.append("profileImage", profileImage);

    try {
      const res = await fetch(`${window.location.origin}/api/auth/register`, {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful! Await admin approval.", {
        duration: 4000,
        position: "top-center"
      });
      router.push("/auth/login");
    } catch (err) {
      console.error("Registration error:", err);
      const message = getErrorMessage(err);
      toast.error(message, {
        duration: 4000,
        position: "top-center"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleOAuthLogin = (provider: string) => {
    toast.info(`${provider} integration coming soon!`, {
      duration: 3000,
      position: "top-center"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side - Brand/Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaUniversity className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold">University Portal</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Start Your Educational Journey
            </h2>
            
            <p className="text-blue-100 text-lg leading-relaxed">
              Join our learning community and unlock access to courses, resources, and collaborative tools.
            </p>

            {/* Features List */}
            <div className="space-y-4 mt-8">
              {[
                "Access to comprehensive course materials",
                "Connect with instructors and peers",
                "Track your academic progress",
                "Secure and verified accounts"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <FiCheck className="text-white text-sm" />
                  </div>
                  <span className="text-blue-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-3/5 bg-white p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join our educational community</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step < currentStep ? <FiCheck /> : step}
                  </div>
                  {step < 2 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Role *</label>
                    <div className="relative">
                      <FiUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg z-10" />
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500">
                      {roles.find(r => r.value === formData.role)?.description}
                    </p>
                  </div>

                  {/* Role-specific fields */}
                  {formData.role === "STUDENT" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Student ID</label>
                      <input
                        type="text"
                        placeholder="Enter your student ID (optional)"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange("studentId", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  )}

                  {["TEACHER", "EMPLOYEE", "ADMIN"].includes(formData.role) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Employee ID</label>
                      <input
                        type="text"
                        placeholder="Enter your employee ID (optional)"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Security & Profile */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Create Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Password strength:</span>
                          <span className={`font-semibold ${
                            passwordStrength < 40 ? 'text-red-600' :
                            passwordStrength < 70 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-600 text-xs">Passwords do not match</p>
                    )}
                  </div>

                  {/* Profile Image */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <FiImage className="text-lg" />
                        <span>Choose Profile Image</span>
                      </button>
                      
                      {previewImage && (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            <FiX />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Optional. Max 5MB. JPG, PNG, or WEBP.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === 1 ? 'Continue' : 'Complete Registration'}</span>
                    <FiArrowRight className="text-lg" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-500 text-sm">or register with</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => handleOAuthLogin("Google")}
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                disabled={loading}
              >
                <FcGoogle className="text-xl" />
                Google
              </button>
              <button 
                onClick={() => handleOAuthLogin("GitHub")}
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                disabled={loading}
              >
                <FaGithub className="text-xl" />
                GitHub
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a 
                  href="/auth/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                🔒 All accounts require admin approval. You&apos;ll receive an email once your account is activated.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}