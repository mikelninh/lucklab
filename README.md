# Kairos Lab

> The science of the opportune moment. Guided by Tyche.

Kairos Lab is a research-grade platform for studying luck, synchronicity, and serendipity. It cross-references 12 wisdom traditions (Jung, Taoism, Kabbalah, Vedanta, etc.) with modern empirical research (Wiseman's Luck Factor) and offers:

1. **The Kairos Diagnostic** — a free 10-input quiz that maps a user's kairotic profile across six mechanisms (attention, openness, action, surrender, connection, meaning).
2. **Tyche's Reading** — a paid (€29) AI-generated 20-page personalised luck map with a 30-day protocol.
3. **Tyche Pro** — a planned subscription (€19/mo) offering a synchronicity journal, weekly AI pattern reports, and an unlimited "Ask Tyche" chat.

**Tyche** is the AI oracle who narrates the experience — named for the Greek goddess who steers fortune with a rudder and pours abundance from a cornucopia.

---

## Stack

- **Next.js 15** (App Router, React 19, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4** (inline theme, custom design tokens)
- **OpenAI** (`gpt-4o-mini` for the free preview, `gpt-4o` for the paid full reading)
- **Stripe Checkout** (hosted checkout — no PCI scope)
- **Resend** (email delivery)
- **Vercel** (deploy target)

No database yet (MVP). Diagnostic answers are encoded into Stripe session metadata; full readings are generated on-demand after checkout.

---

## Quickstart

```bash
cd /Users/mikel/kairos
npm install
cp .env.example .env.local     # then edit with real keys
npm run dev                     # http://localhost:3000
```

Without any API keys set, the app still runs end-to-end:
- The Diagnostic returns a deterministic (non-AI) preview.
- Checkout returns an error explaining `STRIPE_SECRET_KEY` is missing.

With keys set:
- Tyche narrates readings with specific reference to the user's answers.
- Stripe Checkout collects €29 and redirects to `/reading/full?session_id=…`.
- The full AI reading is generated on that page load (~20-40s).

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                        # landing page
│   ├── diagnostic/page.tsx             # 10-question quiz (client)
│   ├── reading/preview/page.tsx        # free AI result + upsell (client)
│   ├── reading/full/page.tsx           # paid AI reading (server)
│   └── api/
│       ├── tyche/read/route.ts         # free preview (gpt-4o-mini)
│       ├── checkout/route.ts           # Stripe Checkout Session
│       └── subscribe/route.ts          # email capture + PDF send
├── components/
│   ├── Nav.tsx, Footer.tsx             # layout chrome
│   ├── TycheSigil.tsx                  # brand mark (SVG)
│   └── EmailCapture.tsx                # PDF subscribe form
└── lib/
    ├── traditions.ts                   # the 12 traditions + 6 mechanisms
    ├── diagnostic.ts                   # questions + scoring + archetype logic
    ├── tyche-prompt.ts                 # Tyche's character + prompt templates
    └── answer-codec.ts                 # compact encode for Stripe metadata
```

### Data flow

```
user → /diagnostic                    → answers in sessionStorage
                                       → POST /api/tyche/read (gpt-4o-mini)
                                       → archetype + free preview JSON
     → /reading/preview               → renders preview + €29 CTA
                                       → POST /api/checkout
                                       → redirect to Stripe hosted checkout
     → Stripe → pays → redirect back → /reading/full?session_id=X
                                       → server fetches session, decodes metadata
                                       → calls gpt-4o for full reading JSON
                                       → renders 20-section page
```

### Why this works without a database

Diagnostic answers compact to ~60 bytes and fit comfortably in Stripe's 500-char metadata limit. We fetch the session back from Stripe and regenerate the reading on visit. This trades a little OpenAI cost for zero infrastructure.

When we add Supabase later, we'll:
1. Persist `readings` on checkout completion
2. Cache generated readings so refreshes don't re-invoke OpenAI
3. Give each reading a permanent, shareable URL

---

## Deploying to Vercel

```bash
vercel --prod
```

Add env vars from `.env.example` in Vercel dashboard. Switch Stripe to live keys before announcing.

---

## Brand

- **Platform**: Kairos Lab
- **AI character**: Tyche (Greek goddess of fortune)
- **Palette**: midnight `#0a0a0d` · antique gold `#c9a961` · scholar purple `#a78bfa`
- **Fonts**: Fraunces (display serif), Geist (sans), Geist Mono (accents)

---

## Roadmap

- [x] Landing page
- [x] Diagnostic (10 inputs, 6 mechanisms, 6 archetypes)
- [x] Free preview (AI)
- [x] Paid reading (AI + Stripe)
- [ ] Real Convergence Index PDF (currently email → link)
- [ ] Supabase auth + reading persistence
- [ ] Synchronicity Journal (Tyche Pro)
- [ ] Weekly AI pattern reports (Tyche Pro)
- [ ] "Ask Tyche" chat (Tyche Pro)
- [ ] Stripe subscription for Tyche Pro

---

© 2026 Kairos Lab
