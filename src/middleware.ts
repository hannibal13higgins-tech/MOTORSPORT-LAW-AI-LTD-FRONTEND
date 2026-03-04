import { NextResponse } from "next/server";

// Dev mode: no auth check, all routes pass through.
// Supabase auth will be re-enabled when moving to production.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/orgs/:path*", "/articles/:path*"],
};
