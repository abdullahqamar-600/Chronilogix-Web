import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoreCapabilities } from "@/components/sections/CoreCapabilities";
import { HiwHero } from "@/components/howItWorks/HiwHero";
import { HiwAgents } from "@/components/howItWorks/HiwAgents";
// Hidden for now — restore by un-commenting the import and the <HiwMethod /> render below.
// import { HiwMethod } from "@/components/howItWorks/HiwMethod";
import { HiwSession } from "@/components/howItWorks/HiwSession";
// Hidden for now — restore by un-commenting the import and the <HiwConsistency /> render below.
// import { HiwConsistency } from "@/components/howItWorks/HiwConsistency";
import { HiwAudience } from "@/components/howItWorks/HiwAudience";
// Hidden for now — restore by un-commenting the import and the <HiwFeel /> render below.
// import { HiwFeel } from "@/components/howItWorks/HiwFeel";
import { HiwIntegration } from "@/components/howItWorks/HiwIntegration";
import { HiwPlatform } from "@/components/howItWorks/HiwPlatform";

export const metadata: Metadata = {
  title: "Product · Chronilogix",
  description:
    "Two coaches built on thirty years of Motivational Interviewing — Roni for chronic care, Millie for mental health. How Chronilogix turns Dr. Ken Resnicow's life's work into a 24/7 AI coaching platform.",
};

/**
 * Product page.
 *
 * Narrative arc:
 *   Tier 1 — Hero + Agents (rounded, gapped). The two coaches and what
 *     they each do, surfaced before the visitor has to scroll for them.
 *   Tier 2 — Method → Session → Consistency → Audience → Feel
 *     (full-bleed, interlinked). The deep argument: why it works,
 *     how a session unfolds, why AI delivers it consistently, who the
 *     system is for, and what it actually feels like to use.
 *   Tier 3 — CoreCapabilities + ClosingCTA (rounded, gapped). The
 *     platform capability summary lifted from the homepage, then the
 *     closing call to action.
 */
export default function ProductPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Tier 1 — opening: rounded, gapped, matches the home shell.
            CoreCapabilities sits right below the agents so the buyer
            gets the platform shape before the deeper argument. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwHero />
          <HiwAgents />
          <CoreCapabilities />
        </div>

        {/* Tier 2 — the argument: full-bleed, no gaps. */}
        <div className="flex flex-col">
          <HiwAudience />
        </div>

        {/* Tier 3 — session walkthrough + deployment: rounded, gapped. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwSession />
          <HiwIntegration />
          <HiwPlatform />
        </div>
      </main>
      <Footer />
    </>
  );
}
