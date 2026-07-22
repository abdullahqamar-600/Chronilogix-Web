import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { SectionGuide } from "@/components/widget/SectionGuide";
import { CoachLauncher } from "@/components/CoachLauncher";
import { HeroV5 } from "@/components/sections/HeroV5";
import { StatementV5 } from "@/components/sections/StatementV5";
import { MIExplainer } from "@/components/sections/MIExplainer";
import { ProblemV3 } from "@/components/sections/ProblemV3";
import { Solution } from "@/components/sections/Solution";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { AetnaProof } from "@/components/sections/CustomerStories";
import { Testimonials } from "@/components/sections/Testimonials";

// Home (V1) — the current canonical design. Was previously V5 and was
// promoted into the V1 slot after the toggle renumbering: V5 → V3 →
// swapped with V1. Original V1 now lives at /v3.
export default function HomePage() {
  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <div className="flex flex-col">
            <HeroV5 />
            <StatementV5 />
          </div>
          {/* Section 3 now folds the Dr. Resnicow "science behind it" beat
              into its own closing act, so the method and the mind behind it
              read as one continuous section. */}
          <MIExplainer />
          <Solution />
        </div>
        <div className="flex flex-col">
          <ProblemV3 />
        </div>
        {/* Field proof sits directly beneath the Problem — name the gap,
            then show the evidence that closing it works. Same rounded-card
            layout as the Solution section (two side-by-side proof cards). */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <AetnaProof />
        </div>
        <div className="flex flex-col">
          <WhoWeServe />
        </div>
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          {/* Member voices close the page. */}
          <div className="flex flex-col overflow-hidden rounded-[28px]">
            <Testimonials />
          </div>
        </div>
      </main>
      <Footer />

      <SectionGuide />

      <CoachLauncher />
    </>
  );
}
