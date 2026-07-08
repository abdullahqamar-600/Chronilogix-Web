import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { CoachLauncher } from "@/components/CoachLauncher";
import { AppPartnersHero } from "@/components/solutions/appPartners/AppPartnersHero";
import { AppPartnersProblem } from "@/components/solutions/appPartners/AppPartnersProblem";
import { AppPartnersPillars } from "@/components/solutions/appPartners/AppPartnersPillars";
import { AppPartnersDiagram } from "@/components/solutions/appPartners/AppPartnersDiagram";
import { AppPartnersNumbers } from "@/components/solutions/appPartners/AppPartnersNumbers";
import { AppPartnersDistribution } from "@/components/solutions/appPartners/AppPartnersDistribution";
import { AppPartnersProof } from "@/components/solutions/appPartners/AppPartnersProof";
import { AppPartnersTrust } from "@/components/solutions/appPartners/AppPartnersTrust";
import { AppPartnersFAQ } from "@/components/solutions/appPartners/AppPartnersFAQ";
import { AppPartnersClosingCTA } from "@/components/solutions/appPartners/AppPartnersClosingCTA";

export const metadata: Metadata = {
  title: "App Partners · Chronilogix",
  description:
    "Chronilogix is the clinical coaching intelligence layer built to live inside other products. Embed Dr. Ken Resnicow's thirty years of Motivational Interviewing research inside your wellness app, with no behavioral-science team to hire.",
};

export default function AppPartnersPage() {
  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /about and
            /solutions/brokers. Every section is a rounded card on the
            outer paper surface; the dark Proof slab sits inside the same
            padded group so it reads as a rounded dark card, not a
            full-bleed interruption. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AppPartnersHero />
          <AppPartnersProblem />
          <AppPartnersPillars />
          <AppPartnersDiagram />
          <AppPartnersNumbers />
          <AppPartnersDistribution />
          <AppPartnersProof />
          <AppPartnersTrust />
          <AppPartnersFAQ />
          <AppPartnersClosingCTA />
        </div>
      </main>

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
