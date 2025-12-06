// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { prisma } from "../../../../server/prisma-client";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : null;
    const code = typeof body?.code === "string" ? body.code.trim() : null;

    if (!email || !code) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    // 1. Verification Logic
    const record = await prisma.emailCode.findFirst({
      where: { email, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!record) return NextResponse.json({ error: "Code expired or not found" }, { status: 410 });

    const ok = await bcrypt.compare(code, record.hashedCode);
    if (!ok) return NextResponse.json({ error: "Invalid code" }, { status: 401 });

    await prisma.emailCode.update({ where: { id: record.id }, data: { used: true } });

    // 2. Fetch or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, fullName: "", country: "" } });
    }

    // 3. Create Session
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: { userId: user.id, token, expiresAt },
    });

    // 4. ✅ FIX: PROFILE CHECK AND RESPONSE GENERATION
    let redirectPath = "/dashboard";
    
    // Check if fullName or country is NULL or empty string after trimming whitespace
    const isNameMissing = !user.fullName || user.fullName.trim() === "";
    const isCountryMissing = !user.country || user.country.trim() === "";

    if (isNameMissing || isCountryMissing) {
        redirectPath = "/auth/onboarding"; // THIS IS THE PATH FOR INCOMPLETE PROFILES
    }

    const res = NextResponse.json({ 
        ok: true, 
        user: { id: user.id, email: user.email },
        // 👇 THIS LINE MUST BE IN THE RESPONSE 👇
        redirect: redirectPath, 
    });
    
    // Set cookie in header
    res.headers.append(
      "Set-Cookie",
      `session_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`
    );

    return res;
  } catch (err) {
    console.error("verify route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}