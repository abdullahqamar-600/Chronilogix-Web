import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F9904D",
          accent: "#FF7434",
          50: "#FFF5EE",
          100: "#FFE6D4",
          200: "#FFCDA8",
          300: "#FDB37D",
          400: "#FB9C5E",
          500: "#F9904D",
          600: "#FF7434",
          700: "#E45A1C",
          800: "#B84614",
          900: "#7A2E0C",
        },
        ink: {
          DEFAULT: "#0F1419",
          soft: "#2A3038",
          muted: "#5B6470",
          subtle: "#8A93A0",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          warm: "#FBF8F4",
          tint: "#F4EFE7",
        },
        slate: {
          widget: "#3A424D",
          widgetSoft: "#EEF0F3",
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ['var(--font-serif)', "ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      fontSize: {
        // Unified type scale. Five steps with ~1.33x ratio between each,
        // so each level reads as a clear authority below the next. No more
        // arbitrary clamps in sections; anything bigger than text-3xl
        // should pull from a token here.
        //
        // At max viewport: display 80, hero 56, section 40, row 32, card 24.
        "display": ["clamp(2.75rem, 5vw + 0.5rem, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.022em" }],
        "hero": ["clamp(2.125rem, 3.2vw + 0.6rem, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "section": ["clamp(1.75rem, 2.2vw + 0.6rem, 2.5rem)", { lineHeight: "1.08", letterSpacing: "-0.018em" }],
        // Mid-tier headings used inside rows and cards.
        "row": ["clamp(1.5rem, 1.7vw + 0.5rem, 2rem)", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "card": ["clamp(1.1875rem, 0.8vw + 0.7rem, 1.4375rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        // Numeric tokens for big stat figures across Problem, Outcome,
        // WhoWeServe metrics, and CustomerStories stat tiles.
        "stat-lg": ["clamp(4.25rem, 9.5vw, 8rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "stat-md": ["clamp(2.5rem, 4.2vw, 3.75rem)", { lineHeight: "0.94", letterSpacing: "-0.025em" }],
      },
      maxWidth: {
        page: "1400px",
        readable: "720px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,20,25,0.04), 0 8px 24px rgba(15,20,25,0.06)",
        widget: "0 8px 32px rgba(15,20,25,0.18)",
      },
      // Unified motion tokens. Use these instead of bespoke cubic-beziers.
      transitionTimingFunction: {
        // Ease-out-quart — primary curve for all entrance reveals, color shifts,
        // and indicator slides. Replaces a half-dozen near-identical bezier curves.
        "out-quart": "cubic-bezier(0.22, 0.61, 0.36, 1)",
        // Ease-out-expo — reserved for slow, premium reveals (large hero quote,
        // pull-quote letter rise). Stronger deceleration than out-quart.
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        // Hover micro-feedback.
        "200": "200ms",
        // Indicator bars, color shifts, small reveals.
        "400": "400ms",
        // Default entrance reveal (cards, content blocks).
        "600": "600ms",
        // Premium / large reveals (hero, pull quotes).
        "900": "900ms",
      },
      animation: {
        "fade-up": "fadeUp 600ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
