import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  console.log("[auth/callback] code present:", !!code);

  if (!code) {
    console.error("[auth/callback] No code param in URL");
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

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error.message, error);
    return NextResponse.redirect(new URL("/login", origin));
  }

  console.log("[auth/callback] Exchange successful, user:", data.session?.user?.email);

  /* Build redirect response and apply all cookies */
  const response = NextResponse.redirect(new URL("/dashboard", origin));
  for (const { name, value, options } of cookieStore) {
    response.cookies.set(name, value, options);
  }

  return response;
}
