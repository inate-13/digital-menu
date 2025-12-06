/* eslint-disable @typescript-eslint/no-unsafe-assignment , @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */


"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../ui/Toast";

export default function DeleteRestaurantButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{msg:string;type?:string}|null>(null);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete restaurant? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to delete");
      }
      router.push("/restaurants");
    } catch (err: any) {
      console.error("delete failed", err);
      setToast({ msg: err.message || "Delete failed", type: "error" });
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={handleDelete} disabled={loading} className="px-3 py-2 rounded-md bg-red-600 text-white">
        {loading ? "Deleting…" : "Delete restaurant"}
      </button>
      <Toast message={toast?.msg} type={toast?.type as any} onClose={() => setToast(null)} />
    </>
  );
}
