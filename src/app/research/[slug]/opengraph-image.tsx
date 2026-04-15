import { ImageResponse } from "next/og";
import { loadArticleBySlug } from "@/lib/articles";

export const runtime = "nodejs"; // needs fs access for article loading
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleOG({
  params,
}: {
  params: { slug: string };
}) {
  const article = loadArticleBySlug(params.slug);
  const title = article?.title || "Kairos Lab";
  const description = article?.description || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0a0a0d 0%, #16161d 70%)",
          color: "#ededee",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#c9a961",
            }}
          />
          <div
            style={{
              fontSize: 15,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#c9a961",
              fontFamily: "monospace",
            }}
          >
            KAIROS LAB · RESEARCH
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 66,
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              fontWeight: 300,
              color: "#e6c87a",
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 24,
                color: "#9a9aa6",
                maxWidth: 1000,
                lineHeight: 1.4,
              }}
            >
              {description.length > 180 ? description.slice(0, 180) + "…" : description}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 16,
            fontFamily: "monospace",
            letterSpacing: 3,
            color: "#5a5a66",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>KAIROS.LAB/RESEARCH</span>
          <span>BEGIN YOUR READING · FREE</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
