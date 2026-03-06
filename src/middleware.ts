import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  /* Post-OAuth redirect — let browser land so client-side
     Supabase can pick up the freshly-set session cookies. */
  if (request.nextUrl.searchParams.get("from") === "oauth") {
    return NextResponse.next();
  }

  const allowedEmails = (process.env.ALLOWED_TESTER_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  /* Create Supabase server client using cookies */
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            response = NextResponse.next({ request });
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  /* No session → redirect to login */
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /* Tester whitelist — if ALLOWED_TESTER_EMAILS is set, enforce it */
  if (allowedEmails.length > 0) {
    const email = (user.email || "").toLowerCase();
    if (!allowedEmails.includes(email)) {
      return NextResponse.redirect(new URL("/login?blocked=1", request.url));
    }
  }

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
