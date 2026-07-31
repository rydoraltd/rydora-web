"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/lib/auth";

function Ico({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

const HomeIco = () => <Ico><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Ico>;
const CheckIco = () => <Ico><path d="M20 6L9 17l-5-5" /></Ico>;
const MoneyIco = () => <Ico><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Ico>;
const RefreshIco = () => <Ico><path d="M1 4v6h6" /><path d="M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></Ico>;
const TruckIco = () => <Ico><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Ico>;
const FileIco = () => <Ico><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M11 13H8m8 4H8" /></Ico>;
const ChartIco = () => <Ico><path d="M18 20V10M12 20V4M6 20v-6" /></Ico>;
const StarIco = () => <Ico><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></Ico>;
const BookIco = () => <Ico><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" /></Ico>;
const WrenchIco = () => <Ico><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></Ico>;
const LogoutIco = () => <Ico><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Ico>;

const NAV: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  admin: [
    { href: "/admin", label: "Overview", icon: <HomeIco /> },
    { href: "/admin/approvals", label: "Approvals", icon: <CheckIco /> },
    { href: "/admin/payouts", label: "Payout Requests", icon: <MoneyIco /> },
    { href: "/admin/remittances", label: "Remittances", icon: <RefreshIco /> },
    { href: "/fleet", label: "Vehicles", icon: <TruckIco /> },
    { href: "/fleet/documents", label: "Document Radar", icon: <FileIco /> },
  ],
  fleet_operator: [
    { href: "/fleet", label: "Vehicles", icon: <TruckIco /> },
    { href: "/fleet/documents", label: "Document Radar", icon: <FileIco /> },
  ],
  investor: [
    { href: "/investor", label: "Portfolio", icon: <ChartIco /> },
    { href: "/investor/opportunities", label: "Opportunities", icon: <StarIco /> },
    { href: "/investor/ledger", label: "Ledger", icon: <BookIco /> },
  ],
  driver: [
    { href: "/driver", label: "Home", icon: <HomeIco /> },
    { href: "/driver/remittances", label: "Remittances", icon: <RefreshIco /> },
    { href: "/driver/maintenance", label: "Maintenance", icon: <WrenchIco /> },
  ],
};

function navForRole(role: Role) {
  if (role === "super_admin") return NAV.admin;
  return NAV[role] ?? [];
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;
  const items = navForRole(user.role);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center gap-3 px-4 bg-[var(--rd-panel)] border-b border-[var(--rd-line)]">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1 text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="font-semibold tracking-tight text-sm text-[var(--rd-ink)]">RYDORA</span>
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "flex flex-col bg-[var(--rd-panel)] border-r border-[var(--rd-line)]",
          // Mobile: fixed overlay
          "fixed inset-y-0 left-0 z-50 w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-200",
          // Desktop: in-flow, collapsible width
          "md:relative md:inset-auto md:z-auto md:translate-x-0 md:min-h-screen",
          collapsed ? "md:w-16" : "md:w-56",
          "md:transition-[width] md:duration-200",
        ].join(" ")}
      >
        {/* Header */}
        <div className={[
          "py-5 border-b border-[var(--rd-line)] flex items-center",
          collapsed ? "px-5 justify-between md:justify-center md:px-3" : "px-5 justify-between",
        ].join(" ")}>
          <div className={collapsed ? "md:hidden" : ""}>
            <span className="font-semibold tracking-tight text-sm text-[var(--rd-ink)]">RYDORA</span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--rd-ink-muted)] mt-0.5">
              {user.role.replace(/_/g, " ")}
            </span>
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
            </svg>
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={[
                  "flex items-center gap-3 py-2.5 text-sm transition-colors border-l-2",
                  collapsed ? "px-5 md:justify-center md:px-0 md:border-l-0" : "px-5",
                  active
                    ? "border-[var(--rd-primary)] text-[var(--rd-ink)] font-medium bg-[var(--rd-surface)]"
                    : "border-transparent text-[var(--rd-ink-body)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)]/60",
                ].join(" ")}
              >
                {item.icon}
                <span className={collapsed ? "md:hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--rd-line)]">
          {/* Collapsed desktop: icon logout only */}
          <div className={collapsed ? "hidden md:flex justify-center py-4" : "hidden"}>
            <button
              onClick={logout}
              title="Sign out"
              className="flex items-center justify-center w-8 h-8 rounded text-[var(--rd-ink-muted)] hover:text-[var(--rd-error)] hover:bg-[var(--rd-surface)]"
            >
              <LogoutIco />
            </button>
          </div>

          {/* Full footer */}
          <div className={collapsed ? "px-5 py-4 md:hidden" : "px-5 py-4"}>
            <p className="text-sm font-medium text-[var(--rd-ink)] truncate">
              {user.firstName} {user.lastName}
            </p>
            <button
              onClick={logout}
              className="mt-1.5 text-xs text-[var(--rd-ink-muted)] hover:text-[var(--rd-error)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
