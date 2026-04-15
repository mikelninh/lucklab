import { ImageResponse } from "next/og";

/**
 * Root-level Open Graph image — shown when the homepage is shared on
 * X, LinkedIn, Discord, Slack, iMessage, etc. Dynamic, built on the fly.
 */
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0a0a0d 0%, #16161d 70%, #1c1c25 100%)",
          color: "#ededee",
          fontFamily: "serif",
        }}
      >
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#c9a961",
            }}
          />
          <div
            style={{
              fontSize: 18,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#c9a961",
              fontFamily: "monospace",
            }}
          >
            KAIROS LAB
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              fontWeight: 300,
              color: "#ededee",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Luck is not random.</span>
            <span style={{ color: "#e6c87a", fontStyle: "italic" }}>
              It converges.
            </span>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#9a9aa6",
              maxWidth: 860,
              lineHeight: 1.35,
            }}
          >
            Twelve wisdom traditions, two decades of research, one trainable
            disposition. Guided by Tyche, our AI oracle.
          </div>
        </div>

        {/* bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            fontFamily: "monospace",
            letterSpacing: 3,
            color: "#5a5a66",
          }}
        >
          <span>KAIROS.LAB</span>
          <span>THE SCIENCE OF THE OPPORTUNE MOMENT</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
