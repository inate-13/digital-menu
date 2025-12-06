// src/components/restaurants/RestaurantClientLists.tsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchJson } from "../../../lib/email/fetchJson"; 
import RestaurantCard from "./RestaurantCard";
import SkeletonCard from "../../_components/ui/Skeleton"; 
import Toast from "../ui/Toast";

export default function RestaurantsListClient() {
  const [restaurants, setRestaurants] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchJson<{ ok: boolean; restaurants: any[] }>("/api/restaurants");
        if (!mounted) return;
        setRestaurants(data.restaurants || []);
      } catch (err: any) {
        console.error("fetch restaurants", err);
        setToast({ msg: err.message || "Failed to load restaurants", type: "error" });
        setRestaurants([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    // show 3 skeletons
    return (
      <>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Toast message={toast?.msg} type={toast?.type as any} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <>
      {restaurants && restaurants.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center text-gray-600 bg-gray-50 text-lg">
            No restaurants found. Click the button above to create your first one!
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants?.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
      <Toast message={toast?.msg} type={toast?.type as any} onClose={() => setToast(null)} />
    </>
  );
}