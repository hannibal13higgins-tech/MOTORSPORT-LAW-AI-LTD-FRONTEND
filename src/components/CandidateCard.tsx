'use client';

import Link from "next/link";

export interface DiagnosticCandidate {
  regulationObjectId: string;
  articleNumber: string;
  clausePath: string;
  title?: string;
  snippet: string;
  score: number;
}

export default function CandidateCard({ candidate }: { candidate: DiagnosticCandidate }) {
  const pct = Math.min(candidate.score * 20, 100); // score 5 = 100%

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1E3A5F] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold font-mono text-[#111827]">
          Art. {candidate.articleNumber}
          {candidate.clausePath && candidate.clausePath !== candidate.articleNumber
            ? ` / ${candidate.clausePath}`
            : ""}
        </p>
        <span className="shrink-0 text-xs text-[#6B7280] bg-[#FAFAFA] border border-[#E5E7EB] rounded px-2 py-0.5">
          {candidate.score} hit{candidate.score !== 1 ? "s" : ""}
        </span>
      </div>

      {candidate.title && (
        <p className="text-xs font-medium text-[#111827] mt-1">{candidate.title}</p>
      )}

      <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-3">{candidate.snippet}</p>

      {/* Relevance bar */}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1E3A5F] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <Link
          href={`/articles/${candidate.regulationObjectId}?clausePath=${encodeURIComponent(candidate.clausePath)}`}
          className="text-xs text-[#1E3A5F] font-medium hover:underline shrink-0"
        >
          Open clause &rarr;
        </Link>
      </div>
    </div>
  );
}
