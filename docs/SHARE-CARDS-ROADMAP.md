# Share Cards — Roadmap from MVP to Premium

## Current state (v3 — "The Altar" with Strongest/Quietest)

**Tech:** Next.js ImageResponse (Satori engine, Edge runtime)
**Quality ceiling:** ~7/10. System fonts, no textures, no shadows, no gradients on text.
**What it does well:** Fast, cheap, zero infrastructure, works everywhere.
**What it can't do:** Premium typography, textures, gold-foil effects, custom fonts.

## Phase 1 — NOW: Satori cards (what's shipped)

- 4 color palettes (midnight/light/minimal/aurora)
- Archetype name as focal point
- Strongest + Quietest lever (meaningful, not raw scores)
- Personal name, Greek text, tagline
- "Which archetype are you?" CTA
- Download + WhatsApp + X share buttons

**Good enough for launch.** Users CAN share. The viral mechanic EXISTS.

## Phase 2 — Week 2-3: Canva/Figma templates

**The real quality jump.** You design, code overlays.

### How it works:
1. Design 6 backgrounds in Canva (one per archetype):
   - The Seer: deep blue, eye motifs, constellation pattern
   - The Wanderer: earthy, path/compass, warm tones
   - The Steerer: bold, architectural, angular
   - The Yielder: flowing, water/silk, soft gold
   - The Weaver: web pattern, interconnected nodes
   - The Reader: book/scroll textures, deep green
2. Export as 1080x1920 PNG backgrounds
3. Place in `/public/cards/seer-bg.png`, etc.
4. Code overlays text (name, archetype, strongest/quietest) using `node-canvas` or Puppeteer
5. Result: stunning cards with real texture + perfect typography

**Cost:** €0 (Canva free) or €12/mo (Canva Pro for premium elements)
**Effort:** 2-3h design + 1h code
**Quality:** 9/10

### The archetype-specific design language:

| Archetype | Visual mood | Colors | Texture |
|---|---|---|---|
| Seer | Celestial, precise | Deep blue + silver | Star map, fine lines |
| Wanderer | Earthy, expansive | Warm amber + sage | Terrain contours, paths |
| Steerer | Architectural, bold | Charcoal + copper | Grid lines, angles |
| Yielder | Flowing, soft | Cream + muted gold | Water ripples, silk |
| Weaver | Connected, organic | Deep green + gold | Thread patterns, nodes |
| Reader | Literary, layered | Burgundy + ivory | Paper texture, margins |

## Phase 3 — Month 2: AI-generated unique cards

Each user gets a TRULY unique card with AI-generated imagery.

### How it works:
1. After the Reading generates, call DALL-E 3 or Midjourney API:
   - Prompt: "Minimal abstract art for The Yielder archetype, flowing water theme, gold and cream palette, 1080x1920, no text"
2. Overlay the text (name, archetype, levers) on the generated image
3. Cache the image (Supabase Storage or Vercel Blob)
4. User downloads their one-of-a-kind card

**Cost:** ~€0.04 per image (DALL-E 3) + storage
**Quality:** 10/10 (every card is unique = more shareable)
**Risk:** AI image quality varies; need a fallback to Phase 2 templates

## Phase 4 — Month 3+: Video reveals (Remotion)

Port the same design system to animated MP4.

### Stack:
- Remotion (React → MP4)
- Remotion Lambda or Cloud Run for server-side rendering
- Same archetype-specific backgrounds as Phase 2/3
- 15-second reveal animation

### The video structure:
```
0-2s:   Background texture fades in
2-4s:   "THE" appears, then archetype name scales up
4-6s:   Strongest / Quietest fade in from sides
6-8s:   Tagline types itself letter by letter
8-10s:  Subtle particle effect (gold dust / water / starfield per archetype)
10-13s: "Which archetype are you?" + URL
13-15s: Hold — clean end frame for screenshots
```

**Cost:** ~€0.02-0.05 per video
**Quality:** 11/10 (video > image in every algorithm)

## Decision framework

| Signal | Action |
|---|---|
| Launch: <50 share card downloads in week 1 | Keep Phase 1, focus on other growth levers |
| 50+ downloads in week 1 | Move to Phase 2 (Canva templates) — users WANT to share |
| 200+ downloads in month 1 | Move to Phase 3 (AI-generated unique) — sharing is the growth engine |
| Consistent sharing + TikTok traction | Move to Phase 4 (video) — compound the viral loop |

## The principle

Don't invest in sharing infrastructure ahead of sharing behaviour. The current Satori cards prove the mechanic works. Upgrade the quality only when the data shows people actually share.
