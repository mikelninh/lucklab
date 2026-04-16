import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * Share card — tarot card energy, not dashboard energy.
 *
 * Design philosophy:
 * - The card is an IDENTITY BADGE, not a report
 * - Three elements only: name, archetype, one line
 * - Beautiful enough to post on Instagram without explanation
 * - Mysterious enough that viewers WANT to know their archetype
 * - No scores, no bars, no data. That's for the Reading.
 */

export const runtime = "edge";

type Palette = {
  bg: string;
  text: string;
  accent: string;
  glow: string;
  muted: string;
  faint: string;
  line: string;
};

const P: Record<string, Palette> = {
  midnight: {
    bg: "#08080b",
    text: "#f0f0f2",
    accent: "#d4b164",
    glow: "rgba(212, 177, 100, 0.08)",
    muted: "#78787f",
    faint: "#2a2a32",
    line: "rgba(212, 177, 100, 0.2)",
  },
  light: {
    bg: "#f8f5ef",
    text: "#1a1810",
    accent: "#8a7442",
    glow: "rgba(138, 116, 66, 0.08)",
    muted: "#8a8578",
    faint: "#d8d0c0",
    line: "rgba(138, 116, 66, 0.2)",
  },
  minimal: {
    bg: "#000000",
    text: "#ffffff",
    accent: "#ffffff",
    glow: "rgba(255, 255, 255, 0.04)",
    muted: "#555555",
    faint: "#1a1a1a",
    line: "rgba(255, 255, 255, 0.1)",
  },
  aurora: {
    bg: "#080610",
    text: "#e4ddf0",
    accent: "#b8a0f0",
    glow: "rgba(184, 160, 240, 0.08)",
    muted: "#7a6f96",
    faint: "#1a1630",
    line: "rgba(184, 160, 240, 0.2)",
  },
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const name = (q.get("name") || "").split(" ")[0];
  const archetype = (q.get("archetype") || "The Seer").replace(/^The\s+/i, "");
  const greek = q.get("greek") || "";
  const tagline = q.get("tagline") || "";
  const c = P[q.get("style") || "midnight"] || P.midnight;

  try {
    return new ImageResponse(
      (
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: c.bg,
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 80px",
          position: "relative",
        }}>

          {/* Ambient glow — depth, not flatness */}
          <div style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            backgroundColor: c.glow,
            top: "35%",
            left: "50%",
            transform: "translateX(-50%)",
          }} />

          {/* Top whisper — just "KAIROS" */}
          <div style={{
            position: "absolute",
            top: "100px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: 0.4,
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: c.accent }} />
            <span style={{ fontSize: "10px", letterSpacing: "10px", color: c.muted, fontFamily: "monospace" }}>
              KAIROS
            </span>
          </div>

          {/* Center content — the identity */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0px",
            position: "relative",
          }}>

            {/* Thin line above */}
            <div style={{ width: "40px", height: "1px", backgroundColor: c.line, marginBottom: "48px" }} />

            {/* Name — quiet, contextual */}
            {name ? (
              <span style={{
                fontSize: "14px",
                color: c.faint,
                fontFamily: "monospace",
                letterSpacing: "8px",
                marginBottom: "40px",
              }}>
                {name.toUpperCase()}
              </span>
            ) : null}

            {/* THE ARCHETYPE — the entire point of the card */}
            <span style={{
              fontSize: "96px",
              fontWeight: 200,
              color: c.accent,
              letterSpacing: "-3px",
              lineHeight: 0.95,
              textAlign: "center",
            }}>
              {archetype}
            </span>

            {/* Greek — barely there, exotic texture */}
            {greek ? (
              <span style={{
                fontSize: "16px",
                color: c.faint,
                fontFamily: "monospace",
                letterSpacing: "4px",
                marginTop: "20px",
              }}>
                {greek}
              </span>
            ) : null}

            {/* Thin line below */}
            <div style={{ width: "40px", height: "1px", backgroundColor: c.line, margin: "48px 0" }} />

            {/* Tagline — the one sentence that makes them curious */}
            {tagline ? (
              <span style={{
                fontSize: "22px",
                color: c.muted,
                fontStyle: "italic",
                textAlign: "center",
                maxWidth: "640px",
                lineHeight: 1.5,
              }}>
                {'"' + tagline + '"'}
              </span>
            ) : null}
          </div>

          {/* Bottom — the invitation */}
          <div style={{
            position: "absolute",
            bottom: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            opacity: 0.5,
          }}>
            <span style={{ fontSize: "16px", color: c.muted, letterSpacing: "2px" }}>
              Which archetype are you?
            </span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: c.faint, letterSpacing: "8px" }}>
              KAIROS.LAB
            </span>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 },
    );
  } catch (err) {
    console.error("[share-card]", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
