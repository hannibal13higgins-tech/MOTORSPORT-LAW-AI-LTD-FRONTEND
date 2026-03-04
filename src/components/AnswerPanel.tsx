import TrafficBadge from "./TrafficBadge";
import SpellcheckNotice from "./SpellcheckNotice";

interface SpellcheckResult {
  originalQuestion: string;
  correctedQuestion?: string;
  changed: boolean;
  confidence: number;
}

interface Props {
  answer: string;
  reasonFooter?: string;
  spellcheck?: SpellcheckResult;
}

export default function AnswerPanel({ answer, reasonFooter, spellcheck }: Props) {
  return (
    <div className="space-y-3">
      {spellcheck && <SpellcheckNotice spellcheck={spellcheck} />}

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Regulatory Analysis
          </p>
          <TrafficBadge traffic="GREEN" />
        </div>

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
