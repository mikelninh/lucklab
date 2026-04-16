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

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const name = p.get("name") || "Friend";
  const archetype = p.get("archetype") || "The Seer";
  const greek = p.get("greek") || "";
  const tagline = p.get("tagline") || "";
  const scoresRaw = p.get("scores") || "50,50,50,50,50,50";
  const scores = scoresRaw.split(",").map(Number);

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
          background: "linear-gradient(180deg, #0a0a0d 0%, #12121a 40%, #16161d 100%)",
          color: "#ededee",
          fontFamily: "serif",
        }}
      >
        {/* Top — branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#c9a961" }} />
          <div style={{ fontSize: 16, letterSpacing: 6, textTransform: "uppercase", color: "#c9a961", fontFamily: "monospace" }}>
            KAIROS LAB
          </div>
        </div>

        {/* Middle — the reveal */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flex: 1, justifyContent: "center" }}>
          <div style={{ fontSize: 20, color: "#9a9aa6", fontFamily: "monospace", letterSpacing: 3 }}>
            TYCHE READ FOR
          </div>
          <div style={{ fontSize: 42, color: "#ededee", fontWeight: 300, letterSpacing: 2 }}>
            {name.split(/\s+/)[0].toUpperCase()}
          </div>

          {/* Divider */}
          <div style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, #c9a961, transparent)", margin: "16px 0" }} />

          {/* Archetype name */}
          <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: -1, color: "#e6c87a", textAlign: "center", lineHeight: 1.05 }}>
            {archetype.replace(/^The\s+/i, "")}
          </div>

          {/* Greek */}
          {greek && (
            <div style={{ fontSize: 22, color: "#5a5a66", fontFamily: "monospace", letterSpacing: 2 }}>
              {greek}
            </div>
          )}

          {/* Tagline */}
          {tagline && (
            <div style={{ fontSize: 24, color: "#9a9aa6", fontStyle: "italic", textAlign: "center", maxWidth: 800, marginTop: 8, lineHeight: 1.4 }}>
              &ldquo;{tagline}&rdquo;
            </div>
          )}

          {/* Score bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 700, marginTop: 40 }}>
            {MECHANISM_NAMES.map((name, i) => {
              const score = scores[i] ?? 50;
              return (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 120, fontSize: 14, color: "#9a9aa6", fontFamily: "monospace", textAlign: "right", letterSpacing: 1 }}>
                    {name.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, height: 6, background: "#25252f", borderRadius: 3, overflow: "hidden", display: "flex" }}>
                    <div style={{
                      width: `${score}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, #8a7442, ${score > 40 ? "#e6c87a" : "#c9a961"})`,
                      borderRadius: 3,
                    }} />
                  </div>
                  <div style={{ width: 40, fontSize: 14, color: "#c9a961", fontFamily: "monospace", letterSpacing: 1 }}>
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom — CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 22, color: "#ededee", letterSpacing: 1 }}>
            Which archetype are you?
          </div>
          <div style={{ fontSize: 16, fontFamily: "monospace", color: "#c9a961", letterSpacing: 4 }}>
            KAIROS.LAB/READING · FREE · 3 MIN
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 },
  );
}
