export function naira(kobo: number | undefined | null): string {
  const value = (kobo ?? 0) / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function shortDate(d: string | Date | undefined): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export function titleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
