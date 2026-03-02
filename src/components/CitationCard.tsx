'use client';

import { useRouter } from "next/navigation";

export interface Citation {
  regulationObjectId: string;
  articleNumber: string;
  clausePath: string;
  title: string;
  regulationSet: string;
  versionLabel: string;
  effectiveDate: string;
}

export default function CitationCard({ citation }: { citation: Citation }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/articles/${citation.regulationObjectId}`)}
      className="w-full text-left bg-white border border-gray-200 rounded p-4 hover:border-gray-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {citation.articleNumber}
            {citation.clausePath ? ` — ${citation.clausePath}` : ""}
          </p>
          <p className="text-sm text-gray-700 mt-0.5">{citation.title}</p>
        </div>
        <span className="shrink-0 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-2 py-1">
          {citation.versionLabel}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-xs text-gray-500">
          <span className="font-medium">Regulation set:</span> {citation.regulationSet}
        </span>
        <span className="text-xs text-gray-500">
          <span className="font-medium">Effective:</span>{" "}
          {new Date(citation.effectiveDate).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}
