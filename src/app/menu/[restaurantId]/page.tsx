// import { prisma } from "../../../server/prisma-client";
// import Link from "next/link";
// import dynamic from "next/dynamic";

// const MenuStickyHeader = dynamic(() => import("../../_components/menu/CategoryListClient"),  );
// const FloatingMenuButton = dynamic(() => import("../../_components/menu/FloatingMenuButton"),  );
// // src/app/menu/[restaurantId]/page.tsx
 

// // dynamic imports - point at the client components under src/components/menu
 
// export default async function PublicMenuPage({ params }: { params: { restaurantId: string }}) {
//   const restaurantId = params.restaurantId;

//   try {
//     const r = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
//     if (!r) {
//       return (
//         <main className="p-6">
//           <div className="text-gray-600">Restaurant not found.</div>
//           <Link href="/menu" className="text-blue-600 underline mt-4 block">Back to menus</Link>
//         </main>
//       );
//     }
//     // categories and dishes

//     const categories = await prisma.category.findMany({ where: { restaurantId }, orderBy: { position: "asc" }});
//     const dishes = await prisma.dish.findMany({
//       where: { restaurantId },
//       include: { dishCategories: { include: { category: true } } },
//       orderBy: { createdAt: "asc" },
//     });

//     const byCategory: Record<string, any[]> = {};
//     for (const c of categories) byCategory[c.id] = [];
//     const uncategorized: any[] = [];
//     for (const d of dishes) {
//       if (!d.dishCategories || d.dishCategories.length === 0) uncategorized.push(d);
//       else {
//         for (const dc of d.dishCategories) {
//           if (byCategory[dc.categoryId]) byCategory[dc.categoryId].push(d);
//         }
//       }
//     }

//     return (
//       <main className="max-w-3xl mx-auto p-4">
//         <header className="border-b pb-4 mb-4">
//           <h1 className="text-xl font-semibold">{r.name} <span className="text-sm font-normal ml-2">{r.location}</span></h1>
//         </header>

//         {/* client sticky header */}
//         <MenuStickyHeader categories={categories} />

//         {uncategorized.length > 0 && (
//           <section id="recommended" className="mb-6">
//             <h2 className="text-center border-y py-2 font-semibold">Recommended</h2>
//             <div className="mt-4 space-y-4">
//               {uncategorized.map(d => <DishPublic key={d.id} dish={d} />)}
//             </div>
//           </section>
//         )}

//         {categories.map(c => (
//           <section id={c.id} key={c.id} className="mb-6">
//             <h2 className="text-center border-y py-2 font-semibold">{c.name}</h2>
//             <div className="mt-4 space-y-4">
//               {(byCategory[c.id] || []).map(d => <DishPublic key={d.id} dish={d} />)}
//             </div>
//           </section>
//         ))}

//         <FloatingMenuButton />
//       </main>
//     );
//   } catch (err) {
//     console.error("Public menu error:", err);
//     return (
//       <main className="p-6">
//         <div className="text-red-600">Failed to load menu.</div>
//       </main>
//     );
//   }
// }

// function DishPublic({ dish }: { dish: any }) {
//   const priceText = dish.price ? `₹ ${Number(dish.price).toFixed(2)}` : "";
//   const isVeg = dish.isVeg ?? true;

//   return (
//     <article className="flex gap-4 border rounded p-3 bg-white">
//       <div className="flex-1">
//         <div className="flex items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <span
//               className={`w-3 h-3 rounded-sm border ${
//                 isVeg ? "border-green-700 bg-green-600" : "border-red-700 bg-red-600"
//               }`}
//             />
//             <h3 className="font-semibold">{dish.name}</h3>
//           </div>
//           {priceText && <div className="text-sm font-medium text-gray-900">{priceText}</div>}
//         </div>
//         <div className="text-sm text-gray-600 mt-2 line-clamp-3">{dish.description}</div>
//       </div>

//       {dish.imageUrl ? (
//         <img
//           src={dish.imageUrl}
//           alt={dish.name}
//           className="w-24 h-24 object-cover rounded"
//           loading="lazy"
//         />
//       ) : (
//         <div className="w-24 h-24 bg-gray-100 rounded" />
//       )}
//     </article>
//   );
// }
// src/app/menu/[restaurantId]/page.tsx
import { prisma } from "../../../server/prisma-client";
import PublicMenuClientWrapper from "../../_components/menu/PublicMenuClientWrapper";

export const dynamic = "force-dynamic"; // ensures fresh data

export default async function PublicMenuPage({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, name: true, location: true },
  });

  if (!restaurant) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <div className="text-center text-gray-600">Restaurant not found.</div>
      </main>
    );
  }

  // fetch categories and dishes and serialize Decimal
  const categories = await prisma.category.findMany({
    where: { restaurantId },
    orderBy: { position: "asc" },
  });

  const dishesRaw = await prisma.dish.findMany({
    where: { restaurantId },
    include: { dishCategories: { include: { category: true } } },
    orderBy: { createdAt: "asc" },
  });

  const dishes = dishesRaw.map(d => ({
    ...d,
    price: d.price ? d.price.toString() : null,
  }));

  // supply plain serializable props to client wrapper
  return (
    <main className="min-h-screen bg-gray-50">
      <PublicMenuClientWrapper
        restaurant={{ id: restaurant.id, name: restaurant.name, location: restaurant.location }}
        categories={categories}
        dishes={dishes}
      />
    </main>
  );
}
