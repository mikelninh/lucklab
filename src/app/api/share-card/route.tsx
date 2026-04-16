import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * Share card v2 — "The Altar" design.
 *
 * Design philosophy:
 * - The archetype name is a TITLE BESTOWED, not a quiz result
 * - Vertical rhythm: line / brand / space / THE / ARCHETYPE / ornament / tagline / space / CTA
 * - Every element serves the hierarchy; nothing decorative without purpose
 * - Beautiful enough for Instagram Stories, mysterious enough to stop the scroll
 *
 * References: Co-Star cards, Aesop packaging, Nolan title cards, Dieter Rams
 */

export const runtime = "edge";

type Palette = {
  bg: string;
  text: string;
  accent: string;
  accentHalf: string;
  glow: string;
  muted: string;
  faint: string;
  line: string;
  altar: string;
};

const P: Record<string, Palette> = {
  midnight: {
    bg: "#08080b",
    text: "#f0f0f2",
    accent: "#d4b164",
    accentHalf: "rgba(212, 177, 100, 0.45)",
    glow: "rgba(212, 177, 100, 0.05)",
    muted: "#78787f",
    faint: "#2e2e36",
    line: "rgba(212, 177, 100, 0.18)",
    altar: "rgba(212, 177, 100, 0.03)",
  },
  light: {
    bg: "#f8f5ef",
    text: "#1a1810",
    accent: "#8a7442",
    accentHalf: "rgba(138, 116, 66, 0.45)",
    glow: "rgba(138, 116, 66, 0.06)",
    muted: "#8a8578",
    faint: "#c8c0b0",
    line: "rgba(138, 116, 66, 0.18)",
    altar: "rgba(138, 116, 66, 0.04)",
  },
  minimal: {
    bg: "#000000",
    text: "#ffffff",
    accent: "#ffffff",
    accentHalf: "rgba(255, 255, 255, 0.40)",
    glow: "rgba(255, 255, 255, 0.03)",
    muted: "#606060",
    faint: "#2a2a2a",
    line: "rgba(255, 255, 255, 0.10)",
    altar: "rgba(255, 255, 255, 0.02)",
  },
  aurora: {
    bg: "#080610",
    text: "#e4ddf0",
    accent: "#b8a0f0",
    accentHalf: "rgba(184, 160, 240, 0.45)",
    glow: "rgba(184, 160, 240, 0.05)",
    muted: "#7a6f96",
    faint: "#252040",
    line: "rgba(184, 160, 240, 0.18)",
    altar: "rgba(184, 160, 240, 0.03)",
  },
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const name = (q.get("name") || "").split(" ")[0];
  const rawArchetype = q.get("archetype") || "The Seer";
  const archetype = rawArchetype.replace(/^The\s+/i, "");
  const greek = q.get("greek") || "";
  const tagline = q.get("tagline") || "";
  const strongest = q.get("strongest") || "";
  const quietest = q.get("quietest") || "";
  const c = P[q.get("style") || "midnight"] || P.midnight;

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: c.bg,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Ambient glow — subtle depth behind the altar */}
          <div
            style={{
              position: "absolute",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              backgroundColor: c.glow,
              top: "32%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          {/* ============ TOP ZONE ============ */}
          <div
            style={{
              position: "absolute",
              top: "90px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "18px",
            }}
          >
            {/* Top decorative line */}
            <div
              style={{
                width: "180px",
                height: "1px",
                backgroundColor: c.line,
              }}
            />
            {/* KAIROS wordmark */}
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "10px",
                color: c.muted,
                fontFamily: "monospace",
                opacity: 0.5,
              }}
            >
              KAIROS
            </span>
          </div>

          {/* ============ CENTER — THE ALTAR ============ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              padding: "80px 60px",
            }}
          >
            {/* Faint altar background */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "-40px",
                right: "-40px",
                bottom: "0",
                backgroundColor: c.altar,
                borderTop: `1px solid ${c.line}`,
                borderBottom: `1px solid ${c.line}`,
              }}
            />

            {/* Name — the person, quietly */}
            {name ? (
              <span
                style={{
                  fontSize: "13px",
                  color: c.faint,
                  fontFamily: "monospace",
                  letterSpacing: "8px",
                  marginBottom: "48px",
                  position: "relative",
                }}
              >
                {name.toUpperCase()}
              </span>
            ) : null}

            {/* "THE" — tiny, precious, above the archetype */}
            <span
              style={{
                fontSize: "13px",
                fontFamily: "monospace",
                letterSpacing: "14px",
                color: c.accentHalf,
                marginBottom: "14px",
                position: "relative",
              }}
            >
              THE
            </span>

            {/* ARCHETYPE NAME — the star of the entire card */}
            <span
              style={{
                fontSize: archetype.length > 7 ? "88px" : "100px",
                fontWeight: 200,
                color: c.accent,
                letterSpacing: "-2px",
                lineHeight: 1,
                textAlign: "center",
                position: "relative",
                fontFamily: "serif",
              }}
            >
              {archetype}
            </span>

            {/* Greek — exotic whisper */}
            {greek ? (
              <span
                style={{
                  fontSize: "15px",
                  color: c.faint,
                  fontFamily: "serif",
                  letterSpacing: "3px",
                  marginTop: "24px",
                  position: "relative",
                }}
              >
                {greek}
              </span>
            ) : null}

            {/* Ornamental dot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40px",
                marginBottom: "40px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: c.accent,
                  opacity: 0.4,
                }}
              />
            </div>

            {/* Tagline — the one evocative line */}
            {tagline ? (
              <span
                style={{
                  fontSize: "20px",
                  color: c.muted,
                  fontStyle: "italic",
                  fontFamily: "serif",
                  textAlign: "center",
                  maxWidth: "560px",
                  lineHeight: 1.6,
                  position: "relative",
                }}
              >
                {tagline}
              </span>
            ) : null}

            {/* Strongest / Quietest — two words that tell the whole story */}
            {strongest && quietest ? (
              <div
                style={{
                  display: "flex",
                  gap: "80px",
                  marginTop: "48px",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "5px", color: c.faint }}>
                    STRONGEST
                  </span>
                  <span style={{ fontSize: "18px", fontFamily: "serif", color: c.accent, letterSpacing: "1px" }}>
                    {strongest}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "5px", color: c.faint }}>
                    QUIETEST
                  </span>
                  <span style={{ fontSize: "18px", fontFamily: "serif", color: c.muted, letterSpacing: "1px" }}>
                    {quietest}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* ============ BOTTOM ZONE ============ */}
          <div
            style={{
              position: "absolute",
              bottom: "90px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: c.muted,
                letterSpacing: "2px",
                fontFamily: "serif",
                fontStyle: "italic",
                opacity: 0.6,
              }}
            >
              Which archetype are you?
            </span>
            {/* Bottom decorative line */}
            <div
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: c.line,
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                color: c.faint,
                letterSpacing: "8px",
              }}
            >
              KAIROS.LAB
            </span>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 },
    );
  } catch (err) {
    console.error("[share-card]", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
