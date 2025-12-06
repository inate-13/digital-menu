/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
// src/app/api/restaurants/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../server/prisma-client";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";

export async function GET(req: Request, ctx: any) {
  const params = await ctx.params; // Next expects awaitable params in this context
  const { id } = params as { id: string };
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant || restaurant.ownerId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, restaurant });
  } catch (err) {
    console.error("GET /api/restaurants/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: any) {
  const params = await ctx.params; // Next expects awaitable params in this context
  const { id } = params as { id: string };

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { name, location } = await req.json();
    if (!name || name.trim().length < 2) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    if (!location || location.trim().length < 2) return NextResponse.json({ error: "Invalid location" }, { status: 400 });

    const updated = await prisma.restaurant.update({
      where: { id },
      data: { name: name.trim(), location: location.trim() },
    });

    return NextResponse.json({ ok: true, restaurant: updated });
  } catch (err) {
    console.error("PUT /api/restaurants/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: any) {
  const params = await ctx.params; // Next expects awaitable params in this context
  const { id } = params as { id: string };
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Optionally: cascade delete related categories/dishes if you want. For now just delete row.
    await prisma.restaurant.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/restaurants/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
