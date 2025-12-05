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
        onClose?.();
      }, 4000);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [message, onClose]);

  if (!show || !message) return null;

  const bg = type === "error" ? "bg-red-600" : type === "success" ? "bg-green-600" : "bg-gray-800";

  return (
    <div className="fixed right-4 bottom-6 z-50">
      <div className={`${bg} text-white px-4 py-2 rounded-md shadow`}>{message}</div>
    </div>
  );
}
