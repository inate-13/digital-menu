/* eslint-disable @typescript-eslint/no-unsafe-assignment , @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
// src/components/menu/PublicMenuClientWrapper.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import MenuStickyHeader from "./MenuStickyHeader";
import FloatingMenuButton from "./FloatingMenuButton";
import Image from "next/image";

export default function PublicMenuClientWrapper({
  restaurant,
  categories,
  dishes,
}: {
  restaurant: { id: string; name: string; location?: string };
  categories: Array<{ id: string; name: string }>;
  dishes: Array<any>;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories?.[0]?.id ?? null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // group dishes by category id (and uncategorized)
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const c of categories) map[c.id] = [];
    const uncategorized: any[] = [];
    for (const d of dishes) {
      if (!d.dishCategories || d.dishCategories.length === 0) {
        uncategorized.push(d);
      } else {
        // a dish may be in multiple categories; attach to each
        d.dishCategories.forEach((dc: any) => {
          const cid = dc.categoryId;
          if (!map[cid]) map[cid] = [];
          map[cid].push(d);
        });
      }
    }
    return { categorized: map, uncategorized };
  }, [categories, dishes]);

  // Handle anchor clicks/jumps
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      // scroll and offset from sticky header
      const headerHeight = 70; // approximate sticky header height
      const y = element.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Handle initial load with anchor hash in URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Check if hash is a category ID
      if (categories.some((c) => c.id === hash)) {
        handleSelectCategory(hash);
      }
      // Check if hash is a dish ID
      else if (dishes.some((d) => d.id === hash)) {
        // Find the category of the dish and select that category
        const dish = dishes.find(d => d.id === hash);
        const categoryId = dish?.dishCategories?.[0]?.categoryId;
        if (categoryId) {
            handleSelectCategory(categoryId);
        }
      }
    }
  }, [categories, dishes]);


  return (
    <div className="bg-gray-50 min-h-screen">
      <MenuStickyHeader currentName={restaurant.name} />

      <main className="max-w-3xl mx-auto py-6 px-4">
        {/* Restaurant Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          {restaurant.location && <p className="text-gray-600 mt-1">{restaurant.location}</p>}
        </header>

        {/* Categories and Dishes */}
        <section>
          {categories.map((c) => (
            <div
              key={c.id}
              id={c.id} // Anchor for scrolling
              ref={(el) => { sectionRefs.current[c.id] = el; }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold mb-4 py-2 border-b border-gray-200">
                {c.name}
              </h2>
              <div className="space-y-4">
                {grouped.categorized[c.id]?.map((d) => (
                  <DishPublic key={d.id} dish={d} />
                ))}
                {grouped.categorized[c.id]?.length === 0 && (
                  <p className="text-gray-500">No dishes in this category yet.</p>
                )}
              </div>
            </div>
          ))}

          {/* Uncategorized Dishes */}
          {grouped.uncategorized.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 py-2 border-b border-gray-200">
                Other Dishes
              </h2>
              <div className="space-y-4">
                {grouped.uncategorized.map((d) => (
                  <DishPublic key={d.id} dish={d} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <FloatingMenuButton
        categories={categories}
        activeCategory={activeCategory}
        onSelect={(id) => handleSelectCategory(id)}
      />
    </div>
  );
}

/* Small presentational dish component for public menu */
function DishPublic({ dish }: { dish: any }) {
  const [isExpanded, setIsExpanded] = useState(false); // New state for 'See More' feature
  const priceText = dish.price ? `₹ ${Number(dish.price).toFixed(2)}` : "";
  const isVeg = dish.isVeg ?? true;
  const descriptionText = dish.description || "";
  // Arbitrary check: if description is > 150 chars, show the 'See More' button
  const isLongDescription = descriptionText.length > 150; 

  return (
    <article 
      id={dish.id} 
      className="flex gap-4 border rounded p-3 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="flex-1">
        
        {/* Dish Name (on first line) */}
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-sm border ${isVeg ? "border-green-700 bg-green-600" : "border-red-700 bg-red-600"}`}
            aria-hidden
          />
          <h3 className="font-semibold">{dish.name}</h3>
        </div>

        {/* Price (NEW POSITION: below name, pushed right) */}
        {priceText && <div className="text-sm font-medium text-gray-900 mt-1 text-right">{priceText}</div>}
        
        {/* Description with See More/Less (NEW FEATURE) */}
        {descriptionText && (
          <div className="mt-2">
            <p className={`text-sm text-gray-600 ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {descriptionText}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded(s => !s)}
                className="text-xs font-medium text-blue-600 mt-1 hover:text-blue-700"
              >
                {isExpanded ? "See Less" : "See More"}
              </button>
            )}
          </div>
        )}

        {/* Categories (as tags) */}
        <div className={`mt-3 text-xs text-gray-500 ${descriptionText ? '' : 'mt-2'}`}> 
          {(dish.dishCategories || [])
            .map((dc: any) => dc.category?.name)
            .filter(Boolean)
            .join(", ")}
        </div>
      </div>
      
      {/* Dish Image */}
      {dish.imageUrl && (
        <img
          src={dish.imageUrl}
          alt={dish.name}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
        />
      )}
    </article>
  );
}