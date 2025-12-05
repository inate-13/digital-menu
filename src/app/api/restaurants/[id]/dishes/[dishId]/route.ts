import { NextResponse } from "next/server";
import { prisma } from "../../../../../../server/prisma-client";
import { getCurrentUser } from "../../../../../../server/auth/getCurrentUser";
import { Prisma } from "../../../../../../../generated/prisma";

 

// GET: list dishes for admin (owner)
export async function GET(req: Request, { params }: { params: { id: string }}) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: restaurantId } = params;
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const dishes = await prisma.dish.findMany({
      where: { restaurantId },
      include: { dishCategories: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    });

    // serialize Decimal fields to string to avoid any loss
    const serialized = dishes.map(d => ({
      ...d,
      price: d.price ? d.price.toString() : null,
    }));

    return NextResponse.json({ ok: true, dishes: serialized });
  } catch (err) {
    console.error("GET dishes err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

 
  
export async function PUT(req: Request, ctx: { params: any }) {
  // await params
  const params = await ctx.params;
  const { id: restaurantId, dishId } = params;

  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dish = await prisma.dish.findUnique({ where: { id: dishId } });
    if (!dish || dish.restaurantId !== restaurantId) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant || restaurant.ownerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      console.error("PUT dish: invalid JSON body", e);
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
        console.error("PUT dish: price Decimal conversion failed", { priceRaw, err: e });
        return NextResponse.json({ error: "Invalid price format" }, { status: 400 });
      }
    } else {
      priceDecimal = dish.price ?? null;
    }

    const isVeg =
      typeof body.isVeg === "boolean"
        ? body.isVeg
        : body.isVeg === "false"
        ? false
        : body.isVeg === "true"
        ? true
        : dish.isVeg ?? true;

    const description = typeof body.description === "string" ? body.description : null;
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : null;
    const spiceLevel =
      typeof body.spiceLevel === "number"
        ? body.spiceLevel
        : typeof body.spiceLevel === "string" && body.spiceLevel !== ""
        ? Number(body.spiceLevel)
        : null;

    const categoryIds: string[] = Array.isArray(body.categoryIds) ? body.categoryIds : [];

    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.dish.update({
        where: { id: dishId },
        data: {
          name,
          description,
          imageUrl,
          spiceLevel,
          price: priceDecimal,
          isVeg,
        },
      });

      await tx.dishCategory.deleteMany({ where: { dishId } });
      if (categoryIds.length > 0) {
        const toCreate = categoryIds.map((cid) => ({ dishId, categoryId: cid }));
        await tx.dishCategory.createMany({ data: toCreate, skipDuplicates: true });
      }
      return u;
    });

    const dishWithCats = await prisma.dish.findUnique({
      where: { id: updated.id },
      include: { dishCategories: { include: { category: true } } },
    });

    const serialized = { ...dishWithCats, price: dishWithCats?.price ? dishWithCats.price.toString() : null };

    return NextResponse.json({ ok: true, dish: serialized });
  } catch (err: any) {
    console.error("PUT /api/restaurants/[id]/dishes/[dishId] unexpected error:", {
      message: err?.message,
      stack: err?.stack,
    });
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: { id: string; dishId: string } }) {
  try {
    const user = await getCurrentUser(); if(!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: restaurantId, dishId } = params;
    const dish = await prisma.dish.findUnique({ where: { id: dishId }});
    if (!dish || dish.restaurantId !== restaurantId) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }});
    if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.dishCategory.deleteMany({ where: { dishId } });
    await prisma.dish.delete({ where: { id: dishId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE dish err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
