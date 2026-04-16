import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * Personalized share card — generates a 1080x1920 PNG (Stories/Reels format).
 *
 * Usage: /api/share-card?name=Collin&archetype=The+Yielder&greek=ὁ+ἐνδιδούς&tagline=You+win+by+releasing+the+grip&scores=18,0,36,44,14,9
 *
 * The user downloads this and posts it on Instagram Stories, WhatsApp Status,
 * TikTok, wherever. Every card has "kairos.lab/reading" at the bottom = free distribution.
 */

export const runtime = "edge";

const MECHANISM_NAMES = ["Attention", "Openness", "Action", "Surrender", "Connection", "Meaning"];

const STYLES = {
  midnight: {
    bg: "linear-gradient(180deg, #0a0a0d 0%, #12121a 40%, #16161d 100%)",
    text: "#ededee",
    accent: "#c9a961",
    accentBright: "#e6c87a",
    muted: "#9a9aa6",
    subtle: "#5a5a66",
    barBg: "#25252f",
    barFrom: "#8a7442",
  },
  light: {
    bg: "linear-gradient(180deg, #faf8f3 0%, #f5f0e6 40%, #ede6d6 100%)",
    text: "#1a1406",
    accent: "#8a7442",
    accentBright: "#6b5a30",
    muted: "#6b6560",
    subtle: "#a09890",
    barBg: "#e0d5c0",
    barFrom: "#c9a961",
  },
  minimal: {
    bg: "#000000",
    text: "#ffffff",
    accent: "#ffffff",
    accentBright: "#ffffff",
    muted: "#888888",
    subtle: "#555555",
    barBg: "#222222",
    barFrom: "#666666",
  },
  aurora: {
    bg: "linear-gradient(135deg, #0c0a1a 0%, #1a0e2e 30%, #0e1a2e 60%, #0a1a1a 100%)",
    text: "#e8e0f0",
    accent: "#a78bfa",
    accentBright: "#c4b0ff",
    muted: "#9a8ab6",
    subtle: "#6b5a8a",
    barBg: "#2a2040",
    barFrom: "#6b5ab0",
  },
} as const;

type StyleKey = keyof typeof STYLES;

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const name = p.get("name") || "Friend";
  const archetype = p.get("archetype") || "The Seer";
  const greek = p.get("greek") || "";
  const tagline = p.get("tagline") || "";
  const scoresRaw = p.get("scores") || "50,50,50,50,50,50";
  const scores = scoresRaw.split(",").map(Number);
  const styleKey = (p.get("style") as StyleKey) || "midnight";
  const s = STYLES[styleKey] || STYLES.midnight;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 60px",
          background: s.bg,
          color: s.text,
          fontFamily: "serif",
        }}
      >
        {/* Top — branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: s.accent }} />
          <div style={{ fontSize: 16, letterSpacing: 6, textTransform: "uppercase", color: s.accent, fontFamily: "monospace" }}>
            KAIROS LAB
          </div>
        </div>

        {/* Middle — the reveal */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flex: 1, justifyContent: "center" }}>
          <div style={{ fontSize: 20, color: s.muted, fontFamily: "monospace", letterSpacing: 3 }}>
            TYCHE READ FOR
          </div>
          <div style={{ fontSize: 42, color: s.text, fontWeight: 300, letterSpacing: 2 }}>
            {name.split(/\s+/)[0].toUpperCase()}
          </div>

          <div style={{ width: 120, height: 1, background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`, margin: "16px 0" }} />

          <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: -1, color: s.accentBright, textAlign: "center", lineHeight: 1.05 }}>
            {archetype.replace(/^The\s+/i, "")}
          </div>

          {greek && (
            <div style={{ fontSize: 22, color: s.subtle, fontFamily: "monospace", letterSpacing: 2 }}>
              {greek}
            </div>
          )}

          {tagline && (
            <div style={{ fontSize: 24, color: s.muted, fontStyle: "italic", textAlign: "center", maxWidth: 800, marginTop: 8, lineHeight: 1.4 }}>
              {`"${tagline}"`}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 700, marginTop: 40 }}>
            {MECHANISM_NAMES.map((mName, i) => {
              const score = scores[i] ?? 50;
              return (
                <div key={mName} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 120, fontSize: 14, color: s.muted, fontFamily: "monospace", textAlign: "right", letterSpacing: 1 }}>
                    {mName.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, height: 6, background: s.barBg, borderRadius: 3, overflow: "hidden", display: "flex" }}>
                    <div style={{
                      width: `${score}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${s.barFrom}, ${s.accentBright})`,
                      borderRadius: 3,
                    }} />
                  </div>
                  <div style={{ width: 40, fontSize: 14, color: s.accent, fontFamily: "monospace", letterSpacing: 1 }}>
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom — CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 22, color: s.text, letterSpacing: 1 }}>
            Which archetype are you?
          </div>
          <div style={{ fontSize: 16, fontFamily: "monospace", color: s.accent, letterSpacing: 4 }}>
            KAIROS.LAB/READING · FREE · 3 MIN
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 },
  );
}
