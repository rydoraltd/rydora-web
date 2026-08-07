import { titleCase } from "@/lib/format";

type BadgeStyle = { color: string; bg: string };

const STYLES: Record<string, BadgeStyle> = {
  active:      { color: "#1A8F94", bg: "rgba(63,196,201,0.10)" },   /* Electric Teal — live */
  listed:      { color: "#1A8F94", bg: "rgba(63,196,201,0.10)" },   /* on platform, available */
  assigned:    { color: "#1E5FAF", bg: "rgba(30,95,175,0.09)" },    /* Royal Blue — allocated */
  approved:    { color: "#1D7A4F", bg: "rgba(29,122,79,0.09)" },
  funded:      { color: "#1D7A4F", bg: "rgba(29,122,79,0.09)" },
  completed:   { color: "#1D7A4F", bg: "rgba(29,122,79,0.09)" },
  reconciled:  { color: "#1D7A4F", bg: "rgba(29,122,79,0.09)" },
  pending:     { color: "#C77A1E", bg: "rgba(199,122,30,0.09)" },
  requested:   { color: "#C77A1E", bg: "rgba(199,122,30,0.09)" },
  received:    { color: "#C77A1E", bg: "rgba(199,122,30,0.09)" },
  submitted:   { color: "#C77A1E", bg: "rgba(199,122,30,0.09)" },
  in_progress: { color: "#C77A1E", bg: "rgba(199,122,30,0.09)" },
  maintenance: { color: "#C77A1E", bg: "rgba(199,122,30,0.09)" },
  suspended:   { color: "#B3403A", bg: "rgba(179,64,58,0.08)" },
  rejected:    { color: "#B3403A", bg: "rgba(179,64,58,0.08)" },
  flagged:     { color: "#B3403A", bg: "rgba(179,64,58,0.08)" },
  retired:     { color: "#7A8899", bg: "rgba(122,130,153,0.08)" },
  draft:       { color: "#7A8899", bg: "rgba(122,130,153,0.08)" },
};

const DEFAULT: BadgeStyle = { color: "#7A8899", bg: "rgba(122,130,153,0.08)" };

export function StatusBadge({ status }: { status: string }) {
  const { color, bg } = STYLES[status] ?? DEFAULT;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color, backgroundColor: bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} />
      {titleCase(status)}
    </span>
  );
}
