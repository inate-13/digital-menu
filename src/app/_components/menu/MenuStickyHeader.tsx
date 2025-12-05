"use client";
import React, { useEffect, useState } from "react";

export default function MenuStickyHeader({ categories }: { categories: any[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(()=>{
    const observers: IntersectionObserver[] = [];
    const opts = { root: null, rootMargin: "-40% 0px -60% 0px", threshold: 0 };
    categories.forEach(c=>{
      const el = document.getElementById(c.id);
      if (!el) return;
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(en=>{
          if (en.isIntersecting) setActive(c.id);
        });
      }, opts);
      obs.observe(el);
      observers.push(obs);
    });
    return ()=> observers.forEach(o=>o.disconnect());
  }, [categories]);

  function scrollToId(id?: string) {
    if (!id) window.scrollTo({ top: 0, behavior: "smooth" });
    const el = document.getElementById(id || "");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-0 z-20 bg-white border-b">
      <div className="overflow-x-auto no-scrollbar flex gap-4 px-4 py-2">
        <button onClick={()=>scrollToId(undefined)} className={`px-3 py-1 rounded ${active===null ? "bg-gray-100" : ""}`}>Recommended</button>
        {categories.map(c=>(
          <button key={c.id} onClick={()=>scrollToId(c.id)} className={`px-3 py-1 rounded ${active===c.id ? "bg-gray-100 font-medium" : ""}`}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
