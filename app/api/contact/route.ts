import { NextResponse } from "next/server";
import { siteData } from "@/lib/siteData";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_REQUESTS) {
    requestLog.set(key, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid message data." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const senderEmail =
    typeof payload.senderEmail === "string" ? payload.senderEmail.trim() : "";
  const subject =
    typeof payload.subject === "string" && payload.subject.trim()
      ? payload.subject.trim()
      : "Portfolio contact";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const website = typeof payload.website === "string" ? payload.website.trim() : "";

  // Bots commonly fill fields that are visually hidden from real visitors.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (
    name.length < 2 ||
    name.length > 80 ||
    !emailPattern.test(senderEmail) ||
    senderEmail.length > 160 ||
    subject.length > 120 ||
    message.length < 10 ||
    message.length > 3000
  ) {
    return NextResponse.json(
      { error: "Please check your name, email, subject, and message." },
      { status: 400 },
    );
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { error: "Too many messages were sent. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || siteData.email;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "Catverse Contact <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      {
        error:
          "Direct messaging is being configured. Please use one of the email options for now.",
      },
      { status: 503 },
    );
  }

  const providerResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: senderEmail,
      subject: `[Catverse] ${subject}`,
      text: `Name: ${name}\nEmail: ${senderEmail}\n\n${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#202027">
          <h2>New Catverse portfolio message</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(senderEmail)})</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border:0;border-top:1px solid #e5e7eb" />
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `,
    }),
  });

  if (!providerResponse.ok) {
    const providerError = await providerResponse.text();
    console.error("Contact delivery failed:", providerResponse.status, providerError);
    return NextResponse.json(
      { error: "The message could not be delivered. Please try an email option." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
