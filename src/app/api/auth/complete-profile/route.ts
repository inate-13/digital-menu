/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
import { NextResponse } from "next/server";
import { prisma } from "../../../../server/prisma-client";
import { getSession } from "../../../../server/auth/getSession";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, country } = await req.json();

    if (!fullName || !country) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { fullName, country },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("complete-profile:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

