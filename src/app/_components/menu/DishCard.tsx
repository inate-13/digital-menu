"use client";
import React from "react";
import Link from "next/link";

export default function DishCard({ dish, restaurantId }: { dish: any; restaurantId: string }) {
  const categories = dish.dishCategories?.map((dc: any) => dc.category?.name).filter(Boolean).join(", ");
  const priceText = dish.price ? `₹ ${Number(dish.price).toFixed(2)}` : "-";

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
          </div>
          <div className="text-sm text-gray-800 font-medium">{priceText}</div>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{dish.description}</p>
        <div className="mt-3 text-xs text-gray-500">Categories: {categories || "-"}</div>

        <div className="mt-3 flex gap-2">
          <Link href={`/restaurants/${restaurantId}/dishes/${dish.id}`} className="px-3 py-1 border rounded text-sm">
            Edit
          </Link>
          <Link href={`/menu/${restaurantId}#${dish.id}`} className="px-3 py-1 border rounded text-sm">
            View public
          </Link>
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
