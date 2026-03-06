import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    console.error("[auth/callback] No code param");
    return NextResponse.redirect(new URL("/login", origin));
  }

  /**
   * Create the redirect response FIRST so Supabase can set cookies
   * directly on it via setAll.
   *
   * IMPORTANT: We mirror setAll writes back into request.cookies so
   * that a subsequent getAll (which the Supabase SDK calls internally
   * during exchangeCodeForSession) sees cookies it just wrote. Without
   * this, the PKCE code_verifier round-trip can fail.
   */
  const redirectTo = new URL("/dashboard?from=oauth", origin);
  const response = NextResponse.redirect(redirectTo);

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
            // Mirror into the request so subsequent getAll sees them
            request.cookies.set(name, value);
            // Set on the outgoing response so the browser receives them
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "[auth/callback] exchangeCodeForSession error:",
        error.message
      );
      return NextResponse.redirect(new URL("/login", origin));
    }

    return response;
  } catch (err) {
    console.error("[auth/callback] Unexpected error:", err);
    return NextResponse.redirect(new URL("/login", origin));
  }
}
