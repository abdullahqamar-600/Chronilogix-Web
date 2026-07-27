import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/Footer";
import { CoachLauncher } from "@/components/CoachLauncher";
import { PartnerHero } from "@/components/partnerSolutions/PartnerHero";
import { PartnerBundle } from "@/components/partnerSolutions/PartnerBundle";
import { YourSolutionPanel } from "@/components/partnerSolutions/YourSolutionPanel";
import { BUNDLES } from "@/components/partnerSolutions/partnerData";
import { PageNav, type TocItem } from "@/components/widget/pageNav";

// "On this page" wayfinder, keyed to the partner-solutions arc.
const PARTNER_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "ps-zenn-label", label: "ZENN + Balance for Life" },
  { id: "ps-medimart-label", label: "Medimart" },
  { id: "ps-hibiscus-label", label: "Hibiscus Health" },
  { id: "ps-your-solution-label", label: "Your solution" },
  { id: "book-a-demo", label: "Book a demo" },
];

export const metadata: Metadata = {
  title: "Partner Solutions · Chronilogix",
  description:
    "Chronilogix doesn't replace your product — it makes it smarter, more engaging, and more effective through continuous AI coaching. See how industry leaders like Balance for Life, Medimart, and Hibiscus Health extend their solutions with Chronilogix.",
};

/**
 * /partner-solutions — the bundled-solutions showcase. Reframes the pitch
 * from "buy AI coaching" to "Chronilogix makes your existing product more
 * valuable," with three live partner bundles as light case studies and an
 * open "Your Solution + Chronilogix" invitation to close.
 *
 * Section order:
 *   1. Hero                — Extend Your Solution. Increase Your Value.
 *   2..n. Bundles          — one case study per partner (data-driven)
 *   last. Your Solution    — the open invitation + closing CTA (#book-a-demo)
 */
export default function PartnerSolutionsPage() {
  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        {/* Single padded card system — same rhythm as /solutions/*. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <PartnerHero />
          {BUNDLES.map((bundle) => (
            <PartnerBundle key={bundle.key} bundle={bundle} />
          ))}
          <YourSolutionPanel />
        </div>
      </main>

      <Footer />

      {/* "On this page" wayfinder, keyed to this page's sections. */}
      <PageNav
        items={PARTNER_TOC}
        revealId="ps-zenn-label"
        navLabel="Partner solutions sections"
      />

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
