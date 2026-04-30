"""
Luck Lab — 6 archetype card backgrounds (1080x1920 PNG, no text).
Text is overlayed by the app.

Shared design language:
  - Portrait 9:16, 1080x1920
  - Layered: gradient base -> atmospheric grain -> primary motif -> soft vignette
  - A thin inner rule (1px, ~60% opacity) frames each card like a tarot deck
  - Each archetype has its own visual world (palette + motif).
  - Center-upper motif, calmer lower half so overlay text reads well.
"""
from __future__ import annotations

import math
import os
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
W, H = 1080, 1920
OUT = Path("/sessions/sweet-wizardly-brown/mnt/kairos/public/archetypes")
OUT.mkdir(parents=True, exist_ok=True)


def clamp(v, lo=0, hi=255):
    return max(lo, min(hi, int(v)))


def hex2rgb(s: str) -> tuple[int, int, int]:
    s = s.lstrip("#")
    return tuple(int(s[i : i + 2], 16) for i in (0, 2, 4))


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def linear_gradient(
    size, top, bottom, angle_deg: float = 90.0
) -> Image.Image:
    """Linear gradient between two RGB tuples, angle in degrees (90 = vertical)."""
    w, h = size
    x, y = np.meshgrid(np.arange(w), np.arange(h))
    theta = math.radians(angle_deg - 90.0)
    proj = x * math.cos(theta) + y * math.sin(theta)
    t = (proj - proj.min()) / (proj.max() - proj.min() + 1e-9)
    top = np.array(top, dtype=np.float32)
    bot = np.array(bottom, dtype=np.float32)
    arr = top[None, None, :] * (1 - t[..., None]) + bot[None, None, :] * t[..., None]
    return Image.fromarray(arr.astype(np.uint8), "RGB")


def radial_gradient(
    size, center, inner, outer, radius: float
) -> Image.Image:
    """Radial gradient from inner -> outer RGB around center, fading over radius."""
    w, h = size
    cx, cy = center
    y, x = np.mgrid[0:h, 0:w]
    d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / radius
    d = np.clip(d, 0, 1)
    inner = np.array(inner, dtype=np.float32)
    outer = np.array(outer, dtype=np.float32)
    arr = inner[None, None, :] * (1 - d[..., None]) + outer[None, None, :] * d[..., None]
    return Image.fromarray(arr.astype(np.uint8), "RGB")


def add_grain(img: Image.Image, amount: float = 6.0, seed: int = 0) -> Image.Image:
    """Subtle monochrome grain so flat gradients don't feel plasticky."""
    rng = np.random.default_rng(seed)
    arr = np.asarray(img, dtype=np.float32)
    noise = rng.normal(0, amount, arr.shape[:2])
    arr = arr + noise[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def soft_vignette(img: Image.Image, strength: float = 0.45) -> Image.Image:
    """Darken edges with a radial falloff."""
    w, h = img.size
    cx, cy = w / 2, h / 2
    y, x = np.mgrid[0:h, 0:w]
    d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    d = d / d.max()
    mask = 1 - strength * (d ** 2.2)
    arr = np.asarray(img, dtype=np.float32) * mask[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def inner_frame(img: Image.Image, color: tuple[int, int, int], inset: int = 48, alpha: int = 90) -> Image.Image:
    """Thin rule line inset from edges — gives every card a shared 'deck' feel."""
    base = img.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rectangle(
        [inset, inset, img.size[0] - inset, img.size[1] - inset],
        outline=(*color, alpha),
        width=1,
    )
    return Image.alpha_composite(base, overlay).convert("RGB")


def corner_marks(img: Image.Image, color, inset=48, arm=28, alpha=110) -> Image.Image:
    """Small tick marks at the four corners of the inner frame."""
    base = img.convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    w, h = img.size
    col = (*color, alpha)
    for (cx, cy) in [(inset, inset), (w - inset, inset), (inset, h - inset), (w - inset, h - inset)]:
        d.line([(cx - arm, cy), (cx + arm, cy)], fill=col, width=1)
        d.line([(cx, cy - arm), (cx, cy + arm)], fill=col, width=1)
    return Image.alpha_composite(base, overlay).convert("RGB")


def draw_on(img: Image.Image, fn, alpha=None) -> Image.Image:
    """Render fn(draw) on a transparent layer then composite; optionally blur first."""
    base = img.convert("RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    fn(d)
    if alpha is not None:
        r, g, b, a = layer.split()
        a = a.point(lambda x: int(x * alpha))
        layer = Image.merge("RGBA", (r, g, b, a))
    return Image.alpha_composite(base, layer).convert("RGB")


def overlay_alpha(img: Image.Image, layer: Image.Image) -> Image.Image:
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


# ---------------------------------------------------------------------------
# 1. SEER — Celestial, precise, night sky. Deep blue + silver. Star chart, eye-motif.
# ---------------------------------------------------------------------------
def render_seer() -> Image.Image:
    random.seed(11)
    rng = np.random.default_rng(11)

    # base: deep indigo -> near black, with soft radial halo upper-center
    base = linear_gradient((W, H), hex2rgb("#0b1436"), hex2rgb("#020611"), angle_deg=100)
    halo = radial_gradient((W, H), (W / 2, H * 0.38), hex2rgb("#1c2a66"), hex2rgb("#0b1436"), radius=W * 0.9)
    base = Image.blend(base, halo, 0.55)

    # star field — tiny varied dots, denser upper half
    stars = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stars)
    for _ in range(420):
        x = rng.integers(20, W - 20)
        # bias upper
        y = int(H * (rng.beta(1.4, 2.6)))
        r = rng.choice([0, 0, 0, 0, 1, 1, 2])
        br = rng.integers(140, 240)
        sd.ellipse([x - r, y - r, x + r, y + r], fill=(br, br, 255, 230))
    # a few slightly larger, brighter stars
    for _ in range(22):
        x = rng.integers(80, W - 80)
        y = int(H * rng.beta(1.3, 2.4))
        r = rng.choice([2, 2, 3])
        sd.ellipse([x - r, y - r, x + r, y + r], fill=(235, 240, 255, 255))
        # cross gleam
        g = 10
        sd.line([(x - g, y), (x + g, y)], fill=(235, 240, 255, 140), width=1)
        sd.line([(x, y - g), (x, y + g)], fill=(235, 240, 255, 140), width=1)
    stars = stars.filter(ImageFilter.GaussianBlur(0.4))
    img = overlay_alpha(base, stars)

    # central concentric rings — the "eye" / celestial observatory
    cx, cy = W / 2, H * 0.42
    rings = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rings)
    silver = (198, 212, 240)
    for i, r in enumerate([120, 170, 220, 290, 380, 500]):
        alpha = 170 if i < 3 else 90 if i < 5 else 55
        rd.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            outline=(*silver, alpha),
            width=1,
        )
    # tick marks around the main ring
    main_r = 220
    for deg in range(0, 360, 10):
        th = math.radians(deg)
        x1 = cx + math.cos(th) * main_r
        y1 = cy + math.sin(th) * main_r
        x2 = cx + math.cos(th) * (main_r + (10 if deg % 30 == 0 else 5))
        y2 = cy + math.sin(th) * (main_r + (10 if deg % 30 == 0 else 5))
        rd.line([(x1, y1), (x2, y2)], fill=(*silver, 150), width=1)
    # iris: subtle filled disc
    for r, a in [(100, 50), (60, 70), (22, 140)]:
        rd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(170, 190, 230, a))
    img = overlay_alpha(img, rings)

    # constellation: connect 6 stars with thin silver lines
    const_pts = [
        (W * 0.18, H * 0.22),
        (W * 0.30, H * 0.34),
        (W * 0.44, H * 0.28),
        (W * 0.58, H * 0.40),
        (W * 0.74, H * 0.30),
        (W * 0.86, H * 0.46),
    ]
    cl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cl)
    for a, b in zip(const_pts, const_pts[1:]):
        cd.line([a, b], fill=(210, 220, 245, 90), width=1)
    for p in const_pts:
        cd.ellipse([p[0] - 3, p[1] - 3, p[0] + 3, p[1] + 3], fill=(240, 245, 255, 255))
    img = overlay_alpha(img, cl)

    img = add_grain(img, amount=4.0, seed=11)
    img = soft_vignette(img, strength=0.55)
    img = inner_frame(img, silver, alpha=70)
    img = corner_marks(img, silver, alpha=110)
    return img


# ---------------------------------------------------------------------------
# 2. WANDERER — Earthy, wide, horizon. Warm amber + sage. Topo contours, compass.
# ---------------------------------------------------------------------------
def render_wanderer() -> Image.Image:
    rng = np.random.default_rng(21)

    # Sky amber at top, softly fading to a lighter sage near the bottom.
    # A clearer horizon break at ~55% gives the card a landscape feel.
    top = hex2rgb("#dba475")       # warm amber
    mid = hex2rgb("#c6a47a")       # dusty amber/tan
    bot = hex2rgb("#8ea082")       # lighter sage
    y, _ = np.mgrid[0:H, 0:W]
    t = y / H
    arr = np.zeros((H, W, 3), dtype=np.float32)
    t_top = np.clip(t / 0.55, 0, 1)
    t_bot = np.clip((t - 0.55) / 0.45, 0, 1)
    for i in range(3):
        sky = np.array(top)[i] * (1 - t_top) + np.array(mid)[i] * t_top
        ground = np.array(mid)[i] * (1 - t_bot) + np.array(bot)[i] * t_bot
        arr[..., i] = np.where(t < 0.55, sky, ground)
    base = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")

    # Soft sun bloom near the horizon line
    halo = radial_gradient((W, H), (W / 2, H * 0.55), hex2rgb("#f1d39e"), hex2rgb("#c6a47a"), radius=W * 0.75)
    base = Image.blend(base, halo, 0.35)

    # Sparse topographic ridge lines — a single soft ridge system, not dense contours
    topo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(topo)
    ink = hex2rgb("#3c3a2c")
    # A low, wide set of ridges: wavy horizontal bands across the lower half
    for k in range(9):
        yh = int(H * 0.68) + k * 32
        amp = 18 - k * 1.4
        freq = 0.008 + k * 0.0012
        pts = [
            (x, yh + int(amp * math.sin(x * freq + k * 0.9) + amp * 0.5 * math.sin(x * freq * 2.3 + k)))
            for x in range(-20, W + 21, 6)
        ]
        td.line(pts, fill=(*ink, 110 - k * 8), width=1)
    # A cleaner horizon line
    yh = int(H * 0.55)
    td.line(
        [(x, yh + int(3 * math.sin(x / 260))) for x in range(-10, W + 11, 4)],
        fill=(*ink, 130),
        width=1,
    )
    topo = topo.filter(ImageFilter.GaussianBlur(0.25))
    img = overlay_alpha(base, topo)

    # compass rose upper-center
    cx, cy = W / 2, H * 0.30
    comp = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cd = ImageDraw.Draw(comp)
    amber = hex2rgb("#f0d098")
    ink2 = hex2rgb("#2f2b20")
    R = 170
    cd.ellipse([cx - R, cy - R, cx + R, cy + R], outline=(*ink2, 160), width=1)
    cd.ellipse([cx - R + 20, cy - R + 20, cx + R - 20, cy + R - 20], outline=(*ink2, 70), width=1)
    for deg in range(0, 360, 5):
        th = math.radians(deg - 90)
        r0 = R - 6 if deg % 45 == 0 else R - 3
        cd.line(
            [
                (cx + math.cos(th) * r0, cy + math.sin(th) * r0),
                (cx + math.cos(th) * R, cy + math.sin(th) * R),
            ],
            fill=(*ink2, 180 if deg % 45 == 0 else 110),
            width=1,
        )
    # four cardinal diamonds
    for deg in [0, 90, 180, 270]:
        th = math.radians(deg - 90)
        tip = (cx + math.cos(th) * (R - 15), cy + math.sin(th) * (R - 15))
        base_pt = (cx + math.cos(th) * 28, cy + math.sin(th) * 28)
        # build a thin diamond
        perp = (-math.sin(th), math.cos(th))
        width = 18
        p1 = (base_pt[0] + perp[0] * width, base_pt[1] + perp[1] * width)
        p2 = (base_pt[0] - perp[0] * width, base_pt[1] - perp[1] * width)
        cd.polygon([tip, p1, base_pt, p2], fill=(*amber, 220), outline=(*ink2, 200))
    cd.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(*ink2, 220))
    img = overlay_alpha(img, comp)

    # a meandering path wending from horizon toward the foreground
    path = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(path)
    pts = []
    for i in range(180):
        t_ = i / 180
        # perspective: starts narrow near horizon, widens closer
        x = W * 0.5 + (t_ - 0.2) * W * 0.45 * math.sin(t_ * 4.0 + 0.6) + (t_ ** 1.6) * 40
        y = H * (0.57 + 0.38 * t_)
        pts.append((x, y))
    pd.line(pts, fill=(*hex2rgb("#f1d39e"), 170), width=3)
    pd.line(pts, fill=(*hex2rgb("#3c3a2c"), 60), width=1)
    path = path.filter(ImageFilter.GaussianBlur(0.8))
    img = overlay_alpha(img, path)

    img = add_grain(img, amount=5.0, seed=21)
    img = soft_vignette(img, strength=0.4)
    img = inner_frame(img, amber, alpha=90)
    img = corner_marks(img, amber, alpha=130)
    return img


# ---------------------------------------------------------------------------
# 3. STEERER — Architectural, bold. Charcoal + copper. Grid lines, angles, rudder.
# ---------------------------------------------------------------------------
def render_steerer() -> Image.Image:
    base = linear_gradient((W, H), hex2rgb("#1c1c1f"), hex2rgb("#0e0e10"), angle_deg=100)

    # Faint grid: 60px major, 20px minor, copper tint
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    copper = hex2rgb("#b87333")
    for x in range(0, W + 1, 20):
        a = 22 if x % 60 else 55
        gd.line([(x, 0), (x, H)], fill=(*copper, a), width=1)
    for y in range(0, H + 1, 20):
        a = 22 if y % 60 else 55
        gd.line([(0, y), (W, y)], fill=(*copper, a), width=1)
    img = overlay_alpha(base, grid)

    # bold diagonal angles — architectural precision
    angles = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ad = ImageDraw.Draw(angles)
    ad.line([(0, H * 0.18), (W, H * 0.60)], fill=(*copper, 200), width=2)
    ad.line([(0, H * 0.82), (W, H * 0.50)], fill=(*copper, 90), width=1)
    # right-angle bracket top-left
    ad.line([(100, 260), (100, 420)], fill=(*copper, 220), width=2)
    ad.line([(100, 420), (300, 420)], fill=(*copper, 220), width=2)
    # bracket bottom-right
    ad.line([(W - 100, H - 260), (W - 100, H - 420)], fill=(*copper, 220), width=2)
    ad.line([(W - 100, H - 420), (W - 300, H - 420)], fill=(*copper, 220), width=2)
    img = overlay_alpha(img, angles)

    # Rudder / ship's-wheel motif — centered upper third
    cx, cy = W / 2, H * 0.38
    wheel = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wheel)
    R = 210
    # outer ring
    wd.ellipse([cx - R, cy - R, cx + R, cy + R], outline=(*copper, 230), width=2)
    wd.ellipse([cx - R + 24, cy - R + 24, cx + R - 24, cy + R - 24], outline=(*copper, 120), width=1)
    wd.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], fill=(*copper, 200), outline=(*copper, 255))
    # 8 spokes with extended handles
    for k in range(8):
        th = math.radians(k * 45)
        x1 = cx + math.cos(th) * 22
        y1 = cy + math.sin(th) * 22
        x2 = cx + math.cos(th) * R
        y2 = cy + math.sin(th) * R
        wd.line([(x1, y1), (x2, y2)], fill=(*copper, 220), width=2)
        # handle beyond the ring
        x3 = cx + math.cos(th) * (R + 30)
        y3 = cy + math.sin(th) * (R + 30)
        wd.line([(x2, y2), (x3, y3)], fill=(*copper, 230), width=3)
        # cap
        wd.ellipse([x3 - 5, y3 - 5, x3 + 5, y3 + 5], fill=(*copper, 255))
    img = overlay_alpha(img, wheel)

    # tiny crosshair top-right, coordinate-label feel
    cross = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    xd = ImageDraw.Draw(cross)
    xc, yc = W - 180, 280
    xd.ellipse([xc - 6, yc - 6, xc + 6, yc + 6], outline=(*copper, 200), width=1)
    xd.line([(xc - 18, yc), (xc + 18, yc)], fill=(*copper, 180), width=1)
    xd.line([(xc, yc - 18), (xc, yc + 18)], fill=(*copper, 180), width=1)
    img = overlay_alpha(img, cross)

    img = add_grain(img, amount=4.5, seed=31)
    img = soft_vignette(img, strength=0.50)
    img = inner_frame(img, copper, alpha=90)
    img = corner_marks(img, copper, alpha=140)
    return img


# ---------------------------------------------------------------------------
# 4. YIELDER — Flowing, soft. Cream + muted gold. Water ripples, silk.
# ---------------------------------------------------------------------------
def render_yielder() -> Image.Image:
    base = linear_gradient((W, H), hex2rgb("#f6ecd8"), hex2rgb("#e8dcc0"), angle_deg=110)
    # soft gold bloom
    halo = radial_gradient((W, H), (W / 2, H * 0.42), hex2rgb("#e5c98a"), hex2rgb("#f6ecd8"), radius=W * 1.0)
    base = Image.blend(base, halo, 0.35)

    # Concentric water ripples — muted gold, thin
    ripples = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ripples)
    gold = hex2rgb("#b59048")
    cx, cy = W / 2, H * 0.42
    for k in range(1, 26):
        r = 40 + k * 46 + int(6 * math.sin(k * 0.7))
        # slight horizontal squeeze to suggest water perspective
        squeeze = 0.96 - 0.0015 * k
        alpha = max(18, 170 - k * 6)
        rd.ellipse(
            [cx - r, cy - r * squeeze, cx + r, cy + r * squeeze],
            outline=(*gold, alpha),
            width=1,
        )
    ripples = ripples.filter(ImageFilter.GaussianBlur(0.35))
    img = overlay_alpha(base, ripples)

    # Silk: horizontal sinuous bands across the lower half
    silk = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(silk)
    for i in range(14):
        y0 = int(H * 0.60 + i * 30)
        pts = [
            (x, y0 + int(10 * math.sin(x / 140 + i * 0.7)))
            for x in range(-20, W + 21, 6)
        ]
        sd.line(pts, fill=(*gold, 55 + (i % 3) * 15), width=1)
    silk = silk.filter(ImageFilter.GaussianBlur(0.7))
    img = overlay_alpha(img, silk)

    # A single bright droplet at the center of ripples
    drop = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(drop)
    dd.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(*gold, 200))
    dd.ellipse([cx - 6, cy - 9, cx + 2, cy - 1], fill=(255, 250, 235, 220))
    img = overlay_alpha(img, drop)

    img = add_grain(img, amount=3.0, seed=41)
    img = soft_vignette(img, strength=0.25)
    img = inner_frame(img, gold, alpha=90)
    img = corner_marks(img, gold, alpha=130)
    return img


# ---------------------------------------------------------------------------
# 5. WEAVER — Connected, organic. Deep green + gold. Threads, network nodes.
# ---------------------------------------------------------------------------
def render_weaver() -> Image.Image:
    base = linear_gradient((W, H), hex2rgb("#0f2a22"), hex2rgb("#07170f"), angle_deg=100)
    halo = radial_gradient((W, H), (W / 2, H * 0.40), hex2rgb("#1a4235"), hex2rgb("#07170f"), radius=W * 0.95)
    base = Image.blend(base, halo, 0.55)

    gold = hex2rgb("#c79a49")

    # Node graph — upper half dense, lower half sparser
    rng = np.random.default_rng(51)
    nodes = []
    # arrange 28 nodes with some structure
    for i in range(30):
        # bias toward center-upper
        x = int(W * (0.12 + 0.76 * rng.random()))
        y = int(H * (0.15 + 0.55 * rng.beta(1.6, 2.4)))
        nodes.append((x, y))
    # add a few anchor nodes at specific positions
    anchors = [(W * 0.5, H * 0.40), (W * 0.30, H * 0.28), (W * 0.72, H * 0.32)]
    nodes.extend((int(x), int(y)) for x, y in anchors)

    # Build edges: each node connects to its 2-3 nearest
    edges = []
    pts = np.array(nodes)
    for i, p in enumerate(pts):
        d = np.linalg.norm(pts - p, axis=1)
        idx = np.argsort(d)[1:4]  # 3 nearest
        for j in idx:
            a, b = sorted((i, int(j)))
            edges.append((a, b))
    edges = list(set(edges))

    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    # edges (thin gold, some glowier)
    for a, b in edges:
        p1, p2 = nodes[a], nodes[b]
        ld.line([p1, p2], fill=(*gold, 90), width=1)
    # glow edges for anchors
    for anc in anchors:
        ai = nodes.index((int(anc[0]), int(anc[1])))
        for a, b in edges:
            if ai in (a, b):
                ld.line([nodes[a], nodes[b]], fill=(*gold, 170), width=1)

    # nodes
    for (x, y) in nodes:
        r = 3 if (x, y) not in [(int(a[0]), int(a[1])) for a in anchors] else 7
        ld.ellipse([x - r, y - r, x + r, y + r], fill=(*gold, 240))
        if r > 4:
            ld.ellipse([x - r - 5, y - r - 5, x + r + 5, y + r + 5], outline=(*gold, 110), width=1)
    layer = layer.filter(ImageFilter.GaussianBlur(0.4))
    img = overlay_alpha(base, layer)

    # Faint woven threads — diagonal cross-hatch, very subtle
    threads = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    tdr = ImageDraw.Draw(threads)
    for i in range(-H, W + H, 28):
        tdr.line([(i, 0), (i + H, H)], fill=(*gold, 14), width=1)
        tdr.line([(i, H), (i + H, 0)], fill=(*gold, 14), width=1)
    threads = threads.filter(ImageFilter.GaussianBlur(0.6))
    img = overlay_alpha(img, threads)

    img = add_grain(img, amount=4.0, seed=51)
    img = soft_vignette(img, strength=0.50)
    img = inner_frame(img, gold, alpha=90)
    img = corner_marks(img, gold, alpha=140)
    return img


# ---------------------------------------------------------------------------
# 6. READER — Literary, layered. Burgundy + ivory. Paper texture, book page margins.
# ---------------------------------------------------------------------------
def render_reader() -> Image.Image:
    """
    Literary book-page aesthetic: burgundy cloth cover with an ivory column
    block (a page/frame), an ornamental rule, a drop-cap flourish, and
    restrained margin keylines. Deliberately NOT a ruled notebook.
    """
    base = linear_gradient((W, H), hex2rgb("#4a1523"), hex2rgb("#240910"), angle_deg=100)
    halo = radial_gradient((W, H), (W / 2, H * 0.42), hex2rgb("#6a2133"), hex2rgb("#240910"), radius=W * 0.95)
    base = Image.blend(base, halo, 0.45)

    ivory = hex2rgb("#efe3cd")
    ink = hex2rgb("#3a1018")

    # Woven/cloth grain over the burgundy — faint cross-hatch
    cloth = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cloth)
    for x in range(0, W + 1, 3):
        cd.line([(x, 0), (x, H)], fill=(0, 0, 0, 14), width=1)
    for y in range(0, H + 1, 3):
        cd.line([(0, y), (W, y)], fill=(255, 255, 255, 6), width=1)
    cloth = cloth.filter(ImageFilter.GaussianBlur(0.4))
    img = overlay_alpha(base, cloth)

    # The page: a single ivory column block, centered upper. Acts like a
    # bookplate / title-page region. No baseline rules — just margins + marks.
    page_rect = (W * 0.20, H * 0.16, W * 0.80, H * 0.68)
    # soft drop shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rectangle((page_rect[0] + 10, page_rect[1] + 14, page_rect[2] + 10, page_rect[3] + 14), fill=(0, 0, 0, 110))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    img = overlay_alpha(img, shadow)

    pages = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pages)
    pd.rectangle(page_rect, fill=(*ivory, 240))

    # Double-rule inner frame (classic title-page)
    m = 40
    rm = (page_rect[0] + m, page_rect[1] + m, page_rect[2] - m, page_rect[3] - m)
    pd.rectangle(rm, outline=(*ink, 170), width=1)
    rm2 = (rm[0] + 8, rm[1] + 8, rm[2] - 8, rm[3] - 8)
    pd.rectangle(rm2, outline=(*ink, 70), width=1)

    # Ornamental flourish — a horizontal rule with center diamond, like an antiquarian title divider
    flo_y = rm[1] + 48
    cx_mid = (rm[0] + rm[2]) / 2
    # left and right rules, with small terminating dots
    pd.line([(rm[0] + 30, flo_y), (cx_mid - 28, flo_y)], fill=(*ink, 200), width=2)
    pd.line([(cx_mid + 28, flo_y), (rm[2] - 30, flo_y)], fill=(*ink, 200), width=2)
    # center diamond
    pd.polygon(
        [(cx_mid, flo_y - 9), (cx_mid + 14, flo_y), (cx_mid, flo_y + 9), (cx_mid - 14, flo_y)],
        outline=(*ink, 220),
        fill=(*ink, 40),
    )
    # bracket dots
    for x in (rm[0] + 30, rm[2] - 30):
        pd.ellipse([x - 3, flo_y - 3, x + 3, flo_y + 3], fill=(*ink, 220))

    # A second flourish toward the bottom of the page (mirrored, thinner)
    flo2_y = rm[3] - 60
    pd.line([(rm[0] + 80, flo2_y), (cx_mid - 14, flo2_y)], fill=(*ink, 140), width=1)
    pd.line([(cx_mid + 14, flo2_y), (rm[2] - 80, flo2_y)], fill=(*ink, 140), width=1)
    pd.ellipse([cx_mid - 4, flo2_y - 4, cx_mid + 4, flo2_y + 4], outline=(*ink, 180), width=1)

    # Ornamental fleuron in the upper-page region — a printer's mark,
    # NOT a letter (so it doesn't compete with the archetype name overlay).
    fx, fy = cx_mid, flo_y + 140
    # central lozenge
    pd.polygon(
        [(fx, fy - 18), (fx + 14, fy), (fx, fy + 18), (fx - 14, fy)],
        outline=(*ink, 220), fill=(*ink, 30),
    )
    # inner mark
    pd.line([(fx - 7, fy), (fx + 7, fy)], fill=(*ink, 220), width=1)
    pd.line([(fx, fy - 9), (fx, fy + 9)], fill=(*ink, 220), width=1)
    # flanking curls (little s-curves)
    for sign in (-1, 1):
        x0 = fx + sign * 30
        pd.arc([x0 - 14, fy - 12, x0 + 14, fy + 12], start=(0 if sign > 0 else 180), end=(180 if sign > 0 else 360), fill=(*ink, 180), width=2)
        pd.ellipse([x0 - 3, fy - 3, x0 + 3, fy + 3], fill=(*ink, 180))

    # Page number style mark bottom-center
    pd.ellipse([cx_mid - 3, rm[3] - 24, cx_mid + 3, rm[3] - 18], fill=(*ink, 200))

    img = overlay_alpha(img, pages)

    # Paper grain only over the ivory block
    img_np = np.asarray(img, dtype=np.float32)
    rng = np.random.default_rng(61)
    grain = rng.normal(0, 6, (H, W))
    mask = np.zeros((H, W), dtype=np.float32)
    x0, y0, x1, y1 = page_rect
    mask[int(y0):int(y1), int(x0):int(x1)] = 1.0
    mask_img = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(12))
    mask = np.asarray(mask_img, dtype=np.float32) / 255.0
    img_np = img_np + grain[..., None] * mask[..., None]
    img = Image.fromarray(np.clip(img_np, 0, 255).astype(np.uint8), "RGB")

    # Gold foil accent at bottom — subtle horizontal rule + three dots (gilt edge vibe)
    dec = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dec)
    gold = hex2rgb("#b99256")
    dd.line([(W * 0.30, H * 0.80), (W * 0.70, H * 0.80)], fill=(*gold, 200), width=1)
    for x in [W * 0.46, W * 0.50, W * 0.54]:
        dd.ellipse([x - 2, H * 0.80 - 2, x + 2, H * 0.80 + 2], fill=(*gold, 220))
    img = overlay_alpha(img, dec)

    img = add_grain(img, amount=4.0, seed=61)
    img = soft_vignette(img, strength=0.45)
    img = inner_frame(img, ivory, alpha=80)
    img = corner_marks(img, ivory, alpha=130)
    return img


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
RENDERERS = {
    "seer": render_seer,
    "wanderer": render_wanderer,
    "steerer": render_steerer,
    "yielder": render_yielder,
    "weaver": render_weaver,
    "reader": render_reader,
}


def main():
    for name, fn in RENDERERS.items():
        print(f"rendering {name}...")
        img = fn()
        assert img.size == (W, H), f"{name} size {img.size}"
        out = OUT / f"{name}.png"
        img.save(out, "PNG", optimize=True)
        # also save a small web preview
        thumb = img.copy()
        thumb.thumbnail((540, 960))
        thumb.save(OUT / f"{name}-preview.jpg", "JPEG", quality=82)
        print(f"  -> {out}")


if __name__ == "__main__":
    main()
