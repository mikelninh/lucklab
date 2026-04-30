# How Kairos Was Built — A Tutor's Walkthrough

> *For Mikel. So you can build the next one yourself.*

This is not a list of commands. It's a mental model. By the end of this doc you should understand *why* every file exists, not just *what* is in it. When your tutor asks "how would you structure this?" you'll be able to sketch it on a napkin.

We'll go in the order a builder's brain actually works: **decide → structure → build → ship**.

---

## Part 0 — The question behind every decision

Before typing any code, a good builder asks **three questions**:

1. **What is the user's job?** (Not your job. Theirs.)
2. **What is the smallest thing that does that job?** (MVP, genuinely minimum.)
3. **What is the one thing that, if we get it wrong, sinks the project?** (The critical risk.)

For Kairos:
- **User's job**: understand what kind of "lucky personality" they have, then get actionable practice.
- **Smallest thing**: a quiz → a short reading → option to pay for more.
- **Critical risk**: the reading has to feel *personally true*, or no-one pays. Everything else is secondary.

Everything we built served that third answer. The research depth, Tyche's voice, the 6-mechanism model — all exist to make readings feel inevitable, not generic.

> **Your takeaway:** before the first file, write one sentence on each of these three questions. If you can't, you don't know what to build yet.

---

## Part 1 — The anatomy of a modern web app

A full-stack web app is really just four layers:

```
    ┌───────────────────────────────────────────────┐
    │                                               │
    │   1. BROWSER                                  │  what the user sees
    │      HTML, CSS, JS                            │
    │                                               │
    ├───────────────────────────────────────────────┤
    │                                               │
    │   2. SERVER                                   │  what runs on your behalf
    │      Node.js + framework (Next.js)            │  when the browser asks
    │                                               │
    ├───────────────────────────────────────────────┤
    │                                               │
    │   3. EXTERNAL SERVICES                        │  what you *don't* build
    │      OpenAI · Stripe · Resend                 │  you rent it
    │                                               │
    ├───────────────────────────────────────────────┤
    │                                               │
    │   4. DATA                                     │  what you remember
    │      (Supabase later — not in MVP)            │
    │                                               │
    └───────────────────────────────────────────────┘
```

**Next.js** (our framework) blurs layers 1 and 2 on purpose. In the App Router, one file can describe *both* what the browser sees *and* what the server does to produce it. That's powerful. It's also the single biggest source of confusion for beginners.

The core distinction is:

| Server Component (default) | Client Component (`"use client"`) |
|---|---|
| Runs *once* on the server, sends HTML to the browser | Runs in the browser, can use state and events |
| Can hit databases, use secrets | Cannot see secrets; anything here is public |
| Cannot use `useState`, `onClick`, etc. | Can use `useState`, effects, hooks |
| Faster, cheaper, better for SEO | Needed whenever the UI reacts to the user |

**Rule of thumb:** start every file as a server component. Add `"use client"` only when you discover you need interactivity (e.g. a quiz where selections update state).

Look at the codebase:
- `src/app/page.tsx` — server component (no `"use client"`). Renders the landing.
- `src/app/diagnostic/page.tsx` — client component. The quiz tracks state.
- `src/app/reading/full/page.tsx` — server component, even though it calls OpenAI. **This is deliberate.** We want the OpenAI call to happen on the server so the key stays secret.

> **Your takeaway:** every UI file has a decision — server or client? If you're ever unsure, ask: *"does this use `useState` or respond to clicks?"* If yes → client. If no → server.

---

## Part 2 — Directory structure as a thinking tool

Open `src/`:

```
src/
├── app/          ← ROUTES: every folder = a URL
├── components/   ← REUSABLE UI: things used on multiple pages
└── lib/          ← LOGIC: pure functions, no UI, no framework
```

This split matters. The rule is:

> **`lib/` has no React. `components/` has no business logic. `app/` glues them.**

Why? Because `lib/` is the only part you can test in isolation and the only part you can move to another project. Keeping it pure is how a codebase stays healthy.

Let's trace one feature — the diagnostic — to see this in action:

1. **`lib/traditions.ts`** — pure data. The 12 traditions, the 6 mechanisms. No React, no framework. You could paste this into a Python script and it would still mean something.

2. **`lib/diagnostic.ts`** — the 10 questions, the scoring algorithm, the archetype assignment. Still pure. Input: `Answer[]`. Output: `Archetype`. No UI.

3. **`lib/tyche-prompt.ts`** — the text that gets sent to OpenAI. Pure string building.

4. **`components/TycheSigil.tsx`** — an SVG component. Takes props, returns JSX. Knows nothing about the diagnostic.

5. **`app/diagnostic/page.tsx`** — the page. Imports from `lib/` and `components/`, orchestrates them, handles user interaction.

6. **`app/api/tyche/read/route.ts`** — the API endpoint. Imports the same `lib/` code the page imports. Calls OpenAI. Returns JSON.

Notice: **the same scoring logic runs in both the API route and (potentially) the page.** Because it's in `lib/` and pure, we can use it anywhere.

> **Your takeaway:** when adding a new feature, ask *"where does pure logic end and UI begin?"* Split it. The pure part → `lib/`. This is the single biggest habit that separates junior and senior code.

---

## Part 3 — The three files that create the brand

Premium feel is *mostly* about three things: **spacing, type, colour**. Not more.

### `globals.css` — design tokens

Open it. At the top:

```css
:root {
  --bg: #0a0a0d;
  --gold: #c9a961;
  --tyche: #a78bfa;
  /* … */
}
```

These are **design tokens**. Instead of sprinkling `#c9a961` across 40 files, we name it once (`--gold`) and reference it everywhere. Change the variable, the whole site updates. This is what makes "rebranding" a 5-minute job instead of a 2-day job.

**Why CSS variables instead of a JS theme object?** Because CSS variables are live — you can animate them, override them for dark/light mode, use them in arbitrary CSS. They cost nothing and compose beautifully.

### `layout.tsx` — fonts and meta

```ts
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
```

Next.js's `next/font` does a subtle thing: it downloads Google Fonts at *build time* and self-hosts them, so the user's browser never pings Google. Faster + better privacy + no layout shift.

We use three fonts intentionally:
- **Fraunces** (serif) for display — classical, authoritative
- **Geist** (sans) for body — modern, readable
- **Geist Mono** for technical accents (the `kbd` tags, eyebrows)

Three fonts max is a design rule. Four looks like chaos. One looks like Wordpress.

### `page.tsx` — the landing page as information architecture

Read the hero section of `src/app/page.tsx`. Notice the *order* of information:

1. **Eyebrow** — "RESEARCH PREVIEW · V0.1" (context)
2. **H1** — "Luck is not random. / It converges." (the claim)
3. **Sub** — 12 traditions, one conclusion (the proof)
4. **CTA** — Take the Diagnostic (the next step)

This is **AIDA** (Attention → Interest → Desire → Action), 110 years old, still works. Every good hero follows it. If your hero feels weak, check this order.

> **Your takeaway:** design tokens + 3 fonts + AIDA hero structure = 80% of premium feel. Skip any of these and it looks amateur.

---

## Part 4 — The four patterns that make the app *work*

Four specific techniques power this codebase. If you understand these four, you can build 80% of SaaS apps.

### Pattern 1 — Structured outputs from an LLM

Look at `src/lib/tyche-prompt.ts`. The prompt doesn't just say "write a reading." It says:

> *Return a JSON object with exactly these fields: `greeting`, `archetypeInsight`, `traditionMatch: { primary, why }`, …*

And then in `route.ts`:

```ts
response_format: { type: "json_object" }
```

This is **huge**. We're using the LLM like a function: fixed input schema, fixed output schema. We parse the JSON and render it like any other data. The LLM stops being a "chatbot" and becomes a typed component of the app.

**Why it matters:** you can now write TypeScript types for the reading, the UI can assume the fields exist, and you can swap models without changing the UI. The prompt is the API contract.

**When to use this pattern:**
- Any time you'd otherwise render raw LLM text — and the output has structure
- Generating personalised content (bios, reports, summaries)
- Classifying user input into one of N categories
- Extracting data from unstructured text

**The shape of the technique:**
```ts
1. Write a prompt that says exactly what JSON you want.
2. Call the model with response_format: json_object.
3. Parse. Validate (ideally with Zod). Render.
4. Add a deterministic fallback for when the call fails or the key is missing.
```

Look at `/api/tyche/read/route.ts` for the fallback — we return *something sensible* even without OpenAI. This is **graceful degradation** and it's the difference between a brittle app and a robust one.

### Pattern 2 — Deterministic + AI, layered

A naive build would be: "user completes quiz → call OpenAI → render whatever it says."

Our build does this:

```
1. Score the quiz deterministically (no AI).
2. Compute the archetype deterministically (no AI).
3. Find the growth edge deterministically (no AI).
4. *Then* send that pre-computed context to the LLM and ask it to narrate.
```

Why? Three reasons:

1. **Consistency** — the archetype for a given set of answers is *always the same*. The AI can't "forget" or contradict itself.
2. **Testability** — we can unit-test scoring without ever calling OpenAI.
3. **Cheapness** — if the LLM fails, we still have the archetype to show.

**The general principle:** *let computers do what they're good at (math, determinism), and let LLMs do what they're good at (language, narrative).* Don't mix them. Layer them.

You'll find this split everywhere serious AI products live.

### Pattern 3 — Payments without a database

This is a trick, and it's beautiful.

Normally when a user pays, you:
1. Save their order to a database before checkout
2. On webhook, match payment to saved order
3. Deliver

But for MVP we have no database. So:

```
1. User takes quiz → answers in sessionStorage (browser)
2. User clicks "buy" → we encode answers into Stripe session metadata
3. User pays → Stripe redirects to /reading/full?session_id=X
4. Server fetches session from Stripe → decodes metadata → generates reading
```

**Stripe is our database.** For a single product with small metadata, this works perfectly and saves us setting up Supabase, auth, etc.

The limits: Stripe metadata is 500 chars per value and 50 keys. Our compact encoding (`1:1a,2:2b,…`) fits in ~60 chars. Works great.

**When to graduate to a real database:**
- Metadata won't fit
- You need a user account / login
- You want to show users their past readings
- You want to analyse aggregated data

**Lesson:** *don't reach for infrastructure you don't need yet*. A real database costs you: a schema, migrations, auth, a backup strategy, €20/mo. Use Stripe as a database for your first 100 customers. Graduate when you hit a real constraint.

### Pattern 4 — Hosted vs self-hosted (everything)

For every capability, you have a choice:

| Capability | Host it yourself | Pay someone |
|---|---|---|
| Payments | Build forms, PCI compliance | Stripe Checkout (hosted) |
| Email | Run SMTP, deliverability hell | Resend API |
| Auth | Password hashing, sessions, reset flows | Supabase / Clerk / NextAuth |
| Images | CDN, resize pipeline | Vercel / Cloudinary |
| Search | Elasticsearch, index maintenance | Algolia / Typesense Cloud |

We chose **hosted for everything**. Stripe Checkout is a link we redirect to. Resend is one API call per email. OpenAI is one API call per reading.

This means our whole codebase is ~20 files. A "from scratch" build would be ~200.

**Lesson:** the skill isn't writing code, it's *choosing what not to write*. Every external service is time you bought back. The downside — vendor lock-in, cost at scale — is a problem for future-you once you have revenue. MVP-you should rent everything.

---

## Part 5 — TypeScript as thinking aid

Every `.ts` and `.tsx` file uses **TypeScript**. A lot of beginners resent TypeScript because it complains at them. Reframe:

> TypeScript is a second brain that catches mistakes before you run the code.

Concrete example from our codebase — `src/lib/diagnostic.ts`:

```ts
export type Answer = { questionId: number; optionId: string };
export function computeScores(answers: Answer[]): Scores { … }
```

Now every function that takes answers *must* take an array of `{ questionId, optionId }`. If you pass a string, the compiler yells. If you misspell `questionId`, the compiler yells. You never ship those bugs.

**Rule:** model your *domain* in types before you write logic. Look at `diagnostic.ts` — before any function, we declare `Answer`, `Scores`, `Question`, `Archetype`. This takes 10 minutes and saves 10 hours.

We also use **Zod** in API routes:

```ts
const schema = z.object({ email: z.string().email(), source: z.string().optional() });
const parsed = schema.safeParse(body);
if (!parsed.success) return error(...);
```

Zod validates at *runtime* (TypeScript only validates at compile time). Every API boundary — every place data enters your system from the outside — should have Zod validation. Never trust external input.

---

## Part 6 — A walk through one full user journey

Let's trace what happens when a user buys. This is the "how does this actually work" tour.

### Step 1 — Landing
- Browser requests `/` → Next.js server renders `app/page.tsx` (server component) → sends plain HTML.
- CSS variables + Tailwind classes style it. No JS needed to read the page.
- SEO crawlers see full content.

### Step 2 — Diagnostic
- User clicks "Take the Diagnostic" → Next.js client-side navigation to `/diagnostic`.
- `app/diagnostic/page.tsx` has `"use client"` → runs in browser.
- `useState` tracks the current step and the answer array.
- Every selected option updates state → React re-renders → auto-advances after 280ms.

### Step 3 — Free reading
- User finishes → clicks "Consult Tyche" → `fetch('/api/tyche/read', …)`.
- Next.js routes that request to `app/api/tyche/read/route.ts` (a **route handler**).
- Route handler:
  1. Validates the answers
  2. Calls `computeScores`, `archetypeFor`, `growthEdge` (pure functions from `lib/`)
  3. Builds a prompt, sends to OpenAI, parses JSON response
  4. Returns the JSON to the browser
- Browser stores the result in `sessionStorage`, navigates to `/reading/preview`.

### Step 4 — Checkout
- `/reading/preview` renders the result from sessionStorage.
- User clicks "Consult Tyche · €29" → `fetch('/api/checkout', …)` with the answers.
- Route handler creates a Stripe Checkout Session, encoding the answers into `session.metadata`.
- Returns the Stripe URL.
- Browser redirects to Stripe's hosted checkout page.

### Step 5 — Payment and return
- Stripe takes payment on their domain (we never touch card data — huge win for compliance).
- Stripe redirects to `/reading/full?session_id=cs_...`.

### Step 6 — Full reading
- `app/reading/full/page.tsx` is a **server component**. It runs on Vercel's servers, not the browser.
- On the server:
  1. Fetches the session from Stripe using `session_id`
  2. Verifies `payment_status === 'paid'` (prevents free readings by URL-crafting)
  3. Decodes the answers from metadata
  4. Calls OpenAI (gpt-4o this time, higher quality)
  5. Renders the 20-section page
- Browser receives rendered HTML and displays.

### Step 7 — Email delivery (still to do)
- Currently the full reading lives only at the URL. Sprint 2 adds an email with the same content.

**What to notice:**
- Every responsibility has exactly one owner.
- External services (Stripe, OpenAI) are called only from the server, never the browser.
- Secrets (`STRIPE_SECRET_KEY`) never reach the browser.
- Pure logic (`lib/`) is used in at least three places without duplication.

---

## Part 7 — How the project grew after the first MVP

When this doc was first written, only the minimum shipped: landing, quiz, free AI preview, €29 paid Reading. Everything else was labelled "next session". Here is what was actually added — and what still remains.

### ✅ Shipped since the first MVP

Each of these was a separate session of work. Most had "teach a new pattern" value, which is why they got their own sections below.

- **Quiz renamed and reordered.** `/diagnostic` → `/reading`. Personal inputs (name + optional birthdate + optional life question) moved *after* the 10 quiz inputs to reduce drop-off.
- **Tier split into three.** Free (archetype teaser) → €9 Primer (tripwire) → €29 Full Reading (with 90-day Return + lifetime Journal + Gift Reading bundled — cleverer than a monthly sub).
- **Three prompt templates.** One for each tier — short teaser (leaves hungry), mid-depth Primer (keepsake), long-form Full (the map). Same data pipeline, three different asks.
- **Content as a product.** Convergence Index (12,400-word lead magnet) + 7 weekly-unlocking research essays (~29,000 words) — all markdown-first with publish-date gating.
- **About page, Privacy, Terms.** Legal and brand pages, GDPR-compliant.
- **Email drip funnel** using Resend's `scheduledAt` (no cron needed for the drip itself).
- **Abandoned-checkout recovery** via Stripe webhook + dynamic promo code generation.
- **Rate limiting** on every expensive API route (protects OpenAI bill from abuse).
- **SEO technical**: sitemap, robots.txt, JSON-LD structured data, dynamic OG images, proper meta.
- **Analytics scaffold**: Plausible integration behind env var, typed event helpers.
- **4 Vercel Cron routes**: weekly-social (drafts for you to approve), weekly-digest (auto-broadcast), seasonal (solstices + New Year), monthly-stats (Stripe revenue email).
- **404 + error boundary**: on-brand, with reset.
- **Print stylesheet**: the Reading and Convergence Index are printable to PDF with a proper cream-on-white layout.
- **Supabase schema**: written and ready (`/supabase/schema.sql`) — not enabled yet.
- **Deployed**: live on Vercel, production.

### 🔜 What's left

In priority order:

1. **Custom domain** — buy `lucklab.app` (or similar), add in Vercel. ~30 min.
2. **Supabase enable** — so users can revisit their Reading, journal state persists, the 90-day Return becomes real. The biggest remaining product feature.
3. **Server-side PDF of the Reading** — currently print-to-PDF works everywhere; server-side (Puppeteer) lets us attach PDFs to email. See `docs/PDF-SERVER.md`.
4. **Convergence Index as typeset PDF** — Typst template. Currently readable web + print-to-PDF; typeset version is a brand-grade artefact.
5. **Affiliate program** — 20% on referred purchases, paid via Stripe promotion codes.
6. **Tyche Circle** (€99/year membership) — only if buyers signal demand.

### The lesson behind the order

Each session's additions followed a rhythm you can copy: **fix the biggest current hole → add the next-highest-ROI feature → only then explore**. The MVP had the hole "no real uniqueness per user"; the Sprint 2 added personalisation. That had the hole "no traffic plan"; the Sprint 3 added SEO content + social scaffolding. That had the hole "no measurement"; the Sprint 4 added analytics + crons.

**The heuristic**: every session should close one hole, not open three.

---

## Part 8 — The honest stuff (updated)

Things I'd still push back on in review:

- **No tests.** Still zero. `lib/diagnostic.ts` is the single file where tests would pay for themselves — scoring must stay consistent or people get different archetypes on re-runs.
- **Readings regenerate on every visit.** Still true. A refresh of `/reading/full?session_id=X` re-invokes gpt-4o. Costs ~€0.10 per refresh. Fixes itself when Supabase lands — cache the reading JSON keyed by session id.
- **Rate limiter is in-memory.** Fine for Vercel's single-instance serverless for now. Abuse from distributed IPs would slip through. Upgrade: `@upstash/ratelimit` once you have real traffic.
- **No observability.** We log to stderr; Vercel keeps them for a few hours. Add Sentry (or Axiom/Logtail) before launch to catch the 1% of requests that silently fail.
- **Convergence Index is still a "big markdown + print"**. A professionally-typeset Typst/LaTeX PDF with running heads, drop caps, a proper cover — *that* is what makes it feel like a $99 book given away for free, which is what it should feel like.
- **No abandoned-checkout email for free-tier drop-offs.** If someone starts the quiz and bounces at question 4, we have no way to email them (we don't have their email yet). That's fine — the funnel upstream (email → Convergence Index → Reading) handles that population. Just worth naming.
- **Cron-drafted social posts are not auto-posted.** By design — reputational risk. But it means the weekly rhythm depends on *you* to approve each draft. Don't underestimate that friction.

**Not blockers** for first €1,000/mo. **Are** blockers for scaling past ~€20K/mo.

---

## Part 8b — Shipping cadence, in hours

For your intuition: here is roughly how the time broke down across the build.

| Block | Rough hours |
|---|---|
| Branding + naming back-and-forth | 1 |
| MVP: landing, quiz, free + paid Readings, Stripe flow | 2 |
| Personalisation refactor + tier split (€9 Primer) | 1 |
| Content: 12,400-word Convergence Index | via agent (~8 min wall) |
| Content: 7 SEO articles (~29,000 words total) | via agents (~15 min wall) |
| Blog infrastructure: loader, index, slug route, prose CSS | 1 |
| Email funnel + abandoned-cart webhook | 0.75 |
| SEO tech: sitemap, robots, JSON-LD, OG images | 0.75 |
| Rate limit + legal pages + 404 + error | 0.75 |
| Analytics scaffold | 0.25 |
| Automation crons (4 routes) | 0.5 |
| Pre-launch polish + deploy | 0.5 |
| Docs: LEARN.md + MARKETING.md | 1.5 |

Everything-else total: roughly **10 focused hours** + parallel agent time.

The surprise isn't that it was fast. The surprise is how much of the effort was *deciding*, not typing. Naming, pricing structure, positioning, what to cut. The code cadence stays high because the decisions are made before the typing starts. That's the habit worth keeping.

---

## Part 9 — A minimal vocabulary you now own

If you can use these terms correctly, you can talk to any web dev:

| Term | What it means | Where you see it in Kairos |
|---|---|---|
| **Route** | A URL path that the framework maps to a file | `app/diagnostic/page.tsx` → `/diagnostic` |
| **Route handler** | A file that defines an API endpoint | `app/api/checkout/route.ts` → `POST /api/checkout` |
| **Server component** | Renders on the server, no interactivity | `app/page.tsx`, `app/reading/full/page.tsx` |
| **Client component** | Renders in browser, can use state | `app/diagnostic/page.tsx`, has `"use client"` |
| **Hydration** | Browser takes static HTML and "wakes up" the JS | Automatic in Next.js, rarely something you configure |
| **SSR** | Server-side rendering — HTML built per request | Our `/reading/full` is SSR |
| **SSG** | Static site generation — HTML built at deploy | Our `/` is SSG |
| **Design token** | A named value (colour, spacing) used throughout | `--gold`, `--tyche` in globals.css |
| **Design system** | Reusable components + tokens | `components/*.tsx` + globals.css |
| **Environment variable** | Secret or config not in code | `OPENAI_API_KEY`, configured in `.env.local` or Vercel |
| **Webhook** | An external service POSTs to us | `/api/stripe/webhook` for abandoned-cart recovery |
| **Metadata (Stripe)** | Arbitrary data attached to a session | We stash the answers here, our "database" |
| **Graceful degradation** | App still works when a service fails | Fallback reading when no OpenAI key |
| **Schema validation** | Runtime checking of data shape | `z.object(...)` in API routes |
| **Hosted vs self-hosted** | Buy it vs build it | Stripe Checkout = hosted. A custom credit card form = self-hosted. |
| **Rate limiting** | Caps how often one caller can hit an API | `lib/rate-limit.ts` — 5/min on Tyche |
| **Cron job** | Code that runs on a schedule, no user request | Vercel Cron → `/api/cron/weekly-digest` |
| **JSON-LD** | Structured data embedded for search engines | `/lib/jsonld.ts` — Article/Product/FAQ schemas |
| **OG image** | Image shown when a URL is shared socially | `opengraph-image.tsx` — dynamic, edge-rendered |
| **ISR** | Incremental Static Regeneration — static but re-builds on a schedule | `revalidate = 3600` on `/research/*` for weekly unlocks |
| **Sitemap** | Machine-readable list of site URLs for crawlers | `app/sitemap.ts` — Next.js generates `/sitemap.xml` |
| **Scheduled send** | Email deliverable set for future time | `resend.emails.send({ scheduledAt })` — drives our drip |
| **Frontmatter** | YAML metadata at the top of a markdown file | Each article's `title`, `slug`, `publishDate`, etc. |
| **Tripwire** | Low-price first purchase designed to break the wallet barrier | The €9 Primer |
| **Funnel** | Sequence of steps from visitor to buyer | Landing → Reading → Preview → Checkout → Reading |

---

## Part 10 — Homework (your tutor would approve)

Do these in order. Each takes 1-4 hours. Each teaches one fundamental.

1. **Add an 11th question to the Diagnostic.** Think about which mechanism it should target. Update `lib/diagnostic.ts`. Rebuild. Confirm scoring still works. *Teaches: the `lib/`-first discipline.*

2. **Add a new archetype — "The Oracle"** (meaning + attention dominant). Edit `ARCHETYPES` in `lib/diagnostic.ts`. Notice how `archetypeFor` just works because the scoring system is general. *Teaches: why pure functions compose.*

3. **Change the price to €39 and the strikethrough to €59.** Find every place prices appear. *Teaches: how hardcoded strings scatter across a codebase, and why design tokens for content (not just colours) are useful.*

4. **Add a `/tyche` page explaining Tyche's character in more depth.** Server component. Re-use `components/Footer` and `components/Nav`. *Teaches: route creation + component re-use.*

5. **Add Zod validation to `/api/tyche/read`.** Currently it trusts input. *Teaches: why boundary validation is non-negotiable.*

6. **Persist completed readings to Supabase.** This is a *real* project — half a day. *Teaches: real database work, auth, the jump from MVP to product.*

7. **Add an 8th blog article** under a new slug in `content/articles/`, with a `publishDate` two weeks from today. Notice the weekly-unlock UI automatically hides it until that date. *Teaches: content as data, not code.*

8. **Change the rate-limit window** on `/api/tyche/read` from 5/min to 3/min. Watch the 429 response fire when you hammer it. *Teaches: defensive API design.*

9. **Trigger a cron locally**: `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/weekly-social`. Check what it drafts. *Teaches: how cron routes are just authenticated GET endpoints.*

10. **Share a URL from your site on X/iMessage** (the deployed one). Watch the Open Graph card render. Now change `src/app/opengraph-image.tsx` — change the background colour, redeploy, re-share. *Teaches: the gap between "what you wrote" and "what the world sees".*

---

## Part 11 — Content as a product (markdown + publish-date gating)

The Convergence Index and the 7 blog articles are **not code**. They are markdown files in `/content/` with YAML frontmatter. The site reads them, filters by publish date, and renders them through `react-markdown`.

### Why it matters

Most devs reach for a CMS (Contentful, Sanity, Notion as a CMS) the moment content enters the picture. That's a mistake for early-stage products. A CMS adds: an account, a schema, an editing UI, a backup story, a bill. A markdown folder in the repo adds: nothing.

### The pattern

```ts
// lib/articles.ts
import matter from "gray-matter";

export function loadArticleBySlug(slug: string) {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  return { ...data, content };
}

export function isPublished(a, now = new Date()) {
  return new Date(a.publishDate + "T00:00:00Z").getTime() <= now.getTime();
}
```

One YAML field (`publishDate: "2026-05-20"`) in each file gates when it goes live. Combined with Next.js's `revalidate = 3600` (hourly regeneration) on the article route, the "weekly unlock" feature is two fields and zero admin UI.

### When to graduate

Move to a CMS the first time one of these is true:
- A non-developer needs to publish.
- You want in-place editing with preview.
- You want scheduled drafts not just scheduled publishing.
- Images need managed resizing.

Until then: markdown + git is not just enough, it's *better*. Every publication is a commit with a diff.

### What transfers to your next project

Any product with a "content area" — docs, research, tutorials, case studies, recipes — can use this pattern:

```
content/
├── articles/
│   ├── slug-one.md            # frontmatter: publishDate, title, description
│   └── slug-two.md
└── [other content types]/
```

Plus three files: `lib/articles.ts` (loader), `app/[type]/page.tsx` (index), `app/[type]/[slug]/page.tsx` (detail). ~200 lines total, fully typed.

---

## Part 12 — Automation that doesn't page you

Kairos runs four scheduled jobs (weekly-social, weekly-digest, seasonal, monthly-stats) plus a webhook (Stripe abandoned-cart) plus a provider-scheduled email drip. Each uses a different mechanism for a different reason. Understanding *which tool for which job* is the thinking worth internalising.

### The four tools — when to reach for each

| Tool | When | Example in Kairos |
|---|---|---|
| **Scheduled send via provider** (e.g. Resend `scheduledAt`) | Predictable time-based delivery, one-off | Welcome drip: T+0, T+1h, T+24h, T+3d, T+7d. Scheduled at subscribe time. |
| **Webhook** | Event-driven, triggered by another system | Stripe tells us about abandoned checkouts → we send recovery email |
| **Cron** | Recurring task, independent of any user action | Every Friday 10:00 UTC: email the week's new essay to all subscribers |
| **On-demand generation** | User triggers, compute at request | `/reading/full` generates the Reading when the user arrives with a valid session |

### Why not just cron everything?

A cron job that polls "any new subscribers in the last hour? send them the welcome" is *possible* but wasteful — it runs even when nothing happened. Scheduled sends run *only when needed*, at the exact right time, with no polling.

A webhook that fires on purchase is better than a cron that polls Stripe every minute — Stripe already knows the event happened, just tell us.

The heuristic: **prefer event-driven over time-driven. Use time-driven when the event has no originator** (e.g. "it is Wednesday and we want to post to X").

### The cron auth pattern

Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`. Every cron route verifies:

```ts
const deny = verifyCron(req);
if (deny) return deny;
```

**Why this matters:** cron endpoints are just URLs. Without auth, anyone who discovers `https://yoursite.com/api/cron/send-all-emails` could trigger it. Your cron secrets are as sensitive as your database password.

### The manual-approval guard rail

Our weekly-social cron *drafts* X threads and LinkedIn posts — it does not auto-post. This is deliberate. The upside of auto-posting (save 10 min/week) is dwarfed by the downside (one bad post, public apology). Drafts-to-webhook is the sweet spot: automated assembly, human judgement on send.

**Rule**: automate the assembly, keep the human in the send. This applies anywhere reputation is at stake.

---

## Part 13 — SEO is engineering (not marketing)

The single biggest misconception among builders: SEO is a marketing activity you do after the product is built. Wrong. SEO is *technical infrastructure* that must be there at launch, or Google takes months longer to trust you.

### The five pieces every site needs at launch

Kairos has all five. Each is 50 lines of code.

**1. `sitemap.xml`** — tells search engines every URL you want indexed, how often it changes, and how important it is.

```ts
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`,       changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/reading`,changeFrequency: "monthly", priority: 0.9 },
    // + one entry per published article
  ];
}
```

Next.js serves this at `/sitemap.xml` automatically. Submit the URL in Google Search Console and Bing Webmaster.

**2. `robots.txt`** — tells crawlers what they may and may not look at. Be deliberate: do not allow crawling of personalised paid content (`/reading/full`, `/reading/primer`) — they are unique per buyer, and indexing them is both useless (no two are alike) and leaks content.

```ts
// app/robots.ts
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/reading/full", "/reading/primer"] }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
```

**3. JSON-LD structured data** — embeds Schema.org metadata so Google understands *what kind of thing* each page is. Articles get rich snippets, products get price/availability displayed in results.

```ts
// lib/jsonld.ts
export function articleLD(args) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    datePublished: args.publishDate,
    author: { "@type": "Organization", name: "Luck Lab" },
    // …
  };
}
```

Inject as `<script type="application/ld+json">` in the page. The effort is tiny; the SERP real estate is the difference between a click and a scroll-past.

**4. OG (Open Graph) images** — what shows up when someone pastes your URL into Twitter, iMessage, Discord, Slack. Next.js 15 lets you generate them dynamically at the edge:

```tsx
// app/opengraph-image.tsx
export default async function OG() {
  return new ImageResponse(<div>…gold-on-black card…</div>, { width: 1200, height: 630 });
}
```

One file, rendered per request, never needs updating. Per-article images can pull in title/description via route params.

**5. `<meta>` tags** — `description`, `og:title`, `og:description`, `twitter:card`. Next.js's `export const metadata` handles all of them in one object per page.

### The mindset shift

You don't "do SEO." You *build* a site that is machine-readable by default. If you bolt it on at the end, you'll miss half of it. If you build it in, it's part of the infrastructure and you stop thinking about it.

**The principle:** every public page should know what it is (schema), what it looks like when shared (OG image), and when it was updated (sitemap). No exceptions.

---

## Part 14 — Prompt engineering as product design

The three Tyche prompts (`buildFreeTeaserPrompt`, `buildPrimerPrompt`, `buildFullReadingPrompt` in `lib/tyche-prompt.ts`) share a character description and diverge in scope. They illustrate a pattern worth stealing: **treat the prompt as the product's tone of voice, parameterised by depth**.

### The shared top

Every Tyche prompt starts with the same `TYCHE_CHARACTER` block — her voice, her rules, what she will and won't do. Changing this one string changes how every Reading sounds, everywhere. That's the same discipline as design tokens: one source of truth for a cross-cutting concern.

### The diverging middle

Each tier asks for a different JSON shape:

- **Free teaser** asks for 4 fields totalling ~120 words. It is *designed to leave the reader wanting more*. If you ask gpt-4o-mini for full scores + archetype analysis + protocol, it will give them to you, and your €9 tier has nothing to sell. Constraint produces commerce.
- **€9 Primer** asks for 8 fields, ~600 words. One tradition deep-dive, not three. One practice, not thirty days. Honest, keepsake-worthy, but visibly less than the Full Reading promises.
- **€29 Full Reading** asks for 14 fields, ~2,000 words. Three tradition deep-dives, a 30-day protocol, a daily ritual, warnings.

**Notice:** the free tier is not a *shrunken* Full Reading. It is a *shaped* one. Different fields, different emphasis. Shape beats length for creating desire.

### The optional-context branch

Personal context (name, birthdate, current life question) is optional. The prompt handles this with a `personalSection` helper that emits different instructions depending on what was provided:

```ts
if (hasBirthdate) {
  parts.push(`You may reference their season of birth as metaphor…`);
}
if (hasQuestion) {
  parts.push(`Treat their current question as the living thread…`);
}
```

**The principle**: when user inputs are optional, the prompt branches accordingly. Don't try to make gpt-4o "just figure out" what to do with a missing field. Be explicit about what's present and what's not.

### What transfers to your next LLM feature

Whenever you use an LLM in product:

1. **Write the character once.** Changing voice should be one edit, not ten.
2. **Define the output schema.** `response_format: { type: "json_object" }` + a detailed JSON spec in the prompt. You are calling a function, not chatting.
3. **Shape tiers, don't shrink them.** If free and paid look the same but shorter, paid conversion will be poor.
4. **Branch on optional inputs.** State what was given and what wasn't; give different instructions for each.
5. **Always write a deterministic fallback.** If OpenAI is down or the key is missing, your app should still work. Kairos returns a deterministic teaser keyed to the archetype.
6. **Match model to tier.** `gpt-4o-mini` is ~10× cheaper and fast enough for free/Primer tiers. `gpt-4o` shines on the €29 long-form Reading.

---

## Final thought

You asked your tutor to teach you fundamentals before you lean on AI. Good instinct. Here's what your tutor knows that AI won't tell you: *fundamentals are not facts, they are habits.*

The three habits that separate builders who ship from builders who don't:

1. **Before writing: a one-sentence answer to "what is the user's job?"**
2. **Before coding logic: a type definition or pure-function signature.**
3. **Before adding a library: "can I do this in 20 lines without it?"**

Everything else — Next.js, Tailwind, Stripe, OpenAI, TypeScript — is vocabulary. The habits are the grammar.

Every project you build, you'll be using those three habits. The tools will change. The habits won't.

Go build the next one.

— Kairos, and your AI collaborator
