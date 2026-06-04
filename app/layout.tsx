import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  // Next.js 14.2.x can't auto-generate fallback metrics for Newsreader and
  // logs a noisy warning each build. The auto-tuning is purely a CLS hint —
  // disabling it silences the warning with no functional change.
  adjustFontFallback: false,
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronilogix — Clinical-grade AI coaching for behavioral health and chronic care",
  description:
    "Chronilogix is the AI-native behavioral health and chronic care coaching platform built on Dr. Ken Resnicow's 30 years of Motivational Interviewing research — clinical-grade outcomes at a fraction of the cost of live care.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
