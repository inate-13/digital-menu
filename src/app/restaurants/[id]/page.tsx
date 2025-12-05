// src/app/restaurants/[id]/page.tsx
import { prisma } from "../../../server/prisma-client";
import { getCurrentUser } from  "../../../server/auth/getCurrentUser";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
// src/app/restaurants/[id]/page.tsx
 import RestaurantFormClient from "../../_components/restaurants/RestaurantForm"; // client component
import DeleteRestaurantButton from "../../_components/restaurants/DeleteRestaurantButton"; // client component

export default async function EditRestaurantPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const restaurant = await prisma.restaurant.findUnique({ where: { id: params.id } });
  if (!restaurant || restaurant.ownerId !== user.id) redirect("/restaurants");

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Restaurant</h1>

      <RestaurantFormClient
        initial={{ name: restaurant.name, location: restaurant.location }}
        id={restaurant.id}
      />

      <section className="mt-6">
        <DeleteRestaurantButton id={restaurant.id} />
      </section>
    </main>
  );
}
