// src/components/ui/Toast.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function Toast({
  message,
  type = "info",
  onClose,
}: {
  message?: string | null;
  type?: "info" | "error" | "success";
  onClose?: () => void;
}) {
  const [show, setShow] = useState(Boolean(message));

  useEffect(() => {
    if (message) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        // Delay calling onClose until transition is complete (optional, for smoother exit)
        setTimeout(() => onClose?.(), 300); 
      }, 4000);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [message, onClose]);

  // Handle transition classes for fade-in/out
  const transitionClass = show
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-2 pointer-events-none";

  if (!message) return null;

  const typeStyles = {
    error: "bg-red-600 border-red-700",
    success: "bg-green-600 border-green-700",
    info: "bg-gray-800 border-gray-900",
  };

  const bg = typeStyles[type];

  return (
    <div
      className={`fixed right-4 bottom-6 z-50 transition-all duration-300 ease-in-out ${transitionClass}`}
    >
      <div
        className={`flex items-center justify-between ${bg} text-white px-5 py-3 rounded-xl border-b-4 shadow-xl max-w-sm`}
      >
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => setShow(false)}
          className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          {/* Simple X icon */}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}