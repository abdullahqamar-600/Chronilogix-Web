import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoachLauncher } from "@/components/CoachLauncher";
import { FaqHero } from "@/components/faq/FaqHero";
import { FaqList } from "@/components/faq/FaqList";
import { FaqClosingCta } from "@/components/faq/FaqClosingCta";

export const metadata: Metadata = {
  title: "FAQ · Chronilogix",
  description:
    "Plain-language answers to the questions we hear most about Chronilogix — how it works, how care stays safe, how deployment works, and what makes the science defensible.",
};

export default function FaqPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Padded card shell — same rhythm as About and Product. Each
            section reads as a rounded card on the warm page ground. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <FaqHero />
          <FaqList />
          <FaqClosingCta />
        </div>
      </main>
      <CoachLauncher />
      <Footer />
    </>
  );
}
