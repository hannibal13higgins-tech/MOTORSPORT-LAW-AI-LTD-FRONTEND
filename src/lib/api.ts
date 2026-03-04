const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<unknown> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: "Bearer dummy",
    "x-dev-actor-id": "founder-demo",
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
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
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
