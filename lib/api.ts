"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type Json = Record<string, unknown>;

function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem("rd_access"),
    refresh: localStorage.getItem("rd_refresh"),
  };
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("rd_access", access);
  localStorage.setItem("rd_refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("rd_access");
  localStorage.removeItem("rd_refresh");
  localStorage.removeItem("rd_user");
}

async function tryRefresh(): Promise<boolean> {
  const { refresh } = getTokens();
  if (!refresh) return false;
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) return false;
  const json = await res.json();
  setTokens(json.data.accessToken, json.data.refreshToken);
  return true;
}

export async function api<T = Json>(
  path: string,
  options: { method?: string; body?: Json; retry?: boolean } = {}
): Promise<T> {
  const { access } = getTokens();
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && options.retry !== false) {
    const refreshed = await tryRefresh();
    if (refreshed) return api<T>(path, { ...options, retry: false });
    clearTokens();
    if (typeof window !== "undefined") window.location.href = "/login";
  }

  const json = await res.json().catch(() => ({ success: false, message: "Network error" }));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json.data as T;
}
