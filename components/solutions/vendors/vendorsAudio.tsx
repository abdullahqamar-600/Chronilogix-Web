"use client";

/**
 * vendorsAudio — one <audio> element, two UI surfaces.
 *
 * The vendor page is anchored by a narrated first-person track. Rather
 * than mount two independent <audio> elements (and risk them drifting
 * out of sync), we mount one hidden element inside a context provider
 * at the top of the page and expose two visual surfaces:
 *
 *   • VendorsAudioCard — the large "listen" card that lives inside the
 *     hero. Reads as an editorial audio block, not a UI control.
 *   • VendorsStickyAudio — a compact bar that slides in from the bottom
 *     of the viewport once the hero card scrolls out of view.
 *
 * Both surfaces mirror the same play state, currentTime, and duration.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const AUDIO_SRC = "/audio/chronilogix-vendor-track.m4a";
const TRACK_TITLE = "A message to chronic care product vendors";
const TRACK_SUBTITLE = "Narrated · 2:19";

type AudioCtx = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  toggle: () => void;
  seekTo: (t: number) => void;
  // Registered by the hero card so the sticky bar knows when it is
  // out of view and should reveal itself.
  registerAnchor: (el: HTMLElement | null) => void;
  anchorVisible: boolean;
};

const VendorsAudioContext = createContext<AudioCtx | null>(null);

export function VendorsAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorVisible, setAnchorVisible] = useState(true);

  // Sync <audio> events → React state.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onDur = () => setDuration(el.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  // Watch the hero card so the sticky bar can reveal on scroll-past.
  useEffect(() => {
    if (!anchorEl) return;
    const io = new IntersectionObserver(
      ([entry]) => setAnchorVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-40px 0px 0px 0px" },
    );
    io.observe(anchorEl);
    return () => io.disconnect();
  }, [anchorEl]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {
        // Autoplay policies can reject; the play button click itself is
        // a user gesture so this rarely triggers, but we swallow silently.
      });
    } else {
      el.pause();
    }
  }, []);

  const seekTo = useCallback((t: number) => {
    const el = audioRef.current;
    if (!el) return;
    if (!isFinite(t)) return;
    el.currentTime = Math.max(0, Math.min(t, el.duration || t));
  }, []);

  const registerAnchor = useCallback((el: HTMLElement | null) => {
    setAnchorEl(el);
  }, []);

  const value = useMemo<AudioCtx>(
    () => ({ isPlaying, currentTime, duration, toggle, seekTo, registerAnchor, anchorVisible }),
    [isPlaying, currentTime, duration, toggle, seekTo, registerAnchor, anchorVisible],
  );

  return (
    <VendorsAudioContext.Provider value={value}>
      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />
      {children}
    </VendorsAudioContext.Provider>
  );
}

function useVendorsAudio() {
  const ctx = useContext(VendorsAudioContext);
  if (!ctx) {
    throw new Error("useVendorsAudio must be used within VendorsAudioProvider");
  }
  return ctx;
}

// ── UI surface: hero card ────────────────────────────────────────────

/**
 * VendorsAudioCard — the "listen" block inside the hero. Editorial in
 * feel: large play affordance, animated bar visualization, title
 * treatment matching the rest of the hero.
 */
export function VendorsAudioCard() {
  const { isPlaying, currentTime, duration, toggle, seekTo, registerAnchor } = useVendorsAudio();

  return (
    <div
      ref={registerAnchor}
      className="relative overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[0_1px_2px_rgba(15,20,25,0.04),0_18px_48px_-24px_rgba(228,90,28,0.28)]"
    >
      {/* Warm wash bleeding in from the top-left, matching hero glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 0% 0%, rgba(249,144,77,0.14), transparent 70%), radial-gradient(50% 50% at 100% 100%, rgba(228,90,28,0.08), transparent 70%)",
        }}
      />

      <div className="relative flex items-center gap-5 px-5 py-5 md:gap-6 md:px-7 md:py-6">
        <PlayButton isPlaying={isPlaying} onClick={toggle} size="lg" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow-subtle">Play the vendor pitch</p>
              <p className="mt-1 truncate text-[15px] font-medium text-ink md:text-base">
                {TRACK_TITLE}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink-muted">
              {formatTime(currentTime)} / {formatTime(duration || 139)}
            </span>
          </div>

          <BarVisualizer
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />
        </div>
      </div>
    </div>
  );
}

// ── UI surface: sticky bar ───────────────────────────────────────────

/**
 * VendorsStickyAudio — compact bar fixed to the bottom of the viewport
 * once the hero card is no longer in view. Slides in from below.
 */
export function VendorsStickyAudio() {
  const { isPlaying, currentTime, duration, toggle, seekTo, anchorVisible } = useVendorsAudio();
  const visible = !anchorVisible;

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-2 pb-2 transition-all duration-500 ease-out-quart motion-reduce:transition-none md:px-3 md:pb-3 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto flex w-full max-w-[1200px] items-center gap-4 rounded-2xl border border-ink/8 bg-white/95 px-4 py-3 shadow-[0_2px_6px_rgba(15,20,25,0.06),0_24px_60px_-24px_rgba(15,20,25,0.28)] backdrop-blur-md md:gap-5 md:px-5 md:py-4`}
      >
        <PlayButton isPlaying={isPlaying} onClick={toggle} size="sm" />

        <div className="hidden min-w-0 flex-col md:flex">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-brand-700">
            Now playing
          </span>
          <span className="truncate text-[13px] font-medium text-ink">{TRACK_TITLE}</span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="hidden shrink-0 font-mono text-[11px] tabular-nums text-ink-muted md:inline">
            {formatTime(currentTime)}
          </span>
          <ProgressBar
            currentTime={currentTime}
            duration={duration || 139}
            onSeek={seekTo}
            compact
          />
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
            {formatTime(duration ? duration - currentTime : 139 - currentTime)}
          </span>
        </div>

        <span className="hidden text-[11px] font-medium uppercase tracking-[0.08em] text-ink-subtle sm:inline">
          {TRACK_SUBTITLE.split("·")[0].trim()}
        </span>
      </div>
    </div>
  );
}

// ── Building blocks ─────────────────────────────────────────────────

function PlayButton({
  isPlaying,
  onClick,
  size,
}: {
  isPlaying: boolean;
  onClick: () => void;
  size: "sm" | "lg";
}) {
  const dim = size === "lg" ? "h-16 w-16 md:h-20 md:w-20" : "h-11 w-11";
  const iconSize = size === "lg" ? 22 : 14;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
      className={`group/play relative flex ${dim} shrink-0 items-center justify-center rounded-full bg-ink text-white shadow-[0_2px_6px_rgba(15,20,25,0.14),0_16px_32px_-14px_rgba(228,90,28,0.55)] transition-all duration-300 ease-out motion-reduce:transition-none hover:bg-brand-accent hover:shadow-[0_2px_10px_rgba(255,116,52,0.35),0_20px_40px_-14px_rgba(255,116,52,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2`}
    >
      {/* Pulsing halo when playing — subtle brand echo. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-full ring-2 ring-brand-accent/40 transition-opacity duration-300 ${
          isPlaying ? "animate-ping opacity-60" : "opacity-0"
        }`}
      />
      {isPlaying ? (
        <PauseGlyph size={iconSize} />
      ) : (
        <PlayGlyph size={iconSize} />
      )}
    </button>
  );
}

function PlayGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden
      style={{ marginLeft: size > 18 ? 2 : 1 }}
    >
      <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

// Bar visualizer — 42 vertical bars, click/drag to seek. When playing,
// bars past the playhead breathe with a subtle staggered animation.
function BarVisualizer({
  isPlaying,
  currentTime,
  duration,
  onSeek,
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const BARS = 42;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const durSafe = duration || 139;
  const progress = Math.min(1, currentTime / durSafe);

  // Deterministic pseudo-random bar heights (no Math.random so SSR
  // stays stable). Curve favours mid-range with a couple of taller
  // spikes to mimic real speech energy.
  const heights = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < BARS; i++) {
      const t = i / (BARS - 1);
      const base = 0.35 + 0.35 * Math.sin(t * Math.PI); // 0.35 → 0.7 arc
      const jitter = 0.18 * Math.sin(i * 1.7) * Math.cos(i * 0.9);
      const spike =
        i === 6 || i === 17 || i === 28 || i === 35 ? 0.22 : 0;
      out.push(Math.max(0.22, Math.min(0.95, base + jitter + spike)));
    }
    return out;
  }, []);

  const handleSeek = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(ratio * durSafe);
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Seek audio"
      aria-valuemin={0}
      aria-valuemax={Math.round(durSafe)}
      aria-valuenow={Math.round(currentTime)}
      tabIndex={0}
      onClick={(e) => handleSeek(e.clientX)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onSeek(currentTime + 5);
        if (e.key === "ArrowLeft") onSeek(currentTime - 5);
      }}
      className="group/scrub relative flex h-10 cursor-pointer items-center gap-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      {heights.map((h, i) => {
        const t = i / (BARS - 1);
        const played = t <= progress;
        return (
          <span
            key={i}
            className="relative flex-1 rounded-full transition-colors duration-200 ease-out-quart motion-reduce:transition-none"
            style={{
              height: `${h * 100}%`,
              backgroundColor: played ? "#E45A1C" : "#E9E4DB",
              transform: isPlaying && played ? "scaleY(1)" : "scaleY(1)",
              animation:
                isPlaying && played
                  ? `barPulse 900ms ease-in-out ${i * 40}ms infinite alternate`
                  : undefined,
            }}
          />
        );
      })}

      <style jsx>{`
        @keyframes barPulse {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(1.18); }
        }
      `}</style>
    </div>
  );
}

// Slim linear progress — used by the sticky bar.
function ProgressBar({
  currentTime,
  duration,
  onSeek,
  compact,
}: {
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  const handleSeek = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Seek audio"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(currentTime)}
      onClick={(e) => handleSeek(e.clientX)}
      className={`relative flex-1 cursor-pointer overflow-hidden rounded-full bg-ink/10 ${
        compact ? "h-1" : "h-1.5"
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-brand-700 transition-[width] duration-100 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />
      <div
        aria-hidden
        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-brand-700 shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-100 ease-linear"
        style={{ left: `calc(${progress * 100}% - 6px)`, opacity: progress > 0 ? 1 : 0 }}
      />
    </div>
  );
}

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
