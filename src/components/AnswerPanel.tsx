interface Props {
  answer: string;
}

export default function AnswerPanel({ answer }: Props) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-3">
        Regulatory Analysis
      </p>
      <div className="text-[15px] text-[#111827] leading-relaxed whitespace-pre-wrap">
        {answer}
      </div>
    </div>
  );
}
