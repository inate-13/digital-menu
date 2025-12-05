"use client";
import React, { useEffect, useState } from "react";
 import DishCard from "./DishCard";
import { fetchJson } from "../../../lib/email/fetchJson";
import LoadingButton from "../ui/LoadingButton";
import SkeletonCard, { SkeletonRect } from "../ui/Skeleton";
import Toast from "../ui/Toast";
 
 
export default function DishesListClient({ restaurantId }: { restaurantId?: string }) {
  const [dishes, setDishes] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      setDishes([]);
      setToast({ msg: "No restaurant context", type: "error" });
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchJson(`/api/restaurants/${restaurantId}/dishes`);
        if (!mounted) return;
        setDishes(data.dishes || []);
      } catch (err: any) {
        console.error("fetch dishes failed", err);
        if (!mounted) return;
        setToast({ msg: err.message || "Failed to load dishes", type: "error" });
        setDishes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [restaurantId]);

  if (loading) {
    return (
      <>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Toast message={toast?.msg ?? null} type={toast?.type as any} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <>
      {dishes && dishes.length === 0 ? (
        <div className="text-gray-600">No dishes yet</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {dishes!.map((d) => (
            <DishCard key={d.id} dish={d} restaurantId={restaurantId!} />
          ))}
        </div>
      )}
      <Toast message={toast?.msg ?? null} type={toast?.type as any} onClose={() => setToast(null)} />
    </>
  );
}
