import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  /* Post-OAuth redirect — let browser land on /dashboard so client-side
     Supabase can pick up the freshly-set session cookies. */
  if (request.nextUrl.searchParams.get("from") === "oauth") {
    return NextResponse.next();
  }

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

  /*
   * getUser() validates the JWT server-side (unlike getSession which only
   * reads local cookies and may miss freshly-set tokens after OAuth redirect).
   * This also refreshes the token if needed, and setAll above ensures the
   * refreshed cookies are forwarded to the browser.
   */
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match protected routes only.
     * Explicitly exclude: /login, /register, /auth/*, /_next/*, /favicon.ico, static files.
     */
    "/((?!login|register|auth|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
