"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

function Guard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--rd-surface)">
        <span className="text-sm text-(--rd-ink-muted)">Loading</span>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-(--rd-surface)">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto px-4 py-6 pt-20 md:px-8 md:py-8 md:pt-8 rd-main">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Guard>{children}</Guard>;
}
