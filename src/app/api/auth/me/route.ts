import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ ok: false }, { status: 200 });
    return NextResponse.json({ ok: true, user: { id: user.id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error("me error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
