// src/app/restaurants/[id]/page.tsx
import { getCurrentUser } from "../../../server/auth/getCurrentUser";
import { prisma } from "../../../server/prisma-client";
import { redirect } from "next/navigation";
import Link from "next/link";
import RestaurantForm from "../../_components/restaurants/RestaurantForm";
import DeleteRestaurantButton from "../../_components/restaurants/DeleteRestaurantButton";
import RestaurantQRCode from "../../_components/restaurants/RestaurantQRCode";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantDetailPage(props: Props) {
  const { id } = await props.params;
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const restaurant = await prisma.restaurant.findUnique({ where: { id, ownerId: user.id } });

  if (!restaurant) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
        <p className="text-gray-600">
          We could not find a restaurant with that ID.
        </p>
        <Link
          href="/restaurants"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Back to Restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Link
        href="/restaurants"
        className="text-sm text-gray-500 hover:text-gray-700 transition mb-4 block w-fit"
      >
        ← Back to Restaurants List
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage: {restaurant.name}
      </h1>

      {/* Quick Menu Action */}
      <div className="mb-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-indigo-800">
            🍽️ Menu Categories & Dishes
          </h2>
          <p className="text-indigo-700 text-sm">
            Configure the categories and items for this restaurant's digital menu.
          </p>
        </div>
        <Link
          href={`/restaurants/${restaurant.id}/menu`} // Assuming a menu editor page exists
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium whitespace-nowrap"
        >
          Go to Menu Editor
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Details and Settings */}
        <section className="space-y-6">
          {/* Restaurant Details Form */}
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Restaurant Details
            </h2>
            <RestaurantForm
              id={restaurant.id}
              initial={{ name: restaurant.name, location: restaurant.location }}
            />
          </div>

          {/* Danger Zone */}
          <div className="p-6 border border-red-200 rounded-lg bg-red-50 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-red-800 border-b border-red-300 pb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-red-700 mb-4">
              Permanently delete this restaurant, its menu, and all associated dishes. This cannot be undone.
            </p>
            <DeleteRestaurantButton id={restaurant.id} />
          </div>
        </section>

        {/* Column 2: QR Code and Sharing */}
        <section>
          <RestaurantQRCode restaurantId={restaurant.id} />
        </section>
      </div>
    </main>
  );
}