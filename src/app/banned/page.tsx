"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FiAlertTriangle, 
  FiMail, 
  FiClock, 
  FiUserX, 
  FiHelpCircle,
  FiArrowLeft,
  FiShield,
  FiFileText
} from "react-icons/fi";

interface BanDetails {
  reason: string;
  duration: string;
  expiresAt?: string;
  banId: string;
  contactEmail: string;
  appealDeadline?: string;
}

export default function AccountBannedPage() {
  const router = useRouter();
  const [banDetails, setBanDetails] = useState<BanDetails | null>(null);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");

  useEffect(() => {
    // Simulate fetching ban details - in real app, this would come from your API
    const fetchBanDetails = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBanDetails: BanDetails = {
        reason: "Violation of Terms of Service - Multiple spam activities detected",
        duration: "30 days",
        expiresAt: "2024-04-15T23:59:59Z",
        banId: "BAN-2024-00127",
        contactEmail: "support@universityportal.edu",
        appealDeadline: "2024-03-25T23:59:59Z"
      };
      
      setBanDetails(mockBanDetails);
    };

    fetchBanDetails();
  }, []);

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appeal submission
    console.log("Appeal submitted:", appealMessage);
    alert("Your appeal has been submitted for review. You will receive an email update within 3-5 business days.");
    setShowAppealForm(false);
    setAppealMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const getRemainingTime = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : "Less than 1 day";
  };

  if (!banDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading account status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <FiUserX className="text-3xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Account Suspended</h1>
            <p className="text-red-100 text-lg">
              Your account has been temporarily suspended
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Alert */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="text-red-600 text-xl mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Important Notice
                  </h3>
                  <p className="text-red-700 text-sm">
                    Your account access has been restricted due to policy violations. 
                    Please review the details below and follow the instructions to resolve this issue.
                  </p>
                </div>
              </div>
            </div>

            {/* Ban Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Ban Reason
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-900 font-medium">{banDetails.reason}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Suspension Duration
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <FiClock className="text-slate-400" />
                    <span className="text-slate-900 font-medium">{banDetails.duration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">
                    Ban ID
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <code className="text-slate-900 font-mono">{banDetails.banId}</code>
                  </div>
                </div>

                {banDetails.expiresAt && (
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">
                      Time Remaining
                    </label>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-orange-800 font-medium">
                        {getRemainingTime(banDetails.expiresAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FiHelpCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-900">
                    What happens next?
                  </h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Your account access will be restored automatically after the suspension period</li>
                    <li>• You may submit an appeal if you believe this was a mistake</li>
                    <li>• All your data remains secure and will be preserved</li>
                    <li>• You can contact support for additional clarification</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Appeal Section */}
            {!showAppealForm ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowAppealForm(true)}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiFileText className="text-lg" />
                    Submit Appeal
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiArrowLeft className="text-lg" />
                    Return to Login
                  </button>
                </div>
                
                {banDetails.appealDeadline && (
                  <p className="text-center text-sm text-slate-500">
                    Appeal deadline: {new Date(banDetails.appealDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200"
              >
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FiShield className="text-blue-600" />
                  Submit Appeal Request
                </h3>
                
                <form onSubmit={handleAppealSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Explain why you believe this suspension was a mistake
                    </label>
                    <textarea
                      value={appealMessage}
                      onChange={(e) => setAppealMessage(e.target.value)}
                      placeholder="Please provide detailed information about why you believe your account should be reinstated..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      Submit Appeal
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAppealForm(false)}
                      className="flex-1 border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <p className="text-xs text-slate-500 text-center">
                    By submitting an appeal, you agree to our review process. Response time is typically 3-5 business days.
                  </p>
                </form>
              </motion.div>
            )}

            {/* Support Contact */}
            <div className="text-center border-t border-slate-200 pt-6">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-2">
                <FiMail className="text-slate-400" />
                <span>Need immediate assistance?</span>
              </div>
              <a
                href={`mailto:${banDetails.contactEmail}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {banDetails.contactEmail}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-slate-500 text-sm">
            UniversityPortal • Account Security System
          </p>
        </motion.div>
      </div>
    </div>
  );
}