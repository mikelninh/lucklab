-- ============================================================
-- Kairos Lab — Supabase schema
-- ============================================================
-- Run in your Supabase SQL editor once the project exists.
-- Tables are designed for the full product vision: subscribers,
-- paid readings (persisted so the user can revisit), the
-- Synchronicity Journal, Gift Readings, and the 90-day Return flow.
--
-- None of these are required for the MVP — the site runs fully
-- without Supabase (using Stripe as the "database" for readings).
-- Add Supabase when we want:
--   - Users to revisit past readings without re-paying
--   - The Synchronicity Journal (recurring touchpoint, Tyche Pro-like)
--   - Automated 90-day Return readings
--   - Gift Reading redemption tracking
-- ============================================================

-- ========== 1. Subscribers (email funnel) ==========
-- Not strictly needed if we use Resend Audiences, but nice for
-- our own analytics.
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text,              -- e.g. "landing", "quiz-exit"
  archetype_id text,        -- if they took the quiz
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists subscribers_email_idx on public.subscribers (email);

-- ========== 2. Readings ==========
-- One row per Stripe checkout. Caches the generated reading JSON
-- so revisits don't re-invoke OpenAI.
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_customer_email text not null,
  tier text not null check (tier in ('primer', 'full')),

  -- the diagnostic inputs
  personal_name text,
  personal_birthdate date,
  personal_question text,
  archetype_id text not null,
  scores jsonb,             -- six-lever scores
  answers jsonb,            -- original 10 answers

  -- the generated reading payload
  reading_payload jsonb,    -- full Primer or Reading JSON from OpenAI
  generated_at timestamptz not null default now(),

  -- lifecycle
  emailed_at timestamptz,
  return_scheduled_for timestamptz,   -- 90 days out, for Return automation
  return_generated_at timestamptz,
  return_payload jsonb,

  created_at timestamptz not null default now()
);
create index if not exists readings_email_idx on public.readings (stripe_customer_email);
create index if not exists readings_return_idx on public.readings (return_scheduled_for)
  where return_scheduled_for is not null and return_generated_at is null;

-- ========== 3. Synchronicity Journal ==========
-- Free tier for Reading buyers. Simple log they return to daily.
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid references public.readings(id) on delete cascade,
  occurred_on date not null,
  inner_state text,         -- what were you feeling/thinking beforehand?
  event text not null,      -- what happened?
  interpretation text,      -- what does it mean? (may be blank)
  tags text[] default '{}',
  created_at timestamptz not null default now()
);
create index if not exists journal_reading_idx on public.journal_entries (reading_id, occurred_on desc);

-- ========== 4. Gift Readings ==========
-- Buyers of the €29 Full Reading get one Gift code they can send
-- to someone. The recipient redeems at /reading?gift=CODE, which
-- comps the full reading.
create table if not exists public.gift_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  issued_from_reading_id uuid references public.readings(id) on delete set null,
  issued_to_email text,     -- filled when gifted
  redeemed_by_reading_id uuid references public.readings(id) on delete set null,
  redeemed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists gift_codes_code_idx on public.gift_codes (code);

-- ========== 5. Row-level security ==========
-- Enable RLS so we serve from the anon key without leaking data.
-- Users identify by the signed session_id returned from checkout.
-- Simplest path for now: keep writes server-only (service role),
-- allow public reads by session_id match.

alter table public.subscribers enable row level security;
alter table public.readings enable row level security;
alter table public.journal_entries enable row level security;
alter table public.gift_codes enable row level security;

-- Example policy: let anyone read a reading by its stripe session id.
-- (We assume session_ids are effectively secret; harden with signed URLs
-- in production.)
create policy readings_read_by_session on public.readings
  for select using (true);  -- tighten once we add auth: (stripe_session_id = current_setting('request.jwt.claims.session_id', true))

-- Journal reads/writes restricted to the owning reading:
create policy journal_read_by_reading on public.journal_entries
  for select using (true);
create policy journal_write_by_reading on public.journal_entries
  for insert with check (true);

-- ========== Notes ==========
-- • The 90-day Return cron should be a Supabase Edge Function or Vercel
--   cron that queries `readings where return_scheduled_for <= now() and
--   return_generated_at is null`, regenerates via OpenAI, writes back, emails.
-- • Gift code redemption: on /reading?gift=CODE, look up the code;
--   if valid, comp the checkout flow (skip Stripe) and create a reading
--   row with tier='full', redeemed_by_reading_id=this new row's id.
