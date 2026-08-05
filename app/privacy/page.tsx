import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CoachLauncher } from "@/components/CoachLauncher";
import { LegalHero } from "@/components/legal/LegalHero";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LegalCrossLink } from "@/components/legal/LegalCrossLink";
import { PRIVACY_DOC, LEGAL_CONTACT } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy · Chronilogix",
  description:
    "How Chronilogix collects, uses, stores, processes, and protects your information — what we collect, why, who we share it with, how long we keep it, and the rights you hold over it.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        {/* Padded card shell — same rhythm as FAQ, About, and Product. */}
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <LegalHero
            eyebrow={PRIVACY_DOC.eyebrow}
            title={PRIVACY_DOC.title}
            titleTail={PRIVACY_DOC.titleTail}
            intro={PRIVACY_DOC.intro}
            updated={PRIVACY_DOC.updated}
          />
          <LegalDocument
            sections={PRIVACY_DOC.sections}
            contactEmail={LEGAL_CONTACT}
            preamble={PRIVACY_DOC.preamble}
          />
          <LegalCrossLink
            companionHref="/terms"
            companionLabel="Terms & Conditions"
            companionBlurb="The agreement governing your use of Chronilogix — including the medical and crisis disclaimers, the arbitration clause, and the class action waiver."
            contactEmail={LEGAL_CONTACT}
          />
        </div>
      </main>
      <CoachLauncher />
      <Footer />
    </>
  );
}
