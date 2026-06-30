import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { PageLoader } from "@/components/PageLoader";
import { CoachLauncher } from "@/components/CoachLauncher";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutScience } from "@/components/about/AboutScience";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutPurpose } from "@/components/about/AboutPurpose";
import { AboutClosingCTA } from "@/components/about/AboutClosingCTA";

export const metadata: Metadata = {
  title: "About · Chronilogix",
  description:
    "Chronilogix is the AI native behavioral health and chronic care coaching platform built on Dr. Ken Resnicow's three decades of Motivational Interviewing research. Meet the team and the mission behind the work.",
};

export default function AboutPage() {
  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        {/* Single padded card system — every section is a rounded card on
            warm paper, matching the home page's wrapper rhythm. The dark
            slabs (Science, ClosingCTA) live inside the same padded group
            as the cream cards so they read as rounded dark cards, not
            full-bleed interruptions. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AboutTeam />
          <AboutScience />
          <AboutMission />
          <AboutTimeline />
          <AboutPurpose />
          <AboutClosingCTA />
        </div>
      </main>

      {/* CoachLauncher is the site-wide "Questions?" widget per CLAUDE.md.
          SectionGuide is intentionally omitted — it's hardcoded to homepage
          section anchors and would show dead links on /about. */}
      <CoachLauncher />
    </>
  );
}
