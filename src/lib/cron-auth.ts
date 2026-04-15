/**
 * Guard for /api/cron/* routes.
 * Vercel Cron injects `Authorization: Bearer ${CRON_SECRET}` automatically.
 * Locally / externally, you can hit these with the same header to test.
 */

import { NextRequest, NextResponse } from "next/server";

export function verifyCron(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // If unset, allow (useful in dev). Enforce in prod by setting the env.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "CRON_SECRET not configured" },
        { status: 500 },
      );
    }
    return null;
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
