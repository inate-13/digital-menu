// src/app/restaurants/[id]/menu-editor/page.tsx (assuming path)
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { prisma } from "../../../../server/prisma-client";
import CategoryListClient from "../../../_components/menu/CategoryListClient";
import DishesListClient from "../../../_components/menu/DishesListClient";
import Link from "next/link";

export default async function MenuEditorPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const restaurant = await prisma.restaurant.findUnique({ where: { id: params.id } });
  if (!restaurant || restaurant.ownerId !== user.id) redirect("/restaurants");

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {/* 1. Back Link */}
      <Link
        href={`/restaurants/${restaurant.id}`}
        className="text-sm text-gray-500 hover:text-gray-700 transition mb-4 block w-fit"
      >
        ← Back to {restaurant.name} Management
      </Link>

      {/* 2. Main Header and Primary Action */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Menu Editor — {restaurant.name}
        </h1>
        {/* Primary action to view the public menu */}
        <Link
          href={`/menu/${restaurant.id}`}
          target="_blank" // Good practice to open public menu in a new tab
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-400 transition font-medium"
        >
          View Public Menu ↗
        </Link>
      </div>

      {/* 3. Menu Management Sections Container */}
      <div className="space-y-8">
        
        {/* Categories Section (Panel) */}
        <section className="p-6 border rounded-xl bg-white shadow-xl/5 ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              📁 Menu Categories
            </h2>
            {/* Note: An "Add Category" button should ideally be handled within CategoryListClient */}
          </div>
          <p className="text-sm text-gray-600 mb-4">
             Define the sections your dishes belong to (e.g., Appetizers, Main Courses, Drinks).
          </p>
          <CategoryListClient restaurantId={restaurant.id} />
        </section>

        {/* Dishes Section (Panel) */}
        <section className="p-6 border rounded-xl bg-white shadow-xl/5 ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              🍔 Dishes Management
            </h2>
            {/* Clear "Add New Dish" action */}
            <Link
              href={`/restaurants/${restaurant.id}/dishes/new`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              ➕ Add New Dish
            </Link>
          </div>
          <p className="text-sm text-gray-600 mb-4">
             View, edit, or delete the dishes available in this restaurant's menu.
          </p>
          <DishesListClient restaurantId={restaurant.id} />
        </section>
      </div>
    </main>
  );
}