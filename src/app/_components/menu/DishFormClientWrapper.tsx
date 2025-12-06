/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
"use client";

import React from "react";
import DishForm from "./DishForm"; // must be a client component
import { useRouter } from "next/navigation";
import Toast from "../ui/Toast";

export default function DishFormClientWrapper({
  restaurantId,
  initial,
  id,
}: {
  restaurantId: string;
  initial?: any;
  id?: string;
}) {
  const router = useRouter();
  const [toast, setToast] = React.useState<{ msg: string; type?: string } | null>(null);

  // This will be passed to DishForm (client -> client), not across server boundary
  function handleSaved(result?: any) {
    // you can customize navigation behavior after create/update
    if (id) {
      // edited: go back to menu editor
      router.push(`/restaurants/${restaurantId}/menu`);
    } else {
      // created: go to the restaurant menu editor
      router.push(`/restaurants/${restaurantId}/menu`);
    }
    setToast({ msg: "Saved successfully", type: "success" });
  }

  return (
    <>
      <DishForm restaurantId={restaurantId} initial={initial} id={id} onSaved={handleSaved} />
      <Toast message={toast?.msg ?? null} type={toast?.type as any} onClose={() => setToast(null)} />
    </>
  );
}
