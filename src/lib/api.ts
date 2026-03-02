import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(
  path: string,
  options?: RequestInit,
  token?: string
): Promise<unknown> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

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
      redirect("/login");
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
