import { prisma } from "../prisma-client";
import { getSession } from "./getSession";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
  });
}
