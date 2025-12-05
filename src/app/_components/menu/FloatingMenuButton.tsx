"use client";
import React, { useState } from "react";

export default function FloatingMenuButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <button onClick={()=>setOpen(o=>!o)} className="px-6 py-3 bg-pink-600 text-white rounded-full shadow-lg">
          ☰ Menu
        </button>
      </div>

      {/* optional small menu when open (jump to categories) */}
      {open && <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 bg-white border rounded p-4 shadow">Tap category to jump</div>}
    </>
  );
}
