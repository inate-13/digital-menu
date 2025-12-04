// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../server/prisma-client";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookie = cookies().get("session_token");
    if (cookie && cookie.value) {
      const token = cookie.value;
      try {
        await prisma.session.deleteMany({ where: { token } });
      } catch (e) {
        console.error("failed to delete session:", e);
      }
    }

    const res = NextResponse.json({ ok: true });
    // expire cookie
    res.headers.append(
      "Set-Cookie",
      `session_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`
    );
    return res;
  } catch (err) {
    console.error("logout error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
