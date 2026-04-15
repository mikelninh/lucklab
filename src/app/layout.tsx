import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

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
  title: "Kairos — The Science of the Opportune Moment",
  description:
    "Kairos Lab studies how luck, synchronicity, and serendipity can be cultivated. 12 wisdom traditions cross-referenced with modern research. Guided by Tyche, our AI oracle.",
  keywords: [
    "luck",
    "synchronicity",
    "serendipity",
    "kairos",
    "how to be lucky",
    "meaningful coincidences",
    "Jung synchronicity",
    "Wiseman luck factor",
    "abundance",
    "fortune",
  ],
  authors: [{ name: "Kairos Lab" }],
  openGraph: {
    title: "Kairos — The Science of the Opportune Moment",
    description:
      "A research platform on luck and synchronicity. Take the diagnostic. Consult Tyche, our AI oracle.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kairos — The Science of the Opportune Moment",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
