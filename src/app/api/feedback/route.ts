import { NextResponse } from "next/server";

const MAX_COMMENT_LENGTH = 2500;

type FeedbackPayload = {
  rating?: unknown;
  comment?: unknown;
  name?: unknown;
  email?: unknown;
  contactConsent?: unknown;
  language?: unknown;
  page?: unknown;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FeedbackPayload;
    const rating = Number(body.rating);
    const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, MAX_COMMENT_LENGTH) : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 180) : "";
    const contactConsent = Boolean(body.contactConsent);
    const language = body.language === "fr" ? "fr" : "en";
    const page = typeof body.page === "string" ? body.page.trim().slice(0, 300) : "/";

    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 3) {
      return NextResponse.json({ error: "invalid_feedback" }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.FEEDBACK_FROM_EMAIL;
    const to = process.env.FEEDBACK_TO_EMAIL || "sabrina.heydel@agence360digital.fr";

    if (!resendApiKey || !from) {
      console.error("TalentFlow feedback email is not configured.");
      return NextResponse.json({ error: "feedback_email_not_configured" }, { status: 503 });
    }

    const safeName = escapeHtml(name || "Anonymous tester");
    const safeEmail = escapeHtml(email || "Not provided");
    const safeComment = escapeHtml(comment).replaceAll("\n", "<br />");
    const safePage = escapeHtml(page);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email || undefined,
        subject: `[TalentFlow feedback] ${rating}/5 - ${name || "Anonymous tester"}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#111827;line-height:1.55">
            <h1 style="font-size:22px">New TalentFlow beta feedback</h1>
            <p><strong>Rating:</strong> ${rating}/5</p>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Contact consent:</strong> ${contactConsent ? "Yes" : "No"}</p>
            <p><strong>Language:</strong> ${language.toUpperCase()}</p>
            <p><strong>Page:</strong> ${safePage}</p>
            <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0" />
            <p><strong>Feedback</strong></p>
            <p>${safeComment}</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Resend feedback delivery failed", resendResponse.status);
      return NextResponse.json({ error: "feedback_delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("TalentFlow feedback route failed", error);
    return NextResponse.json({ error: "feedback_request_failed" }, { status: 500 });
  }
}
