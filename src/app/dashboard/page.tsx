import { redirect } from "next/navigation";
import { getCurrentUser } from "../../server/auth/getCurrentUser";
import { prisma } from "../../server/prisma-client";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.fullName || user.email}
      </h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link
          href="/restaurants/new"
          className="p-6 bg-blue-50 hover:bg-blue-100 border rounded-lg shadow-sm transition"
        >
          <h2 className="text-lg font-semibold mb-2">Create Restaurant</h2>
          <p className="text-gray-600 text-sm">
            Add a new restaurant and configure its menu structure.
          </p>
        </Link>

        <Link
          href="/restaurants"
          className="p-6 bg-green-50 hover:bg-green-100 border rounded-lg shadow-sm transition"
        >
          <h2 className="text-lg font-semibold mb-2">Manage Restaurants</h2>
          <p className="text-gray-600 text-sm">
            Edit restaurant details, categories, dishes & menus.
          </p>
        </Link>

        <Link
          href="/dishes"
          className="p-6 bg-orange-50 hover:bg-orange-100 border rounded-lg shadow-sm transition"
        >
          <h2 className="text-lg font-semibold mb-2">Manage Dishes</h2>
          <p className="text-gray-600 text-sm">
            Create, update & categorize dishes across your restaurants.
          </p>
        </Link>
      </div>

      {/* Restaurants List */}
      <h2 className="text-xl font-semibold mb-4">Your Restaurants</h2>

      {restaurants.length === 0 ? (
        <div className="border rounded-md p-6 text-center text-gray-600">
          You don't have any restaurants yet.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-gray-600 text-sm">{r.location}</p>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/restaurants/${r.id}`}
                  className="text-sm px-3 py-1 border rounded-md"
                >
                  Manage
                </Link>
                <Link
                  href={`/menu/${r.id}`}
                  className="text-sm px-3 py-1 bg-green-600 text-white rounded-md"
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
