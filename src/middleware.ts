import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * MVP pass-through middleware.
 *
 * Auth gating is handled client-side (useAuthGuard hook) to avoid
 * the cookie-race redirect loop that blocks partners after OAuth.
 *
 * This middleware still creates a Supabase server client so that
 * cookie refresh (token rotation) happens on every request — the
 * setAll callback writes refreshed tokens back to the browser.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            response = NextResponse.next({ request });
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Trigger token refresh (result intentionally unused — we just
  // need the SDK to call setAll if cookies need rotating).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orgs/:path*",
    "/console/:path*",
    "/articles/:path*",
  ],
};
