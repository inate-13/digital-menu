import { prisma } from "../../../../../server/prisma-client";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import DishForm from "../../../../_components/menu/DishForm";
import { redirect } from "next/navigation";

 
import DishFormClientWrapper from "../../../../_components/menu/DishFormClientWrapper";

export default async function EditDishPage({ params }: { params: { id: string; dishId: string }}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const dish = await prisma.dish.findUnique({ where: { id: params.dishId }, include: { dishCategories: true }});
  if (!dish || dish.restaurantId !== params.id) redirect(`/restaurants/${params.id}/menu`);

  // Build a plain serializable initial object for the client
  const initial = {
    name: dish.name,
    description: dish.description,
    imageUrl: dish.imageUrl,
    spiceLevel: dish.spiceLevel,
    price: dish.price ? dish.price.toString() : null,
    isVeg: dish.isVeg,
    categories: dish.dishCategories.map((dc) => ({ categoryId: dc.categoryId })),
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Dish</h1>
      <DishFormClientWrapper restaurantId={params.id} id={dish.id} initial={initial} />
    </main>
  );
}

