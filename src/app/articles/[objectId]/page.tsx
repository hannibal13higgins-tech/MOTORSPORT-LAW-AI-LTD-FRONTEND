'use client';

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm text-[#6B7280]">Loading…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#111827]">Not Found</p>
          <p className="text-sm text-[#6B7280] mt-1">
            This regulation article does not exist.
          </p>
          <button
            onClick={() => router.back()}
            className="text-sm text-[#1E3A5F] underline mt-4 inline-block"
          >
            Back to console
          </button>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!article) return null;

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-sm text-[#6B7280] hover:text-[#111827]"
        >
          &larr; Back to console
        </button>
        <button
          onClick={handleCopyCitation}
          className="text-sm text-[#1E3A5F] border border-[#E5E7EB] rounded px-3 py-1 hover:bg-[#FAFAFA]"
        >
          {copied ? "Copied" : "Copy citation"}
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Metadata bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-6 flex flex-wrap gap-x-6 gap-y-2">
          <div>
            <p className="text-xs text-[#6B7280]">Article</p>
            <p className="text-sm font-semibold font-mono text-[#111827]">
              {article.articleNumber}
            </p>
          </div>
          {(qClausePath || article.clausePath) && (
            <div>
              <p className="text-xs text-[#6B7280]">Clause Path</p>
              <p className="text-sm font-semibold font-mono text-[#111827]">
                {qClausePath || article.clausePath}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-[#6B7280]">Version</p>
            <p className="text-sm font-medium text-[#111827]">
              {qVersionLabel || article.regulationVersionId}
            </p>
          </div>
          {qEffectiveDate && (
            <div>
              <p className="text-xs text-[#6B7280]">Effective</p>
              <p className="text-sm font-medium text-[#111827]">
                {new Date(qEffectiveDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          {article.title && (
            <h1 className="text-lg font-semibold text-[#111827] mb-4">
              {article.title}
            </h1>
          )}

          {qClausePath && (
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1E3A5F] mb-3">
              Cited clause
            </p>
          )}

          <div className="text-[15px] text-[#111827] leading-relaxed whitespace-pre-wrap">
            {qClausePath ? (
              article.text.split("\n").map((line, i) => {
                const isMatch = line.includes(qClausePath);
                return isMatch ? (
                  <span
                    key={i}
                    ref={highlightRef}
                    className="bg-amber-100 border-l-4 border-amber-400 pl-3 -ml-3 block"
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
    </main>
  );
}
