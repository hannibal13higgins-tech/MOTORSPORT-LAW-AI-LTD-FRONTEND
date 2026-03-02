'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { apiFetch } from "@/lib/api";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function NewOrgPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setShowConfirm(true);
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      const result = await apiFetch(
        "/orgs",
        {
          method: "POST",
          body: JSON.stringify({ name: name.trim() }),
        },
        session.access_token
      ) as { id: string } | null;

      if (!result) {
        setError("Organisation not found after creation.");
        return;
      }
      router.push(`/orgs/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organisation");
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to dashboard
        </Link>
      </header>

      <div className="max-w-md mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Create Organisation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organisation name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
            className="w-full bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded hover:bg-gray-800"
          >
            Create Organisation
          </button>
        </form>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message={`Create organisation "${name}"?`}
          confirmLabel="Create"
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </main>
  );
}
