interface Props {
  queries: string[];
  onSelect: (query: string) => void;
}

export default function SuggestedQueries({ queries, onSelect }: Props) {
  if (queries.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-2">
        Try asking:
      </p>
      <div className="flex flex-wrap gap-2">
        {queries.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="text-sm text-[#00a3ff] border border-[#00a3ff] rounded-full px-4 py-1.5 hover:bg-[#00a3ff] hover:text-white"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
