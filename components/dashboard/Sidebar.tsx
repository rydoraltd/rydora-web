"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/lib/auth";

const NAV: Record<string, { href: string; label: string }[]> = {
  admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/approvals", label: "Approvals" },
    { href: "/admin/payouts", label: "Payout Requests" },
    { href: "/admin/remittances", label: "Remittances" },
    { href: "/fleet", label: "Vehicles" },
    { href: "/fleet/documents", label: "Document Radar" },
  ],
  fleet_operator: [
    { href: "/fleet", label: "Vehicles" },
    { href: "/fleet/documents", label: "Document Radar" },
  ],
  investor: [
    { href: "/investor", label: "Portfolio" },
    { href: "/investor/opportunities", label: "Opportunities" },
    { href: "/investor/ledger", label: "Ledger" },
  ],
  driver: [
    { href: "/driver", label: "Home" },
    { href: "/driver/remittances", label: "Remittances" },
    { href: "/driver/maintenance", label: "Maintenance" },
  ],
};

function navForRole(role: Role) {
  if (role === "super_admin") return NAV.admin;
  return NAV[role] ?? [];
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  if (!user) return null;
  const items = navForRole(user.role);

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--rd-line)] bg-[var(--rd-panel)] min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-[var(--rd-line)]">
        <span className="font-semibold tracking-tight text-[var(--rd-ink)]">RYDORA</span>
        <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--rd-ink-muted)] mt-1">
          {user.role.replace("_", " ")}
        </span>
      </div>
      <nav className="flex-1 py-4">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-5 py-2.5 text-sm border-l-2 ${
                active
                  ? "border-[var(--rd-primary)] text-[var(--rd-ink)] font-medium bg-[var(--rd-surface)]"
                  : "border-transparent text-[var(--rd-ink-body)] hover:text-[var(--rd-ink)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-[var(--rd-line)]">
        <p className="text-sm font-medium text-[var(--rd-ink)]">{user.firstName} {user.lastName}</p>
        <button onClick={logout} className="mt-2 text-xs text-[var(--rd-ink-muted)] hover:text-[var(--rd-error)]">
          Sign out
        </button>
      </div>
    </aside>
  );
}
