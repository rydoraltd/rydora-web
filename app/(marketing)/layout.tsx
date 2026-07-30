import type { Metadata } from "next";
import { Fraunces, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/marketing/Nav";
import Footer from "@/components/marketing/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  weight: "variable",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

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
      className={`${fraunces.variable} ${dmSans.variable} ${ibmPlexMono.variable} min-h-screen flex flex-col antialiased`}
      style={{
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--surface-base)",
        color: "var(--ink-body)",
      }}
    >
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
