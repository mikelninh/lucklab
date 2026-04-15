# Server-side PDF rendering (deferred)

The MVP uses browser print-to-PDF (see `DownloadPdfButton.tsx` + `@media print` in `globals.css`). Works everywhere, zero infra.

When we want **server-generated PDFs** (for email attachments, or a slicker "Download" flow that doesn't open a print dialog), here is the sketch.

## Approach — Puppeteer on Vercel

```bash
npm install @sparticuz/chromium puppeteer-core
```

Create `src/app/api/reading/pdf/[sessionId]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const url = `${baseUrl}/reading/full?session_id=${sessionId}`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
  });
  await browser.close();

  return new NextResponse(pdf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="kairos-reading-${sessionId.slice(-8)}.pdf"`,
    },
  });
}
```

## Vercel gotchas

- `@sparticuz/chromium` is ~50 MB. Your function size limit on Vercel Hobby is 50 MB; Pro is 250 MB. Test.
- Vercel function max-duration: 10s on Hobby. You'll need Pro (60s) for this.
- Set `maxDuration: 60` in the route.
- Use `@vercel/next` runtime — make sure `nodejs` runtime is explicit.

## Authentication

The route fetches `/reading/full?session_id=...`. Today that page verifies the Stripe session. The Puppeteer fetch inherits no session, so it works as long as the Stripe lookup succeeds. That's fine — Stripe is the source of truth.

## Alternative — DocRaptor (SaaS)

If Vercel Puppeteer is painful, use DocRaptor's HTML-to-PDF API. ~$15/mo for 125 docs. Cleaner, no binary wrangling.

## Convergence Index PDF

The Convergence Index (`content/luck-convergence-index.md`) should be compiled once, not per-request. Use Typst or Pandoc+LaTeX for that one:

```bash
# Typst (simpler)
typst compile content/luck-convergence-index.typ public/convergence-index.pdf

# Or Pandoc + LaTeX (prettier defaults)
pandoc content/luck-convergence-index.md \
  --pdf-engine=lualatex \
  -V mainfont="Fraunces" \
  -V monofont="JetBrains Mono" \
  -V geometry:margin=2cm \
  -o public/convergence-index.pdf
```

Run once after editing, commit the PDF to `/public/` so the subscribe email can attach/link to it.
