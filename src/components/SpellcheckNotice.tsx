interface SpellcheckResult {
  originalQuestion: string;
  correctedQuestion?: string;
  changed: boolean;
  confidence: number;
}

export default function SpellcheckNotice({ spellcheck }: { spellcheck: SpellcheckResult }) {
  if (!spellcheck.changed || !spellcheck.correctedQuestion) return null;

  return (
    <div className="bg-[#00a3ff]/10 border border-[#00a3ff]/30 rounded-lg px-4 py-2.5 text-sm text-[#e5e7eb]">
      Your question was corrected from &ldquo;
      <span className="line-through text-[#9ca3af]">{spellcheck.originalQuestion}</span>
      &rdquo; to &ldquo;
      <span className="font-medium text-white">{spellcheck.correctedQuestion}</span>
      &rdquo;
    </div>
  );
}
