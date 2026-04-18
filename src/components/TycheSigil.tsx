/**
 * Tyche's Sigil — classical iconography unified
 * Cornucopia (abundance) · Rudder (steering fate) · Wheel (fortune)
 * Rendered as a single minimalist mark
 */
export function TycheSigil({
  size = 96,
  className = "",
  glow = true,
}: {
  size?: number;
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Tyche sigil"
    >
      <defs>
        <radialGradient id="tyche-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4b0ff" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tyche-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b0ff" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="gold-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c87a" />
          <stop offset="100%" stopColor="#c9a961" />
        </linearGradient>
      </defs>

      {glow && <circle cx="60" cy="60" r="58" fill="url(#tyche-glow)" />}

      {/* Outer wheel of fortune — 12 spokes for 12 traditions */}
      <circle cx="60" cy="60" r="44" stroke="url(#tyche-stroke)" strokeWidth="0.6" opacity="0.5" />
      <circle cx="60" cy="60" r="38" stroke="url(#tyche-stroke)" strokeWidth="0.4" opacity="0.3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 60 + Math.cos(angle) * 38;
        const y1 = 60 + Math.sin(angle) * 38;
        const x2 = 60 + Math.cos(angle) * 44;
        const y2 = 60 + Math.sin(angle) * 44;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#gold-stroke)"
            strokeWidth="0.8"
            opacity={i % 3 === 0 ? 1 : 0.5}
          />
        );
      })}

      {/* Cornucopia — stylized curve (horn of abundance) */}
      <path
        d="M 42 72 Q 36 68 38 58 Q 42 48 52 44 Q 62 42 68 48"
        stroke="url(#gold-stroke)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cornucopia mouth — abundance pouring out */}
      <circle cx="68" cy="50" r="1.2" fill="#e6c87a" />
      <circle cx="72" cy="54" r="0.8" fill="#c9a961" opacity="0.8" />
      <circle cx="70" cy="58" r="1" fill="#e6c87a" opacity="0.6" />
      <circle cx="74" cy="60" r="0.6" fill="#c9a961" opacity="0.5" />

      {/* Rudder — vertical element with crossbar (steering fate) */}
      <line x1="60" y1="28" x2="60" y2="72" stroke="url(#tyche-stroke)" strokeWidth="0.8" opacity="0.7" />
      <line x1="52" y1="34" x2="68" y2="34" stroke="url(#tyche-stroke)" strokeWidth="0.8" opacity="0.7" />

      {/* Center — the kairotic point */}
      <circle cx="60" cy="60" r="3" fill="url(#tyche-stroke)" />
      <circle cx="60" cy="60" r="1.2" fill="#ffffff" />
    </svg>
  );
}

export function KairosMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <defs>
          <linearGradient id="km-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e6c87a" />
            <stop offset="100%" stopColor="#c9a961" />
          </linearGradient>
        </defs>
        {/* K-shaped mark: vertical line + angled strokes meeting at a central point (kairos = the point) */}
        <line x1="6" y1="4" x2="6" y2="20" stroke="url(#km-g)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="6" y1="12" x2="18" y2="4" stroke="url(#km-g)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="6" y1="12" x2="18" y2="20" stroke="url(#km-g)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="6" cy="12" r="2" fill="url(#km-g)" />
      </svg>
      <span className="font-display text-[17px] font-medium tracking-tight text-[var(--text)]">
        Luck <span className="text-[var(--text-muted)] font-normal">Lab</span>
      </span>
    </div>
  );
}
