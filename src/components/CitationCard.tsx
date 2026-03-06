'use client';

import Link from "next/link";

export interface Citation {
  regulationObjectId: string;
  regulationSetId: string;
  regulationSetName: string;
  regulationVersionId: string;
  versionLabel: string;
  effectiveDate: string;
  articleNumber: string;
  clausePath: string;
  title?: string;
}

export default function CitationCard({ citation, orgId }: { citation: Citation; orgId?: string }) {
  return (
    <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 hover:border-[#00a3ff] transition-all duration-150">
      <p className="text-sm font-semibold font-mono text-white">
        Article {citation.articleNumber}
      </p>

      {citation.clausePath && citation.clausePath !== citation.articleNumber && (
        <p className="text-xs font-mono text-[#9ca3af] mt-0.5">
          Clause {citation.clausePath}
        </p>
      )}

      {citation.title && (
        <p className="text-xs font-medium text-[#e5e7eb] mt-1.5">{citation.title}</p>
      )}

      <div className="mt-2 text-[11px] text-[#6b7280] flex flex-wrap gap-x-4 gap-y-0.5">
        <span>{citation.regulationSetName}</span>
        <span>{citation.versionLabel}</span>
        <span>Effective: {new Date(citation.effectiveDate).toLocaleDateString()}</span>
      </div>

      <div className="mt-3 pt-2 border-t border-[#1f2937]">
        <Link
          href={`/articles/${citation.regulationObjectId}?clausePath=${encodeURIComponent(citation.clausePath)}&versionLabel=${encodeURIComponent(citation.versionLabel)}&effectiveDate=${encodeURIComponent(citation.effectiveDate)}${orgId ? `&orgId=${orgId}` : ""}`}
          className="text-xs text-[#00a3ff] font-medium hover:underline"
        >
          Open clause &rarr;
        </Link>
      </div>
    </div>
  );
}
