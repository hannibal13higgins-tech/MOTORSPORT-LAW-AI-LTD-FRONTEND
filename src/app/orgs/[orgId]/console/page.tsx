'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerPanel from "@/components/AnswerPanel";
import RefusalPanel from "@/components/RefusalPanel";
import CitationCard, { type Citation } from "@/components/CitationCard";
import CandidateCard, { type DiagnosticCandidate } from "@/components/CandidateCard";
import SpellcheckNotice from "@/components/SpellcheckNotice";
import TrafficBadge, { TRAFFIC_CONFIG } from "@/components/TrafficBadge";
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

interface SpellcheckResult {
  originalQuestion: string;
  correctedQuestion?: string;
  changed: boolean;
  confidence: number;
}

interface DidYouMean {
  label: string;
  query: string;
  basisObjectIds: string[];
}

interface Ambiguity {
  question: string;
  whyItMatters: string;
}

interface Diagnostics {
  reasons: string[];
  spellcheck?: SpellcheckResult;
  didYouMean?: DidYouMean[];
  candidates: DiagnosticCandidate[];
  ambiguities: Ambiguity[];
  suggestedQueries: string[];
}

interface AiResult {
  refused: boolean;
  refusalReason?: string;
  traffic: "GREEN" | "AMBER" | "RED";
  answer?: string;
  citations?: Citation[];
  diagnostics: Diagnostics;
  answerHash?: string;
}

export default function ConsolePage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [org, setOrg] = useState<Org | null>(null);
  const [regulationSets, setRegulationSets] = useState<RegulationSet[]>([]);
  const [selectedRegSetId, setSelectedRegSetId] = useState<string>(
    searchParams.get("setId") ?? ""
  );
  const [question, setQuestion] = useState(
    searchParams.get("q") ?? ""
  );
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [askError, setAskError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedSet = regulationSets.find((s) => s.id === selectedRegSetId);

  const syncQueryParams = useCallback(
    (setId: string, q: string) => {
      const params = new URLSearchParams();
      if (setId) params.set("setId", setId);
      if (q) params.set("q", q);
      const qs = params.toString();
      const path = `/orgs/${orgId}/console${qs ? `?${qs}` : ""}`;
      router.replace(path, { scroll: false });
    },
    [orgId, router]
  );

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
        const sets = (setsData as RegulationSet[]) ?? [];
        setRegulationSets(sets);

        const urlSetId = searchParams.get("setId") ?? "";
        if (urlSetId && sets.some((s) => s.id === urlSetId)) {
          setSelectedRegSetId(urlSetId);
        }
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Failed to load page");
      } finally {
        setPageLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  function handleSetChange(setId: string) {
    setSelectedRegSetId(setId);
    syncQueryParams(setId, question);
  }

  function handleQuestionChange(q: string) {
    setQuestion(q);
    syncQueryParams(selectedRegSetId, q);
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRegSetId || asking || !question.trim()) return;

    setAsking(true);
    setAskError(null);
    setResult(null);

    try {
      const data = await apiFetch(`/orgs/${orgId}/ai/ask`, {
        method: "POST",
        body: JSON.stringify({
          question,
          regulationSetId: selectedRegSetId,
        }),
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
    syncQueryParams(selectedRegSetId, "");
  }

  function handleSelectQuery(query: string) {
    setQuestion(query);
    syncQueryParams(selectedRegSetId, query);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  /* ── Error / Loading states ── */
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
          <p className="text-sm text-red-400">{pageError}</p>
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

  /* ── Derived state ── */
  const isGreen = result?.traffic === "GREEN";
  const isRed = result?.traffic === "RED";
  const showCitations = !asking && result && isGreen && result.citations && result.citations.length > 0;
  const showCandidates = !asking && result && !isGreen && result.diagnostics.candidates.length > 0;
  const candidateMaxScore = result ? Math.max(...result.diagnostics.candidates.map((c) => c.score), 1) : 1;

  const rightPanelHeader = (() => {
    if (!result || asking) return "Citations";
    if (isGreen) return "Cited clauses";
    if (result.diagnostics.candidates.length > 0) return "Retrieved clauses";
    return "No clauses retrieved";
  })();

  const trafficConf = result ? TRAFFIC_CONFIG[result.traffic] : null;

  const ctxName = selectedSet?.name ?? "Not selected";
  const ctxVersion = result?.citations?.[0]?.versionLabel ?? (selectedSet ? "2025 Issue 5" : "\u2014");
  const ctxEffective = result?.citations?.[0]?.effectiveDate
    ? new Date(result.citations[0].effectiveDate).toLocaleDateString()
    : "\u2014";

  /* ── Layout ── */
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f14]">
      <Header />

      {/* Breadcrumbs bar */}
      <div className="bg-[#111827] border-b border-[#1f2937] px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/orgs/${orgId}`)}
            className="text-sm text-[#9ca3af] hover:text-white"
          >
            &larr; Back
          </button>
          <Breadcrumbs
            crumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: org?.name ?? "Team", href: `/orgs/${orgId}` },
              { label: "Console" },
            ]}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* ═══ Main Panel ═══ */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Context bar */}
          <div className="bg-[#111827] border-b border-[#1f2937] px-6 py-3">
            <div className="flex items-center gap-4 flex-wrap">
              <select
                value={selectedRegSetId}
                onChange={(e) => handleSetChange(e.target.value)}
                className="bg-[#0b0f14] border border-[#1f2937] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00a3ff] min-w-[280px]"
              >
                <option value="">Select a regulation set</option>
                {regulationSets.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <div className="flex gap-2 ml-auto">
                <span className="text-xs bg-emerald-950/50 text-emerald-400 border border-emerald-800 rounded-full px-3 py-0.5">
                  Citations enforced
                </span>
                <span className="text-xs bg-amber-950/50 text-amber-400 border border-amber-800 rounded-full px-3 py-0.5">
                  Refusal enabled
                </span>
              </div>
            </div>

            <div className="flex items-center gap-x-6 gap-y-1 flex-wrap mt-2 text-xs text-[#6b7280]">
              <span>Rulebook: <span className="font-medium text-[#e5e7eb]">{ctxName}</span></span>
              <span>Version: <span className="font-medium text-[#e5e7eb]">{ctxVersion}</span></span>
              <span>Effective: <span className="font-medium text-[#e5e7eb]">{ctxEffective}</span></span>
            </div>
          </div>

          {/* Traffic state banner */}
          {result && !asking && trafficConf && (
            <div className={`px-6 py-3 border-b border-l-4 ${trafficConf.bg} ${trafficConf.borderLeft} ${trafficConf.border}`}>
              <div className="flex items-center gap-4">
                <TrafficBadge traffic={result.traffic} size="lg" />
                <p className="text-sm text-[#e5e7eb]">
                  {result.diagnostics.reasons[0] ?? ""}
                </p>
              </div>
            </div>
          )}

          {/* Question composer */}
          <div className="px-6 py-6 max-w-3xl">
            <form onSubmit={handleAsk} className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                Regulatory question
              </label>
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => handleQuestionChange(e.target.value)}
                rows={4}
                placeholder="Ask a question about the selected regulation set\u2026"
                className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:ring-2 focus:ring-[#00a3ff] resize-none placeholder-[#6b7280]"
              />
              <p className="text-xs text-[#6b7280]">
                This system answers only when the regulation text can be located and cited.
              </p>

              {askError && (
                <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">
                  {askError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!selectedRegSetId || asking || !question.trim()}
                  className="bg-[#e10600] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-[#c00500] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {asking ? "Analysing\u2026" : "Ask"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-[#9ca3af] px-4 py-2 border border-[#1f2937] rounded-lg hover:bg-[#1f2937]"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Answer / Refusal */}
          <div className="min-h-[120px]">
            {asking && (
              <div className="px-6 pb-6 max-w-3xl">
                <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-[#1f2937] rounded w-1/3 mb-4" />
                  <div className="space-y-2.5">
                    <div className="h-3 bg-[#1f2937] rounded w-full" />
                    <div className="h-3 bg-[#1f2937] rounded w-5/6" />
                    <div className="h-3 bg-[#1f2937] rounded w-4/6" />
                    <div className="h-3 bg-[#1f2937] rounded w-3/6" />
                  </div>
                </div>
              </div>
            )}

            {result && !asking && (
              <div ref={resultRef} className="px-6 pb-6 max-w-3xl space-y-3">
                {!isGreen && result.diagnostics.spellcheck && (
                  <SpellcheckNotice spellcheck={result.diagnostics.spellcheck} />
                )}

                {isGreen && result.answer ? (
                  <AnswerPanel
                    answer={result.answer}
                    citations={result.citations ?? []}
                    reasonFooter={result.diagnostics.reasons[0]}
                    spellcheck={result.diagnostics.spellcheck}
                  />
                ) : (
                  <RefusalPanel
                    traffic={result.traffic}
                    refusalReason={result.refusalReason}
                    diagnostics={result.diagnostics}
                    onSelectQuery={handleSelectQuery}
                    onRefine={handleSelectQuery}
                  />
                )}

                {isRed && (
                  <p className="text-xs text-[#6b7280] pt-2">
                    Try narrowing the question or selecting a different rulebook.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Audit trail */}
          <div className="px-6 pb-8 max-w-3xl border-t border-[#1f2937] pt-6 mt-2">
            <EventStrip orgId={orgId} />
          </div>
        </main>

        {/* ═══ Right Panel (Evidence) ═══ */}
        <aside className="w-80 shrink-0 bg-[#111827] border-l border-[#1f2937] overflow-y-auto">
          <div className="px-5 py-5 border-b border-[#1f2937]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              {rightPanelHeader}
            </p>
          </div>

          <div className="p-4 space-y-3">
            {asking && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-[#1f2937] rounded-xl p-4 animate-pulse">
                    <div className="h-3 bg-[#1f2937] rounded w-2/3 mb-3" />
                    <div className="h-2 bg-[#1f2937] rounded w-full mb-2" />
                    <div className="h-2 bg-[#1f2937] rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {showCitations && result.citations!.map((c) => (
              <CitationCard key={c.regulationObjectId} citation={c} orgId={orgId} />
            ))}

            {showCandidates && result.diagnostics.candidates.map((c) => (
              <CandidateCard key={c.regulationObjectId} candidate={c} maxScore={candidateMaxScore} orgId={orgId} />
            ))}

            {!asking && result && isGreen && (!result.citations || result.citations.length === 0) && (
              <p className="text-xs text-[#6b7280] py-8 text-center">
                No citations returned.
              </p>
            )}

            {!asking && result && !isGreen && result.diagnostics.candidates.length === 0 && (
              <p className="text-xs text-[#6b7280] py-8 text-center">
                No clauses retrieved for this query.
              </p>
            )}

            {!asking && !result && (
              <p className="text-xs text-[#6b7280] py-8 text-center">
                Citations will appear here after you ask a question.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
