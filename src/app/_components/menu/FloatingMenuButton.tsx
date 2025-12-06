// src/components/menu/FloatingMenuButton.tsx
"use client";

import React, { useState } from "react";

// Helper for the icon animation
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-6 h-6 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {open ? (
        // Close / X icon
        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        // Hamburger icon
        <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export default function FloatingMenuButton({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: Array<{ id: string; name: string }>;
  activeCategory?: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed right-4 bottom-6 z-50">
        {/* Dropdown Menu */}
        {open && (
          // Positioned above the button, with better styling
          <div className="absolute bottom-16 right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl p-2 max-h-80 overflow-y-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelect(c.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition text-sm truncate ${
                  activeCategory === c.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-blue-50 text-gray-800"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Floating Action Button (FAB) */}
        <button
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-label="Toggle menu categories"
          className="w-14 h-14 rounded-full shadow-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition duration-150 transform hover:scale-105"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Backdrop to close on tap outside */}
      {open && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpen(false)} 
          aria-hidden="true" 
        />
      )}
    </>
  );
}