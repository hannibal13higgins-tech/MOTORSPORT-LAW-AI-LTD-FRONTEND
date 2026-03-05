import TrafficBadge from "./TrafficBadge";
import SuggestedQueries from "./SuggestedQueries";

interface Ambiguity {
  question: string;
  whyItMatters: string;
}

interface DidYouMean {
  label: string;
  query: string;
  basisObjectIds: string[];
}

interface Diagnostics {
  reasons: string[];
  didYouMean?: DidYouMean[];
  ambiguities: Ambiguity[];
  suggestedQueries: string[];
}

interface Props {
  traffic: "GREEN" | "AMBER" | "RED";
  refusalReason?: string;
  diagnostics: Diagnostics;
  onSelectQuery: (query: string) => void;
  onRefine?: (query: string) => void;
}

export default function RefusalPanel({ traffic, diagnostics, onSelectQuery, onRefine }: Props) {
  const isAmber = traffic === "AMBER";

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-4">
      <TrafficBadge traffic={traffic} />

      {/* Reasons */}
      {diagnostics.reasons.length > 0 && (
        <ul className="space-y-1">
          {diagnostics.reasons.map((r, i) => (
            <li key={i} className="text-sm text-[#111827] flex items-start gap-2">
              <span className="text-[#6B7280] mt-0.5">&#x2022;</span>
              {r}
            </li>
          ))}
        </ul>
      )}

      {/* Refine question button — AMBER only, when suggestedQueries exist */}
      {isAmber && diagnostics.suggestedQueries.length > 0 && onRefine && (
        <button
          onClick={() => onRefine(diagnostics.suggestedQueries[0])}
          className="text-sm font-medium text-[#1E3A5F] border border-[#1E3A5F] rounded px-4 py-2 hover:bg-[#1E3A5F] hover:text-white transition-colors"
        >
          Refine question
        </button>
      )}

      {/* Did You Mean */}
      {diagnostics.didYouMean && diagnostics.didYouMean.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-2">
            Did you mean:
          </p>
          <div className="flex flex-wrap gap-2">
            {diagnostics.didYouMean.map((d, i) => (
              <button
                key={i}
                onClick={() => onSelectQuery(d.query)}
                className="text-sm text-[#1E3A5F] border border-[#1E3A5F] rounded-full px-4 py-1.5 hover:bg-[#1E3A5F] hover:text-white transition-colors"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Queries — AMBER only */}
      {isAmber && (
        <SuggestedQueries
          queries={diagnostics.suggestedQueries}
          onSelect={onSelectQuery}
        />
      )}

      {/* Ambiguities — AMBER only */}
      {isAmber && diagnostics.ambiguities.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-2">
            Things to consider:
          </p>
          <div className="space-y-2">
            {diagnostics.ambiguities.map((a, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#E5E7EB] rounded p-3">
                <p className="text-sm font-medium text-[#111827]">{a.question}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{a.whyItMatters}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
