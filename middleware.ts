import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // No auth, no redirect, always continue
  return NextResponse.next();
}

// If you want to keep the matcher to limit middleware to these routes (optional)
export const config = {
  matcher: [
    "/", // Landing page
    "/auth/:path*", // Login/Register
    "/dashboard/:path*", // Main dashboard
    "/admin/:path*", // Admin area
    "/teacher/:path*", // Teacher area
    "/student/:path*", // Student area
  ],
};
