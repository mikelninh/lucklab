import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const LABELS = ["ATTENTION", "OPENNESS", "ACTION", "SURRENDER", "CONNECTION", "MEANING"];

const PALETTES: Record<string, { bg: string; text: string; accent: string; muted: string; barBg: string; barFill: string }> = {
  midnight: { bg: "#0a0a0d", text: "#ededee", accent: "#e6c87a", muted: "#9a9aa6", barBg: "#25252f", barFill: "#c9a961" },
  light:    { bg: "#faf8f3", text: "#1a1406", accent: "#8a7442", muted: "#6b6560", barBg: "#e0d5c0", barFill: "#c9a961" },
  minimal:  { bg: "#000000", text: "#ffffff", accent: "#ffffff", muted: "#888888", barBg: "#222222", barFill: "#888888" },
  aurora:   { bg: "#0c0a1a", text: "#e8e0f0", accent: "#c4b0ff", muted: "#9a8ab6", barBg: "#2a2040", barFill: "#a78bfa" },
};

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const name = (p.get("name") || "Friend").split(" ")[0];
  const archetype = (p.get("archetype") || "The Seer").replace(/^The\s+/i, "");
  const greek = p.get("greek") || "";
  const tagline = p.get("tagline") || "";
  const scores = (p.get("scores") || "50,50,50,50,50,50").split(",").map(Number);
  const c = PALETTES[p.get("style") || "midnight"] || PALETTES.midnight;

  try {
    return new ImageResponse(
      (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: c.bg, padding: "80px 60px", justifyContent: "space-between", fontFamily: "serif" }}>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: c.accent }} />
            <span style={{ fontSize: "16px", letterSpacing: "6px", color: c.accent, fontFamily: "monospace" }}>KAIROS LAB</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "18px", color: c.muted, fontFamily: "monospace", letterSpacing: "4px" }}>TYCHE READ FOR</span>
            <span style={{ fontSize: "40px", color: c.text, fontWeight: 300, letterSpacing: "3px" }}>{name.toUpperCase()}</span>

            <div style={{ width: "100px", height: "1px", backgroundColor: c.accent, margin: "16px 0" }} />

            <span style={{ fontSize: "68px", fontWeight: 300, color: c.accent, textAlign: "center", lineHeight: 1.05 }}>{archetype}</span>

            {greek ? <span style={{ fontSize: "20px", color: c.muted, fontFamily: "monospace", letterSpacing: "2px" }}>{greek}</span> : null}

            {tagline ? <span style={{ fontSize: "22px", color: c.muted, fontStyle: "italic", textAlign: "center", maxWidth: "800px", marginTop: "8px" }}>{'"' + tagline + '"'}</span> : null}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "650px", marginTop: "40px" }}>
              {LABELS.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ width: "120px", fontSize: "13px", color: c.muted, fontFamily: "monospace", textAlign: "right" }}>{label}</span>
                  <div style={{ display: "flex", flex: 1, height: "6px", backgroundColor: c.barBg, borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${scores[i] || 0}%`, height: "100%", backgroundColor: c.barFill, borderRadius: "3px" }} />
                  </div>
                  <span style={{ width: "36px", fontSize: "13px", color: c.accent, fontFamily: "monospace" }}>{scores[i] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "20px", color: c.text }}>Which archetype are you?</span>
            <span style={{ fontSize: "14px", fontFamily: "monospace", color: c.accent, letterSpacing: "4px" }}>KAIROS.LAB/READING</span>
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
