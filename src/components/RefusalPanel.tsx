import SpellcheckNotice from "./SpellcheckNotice";
import SuggestedQueries from "./SuggestedQueries";

interface SpellcheckResult {
  originalQuestion: string;
  correctedQuestion?: string;
  changed: boolean;
  confidence: number;
}

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
  spellcheck?: SpellcheckResult;
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
  const hasRefineTarget = diagnostics.suggestedQueries.length > 0 || (diagnostics.didYouMean && diagnostics.didYouMean.length > 0);

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4">
      {/* 1. Reason line */}
      {diagnostics.reasons.length > 0 ? (
        <p className="text-sm text-[#e5e7eb]">
          {diagnostics.reasons[0]}
        </p>
      ) : isAmber ? (
        <p className="text-sm text-[#e5e7eb]">
          Relevant clauses were located. Clarification is required before an answer can be provided.
        </p>
      ) : null}

      {/* Spellcheck */}
      {diagnostics.spellcheck && (
        <SpellcheckNotice spellcheck={diagnostics.spellcheck} />
      )}

      {/* 2. Refine question button */}
      {isAmber && hasRefineTarget && onRefine && (
        <button
          onClick={() => onRefine(
            diagnostics.suggestedQueries[0]
              ?? diagnostics.didYouMean?.[0]?.query
              ?? ""
          )}
          className="text-sm font-medium text-[#00a3ff] border border-[#00a3ff] rounded-lg px-4 py-2 hover:bg-[#00a3ff] hover:text-white"
        >
          Refine question
        </button>
      )}

      {/* Did You Mean */}
      {diagnostics.didYouMean && diagnostics.didYouMean.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-2">
            Did you mean:
          </p>
          <div className="flex flex-wrap gap-2">
            {diagnostics.didYouMean.map((d, i) => (
              <button
                key={i}
                onClick={() => onSelectQuery(d.query)}
                className="text-sm text-[#00a3ff] border border-[#00a3ff] rounded-full px-4 py-1.5 hover:bg-[#00a3ff] hover:text-white"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Suggested Queries */}
      {isAmber && (
        <SuggestedQueries
          queries={diagnostics.suggestedQueries}
          onSelect={onSelectQuery}
        />
      )}

      {traffic === "RED" && diagnostics.suggestedQueries.length > 0 && (
        <SuggestedQueries
          queries={diagnostics.suggestedQueries}
          onSelect={onSelectQuery}
        />
      )}

      {/* 4. Clarifying questions */}
      {isAmber && diagnostics.ambiguities.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-2">
            Clarifying questions:
          </p>
          <ul className="space-y-1.5">
            {diagnostics.ambiguities.map((a, i) => (
              <li key={i} className="text-sm text-[#e5e7eb] flex items-start gap-2">
                <span className="text-[#6b7280] mt-0.5">&#x2022;</span>
                <span>
                  {a.question}
                  {a.whyItMatters && (
                    <span className="text-[#9ca3af]"> &mdash; {a.whyItMatters}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
