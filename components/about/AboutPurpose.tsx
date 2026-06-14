"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Section 7: Who We're Building For. The most emotionally direct beat on
 * the page. A short prose statement followed by a large pull quote.
 */
export function AboutPurpose() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    filter: inView ? "blur(0)" : "blur(4px)",
    transition: `opacity 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, filter 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
  });

  return (
    <section
      id="purpose"
      ref={ref}
      className="relative overflow-hidden rounded-[28px] bg-paper-warm py-24 md:py-32 lg:py-40"
    >
      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow" style={reveal(0)}>
            Our purpose
          </p>
          <h2
            className="mt-5 text-display font-serif font-normal text-ink"
            style={
              {
                textWrap: "balance",
                ...reveal(120),
              } as React.CSSProperties
            }
          >
            The people nobody{" "}
            <span className="text-ink-muted italic">was building for.</span>
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-[64ch] space-y-7 md:mt-20">
          <p className="body-prose" style={reveal(260)}>
            We want to be honest about who Chronilogix is really for.
          </p>
          <p className="body-prose" style={reveal(340)}>
            Not the already engaged wellness consumer who tracks their sleep
            and orders supplements online. Not the fully insured employee at
            a large company with a robust benefits package.
          </p>
          <p className="body-prose" style={reveal(420)}>
            We are building for{" "}
            <span className="text-ink">the night-shift nurse</span> who needs
            support at 3 AM. <span className="text-ink">The diabetic patient</span>{" "}
            who wants to stop taking their medication because they&rsquo;re
            exhausted and nobody is checking in. {" "}
            <span className="text-ink">The underinsured worker</span> who has
            avoided care for two years because the deductible makes it
            inaccessible. <span className="text-ink">The person</span> who has
            never spoken honestly to a therapist because the stigma in their
            community makes it feel impossible.
          </p>
          <p className="body-prose" style={reveal(500)}>
            These are the people the healthcare system consistently fails to
            reach. And they are the reason Chronilogix exists.
          </p>
        </div>

        <figure
          className="mx-auto mt-20 max-w-3xl md:mt-24"
          style={reveal(620)}
        >
          <blockquote className="relative text-center">
            {/* Decorative serif open quote glyph sits behind the quote
                line, anchoring it without using a line. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2 select-none font-serif text-[120px] leading-none text-brand/15 md:-top-14 md:text-[160px]"
            >
              &ldquo;
            </span>
            <p className="relative font-serif text-section font-normal italic leading-[1.2] text-ink">
              Chronilogix creates an emotionally accessible entry point for
              populations that might otherwise avoid support altogether.
            </p>
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
