'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Org {
  id: string;
  name: string;
  createdAt: string;
}

export default function TeamHomePage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();

  const [org, setOrg] = useState<Org | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch(`/orgs/${orgId}`);
        if (data === null) {
          setPageError("NOT_FOUND");
          return;
        }
        setOrg(data as Org);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setPageLoading(false);
      }
    }
    load();
  }, [orgId]);

  if (pageError === "NOT_FOUND") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#111827]">Not Found</p>
          <p className="text-sm text-[#6B7280] mt-1">
            This organisation does not exist or you do not have access.
          </p>
          <Link href="/dashboard" className="text-sm text-[#1E3A5F] underline mt-4 inline-block">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (pageError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm text-red-600">{pageError}</p>
      </main>
    );
  }

  if (pageLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm text-[#6B7280]">Loading…</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* ═══ Left Rail ═══ */}
      <aside className="w-56 shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col">
        <div className="px-5 py-5 border-b border-[#E5E7EB]">
          <p className="text-sm font-bold tracking-wide text-[#1E3A5F] uppercase">
            Motorsport AI
          </p>
        </div>

        <div className="px-5 py-4 flex-1">
          {org && (
            <p className="text-sm font-medium text-[#111827] mb-4">{org.name}</p>
          )}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="block text-sm text-[#6B7280] hover:text-[#111827] px-3 py-1.5"
            >
              Dashboard
            </Link>
            <span className="block text-sm font-medium text-[#1E3A5F] bg-[#FAFAFA] rounded px-3 py-1.5">
              Team Home
            </span>
            <Link
              href={`/orgs/${orgId}/console`}
              className="block text-sm text-[#6B7280] hover:text-[#111827] px-3 py-1.5"
            >
              Console
            </Link>
          </nav>
        </div>

        <div className="px-5 py-4 border-t border-[#E5E7EB]">
          <p className="text-xs text-[#6B7280] mb-1">Signed in as</p>
          <p className="text-xs font-medium text-[#111827] truncate">founder-demo</p>
          <button
            onClick={() => router.push("/login")}
            className="text-xs text-[#1E3A5F] hover:underline mt-2"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ═══ Main Panel ═══ */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
          <Breadcrumbs
            crumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: org?.name ?? "Team" },
            ]}
          />
        </div>

        <div className="max-w-2xl px-6 py-8">
          <h1 className="text-lg font-semibold text-[#111827] mb-1">
            {org?.name}
          </h1>
          <p className="text-sm text-[#6B7280] mb-6">
            Created {org ? new Date(org.createdAt).toLocaleDateString() : ""}
          </p>

          <Link
            href={`/orgs/${orgId}/console`}
            className="inline-flex items-center gap-2 bg-[#1E3A5F] text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-[#162d4a] active:scale-[0.98] transition-all"
          >
            Open Console &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
