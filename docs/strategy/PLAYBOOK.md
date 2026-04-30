# The Kairos Playbook

> Everything we learned building Luck Lab from zero to launch in one session.
> A reusable blueprint for any AI-powered digital product.

---

## Part 1 — The gaps we found (simulated user reviews)

We simulated 50 users through every funnel stage. Here's what they said, grouped by where they got stuck.

### Landing page

**What works:**
> "The headline stopped me. 'Luck is not random. It converges.' I had to scroll." — *visitor, Berlin*

> "The 12-traditions table is genuinely interesting. I screenshot it." — *visitor, London*

**What doesn't:**
> "I scrolled for 2 minutes and still wasn't sure what the product IS. Is it a quiz? A course? A PDF?" — *visitor, São Paulo*

> "The pricing section confused me. Three tiers, each with a question — but I don't know what I'm choosing between until I've taken the Reading." — *visitor, Amsterdam*

> "I wanted to see an EXAMPLE of a Reading before committing my time to the quiz." — *visitor, NYC*

**Gaps identified:**
1. **No Reading preview/demo on the landing page.** Visitors don't know what they're getting until they take the quiz. Fix: add a "See a sample Reading" section or a 30-second video walkthrough.
2. **Product clarity below the fold.** The first screen is beautiful but abstract. People need "here's what you DO: take a 3-min quiz → get your archetype → unlock your map" within the first viewport.
3. **Pricing shown before value is experienced.** Consider hiding pricing until AFTER they've taken the free Reading, or at minimum after they've scrolled past the convergence table.

---

### The Reading (quiz flow)

**What works:**
> "Auto-advance is great. Felt fast. The progress bar kept me going." — *completer*

> "Asking my name AFTER the quiz was smart. By then I was invested." — *completer*

**What doesn't:**
> "Question 4 about routine deviation — I wasn't sure if 'weekly' meant weekly variety or one specific weekly deviation." — *abandoner at Q4*

> "I finished but the 'Consult Tyche Now' button felt like it would cost money. I almost didn't click." — *completer, hesitant*

> "I wanted to go back and change an answer but wasn't sure my previous answers were saved." — *completer*

**Gaps identified:**
4. **"Consult Tyche Now" sounds premium/paid.** Add "FREE" more prominently near the button. The current small text ("FREE · ~10 SECONDS") is too subtle.
5. **No reassurance that answers are saved when going back.** Add a subtle "your previous answers are saved" note when using the back button.
6. **Question 4 is ambiguous.** The "weekly" option should clarify: "At least once a week I deliberately do something different."

---

### Free result (preview page)

**What works:**
> "Seeing my archetype name in Greek was unexpectedly moving." — *completer*

> "The LOCKED visual is clever. I could see my scores were there but blurred. Made me curious." — *completer*

**What doesn't:**
> "The free result felt too short. Two sentences and a tradition name? I expected more for 3 minutes of my time." — *completer, disappointed*

> "The two unlock buttons confused me. €9 vs €29 — what's the actual difference? I couldn't tell from the descriptions." — *completer, bounced*

> "I wanted to share my archetype but the share button wasn't visible until I scrolled past the pricing. By then I'd already decided to leave." — *completer, bounced*

**Gaps identified:**
7. **Free result is TOO stingy.** The teaser gives archetype + 1 tradition hint. Users who spent 3 minutes expect at least their scores (even without interpretation). Consider: show scores visually but lock the INTERPRETATION. Scores are numbers — interpretation is the value.
8. **€9 vs €29 difference unclear.** Add a one-line comparison: "Primer = your profile. Reading = your 30-day plan." Currently both cards have feature lists but the hierarchy isn't instant.
9. **Share button should be ABOVE the paywall, not below it.** Move the archetype share card to right after the free result, before the locked section.

---

### €9 Primer

**What works:**
> "Over-delivered. The tradition essay was better than most blog posts." — *buyer*

> "I bought it on impulse. €9 is nothing. Then I saw the upsell and bought that too." — *buyer → upgrader*

**What doesn't:**
> "The Primer page loaded but I had no way to come back to it later. No email, no bookmark prompt." — *buyer, lost their reading*

> "The upgrade CTA at the bottom says '€20 extra' but clicking it takes me back to the quiz? Confusing." — *buyer*

**Gaps identified:**
10. **No "save this" prompt on the Primer page.** Add the EmailReading component to the Primer, not just the Full Reading. Buyers should be prompted to email themselves the link immediately.
11. **Upgrade path from Primer is broken.** The CTA says "Upgrade to the Full Reading · €20 extra" but links to `/reading` (the quiz). Should link directly to a checkout for the €29 Reading using their existing answers.

---

### €29 Full Reading

**What works (at Claude Sonnet quality):**
> "The opening paragraph made me put my phone down. She quoted my exact words back to me." — *buyer*

> "The contradiction she found between my surrender score and my openness score — I've never seen that about myself. I sat with it for an hour." — *buyer*

> "The bed-edge practice. I've done it 4 mornings now." — *buyer, day 4*

**What doesn't:**
> "The page took 30 seconds to load. I thought it was broken." — *buyer, anxious wait*

> "I wanted a PDF but the 'Download' button opened a print dialog. I expected a real PDF." — *buyer*

> "The '90-day Return' is mentioned in the pricing but there's nothing on the page that tells me when it'll happen or how." — *buyer*

**Gaps identified:**
12. **Loading state needs a dedicated "preparing your Reading" experience.** Not a blank page that takes 30s. Show: Tyche's sigil, a progress message ("weaving your pattern through twelve traditions..."), maybe even stream the sections as they generate.
13. **Print-to-PDF feels janky.** Users expect a button → file download. This needs server-side PDF (Vercel Pro enables it) or at minimum a clearer "Cmd+P then Save as PDF" instruction.
14. **90-day Return is promised but invisible.** Add a section at the bottom: "Your 90-day Return is scheduled for [date]. Tyche will recalibrate your Reading and email you on that day."

---

### Post-purchase (email + retention)

**What works:**
> "The review request email was perfect. Short, no incentive, just honest." — *buyer, day 7*

**What doesn't:**
> "I got the welcome email but never heard from Kairos again until the review request. 7 days of silence." — *subscriber*

> "I wanted to track my synchronicities but there's no journal yet. The Reading mentions it but there's nowhere to do it." — *buyer*

**Gaps identified:**
15. **The drip sequence has a content gap between T+24h and T+3d.** Add a T+48h email: a mini-practice from the user's specific archetype (requires storing archetype from the Reading).
16. **The Synchronicity Journal is promised but doesn't exist yet.** For now: add a printable 30-day log template (simple table) to the Reading page and email. Real web journal comes with Supabase.

---

## Part 2 — Conversion best practices we haven't built yet

### The 15 highest-ROI conversion tactics for digital products

| # | Tactic | Impact | Built? | Priority |
|---|---|---|---|---|
| 1 | **Exit-intent popup** — trigger when cursor moves to close tab. "Your Reading is waiting. [Begin →]" | High | No | P1 |
| 2 | **Countdown / urgency** — "Launch pricing: €29 (regular €49). X days left." | High | Partial (strikethrough exists) | P1 |
| 3 | **Sample Reading on landing** — show a redacted/partial Reading so visitors see the product BEFORE committing to the quiz | Very high | No | P1 |
| 4 | **Progress persistence** — if a user starts the quiz and leaves, store progress in localStorage and resume when they return | Medium | No | P2 |
| 5 | **Social proof counter** — "2,847 Readings taken" (real-time counter, even if small initially) | High | No | P1 |
| 6 | **Micro-commitments** — after Q5, show "You're halfway. Tyche is beginning to see a pattern." (already in quiz sparks concept, not fully implemented) | Medium | Partial | P2 |
| 7 | **Email capture timing** — ask for email AFTER the free result (when value has been demonstrated), not on the landing page where it's speculative | High | No (currently on landing) | P1 |
| 8 | **Testimonial at point of purchase** — show one review right next to the Unlock button, not in a separate section | High | No | P1 |
| 9 | **Price anchoring** — "€29 for a Reading that would cost €200+ from a coach" — stated explicitly, not implied | Medium | No | P2 |
| 10 | **Guarantee** — "If the Reading doesn't land, email us and we refund. No questions." Already in Terms but not visible at checkout. | High | Partial | P1 |
| 11 | **Bundle framing** — "€29 includes: Reading + 90-day Return + Journal + Gift Reading = €97 value" | Medium | No | P2 |
| 12 | **Post-quiz email capture** — after the free result, ask for email to "save your Reading and get the Convergence Index" | Very high | No | P1 |
| 13 | **Abandoned quiz recovery** — if they leave mid-quiz, show a sticky bar on return: "Welcome back. Pick up where you left off." | Medium | No | P2 |
| 14 | **One-click upsell** — after €9 purchase, show "Add the Full Reading for €20 more" with pre-filled checkout (no re-entering the quiz) | Very high | No | P1 |
| 15 | **Reading loading experience** — show a beautiful "Tyche is preparing your Reading" page with progress messages while Claude generates | High | No | P1 |

### The 5 we should build NOW (highest ROI, lowest effort)

1. **Sample Reading on landing** (15 min) — add a redacted/blurred version of the Yielder exemplar to the landing page
2. **Social proof counter** (10 min) — "X Readings taken" badge on hero
3. **Post-quiz email capture** (15 min) — ask for email on the free result page
4. **Guarantee badge at checkout** (5 min) — visible "refund guarantee" next to Unlock buttons
5. **One-click upsell from Primer** (20 min) — fix the broken upgrade path

---

## Part 3 — The reusable playbook

### For any AI-powered digital product, in this order:

**Phase 0 — The thesis (day 1)**
1. Write ONE sentence: what does the user get that they can't get elsewhere?
2. Kairos: "A personalised luck map cross-referencing 12 wisdom traditions with your specific answers."
3. If you can't write this sentence, you don't have a product yet.

**Phase 1 — The free hook (days 1-2)**
1. Build the quiz / input mechanism — the thing that collects personalised data.
2. Return SOMETHING valuable for free — enough to impress, not enough to satisfy.
3. The free result must produce a "how did it know that?" moment at least once.
4. Gate: the free result is the audition. If people don't share it, the quality isn't there yet.

**Phase 2 — The tripwire (days 2-3)**
1. First paid product: €5-15. Impulse buy territory.
2. Must over-deliver for the price. The buyer should feel slightly guilty about how little they paid.
3. Must include a visible upgrade path to the main product.
4. Gate: if <3% of free users buy the tripwire, the free result isn't creating enough desire.

**Phase 3 — The core product (days 3-5)**
1. The main paid product: €25-49 for personal development, €49-199 for professional tools.
2. Quality must justify the price. The "would they screenshot it?" test.
3. Must include: download, email, share. The product is an OBJECT, not a webpage.
4. Must include a viral mechanic: gift, referral, shareable card.
5. Gate: if <15% of tripwire buyers upgrade, the core product isn't differentiated enough from the tripwire.

**Phase 4 — The funnel (days 5-7)**
1. Email capture: lead magnet that's genuinely worth reading (our Convergence Index).
2. Drip sequence: 5 emails over 7 days. Content → value → soft sell → last touch.
3. Abandoned cart recovery: webhook + discount code.
4. Rate limiting on expensive endpoints.
5. Gate: if email open rate <20%, subject lines need work. If drip-to-purchase <2%, the emails are too salesy or too content-light.

**Phase 5 — The content moat (days 7-14)**
1. SEO articles targeting high-volume keywords in your niche.
2. One article per week, minimum. Weekly unlock schedule creates anticipation.
3. Each article internally links to 2-3 others and ends with a CTA to the product.
4. Gate: if articles don't rank after 3 months, the domain authority is too low. Get backlinks.

**Phase 6 — The launch (day 14)**
1. Launch on MULTIPLE channels simultaneously (X + Reddit + HN + newsletters + personal network).
2. Have templates ready. Have screenshots ready. Have the thread drafted.
3. Launch on Tuesday (best engagement day).
4. Spend launch day ENGAGING, not broadcasting. Reply to every comment.
5. Gate: if <1% of visitors buy anything, the funnel has a leak. Find it.

**Phase 7 — The compound (months 2-12)**
1. Weekly content cadence.
2. Monthly iteration on the funnel (one A/B test per month).
3. Reviews compound — each real review increases conversion by ~0.5%.
4. SEO compounds — each ranking article drives traffic that funds the next.
5. Quality compounds — each Reading that earns a screenshot teaches you what "good" sounds like.

### The metrics that matter (in order)

| Metric | What it tells you | Target |
|---|---|---|
| **Quiz completion rate** | Is the input mechanism frictionless? | >65% |
| **Free-to-paid conversion** | Does the free result create desire? | >3% |
| **Refund rate** | Does the paid product deliver? | <3% |
| **Share rate** | Is it screenshot-worthy? | >15% of buyers |
| **Email open rate** | Are you relevant in the inbox? | >25% |
| **Revenue per visitor** | Is the whole system working? | >€0.30 |
| **Day-7 return rate** | Do they come back? | >10% |

### The stack (reusable for any similar project)

```
FRONTEND:     Next.js (App Router) + Tailwind + Fraunces/Geist fonts
AI:           Anthropic Claude (primary) + OpenAI (fallback)
PAYMENTS:     Stripe Checkout (hosted — no PCI scope)
EMAIL:        Resend (delivery + scheduled drip)
ANALYTICS:    Plausible (privacy-first)
HOSTING:      Vercel (Pro for 60s functions)
DATABASE:     Supabase (when persistence needed)
CONTENT:      Markdown + gray-matter (file-based, git-versioned)
AUTOMATION:   Vercel Cron (weekly social, review requests, seasonal)
BRAND:        Design tokens in CSS vars + 3 fonts max + print stylesheet
```

---

## Part 4 — What we'd do differently next time

1. **Start with Claude Sonnet from day 1.** We wasted hours tuning gpt-4o-mini prompts. Claude produces better prose with less prompt engineering. The cost difference is negligible.

2. **Build the email capture into the quiz flow, not the landing page.** The highest-intent moment for email capture is AFTER the free result ("enter your email to save your Reading + get the Index"), not before.

3. **Write the exemplar Reading BEFORE the prompt.** We wrote the prompt first and iterated toward quality. Next time: write the 12/10 output by hand first, then write the prompt that produces it. Work backwards from the artifact.

4. **Test with 5 real users before building the funnel.** We built email drip, abandoned cart, cron automation, legal pages — all before a single real person saw a Reading. Next time: Reading quality first, everything else after 5 real reactions.

5. **Price the tripwire at €7, not €9.** €7 is psychologically closer to "free" than €9 is. The €2 difference in revenue is nothing; the conversion rate difference could be 30%+.

6. **Ship the loading experience from day 1.** A 10-30 second AI generation time needs a beautiful waiting experience, not a blank page. This is the most anxious moment in the funnel and we left it blank.

7. **Build the sample Reading into the landing page.** Nobody buys a product they haven't seen. A redacted/partial example of a real Reading on the landing page would have been higher-ROI than the traditions table.

---

## Appendix — The one-paragraph version

Build a free quiz that makes people feel seen. Gate the deep interpretation behind a €7-9 tripwire. Gate the full personalised plan behind a €29 product that's genuinely worth screenshotting. Use Claude for the writing, Stripe for the money, Resend for the drip, Vercel for the hosting, and Plausible for the numbers. Launch on Tuesday to X + Reddit + HN simultaneously. Spend launch day replying, not posting. Measure share rate as the north star — if people screenshot it, the rest follows. Everything else is optimisation.
