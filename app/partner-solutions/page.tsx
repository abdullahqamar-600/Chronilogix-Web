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
//
// Order mirrors this page's render order — hero, then BUNDLES in array
// order (zenn → medimart → hibiscus), then YourSolutionPanel — and must be
// kept in sync with it: the rail's fill, knob and "n / total" all derive
// from position, so a row whose section sits elsewhere on the page — or
// isn't reachable at all — silently skews the reader's sense of place.
//
// One row per SECTION, not per anchor. YourSolutionPanel is a single
// <section id="book-a-demo"> whose heading carries ps-your-solution-label,
// and the rail resolves every id to its enclosing <section>. Two rows
// pointing into the same panel therefore collapse onto one target: the
// later id wins the scroll-spy and the earlier row can never light up,
// while still eating a rail slice and a slot in the counter. So the
// closing panel gets exactly one row here.
const PARTNER_TOC: TocItem[] = [
  { id: null, label: "Overview" },
  { id: "ps-zenn-label", label: "ZENN + Balance for Life" },
  { id: "ps-medimart-label", label: "Medimart" },
  { id: "ps-hibiscus-label", label: "Hibiscus Health" },
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
