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
        "display": ["clamp(2.75rem, 5vw + 1rem, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "hero": ["clamp(2.25rem, 3.5vw + 1rem, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "section": ["clamp(1.875rem, 2.4vw + 1rem, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.018em" }],
      },
      maxWidth: {
        page: "1240px",
        readable: "720px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,20,25,0.04), 0 8px 24px rgba(15,20,25,0.06)",
        widget: "0 8px 32px rgba(15,20,25,0.18)",
      },
      animation: {
        "fade-up": "fadeUp 300ms ease-out forwards",
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
