'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      try {
        const data = await apiFetch("/orgs");
        setOrgs((data as Org[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load organisations");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
        <h1 className="text-base font-semibold text-[#111827]">Motorsport Law AI</h1>
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-[#6B7280] hover:text-[#111827]"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#111827]">Organisations</h2>
          <Link
            href="/orgs/new"
            className="text-sm bg-[#1E3A5F] text-white px-4 py-2 rounded hover:bg-[#162d4a]"
          >
            Create Organisation
          </Link>
        </div>

        {loading && <p className="text-sm text-[#6B7280]">Loading…</p>}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        {!loading && !error && orgs.length === 0 && (
          <p className="text-sm text-[#6B7280]">
            No organisations yet.{" "}
            <Link href="/orgs/new" className="underline text-[#1E3A5F]">
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
                  className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded px-4 py-3 hover:border-[#1E3A5F] transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-[#111827]">{org.name}</span>
                    <span className="block text-xs text-[#6B7280] mt-0.5">
                      Created {new Date(org.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-sm text-[#1E3A5F] font-medium">Open</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
