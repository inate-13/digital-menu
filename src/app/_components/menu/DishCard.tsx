"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DishCard({ dish, restaurantId }: { dish: any; restaurantId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State for delete button loading
  
  const categories = dish.dishCategories?.map((dc: any) => dc.category?.name).filter(Boolean).join(", ");
  const priceText = dish.price ? `₹ ${Number(dish.price).toFixed(2)}` : "-";
  
  // New: Render spice level indicators (0-5 chilis)
  const spiceLevel = dish.spiceLevel > 0 ? Array(dish.spiceLevel).fill('🌶️').join('') : '';

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete ${dish.name}? This action cannot be undone.`)) return;

    setLoading(true);
    try {
      // API endpoint for deleting a dish
      const res = await fetch(`/api/restaurants/${restaurantId}/dishes/${dish.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to delete dish");
      }
      
      // Use Next.js router to refresh the list containing this card
      router.refresh(); 
    } catch (err) {
      console.error("Delete dish failed:", err);
      alert((err as Error).message || "An unexpected error occurred during deletion.");
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 flex gap-4 items-start bg-white">
      <div className="flex-1">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            {/* veg / non-veg icon */}
            <span
              className={`w-3 h-3 rounded-sm border ${
                dish.isVeg ? "border-green-700 bg-green-600" : "border-red-700 bg-red-600"
              }`}
            />
            <h3 className="font-semibold">{dish.name}</h3>
            
            {/* Updated: Spice Level Indicator */}
            {spiceLevel && <span className="text-lg leading-none">{spiceLevel}</span>}
          </div>
          <div className="text-sm text-gray-800 font-medium">{priceText}</div>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{dish.description}</p>
        <div className="mt-3 text-xs text-gray-500">Categories: {categories || "-"}</div>

        <div className="mt-3 flex gap-2">
          {/* Edit Link */}
          <Link 
            href={`/restaurants/${restaurantId}/dishes/${dish.id}`} 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            Edit
          </Link>
          {/* View Public Link */}
          <Link 
            href={`/menu/${restaurantId}#${dish.id}`} 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            View public
          </Link>
          {/* New: Delete button */}
          <button 
            onClick={handleDelete} 
            disabled={loading} 
            className="px-3 py-1 rounded text-sm bg-red-600 text-white disabled:opacity-60 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {dish.imageUrl ? (
        <img src={dish.imageUrl} alt={dish.name} className="w-24 h-24 object-cover rounded" />
      ) : (
        <div className="w-24 h-24 bg-gray-100 rounded" />
      )}
    </div>
  );
}