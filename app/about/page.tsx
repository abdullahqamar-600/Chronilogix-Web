import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutScience } from "@/components/about/AboutScience";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutPurpose } from "@/components/about/AboutPurpose";
import { AboutClosingCTA } from "@/components/about/AboutClosingCTA";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About · Chronilogix",
  description:
    "Chronilogix is the AI native behavioral health and chronic care coaching platform built on Dr. Ken Resnicow's three decades of Motivational Interviewing research. Meet the team and the mission behind the work.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Tier 1 — Team opens the page. The portrait band IS the hero. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AboutTeam />
        </div>

        {/* Tier 2 — the science: full-bleed dark slab so Dr. Resnicow's
            research credentials land as the page's gravitational center. */}
        <div className="flex flex-col">
          <AboutScience />
        </div>

        {/* Tier 3 — the rest: values strip, timeline, purpose, close. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AboutMission />
          <AboutTimeline />
          <AboutPurpose />
          <AboutClosingCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
