"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role, SessionUser } from "@/lib/auth";

const API_ORIGIN =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL)
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "http://localhost:5000";

function resolveAvatarSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

function Avatar({ user }: { user: SessionUser }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const src = resolveAvatarSrc(user.avatarUrl);
  if (src) {
    return (
      <img
        src={src}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[var(--rd-line)]"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[var(--rd-primary)] flex items-center justify-center text-[var(--rd-ink-on-dark)] text-[11px] font-bold shrink-0">
      {initials}
    </div>
  );
}

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

const HomeIco    = () => <Ico><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Ico>;
const CheckIco   = () => <Ico><path d="M20 6L9 17l-5-5" /></Ico>;
const MoneyIco   = () => <Ico><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Ico>;
const RefreshIco = () => <Ico><path d="M1 4v6h6" /><path d="M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></Ico>;
const TruckIco   = () => <Ico><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Ico>;
const FileIco    = () => <Ico><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M11 13H8m8 4H8" /></Ico>;
const ChartIco   = () => <Ico><path d="M18 20V10M12 20V4M6 20v-6" /></Ico>;
const StarIco    = () => <Ico><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></Ico>;
const BookIco    = () => <Ico><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" /></Ico>;
const WrenchIco  = () => <Ico><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></Ico>;
const LogoutIco  = () => <Ico><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Ico>;
const PersonIco  = () => <Ico><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Ico>;

const NAV: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  admin: [
    { href: "/admin",              label: "Overview",        icon: <HomeIco /> },
    { href: "/admin/approvals",    label: "Approvals",       icon: <CheckIco /> },
    { href: "/admin/payouts",      label: "Payout Requests", icon: <MoneyIco /> },
    { href: "/admin/remittances",  label: "Remittances",     icon: <RefreshIco /> },
    { href: "/fleet",              label: "Vehicles",        icon: <TruckIco /> },
    { href: "/fleet/documents",    label: "Document Radar",  icon: <FileIco /> },
  ],
  fleet_operator: [
    { href: "/fleet",           label: "Vehicles",       icon: <TruckIco /> },
    { href: "/fleet/documents", label: "Document Radar", icon: <FileIco /> },
  ],
  investor: [
    { href: "/investor",              label: "Portfolio",     icon: <ChartIco /> },
    { href: "/investor/opportunities",label: "Opportunities", icon: <StarIco /> },
    { href: "/investor/ledger",       label: "Ledger",        icon: <BookIco /> },
  ],
  driver: [
    { href: "/driver",              label: "Home",        icon: <HomeIco /> },
    { href: "/driver/remittances",  label: "Remittances", icon: <RefreshIco /> },
    { href: "/driver/maintenance",  label: "Maintenance", icon: <WrenchIco /> },
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

  function navItemClass(href: string) {
    const active = pathname === href;
    const base = "flex items-center gap-3 py-2.5 text-sm transition-colors rounded-lg mx-2 px-3";
    const collapsedMd = collapsed ? "md:justify-center md:px-2 md:mx-1" : "";
    const state = active
      ? "bg-[#0E5A43]/10 text-[#0E5A43] font-medium"
      : "text-[var(--rd-ink-body)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)]";
    return [base, collapsedMd, state].join(" ");
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center gap-3 px-4 bg-[var(--rd-panel)] border-b border-[var(--rd-line)]">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1 rounded-md text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
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
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "flex flex-col bg-[var(--rd-panel)] border-r border-[var(--rd-line)]",
          "fixed inset-y-0 left-0 z-50 w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-200",
          "md:relative md:inset-auto md:z-auto md:translate-x-0 md:min-h-screen",
          collapsed ? "md:w-[4.5rem]" : "md:w-56",
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
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)] hover:bg-[var(--rd-surface)]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
            </svg>
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden rounded-lg text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={navItemClass(item.href)}
            >
              {item.icon}
              <span className={collapsed ? "md:hidden" : ""}>{item.label}</span>
            </Link>
          ))}

          {/* Divider + Profile */}
          <div className="mx-4 my-2 border-t border-[var(--rd-line)]" />
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? "Profile" : undefined}
            className={navItemClass("/profile")}
          >
            <PersonIco />
            <span className={collapsed ? "md:hidden" : ""}>Profile</span>
          </Link>
        </nav>

        {/* Footer: collapsed desktop — avatar + logout icon */}
        <div className={collapsed ? "hidden md:flex flex-col items-center gap-2 py-4 border-t border-[var(--rd-line)]" : "hidden"}>
          <Avatar user={user} />
          <button
            onClick={logout}
            title="Sign out"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--rd-ink-muted)] hover:text-[var(--rd-error)] hover:bg-[var(--rd-surface)]"
          >
            <LogoutIco />
          </button>
        </div>

        {/* Footer: expanded desktop + all mobile */}
        <div className={[
          "border-t border-[var(--rd-line)] px-4 py-4",
          collapsed ? "md:hidden" : "",
        ].join(" ")}>
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--rd-ink)] truncate">
                {user.firstName} {user.lastName}
              </p>
              <button
                onClick={logout}
                className="mt-0.5 text-xs text-[var(--rd-ink-muted)] hover:text-[var(--rd-error)] transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
