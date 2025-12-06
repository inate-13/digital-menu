// src/app/restaurants/page.tsx
import { getCurrentUser } from "../../server/auth/getCurrentUser";
import { prisma } from "../../server/prisma-client";
import Link from "next/link";
import { redirect } from "next/navigation";
import RestaurantsListClient from "../_components/restaurants/RestaurantClientLists"; // Assuming correct path

export default async function RestaurantsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Restaurants</h1>
        <Link 
          href="/restaurants/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          ➕ Create New Restaurant
        </Link>
      </div>

      <RestaurantsListClient />
    </main>
  );
}