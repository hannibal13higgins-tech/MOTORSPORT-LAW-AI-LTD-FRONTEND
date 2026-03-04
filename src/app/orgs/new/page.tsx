'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function NewOrgPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFetch("/orgs", {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      }) as { id: string } | null;

      if (!result) {
        setError("Failed to create organisation.");
        setLoading(false);
        return;
      }
      router.push(`/orgs/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organisation");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <Link href="/dashboard" className="text-sm text-[#6B7280] hover:text-[#111827]">
          &larr; Back to dashboard
        </Link>
      </header>

      <div className="max-w-md mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold text-[#111827] mb-6">
          Create Organisation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">
              Organisation name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              placeholder="e.g. Apex Racing Team"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A5F] text-white text-sm font-medium py-2.5 px-4 rounded hover:bg-[#162d4a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create Organisation"}
          </button>
        </form>
      </div>
    </main>
  );
}
