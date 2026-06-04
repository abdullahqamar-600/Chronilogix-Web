type Proof = {
  metric: string;
  label: string;
  body: string;
};

const PROOFS: Proof[] = [
  {
    metric: "430+",
    label: "Peer-reviewed",
    body: "Motivational Interviewing studies — and 10,000+ clinicians trained worldwide.",
  },
  {
    metric: "53% → 76%",
    label: "The method Aetna scaled",
    body: "Member engagement, with dropouts cut by more than half.",
  },
  {
    metric: "1st RCT",
    label: "AI coaching, clinically validated",
    body: "Dartmouth, NEJM AI 2025 — trust on par with human therapists.",
  },
  {
    metric: "Dr. Ken Resnicow",
    label: "Founded by",
    body: "A globally recognized pioneer of behavior-change science.",
  },
];

export function ProofPoints() {
  return (
    <section
      id="proof-points"
      aria-labelledby="proof-points-heading"
      className="section bg-paper-warm"
    >
      <div className="container-page">
        {/* Headline — three claims set on the rhythm of the three-part
            promise (method / AI / science). Uses the site's `text-section`
            token to stay locked with Problem, Pricing, and SocialProof
            headlines elsewhere on the page. */}
        <h2
          id="proof-points-heading"
          className="mx-auto max-w-3xl text-center text-section font-serif font-normal text-ink"
        >
          A proven method.
          <br className="hidden md:block" />
          {" "}
          Validated AI. Decades of science.
        </h2>

        {/* The ledger — numbered citation rows. Hairlines top + bottom of
            each row close the composition like a printed table. No cards,
            no shadows; the structure itself does the work. */}
        <ol className="mx-auto mt-16 max-w-5xl md:mt-24">
          {PROOFS.map((p, i) => (
            <li
              key={p.label}
              className={[
                "grid items-baseline gap-y-5 border-t border-ink/10 py-10",
                "md:gap-x-10 md:py-14",
                "md:[grid-template-columns:3.5rem_minmax(0,1.1fr)_minmax(0,1fr)]",
                i === PROOFS.length - 1 ? "border-b" : "",
              ].join(" ")}
            >
              {/* Index — small italic serif. Whisper, not shout. */}
              <span className="font-serif text-sm italic text-ink-muted md:self-start md:pt-4">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Metric — the lede. Matches the original site stat scale
                  (text-4xl → text-5xl, same as the prior TrustSignals
                  treatment) so big-number moments stay consistent across
                  the page. */}
              <p className="font-serif font-normal tracking-tight leading-[1.05] text-ink text-4xl md:text-5xl">
                {p.metric}
              </p>

              {/* Label + body. Label uses the shared `.eyebrow` token so
                  small-caps tracking matches every other eyebrow on the
                  page. Body in `text-sm leading-relaxed text-ink-muted`
                  matches the site's standard body register. */}
              <div className="md:self-start md:pt-3">
                <p className="eyebrow">{p.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
