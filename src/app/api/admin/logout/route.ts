import { NextResponse } from "next/server";

const COOKIE_NAME = "drelix-admin-session";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return response;
}
