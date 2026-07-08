import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { CoachLauncher } from "@/components/CoachLauncher";
import { BrokersHero } from "@/components/solutions/brokers/BrokersHero";
import { BrokersReality } from "@/components/solutions/brokers/BrokersReality";
import { BrokersStrategy } from "@/components/solutions/brokers/BrokersStrategy";
import { BrokersWhyItWorks } from "@/components/solutions/brokers/BrokersWhyItWorks";
import { BrokersMemberExperience } from "@/components/solutions/brokers/BrokersMemberExperience";
import { BrokersBrokerValue } from "@/components/solutions/brokers/BrokersBrokerValue";
import { BrokersConditions } from "@/components/solutions/brokers/BrokersConditions";
import { BrokersTrust } from "@/components/solutions/brokers/BrokersTrust";
import { BrokersClosingCTA } from "@/components/solutions/brokers/BrokersClosingCTA";

export const metadata: Metadata = {
  title: "Brokers · Chronilogix",
  description:
    "A front-door claims mitigation strategy for benefits brokers and consultants. 24/7 AI chronic and behavioral care coaching — grounded in thirty years of Motivational Interviewing research — that reduces claims, improves access, and stays affordable.",
};

export default function BrokersPage() {
  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /about, /solutions/*
            and the home shell. Every section is a rounded card sitting on
            the outer paper surface; the dark Broker Value slab lives
            inside this same padded group so it reads as a rounded dark
            card, not a full-bleed interruption.

            Section order follows the one-sheet narrative:
              1. Hero               — positioning + tagline + CTAs
              2. The Reality        — four cost pressures
              3. Front-door strategy — how Chronilogix engages upstream
              4. Why it works       — five defensible reasons
              5. Member experience  — a coach in every member's pocket
              6. Broker value       — four broker-specific benefits (dark)
              7. Conditions         — where Chronilogix bends outcomes
              8. Trust & security   — compliance posture
              9. Closing CTA        — "Coaching that clicks."
        */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <BrokersHero />
          <BrokersReality />
          <BrokersStrategy />
          <BrokersWhyItWorks />
          <BrokersMemberExperience />
          <BrokersBrokerValue />
          <BrokersConditions />
          <BrokersTrust />
          <BrokersClosingCTA />
        </div>
      </main>

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
