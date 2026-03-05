import TrafficBadge from "./TrafficBadge";
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

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        {/* Traffic badge */}
        <div className="flex items-center gap-3 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Regulatory Analysis
          </p>
          <TrafficBadge traffic="GREEN" />
        </div>

        {/* Rulebook context */}
        {lead && (
          <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded p-3 mb-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <div>
              <span className="text-[#6B7280]">Rulebook: </span>
              <span className="font-medium text-[#111827]">{lead.regulationSetName}</span>
            </div>
            <div>
              <span className="text-[#6B7280]">Version: </span>
              <span className="font-medium text-[#111827]">{lead.versionLabel}</span>
            </div>
            <div>
              <span className="text-[#6B7280]">Effective: </span>
              <span className="font-medium text-[#111827]">
                {new Date(lead.effectiveDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Grounding line */}
        {lead && (
          <p className="text-xs text-[#6B7280] mb-4">
            Answer grounded in {count} cited clause{count !== 1 ? "s" : ""} from{" "}
            {lead.regulationSetName} &mdash; {lead.versionLabel}
          </p>
        )}

        {/* Answer text */}
        <div className="text-[15px] text-[#111827] leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>

        {reasonFooter && (
          <p className="text-xs text-[#6B7280] mt-4 pt-3 border-t border-[#E5E7EB]">
            {reasonFooter}
          </p>
        )}
      </div>
    </div>
  );
}
