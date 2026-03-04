type Traffic = "GREEN" | "AMBER" | "RED";

const CONFIG: Record<Traffic, { dot: string; bg: string; text: string; border: string; label: string }> = {
  GREEN: {
    dot: "bg-[#16A34A]",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    label: "Grounded",
  },
  AMBER: {
    dot: "bg-[#D97706]",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    label: "Needs clarification",
  },
  RED: {
    dot: "bg-[#DC2626]",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    label: "Unable to answer",
  },
};

export default function TrafficBadge({ traffic }: { traffic: Traffic }) {
  const c = CONFIG[traffic] ?? CONFIG.RED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
