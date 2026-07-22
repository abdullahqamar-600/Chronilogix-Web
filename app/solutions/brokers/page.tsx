import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { CoachLauncher } from "@/components/CoachLauncher";
import { BrokersHero } from "@/components/solutions/brokers/BrokersHero";
import { BrokersReality } from "@/components/solutions/brokers/BrokersReality";
import { BrokersStrategy } from "@/components/solutions/brokers/BrokersStrategy";
import { BrokersMemberExperience } from "@/components/solutions/brokers/BrokersMemberExperience";
import { BrokersWhyItWorks } from "@/components/solutions/brokers/BrokersWhyItWorks";
import { BrokersAdvantage } from "@/components/solutions/brokers/BrokersAdvantage";
import { BrokersClosingCTA } from "@/components/solutions/brokers/BrokersClosingCTA";
import {
  BrokersAudioProvider,
  BrokersStickyAudio,
} from "@/components/solutions/brokers/brokersAudio";
import { PageNav, type TocItem } from "@/components/widget/pageNav";

// "On this page" wayfinder, keyed to the broker narrative arc.
const BROKERS_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "brokers-reality-label", label: "The reality" },
  { id: "brokers-strategy-label", label: "The strategy" },
  { id: "how-it-works", label: "How it works" },
  { id: "brokers-why-label", label: "Why it works" },
  { id: "brokers-advantage-label", label: "For brokers" },
  { id: "book-a-demo", label: "Book a demo" },
];

export const metadata: Metadata = {
  title: "Brokers · Chronilogix",
  description:
    "Help your self-funded clients reduce healthcare costs before claims escalate. Chronilogix gives benefits brokers a proactive, AI-powered coaching strategy that addresses chronic conditions, behavioral health, and delayed care at the root — not just another point solution.",
};

export default function BrokersPage() {
  return (
    <>
      <PageLoader />
      <Nav />
      <BrokersAudioProvider>
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /about, /solutions/*
            and the home shell. Every section is a rounded card sitting on
            the outer paper surface; the dark slabs live inside this same
            padded group so they read as rounded dark cards, not full-bleed
            interruptions.

            Section order follows the broker narrative arc — why should I
            care? what's causing the problem? why don't current solutions
            work? how does Chronilogix solve it? why is it good for me?
            why should I book a demo?

              1. Hero               — the cost problem, not the product
              2. The Reality        — what's causing the problem
              3. Strategy           — introducing Chronilogix (front door)
              4. Member experience  — meet Roni AI
              5. Why it works       — the business impact for employers
              6. Advantage          — what it means for the broker (payoff)
              7. Closing CTA        — book a demo
        */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <BrokersHero />
          <BrokersReality />
          <BrokersStrategy />
          <BrokersMemberExperience />
          <BrokersWhyItWorks />
          <BrokersAdvantage />
          <BrokersClosingCTA />
        </div>
      </main>

      {/* Full-width sticky player, revealed when the hero's Play Now is
          pressed; keeps playing across scroll. */}
      <BrokersStickyAudio />
      </BrokersAudioProvider>

      {/* "On this page" wayfinder, keyed to this page's sections. */}
      <PageNav
        items={BROKERS_TOC}
        revealId="brokers-reality-label"
        navLabel="Broker page sections"
      />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
