"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface Notification {
  _id: string;
  title: string;
  body: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_STYLES: Record<string, string> = {
  info:    "bg-blue-100 text-blue-600",
  warning: "bg-amber-100 text-amber-600",
  success: "bg-emerald-100 text-emerald-600",
  alert:   "bg-red-100 text-red-600",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  success: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  alert: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
};

export default function DriverNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    api<Notification[]>("/driver/notifications")
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function markAllRead() {
    await api("/driver/notifications/read-all", { method: "POST" }).catch(() => null);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function markRead(id: string) {
    await api(`/driver/notifications/${id}/read`, { method: "POST" }).catch(() => null);
    setItems((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
  }

  const filtered = filter === "unread" ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Updates, alerts and messages from Rydora operations."
        breadcrumb={[{ label: "Home", href: "/driver" }, { label: "Notifications" }]}
        action={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-[var(--rd-line)] text-[var(--rd-ink-body)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] transition-colors"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={["px-4 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize",
              filter === f
                ? "bg-[var(--rd-primary)] text-white"
                : "bg-[var(--rd-panel)] border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"].join(" ")}
          >
            {f === "unread" ? `Unread (${unreadCount})` : "All"}
          </button>
        ))}
      </div>

      <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] rounded-xl shadow-[var(--rd-shadow-sm)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-[var(--rd-ink-muted)]">{filter === "unread" ? "No unread notifications." : "No notifications yet."}</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--rd-line)]">
            {filtered.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                className={["flex items-start gap-4 px-5 py-4 transition-colors cursor-default",
                  !n.read ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-[var(--rd-surface)]"].join(" ")}
              >
                <div className={["w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  TYPE_STYLES[n.type] ?? TYPE_STYLES.info].join(" ")}>
                  {TYPE_ICONS[n.type] ?? TYPE_ICONS.info}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.read ? "text-[var(--rd-ink)]" : "text-[var(--rd-ink-body)]"}`}>{n.title}</p>
                    <span className="text-[11px] text-[var(--rd-ink-muted)] shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[var(--rd-ink-muted)] mt-0.5 leading-relaxed">{n.body}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--rd-primary)] shrink-0 mt-2" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
