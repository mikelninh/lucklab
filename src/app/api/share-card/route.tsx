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

    // Name (top center, monospace)
    ctx.textAlign = "center";
    ctx.fillStyle = c.muted;
    ctx.font = '500 12px "Courier New", monospace';
    if (name) {
      ctx.fillText(name, WIDTH / 2, HEIGHT * 0.18);
    }

    // Archetype name (center, large serif)
    ctx.fillStyle = c.fg;
    const fontSize = archetype.length > 7 ? 72 : 82;
    ctx.font = `300 ${fontSize}px "Times New Roman", Georgia, serif`;
    ctx.fillText(archetype, WIDTH / 2, HEIGHT * 0.48);

    // Tagline (below name, italic serif)
    if (tagline) {
      ctx.fillStyle = c.muted;
      ctx.font = 'italic 22px "Times New Roman", Georgia, serif';

      // Word wrap if needed
      const maxWidth = WIDTH * 0.7;
      const words = tagline.split(" ");
      let line = "";
      let y = HEIGHT * 0.54;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line.trim(), WIDTH / 2, y);
          line = word + " ";
          y += 32;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), WIDTH / 2, y);
    }

    // Strongest / Quietest (lower area, monospace)
    if (strongest && quietest) {
      ctx.font = '500 11px "Courier New", monospace';
      ctx.fillStyle = c.accent;

      // Left: strongest
      ctx.textAlign = "center";
      ctx.fillText("STRONGEST", WIDTH * 0.3, HEIGHT * 0.74);
      ctx.fillStyle = c.fg;
      ctx.font = '400 20px "Times New Roman", Georgia, serif';
      ctx.fillText(strongest, WIDTH * 0.3, HEIGHT * 0.77);

      // Right: quietest
      ctx.fillStyle = c.accent;
      ctx.font = '500 11px "Courier New", monospace';
      ctx.fillText("QUIETEST", WIDTH * 0.7, HEIGHT * 0.74);
      ctx.fillStyle = c.muted;
      ctx.font = '400 20px "Times New Roman", Georgia, serif';
      ctx.fillText(quietest, WIDTH * 0.7, HEIGHT * 0.77);
    }

    // CTA (bottom, monospace)
    ctx.textAlign = "center";
    ctx.fillStyle = c.muted;
    ctx.font = '400 16px "Times New Roman", Georgia, serif';
    ctx.fillText("Which archetype are you?", WIDTH / 2, HEIGHT * 0.89);

    ctx.fillStyle = c.accent;
    ctx.font = '500 11px "Courier New", monospace';
    ctx.fillText("LUCKLAB.APP", WIDTH / 2, HEIGHT * 0.92);

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
