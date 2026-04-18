# Luck Lab 🪬

> A psychologist found lucky people see things unlucky people miss. We built a tool that tests which one you are.

**Live:** [lucklab.app](https://lucklab.app)

Luck Lab is a research platform that maps your "luck profile" across six trainable mechanisms — based on Richard Wiseman's 10-year empirical study and 12 wisdom traditions that independently arrived at the same conclusion: **luck is not random. It's a trainable disposition.**

An AI oracle named **Tyche** (Greek goddess of fortune) reads your quiz answers, finds contradictions you didn't see, and writes you a personalised Reading that people describe as "surprisingly specific."

**Try it:** [Take the Reading](https://lucklab.app/reading) — 3 minutes, free, no account.

## The product

Three tiers, each answering a different question:

| Tier | Price | What it answers |
|---|---|---|
| **The Reading** | Free | *Who am I?* — archetype + one tradition tease |
| **Archetype Primer** | €9 | *Show me more.* — full six-lever scores, tradition essay with real primary source, 7-day practice |
| **Tyche's Reading** | €29 | *What's my plan?* — personalised 30-day Reading, addressed by name, three tradition deep-dives, daily ritual, **+ 90-day Return** (auto-recalibrated follow-up), **+ lifetime Synchronicity Journal**, **+ one Gift Reading** to send a friend |

Free companion: *The Luck Convergence Index* — a 12,400-word research essay (36 citations) delivered by email.

Plus 7 long-form research essays (~29,000 words total) unlocking weekly at `/research/*`.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript** (strict, Zod validation at API boundaries)
- **Tailwind CSS v4** (inline theme, custom design tokens)
- **OpenAI** — `gpt-4o-mini` for free tier, `gpt-4o` for paid Reading
- **Stripe Checkout** (hosted — no PCI scope) + webhook for abandoned-cart recovery
- **Resend** — email delivery, scheduled drip funnel
- **Plausible** — privacy-first analytics (optional)
- **Vercel** — hosting, Cron, edge OG images
- **No database yet** — Stripe session metadata serves as persistence for MVP. Supabase schema prepared in `/supabase/schema.sql` for when we add Journal + Return + Gift persistence.

## Quickstart

```bash
cd /Users/mikel/kairos
npm install
cp .env.example .env.local     # fill in real keys
npm run dev                     # http://localhost:3000
```

Without keys the app still runs — Tyche returns deterministic fallback copy and checkout explains what's missing.

With keys configured:
- Tyche narrates Readings with specific reference to the user's inputs + personal context
- Stripe Checkout collects the payment and redirects to `/reading/full?session_id=…`
- Full AI Reading is generated on that page load (~20–40s)
- Resend fires a 5-step welcome drip on email capture
- Stripe webhook triggers €5-off recovery on abandoned checkouts
- Vercel Cron posts weekly social drafts + monthly stats + seasonal campaigns

## Architecture

```
src/
├── app/
│   ├── page.tsx                        # landing (5 sections + pricing rail)
│   ├── reading/page.tsx                # the quiz — intake + 10 inputs (client)
│   ├── reading/preview/page.tsx        # free result + unlock CTAs (client)
│   ├── reading/primer/page.tsx         # €9 Primer page (server, Stripe-gated)
│   ├── reading/full/page.tsx           # €29 full Reading (server, Stripe-gated)
│   ├── research/page.tsx               # article index (publish-date gated)
│   ├── research/[slug]/page.tsx        # article page (SSG, JSON-LD, OG)
│   ├── research/[slug]/opengraph-image.tsx   # per-article OG image
│   ├── convergence-index/page.tsx      # the 12,400-word lead magnet (readable + print-to-PDF)
│   ├── about/page.tsx                  # builder-mystic positioning
│   ├── privacy/page.tsx                # GDPR-compliant privacy policy
│   ├── terms/page.tsx                  # ToS (EU digital-goods consent, 90-day Return)
│   ├── opengraph-image.tsx             # root OG image (dynamic, edge)
│   ├── sitemap.ts                      # auto-includes published articles
│   ├── robots.ts                       # allows AI crawlers
│   ├── not-found.tsx                   # on-brand 404
│   ├── error.tsx                       # error boundary
│   └── api/
│       ├── tyche/read/route.ts         # free preview (gpt-4o-mini) + rate-limited
│       ├── checkout/route.ts           # Stripe Checkout Session (tier: primer | full)
│       ├── subscribe/route.ts          # email capture + 5-step Resend drip
│       ├── stripe/webhook/route.ts     # abandoned-cart recovery with €5-off promo codes
│       └── cron/
│           ├── weekly-social/route.ts  # drafts X + LinkedIn posts (Wed 09:00)
│           ├── weekly-digest/route.ts  # emails subscribers the new essay (Fri 10:00)
│           ├── seasonal/route.ts       # solstices/equinoxes/NY campaigns
│           └── monthly-stats/route.ts  # Stripe revenue report (1st of month)
├── components/
│   ├── Nav.tsx · Footer.tsx            # layout chrome
│   ├── TycheSigil.tsx                  # brand mark (SVG, iconographic)
│   ├── EmailCapture.tsx                # Convergence Index opt-in form
│   └── DownloadPdfButton.tsx           # print-to-PDF via @media print
└── lib/
    ├── traditions.ts                   # the 12 traditions + 6 mechanisms (data)
    ├── diagnostic.ts                   # 10 questions, scoring, archetype assignment, birth context
    ├── tyche-prompt.ts                 # Tyche's character + 3 prompt templates (teaser/primer/full)
    ├── articles.ts                     # markdown loader + publish-date gating
    ├── answer-codec.ts                 # compact encode for Stripe metadata
    ├── email-templates.ts              # 6 styled HTML email templates
    ├── rate-limit.ts                   # in-memory IP bucket limiter
    ├── cron-auth.ts                    # CRON_SECRET verifier
    ├── jsonld.ts                       # Schema.org helpers (Org/Article/Product/FAQ)
    ├── analytics.ts                    # Plausible track() helper, 9 conversion events
    └── supabase.ts                     # client stubs (enable when schema is applied)

content/
├── luck-convergence-index.md           # 12,400-word lead magnet, 36 citations
└── articles/                            # 7 blog articles, ~29,000 words, YAML frontmatter
    ├── how-to-be-luckier.md             [pillar, 4,064w]
    ├── jung-synchronicity.md            [2,801w]
    ├── luck-factor-wiseman.md           [3,498w]
    ├── wu-wei.md                        [2,872w]
    ├── am-i-lucky.md                    [1,789w — quiz driver]
    ├── kairos-meaning.md                [2,806w]
    └── amor-fati.md                     [2,977w]

supabase/
└── schema.sql                           # subscribers, readings, journal_entries, gift_codes (when ready)

docs/
└── PDF-SERVER.md                        # server-side PDF sketch (Puppeteer on Vercel) for later

MARKETING.md                             # 8,000-word go-to-market plan with templates
LEARN.md                                 # pedagogical walkthrough of every pattern in the repo
```

## Data flow — free Reading to paid purchase

```
user → /reading                       → 10 inputs + name (required) + optional birthdate/question
                                       → POST /api/tyche/read (gpt-4o-mini)
                                       → free teaser JSON {archetype, tradition-tease, unlock-prompt}
     → /reading/preview               → renders teaser + LOCKED visual for scores
                                       → "Unlock €9" or "Unlock €29"
                                       → POST /api/checkout {tier}
                                       → Stripe hosted checkout
Stripe → pays → redirect              → /reading/primer?session_id=X
                                   OR → /reading/full?session_id=X
                                       → server verifies session.payment_status === 'paid'
                                       → decodes answers + personal context from metadata
                                       → calls OpenAI (gpt-4o-mini for Primer, gpt-4o for Full)
                                       → renders the typeset Reading
                                       → "Download as PDF" → @media print → save PDF
```

### Why this works without a database

Diagnostic answers compact to ~60 bytes and fit comfortably in Stripe's 500-char metadata limit. Personal context fits in another ~120 bytes. We fetch the session back from Stripe on the return URL and regenerate the Reading. This trades a little OpenAI cost (~€0.10 per Reading) for zero infrastructure.

Graduation path: the Supabase schema in `/supabase/schema.sql` adds persistence, journal, 90-day Return automation, and Gift Reading redemption when we want them.

## Deploying to Vercel

```bash
vercel --prod
```

Production deploy was made April 15 2026 from the `main` branch — see top of file for URL. Custom domain is the next step: buy `kairos.lab` (or similar), add to Vercel → Project → Settings → Domains.

Required env vars for a fully live production:

```bash
OPENAI_API_KEY=sk-proj-…
STRIPE_SECRET_KEY=sk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…
RESEND_API_KEY=re_…
RESEND_AUDIENCE_ID=aud_…              # for weekly-digest cron
EMAIL_FROM="Tyche · Luck Lab <tyche@kairos.lab>"
NEXT_PUBLIC_APP_URL=https://kairos.lab
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=kairos.lab
CRON_SECRET=<long-random-string>
ADMIN_EMAIL=you@wherever.com
```

Optional (enables Journal/Return/Gift when ready):

```bash
NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…
```

### Stripe webhook setup

In Stripe Dashboard → Developers → Webhooks, add endpoint `https://<your-domain>/api/stripe/webhook`, select event `checkout.session.expired`, copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Brand

- **Platform**: Luck Lab
- **AI character**: Tyche (Greek goddess of fortune)
- **Palette**: midnight `#0a0a0d` · antique gold `#c9a961` · scholar purple `#a78bfa`
- **Fonts**: Fraunces (display serif), Geist (sans), Geist Mono (accents)
- **Voice**: calm-scholarly-warm, British English, no woo, no flattery

See `/about` for the positioning statement — *honest mysticism, built carefully*.

## What's shipped (April 15 2026)

- [x] Landing page with 4 anchor sections + pricing rail
- [x] Reading flow — 10 inputs + optional personal context (name/birthdate/question)
- [x] Free Tyche teaser + €9 Primer + €29 full Reading with 90-day Return + Journal + Gift
- [x] 7 weekly-unlocking research articles (~29,000 words)
- [x] Convergence Index lead magnet (~12,400 words, 36 citations, readable + print-to-PDF)
- [x] `/about` builder-mystic page, `/privacy`, `/terms`, on-brand 404 + error pages
- [x] Email drip funnel (5-step) + abandoned-checkout recovery
- [x] Rate limiting, JSON-LD structured data, dynamic OG images, sitemap, robots
- [x] 4 automation cron routes (weekly social + weekly digest + seasonal + monthly stats)
- [x] Plausible-ready analytics with 9 conversion events
- [x] Deployed to Vercel production

## Roadmap

- [x] Custom domain (lucklab.app)
- [x] Claude Sonnet AI + two-pass pipeline
- [x] Premium share cards (6 archetype backgrounds)
- [x] Convergence Index PDF (typeset, 22 pages)
- [ ] Supabase → Reading persistence + Journal + 90-day Return
- [ ] Server-side PDF rendering (Puppeteer on Vercel)
- [ ] Affiliate program (Stripe promo codes)
- [ ] Video Reveal cards (Remotion)

## Docs

```
docs/
├── strategy/
│   ├── LAUNCH.md              — 14-day launch script
│   ├── LAUNCH-POSTS.md        — copy-paste ready posts (X, Reddit, LinkedIn, HN)
│   ├── MARKETING.md           — full go-to-market plan (launch → year 1)
│   ├── PLAYBOOK.md            — reusable blueprint for AI digital products
│   ├── SPRINT-10K.md          — $10K month-1 revenue plan
│   └── TODAY.md               — today's action items
├── PDF-SERVER.md              — server-side PDF rendering sketch
├── SHARE-CARDS-ROADMAP.md     — 4-phase share card upgrade plan
├── exemplar-yielder-full.md   — hand-written 12/10 Reading for prompt calibration
├── convergence-index.typ      — Typst template for PDF generation
└── convergence-template.typ   — Typst cover page template

LEARN.md                       — pedagogical walkthrough (737 lines, 14 sections)
supabase/schema.sql            — DB schema for next phase
```

## Tags

`luck` `synchronicity` `AI-oracle` `personality-quiz` `wisdom-traditions` `Jung` `Taoism` `Stoicism` `Wiseman` `Kabbalah` `Buddhism` `Sufism` `luck-factor` `trainable-luck` `kairotic-profile` `archetype` `Claude-Sonnet` `Next.js` `Stripe` `Vercel` `Tailwind` `Resend` `Plausible` `digital-product` `SaaS` `email-funnel` `conversion-optimization` `SEO` `share-cards`

---

© 2026 Luck Lab. Built by Mikel Ninh, Berlin.
Code: MIT license. Content: all rights reserved.
