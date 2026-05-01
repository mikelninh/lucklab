import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { ORGANIZATION, WEBSITE, jsonLdScript } from "@/lib/jsonld";
// ExitIntent removed 2026-04-20 — identity system forbids modal popups that
// block the content, exit-intent modals included. See IDENTITY_SYSTEM.md.
import { SiteChrome } from "@/components/SiteChrome";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Luck Lab — The Science of Luck",
  description:
    "Luck Lab studies how luck, synchronicity, and serendipity can be cultivated. 12 wisdom traditions cross-referenced with modern research. Guided by Tyche, our AI oracle.",
  keywords: [
    "luck",
    "synchronicity",
    "serendipity",
    "opportune moment",
    "how to be lucky",
    "meaningful coincidences",
    "Jung synchronicity",
    "Wiseman luck factor",
    "abundance",
    "fortune",
  ],
  authors: [{ name: "Luck Lab" }],
  openGraph: {
    title: "Luck Lab — The Science of Luck",
    description:
      "A research platform on luck and synchronicity. Take the diagnostic. Consult Tyche, our AI oracle.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luck Lab — The Science of Luck",
    description:
      "12 wisdom traditions + modern research. Train luck as a skill. Consult Tyche.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/* Structured data — Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(ORGANIZATION) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(WEBSITE) }}
        />
        {/* Plausible — privacy-first analytics */}
        <Script
          src="https://plausible.io/js/pa-nRxphFP3T2EiGHzhYVdsa.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
