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

## Part 7 — How I'd grow this next

In order of what I'd add and *why*:

1. **Supabase for persistence** — so users can revisit their reading, and so you can analyse which archetypes convert best. Cost: half a day. Value: huge.
2. **Email delivery of the full reading** — so buyers have it forever, not just at the URL. Cost: 1 hour. Value: refunds-prevented.
3. **Proper PDF of the Convergence Index** — replace the placeholder. Either write in Notion and export, or use React-PDF. Cost: half a day of writing, 1 hour of plumbing. Value: lead magnet credibility.
4. **A/B test the €29 vs €39 price point** — the single highest-leverage optimisation in any product. Cost: an afternoon. Value: can double revenue per visitor.
5. **Tyche Pro subscription** — the whole recurring-revenue thesis. Synchronicity journal + weekly AI report. Cost: ~1 week. Value: turns the business from one-shot to compounding.
6. **Content / SEO** — write 12 articles, one per tradition, each a long-form post that ranks for "what is X / how to practise X". Cost: slow but compounding. Value: free traffic forever.

**Notice the ordering:** I put infrastructure (Supabase) first not because it's fun but because it unlocks everything else. Then I fix the biggest hole in the current product (email). Only then do I add features.

**The skill to develop:** resist the urge to build the *fun* feature before the *load-bearing* one.

---

## Part 8 — The honest stuff

Things I'd push back on, if I were reviewing this code:

- **No tests.** Zero. For an MVP where you're the only developer this is fine, but the moment a second person joins, you want at least `lib/diagnostic.ts` tested (scoring is pure, trivial to test).
- **The full reading regenerates on every visit.** Wasteful; should cache. Fix with Supabase.
- **No rate limiting on the API routes.** Someone could spam `/api/tyche/read` and burn your OpenAI credits. Add `@upstash/ratelimit` or similar before going live with real traffic.
- **No analytics.** You can't improve what you can't measure. Plug in Plausible or PostHog before launching.
- **Placeholder PDF.** Ship the real one before charging people.

None of these are blockers for first-euro. They *are* blockers for first-€1k.

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
| **Webhook** | An external service POSTs to us | We're not using one yet; Stripe redirect covers MVP |
| **Metadata (Stripe)** | Arbitrary data attached to a session | We stash the answers here, our "database" |
| **Graceful degradation** | App still works when a service fails | Fallback reading when no OpenAI key |
| **Schema validation** | Runtime checking of data shape | `z.object(...)` in API routes |
| **Hosted vs self-hosted** | Buy it vs build it | Stripe Checkout = hosted. A custom credit card form = self-hosted. |

---

## Part 10 — Homework (your tutor would approve)

Do these in order. Each takes 1-4 hours. Each teaches one fundamental.

1. **Add an 11th question to the Diagnostic.** Think about which mechanism it should target. Update `lib/diagnostic.ts`. Rebuild. Confirm scoring still works. *Teaches: the `lib/`-first discipline.*

2. **Add a new archetype — "The Oracle"** (meaning + attention dominant). Edit `ARCHETYPES` in `lib/diagnostic.ts`. Notice how `archetypeFor` just works because the scoring system is general. *Teaches: why pure functions compose.*

3. **Change the price to €39 and the strikethrough to €59.** Find every place prices appear. *Teaches: how hardcoded strings scatter across a codebase, and why design tokens for content (not just colours) are useful.*

4. **Add a `/tyche` page explaining Tyche's character in more depth.** Server component. Re-use `components/Footer` and `components/Nav`. *Teaches: route creation + component re-use.*

5. **Add Zod validation to `/api/tyche/read`.** Currently it trusts input. *Teaches: why boundary validation is non-negotiable.*

6. **Persist completed readings to Supabase.** This is a *real* project — half a day. *Teaches: real database work, auth, the jump from MVP to product.*

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
