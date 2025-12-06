/* eslint-disable @typescript-eslint/no-unsafe-assignment,react/no-unescaped-entities, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../server/auth/getCurrentUser";
import { prisma } from "../../server/prisma-client";
import Link from "next/link";
import { SkeletonRect } from "../_components/ui/Skeleton"; // Assuming SkeletonRect is available

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  // Fetch restaurants for the list section
  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8 max-w-6xl mx-auto">
      {/* 1. Updated Welcome Message */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        👋 Welcome, {user.fullName || user.email}
      </h1>

      {/* 2. Quick Actions (Simplified) */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Action 1: Create Restaurant */}
        <Link
          href="/restaurants/new"
          className="p-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-sm transition duration-150 ease-in-out"
        >
          <h2 className="text-lg font-bold mb-2 text-blue-800">➕ Create New Restaurant</h2>
          <p className="text-gray-600 text-sm">
            Add a new restaurant and configure its menu structure.
          </p>
        </Link>

        {/* Action 2: Manage Restaurants (Existing ones) */}
        <Link
          href="/restaurants"
          className="p-6 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg shadow-sm transition duration-150 ease-in-out"
        >
          <h2 className="text-lg font-bold mb-2 text-green-800">⚙️ Manage Existing Restaurants</h2>
          <p className="text-gray-600 text-sm">
            View, edit, and manage settings for all your existing locations.
          </p>
        </Link>
        
        {/* ❌ Removed the "Manage Dishes" link */}

      </div>

      {/* 3. Restaurants List */}
      <h2 className="text-xl font-semibold mb-4 border-t pt-6 text-gray-700">Your Restaurants ({restaurants.length})</h2>

      {restaurants.length === 0 ? (
        <div className="border border-dashed rounded-md p-6 text-center text-gray-600 bg-gray-50">
          You dont have any restaurants yet. Click Create New Restaurant above to get started
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition">
              <h3 className="font-semibold text-lg text-gray-800">{r.name}</h3>
              <p className="text-gray-500 text-sm italic">{r.location}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/restaurants/${r.id}`}
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 border rounded-md text-gray-700 transition"
                >
                  Manage Details
                </Link>
                <Link
                  href={`/menu/${r.id}`}
                  className="text-sm px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition"
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}