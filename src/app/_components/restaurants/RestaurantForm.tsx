"use client";
import React, { useState } from "react";
import { fetchJson } from "../../../lib/email/fetchJson";
import { useRouter } from "next/navigation";
import LoadingButton from "../ui/LoadingButton";

type Props = { initial?: { name: string; location: string }; id?: string };

export default function RestaurantForm({ initial, id }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!name.trim() || name.trim().length < 2) return setError("Name is required (min 2 chars)");
    if (!location.trim() || location.trim().length < 2) return setError("Location is required (min 2 chars)");

    setLoading(true);
    try {
      if (id) {
        await fetchJson(`/api/restaurants/${id}`, {
          method: "PUT",
          body: JSON.stringify({ name: name.trim(), location: location.trim() }),
        });
        router.push(`/restaurants/${id}`);
      } else {
        const data = await fetchJson("/api/restaurants", {
          method: "POST",
          body: JSON.stringify({ name: name.trim(), location: location.trim() }),
        });
        router.push(`/restaurants/${data.restaurant.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <div className="text-sm font-medium">Restaurant name</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="e.g. The Blue Plate"
          required
        />
      </label>

      <label className="block">
        <div className="text-sm font-medium">Location</div>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
          placeholder="City, Street or Address"
          required
        />
      </label>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex gap-3">
        {/* <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {loading ? "Saving…" : id ? "Save changes" : "Create restaurant"}
        </button> */}
        <LoadingButton loading={loading} className="bg-blue-600 text-white">
  {id ? "Save changes" : "Create restaurant"}
</LoadingButton>
      </div>
    </form>
  );
}
