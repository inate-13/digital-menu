// src/lib/fetchJson.ts
export async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    credentials: "include", // important if server sets cookie
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await res.text().catch(() => "");
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = (data && data.error) || res.statusText || "Request failed";
    throw new Error(err);
  }
  return data;
}
