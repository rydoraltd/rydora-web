import { titleCase } from "@/lib/format";

const MAP: Record<string, string> = {
  active: "var(--rd-success)",
  approved: "var(--rd-success)",
  reconciled: "var(--rd-success)",
  completed: "var(--rd-success)",
  funded: "var(--rd-success)",
  listed: "var(--rd-primary)",
  pending: "var(--rd-warning)",
  requested: "var(--rd-warning)",
  received: "var(--rd-warning)",
  submitted: "var(--rd-warning)",
  in_progress: "var(--rd-warning)",
  maintenance: "var(--rd-warning)",
  suspended: "var(--rd-error)",
  rejected: "var(--rd-error)",
  flagged: "var(--rd-error)",
  retired: "var(--rd-ink-muted)",
  draft: "var(--rd-ink-muted)",
};

export function StatusBadge({ status }: { status: string }) {
  const color = MAP[status] || "var(--rd-ink-muted)";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {titleCase(status)}
    </span>
  );
}
