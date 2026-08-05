import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoachLauncher } from "@/components/CoachLauncher";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LegalCrossLink } from "@/components/legal/LegalCrossLink";
import { TERMS_DOC, LEGAL_CONTACT } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Terms & Conditions · Chronilogix",
  description:
    "The agreement between you and Chronilogix, Inc. governing your use of the Service — including medical and crisis disclaimers, intellectual property, subscription terms, and dispute resolution.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Padded card shell — same rhythm as FAQ, About, and Product. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <LegalHero
            eyebrow={TERMS_DOC.eyebrow}
            title={TERMS_DOC.title}
            titleTail={TERMS_DOC.titleTail}
            intro={TERMS_DOC.intro}
            updated={TERMS_DOC.updated}
          />
          <LegalDocument
            sections={TERMS_DOC.sections}
            contactEmail={LEGAL_CONTACT}
            preamble={TERMS_DOC.preamble}
          />
          <LegalCrossLink
            companionHref="/privacy"
            companionLabel="Privacy Policy"
            companionBlurb="What we collect, how we use it, who we share it with, how long we keep it, and the data protection rights you can exercise."
            contactEmail={LEGAL_CONTACT}
          />
        </div>
      </main>
      <CoachLauncher />
      <Footer />
    </>
  );
}
