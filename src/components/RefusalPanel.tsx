interface Props {
  refusalReason: string;
}

export default function RefusalPanel({ refusalReason }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">
        Question Outside Scope
      </p>
      <p className="text-sm text-amber-900">{refusalReason}</p>
    </div>
  );
}
