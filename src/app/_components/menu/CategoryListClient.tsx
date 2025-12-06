/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument , @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
"use client";
import React, { useEffect, useState } from "react";
import { fetchJson } from "../../../lib/email/fetchJson";
import LoadingButton from "../ui/LoadingButton";
import { SkeletonRect } from "../ui/Skeleton";
import Toast from "../ui/Toast";

interface Category {
  id: string;
  name: string;
}

type ToastType = "info" | "error" | "success";

interface ToastState {
  msg: string;
  type?: ToastType;
}

type Props = { restaurantId?: string | null };

export default function CategoryListClient({ restaurantId }: Props) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    console.log("CategoryListClient received restaurantId:", restaurantId);

    if (!restaurantId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data:any = await fetchJson(`/api/restaurants/${restaurantId}/categories`);
        if (!mounted) return;
        setCategories(data.categories || []);
      } catch (err: any) {
        console.error("Load categories failed", err);
        setToast({ msg: err.message || "Failed to load categories", type: "error" });
        setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [restaurantId]);

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();

    if (!restaurantId) {
      setToast({ msg: "Restaurant ID missing. Ensure you opened the menu from the restaurant admin page.", type: "error" });
      return;
    }
    if (!name.trim()) {
      setToast({ msg: "Category name required", type: "error" });
      return;
    }

    setCreating(true);
    try {
      await fetchJson(`/api/restaurants/${restaurantId}/categories`, {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      });
      setName("");
      await loadCategories();
      setToast({ msg: "Category created", type: "success" });
    } catch (err: any) {
      console.error("Create category failed", err);
      setToast({ msg: err.message || "Create failed", type: "error" });
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(catId: string) {
    if (!restaurantId) {
      setToast({ msg: "Restaurant ID missing.", type: "error" });
      return;
    }
    if (!confirm("Delete category and remove from dishes?")) return;
    try {
      await fetchJson(`/api/restaurants/${restaurantId}/categories/${catId}`, { method: "DELETE" });
      await loadCategories();
      setToast({ msg: "Category deleted", type: "success" });
    } catch (err: any) {
      console.error("Delete failed", err);
      setToast({ msg: err.message || "Delete failed", type: "error" });
    }
  }

  async function loadCategories() {
    if (!restaurantId) return;
    try {
      const data = await fetchJson(`/api/restaurants/${restaurantId}/categories`);
      setCategories(data.categories || []);
    } catch (err: any) {
      console.error("Load categories failed", err);
      setToast({ msg: err.message || "Failed to load categories", type: "error" });
    }
  }

  if (!restaurantId) {
    return (
      <div className="rounded-md border p-4 text-sm text-gray-700">
        <div className="mb-2 font-medium">Category management unavailable</div>
        <div className="text-xs text-gray-600">
          This admin widget requires a restaurant context. Open <code>/restaurants/[id]/menu</code> from your dashboard to manage categories.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonRect className="w-40 h-6" />
        <SkeletonRect className="w-full h-10" />
        <SkeletonRect className="w-full h-10" />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          className="flex-1 rounded-md border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category (e.g. Starters)"
          aria-label="New category name"
        />
        <LoadingButton loading={creating} className="bg-blue-600 text-white">
          Add
        </LoadingButton>
      </form>

      <div className="flex flex-col gap-2">
        {categories?.map((c) => (
          <div key={c.id} className="flex items-center justify-between border rounded p-3">
            <div className="font-medium">{c.name}</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    const url = `${window.location.origin}/menu/${restaurantId}#${c.id}`;
                    navigator.clipboard.writeText(url);
                    setToast({ msg: "Link copied", type: "success" });
                  } catch {
                    setToast({ msg: "Could not copy link", type: "error" });
                  }
                }}
                className="px-2 py-1 text-sm border rounded"
              >
                Share
              </button>
              <button onClick={() => handleDelete(c.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
