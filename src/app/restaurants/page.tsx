// // src/app/restaurants/page.tsx
import { getCurrentUser } from "../../server/auth/getCurrentUser";
import { prisma } from "../../server/prisma-client";
import Link from "next/link";
import RestaurantCard from "../_components/restaurants/RestaurantCard";
 import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import RestaurantsListClient from "../_components/restaurants/RestaurantClientLists";

// // src/app/restaurants/page.tsx
 

// // dynamic import MUST return the default export of the client component
// // const RestaurantsListClient = dynamic(
// //   () => import("../_components/restaurants/RestaurantsList"),
// //   { ssr: false }
// // );

// export default async function RestaurantsPage() {
//   const user = await getCurrentUser();
//   if (!user) redirect("/auth");

//   return (
//     <main className="p-6 max-w-6xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Your Restaurants</h1>
//         <Link href="/restaurants/new" className="px-4 py-2 bg-blue-600 text-white rounded-md">
//           Create Restaurant
//         </Link>
//       </div>

//       {/* Client-only list (renders on client; avoids server→client serialization issues) */}
//       <RestaurantsListClient />
//     </main>
//   );
// }
// src/app/restaurants/page.tsx
 

export default async function RestaurantsPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-6">Please login</div>;

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Restaurants</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </main>
  );
}
