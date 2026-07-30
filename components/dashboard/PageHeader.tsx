import { ReactNode } from "react";

export function PageHeader({ title, description, action }: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--rd-ink)]">{title}</h1>
        {description ? <p className="text-sm text-[var(--rd-ink-muted)] mt-1">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
