import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SectionGuide } from "@/components/widget/SectionGuide";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Problem } from "@/components/sections/Problem";
import { Outcome } from "@/components/sections/Outcome";
import { Solution } from "@/components/sections/Solution";
// Hidden for now — restore by un-commenting the import and the <AskChronilogix /> render below.
// import { AskChronilogix } from "@/components/sections/AskChronilogix";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
// Core Capabilities now lives on the /product page, where the
// "four pillars" treatment opens the answer arc after the problem framing.
import { CustomerStories } from "@/components/sections/CustomerStories";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <Hero />
          <Statement />
          {/* <AskChronilogix /> */}
          <Solution />
        </div>
        {/* Sections 5, 6, 7 — interlinked, full-bleed, no gaps */}
        <div className="flex flex-col">
          <Problem />
          <Outcome />
          <WhoWeServe />
        </div>
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <CustomerStories />
        </div>
      </main>
      <Footer />

      {/* Bottom-left companion: section TOC + rotating problem→Chronilogix
          one-liner. Lives on z-40 so the Roni pill (z-50) stays on top. */}
      <SectionGuide />

      {/* Floating Roni agent pill — bottom-right of the viewport on every
          scroll position. Decorative only for now; wire to the help / call
          flow when the destination is defined. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/agent.png"
        alt="Roni AI agent"
        className="pointer-events-none fixed bottom-5 right-5 z-50 h-auto w-[180px] select-none drop-shadow-[0_12px_28px_rgba(15,20,25,0.22)] md:bottom-6 md:right-6 md:w-[200px]"
        draggable={false}
      />
    </>
  );
}
