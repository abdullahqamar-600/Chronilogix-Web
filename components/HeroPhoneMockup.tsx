"use client";

import { useEffect, useState } from "react";
import { AIOrb } from "@/components/AIOrb";

const CONVERSATION = {
  aiQuestion:
    "You mentioned last time that anxiety mostly shows up on Sunday evenings. What does that feel like when it starts?",
  userReply:
    "Like dread. I start thinking about everything I didn’t finish and everything waiting for me. My chest gets tight and I just want Monday to be over before it starts.",
  aiReflection:
    "So it’s less about Monday itself, and more about feeling behind before you’ve even begun. Like you’re already losing a race you haven’t started yet.",
};

const TYPE_SPEED = 18; // ms per char
const CYCLE_MS = 22000;

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

export function HeroPhoneMockup({ progress }: { progress: number }) {
  const phoneRiseLinear = clamp01((progress - 0.15) / (0.7 - 0.15));
  const phoneRise = easeInOutCubic(phoneRiseLinear);
  const phoneTranslateY = 100 - phoneRise * 75;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
      style={{
        transform: `translateY(${phoneTranslateY}%)`,
        willChange: "transform",
      }}
    >
      <div className="relative aspect-[671/1375] w-[clamp(260px,28vw,400px)]">
        <img
          src="/iphone/Iphone.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full select-none"
          draggable={false}
        />

        <ChatScreen active={phoneRise > 0.05} />

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

function ChatScreen({ active }: { active: boolean }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!active) {
      setCycle(0);
      return;
    }
    const interval = setInterval(() => {
      setCycle((c) => c + 1);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top: `${SCREEN.top}%`,
        left: `${SCREEN.left}%`,
        width: `${SCREEN.width}%`,
        height: `${SCREEN.height}%`,
        borderRadius: SCREEN.radius,
        background: "linear-gradient(180deg, #FFFBE8 0%, #FFE8AA 100%)",
        color: "#583C14",
      }}
    >
      {active && (
        <div key={cycle} className="flex h-full flex-col px-7 pb-7 pt-[14%]">
          {/* AI Orb */}
          <div
            style={{
              animation: "fadeUp 600ms ease-out 200ms forwards",
              opacity: 0,
            }}
          >
            <AIOrb size={22} />
          </div>

          {/* Greeting */}
          <h3
            className="mt-2 text-2xl font-medium leading-none tracking-tight"
            style={{
              animation: "fadeUp 600ms ease-out 500ms forwards",
              opacity: 0,
              color: "#583C14",
            }}
          >
            Hi!
          </h3>

          {/* AI Question — typewriter */}
          <Typewriter
            text={CONVERSATION.aiQuestion}
            startDelay={1500}
            speed={TYPE_SPEED}
            className="mt-3 text-[13px] leading-[1.45]"
          />

          {/* User Reply — fade-up bubble */}
          <div
            className="mt-5 flex justify-end"
            style={{
              animation: "fadeUp 600ms ease-out 5500ms forwards",
              opacity: 0,
            }}
          >
            <div
              className="max-w-[82%] rounded-2xl border px-3.5 py-2.5 text-[13px] leading-[1.45]"
              style={{
                background: "#FFFAE9",
                borderColor: "#FFF8DF",
                color: "#583C14",
              }}
            >
              {CONVERSATION.userReply}
            </div>
          </div>

          {/* AI Reflection — typewriter */}
          <Typewriter
            text={CONVERSATION.aiReflection}
            startDelay={8500}
            speed={TYPE_SPEED}
            className="mt-5 text-[13px] leading-[1.45]"
          />
        </div>
      )}
    </div>
  );
}

/** Character-by-character text reveal, with hidden-text spacer to
 *  prevent layout shift as text fills in. */
function Typewriter({
  text,
  startDelay,
  speed,
  className,
}: {
  text: string;
  startDelay: number;
  speed: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    let charTimer: ReturnType<typeof setInterval> | undefined;

    const startTimer = setTimeout(() => {
      charTimer = setInterval(() => {
        setVisible((v) => {
          const next = v + 1;
          if (next >= text.length && charTimer) {
            clearInterval(charTimer);
          }
          return Math.min(next, text.length);
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (charTimer) clearInterval(charTimer);
    };
  }, [text, startDelay, speed]);

  return (
    <p className={`relative ${className ?? ""}`} style={{ color: "#583C14" }}>
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span className="absolute inset-0">{text.slice(0, visible)}</span>
    </p>
  );
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
