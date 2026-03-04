'use client';

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import AnswerPanel from "@/components/AnswerPanel";
import RefusalPanel from "@/components/RefusalPanel";
import CitationCard, { type Citation } from "@/components/CitationCard";
import EventStrip from "@/components/EventStrip";

interface Org {
  id: string;
  name: string;
  createdAt: string;
}

interface RegulationSet {
  id: string;
  name: string;
  type: string;
}

type AiResult =
  | { refused: true; refusalReason: string }
  | { refused: false; answer: string; citations: Citation[] };

export default function OrgConsolePage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();

  const [org, setOrg] = useState<Org | null>(null);
  const [regulationSets, setRegulationSets] = useState<RegulationSet[]>([]);
  const [selectedRegSetId, setSelectedRegSetId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [askError, setAskError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const resultRef = useRef<HTMLDivElement>(null);

  const selectedSet = regulationSets.find((s) => s.id === selectedRegSetId);

  useEffect(() => {
    async function load() {
      try {
        const [orgData, setsData] = await Promise.all([
          apiFetch(`/orgs/${orgId}`),
          apiFetch("/regulation-sets"),
        ]);

        if (orgData === null) {
          setPageError("NOT_FOUND");
          return;
        }

        setOrg(orgData as Org);
        setRegulationSets((setsData as RegulationSet[]) ?? []);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setPageLoading(false);
      }
    }
    load();
  }, [orgId]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRegSetId || asking || !question.trim()) return;

    setAsking(true);
    setAskError(null);
    setResult(null);

    try {
      const data = await apiFetch(`/orgs/${orgId}/ai/ask`, {
        method: "POST",
        body: JSON.stringify({ question }),
      }) as AiResult | null;

      if (data === null) {
        setAskError("Request failed.");
        return;
      }

      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setAskError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setAsking(false);
    }
  }

  function handleClear() {
    setQuestion("");
    setResult(null);
    setAskError(null);
  }

  /* ── Not Found ── */
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

  /* ── 3-Panel Layout ── */
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
            <span className="block text-sm font-medium text-[#1E3A5F] bg-[#FAFAFA] rounded px-3 py-1.5">
              Console
            </span>
            <span className="block text-sm text-[#6B7280]/50 px-3 py-1.5 cursor-not-allowed">
              Articles
            </span>
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
        {/* Top header bar */}
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={selectedRegSetId}
              onChange={(e) => setSelectedRegSetId(e.target.value)}
              className="border border-[#E5E7EB] rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] min-w-[280px]"
            >
              <option value="">Select a regulation set</option>
              {regulationSets.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {selectedSet && (
              <span className="text-xs bg-[#FAFAFA] border border-[#E5E7EB] rounded px-2 py-1 font-mono text-[#6B7280]">
                2025 Issue 5
              </span>
            )}

            <div className="flex gap-2 ml-auto">
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-0.5">
                Citations enforced
              </span>
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-0.5">
                Refusal enabled
              </span>
            </div>
          </div>
        </div>

        {/* Question composer */}
        <div className="px-6 py-6 max-w-3xl">
          <form onSubmit={handleAsk} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
              Regulatory question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder="Ask a question about the selected regulation set…"
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] resize-none"
            />
            <p className="text-xs text-[#6B7280]">
              Answers are limited to the selected rulebook and must cite clauses.
            </p>

            {askError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {askError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!selectedRegSetId || asking || !question.trim()}
                className="bg-[#1E3A5F] text-white text-sm font-medium px-6 py-2 rounded hover:bg-[#162d4a] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {asking ? "Asking…" : "Ask"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-[#6B7280] px-4 py-2 border border-[#E5E7EB] rounded hover:bg-[#FAFAFA]"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Answer / Refusal */}
        {asking && (
          <div className="px-6 pb-6 max-w-3xl">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          </div>
        )}

        {result && !asking && (
          <div ref={resultRef} className="px-6 pb-6 max-w-3xl">
            {result.refused ? (
              <RefusalPanel refusalReason={result.refusalReason} />
            ) : (
              <AnswerPanel answer={result.answer} />
            )}
          </div>
        )}

        {/* Audit trail at bottom */}
        <div className="px-6 pb-8 max-w-3xl border-t border-[#E5E7EB] pt-6 mt-2">
          <EventStrip orgId={orgId} />
        </div>
      </main>

      {/* ═══ Right Panel (Evidence) ═══ */}
      <aside className="w-80 shrink-0 bg-white border-l border-[#E5E7EB] overflow-y-auto">
        <div className="px-5 py-5 border-b border-[#E5E7EB]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Citations
          </p>
        </div>

        <div className="p-4 space-y-3">
          {asking && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-[#E5E7EB] rounded-lg p-4 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {!asking && result && !result.refused && result.citations.length > 0 && (
            result.citations.map((c) => (
              <CitationCard key={c.regulationObjectId} citation={c} />
            ))
          )}

          {!asking && result && !result.refused && result.citations.length === 0 && (
            <p className="text-xs text-[#6B7280] py-8 text-center">
              No citations returned.
            </p>
          )}

          {!asking && (!result || result.refused) && (
            <p className="text-xs text-[#6B7280] py-8 text-center">
              Citations will appear here after you ask a question.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
