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
import { PageNav, type TocItem } from "@/components/widget/pageNav";

// "On this page" wayfinder, keyed to the about page's own sections.
const ABOUT_TOC: TocItem[] = [
  { id: "team", label: "Team" },
  { id: "science", label: "The science" },
  { id: "values", label: "Mission" },
  { id: "timeline", label: "Timeline" },
  { id: "purpose", label: "Purpose" },
  { id: "get-in-touch", label: "Get in touch" },
];

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

      {/* "On this page" wayfinder, keyed to this page's own section
          anchors (the homepage-only SectionGuide is not reused here — it
          carries a homepage TOC and the Zenn demo card). */}
      <PageNav items={ABOUT_TOC} revealId="science" navLabel="About sections" />

      {/* CoachLauncher is the site-wide "Questions?" widget per CLAUDE.md. */}
      <CoachLauncher />
    </>
  );
}
