
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */

// src/components/menu/MenuStickyHeader.tsx
"use client";

import React from "react";

export default function MenuStickyHeader({ currentName }: { currentName?: string }) {
  return (
    // Sticky top-0, z-index 40, transparent background with blur
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto py-3 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Main category name in focus */}
          <div className="text-xl font-bold text-gray-900 truncate">
            {currentName || "Menu"}
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Scroll to browse or tap the menu button
          </div>
        </div>
      </div>
    </div>
  );
}