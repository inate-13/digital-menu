// import { NextResponse } from "next/server";
// import { prisma } from "../../../../../../server/prisma-client";
// import { getCurrentUser } from "../../../../../../server/auth/getCurrentUser";

// export async function PUT(req: Request, { params }: { params: { id: string; catId: string } }) {
//   try {
//     const user = await getCurrentUser(); if(!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     const { id: restaurantId, catId } = params;
//     const existing = await prisma.category.findUnique({ where: { id: catId } });
//     if (!existing || existing.restaurantId !== restaurantId) return NextResponse.json({ error: "Not found" }, { status: 404 });

//     // check owner
//     const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }});
//     if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

//     const body = await req.json();
//     const name = (body.name || "").trim();
//     const position = typeof body.position === "number" ? body.position : undefined;

//     if (!name || name.length < 1) return NextResponse.json({ error: "Invalid name" }, { status: 400 });

//     const updated = await prisma.category.update({ where: { id: catId }, data: { name, ...(position !== undefined ? { position } : {}) } });
//     return NextResponse.json({ ok: true, category: updated });
//   } catch (err) {
//     console.error("PUT category err", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request, { params }: { params: { id: string; catId: string } }) {
//   try {
//     const user = await getCurrentUser(); if(!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     const { id: restaurantId, catId } = params;
//     const existing = await prisma.category.findUnique({ where: { id: catId } });
//     if (!existing || existing.restaurantId !== restaurantId) return NextResponse.json({ error: "Not found" }, { status: 404 });

//     const r = await prisma.restaurant.findUnique({ where: { id: restaurantId }});
//     if (!r || r.ownerId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

//     // remove dish-category relations first (optional)
//     await prisma.dishCategory.deleteMany({ where: { categoryId: catId } });
//     await prisma.category.delete({ where: { id: catId } });
//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("DELETE category err", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
 import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "../../../../../../server/prisma-client";
import { getCurrentUser } from "../../../../../../server/auth/getCurrentUser";

// Define the type for the context parameters, wrapped in Promise for maximum
// compatibility with rigid Next.js/Vercel build environments.
type RouteContext = { 
    params: Promise<{ id: string; catId: string; }> 
};


// --- PUT: Update Category ---

/**
 * @method PUT
 * @path /api/restaurants/[id]/categories/[catId]
 * @description Updates a specific category for a restaurant, requires owner authentication.
 */
export async function PUT(
    req: NextRequest, 
    { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // AWAIT the params object to access the route segments
    const { id: restaurantId, catId } = await params;

    // 1. Validate Category and Restaurant linkage
    const existing = await prisma.category.findUnique({ where: { id: catId } });
    if (!existing || existing.restaurantId !== restaurantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Validate User ownership of the Restaurant
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!r || r.ownerId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const name = (body.name || "").trim();
    const position = typeof body.position === "number" ? body.position : undefined;

    // 3. Validate input data
    if (!name || name.length < 1) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    // 4. Update the category
    const updated = await prisma.category.update({
      where: { id: catId },
      data: { name, ...(position !== undefined ? { position } : {}) },
    });

    return NextResponse.json({ ok: true, category: updated });
  } catch (err) {
    console.error("PUT category err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// --- DELETE: Delete Category ---

/**
 * @method DELETE
 * @path /api/restaurants/[id]/categories/[catId]
 * @description Deletes a specific category and its associations, requires owner authentication.
 */
export async function DELETE(
    req: NextRequest, 
    { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // AWAIT the params object to access the route segments
    const { id: restaurantId, catId } = await params;

    // 1. Validate Category and Restaurant linkage
    const existing = await prisma.category.findUnique({ where: { id: catId } });
    if (!existing || existing.restaurantId !== restaurantId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Validate User ownership of the Restaurant
    const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!r || r.ownerId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 3. Delete related records and the category
    await prisma.dishCategory.deleteMany({ where: { categoryId: catId } });
    await prisma.category.delete({ where: { id: catId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE category err", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}