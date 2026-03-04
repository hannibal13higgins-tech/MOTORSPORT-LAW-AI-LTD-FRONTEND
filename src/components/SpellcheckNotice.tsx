interface SpellcheckResult {
  originalQuestion: string;
  correctedQuestion?: string;
  changed: boolean;
  confidence: number;
}

export default function SpellcheckNotice({ spellcheck }: { spellcheck: SpellcheckResult }) {
  if (!spellcheck.changed || !spellcheck.correctedQuestion) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded px-4 py-2.5 text-sm text-blue-800">
      Your question was corrected from &ldquo;
      <span className="line-through text-blue-600">{spellcheck.originalQuestion}</span>
      &rdquo; to &ldquo;
      <span className="font-medium">{spellcheck.correctedQuestion}</span>
      &rdquo;
    </div>
  );
}
