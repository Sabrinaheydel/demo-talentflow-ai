import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      posthogToken: process.env.POSTHOG_PROJECT_TOKEN ?? null,
      posthogHost: process.env.POSTHOG_HOST ?? "https://eu.i.posthog.com",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
