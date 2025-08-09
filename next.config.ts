import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure image optimization for external domains
  images: {
    domains: [
      "images.unsplash.com",  // Unsplash (departments, banners, etc.)
      "picsum.photos",        // Random placeholder images
      "via.placeholder.com",  // Simple placeholder images
      'ui-avatars.com',
      "randomuser.me",
      "res.cloudinary.com",   // (Optional) Cloudinary if used later
    ],
  },

  // Allow larger file uploads (needed for profile image in registration form)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Default was 1MB, now increased to 10MB
    },
  },

  // ✅ Optional: Add React Strict Mode (recommended)
  reactStrictMode: true,

  // ✅ Future-proof: ESLint settings (skip during builds if needed)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Future-proof: Typescript settings
  typescript: {
    ignoreBuildErrors: false, // Keep strict checking ON for dev safety
  },
};

export default nextConfig;
