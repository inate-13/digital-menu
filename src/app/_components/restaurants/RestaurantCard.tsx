/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function RestaurantCard({ restaurant }: { restaurant: any }) {
  const router = useRouter();

//   const goManage = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     router.push(`/restaurants/${restaurant.id}`);
//   };
  const goView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/restaurants/${restaurant.id}/menu`);
  };
  const goEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/restaurants/${restaurant.id}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg">{restaurant.name}</h3>
        <p className="text-sm text-gray-600">{restaurant.location}</p>
      </div>

      <div className="mt-4 flex gap-2">
        {/* <button onClick={goManage} className="text-sm px-3 py-1 border rounded-md">
          Manage
        </button> */}
        <button onClick={goView} className="text-sm px-3 py-1 bg-green-600 text-white rounded-md">
          Manage Menu
        </button>
        <button onClick={goEdit} className="text-sm px-3 py-1 border rounded-md">
          Edit or Share
        </button>
      </div>
    </div>
  );
}
