import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoreCapabilities } from "@/components/sections/CoreCapabilities";
import { HiwHero } from "@/components/howItWorks/HiwHero";
import { HiwAgentsV4 } from "@/components/howItWorks/HiwAgentsV4";
import { HiwReply } from "@/components/howItWorks/HiwReply";
import { HiwAudience } from "@/components/howItWorks/HiwAudience";
import { HiwIntegration } from "@/components/howItWorks/HiwIntegration";
import { HiwPlatform } from "@/components/howItWorks/HiwPlatform";

export const metadata: Metadata = {
  title: "Product V4 · Chronilogix",
  description:
    "V4 iteration of the product page. Same arc as /product, but the coaches section is reframed around Roni AI as the platform engine — with Roni and Millie surfaced as the two clinical personas Roni powers. Aligns the surface with every source doc that names Roni AI as the single coaching engine.",
};

/**
 * Product page — V4 iteration.
 *
 * Mirrors /product exactly, except the coaches section swaps
 * `<HiwAgents />` for `<HiwAgentsV4 />`. That single swap reconciles the
 * gap between the site (two named coaches: Roni + Millie) and every
 * source doc (single engine: Roni AI). V4 frames Roni AI as the
 * umbrella engine, then presents Roni + Millie as the two clinical
 * personas Roni powers.
 *
 * Nothing else about the arc changes:
 *   Tier 1 — HiwHero → HiwReply → HiwAgentsV4 → CoreCapabilities.
 *   Tier 2 — HiwAudience.
 *   Tier 3 — HiwIntegration → HiwPlatform.
 *
 * If the V4 direction is approved, the main /product page can adopt it
 * with a single import swap.
 */
export default function ProductPageV4() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwHero />
          <HiwReply />
          <HiwAgentsV4 />
          <CoreCapabilities />
        </div>

        <div className="flex flex-col">
          <HiwAudience />
        </div>

        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <HiwIntegration />
          <HiwPlatform />
        </div>
      </main>
      <Footer />
    </>
  );
}
