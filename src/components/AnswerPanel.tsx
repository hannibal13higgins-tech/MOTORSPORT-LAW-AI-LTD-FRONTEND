import SpellcheckNotice from "./SpellcheckNotice";
import { type Citation } from "./CitationCard";

interface SpellcheckResult {
  originalQuestion: string;
  correctedQuestion?: string;
  changed: boolean;
  confidence: number;
}

interface Props {
  answer: string;
  citations: Citation[];
  reasonFooter?: string;
  spellcheck?: SpellcheckResult;
}

export default function AnswerPanel({ answer, citations, reasonFooter, spellcheck }: Props) {
  const lead = citations[0];
  const count = citations.length;

  return (
    <div className="space-y-3">
      {spellcheck && <SpellcheckNotice spellcheck={spellcheck} />}

      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6">
        {/* Rulebook context */}
        {lead && (
          <div className="bg-[#0b0f14] border border-[#1f2937] rounded-lg p-3 mb-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <div>
              <span className="text-[#6b7280]">Rulebook: </span>
              <span className="font-medium text-[#e5e7eb]">{lead.regulationSetName}</span>
            </div>
            <div>
              <span className="text-[#6b7280]">Version: </span>
              <span className="font-medium text-[#e5e7eb]">{lead.versionLabel}</span>
            </div>
            <div>
              <span className="text-[#6b7280]">Effective: </span>
              <span className="font-medium text-[#e5e7eb]">
                {new Date(lead.effectiveDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Grounding line */}
        {lead && (
          <p className="text-xs text-[#6b7280] mb-5">
            Answer grounded in {count} cited clause{count !== 1 ? "s" : ""} from{" "}
            {lead.regulationSetName} &mdash; {lead.versionLabel}
          </p>
        )}

        {/* Answer text */}
        <div className="text-[15px] text-[#e5e7eb] leading-[1.75] whitespace-pre-wrap space-y-4">
          {answer}
        </div>

        {reasonFooter && (
          <p className="text-xs text-[#6b7280] mt-5 pt-3 border-t border-[#1f2937]">
            {reasonFooter}
          </p>
        )}
      </div>
    </div>
  );
}
