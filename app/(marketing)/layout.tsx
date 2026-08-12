import type { Metadata } from "next";
import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";
import PageLoader from "@/components/marketing/PageLoader";
import CookieBanner from "@/components/marketing/CookieBanner";

export const metadata: Metadata = {
  title: {
    default: "Rydora Mobility | Professional Fleet Management",
    template: "%s | Rydora Mobility",
  },
  description:
    "Rydora assigns vetted professional drivers to your fleet, tracks every trip and payment, and distributes earnings transparently. Africa's trusted mobility management platform.",
  openGraph: {
    siteName: "Rydora Mobility",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col antialiased"
      style={{
        backgroundColor: "var(--surface-base)",
        color: "var(--ink-body)",
      }}
    >
      <PageLoader />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
