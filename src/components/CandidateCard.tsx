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

interface Props {
  candidate: DiagnosticCandidate;
  maxScore: number;
  orgId?: string;
}

export default function CandidateCard({ candidate, maxScore, orgId }: Props) {
  const pct = maxScore > 0 ? Math.round((candidate.score / maxScore) * 100) : 0;

  return (
    <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 hover:border-[#00a3ff] transition-all duration-150">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold font-mono text-white">
          Art. {candidate.articleNumber}
          {candidate.clausePath && candidate.clausePath !== candidate.articleNumber
            ? ` / ${candidate.clausePath}`
            : ""}
        </p>
      </div>

      {candidate.title && (
        <p className="text-xs font-medium text-[#e5e7eb] mt-1">{candidate.title}</p>
      )}

      <p className="text-xs text-[#9ca3af] mt-1.5 line-clamp-3">{candidate.snippet}</p>

      <div className="mt-2.5 flex items-center gap-2">
        <div
          className="flex-1 h-1 bg-[#1f2937] rounded-full overflow-hidden"
          title="Relative match to the question within retrieved clauses."
        >
          <div
            className="h-full bg-[#00a3ff] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <Link
          href={`/articles/${candidate.regulationObjectId}?clausePath=${encodeURIComponent(candidate.clausePath)}${orgId ? `&orgId=${orgId}` : ""}`}
          className="text-xs text-[#00a3ff] font-medium hover:underline shrink-0"
        >
          Open clause &rarr;
        </Link>
      </div>
    </div>
  );
}
