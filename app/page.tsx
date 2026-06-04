import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
// Hidden for now — restore by un-commenting the import and the <AskChronilogix /> render below.
// import { AskChronilogix } from "@/components/sections/AskChronilogix";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { ProofPoints } from "@/components/sections/ProofPoints";
import { getSiteSettings } from "@/lib/sanity";

// Statically generate at build time; revalidate hourly so a video swap in
// Sanity Studio shows up on the live site within an hour without redeploying.
export const revalidate = 3600;

export default async function HomePage() {
  const { heroVideoUrl } = await getSiteSettings();

  return (
    <>
      <Nav />
      <main className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
        <Hero videoUrl={heroVideoUrl} />
        <Statement />
        {/* <AskChronilogix /> */}
        <Problem />
        <Solution />
        <WhoWeServe />
        <ProofPoints />
      </main>
      <Footer />
    </>
  );
}
