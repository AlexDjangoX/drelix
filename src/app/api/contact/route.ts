import { NextResponse } from "next/server";
import { Resend } from "resend";

/** Recipient for contact form messages (business email). */
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !CONTACT_TO_EMAIL) {
    console.error("[contact] Missing required environment variables");
    return NextResponse.json(
      { error: "Email not configured" },
      { status: 503 },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 },
    );
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Drelix] Wiadomość z formularza: ${name}`,
      text: `Od: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Send failed:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
