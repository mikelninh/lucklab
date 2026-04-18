/**
 * Premium share card — composites text over archetype-specific PNG backgrounds.
 *
 * The backgrounds are hand-designed (Claude Design / Canva) at 1080×1920.
 * This endpoint loads the background, overlays personalized text, and returns
 * a beautiful PNG that users download and share on Instagram/TikTok/WhatsApp.
 */

import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "node:path";
import fs from "node:fs";

export const runtime = "nodejs";
export const maxDuration = 15;

const WIDTH = 1080;
const HEIGHT = 1920;

// Text color per archetype (tuned to each background)
const COLORS: Record<string, { fg: string; muted: string; accent: string }> = {
  seer:     { fg: "#dfe4ef", muted: "rgba(223,228,239,0.7)", accent: "rgba(223,228,239,0.5)" },
  wanderer: { fg: "#3b2a18", muted: "rgba(59,42,24,0.7)", accent: "rgba(59,42,24,0.5)" },
  steerer:  { fg: "#e5c79b", muted: "rgba(229,199,155,0.7)", accent: "rgba(229,199,155,0.5)" },
  yielder:  { fg: "#6a5328", muted: "rgba(106,83,40,0.7)", accent: "rgba(106,83,40,0.5)" },
  weaver:   { fg: "#e2c690", muted: "rgba(226,198,144,0.7)", accent: "rgba(226,198,144,0.5)" },
  reader:   { fg: "#ecdfc6", muted: "rgba(236,223,198,0.7)", accent: "rgba(236,223,198,0.5)" },
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const name = (q.get("name") || "").split(" ")[0].toUpperCase();
  const archetype = (q.get("archetype") || "The Seer").replace(/^The\s+/i, "");
  const archetypeId = archetype.toLowerCase();
  const tagline = q.get("tagline") || "";
  const strongest = q.get("strongest") || "";
  const quietest = q.get("quietest") || "";

  const c = COLORS[archetypeId] || COLORS.seer;

  // Load background image
  const bgPath = path.join(process.cwd(), "public", "archetypes", `${archetypeId}.png`);
  if (!fs.existsSync(bgPath)) {
    return NextResponse.json({ error: `No background for ${archetypeId}` }, { status: 404 });
  }

  try {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    // Draw background
    const bg = await loadImage(bgPath);
    ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);

    // ─── TEXT OVERLAY ───
    // Sizes calibrated to 1080px canvas (≈3x the CSS px in the preview HTML)

    // Name (top area, small monospace, letter-spaced)
    ctx.textAlign = "center";
    ctx.fillStyle = c.muted;
    ctx.font = '500 30px "Courier New", monospace';
    if (name) {
      ctx.fillText(name, WIDTH / 2, HEIGHT * 0.17);
    }

    // Archetype name (center, large serif — THE star of the card)
    ctx.fillStyle = c.fg;
    const fontSize = archetype.length > 7 ? 140 : 170;
    ctx.font = `400 ${fontSize}px "Times New Roman", Georgia, serif`;
    ctx.fillText(archetype, WIDTH / 2, HEIGHT * 0.485);

    // Tagline (below name, italic serif)
    if (tagline) {
      ctx.fillStyle = c.muted;
      ctx.font = 'italic 46px "Times New Roman", Georgia, serif';

      const maxWidth = WIDTH * 0.72;
      const words = tagline.split(" ");
      let line = "";
      let y = HEIGHT * 0.555;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line.trim(), WIDTH / 2, y);
          line = word + " ";
          y += 60;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), WIDTH / 2, y);
    }

    // Strongest / Quietest
    if (strongest && quietest) {
      // Labels
      ctx.font = '500 26px "Courier New", monospace';
      ctx.fillStyle = c.accent;
      ctx.fillText("STRONGEST", WIDTH * 0.28, HEIGHT * 0.74);
      ctx.fillText("QUIETEST", WIDTH * 0.72, HEIGHT * 0.74);

      // Values
      ctx.font = '400 42px "Times New Roman", Georgia, serif';
      ctx.fillStyle = c.fg;
      ctx.fillText(strongest, WIDTH * 0.28, HEIGHT * 0.78);
      ctx.fillStyle = c.muted;
      ctx.fillText(quietest, WIDTH * 0.72, HEIGHT * 0.78);
    }

    // CTA
    ctx.fillStyle = c.muted;
    ctx.font = '400 36px "Times New Roman", Georgia, serif';
    ctx.fillText("Which archetype are you?", WIDTH / 2, HEIGHT * 0.895);

    ctx.fillStyle = c.accent;
    ctx.font = '500 26px "Courier New", monospace';
    ctx.fillText("LUCKLAB.APP", WIDTH / 2, HEIGHT * 0.925);

    // Export
    const buffer = canvas.toBuffer("image/png");
    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="lucklab-${archetypeId}-${name.toLowerCase() || "reading"}.png"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[share-card]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
