"use client";

type Turn = {
  who: "ai" | "user";
  paragraphs: string[];
};

const CONVERSATION: Turn[] = [
  {
    who: "ai",
    paragraphs: [
      "What would make this time worth finishing for you, not anyone else?",
    ],
  },
  {
    who: "user",
    paragraphs: [
      "My son starts Little League next fall. I want to be there on the sideline.",
    ],
  },
  {
    who: "ai",
    paragraphs: [
      "That's the thing to hold on to. Let's start small enough that it lasts.",
    ],
  },
];

// Each turn fades in across its own window in chatProgress (0 → 1).
const TURN_WINDOWS: Array<[number, number]> = [
  [0.06, 0.22],
  [0.32, 0.48],
  [0.58, 0.74],
];

const SCREEN = {
  top: (24 / 1375) * 100,
  left: (34 / 671) * 100,
  width: (612 / 671) * 100,
  height: (1326 / 1375) * 100,
  radius: "13.4% / 6.18%",
};

const NOTCH = {
  top: (41 / 1375) * 100,
  left: (243 / 671) * 100,
  width: (194 / 671) * 100,
  height: (57 / 1375) * 100,
};

export function HeroPhoneMockup({
  progress,
  maxRisePercent = 55,
  shiftXPercent = 0,
  scale = 1,
  chatProgress = 0,
}: {
  progress: number;
  maxRisePercent?: number;
  shiftXPercent?: number;
  scale?: number;
  chatProgress?: number;
}) {
  // Phone is hidden at page load and rises into view as the scroll
  // progresses. At peak `maxRisePercent` of the phone is visible.
  const phoneRiseLinear = clamp01((progress - 0.12) / (0.65 - 0.12));
  const phoneRise = easeInOutCubic(phoneRiseLinear);
  const phoneTranslateY = 100 - phoneRise * maxRisePercent;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
      style={{
        transform: `translateY(${phoneTranslateY}%)`,
        willChange: "transform",
        zIndex: 10,
      }}
    >
      <div
        className="relative aspect-[671/1375] w-[clamp(260px,26vw,360px)]"
        style={{
          transform: `translateX(${shiftXPercent}%) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <img
          src="/iphone/Iphone.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />

        <ChatScreen
          active={phoneRise > 0.05}
          chatProgress={chatProgress}
        />

        <img
          src="/iphone/Notch.png"
          alt=""
          aria-hidden
          className="absolute select-none"
          style={{
            top: `${NOTCH.top}%`,
            left: `${NOTCH.left}%`,
            width: `${NOTCH.width}%`,
            height: `${NOTCH.height}%`,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

function ChatScreen({
  active,
  chatProgress,
}: {
  active: boolean;
  chatProgress: number;
}) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top: `${SCREEN.top}%`,
        left: `${SCREEN.left}%`,
        width: `${SCREEN.width}%`,
        height: `${SCREEN.height}%`,
        borderRadius: SCREEN.radius,
        backgroundColor: "#D8DCDA",
        color: "#3A2412",
      }}
    >
      {/* Background image */}
      <img
        src="/iphone-bg.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full select-none object-cover"
        draggable={false}
      />
      {/* Soft cream wash for text legibility over the imagery */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,251,236,0) 18%, rgba(255,247,225,0.6) 52%, rgba(255,244,216,0.92) 100%)",
        }}
      />
      {/* Top vignette settles the orb against the sky */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/4"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      {active && (
        <div className="relative flex h-full flex-col px-4 pt-[22%] pb-5">
          {/* Orb removed. Top label is now the session header. Sentence
              case (no uppercase tracking) for accessibility — larger,
              easier to scan, full contrast against the cream wash. */}
          <p
            className="text-[12.5px] font-semibold"
            style={{ color: "#3A2412" }}
          >
            Chronilogix · Tuesday 8:41
          </p>

          <div className="mt-4 flex flex-col gap-2.5">
            {CONVERSATION.map((turn, i) => {
              const [start, end] = TURN_WINDOWS[i];
              const t = clamp01((chatProgress - start) / (end - start));
              return turn.who === "ai" ? (
                <AIBubble key={i} t={t} paragraphs={turn.paragraphs} />
              ) : (
                <UserBubble key={i} t={t} paragraphs={turn.paragraphs} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AIBubble({ t, paragraphs }: { t: number; paragraphs: string[] }) {
  return (
    <div
      className="self-start rounded-2xl px-4 py-2.5 text-[15px] leading-[1.4]"
      style={{
        background: "rgba(255, 250, 235, 0.62)",
        backdropFilter: "blur(8px) saturate(140%)",
        WebkitBackdropFilter: "blur(8px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.55)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.55) inset, 0 6px 18px -8px rgba(58,36,18,0.18)",
        opacity: t,
        transform: `translateY(${(1 - t) * 6}px)`,
        color: "#3A2412",
        maxWidth: "96%",
        willChange: "opacity, transform",
      }}
    >
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-1.5" : ""}>
          {p}
        </p>
      ))}
    </div>
  );
}

function UserBubble({ t, paragraphs }: { t: number; paragraphs: string[] }) {
  return (
    <div className="flex justify-end">
      <div
        className="rounded-2xl px-4 py-2.5 text-[15px] leading-[1.4] shadow-[0_1px_2px_rgba(58,36,18,0.08)]"
        style={{
          background: "#FFF6E0",
          color: "#3A2412",
          maxWidth: "94%",
          opacity: t,
          transform: `translateY(${(1 - t) * 6}px)`,
          willChange: "opacity, transform",
        }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} className={i > 0 ? "mt-1.5" : ""}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
