/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
// src/app/restaurants/new/page.tsx
import dynamic from "next/dynamic";
import { getCurrentUser } from "../../../server/auth/getCurrentUser";
import { redirect } from "next/navigation";
 
import RestaurantFormClient from "../../_components/restaurants/RestaurantForm"; // client component

export default async function NewRestaurantPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Restaurant</h1>
      <RestaurantFormClient />
    </main>
  );
}
