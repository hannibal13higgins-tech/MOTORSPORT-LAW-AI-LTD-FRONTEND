'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from "@/components/Header";

interface Org {
  id: string;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const auth = useAuthGuard();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.authenticated) return;

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
  }, [auth.authenticated]);

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center">
        <p className="text-sm text-[#9ca3af]">Loading&hellip;</p>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center">
        <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-4 py-3">
          {auth.error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      <Header />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Organisations</h2>
          <Link
            href="/orgs/new"
            className="text-sm bg-[#e10600] text-white px-4 py-2 rounded-lg hover:bg-[#c00500] font-medium"
          >
            Create Organisation
          </Link>
        </div>

        {loading && <p className="text-sm text-[#9ca3af]">Loading&hellip;</p>}

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {!loading && !error && orgs.length === 0 && (
          <p className="text-sm text-[#9ca3af]">
            No organisations yet.{" "}
            <Link href="/orgs/new" className="underline text-[#00a3ff]">
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
                  className="flex items-center justify-between bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-4 hover:border-[#00a3ff] hover:shadow-sm transition-all duration-150"
                >
                  <div>
                    <span className="text-sm font-medium text-white">{org.name}</span>
                    <span className="block text-xs text-[#9ca3af] mt-0.5">
                      Created {new Date(org.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-sm text-[#00a3ff] font-medium">Open</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
