'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Header from "@/components/Header";

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
    <div className="min-h-screen bg-[#0b0f14]">
      <Header />

      <div className="max-w-md mx-auto px-6 py-8">
        <Link href="/dashboard" className="text-sm text-[#9ca3af] hover:text-white mb-6 inline-block">
          &larr; Back to dashboard
        </Link>

        <h2 className="text-lg font-semibold text-white mb-6">
          Create Organisation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#e5e7eb] mb-1">
              Organisation name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0b0f14] border border-[#1f2937] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00a3ff] focus:border-transparent"
              placeholder="e.g. Apex Racing Team"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e10600] text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#c00500] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating\u2026" : "Create Organisation"}
          </button>
        </form>
      </div>
    </div>
  );
}
