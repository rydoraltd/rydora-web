import { ReactNode } from "react";

export function PageHeader({ title, description, action }: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--rd-ink)]">{title}</h1>
        {description ? <p className="text-sm text-[var(--rd-ink-muted)] mt-1">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
