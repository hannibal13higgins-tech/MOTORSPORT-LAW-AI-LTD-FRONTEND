export type Traffic = "GREEN" | "AMBER" | "RED";

export const TRAFFIC_CONFIG: Record<Traffic, {
  dot: string;
  bg: string;
  text: string;
  border: string;
  borderLeft: string;
  label: string;
}> = {
  GREEN: {
    dot: "bg-[#16A34A]",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    borderLeft: "border-l-[#16A34A]",
    label: "Grounded",
  },
  AMBER: {
    dot: "bg-[#D97706]",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    borderLeft: "border-l-[#D97706]",
    label: "Clarification needed",
  },
  RED: {
    dot: "bg-[#DC2626]",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    borderLeft: "border-l-[#DC2626]",
    label: "Not grounded",
  },
};

export default function TrafficBadge({ traffic, size = "sm" }: { traffic: Traffic; size?: "sm" | "lg" }) {
  const c = TRAFFIC_CONFIG[traffic] ?? TRAFFIC_CONFIG.RED;
  const isLg = size === "lg";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${c.bg} ${c.text} ${c.border} ${
        isLg ? "text-sm px-4 py-1.5" : "text-xs px-3 py-1"
      }`}
    >
      <span className={`rounded-full ${c.dot} ${isLg ? "w-2.5 h-2.5" : "w-2 h-2"}`} />
      {c.label}
    </span>
  );
}
