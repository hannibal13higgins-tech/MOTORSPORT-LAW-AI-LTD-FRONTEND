'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const ALLOWED_EMAILS = (
  process.env.NEXT_PUBLIC_ALLOWED_EMAILS || ""
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

interface AuthState {
  /** true while we are still resolving the session */
  loading: boolean;
  /** set when session is confirmed */
  authenticated: boolean;
  /** non-null when the user should see an auth error */
  error: string | null;
}

/**
 * Client-side auth guard.
 *
 * - Retries getSession up to 5 times (800 ms apart) to survive
 *   the cookie-hydration delay after OAuth redirect.
 * - If NEXT_PUBLIC_ALLOWED_EMAILS is set, checks email against
 *   the allowlist and signs out + blocks non-allowed accounts.
 * - If no session after retries, redirects to /login.
 */
export function useAuthGuard(): AuthState {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    loading: true,
    authenticated: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const supabase = getSupabaseBrowserClient();

      // Retry loop — wait for cookies to hydrate
      let session = null;
      for (let i = 0; i < 5; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          session = data.session;
          break;
        }
        await new Promise((r) => setTimeout(r, 800));
      }

      if (cancelled) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      // Allowlist check
      if (ALLOWED_EMAILS.length > 0) {
        const email = (session.user?.email || "").toLowerCase();
        if (!ALLOWED_EMAILS.includes(email)) {
          await supabase.auth.signOut();
          if (!cancelled) {
            setState({
              loading: false,
              authenticated: false,
              error: "Access is not enabled for this account.",
            });
          }
          return;
        }
      }

      if (!cancelled) {
        setState({ loading: false, authenticated: true, error: null });
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return state;
}
