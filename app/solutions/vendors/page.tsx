import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { CoachLauncher } from "@/components/CoachLauncher";
import {
  VendorsAudioProvider,
  VendorsStickyAudio,
} from "@/components/solutions/vendors/vendorsAudio";
import { VendorsHero } from "@/components/solutions/vendors/VendorsHero";
import { VendorsAfterDelivery } from "@/components/solutions/vendors/VendorsAfterDelivery";
import { VendorsProgramGap } from "@/components/solutions/vendors/VendorsProgramGap";
import { VendorsBehaviorGap } from "@/components/solutions/vendors/VendorsBehaviorGap";
import { VendorsImpact } from "@/components/solutions/vendors/VendorsImpact";
import { VendorsReposition } from "@/components/solutions/vendors/VendorsReposition";
import { VendorsClosingCTA } from "@/components/solutions/vendors/VendorsClosingCTA";

export const metadata: Metadata = {
  title: "Vendors · Chronilogix",
  description:
    "Turn better health benefits into better health outcomes. Chronilogix helps employers, healthcare vendors, health plans, and care providers improve engagement and reduce avoidable healthcare costs through AI-powered behavioral coaching.",
};

/**
 * /solutions/vendors — for chronic-care product vendors: the product
 * ships fine; the challenge is what happens after delivery. The hero's
 * "Play Now" button starts the vendor brief and reveals a full-width
 * sticky player that keeps playing as the visitor scrolls.
 *
 * Section order follows the vendor narrative arc:
 *   1. Hero               — your product works; the challenge is after delivery (+ before/after graph)
 *   2. After Delivery     — the reality vendors face (delivery isn't the finish line)
 *   3. Program Gap        — meet Rooney AI (your AI health coach)
 *   4. Behavior Gap       — the behaviour gap (human barriers to adherence)
 *   5. Impact             — the business impact (retention / coaching / cost stats)
 *   6. Reposition         — a better story for buyers (stand out in a crowded market)
 *   7. Closing CTA        — upgrade outcomes without changing your product
 */
export default function VendorsPage() {
  return (
    <>
      <PageLoader />
      <Nav />
      <VendorsAudioProvider>
        <main className="flex flex-col">
          {/* Single padded card system — same rhythm as /about,
              /solutions/brokers, /solutions/app-partners. */}
          <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
            <VendorsHero />
            <VendorsAfterDelivery />
            <VendorsProgramGap />
            <VendorsBehaviorGap />
            <VendorsImpact />
            <VendorsReposition />
            <VendorsClosingCTA />
          </div>
        </main>

        {/* Full-width sticky player, revealed when the hero's Play Now is
            pressed; keeps playing across scroll. */}
        <VendorsStickyAudio />
      </VendorsAudioProvider>

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
