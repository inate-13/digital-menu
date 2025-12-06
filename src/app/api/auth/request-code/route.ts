/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
// src/app/api/auth/request-code/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// use relative imports to avoid alias resolution issues in route handlers
import { prisma } from "../../../../server/prisma-client";
import { sendOtpEmail } from "../../../../lib/email/email";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : null;

    if (!email) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const hashed = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.emailCode.create({
      data: { email, hashedCode: hashed, expiresAt },
    });

    // Try sending email — don't fail the API if mail fails, but log it
    try {
      await sendOtpEmail(email, otp);
    } catch (mailErr) {
      console.error("sendOtpEmail failed:", mailErr);
      // We intentionally respond with success to avoid email enumeration
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("request-code error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

