interface Props {
  answer: string;
}

export default function AnswerPanel({ answer }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        AI Answer
      </p>
      <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
        {answer}
      </p>
    </div>
  );
}
