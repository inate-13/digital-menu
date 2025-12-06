/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
import { NextResponse } from "next/server";
import { prisma } from "../../../../../server/prisma-client";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { Prisma } from "generated/prisma";
export async function GET(req: Request, ctx: any) {
  const params = await ctx.params; // Next expects awaitable params in this context
  const { id } = params as { id: string };

  try {
    const user = await getCurrentUser(); if(!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: restaurantId } = params;
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }});
    if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const dishes = await prisma.dish.findMany({
      where: { restaurantId },
      include: { dishCategories: { include: { category: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ ok: true, dishes });
  } catch (err) {
    console.error("GET dishes err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
  

export async function POST(req: Request, ctx: { params: any }) {
  // NEXTJS: await params per App Router dynamic API requirement
  const params = await ctx.params;
  const { id: restaurantId } = params;

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify restaurant and ownership
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // parse body
    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      console.error("POST dish: invalid JSON body", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Invalid name" }, { status: 400 });

    const priceRaw = body.price;
    let priceDecimal: Prisma.Decimal | null = null;
    if (priceRaw !== undefined && priceRaw !== null && priceRaw !== "") {
      if (isNaN(Number(priceRaw))) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }
      try {
        priceDecimal = new Prisma.Decimal(String(priceRaw));
      } catch (e) {
        console.error("POST dish: price Decimal conversion failed", { priceRaw, err: e });
        return NextResponse.json({ error: "Invalid price format" }, { status: 400 });
      }
    }

    const isVeg = typeof body.isVeg === "boolean" ? body.isVeg : body.isVeg === "false" ? false : true;
    const description = typeof body.description === "string" ? body.description : null;
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : null;
    const spiceLevel =
      typeof body.spiceLevel === "number"
        ? body.spiceLevel
        : typeof body.spiceLevel === "string" && body.spiceLevel !== ""
        ? Number(body.spiceLevel)
        : null;

    const categoryIds: string[] = Array.isArray(body.categoryIds) ? body.categoryIds : [];

    const created = await prisma.dish.create({
      data: {
        restaurantId,
        name,
        description,
        imageUrl,
        spiceLevel,
        price: priceDecimal,
        isVeg,
      },
    });

    if (categoryIds.length > 0) {
      await prisma.dishCategory.createMany({
        data: categoryIds.map((cid) => ({ dishId: created.id, categoryId: cid })),
        skipDuplicates: true,
      });
    }

    // return created dish with categories (and string price)
    const dishWithCats = await prisma.dish.findUnique({
      where: { id: created.id },
      include: { dishCategories: { include: { category: true } } },
    });

    const serialized = { ...dishWithCats, price: dishWithCats?.price ? dishWithCats.price.toString() : null };

    return NextResponse.json({ ok: true, dish: serialized }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/restaurants/[id]/dishes error:", {
      message: err?.message,
      stack: err?.stack,
    });
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}
