// src/app/auth/onboarding/page.tsx
"use client";

import { useState } from "react";
// Assuming this path is correct for your COUNTRIES list
import { COUNTRIES } from "../../../lib/email/countries";

type Props = {
  initialName?: string;
};

// ... (omitted utility function findBestCountryMatch for brevity) ...
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

export default function AuthOnboardingClient({ initialName = "" }: Props) {
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
        credentials: "include", // Essential for sending the session cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), country: country.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        // If profile update fails (e.g., still 401 if the cookie expired), show error
        setError(json?.error || "Failed to update profile. Please try logging in again.");
        setLoading(false);
        return;
      }
      // *** ONBOARDING SUCCESS REDIRECTION ***
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
      setTimeout(() => setInfo(""), 4000);
    }
  }

  return (
    // ... (omitted UI elements for brevity) ...
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl p-8 sm:p-10 transition-all duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
          Complete your profile
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          We need your full name and country to set up your account.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <label className="block space-y-2">
            <div className="text-sm font-medium text-gray-700">Full name</div>
            <input
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </label>

          <label className="block space-y-2">
            <div className="text-sm font-medium text-gray-700">Country</div>
            <input
              list="country-list"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onBlur={onCountryBlur}
              placeholder="India"
              required
            />
            <datalist id="country-list">
              {COUNTRIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          {info && (
            <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
              {info}
            </div>
          )}
          {error && (
            <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              type="submit"
              className={`
                inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 py-2 
                bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                "Save & Continue to Dashboard"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}