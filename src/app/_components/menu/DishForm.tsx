/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */

"use client";
import React, { useEffect, useState } from "react";
import LoadingButton from "../ui/LoadingButton";
import { fetchJson } from "../../../lib/email/fetchJson";

type Props = {
  restaurantId: string;
  initial?: any;
  id?: string;
  onSaved?: () => void;
};

export default function DishForm({ restaurantId, initial, id, onSaved }: Props) {
  

  const [price, setPrice] = useState<string>(initial?.price ? String(initial.price) : "");
  const [isVeg, setIsVeg] = useState<boolean>(initial?.isVeg ?? true);

 
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [spiceLevel, setSpiceLevel] = useState<number | null>(initial?.spiceLevel ?? null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>( initial?.categories?.map((c:any)=>c.categoryId) ?? []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    (async ()=>{
      try {
        const data = await fetchJson(`/api/restaurants/${restaurantId}/categories`);
        setCategories(data.categories || []);
      } catch (err) { console.error(err) }
    })()
  },[restaurantId]);

  async function handleUploadFile(file: File) {
    setUploading(true);
    try {
      // convert to base64
      const base64 = await new Promise<string>((res, rej)=>{
        const fr = new FileReader();
        fr.onload = ()=> res(String(fr.result));
        fr.onerror = rej;
        fr.readAsDataURL(file);
      });
      const data = await fetchJson("/api/upload/image", {
        method: "POST",
        body: JSON.stringify({ file: base64, filename: `${Date.now()}-${file.name}` })
      });
      setImageUrl(data.url);
    } catch (err:any) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally { setUploading(false) }
  }
  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name required");

    const priceNumber = Number(price);
    if (!price || isNaN(priceNumber) || priceNumber <= 0) {
      return setError("Valid price required");
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        imageUrl,
        spiceLevel,
        categoryIds: selected,
        price: Number(priceNumber),    // or String(price)
        isVeg,
      };

      if (id) {
        await fetchJson(`/api/restaurants/${restaurantId}/dishes/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await fetchJson(`/api/restaurants/${restaurantId}/dishes`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      onSaved?.();
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium block">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2"/>
      </div>

      <div>
        <label className="text-sm font-medium block">Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="mt-1 w-full border rounded px-3 py-2"/>
      </div>
      <div>
        <label className="text-sm font-medium block">Price (₹)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="e.g. 249.00"
        />
      </div>

      <div>
        <span className="text-sm font-medium block mb-2">Type</span>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded border-2 transition-all" style={{ borderColor: isVeg === true ? '#15803d' : '#e5e7eb', backgroundColor: isVeg === true ? '#dcfce7' : 'transparent' }}>
        <span className="w-3 h-3 rounded-sm border border-green-700 bg-green-600" />
        <input
          type="radio"
          name="dishType"
          className="hidden"
          checked={isVeg === true}
          onChange={() => setIsVeg(true)}
        />
        <span className="text-sm font-medium">Veg</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded border-2 transition-all" style={{ borderColor: isVeg === false ? '#b91c1c' : '#e5e7eb', backgroundColor: isVeg === false ? '#fee2e2' : 'transparent' }}>
        <span className="w-3 h-3 rounded-sm border border-red-700 bg-red-600" />
        <input
          type="radio"
          name="dishType"
          className="hidden"
          checked={isVeg === false}
          onChange={() => setIsVeg(false)}
        />
        <span className="text-sm font-medium">Non-Veg</span>
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block">Categories</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((c)=>(
            <label key={c.id} className={`px-3 py-1 rounded border ${selected.includes(c.id) ? "bg-blue-600 text-white":""}`}>
              <input type="checkbox" className="hidden" checked={selected.includes(c.id)} onChange={()=>{
                setSelected(s => s.includes(c.id) ? s.filter(x=>x!==c.id) : [...s, c.id]);
              }}/>
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block">Spice level (0-5)</label>
        <input type="range" min={0} max={5} value={spiceLevel ?? 0} onChange={e=>setSpiceLevel(Number(e.target.value))}/>
      </div>

      <div>
        <label className="text-sm font-medium block">Image</label>
        {imageUrl ? <img src={imageUrl} alt="dish" className="w-28 h-28 object-cover rounded mb-2"/> : null}
        <input type="file" accept="image/*" onChange={e=>{ if(e.target.files?.[0]) handleUploadFile(e.target.files[0]); }}/>
        {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <LoadingButton loading={loading} className="bg-green-600 text-white">
        {id ? "Save Dish" : "Create Dish"}
      </LoadingButton>
    </form>
  );
}
