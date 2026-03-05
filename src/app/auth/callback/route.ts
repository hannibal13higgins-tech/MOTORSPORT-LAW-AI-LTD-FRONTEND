import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  console.log("[auth/callback] Full URL:", request.url);
  console.log("[auth/callback] code param:", code);
  console.log("[auth/callback] SUPABASE_URL set:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("[auth/callback] ANON_KEY set:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!code) {
    console.error("[auth/callback] No code param — possible implicit flow or misconfiguration");
    return NextResponse.redirect(new URL("/login", origin));
  }

  /* Collect cookies set by Supabase during the exchange */
  const cookieStore: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookieStore.push(...cookiesToSet);
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
      console.error("[auth/callback] error details:", JSON.stringify(error));
      return NextResponse.redirect(new URL("/login", origin));
    }

    console.log("[auth/callback] Exchange OK — user:", data.session?.user?.email);
    console.log("[auth/callback] Cookies to set:", cookieStore.length);

    const response = NextResponse.redirect(new URL("/dashboard", origin));
    for (const { name, value, options } of cookieStore) {
      response.cookies.set(name, value, options);
    }

    return response;
  } catch (err) {
    console.error("[auth/callback] Unexpected error:", err);
    return NextResponse.redirect(new URL("/login", origin));
  }
}
