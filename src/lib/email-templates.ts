/**
 * Email templates for the drip funnel.
 * All share a common shell: dark background, antique gold accent, Fraunces serif.
 *
 * Each returns { subject, html } — ready to pass to Resend.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kairos.lab";
const EMAIL_FROM_NAME = "Tyche · Kairos Lab";

type Shell = { subject: string; html: string };

function wrap(inner: string, preheader: string = ""): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0d;font-family:Georgia,serif;color:#ededee;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#0a0a0d;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0d;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#16161d;border:1px solid #25252f;border-radius:6px;">
        <tr><td style="padding:40px;">
          <p style="font-family:'SF Mono',monospace;letter-spacing:0.18em;text-transform:uppercase;color:#c9a961;font-size:11px;margin:0 0 24px;">KAIROS LAB · FROM TYCHE</p>
          ${inner}
        </td></tr>
      </table>
      <p style="font-family:'SF Mono',monospace;font-size:10px;color:#5a5a66;letter-spacing:0.1em;margin:24px 0 0;">KAIROS LAB &middot; STUDYING WHAT TRADITIONS KNEW BEFORE SCIENCE CAUGHT UP</p>
      <p style="font-family:'SF Mono',monospace;font-size:10px;color:#5a5a66;margin:6px 0 0;">
        <a href="${APP_URL}/unsubscribe?email={{email}}" style="color:#5a5a66;text-decoration:underline;">unsubscribe</a>
      </p>
    </td></tr>
  </table>
</body></html>`;
}

function h1(text: string) {
  return `<h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;line-height:1.2;color:#ededee;margin:0 0 20px;">${text}</h1>`;
}
function p(text: string) {
  return `<p style="font-size:15px;color:#c9d1d9;line-height:1.75;margin:0 0 16px;">${text}</p>`;
}
function pMuted(text: string) {
  return `<p style="font-size:14px;color:#9a9aa6;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}
function button(href: string, label: string, style: "gold" | "ghost" = "gold") {
  const colors = style === "gold"
    ? "background:#c9a961;color:#1a1406;"
    : "background:transparent;color:#c9d1d9;border:1px solid #35353f;";
  return `<p style="margin:24px 0;"><a href="${href}" style="display:inline-block;${colors}padding:14px 26px;text-decoration:none;border-radius:4px;font-weight:600;font-size:14px;font-family:-apple-system,sans-serif;">${label} →</a></p>`;
}
function hr() {
  return `<hr style="border:none;border-top:1px solid #25252f;margin:28px 0;">`;
}
function signature() {
  return `<p style="font-family:'SF Mono',monospace;font-size:11px;color:#c9a961;letter-spacing:0.1em;margin:24px 0 0;">— TYCHE</p>`;
}

// ============================================================
// T+0 · Welcome — delivers the Convergence Index
// ============================================================
export function welcomeEmail(name?: string): Shell {
  const greeting = name ? `${name}, welcome.` : "Welcome.";
  return {
    subject: "The Luck Convergence Index — your copy, and a note from Tyche",
    html: wrap(
      `${h1(greeting)}
      ${p(`You asked for the Index. Here it is — forty pages of careful synthesis across twelve traditions and two decades of empirical research on luck. No woo. No shortcuts. Read it slowly.`)}
      ${p(`The Index will take you about ninety minutes to read if you read it properly. If you are short on time, skim the Convergence Table in section 4 and read the seven-day protocol at the end.`)}
      ${button(`${APP_URL}/convergence-index`, "Read the Index", "gold")}
      ${pMuted(`You can save it as a PDF from the page — the print layout is prepared for it.`)}
      ${hr()}
      ${pMuted(`After the Index, if you want a reading specific to <em>your</em> pattern, the Reading is free and takes three minutes.`)}
      ${button(`${APP_URL}/reading`, "Begin Your Reading", "ghost")}
      ${signature()}`,
      "Your copy of the Convergence Index, and a note on what to do with it."
    ),
  };
}

// ============================================================
// T+1 hour · Nudge if they didn't take the Reading
// ============================================================
export function nudgeReadingEmail(name?: string): Shell {
  return {
    subject: "You started. Take the next three minutes.",
    html: wrap(
      `${h1("Three minutes, no account.")}
      ${p(`If you downloaded the Index, you are the kind of reader who will want the Reading.`)}
      ${p(`It is ten calibrated inputs. It takes three minutes. It returns your archetype &mdash; which of six trainable dispositions you run, which of twelve traditions speaks most directly to you, and your quietest lever.`)}
      ${p(`Free. No account. No email required (ironic, we know &mdash; you already gave us one).`)}
      ${button(`${APP_URL}/reading`, "Begin Your Reading", "gold")}
      ${signature()}`,
      "Three minutes, ten inputs, your archetype."
    ),
  };
}

// ============================================================
// T+24h · Content value — archetype-specific OR generic Wiseman story
// ============================================================

const ARCHETYPE_STORIES: Record<string, { subject: string; story: string }> = {
  "The Yielder": {
    subject: "The Tao Te Ching has a chapter about you",
    story: `Chapter 48 of the Tao Te Ching says: <em>"In the pursuit of Tao, every day something is dropped."</em> As a Yielder, your gift is the ability to release the grip. But there is a difference between dropping what you hold and dropping where you stand. Your Reading explores that difference — and the practice that bridges it.`,
  },
  "The Seer": {
    subject: "Jung's golden scarab — and what it means for you",
    story: `Jung's patient was describing a dream about a golden scarab when a real beetle flew through the consulting-room window. He caught it and handed it to her. The therapeutic impasse broke. As a Seer, your attention catches what others miss. The question your Reading explores is what you do with what you catch — because noticing without acting is the Seer's specific trap.`,
  },
  "The Steerer": {
    subject: "The Greeks sculpted the moment of luck. It looks like you.",
    story: `Lysippos sculpted Kairos — the god of the opportune moment — with a long forelock and a bald back. You could seize him as he approached, but once he passed, there was nothing to grip. As a Steerer, you seize. You always have. Your Reading explores the cost: the moments you seized that were not yet ripe.`,
  },
  "The Wanderer": {
    subject: "Wiseman's luckiest subjects had one thing in common",
    story: `Richard Wiseman found that self-described lucky people had one behaviour others lacked: they varied their routine relentlessly. New routes, new people, new places. As a Wanderer, this is your native mode. Your Reading explores what happens when you go further — not just new places, but staying long enough for them to change you back.`,
  },
  "The Weaver": {
    subject: "The 1973 study that explains how your luck actually works",
    story: `Sociologist Mark Granovetter proved in 1973 that the connections that change lives are weak ties — acquaintances, not close friends. As a Weaver, your social sonar is always on. Your Reading explores the thread you haven't yet pulled — the one that would pull you somewhere you haven't imagined.`,
  },
  "The Reader": {
    subject: "Jung had a word for what you do naturally",
    story: `Synchronicity — the perception of meaningful coincidence. As a Reader, you do this fluently. Too fluently, perhaps. Your Reading explores the line between making meaning and manufacturing it — because when everything is a sign, nothing is a signal.`,
  },
};

export function contentEmail(name?: string, archetype?: string): Shell {
  const greeting = name ? name + "," : "One note from Tyche,";
  const specific = archetype ? ARCHETYPE_STORIES[archetype] : null;

  if (specific) {
    return {
      subject: specific.subject,
      html: wrap(
        `${h1(specific.subject.replace(/\.$/, ""))}
        ${p(`${greeting}`)}
        ${p(specific.story)}
        ${hr()}
        ${p(`Your full Reading goes deeper — mapping all six levers of your kairotic architecture and giving you a 30-day protocol calibrated to your specific pattern.`)}
        ${button(`${APP_URL}/reading`, "See your full Reading options", "gold")}
        ${signature()}`,
        specific.subject
      ),
    };
  }

  // Fallback: generic Wiseman story (for subscribers without an archetype)
  return {
    subject: "The newspaper experiment that explains luck",
    html: wrap(
      `${h1("The forty-three photographs.")}
      ${p(`${greeting}`)}
      ${p(`In 2003, Richard Wiseman advertised in <em>The Daily Telegraph</em> for people who considered themselves either exceptionally lucky or exceptionally unlucky. Four hundred replied.`)}
      ${p(`He asked each to count photographs in a newspaper he had prepared. On page two, in large type, was a line reading: <em>"Stop counting. There are 43 photographs in this newspaper."</em>`)}
      ${p(`The lucky people, on average, noticed it. The unlucky people, on average, did not. The unlucky people were counting harder.`)}
      ${p(`That experiment captures the whole thesis. Luck is a disposition. Dispositions are trainable. Wiseman isolated four behaviours and taught them to unlucky participants; within a month, their lives measurably improved.`)}
      ${button(`${APP_URL}/research/luck-factor-wiseman`, "Read the full essay", "ghost")}
      ${hr()}
      ${pMuted(`If you have not yet taken the Reading, the six-mechanism model it measures is the synthesis of Wiseman&rsquo;s four plus the two the traditions add.`)}
      ${button(`${APP_URL}/reading`, "Begin Your Reading", "gold")}
      ${signature()}`,
      "Wiseman's forty-three-photograph experiment, and what it means for you."
    ),
  };
}

// ============================================================
// T+3 days · Soft upsell for €9 Primer
// ============================================================
export function primerEmail(name?: string): Shell {
  const greeting = name ? `${name},` : "Friend,";
  return {
    subject: "You know your archetype. You do not yet know your levers.",
    html: wrap(
      `${h1("The Primer is where most readers land.")}
      ${p(`${greeting}`)}
      ${p(`The free Reading shows you which of six archetypes you are &mdash; the Seer, the Wanderer, the Steerer, the Yielder, the Weaver, or the Reader.`)}
      ${p(`That is the beginning. The Primer is the rest: your full six-lever scores, a deep read of your dominant and quietest levers, an essay on the tradition that speaks most to your pattern (with a verified primary source), and a seven-day practice calibrated to your specific profile.`)}
      ${p(`It is nine euros. Delivered instantly. Yours forever.`)}
      ${button(`${APP_URL}/reading`, "Unlock the Primer · €9", "gold")}
      ${hr()}
      ${pMuted(`Or go deeper with the full Reading (&euro;29) &mdash; a personal address from Tyche, three tradition deep-dives, a 30-day protocol, your daily ritual, a 90-day recalibration built in, and a Gift Reading to send to someone you love.`)}
      ${signature()}`,
      "The Primer is where most readers land."
    ),
  };
}

// ============================================================
// T+7 days · Last touch
// ============================================================
export function lastTouchEmail(name?: string): Shell {
  const greeting = name ? `${name},` : "Friend,";
  return {
    subject: "Before you close this tab for good",
    html: wrap(
      `${h1("One last note.")}
      ${p(`${greeting}`)}
      ${p(`Seven days ago you asked for the Convergence Index. We have not asked much of you since &mdash; nor will we after this.`)}
      ${p(`Two things worth knowing before we step out of your inbox:`)}
      ${p(`<strong style="color:#c9a961;">First</strong> &mdash; the Reading is free, takes three minutes, and returns more than any quiz has a right to. If you did not yet take it, that is the one thing we would ask.`)}
      ${p(`<strong style="color:#c9a961;">Second</strong> &mdash; if you ever find the Reading useful, the deepest expression is the full €29 Reading. It includes a 90-day recalibration and one Gift Reading you can send to someone you love. We designed it to travel.`)}
      ${button(`${APP_URL}/reading`, "Begin Your Reading", "gold")}
      ${hr()}
      ${pMuted(`We will not send more unless you open the Reading. No nagging. Our job is to be useful when you are ready.`)}
      ${signature()}`,
      "One last note, then we step out of your inbox."
    ),
  };
}

// ============================================================
// Review request · 7 days post-purchase
// Honest, short, no incentive (no "5% off your next purchase!").
// We are asking for one sentence of truth.
// ============================================================
export function reviewRequestEmail(
  name: string | undefined,
  archetype: string | undefined,
): Shell {
  const greeting = name ? `${name},` : "Friend,";
  const arch = archetype ? `the ${archetype}` : "your archetype";
  return {
    subject: "Did Tyche get it right?",
    html: wrap(
      `${h1("One question.")}
      ${p(`${greeting}`)}
      ${p(`A week ago, Tyche read for you. She named you ${arch} and gave you a protocol calibrated to your pattern.`)}
      ${p(`<strong style="color:#c9a961;">She would like to know what landed and what didn&rsquo;t.</strong>`)}
      ${p(`Reply to this email with one sentence (or one paragraph) about what you noticed. With your permission, we may publish it on the readers page &mdash; first name only unless you say otherwise.`)}
      ${p(`Polished prose is not required. Honest words help future readers more than perfect ones.`)}
      ${pMuted(`No incentive. No discount. Just truth, if you have a moment for it.`)}
      ${signature()}`,
      "Did Tyche get it right? One sentence is enough."
    ),
  };
}

// ============================================================
// Abandoned checkout · recovery with discount code
// ============================================================
export function abandonedCheckoutEmail(
  tier: "primer" | "full",
  discountCode: string,
  _amountOff: number,
): Shell {
  const label = tier === "primer" ? "the Primer" : "the Full Reading";
  return {
    subject: `Tyche is still holding ${label}`,
    html: wrap(
      `${h1("She waits.")}
      ${p(`You began checkout for ${label} and did not complete. No judgement &mdash; these are the moments the Reading is actually about. The pause before the yes.`)}
      ${p(`Tyche has held your reading in its unfinished form. If you want to complete, your discount code takes &euro;5 off:`)}
      <p style="text-align:center;margin:28px 0;">
        <code style="font-family:'SF Mono',monospace;font-size:20px;color:#c9a961;background:#1c1c25;padding:12px 24px;border:1px solid #35353f;border-radius:6px;letter-spacing:0.2em;">${discountCode}</code>
      </p>
      ${button(`${APP_URL}/reading/preview`, "Complete your Reading", "gold")}
      ${pMuted(`Code expires in 72 hours. One use per person.`)}
      ${signature()}`,
      `Tyche is still holding ${label}, and the code knocks €5 off.`
    ),
  };
}
