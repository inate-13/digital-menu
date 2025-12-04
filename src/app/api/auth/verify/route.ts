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

    const record = await prisma.emailCode.findFirst({
      where: { email, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!record) return NextResponse.json({ error: "Code expired or not found" }, { status: 410 });

    const ok = await bcrypt.compare(code, record.hashedCode);
    if (!ok) return NextResponse.json({ error: "Invalid code" }, { status: 401 });

    await prisma.emailCode.update({ where: { id: record.id }, data: { used: true } });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, fullName: "", country: "" } });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: { userId: user.id, token, expiresAt },
    });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
    // set cookie in header
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
