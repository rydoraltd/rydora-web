import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

export function DataTable<T extends { _id?: string }>({ columns, rows, emptyText = "Nothing here yet" }: {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
}) {
  return (
    <div className="border border-[var(--rd-line)] bg-[var(--rd-panel)] overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--rd-line)]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 text-[11px] uppercase tracking-[0.12em] font-medium text-[var(--rd-ink-muted)] ${c.align === "right" ? "text-right" : "text-left"}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-[var(--rd-ink-muted)]">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row._id ?? i} className="border-b border-[var(--rd-line)] last:border-b-0 hover:bg-[var(--rd-surface)]">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 ${c.align === "right" ? "text-right tabular-nums" : ""}`}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
