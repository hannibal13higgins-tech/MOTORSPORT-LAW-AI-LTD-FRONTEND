'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Org {
  id: string;
  name: string;
  createdAt: string;
}

async function getToken(): Promise<string | null> {
  for (let i = 0; i < 5; i++) {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) return data.session.access_token;
    await new Promise((r) => setTimeout(r, 800));
  }
  return null;
}

export default function TeamHomePage() {
  const { orgId } = useParams<{ orgId: string }>();

  const [org, setOrg] = useState<Org | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        if (!token) {
          setPageError("Session could not be verified — please sign out and sign in again.");
          return;
        }

        const res = await fetch(`${BASE_URL}/orgs/${orgId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            setPageError("NOT_FOUND");
          } else {
            setPageError("Failed to load organisation");
          }
          return;
        }

        setOrg(await res.json());
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
      <div className="min-h-screen bg-[#0b0f14]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">Not Found</p>
            <p className="text-sm text-[#9ca3af] mt-1">
              This organisation does not exist or you do not have access.
            </p>
            <Link href="/dashboard" className="text-sm text-[#00a3ff] hover:underline mt-4 inline-block">
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-[#0b0f14]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-4 py-3">
            {pageError}
          </p>
        </main>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f14]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <p className="text-sm text-[#9ca3af]">Loading&hellip;</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      <Header />

      <div className="bg-[#111827] border-b border-[#1f2937] px-6 py-3">
        <Breadcrumbs
          crumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: org?.name ?? "Team" },
          ]}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-lg font-semibold text-white mb-1">
          {org?.name}
        </h1>
        <p className="text-sm text-[#9ca3af] mb-6">
          Created {org ? new Date(org.createdAt).toLocaleDateString() : ""}
        </p>

        <Link
          href={`/orgs/${orgId}/console`}
          className="inline-flex items-center gap-2 bg-[#e10600] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#c00500]"
        >
          Open Console &rarr;
        </Link>
      </div>
    </div>
  );
}
