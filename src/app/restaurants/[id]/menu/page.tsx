// src/app/restaurants/[id]/menu/page.tsx
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

  console.log("Rendering MenuEditorPage for restaurant:", restaurant.id);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu Manager — {restaurant.name}</h1>
        <Link href={`/menu/${restaurant.id}`} className="px-3 py-1 border rounded">View public</Link>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <CategoryListClient restaurantId={restaurant.id} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Dishes</h2>
          <Link href={`/restaurants/${restaurant.id}/dishes/new`} className="px-3 py-2 bg-blue-600 text-white rounded">Create Dish</Link>
        </div>
        <DishesListClient restaurantId={restaurant.id} />
      </section>
    </main>
  );
}
