// src/app/api/restaurants/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../server/prisma-client";
import { getCurrentUser } from "../../../server/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, restaurants });
  } catch (err) {
    console.error("GET /api/restaurants error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, location } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (!location || typeof location !== "string" || location.trim().length < 2) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        ownerId: user.id,
        name: name.trim(),
        location: location.trim(),
      },
    });

    return NextResponse.json({ ok: true, restaurant }, { status: 201 });
  } catch (err) {
    console.error("POST /api/restaurants error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
