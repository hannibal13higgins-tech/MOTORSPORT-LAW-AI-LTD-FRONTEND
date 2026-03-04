const REFUSAL_LABELS: Record<string, string> = {
  INSUFFICIENT_CITATIONS: "No matching regulation clauses found",
};

interface Props {
  refusalReason: string;
}

export default function RefusalPanel({ refusalReason }: Props) {
  const label = REFUSAL_LABELS[refusalReason] ?? refusalReason;

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-lg p-5">
      <p className="text-sm font-semibold text-amber-800 mb-1">Unable to answer</p>
      <p className="text-sm text-amber-700">{label}</p>
      <p className="text-xs text-amber-600 mt-3">
        Only questions answerable from the selected regulation set with cited clauses
        are permitted. Try rephrasing your question or selecting a different rulebook.
      </p>
    </div>
  );
}
