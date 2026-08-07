import { ReactNode } from "react";
import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
  breadcrumb,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--rd-ink)]">{title}</h1>
        {description ? (
          <p className="text-sm text-[var(--rd-ink-muted)] mt-1">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-[var(--rd-ink-muted)]">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[var(--rd-ink)] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--rd-ink)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}
