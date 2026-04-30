# Luck Lab — Marketing Plan

> A 12-month plan to take Luck Lab from zero to **Scenario B** (€5-10K MRR by end of year 1). With specific templates, weekly cadence, and automation recipes.

---

## Guiding principles

1. **Content is the product.** The Convergence Index and 7 articles are the pitch. Everything else routes people to them.
2. **Frequency beats perfection.** A good post shipped weekly outperforms a perfect post shipped monthly.
3. **One big swing per quarter.** PH launch, HN submission, newsletter partnership, podcast tour. Plan them, don't improvise.
4. **Automate the repeatable. Humanise the rare.** Weekly social posts → automated. Newsletter pitches → personal, one at a time.
5. **Measure two things only**: visitors and purchases. Everything else is vanity.

---

## Phase 0 · Pre-launch (this week, before public)

### Technical — DONE
- [x] SEO: sitemap, robots, JSON-LD, OG images
- [x] Rate limiting on expensive routes
- [x] Legal pages (Privacy + Terms)
- [x] Analytics (Plausible-ready)
- [x] 404 + error pages

### Technical — TODO before launch
- [ ] **Buy the domain** (see Domain section below)
- [ ] **Deploy to Vercel** on custom domain
- [ ] **Set up Plausible** account, add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] **Configure Stripe live mode** (not test) + webhook pointing to prod URL
- [ ] **Configure Resend** with domain DNS records (SPF, DKIM, DMARC)
- [ ] **Configure Google Search Console** — submit sitemap
- [ ] **Configure Bing Webmaster** — submit sitemap
- [ ] **Seed reviews**: ask 10 close friends to take the Reading, screenshot their results, one-line feedback. You'll need these for Product Hunt.
- [ ] **Create social accounts** — X/Twitter, LinkedIn page (not required, nice-to-have)
- [ ] **Email warm list**: personal email to 20-50 close contacts who'd resonate

### Domain options (research)
Pick one. All under €30/yr:
- **lucklab.app** — most on-brand, premium. Check availability at iwantmyname.com or Namecheap.
- **kairoslab.com** — safest fallback
- **trykairos.com** — consumer-y alternative
- **kairos.run** — unusual, memorable
- **askkairos.com** — SEO-leaning
- **kairosreading.com** — product-first

**Recommendation:** `lucklab.app` if available, else `kairoslab.com`.

---

## Phase 1 · Launch Week (Week 1)

Launch day = Tuesday. (Product Hunt peaks Tue/Wed; Monday is a bad day for social.)

### Monday (launch-1)
- Send **personal emails** to your warm list. 5-10 lines each, no template. Say: *"I've been building this for three months. It goes public tomorrow. If you're curious, here's the link."* Ask for honest reactions — they're your seed reviews.
- Schedule X thread for Tuesday 9am CET.
- Queue LinkedIn post for Tuesday 11am CET.
- Prep Product Hunt submission (scheduled for 00:01 PST Tuesday).

### Tuesday — **LAUNCH DAY**
- **Product Hunt** goes live at 00:01 PST (9am CET). Rally your network for upvotes in the first 2 hours — that's what Product Hunt's algorithm weights most. Goal: top 5 of the day.
- **X thread** 9am CET — see template below
- **LinkedIn post** 11am CET — same message, different tone (see template)
- **Reddit** 2pm CET — one post each to:
  - r/synchronicity (24K members)
  - r/Stoicism (700K — careful, read the rules)
  - r/taoism (60K)
  - r/decidingtobebetter (3M — highest-traffic potential, strictest rules)
  - r/psychology (only if "luck factor" angle leads)
  - **Rule**: be a contributor first. Link to the *research article*, not the homepage. Frame as *"I spent three months cross-referencing 12 traditions — here's what I found"*.
- **Hacker News** 3pm CET — submit the pillar article with title:
  *"12 wisdom traditions and a 2003 study arrive at the same answer about luck"*
  Aim for front page. If it flops, try again in 6 weeks with a different angle.
- **Newsletter pitches** (start this Monday, land this week):
  - The Browser (thebrowser.com) — email editor directly
  - Readwise Reads / Further
  - The Generalist
  - Matt Levine? Benedict Evans? (long shots but relevant)
  - Substacks in the wisdom/longevity space: Amanda Askell, Andrew Marantz, Erik Hoel

### Wednesday — Thursday
- Respond to every comment on every channel. This is 80% of the work — engagement amplifies reach.
- Screenshot the best comments/quotes → repost on X/LinkedIn.
- Email launch-week stats to your warm list: *"Thanks. Here's what happened."*

### Sunday of launch week
- Write week-1 retrospective → personal email to warm list + 1 public post.
- Plan the next 7 weeks.

### The "first 10 reviews" mini-playbook

Reviews are the single biggest unlock for cold conversion. The site ships with a `/reviews` page and a landing-page rail that **shows an empty state until 3 featured reviews exist** — the empty state itself is honest social proof ("Luck Lab is new — you may be the first quote"). But you need real ones, fast.

**Week 1, the warm-list ask:**

1. After your warm-list email goes out (Monday), 10–20 friends will take the Reading. **DM each one within 48 hours** with this:

   > Hey [name] — saw you took the Reading. Curious: did Tyche get it right? If you have one sentence on what landed (or didn't), I'd love to publish it on the site, first name only. Honest words help future readers more than polished ones.

2. **For each reply you receive**, paste it into a new file at `content/reviews/YYYY-MM-DD-firstname.md` (copy `_template.md`). Set `featured: true` for the strongest 3-5.

3. The landing page rail switches from empty state to live reviews automatically once 3 are featured. No deploy needed beyond the commit.

**The cron handles the rest.** From day 8 onward, every paying customer gets the review-request email automatically (`/api/cron/review-request` runs daily). You read replies, paste the good ones, commit. ~5 minutes per week ongoing.

**Rule:** never edit a quote. Never write one. If a reply is gold but has typos, ask: "*may I include this with light copy-edits?*" and wait for the green light.

### Metrics to track
- Visitors (Plausible)
- Readings started / completed
- Email subscriptions
- Primer (€9) purchases
- Full (€29) purchases
- Source attribution (which channel performed best)

---

## Phase 2 · The Unlock Sprint (Weeks 2–8)

Each week a new article unlocks. That's your natural content calendar — **do not invent new topics**, just repurpose.

### Weekly rhythm (every Wednesday)

**Tuesday night** — article auto-publishes (via publish-date gate). You do nothing.

**Wednesday** — turn the article into:
- **X thread** — excerpt the strongest 10 beats as 10 tweets. Link to full article at the end. See template.
- **LinkedIn post** — same beats, longer prose tone.
- **1 Reddit post** — to the subreddit most relevant to the article topic.
- **Newsletter mention** — if you have one. If not, start with a simple Substack called *Kairos Dispatch*.

**Thursday** — respond to comments.

**Friday** — send **Weekly Dispatch** email to subscribers:
> *"This week's essay was [title]. The argument: [one line]. Read: [link]. If you want to go deeper, [Reading CTA]."*

**Automated parts** (scaffold already in repo):
- `/api/cron/weekly-social` runs every Wed 09:00 — identifies which article just unlocked, posts excerpt-draft to a Slack webhook / Discord / wherever you compose (it doesn't auto-post, it drafts — too risky to fully autopost, reputation-wise).
- `/api/cron/weekly-digest` runs every Fri 10:00 — sends the Weekly Dispatch email to subscribers automatically.

### Article-to-channel mapping

| Week | Article | Best subreddit | Best newsletter |
|---|---|---|---|
| 2 | Jung's Synchronicity | r/Jung, r/synchronicity | psych-leaning |
| 3 | The Luck Factor (Wiseman) | r/psychology, r/getdisciplined | science-leaning |
| 4 | Wu Wei | r/taoism, r/meditation | wisdom/zen |
| 5 | Am I Lucky? (quiz) | r/decidingtobebetter | any mass-market |
| 6 | Kairos Meaning | r/philosophy, r/greekmyth | Aeon-adjacent |
| 7 | Amor Fati | r/Stoicism (huge), r/ryanholiday | Daily Stoic adjacent |

### Weekly goals (Weeks 2–8)
- +500 visitors/week (baseline from new SEO traffic + weekly post)
- +20 email subscribers/week
- +2 purchases/week

By week 8: **~6,000 total visitors, ~200 emails, ~20 purchases. ~€350-500 in revenue.** This is the *Moderate* trajectory.

---

## Phase 3 · Compounding (Months 3–6)

Organic SEO starts kicking in as Google indexes and trusts the domain. Articles begin ranking for tail keywords.

### What you add this phase

**1. Monthly long-form** — one new article per month, slightly different style than the initial 7:
- Case studies: *"I tracked my synchronicities for 90 days. Here's the pattern."*
- Interviews (recruit 1 philosopher, 1 researcher): *"I asked [X] what the traditions agree on."*
- Controversial: *"Why Richard Wiseman is wrong about one of his four behaviours"*

**2. Podcast tour** — aim for 8 appearances in 90 days. Pitch list:
- Lex Fridman (long shot, but try — synchronicity is his territory)
- Sam Harris (rationalist wisdom — good match for Tyche)
- Rich Roll (personal development)
- Tim Ferriss (4-hour brand)
- Hidden Brain
- The Knowledge Project (Shane Parrish)
- Modern Wisdom (Chris Williamson)
- Lenny's Podcast (builder angle — Kairos as a product story)

**Pitch template** in `/docs/podcast-pitch.md` (stub).

**3. Affiliate program** — simple:
- Affiliate gets 20% on Primer (€1.80) and Full Reading (€5.80)
- Track via Stripe promotion codes
- Recruit: first 20 buyers become ambassadors. Incentive: lifetime free Pro once launched.

**4. Google Ads** — start small: €300/month on high-intent keywords
- "how to be luckier"
- "am I lucky"
- "synchronicity meaning"
- Target CPA: €15 (achievable at 2% conversion, €29 cart)
- Break-even at €0.30 CPC across the funnel.

**5. Seasonal** — plan now, ship automated:
- **Summer solstice (June 21)**: *"Kairos season — the ancient summer practice of attention"* post + discount code
- **Autumn equinox (Sept 23)**: *"Amor fati and the harvest mindset"* post
- **December/New Year**: biggest campaign of the year. *"Luck in [year]: a 7-day practice"* — multi-day email sequence. Expect 5-10x normal traffic.

### Month 6 target
- 10-15K monthly visitors
- 500-1,000 email subscribers
- 100+ purchases/month
- **~€2,000 MRR**

---

## Phase 4 · Year 1+ (Months 6–12)

### Brand extensions
- **Tyche Circle** (€99/year) — if buyer demand is clear. Annual membership: all future Readings free, quarterly live salons, Ask Tyche unlimited. Lower friction than monthly.
- **Printed artefact** — a physical version of the Convergence Index (KDP / Lulu). 100 copies. Maybe €19 shipped. This is a *brand* move, not a revenue move.
- **Tyche Pro subscription** (€19/mo) — only if buyers explicitly ask for ongoing support. Don't force.

### Partnerships
- **Meditation app integration** — Calm, Waking Up, Ten Percent. Position Tyche's Reading as an onboarding tool. Licence the Reading engine.
- **Corporate** — HR departments love "know your team's archetypes." €499 team Reading. Opportunistic.
- **Book deal** — the Convergence Index + 7 articles = a publishable book. If organic traction is strong, pitch to Penguin / Random House / an agent. The book sells the Readings, not vice versa.

### Year 1 target
- 30-60K monthly visitors
- 3,000-5,000 email subscribers
- 400-800 purchases/month
- **€8-15K MRR**

---

## Templates — ready to copy-paste

### 🧵 X thread — launch day

```
1/ 2,500 years of wisdom traditions and 20 years of psychology agree
on something surprising: luck is not random.

It's a trainable disposition.

Here's what Jung, Laozi, Marcus Aurelius, and a British psychologist
all found in the same question 👇

2/ In 2003, Richard Wiseman ran a 10-year luck study at the University
of Hertfordshire. 400 subjects, split into "lucky" and "unlucky."

He gave each a newspaper with a large-print message hidden on page 2:
"Stop counting. There are 43 photographs in this newspaper."

The lucky people noticed. The unlucky did not.

3/ Why? Because "unlucky" people narrow their attention to tasks and
miss the information at the edges.

Wiseman isolated four behaviours that separate lucky from unlucky:
- Wider attention
- Trust intuition
- Expect good fortune
- Turn bad luck to good

4/ Meanwhile, half a century earlier, Carl Jung was describing
synchronicity — meaningful coincidence — as a function of the
*same* attentional posture.

Different language. Different century. Same conclusion.

5/ I went looking for other traditions. They *all* say it.

Taoism: wu wei — don't force
Kabbalah: mazal — fortune flows to aligned intention
Vedanta: dharma — right action seeds cascade
Stoicism: amor fati — love what happens
Buddhism: dependent origination
I Ching: timeliness

6/ Not the same metaphysics. The same mechanism.

Every one of them: a specific quality of attention, openness, action,
surrender, connection, and meaning-making.

Six trainable levers. Wiseman validated four empirically.

7/ So I built a tool. Luck Lab is a 3-minute Reading that maps your
profile across the 6 levers and tells you which of 6 archetypes you
are, which tradition fits your pattern, and what to practise.

It's free. It does not horoscope. It does not flatter.

8/ If you want the full argument: I spent 3 months writing *The Luck
Convergence Index*. 12,000 words, 36 citations, no woo.
Also free.

[link to /convergence-index]

9/ If you want to know your archetype:
[link to /reading]

That's it. No catch.

10/ If this lands for you — share it with one person who has ever
asked "why do good things happen to some people?"

That's the whole question. The answer is less mystical than we thought,
and more interesting.

🪬

[link pinned]
```

### 🧵 LinkedIn post — launch day

```
I spent three months cross-referencing 12 wisdom traditions against
20 years of psychological research on luck.

I expected contradictions. I found convergence.

Jung, Laozi, Marcus Aurelius, Rumi, the Zohar, and a British psychologist
named Richard Wiseman all point to the same answer about why some people
get "lucky" and others don't.

It isn't random. It's a trainable disposition.

In 2003, Wiseman ran a 10-year study at Hertfordshire on 400 people who
self-identified as exceptionally lucky or unlucky. The lucky ones shared
four measurable behaviours: wider attention, trusted intuition,
expected good fortune, and reframed setbacks.

Every contemplative tradition I examined described the same four — plus
two more the traditions add (connection and meaning-making).

Six trainable levers. Wiseman validated four empirically. The others are
where the traditions stretch further than current psychology has measured.

I built a tool around this thesis — a 3-minute Reading called Luck Lab
that maps a person's profile across the six levers and matches them to
the tradition whose practices most fit. It's free. It doesn't horoscope.

If the thesis interests you, the full research paper is open:
[link]

If you want your profile:
[link]

I'd love to know what you think — especially if you disagree.
```

### Hacker News submission

Title: `12 wisdom traditions and a 2003 study arrive at the same answer about luck`
URL: `https://lucklab.app/research/how-to-be-luckier`

If it makes front page, be in the comments within 10 minutes. Disagreement is oxygen there — engage respectfully with the sceptics, they are your audience.

### Newsletter pitch (cold)

Subject: `Luck Lab — a research platform on luck, looking for early readers`

```
Hi [Name],

I noticed you've written about [specific thing that shows you actually read their work]. I think there's an angle here you might find interesting — and if so, I'd love to be included in a future [newsletter name] roundup.

I spent three months cross-referencing 12 wisdom traditions against modern psychology (specifically Richard Wiseman's Luck Factor) and built a tool + 40-page essay at lucklab.app. The thesis is that luck is a trainable disposition along six levers, four of which are empirically validated.

No pitch beyond: here's the Convergence Index if you want the argument [link], and here's the 3-minute Reading if you want to test it yourself [link].

Happy to answer anything.

— Mikel
```

### Product Hunt launch copy

Title: `Luck Lab — the science of the opportune moment`
Tagline: `A 3-minute Reading that maps your luck across 12 traditions`

Description:
```
Luck Lab cross-references 12 wisdom traditions (Jung, Taoism, Kabbalah,
Vedanta, Stoicism...) with 20 years of empirical luck research to argue
something simple: luck is a trainable disposition.

Take the 3-minute Reading. Get your archetype (1 of 6), your tradition
match, your growth edge. Free.

Want the deep version? Tyche — our AI oracle — generates a personalised
30-day Reading addressed to you, responding to your actual life question.
€29, one-time, 90-day recalibration baked in.

No subscription. No horoscope. No flattery. Just careful synthesis and
a map.
```

---

## Automation — what's already built

Cron routes scaffolded in `/src/app/api/cron/*`. Vercel Cron config in `vercel.json`. Each is documented with its Supabase dependency (if any) — some work today, some need Supabase.

| Automation | Runs | Does | Status |
|---|---|---|---|
| `weekly-social` | Wed 09:00 | Drafts social posts from freshly-published articles | ✅ stub — drafts to Slack/Discord webhook |
| `weekly-digest` | Fri 10:00 | Emails subscribers a digest of the week's new essay | ✅ stub — Resend |
| `review-request` | Daily 08:00 | Emails buyers 7 days after purchase, asking for a testimonial | ⚠️ needs Supabase |
| `ninety-day-return` | Daily 09:00 | Generates recalibrated Reading for buyers at day 90 | ⚠️ needs Supabase |
| `birthday` | Daily 07:00 | Sends a birthday Reading to subscribers matching today's DOB | ⚠️ needs Supabase |
| `seasonal` | Solstices + equinoxes | Sends themed campaign | ✅ stub — Resend Broadcasts |
| `monthly-stats` | 1st of month | Sends you the month's revenue + funnel numbers | ✅ stub — your own email |

Each cron endpoint is guarded by `CRON_SECRET` header. Vercel Cron injects it automatically.

---

## The numbers to watch

Three dashboards, nothing more:

### 1. Plausible (weekly check, Sunday night)
- Visitors, by source (Google / direct / twitter / reddit / newsletter)
- Pages: which article is pulling
- Goals: Reading started, Reading completed, Subscribe, Checkout started, Checkout completed

### 2. Stripe (weekly)
- Purchases by tier
- Mix (Primer vs Full)
- Abandoned-checkout recovery rate
- Refund rate (should be near zero)

### 3. Resend (monthly)
- Open rate per drip email (welcome, T+1h, T+24h, T+3d, T+7d)
- Click rate per drip email
- Subscribe-to-purchase conversion (drip funnel ROI)

Anything below 20% open rate → rewrite that email's subject.
Anything below 1.5% drip-to-purchase → rewrite the T+3d email (the money one).

---

## The honest close

Most builders fail at marketing because they:
1. Try to do everything and do nothing consistently.
2. Measure the wrong things (followers > buyers).
3. Give up at week 3 when nothing has worked yet.

Compounding works if you do the same three things for 26 weeks:
- Publish one essay per week.
- Post to two channels per essay.
- Write one personal email per week to someone influential.

That's **two hours per week**. Not a full-time job. Everything else here is optional upside.

If you do only those three things from this document, you will hit Scenario B. Everything else is amplification.

Go.

— *K*
