"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-[var(--rd-line)]"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[var(--rd-primary)] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
      {initials}
    </div>
  );
}

function Ico({ children }: { children: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
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
const WrenchIco  = () => <Ico><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></Ico>;
const PersonIco  = () => <Ico><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Ico>;
const LogoutIco  = () => <Ico><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Ico>;
const GearIco    = () => <Ico><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Ico>;
const ShieldIco  = () => <Ico><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Ico>;
const ClockIco   = () => <Ico><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Ico>;
const WalletIco  = () => <Ico><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></Ico>;
const StarIco    = () => <Ico><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Ico>;
const BellIco    = () => <Ico><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Ico>;
const SupportIco = () => <Ico><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></Ico>;
const HistoryIco = () => <Ico><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></Ico>;
const CarIco     = () => <Ico><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></Ico>;
const ChevronIco = ({ open }: { open: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

type NavChild = { href: string; label: string };
type NavItem = {
  href?: string;
  label: string;
  icon: React.ReactNode;
  children?: NavChild[];
};
type NavGroup = { group: string; items: NavItem[] };

const NAV: Record<string, NavGroup[]> = {
  investor: [
    {
      group: "MAIN",
      items: [
        { href: "/investor", label: "Dashboards", icon: <HomeIco /> },
      ],
    },
    {
      group: "MY VEHICLES",
      items: [
        {
          label: "Manage Vehicles",
          icon: <TruckIco />,
          children: [
            { href: "/investor/vehicles/add", label: "Add Vehicle" },
            { href: "/investor/vehicles", label: "Vehicle List" },
          ],
        },
      ],
    },
    {
      group: "EARNINGS",
      items: [
        {
          label: "Earnings",
          icon: <MoneyIco />,
          children: [
            { href: "/investor/earnings", label: "Earnings" },
            { href: "/investor/ledger", label: "Earnings Statement" },
            { href: "/investor/wallet", label: "My Wallet" },
            { href: "/investor/withdraw", label: "Withdraw Funds" },
          ],
        },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        { href: "/investor/kyc", label: "KYC Verification", icon: <ShieldIco /> },
      ],
    },
    {
      group: "SUPPORT",
      items: [
        { href: "/investor/notifications", label: "Notifications", icon: <BellIco /> },
        { href: "/investor/support",       label: "Get Support",   icon: <SupportIco /> },
      ],
    },
    {
      group: "SETTINGS",
      items: [
        {
          label: "Settings",
          icon: <GearIco />,
          children: [
            { href: "/profile", label: "Account Details" },
          ],
        },
      ],
    },
  ],
  admin: [
    {
      group: "MAIN",
      items: [
        { href: "/admin", label: "Overview", icon: <HomeIco /> },
      ],
    },
    {
      group: "MANAGEMENT",
      items: [
        { href: "/admin/approvals",   label: "Approvals",       icon: <CheckIco /> },
        { href: "/admin/users",       label: "Users",           icon: <PersonIco /> },
        { href: "/admin/maintenance", label: "Maintenance",     icon: <WrenchIco /> },
        { href: "/admin/payouts",     label: "Payout Requests", icon: <MoneyIco /> },
        { href: "/admin/remittances", label: "Remittances",     icon: <RefreshIco /> },
      ],
    },
    {
      group: "FLEET",
      items: [
        { href: "/fleet",           label: "Vehicles",        icon: <TruckIco /> },
        { href: "/fleet/documents", label: "Document Radar",  icon: <FileIco /> },
      ],
    },
    {
      group: "DATA",
      items: [
        { href: "/admin/cookie-consents", label: "Cookie Consents", icon: <GearIco /> },
      ],
    },
    {
      group: "SETTINGS",
      items: [
        {
          label: "Settings",
          icon: <GearIco />,
          children: [
            { href: "/profile", label: "Account Details" },
          ],
        },
      ],
    },
  ],
  super_admin: [
    {
      group: "MAIN",
      items: [
        { href: "/admin", label: "Overview", icon: <HomeIco /> },
      ],
    },
    {
      group: "MANAGEMENT",
      items: [
        { href: "/admin/approvals",   label: "Approvals",       icon: <CheckIco /> },
        { href: "/admin/users",       label: "Users",           icon: <PersonIco /> },
        { href: "/admin/maintenance", label: "Maintenance",     icon: <WrenchIco /> },
        { href: "/admin/payouts",     label: "Payout Requests", icon: <MoneyIco /> },
        { href: "/admin/remittances", label: "Remittances",     icon: <RefreshIco /> },
      ],
    },
    {
      group: "FLEET",
      items: [
        { href: "/fleet",           label: "Vehicles",        icon: <TruckIco /> },
        { href: "/fleet/documents", label: "Document Radar",  icon: <FileIco /> },
      ],
    },
    {
      group: "ADMIN ONLY",
      items: [
        { href: "/admin/admins",           label: "Admin Accounts",  icon: <ShieldIco /> },
        { href: "/admin/audit-trail",      label: "Audit Trail",     icon: <ClockIco /> },
        { href: "/admin/cookie-consents",  label: "Cookie Consents", icon: <GearIco /> },
      ],
    },
    {
      group: "SETTINGS",
      items: [
        {
          label: "Settings",
          icon: <GearIco />,
          children: [
            { href: "/profile", label: "Account Details" },
          ],
        },
      ],
    },
  ],
  fleet_operator: [
    {
      group: "MY FLEET",
      items: [
        { href: "/fleet",           label: "Vehicles",       icon: <TruckIco /> },
        { href: "/fleet/documents", label: "Document Radar", icon: <FileIco /> },
      ],
    },
    {
      group: "SETTINGS",
      items: [
        {
          label: "Settings",
          icon: <GearIco />,
          children: [
            { href: "/profile", label: "Account Details" },
          ],
        },
      ],
    },
  ],
  driver: [
    {
      group: "MAIN",
      items: [
        { href: "/driver", label: "Dashboard", icon: <HomeIco /> },
      ],
    },
    {
      group: "EARNINGS",
      items: [
        { href: "/driver/wallet",      label: "My Wallet",   icon: <WalletIco /> },
        { href: "/driver/remittances", label: "Remittances", icon: <RefreshIco /> },
        { href: "/driver/payments",    label: "Payments",    icon: <MoneyIco /> },
      ],
    },
    {
      group: "VEHICLE",
      items: [
        { href: "/driver/assignment",  label: "My Assignment", icon: <CarIco /> },
        { href: "/driver/maintenance", label: "Maintenance",   icon: <WrenchIco /> },
        { href: "/driver/history",     label: "Trip History",  icon: <HistoryIco /> },
      ],
    },
    {
      group: "DOCUMENTS",
      items: [
        { href: "/driver/kyc",       label: "Registration",  icon: <ShieldIco /> },
        { href: "/driver/documents", label: "My Documents",  icon: <FileIco /> },
      ],
    },
    {
      group: "PERFORMANCE",
      items: [
        { href: "/driver/rating",  label: "My Rating", icon: <StarIco /> },
        { href: "/driver/reports", label: "Reports",   icon: <ChartIco /> },
      ],
    },
    {
      group: "SUPPORT",
      items: [
        { href: "/driver/notifications", label: "Notifications", icon: <BellIco /> },
        { href: "/driver/support",       label: "Get Support",   icon: <SupportIco /> },
      ],
    },
    {
      group: "SETTINGS",
      items: [
        {
          label: "Settings",
          icon: <GearIco />,
          children: [
            { href: "/profile", label: "Account Details" },
          ],
        },
      ],
    },
  ],
};

function navGroupsForRole(role: Role): NavGroup[] {
  return NAV[role as keyof typeof NAV] ?? NAV.admin ?? [];
}

function ExpandableItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const childActive = item.children?.some((c) => pathname === c.href) ?? false;
  const [open, setOpen] = useState(childActive);

  if (!item.children) {
    const active = pathname === item.href;
    return (
      <Link
        href={item.href!}
        onClick={onNavigate}
        className={[
          "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm transition-colors",
          active
            ? "bg-[var(--rd-primary)] text-white font-medium"
            : "text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] hover:text-[var(--rd-ink)]",
        ].join(" ")}
      >
        <span className={active ? "text-white" : "text-[var(--rd-ink-muted)]"}>{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm transition-colors",
          "text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] hover:text-[var(--rd-ink)]",
          childActive ? "text-[var(--rd-primary)]" : "",
          "pr-5",
        ].join(" ")}
        style={{ width: "calc(100% - 1rem)" }}
      >
        <span className={childActive ? "text-[var(--rd-primary)]" : "text-[var(--rd-ink-muted)]"}>
          {item.icon}
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronIco open={open} />
      </button>

      {open && (
        <div className="ml-6 mt-0.5 mb-1 border-l border-[var(--rd-line)] pl-3">
          {item.children.map((child) => {
            const active = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={[
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors my-0.5",
                  active
                    ? "bg-[var(--rd-primary)] text-white font-medium"
                    : "text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] hover:text-[var(--rd-ink)]",
                ].join(" ")}
              >
                <span className={[
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  active ? "bg-white" : "bg-[var(--rd-ink-muted)]",
                ].join(" ")} />
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;
  const groups = navGroupsForRole(user.role);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center gap-3 px-4 bg-[var(--rd-panel)] border-b border-[var(--rd-line)]">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-md text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <Image src="/images/Logo origin.png" alt="Rydora" height={28} width={28} className="object-contain" />
        <span className="text-sm font-semibold text-[var(--rd-ink)]">Rydora</span>
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar panel */}
      <aside className={[
        "flex flex-col bg-[var(--rd-panel)] border-r border-[var(--rd-line)]",
        "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:inset-auto md:z-auto md:translate-x-0 md:h-full md:w-56",
      ].join(" ")}>

        {/* Logo header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--rd-line)]">
          <div className="flex items-center gap-2.5">
            <Image src="/images/Logo origin.png" alt="Rydora" height={30} width={30} className="object-contain" />
            <div>
              <span className="block text-sm font-semibold text-[var(--rd-ink)] leading-tight">Rydora</span>
              <span className="block text-[10px] uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">
                {user.role.replace(/_/g, " ")}
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden rounded-lg p-1 text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.group} className="mb-1">
              <p className="px-5 pt-3 pb-1.5 text-[10px] font-semibold tracking-[0.12em] text-[var(--rd-ink-muted)] uppercase">
                {group.group}
              </p>
              {group.items.map((item) => (
                <ExpandableItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          ))}

          {/* Profile link */}
          <div className="mx-4 my-2 border-t border-[var(--rd-line)]" />
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={[
              "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm transition-colors",
              pathname === "/profile"
                ? "bg-[var(--rd-primary)] text-white font-medium"
                : "text-[var(--rd-ink-body)] hover:bg-[var(--rd-surface)] hover:text-[var(--rd-ink)]",
            ].join(" ")}
          >
            <span className={pathname === "/profile" ? "text-white" : "text-[var(--rd-ink-muted)]"}>
              <PersonIco />
            </span>
            Profile
          </Link>
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--rd-line)] px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--rd-ink)] truncate">
                {user.firstName} {user.lastName}
              </p>
              <button
                onClick={logout}
                className="mt-0.5 flex items-center gap-1 text-xs text-[var(--rd-ink-muted)] hover:text-[var(--rd-error)] transition-colors"
              >
                <LogoutIco />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
