import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Org {
  id: string;
  name: string;
  createdAt: string;
}

async function getOrg(orgId: string): Promise<Org | null> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Server components cannot set cookies — no-op
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function TeamHomePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = await getOrg(orgId);

  if (!org) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      <Header />

      <div className="bg-[#111827] border-b border-[#1f2937] px-6 py-3">
        <Breadcrumbs
          crumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: org.name },
          ]}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-lg font-semibold text-white mb-1">
          {org.name}
        </h1>
        <p className="text-sm text-[#9ca3af] mb-6">
          Created {new Date(org.createdAt).toLocaleDateString()}
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
