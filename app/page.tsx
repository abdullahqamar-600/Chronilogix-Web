import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { AskChronilogix } from "@/components/sections/AskChronilogix";
import { TrustSignals } from "@/components/sections/TrustSignals";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { USP } from "@/components/sections/USP";
import { SocialProof } from "@/components/sections/SocialProof";
import { Pricing } from "@/components/sections/Pricing";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { QuestionsWidget } from "@/components/widget/QuestionsWidget";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
        <Hero />
        <AskChronilogix />
        <Problem />
        <Solution />
        <WhoWeServe />
        <USP />
        <TrustSignals />
        {/* <SocialProof /> */}
        {/* <Pricing /> — content merged into FinalCTA */}
        <FinalCTA />
      </main>
      <QuestionsWidget />
    </>
  );
}
