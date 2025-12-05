import { cookies } from "next/headers";
import { prisma } from "../prisma-client";

export async function getSession() {
  const cookie = (await cookies()).get("session_token");
  if (!cookie) return null;

  const token = cookie.value;

  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session || session.expiresAt < new Date()) return null;

  return session;
}
