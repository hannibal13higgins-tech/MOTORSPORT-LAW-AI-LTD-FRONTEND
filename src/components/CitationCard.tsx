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
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1E3A5F] hover:shadow-sm transition-all duration-150">
      <p className="text-sm font-semibold font-mono text-[#111827]">
        Article {citation.articleNumber}
      </p>

      {citation.clausePath && citation.clausePath !== citation.articleNumber && (
        <p className="text-xs font-mono text-[#6B7280] mt-0.5">
          Clause {citation.clausePath}
        </p>
      )}

      {citation.title && (
        <p className="text-xs font-medium text-[#111827] mt-1.5">{citation.title}</p>
      )}

      <div className="mt-2 text-[11px] text-[#6B7280] flex flex-wrap gap-x-4 gap-y-0.5">
        <span>{citation.regulationSetName}</span>
        <span>{citation.versionLabel}</span>
        <span>Effective: {new Date(citation.effectiveDate).toLocaleDateString()}</span>
      </div>

      <div className="mt-3 pt-2 border-t border-[#E5E7EB]">
        <Link
          href={`/articles/${citation.regulationObjectId}?clausePath=${encodeURIComponent(citation.clausePath)}&versionLabel=${encodeURIComponent(citation.versionLabel)}&effectiveDate=${encodeURIComponent(citation.effectiveDate)}${orgId ? `&orgId=${orgId}` : ""}`}
          className="text-xs text-[#1E3A5F] font-medium hover:underline"
        >
          Open clause &rarr;
        </Link>
      </div>
    </div>
  );
}
