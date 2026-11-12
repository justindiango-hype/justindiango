import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = localFont({
  src: "./fonts/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  // Change this to your live address once the site is online (e.g. https://justindiango.com).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Justin Diango — Fast doesn't have to look cheap",
  description: "Story-driven landing pages, designed and live in days. Justin Diango, landing page designer in Dubai.",
  openGraph: {
    title: "Justin Diango — Fast doesn't have to look cheap",
    description: "Story-driven landing pages, designed and live in days.",
    images: ["/work/beacon-uae-v2.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#01047B",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans">
        {children}
        <div aria-hidden="true" className="grain" />
      </body>
    </html>
  );
}
