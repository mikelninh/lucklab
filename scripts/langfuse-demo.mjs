#!/usr/bin/env node
/**
 * Langfuse demo for Luck Lab — POSTs three synthetic quiz payloads to the
 * running Tyche endpoint. Each call goes through the production OpenAI
 * pipeline, which is now wrapped with `tracedOpenAI()`. Open the Langfuse UI
 * after to see every call as a fully expanded trace.
 *
 * Setup (one-time, ~5 min):
 *   1. Sign up at https://cloud.langfuse.com  (or https://eu.cloud.langfuse.com
 *      for EU-hosted — recommended)
 *   2. Project Settings → API Keys → New API Key
 *   3. Add to /Users/mikel/kairos/.env.local:
 *        LANGFUSE_PUBLIC_KEY=pk-lf-...
 *        LANGFUSE_SECRET_KEY=sk-lf-...
 *        LANGFUSE_HOST=https://eu.cloud.langfuse.com
 *   4. npm install langfuse
 *   5. Start the dev server: npm run dev   (in another terminal)
 *   6. node scripts/langfuse-demo.mjs
 *
 * What you'll see in the Langfuse UI:
 *   - 3 traces named "tyche-read · <archetype-id>" — each with the full free-
 *     teaser prompt, the JSON response, the token counts, the cost.
 *   - Tags: `tyche-read`, `free-teaser`, `archetype:<id>` — filter by any of
 *     them to see how performance differs by archetype.
 *   - Custom metadata: archetype_name, growth_edge, dominant axes, normalised
 *     scores, personal-context-present flag, answer count.
 *   - Latency + cost rolled up in the dashboard.
 */

const PORT = process.env.LUCKLAB_PORT || "3000";
const URL = `http://localhost:${PORT}/api/tyche/read`;

// Three synthetic personas — different optionId picks produce different
// archetypes downstream. The endpoint requires at least 8 answers.
const PERSONAS = [
  {
    name: "the analyser",
    answers: [
      { questionId: 1, optionId: "1a" }, // attention
      { questionId: 2, optionId: "2a" }, // calculate
      { questionId: 3, optionId: "3a" }, // avoid
      { questionId: 4, optionId: "4a" },
      { questionId: 5, optionId: "5a" },
      { questionId: 6, optionId: "6a" },
      { questionId: 7, optionId: "7a" },
      { questionId: 8, optionId: "8a" },
      { questionId: 9, optionId: "9a" },
      { questionId: 10, optionId: "10a" },
    ],
    personal: { name: "Mira" },
  },
  {
    name: "the wanderer",
    answers: [
      { questionId: 1, optionId: "1b" }, // deviation
      { questionId: 2, optionId: "2c" },
      { questionId: 3, optionId: "3c" },
      { questionId: 4, optionId: "4c" },
      { questionId: 5, optionId: "5c" },
      { questionId: 6, optionId: "6c" },
      { questionId: 7, optionId: "7c" },
      { questionId: 8, optionId: "8c" },
      { questionId: 9, optionId: "9c" },
      { questionId: 10, optionId: "10c" },
    ],
    personal: undefined,
  },
  {
    name: "the connector",
    answers: [
      { questionId: 1, optionId: "1d" }, // contact
      { questionId: 2, optionId: "2d" },
      { questionId: 3, optionId: "3d" },
      { questionId: 4, optionId: "4d" },
      { questionId: 5, optionId: "5d" },
      { questionId: 6, optionId: "6d" },
      { questionId: 7, optionId: "7d" },
      { questionId: 8, optionId: "8d" },
      { questionId: 9, optionId: "9d" },
      { questionId: 10, optionId: "10d" },
    ],
    personal: { name: "Sam" },
  },
];

console.log(`\nLuck Lab Langfuse demo · POST ${URL}\n`);

// Quick reachability check — the dev server has to be up
try {
  const ping = await fetch(`http://localhost:${PORT}`, { method: "HEAD" });
  if (!ping.ok && ping.status >= 500) throw new Error(`status ${ping.status}`);
} catch (err) {
  console.error(`✗ Dev server not reachable on :${PORT}.`);
  console.error(`  Start it: cd /Users/mikel/kairos && npm run dev`);
  console.error(`  Then re-run this demo.\n`);
  process.exit(1);
}

let n_ok = 0;
for (const [i, persona] of PERSONAS.entries()) {
  const t0 = Date.now();
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: persona.answers,
        personal: persona.personal,
      }),
    });
    const elapsed = Date.now() - t0;
    if (!res.ok) {
      const text = await res.text();
      console.log(`  [${i + 1}/${PERSONAS.length}] ✗ ${persona.name.padEnd(15)} → HTTP ${res.status}: ${text.slice(0, 80)}`);
      continue;
    }
    const body = await res.json();
    const archetype = body.archetype?.name || body.archetype?.id || "?";
    n_ok++;
    console.log(`  [${i + 1}/${PERSONAS.length}] ✓ ${persona.name.padEnd(15)} → ${String(archetype).padEnd(20)} (${elapsed}ms)`);
  } catch (err) {
    console.log(`  [${i + 1}/${PERSONAS.length}] ✗ ${persona.name.padEnd(15)} → ${err.message}`);
  }
}

const host = process.env.LANGFUSE_HOST || "https://eu.cloud.langfuse.com";
console.log(`\n✓ Done. ${n_ok}/${PERSONAS.length} successful.\n`);
console.log(`Open Langfuse: ${host}`);
console.log(`  → Traces tab — filter by tag 'tyche-read' to see today's runs`);
console.log(`  → Each trace shows full prompt + JSON response + tokens + cost`);
console.log(`  → Filter by tag 'archetype:<id>' to compare across archetypes`);
console.log(`  → If you don't see traces yet: confirm LANGFUSE_PUBLIC_KEY +`);
console.log(`    LANGFUSE_SECRET_KEY are set in .env.local AND that the dev`);
console.log(`    server was restarted after adding them.\n`);
