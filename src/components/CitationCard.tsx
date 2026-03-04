'use client';

import Link from "next/link";

export interface Citation {
  regulationObjectId: string;
  articleNumber: string;
  clausePath: string;
  regulationSetName: string;
  regulationVersionLabel: string;
  effectiveDate: string;
}

export default function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1E3A5F] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold font-mono text-[#111827]">
          Art. {citation.articleNumber}
          {citation.clausePath && citation.clausePath !== citation.articleNumber
            ? ` / ${citation.clausePath}`
            : ""}
        </p>
        <span className="shrink-0 text-xs text-[#6B7280] bg-[#FAFAFA] border border-[#E5E7EB] rounded px-2 py-0.5 font-mono">
          {citation.regulationVersionLabel}
        </span>
      </div>

      <p className="text-xs text-[#6B7280] mt-1.5">{citation.regulationSetName}</p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-[#6B7280]">
          Effective: {new Date(citation.effectiveDate).toLocaleDateString()}
        </span>
        <Link
          href={`/articles/${citation.regulationObjectId}`}
          className="text-xs text-[#1E3A5F] font-medium hover:underline"
        >
          Open clause &rarr;
        </Link>
      </div>
    </div>
  );
}
