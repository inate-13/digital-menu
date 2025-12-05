// server: list categories and create category for a restaurant
import { NextResponse } from "next/server";
import { prisma } from "../../../../../server/prisma-client";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const restaurantId = params.id;
    // ensure owner
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      orderBy: { position: "asc" },
    });

    return NextResponse.json({ ok: true, categories });
  } catch (err) {
    console.error("GET categories err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const restaurantId = params.id;
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const name = (body.name || "").trim();
    if (!name || name.length < 1) return NextResponse.json({ error: "Invalid name" }, { status: 400 });

    // position = last + 1
    const last = await prisma.category.findFirst({ where: { restaurantId }, orderBy: { position: "desc" }});
    const pos = (last?.position ?? 0) + 1;

    const created = await prisma.category.create({
      data: { restaurantId, name, position: pos },
    });
    return NextResponse.json({ ok: true, category: created }, { status: 201 });
  } catch (err) {
    console.error("POST categories err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
