'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { apiFetch } from "@/lib/api";

interface Org {
  id: string;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      try {
        const data = await apiFetch("/orgs", undefined, session.access_token);
        setOrgs((data as Org[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load organisations");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">Motorsport Law AI</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Organisations</h2>
          <Link
            href="/orgs/new"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Create Organisation
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-gray-500">Loading…</p>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        {!loading && !error && orgs.length === 0 && (
          <p className="text-sm text-gray-500">
            No organisations yet.{" "}
            <Link href="/orgs/new" className="underline text-gray-900">
              Create one
            </Link>{" "}
            to get started.
          </p>
        )}

        {!loading && orgs.length > 0 && (
          <ul className="space-y-2">
            {orgs.map((org) => (
              <li key={org.id}>
                <Link
                  href={`/orgs/${org.id}`}
                  className="block bg-white border border-gray-200 rounded px-4 py-3 hover:border-gray-400 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">{org.name}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    Created {new Date(org.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
