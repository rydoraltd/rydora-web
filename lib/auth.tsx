"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setTokens, clearTokens } from "./api";

export type Role = "investor" | "driver" | "fleet_operator" | "admin" | "super_admin";

export interface SessionUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  status: string;
  kycStatus?: string;
  avatarUrl?: string | null;
}

interface AuthCtx {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  login: async () => { throw new Error(); },
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem("rd_user") : null;
    if (cached) setUser(JSON.parse(cached));
    api<SessionUser>("/auth/me", { retry: false })
      .then((u) => {
        setUser(u);
        localStorage.setItem("rd_user", JSON.stringify(u));
      })
      .catch(() => {
        setUser(null);
        clearTokens();
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok || json.success === false) throw new Error(json.message || "Sign in failed");
    setTokens(json.data.accessToken, json.data.refreshToken);
    localStorage.setItem("rd_user", JSON.stringify(json.data.user));
    setUser(json.data.user);
    return json.data.user as SessionUser;
  }

  async function refreshUser() {
    try {
      const u = await api<SessionUser>("/auth/me", { retry: false });
      setUser(u);
      localStorage.setItem("rd_user", JSON.stringify(u));
    } catch {}
  }

  function logout() {
    clearTokens();
    setUser(null);
    window.location.href = "/login";
  }

  return <Ctx.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

export function homeForRole(role: Role): string {
  switch (role) {
    case "admin":
    case "super_admin":
      return "/admin";
    case "fleet_operator":
      return "/fleet";
    case "driver":
      return "/driver";
    default:
      return "/investor";
  }
}
