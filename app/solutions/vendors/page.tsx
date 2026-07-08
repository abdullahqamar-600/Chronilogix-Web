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
import { VendorsUpgrade } from "@/components/solutions/vendors/VendorsUpgrade";
import { VendorsBehaviorGap } from "@/components/solutions/vendors/VendorsBehaviorGap";
import { VendorsImpact } from "@/components/solutions/vendors/VendorsImpact";
import { VendorsReposition } from "@/components/solutions/vendors/VendorsReposition";
import { VendorsClosingCTA } from "@/components/solutions/vendors/VendorsClosingCTA";

export const metadata: Metadata = {
  title: "Vendors · Chronilogix",
  description:
    "The outcomes upgrade your chronic care products have been missing. 24/7 AI-powered coaching that sits on top of what you already ship — replacing up to 80% of human coaching sessions at roughly $5 each, and lifting vendor retention by up to 40%.",
};

/**
 * /solutions/vendors — page for chronic care product vendors.
 *
 * The entire narrative on this page is a refactor of the recorded
 * vendor track (Recordings/FINAL edit Chronoligix Vendor track.m4a).
 * The audio itself sits inside the hero as an editorial "listen" card;
 * on scroll past the hero, the same player becomes a fixed bottom bar
 * so a visitor can keep listening while they scan the argument.
 *
 * Section order maps 1:1 to the audio's arc:
 *   1. Hero              — the hook (product isn't the problem) + audio card
 *   2. After Delivery    — the four post-shipment pressures
 *   3. Upgrade           — the positioning turn ("outcomes upgrade")
 *   4. Behavior Gap      — how Chronilogix closes it (Rooney + MI)
 *   5. Impact            — the three numbers (dark slab)
 *   6. Reposition        — from commodity supplier → outcomes partner
 *   7. Closing CTA       — "chronic coaching care that clicks."
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
            <VendorsUpgrade />
            <VendorsBehaviorGap />
            <VendorsImpact />
            <VendorsReposition />
            <VendorsClosingCTA />
          </div>
        </main>

        {/* Sticky audio bar — sits above the CoachLauncher, revealed
            once the hero card is out of view. */}
        <VendorsStickyAudio />
      </VendorsAudioProvider>

      {/* Site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
