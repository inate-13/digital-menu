/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/prefer-optional-chain */
 "use client";

import { useState } from "react";
import { COUNTRIES } from "../../../lib/email/countries";

type Props = {
  initialName?: string;
};

function findBestCountryMatch(input: string) {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  let best = COUNTRIES.find((c) => c.toLowerCase() === s);
  if (best) return best;
  best = COUNTRIES.find((c) => c.toLowerCase().startsWith(s));
  if (best) return best;
  best = COUNTRIES.find((c) => c.toLowerCase().includes(s));
  return best ?? null;
}

export default function OnboardingClient({ initialName = "" }: Props) {
  const [fullName, setFullName] = useState(initialName);
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setInfo("");
    if (!fullName.trim()) return setError("Full name is required");
    if (!country.trim()) return setError("Country is required");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), country: country.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Failed to update profile");
        setLoading(false);
        return;
      }
      // success
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function onCountryBlur() {
    if (!country) return;
    const match = findBestCountryMatch(country);
    if (match && match !== country) {
      setCountry(match);
      setInfo(`Did you mean "${match}"? Auto-corrected.`);
      // clear info after a few seconds
      setTimeout(() => setInfo(""), 4000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow p-6 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Complete your profile</h2>
        <p className="text-sm text-gray-600 mb-4">We need your full name and country to create your account.</p>

        <label className="block mb-3">
          <div className="text-sm font-medium">Full name</div>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
          />
        </label>

        <label className="block mb-3">
          <div className="text-sm font-medium">Country</div>
          <input
            list="country-list"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onBlur={onCountryBlur}
            placeholder="India"
          />
          <datalist id="country-list">
            {COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        {info && <div className="text-sm text-green-600 mb-2">{info}</div>}
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {loading ? "Saving…" : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
