export function StatCard({ label, value, hint, tone = "default" }: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "accent" | "inverse";
}) {
  const base = "border border-[var(--rd-line)] p-5 flex flex-col gap-1 rounded-xl shadow-[var(--rd-shadow-sm)]";
  const tones = {
    default: "bg-[var(--rd-panel)]",
    accent: "bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] border-transparent",
    inverse: "bg-[var(--rd-inverse)] text-[var(--rd-ink-on-dark)] border-transparent",
  };
  return (
    <div className={`${base} ${tones[tone]}`}>
      <span className={`text-[11px] uppercase tracking-[0.14em] ${tone === "default" ? "text-[var(--rd-ink-muted)]" : "opacity-70"}`}>
        {label}
      </span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      {hint ? <span className={`text-xs ${tone === "default" ? "text-[var(--rd-ink-muted)]" : "opacity-70"}`}>{hint}</span> : null}
    </div>
  );
}
