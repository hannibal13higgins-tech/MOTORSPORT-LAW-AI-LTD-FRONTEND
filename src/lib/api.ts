import { getSupabaseBrowserClient } from "./supabaseClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Get a fresh access token.  We call getSession() on a fresh client
 * reference each time so the Supabase SDK re-reads cookies / localStorage
 * rather than serving a stale in-memory cache.
 */
async function freshAccessToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<unknown> {
  /* Try up to 4 times (initial + 3 retries at 500 ms intervals).
     The middleware already validated the session server-side, so if
     we're here the user IS authenticated; we just need to wait for
     the client-side Supabase SDK to hydrate from cookies. */
  let token = await freshAccessToken();
  if (!token) {
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 500));
      token = await freshAccessToken();
      if (token) break;
    }
  }

  if (!token) {
    /* The middleware already guards all protected routes — if we still
       have no token after retries the session cookie is genuinely
       missing.  Throw instead of redirecting so the page can show an
       inline error rather than causing a redirect loop. */
    throw new Error("SESSION_EXPIRED");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let body: { error?: string; message?: string } = {};
    try {
      body = await res.json();
    } catch {
      // non-JSON response
    }

    const code = body?.error ?? "UNKNOWN_ERROR";

    if (code === "AUTH_REQUIRED") {
      throw new Error("SESSION_EXPIRED");
    }

    if (code === "NOT_FOUND") {
      return null;
    }

    if (code === "VALIDATION_ERROR") {
      throw new Error(body?.message ?? "Validation error");
    }

    throw new Error(code);
  }

  return res.json();
}
