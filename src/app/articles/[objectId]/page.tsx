'use client';

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import Header from "@/components/Header";

interface RegulationObject {
  id: string;
  regulationSetId: string;
  regulationVersionId: string;
  articleNumber: string;
  clausePath: string;
  title: string;
  text: string;
  createdAt: string;
}

export default function ArticlePage() {
  const { objectId } = useParams<{ objectId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qClausePath = searchParams.get("clausePath");
  const qVersionLabel = searchParams.get("versionLabel");
  const qEffectiveDate = searchParams.get("effectiveDate");
  const qOrgId = searchParams.get("orgId");
  const [article, setArticle] = useState<RegulationObject | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch(
          `/regulation-objects/${objectId}`
        ) as RegulationObject | null;

        if (data === null) {
          setNotFound(true);
        } else {
          setArticle(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [objectId]);

  useEffect(() => {
    if (article && qClausePath && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [article, qClausePath]);

  function handleCopyCitation() {
    if (!article) return;
    const text = `Art. ${article.articleNumber} / ${article.clausePath}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleBack() {
    if (qOrgId) {
      router.push(`/orgs/${qOrgId}/console`);
    } else {
      router.push("/dashboard");
    }
  }

  const crumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];
  if (qOrgId) {
    crumbs.push({ label: "Team", href: `/orgs/${qOrgId}` });
    crumbs.push({ label: "Console", href: `/orgs/${qOrgId}/console` });
  }
  crumbs.push({
    label: article ? `Article ${article.articleNumber}` : "Article",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <p className="text-sm text-[#9ca3af]">Loading&hellip;</p>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0b0f14]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">Not Found</p>
            <p className="text-sm text-[#9ca3af] mt-1">
              This regulation article does not exist.
            </p>
            <button
              onClick={handleBack}
              className="text-sm text-[#00a3ff] hover:underline mt-4 inline-block"
            >
              Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f14]">
        <Header />
        <main className="flex items-center justify-center py-20">
          <p className="text-sm text-red-400">{error}</p>
        </main>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      <Header />

      {/* Sub-header with breadcrumbs */}
      <div className="bg-[#111827] border-b border-[#1f2937] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-sm text-[#9ca3af] hover:text-white"
          >
            &larr; Back
          </button>
          <Breadcrumbs crumbs={crumbs} />
        </div>
        <button
          onClick={handleCopyCitation}
          className="text-sm text-[#00a3ff] border border-[#1f2937] rounded-lg px-3 py-1 hover:bg-[#1f2937]"
        >
          {copied ? "Copied" : "Copy citation"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Metadata bar */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 mb-8 flex flex-wrap gap-x-6 gap-y-2">
          <div>
            <p className="text-xs text-[#6b7280]">Article</p>
            <p className="text-sm font-semibold font-mono text-white">
              {article.articleNumber}
            </p>
          </div>
          {(qClausePath || article.clausePath) && (
            <div>
              <p className="text-xs text-[#6b7280]">Clause Path</p>
              <p className="text-sm font-semibold font-mono text-white">
                {qClausePath || article.clausePath}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-[#6b7280]">Version</p>
            <p className="text-sm font-medium text-white">
              {qVersionLabel || article.regulationVersionId}
            </p>
          </div>
          {qEffectiveDate && (
            <div>
              <p className="text-xs text-[#6b7280]">Effective</p>
              <p className="text-sm font-medium text-white">
                {new Date(qEffectiveDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
          {article.title && (
            <h1 className="text-lg font-semibold text-white mb-4">
              {article.title}
            </h1>
          )}

          {qClausePath && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#00a3ff] mb-3">
              Cited clause
            </p>
          )}

          <div className="text-[15px] text-[#e5e7eb] leading-[1.75] whitespace-pre-wrap">
            {qClausePath ? (
              article.text.split("\n").map((line, i) => {
                const isMatch = line.includes(qClausePath);
                return isMatch ? (
                  <span
                    key={i}
                    ref={highlightRef}
                    className="bg-[#00a3ff]/10 border-l-4 border-[#00a3ff] pl-3 -ml-3 block"
                  >
                    {line}
                    {"\n"}
                  </span>
                ) : (
                  <span key={i}>{line}{"\n"}</span>
                );
              })
            ) : (
              article.text
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
