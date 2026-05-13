type AIOrbProps = {
  /** Diameter in pixels. Default 40. */
  size?: number;
  className?: string;
  /** If omitted, the orb is treated as decorative (aria-hidden). */
  "aria-label"?: string;
};

/**
 * AIOrb — circular mark with two flat linear gradients of orange tones
 * rotating in opposite directions. No radial highlight (avoids
 * the "sphere with shine" reading); the motion comes from the
 * gradients drifting and overlapping.
 *
 * Respects prefers-reduced-motion (animations disabled).
 */
export function AIOrb({
  size = 40,
  className = "",
  "aria-label": ariaLabel,
}: AIOrbProps) {
  const a11yProps = ariaLabel
    ? { role: "img" as const, "aria-label": ariaLabel }
    : { "aria-hidden": true as const };

  return (
    <span
      {...a11yProps}
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Primary linear gradient — half bright, half deep, rotates clockwise */}
      <span
        className="animate-orb-rotate-a absolute -inset-1/4"
        style={{
          background:
            "linear-gradient(135deg, #FFC591 0%, #FF7434 52%, #E45A1C 100%)",
        }}
      />

      {/* Secondary gradient — counter-rotating, brightens where it crosses */}
      <span
        className="animate-orb-rotate-b absolute -inset-1/4"
        style={{
          background:
            "linear-gradient(45deg, transparent 0%, #FFB87A 50%, transparent 100%)",
          mixBlendMode: "screen",
          opacity: 0.55,
        }}
      />

      {/* Subtle inner ring for crisp edge definition */}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-ink/15" />
    </span>
  );
}
