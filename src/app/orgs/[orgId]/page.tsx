'use client';

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { apiFetch } from "@/lib/api";
import AnswerPanel from "@/components/AnswerPanel";
import RefusalPanel from "@/components/RefusalPanel";
import CitationCard, { type Citation } from "@/components/CitationCard";
import TimelineFeed from "@/components/TimelineFeed";

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

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      const token = session.access_token;

      try {
        const [orgData, setsData] = await Promise.all([
          apiFetch(`/orgs/${orgId}`, undefined, token),
          apiFetch("/regulation-sets", undefined, token),
        ]);

        if (orgData === null) {
          setPageError("NOT_FOUND");
          return;
        }

        setOrg(orgData as Org);
        setRegulationSets((setsData as RegulationSet[]) ?? []);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Failed to load page");
      }
    }
    load();
  }, [orgId, router]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRegSetId || asking) return;

    setAsking(true);
    setAskError(null);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const selectedSet = regulationSets.find((s) => s.id === selectedRegSetId);

      const data = await apiFetch(
        `/orgs/${orgId}/ai/ask`,
        {
          method: "POST",
          body: JSON.stringify({
            question,
            regulationSetId: selectedRegSetId,
            versionLabel: selectedSet?.name ?? "",
            topN: 5,
          }),
        },
        session.access_token
      ) as AiResult | null;

      if (data === null) {
        setAskError("Regulation set not found.");
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

  if (pageError === "NOT_FOUND") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Not Found</p>
          <p className="text-sm text-gray-500 mt-1">
            This organisation does not exist or you do not have access.
          </p>
          <Link href="/dashboard" className="text-sm text-gray-900 underline mt-4 inline-block">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (pageError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-red-600">{pageError}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          ← Dashboard
        </Link>
        {org && (
          <h1 className="text-base font-semibold text-gray-900 mt-1">{org.name}</h1>
        )}
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* Regulation set selector */}
        <section>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Regulation Set
          </label>
          <select
            value={selectedRegSetId}
            onChange={(e) => setSelectedRegSetId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Select a regulation set</option>
            {regulationSets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </section>

        {/* Question input */}
        <section>
          <form onSubmit={handleAsk} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              required
              placeholder="Ask a question about the selected regulation set…"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />

            {askError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {askError}
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedRegSetId || asking || !question.trim()}
              className="bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {asking ? "Asking…" : "Ask"}
            </button>
          </form>
        </section>

        {/* Answer or Refusal */}
        {result && (
          <section ref={resultRef} className="space-y-4">
            {result.refused ? (
              <RefusalPanel refusalReason={result.refusalReason} />
            ) : (
              <>
                <AnswerPanel answer={result.answer} />

                {result.citations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                      Citations ({result.citations.length})
                    </p>
                    <div className="space-y-2">
                      {result.citations.map((c) => (
                        <CitationCard key={c.regulationObjectId} citation={c} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Evidence Summary — always disabled, coming next */}
            <button
              disabled
              className="text-sm text-gray-400 border border-gray-200 rounded px-4 py-2 cursor-not-allowed bg-gray-50"
            >
              Generate Evidence Summary — Coming Next
            </button>
          </section>
        )}

        {/* Timeline */}
        <section className="pt-4 border-t border-gray-200">
          <TimelineFeed orgId={orgId} />
        </section>
      </div>
    </main>
  );
}
