import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { redirect } from "next/navigation";
import DishForm from "../../../../_components/menu/DishForm"; // client component
import DishFormClientWrapper from "~/app/_components/menu/DishFormClientWrapper";

export default async function NewDishPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Dish</h1>
      <DishFormClientWrapper restaurantId={id} />
    </main>
  );
}
