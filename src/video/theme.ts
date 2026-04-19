/**
 * Luck Lab video brand tokens — matches the website palette.
 */

export const COLORS = {
  bg: "#0a0a0d",
  bgCard: "#16161d",
  gold: "#c9a961",
  goldDim: "#a8893f",
  text: "#ededee",
  textMuted: "#9a9aa6",
  textSubtle: "#5a5a66",
  purple: "#a78bfa",
  border: "#25252f",
} as const;

export const FONTS = {
  display: "'Impact', 'Helvetica Neue', -apple-system, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "-apple-system, 'Helvetica Neue', sans-serif",
  mono: "'SF Mono', 'Fira Code', monospace",
} as const;

// 9:16 vertical (TikTok / Reels / Shorts)
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;
