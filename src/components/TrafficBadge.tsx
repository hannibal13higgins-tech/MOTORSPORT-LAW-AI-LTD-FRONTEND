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
    dot: "bg-emerald-500",
    bg: "bg-emerald-950/50",
    text: "text-emerald-400",
    border: "border-emerald-800",
    borderLeft: "border-l-emerald-500",
    label: "Grounded",
  },
  AMBER: {
    dot: "bg-amber-500",
    bg: "bg-amber-950/50",
    text: "text-amber-400",
    border: "border-amber-800",
    borderLeft: "border-l-amber-500",
    label: "Clarification needed",
  },
  RED: {
    dot: "bg-red-500",
    bg: "bg-red-950/50",
    text: "text-red-400",
    border: "border-red-800",
    borderLeft: "border-l-red-500",
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
