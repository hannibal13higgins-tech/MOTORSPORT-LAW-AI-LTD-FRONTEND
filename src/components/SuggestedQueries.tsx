interface Props {
  queries: string[];
  onSelect: (query: string) => void;
}

export default function SuggestedQueries({ queries, onSelect }: Props) {
  if (queries.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] mb-2">
        Try asking:
      </p>
      <div className="flex flex-wrap gap-2">
        {queries.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-sm text-[#1E3A5F] border border-[#1E3A5F] rounded-full px-4 py-1.5 hover:bg-[#1E3A5F] hover:text-white active:scale-[0.98] transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
